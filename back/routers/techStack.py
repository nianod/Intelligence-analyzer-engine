from fastapi import APIRouter, HTTPException
import httpx
import json
import base64
from routers.dependancies import get_headers, GITHUB_API

router = APIRouter(prefix="/repo", tags=["Tech Stack"])

#  Framework signals  
FRAMEWORK_SIGNALS = {
    # Frontend frameworks
    "next":                 ("Next.js", "framework"),
    "react":                ("React", "framework"),
    "react-dom":            ("React", "framework"),
    "vue":                  ("Vue.js", "framework"),
    "nuxt":                 ("Nuxt.js", "framework"),
    "@nuxtjs/nuxt":         ("Nuxt.js", "framework"),
    "svelte":               ("Svelte", "framework"),
    "@sveltejs/kit":        ("SvelteKit", "framework"),
    "@angular/core":        ("Angular", "framework"),
    "astro":                ("Astro", "framework"),
    "@remix-run/react":     ("Remix", "framework"),
    "@remix-run/node":      ("Remix", "framework"),
    "gatsby":               ("Gatsby", "framework"),
    "solid-js":             ("SolidJS", "framework"),
    "qwik":                 ("Qwik", "framework"),

    # Backend 
    "express":              ("Express.js", "backend"),
    "fastify":              ("Fastify", "backend"),
    "@nestjs/core":         ("NestJS", "backend"),
    "hono":                 ("Hono", "backend"),
    "koa":                  ("Koa", "backend"),
    "elysia":               ("Elysia", "backend"),

    #  Styling
    "tailwindcss":          ("Tailwind CSS", "styling"),
    "bootstrap":            ("Bootstrap", "styling"),
    "sass":                 ("Sass/SCSS", "styling"),
    "styled-components":    ("Styled Components", "styling"),
    "@emotion/react":       ("Emotion", "styling"),
    "stitches":             ("Stitches", "styling"),
    "unocss":               ("UnoCSS", "styling"),

    # UI  
    "@shadcn/ui":           ("shadcn/ui", "ui"),
    "@radix-ui/react-dialog": ("Radix UI", "ui"),
    "@headlessui/react":    ("Headless UI", "ui"),
    "@mui/material":        ("Material UI", "ui"),
    "antd":                 ("Ant Design", "ui"),
    "chakra-ui":            ("Chakra UI", "ui"),
    "@chakra-ui/react":     ("Chakra UI", "ui"),
    "daisyui":              ("DaisyUI", "ui"),

    #  Database
    "prisma":               ("Prisma", "database"),
    "@prisma/client":       ("Prisma", "database"),
    "drizzle-orm":          ("Drizzle ORM", "database"),
    "mongoose":             ("Mongoose (MongoDB)", "database"),
    "typeorm":              ("TypeORM", "database"),
    "sequelize":            ("Sequelize", "database"),
    "pg":                   ("PostgreSQL", "database"),
    "mysql2":               ("MySQL", "database"),
    "better-sqlite3":       ("SQLite", "database"),
    "redis":                ("Redis", "database"),
    "ioredis":              ("Redis", "database"),

    # Auth
    "next-auth":            ("NextAuth.js", "auth"),
    "next-auth/react":      ("NextAuth.js", "auth"),
    "@auth/core":           ("Auth.js", "auth"),
    "passport":             ("Passport.js", "auth"),
    "@clerk/nextjs":        ("Clerk", "auth"),
    "@clerk/clerk-sdk-node": ("Clerk", "auth"),
    "lucia":                ("Lucia Auth", "auth"),
    "jsonwebtoken":         ("JWT", "auth"),
    "jose":                 ("JOSE/JWT", "auth"),

    # State management
    "zustand":              ("Zustand", "state"),
    "redux":                ("Redux", "state"),
    "@reduxjs/toolkit":     ("Redux Toolkit", "state"),
    "jotai":                ("Jotai", "state"),
    "recoil":               ("Recoil", "state"),
    "mobx":                 ("MobX", "state"),
    "valtio":               ("Valtio", "state"),

    # Testing
    "jest":                 ("Jest", "testing"),
    "vitest":               ("Vitest", "testing"),
    "cypress":              ("Cypress", "testing"),
    "@playwright/test":     ("Playwright", "testing"),
    "mocha":                ("Mocha", "testing"),
    "chai":                 ("Chai", "testing"),
    "@testing-library/react": ("React Testing Library", "testing"),

    # Build tools
    "vite":                 ("Vite", "tooling"),
    "webpack":              ("Webpack", "tooling"),
    "turbopack":            ("Turbopack", "tooling"),
    "esbuild":              ("esbuild", "tooling"),
    "rollup":               ("Rollup", "tooling"),
    "parcel":               ("Parcel", "tooling"),
    "tsup":                 ("tsup", "tooling"),

    # API  
    "axios":                ("Axios", "tooling"),
    "@tanstack/react-query": ("TanStack Query", "tooling"),
    "swr":                  ("SWR", "tooling"),
    "graphql":              ("GraphQL", "tooling"),
    "@apollo/client":       ("Apollo Client", "tooling"),
    "trpc":                 ("tRPC", "tooling"),
    "@trpc/server":         ("tRPC", "tooling"),

    # DevOps 
    "docker":               ("Docker", "devops"),
}

