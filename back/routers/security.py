from fastapi import APIRouter, HTTPException
import httpx
import re
import base64

from routers.dependancies import get_headers, GITHUB_API

router = APIRouter(prefix="/repo", tags=["Security"])

# --- Secret Patterns ---
SECRET_PATTERNS = {
    "AWS Access Key":       (r'AKIA[0-9A-Z]{16}', "critical"),
    "AWS Secret Key":       (r'(?i)aws_secret_access_key\s*=\s*["\']?([A-Za-z0-9/+=]{40})', "critical"),
    "GitHub Token":         (r'ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82}', "critical"),
    "Stripe Secret Key":    (r'sk_live_[0-9a-zA-Z]{24,}', "critical"),
    "Stripe Publishable":   (r'pk_live_[0-9a-zA-Z]{24,}', "high"),
    "Google API Key":       (r'AIza[0-9A-Za-z\-_]{35}', "critical"),
    "Firebase Key":         (r'AAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}', "critical"),
    "Private Key Block":    (r'-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----', "critical"),
    "Generic Secret":       (r'(?i)(secret|password|passwd|pwd)\s*[:=]\s*["\']([^\s"\']{8,})["\']', "high"),
    "Generic API Key":      (r'(?i)(api_key|apikey|api[-_]key)\s*[:=]\s*["\']([^\s"\']{8,})["\']', "high"),
    "Bearer Token":         (r'(?i)bearer\s+[A-Za-z0-9\-._~+/]{20,}=*', "high"),
    "Database URL":         (r'(?i)(mongodb|postgres|mysql|redis):\/\/[^\s"\']+:[^\s"\']+@', "critical"),
    "Slack Token":          (r'xox[baprs]-[0-9A-Za-z]{10,}', "critical"),
    "Twilio Key":           (r'SK[0-9a-fA-F]{32}', "high"),
    "SendGrid Key":         (r'SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}', "critical"),
    "JWT Token":            (r'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}', "medium"),
    "Hardcoded Password":   (r'(?i)password\s*=\s*["\'][^"\']{4,}["\']', "high"),
    "NPM Token":            (r'npm_[A-Za-z0-9]{36}', "critical"),
    "Mailgun API Key":      (r'key-[0-9a-zA-Z]{32}', "high"),
    "Twilio Account SID":   (r'AC[a-zA-Z0-9]{32}', "high"),
}

SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", "vendor", "__pycache__", ".venv"}
SKIP_EXTENSIONS = {".lock", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
                   ".woff", ".woff2", ".ttf", ".eot", ".pdf", ".zip", ".tar", ".gz"}

HIGH_PRIORITY_NAMES = {".env", ".env.local", ".env.production", ".env.development",
                       ".env.staging", "config.js", "config.ts", "config.py",
                       "settings.py", "application.yml", "application.yaml",
                       "secrets.yml", "secrets.yaml", "credentials.json"}
HIGH_PRIORITY_EXTENSIONS = {".pem", ".key", ".p12", ".pfx", ".cer"}

MAX_FILE_SIZE = 500_000
MAX_FILES_TO_SCAN = 250


def mask_secret(value: str) -> str:
    if len(value) <= 8:
        return "****"
    return value[:4] + "*" * (len(value) - 8) + value[-4:]


def should_skip(path: str) -> bool:
    for part in path.split("/")[:-1]:
        if part in SKIP_DIRS:
            return True
    for ext in SKIP_EXTENSIONS:
        if path.endswith(ext):
            return True
    return False


def is_high_priority(path: str) -> bool:
    filename = path.split("/")[-1].lower()
    ext = "." + filename.rsplit(".", 1)[-1] if "." in filename else ""
    return filename in HIGH_PRIORITY_NAMES or ext in HIGH_PRIORITY_EXTENSIONS


def scan_content(content: str, filepath: str) -> list:
    findings = []
    for line_num, line in enumerate(content.splitlines(), start=1):
        for secret_type, (pattern, severity) in SECRET_PATTERNS.items():
            matches = re.findall(pattern, line)
            if matches:
                raw = matches[0]
                
                if isinstance(raw, tuple):
                    raw = raw[-1]
                findings.append({
                    "file": filepath,
                    "line": line_num,
                    "type": secret_type,
                    "severity": severity,
                    "match": mask_secret(raw),
                })
    return findings


@router.get("/{owner}/{repo}/security")
async def scan_repo_secrets(owner: str, repo: str):
    """
    Scan a GitHub repository for hardcoded secrets, API keys, tokens, and credentials.
    """
    async with httpx.AsyncClient(timeout=30) as client:
 
        tree_res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/HEAD?recursive=1",
            headers=get_headers(),
        )
        if tree_res.status_code != 200:
            raise HTTPException(status_code=tree_res.status_code, detail="Could not fetch repo tree")

        tree = tree_res.json().get("tree", [])

      
        all_files = [
            f for f in tree
            if f["type"] == "blob"
            and not should_skip(f["path"])
            and f.get("size", 0) < MAX_FILE_SIZE
        ]

    
        all_files.sort(key=lambda f: 0 if is_high_priority(f["path"]) else 1)

        files_to_scan = all_files[:MAX_FILES_TO_SCAN]
        skipped_count = len(all_files) - len(files_to_scan)

   
        env_files_found = [
            f["path"] for f in tree
            if f["path"].split("/")[-1].startswith(".env")
        ]
 
        all_findings = []
        scanned_count = 0

        for file in files_to_scan:
            file_res = await client.get(
                f"{GITHUB_API}/repos/{owner}/{repo}/contents/{file['path']}",
                headers=get_headers(),
            )
            scanned_count += 1

            if file_res.status_code != 200:
                continue

            file_data = file_res.json()
            raw_content = file_data.get("content", "")

            if file_data.get("encoding") == "base64":
                try:
                    content = base64.b64decode(raw_content).decode("utf-8", errors="ignore")
                except Exception:
                    continue
            else:
                content = raw_content

            all_findings.extend(scan_content(content, file["path"]))

     
        grouped: dict = {"critical": [], "high": [], "medium": []}
        for finding in all_findings:
            grouped[finding["severity"]].append(finding)

        total = len(all_findings)
        risk_level = (
            "critical" if grouped["critical"] else
            "high" if grouped["high"] else
            "medium" if grouped["medium"] else
            "clean"
        )

        return {
            "summary": {
                "total_findings": total,
                "risk_level": risk_level,
                "critical": len(grouped["critical"]),
                "high": len(grouped["high"]),
                "medium": len(grouped["medium"]),
                "files_scanned": scanned_count,
                "files_skipped": skipped_count,
                "env_files_detected": env_files_found,
            },
            "findings": {
                "critical": grouped["critical"],
                "high": grouped["high"],
                "medium": grouped["medium"],
            },
        }



