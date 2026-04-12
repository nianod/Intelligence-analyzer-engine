from fastapi import APIRouter, HTTPException
import httpx
import time
from bs4 import BeautifulSoup
from urllib.parse import urlparse

router = APIRouter(prefix="/live", tags=["Live Link"])


def detect_tech(html: str, headers: dict) -> list[str]:
    tech = []

    
    server = headers.get("server", "").lower()
    powered_by = headers.get("x-powered-by", "").lower()
    if "nginx" in server:        tech.append("Nginx")
    if "apache" in server:       tech.append("Apache")
    if "cloudflare" in server:   tech.append("Cloudflare")
    if "php" in powered_by:      tech.append("PHP")
    if "express" in powered_by:  tech.append("Express.js")
    if "next.js" in powered_by:  tech.append("Next.js")

 
    if "__next" in html or "_next/static" in html:   tech.append("Next.js")
    if "data-reactroot" in html or "react" in html.lower()[:2000]: tech.append("React")
    if "ng-version" in html or "angular" in html.lower()[:2000]:   tech.append("Angular")
    if "data-svelte" in html or "__svelte" in html:  tech.append("Svelte")
    if "wp-content" in html or "wp-includes" in html: tech.append("WordPress")
    if "shopify" in html.lower()[:2000]:             tech.append("Shopify")
    if "gatsby" in html.lower()[:2000]:              tech.append("Gatsby")

 
    if "tailwind" in html.lower()[:5000]:            tech.append("Tailwind CSS")
    if "bootstrap" in html.lower()[:5000]:           tech.append("Bootstrap")

  
    if "google-analytics" in html or "gtag" in html: tech.append("Google Analytics")
    if "hotjar" in html:                              tech.append("Hotjar")

    return list(set(tech))  # deduplicate


def parse_seo(soup: BeautifulSoup) -> dict:
    title_tag = soup.find("title")
    meta_desc = soup.find("meta", attrs={"name": "description"})
    h1_tags = soup.find_all("h1")
    canonical = soup.find("link", attrs={"rel": "canonical"})
    og_title = soup.find("meta", attrs={"property": "og:title"})
    og_desc = soup.find("meta", attrs={"property": "og:description"})
    og_image = soup.find("meta", attrs={"property": "og:image"})
    robots = soup.find("meta", attrs={"name": "robots"})
    lang = soup.find("html")

    images = soup.find_all("img")
    images_missing_alt = sum(1 for img in images if not img.get("alt"))

    return {
        "title": title_tag.text.strip() if title_tag else None,
        "title_length": len(title_tag.text.strip()) if title_tag else 0,
        "meta_description": meta_desc["content"].strip() if meta_desc and meta_desc.get("content") else None,
        "meta_description_length": len(meta_desc["content"].strip()) if meta_desc and meta_desc.get("content") else 0,
        "h1_count": len(h1_tags),
        "h1_text": h1_tags[0].text.strip() if h1_tags else None,
        "canonical_url": canonical["href"] if canonical and canonical.get("href") else None,
        "og_title": og_title["content"] if og_title and og_title.get("content") else None,
        "og_description": og_desc["content"] if og_desc and og_desc.get("content") else None,
        "og_image": og_image["content"] if og_image and og_image.get("content") else None,
        "robots": robots["content"] if robots and robots.get("content") else None,
        "lang": lang.get("lang") if lang else None,
        "total_images": len(images),
        "images_missing_alt": images_missing_alt,
    }


def parse_security_headers(headers: dict) -> dict:
    checks = {
        "Strict-Transport-Security (HSTS)": "strict-transport-security",
        "Content-Security-Policy":          "content-security-policy",
        "X-Frame-Options":                  "x-frame-options",
        "X-Content-Type-Options":           "x-content-type-options",
        "Referrer-Policy":                  "referrer-policy",
        "Permissions-Policy":               "permissions-policy",
    }
    result = {}
    for label, key in checks.items():
        result[label] = {
            "present": key in headers,
            "value": headers.get(key),
        }
    return result


@router.get("/analyze")
async def analyze_live_url(url: str):
    """
    Analyze a live website URL for performance, SEO, security headers and tech stack.
    """
 
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise HTTPException(status_code=400, detail="Invalid URL. Must start with http:// or https://")

    is_https = parsed.scheme == "https"

    try:
        start = time.time()
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=15,
            headers={"User-Agent": "Mozilla/5.0 (compatible; ProjectAnalyzer/1.0)"}
        ) as client:
            res = await client.get(url)
        load_time_ms = round((time.time() - start) * 1000)

    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timed out. The site took too long to respond.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=400, detail=f"Could not reach the URL: {str(e)}")

    html = res.text
    headers = dict(res.headers)
    content_length = len(res.content)  # bytes

    
    final_url = str(res.url)
    redirect_count = len(res.history)

 
    soup = BeautifulSoup(html, "html.parser")

 
    scripts = soup.find_all("script", src=True)
    stylesheets = soup.find_all("link", rel="stylesheet")
    images = soup.find_all("img")

    # Viewport
    viewport = soup.find("meta", attrs={"name": "viewport"})

    return {
        "performance": {
            "load_time_ms": load_time_ms,
            "status_code": res.status_code,
            "page_size_bytes": content_length,
            "page_size_kb": round(content_length / 1024, 2),
            "redirect_count": redirect_count,
            "final_url": final_url,
            "is_https": is_https,
        },
        "assets": {
            "total_scripts": len(scripts),
            "total_stylesheets": len(stylesheets),
            "total_images": len(images),
        },
        "seo": parse_seo(soup),
        "security_headers": parse_security_headers(headers),
        "tech_stack": detect_tech(html, headers),
        "meta": {
            "has_viewport": viewport is not None,
            "content_type": headers.get("content-type"),
            "server": headers.get("server"),
            "cache_control": headers.get("cache-control"),
        }
    }