# Python package signals
PYTHON_SIGNALS = {
    "django":               ("Django", "framework"),
    "flask":                ("Flask", "framework"),
    "fastapi":              ("FastAPI", "framework"),
    "tornado":              ("Tornado", "framework"),
    "starlette":            ("Starlette", "framework"),
    "sqlalchemy":           ("SQLAlchemy", "database"),
    "alembic":              ("Alembic", "database"),
    "celery":               ("Celery", "tooling"),
    "redis":                ("Redis", "database"),
    "pytest":               ("pytest", "testing"),
    "pydantic":             ("Pydantic", "tooling"),
    "httpx":                ("HTTPX", "tooling"),
    "requests":             ("Requests", "tooling"),
    "pandas":               ("Pandas", "tooling"),
    "numpy":                ("NumPy", "tooling"),
    "tensorflow":           ("TensorFlow", "tooling"),
    "torch":                ("PyTorch", "tooling"),
    "scikit-learn":         ("scikit-learn", "tooling"),
}

 
CONFIG_FILE_SIGNALS = {
    "next.config.js":           ("Next.js", "framework"),
    "next.config.ts":           ("Next.js", "framework"),
    "vite.config.ts":           ("Vite", "tooling"),
    "vite.config.js":           ("Vite", "tooling"),
    "tailwind.config.js":       ("Tailwind CSS", "styling"),
    "tailwind.config.ts":       ("Tailwind CSS", "styling"),
    "docker-compose.yml":       ("Docker", "devops"),
    "docker-compose.yaml":      ("Docker", "devops"),
    "Dockerfile":               ("Docker", "devops"),
    ".eslintrc":                ("ESLint", "tooling"),
    ".eslintrc.js":             ("ESLint", "tooling"),
    ".eslintrc.json":           ("ESLint", "tooling"),
    "eslint.config.js":         ("ESLint", "tooling"),
    "prettier.config.js":       ("Prettier", "tooling"),
    ".prettierrc":              ("Prettier", "tooling"),
    "jest.config.js":           ("Jest", "testing"),
    "jest.config.ts":           ("Jest", "testing"),
    "vitest.config.ts":         ("Vitest", "testing"),
    "prisma/schema.prisma":     ("Prisma", "database"),
    "drizzle.config.ts":        ("Drizzle ORM", "database"),
    "turbo.json":               ("Turborepo", "tooling"),
    ".github/workflows":        ("GitHub Actions", "devops"),
    "kubernetes":               ("Kubernetes", "devops"),
    "k8s":                      ("Kubernetes", "devops"),
}


async def fetch_file_content(client: httpx.AsyncClient, owner: str, repo: str, path: str) -> str | None:
    res = await client.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}",
        headers=get_headers()
    )
    if res.status_code != 200:
        return None
    data = res.json()
    if data.get("encoding") == "base64":
        try:
            return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
        except Exception:
            return None
    return data.get("content")


def parse_package_json(content: str) -> dict:
    try:
        pkg = json.loads(content)
    except json.JSONDecodeError:
        return {}

    all_deps = {}
    all_deps.update(pkg.get("dependencies", {}))
    all_deps.update(pkg.get("devDependencies", {}))

    detected = {}
    for dep_name in all_deps:
        dep_lower = dep_name.lower()
        if dep_lower in FRAMEWORK_SIGNALS:
            label, category = FRAMEWORK_SIGNALS[dep_lower]
            detected[label] = category

 
    runtime = "Node.js"
    if "bun" in pkg.get("scripts", {}).get("dev", ""):
        runtime = "Bun"
    elif pkg.get("engines", {}).get("bun"):
        runtime = "Bun"

    return {"detected": detected, "runtime": runtime, "name": pkg.get("name"), "version": pkg.get("version")}


def parse_requirements_txt(content: str) -> dict:
    detected = {}
    for line in content.splitlines():
        line = line.strip().lower()
        if not line or line.startswith("#"):
            continue
      
        pkg_name = line.split("==")[0].split(">=")[0].split("<=")[0].split("~=")[0].strip()
        if pkg_name in PYTHON_SIGNALS:
            label, category = PYTHON_SIGNALS[pkg_name]
            detected[label] = category
    return {"detected": detected, "runtime": "Python"}


def parse_pyproject_toml(content: str) -> dict:
    detected = {}
    for line in content.splitlines():
        line = line.strip().lower()
        for pkg_name, (label, category) in PYTHON_SIGNALS.items():
            if pkg_name in line:
                detected[label] = category
    return {"detected": detected, "runtime": "Python"}


def detect_package_manager(file_paths: list[str]) -> str:
    filenames = {f.split("/")[-1] for f in file_paths}
    if "bun.lockb" in filenames:        return "bun"
    if "pnpm-lock.yaml" in filenames:   return "pnpm"
    if "yarn.lock" in filenames:        return "yarn"
    if "package-lock.json" in filenames: return "npm"
    return "unknown"


@router.get("/{owner}/{repo}/techstack")
async def detect_tech_stack(owner: str, repo: str):
    """
    Detect tech stack from manifest files and config files in the repository.
    """
    async with httpx.AsyncClient(timeout=20) as client:

 
        tree_res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/HEAD?recursive=1",
            headers=get_headers()
        )
        if tree_res.status_code != 200:
            raise HTTPException(status_code=tree_res.status_code, detail="Could not fetch repo tree")

        all_paths = {f["path"] for f in tree_res.json().get("tree", []) if f["type"] == "blob"}
        dir_paths = {f["path"] for f in tree_res.json().get("tree", [])}

 
        package_manager = detect_package_manager(list(all_paths))

 
        detected_all = {}
        runtime = "Unknown"

  
        if "package.json" in all_paths:
            content = await fetch_file_content(client, owner, repo, "package.json")
            if content:
                result = parse_package_json(content)
                detected_all.update(result.get("detected", {}))
                runtime = result.get("runtime", runtime)

 
        if "requirements.txt" in all_paths:
            content = await fetch_file_content(client, owner, repo, "requirements.txt")
            if content:
                result = parse_requirements_txt(content)
                detected_all.update(result.get("detected", {}))
                runtime = result.get("runtime", runtime)

  
        if "pyproject.toml" in all_paths:
            content = await fetch_file_content(client, owner, repo, "pyproject.toml")
            if content:
                result = parse_pyproject_toml(content)
                detected_all.update(result.get("detected", {}))
                runtime = result.get("runtime", runtime)

 
        if "Gemfile" in all_paths:
            content = await fetch_file_content(client, owner, repo, "Gemfile")
            if content and "rails" in content.lower():
                detected_all["Ruby on Rails"] = "framework"
            runtime = "Ruby"

 
        if "go.mod" in all_paths:
            runtime = "Go"
            content = await fetch_file_content(client, owner, repo, "go.mod")
            if content:
                if "gin-gonic/gin" in content:     detected_all["Gin"] = "framework"
                if "gofiber/fiber" in content:     detected_all["Fiber"] = "framework"
                if "labstack/echo" in content:     detected_all["Echo"] = "framework"

     
        if "Cargo.toml" in all_paths:
            runtime = "Rust"
            content = await fetch_file_content(client, owner, repo, "Cargo.toml")
            if content:
                if "actix-web" in content:   detected_all["Actix Web"] = "framework"
                if "axum" in content:        detected_all["Axum"] = "framework"
                if "rocket" in content:      detected_all["Rocket"] = "framework"

 
        for config_path, (label, category) in CONFIG_FILE_SIGNALS.items():
            if config_path in all_paths or config_path in dir_paths:
                detected_all[label] = category

 
        lang_res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/languages",
            headers=get_headers()
        )
        languages = []
        if lang_res.status_code == 200:
            lang_data = lang_res.json()
            total_bytes = sum(lang_data.values())
            languages = [
                {
                    "name": lang,
                    "bytes": bytes_count,
                    "percentage": round((bytes_count / total_bytes) * 100, 1)
                }
                for lang, bytes_count in sorted(lang_data.items(), key=lambda x: x[1], reverse=True)
            ]

 
        grouped: dict = {
            "frameworks": [],
            "backend": [],
            "styling": [],
            "ui": [],
            "database": [],
            "auth": [],
            "state": [],
            "testing": [],
            "tooling": [],
            "devops": [],
        }
        for label, category in detected_all.items():
            if category in grouped:
                if label not in grouped[category]:
                    grouped[category].append(label)

        return {
            "runtime": runtime,
            "package_manager": package_manager,
            "languages": languages,
            "stack": grouped,
            "total_detected": sum(len(v) for v in grouped.values()),
        }