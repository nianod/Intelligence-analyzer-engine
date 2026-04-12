# Project Analyzer

A full-stack developer tool that gives you instant, multi-dimensional analysis of any GitHub repository or live website. Get security scans, tech stack detection, performance metrics, SEO insights, and repo intelligence — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Architecture](#frontend-architecture)
- [How Each Feature Works](#how-each-feature-works)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

Project Analyzer is built for developers, recruiters, and tech leads who want to evaluate a codebase or website quickly without manual inspection. Paste a GitHub URL or a live website URL and get back a structured, categorized report in seconds.

There are two modes:

- **Repository URL** — deep analysis using the GitHub API. Fetches file trees, reads manifest files, scans for secrets, and detects the full tech stack.
- **Live Link** — surface-level analysis by fetching the live page. Returns performance timing, SEO metadata, security headers, asset counts, and tech fingerprinting.

---

## Features

### Repository Analysis
| Feature | Description |
|---|---|
| **Repo Details** | Stars, forks, watchers, open issues, size, owner info, license, topics, dates |
| **Security Scan** | Detects hardcoded API keys, tokens, private keys, database URLs, and 20+ secret patterns across up to 250 files |
| **Tech Stack Detection** | Parses `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `Gemfile` and 15+ config files to identify frameworks, ORMs, auth libraries, testing tools, and DevOps setup |
| **Language Breakdown** | Language distribution by bytes with percentage, pulled from the GitHub Languages API |

### Live Link Analysis
| Feature | Description |
|---|---|
| **Performance** | Load time (ms), page size (KB), HTTP status code, redirect count, HTTPS check |
| **SEO** | Title, meta description, H1 count, Open Graph tags, canonical URL, robots meta, missing alt texts |
| **Security Headers** | Checks for HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **Assets** | Count of scripts, stylesheets, and images on the page |
| **Tech Hints** | Server header detection, framework fingerprinting from HTML patterns |

---

## Tech Stack

### Backend
- **FastAPI** — async Python API framework
- **httpx** — async HTTP client for GitHub API and live URL fetching
- **BeautifulSoup4** — HTML parsing for live link analysis
- **python-dotenv** — environment variable management
- **uvicorn** — ASGI server

### Frontend
- **Next.js 16** (App Router) — React framework
- **TypeScript** — type safety throughout
- **Tailwind CSS** — utility-first styling
- **Lucide React** — icon library

---

## Project Structure

```
project-analyzer/
│
├── backend/
│   ├── main.py                  # FastAPI app, middleware, router registration
│   ├── .env                     # Environment variables (never commit this)
│   ├── requirements.txt
│   └── routers/
│       ├── __init__.py
│       ├── dependencies.py      # Shared get_headers() + GITHUB_API constant
│       ├── repo.py              # GET /repo/{owner}/{repo} and related endpoints
│       ├── security.py          # GET /repo/{owner}/{repo}/security
│       ├── techstack.py         # GET /repo/{owner}/{repo}/techstack
│       └── live.py              # GET /live/analyze?url=...
│
└── frontend/
    ├── app/
    │   ├── page.tsx             # Landing page
    │   └── analyse/
    │       └── page.tsx         # Main analyze page
    ├── components/
    │   ├── RepoDetails.tsx      # Repo stats, owner, topics, metadata
    │   ├── Security.tsx         # Security findings grouped by severity
    │   ├── TechStack.tsx        # Language bar + categorized stack tags
    │   └── Performance.tsx      # Live link results
    ├── hooks/
    │   ├── useRepo.ts
    │   ├── useSecurity.ts
    │   ├── useTechStack.ts
    │   └── useLive.ts
    └── lib/
        ├── github.ts            # fetchRepoDetails()
        ├── security.ts          # fetchSecurityScan()
        ├── techstack.ts         # fetchTechStack()
        └── live.ts              # fetchLiveAnalysis()
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A GitHub Personal Access Token (PAT)

To generate a GitHub PAT:
1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Generate a new token with the `public_repo` scope
3. Copy the token — you'll need it for the `.env` file

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install fastapi httpx uvicorn python-dotenv beautifulsoup4

# 4. Create your .env file
cp .env.example .env
# Then add your GitHub token (see Environment Variables section)

# 5. Start the server
uvicorn main:app --reload
```

The API will be running at `http://127.0.0.1:8000`.
Interactive docs available at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The frontend will be running at `http://localhost:3000`.

---

## Environment Variables

### Backend — `backend/.env`

```env
GITHUB_TOKEN=ghp_yourpersonalaccesstokenhere
```

> **Important:** Never commit your `.env` file. It is already in `.gitignore`.
> Rotate your token immediately if it is ever accidentally pushed to a public repo.

---

## API Reference

All endpoints are prefixed with `http://127.0.0.1:8000`. The GitHub token is read from the server's `.env` — no token is needed in requests from the frontend.

---

### `GET /`
Health check.

**Response:**
```json
{ "message": "Hello from FastAPI" }
```

---

### `GET /repo/{owner}/{repo}`
Fetch general repository information.

**Path params:** `owner` (string), `repo` (string)

**Response:**
```json
{
  "name": "next.js",
  "full_name": "vercel/next.js",
  "description": "The React Framework",
  "stars": 120000,
  "forks": 25000,
  "language": "TypeScript",
  "topics": ["react", "nextjs", "framework"],
  "owner": { "username": "vercel", "avatar": "...", "type": "Organization" },
  "license": "MIT",
  "default_branch": "canary"
}
```

---

### `GET /repo/{owner}/{repo}/security`
Scan the repository for hardcoded secrets, API keys, tokens, and credentials.

**Path params:** `owner`, `repo`

**What it scans for:**
- AWS Access Keys & Secret Keys
- GitHub Tokens (`ghp_*`, `github_pat_*`)
- Stripe, Google, Firebase, Slack, Twilio, SendGrid, NPM keys
- Private key blocks (`-----BEGIN PRIVATE KEY-----`)
- Database URLs (Postgres, MongoDB, MySQL, Redis)
- Generic `api_key=`, `password=`, `secret=` patterns
- JWT tokens
- Bearer tokens

**Scan limits:** Up to 250 files, max 500KB per file. Skips `node_modules`, `dist`, `.git`, images, and lock files. High-priority files (`.env*`, `*.pem`, `config.*`) are scanned first.

**Response:**
```json
{
  "summary": {
    "total_findings": 3,
    "risk_level": "critical",
    "critical": 2,
    "high": 1,
    "medium": 0,
    "files_scanned": 187,
    "files_skipped": 12,
    "env_files_detected": [".env", ".env.local"]
  },
  "findings": {
    "critical": [
      {
        "file": "config/database.js",
        "line": 14,
        "type": "Database URL",
        "severity": "critical",
        "match": "post****@db.example.com"
      }
    ],
    "high": [],
    "medium": []
  }
}
```

> All matched values are **masked** in the response (first 4 + last 4 chars shown). The API never returns the actual secret value.

---

### `GET /repo/{owner}/{repo}/techstack`
Detect the full technology stack from manifest and config files.

**Path params:** `owner`, `repo`

**Files read:**
- `package.json` — 60+ JS/TS dependency signals
- `requirements.txt` / `pyproject.toml` — Python stack
- `go.mod` — Go + Gin/Fiber/Echo
- `Cargo.toml` — Rust + Actix/Axum/Rocket
- `Gemfile` — Ruby/Rails
- Config file presence: `next.config.js`, `tailwind.config.js`, `Dockerfile`, `prisma/schema.prisma`, `.eslintrc`, etc.

**Response:**
```json
{
  "runtime": "Node.js",
  "package_manager": "pnpm",
  "languages": [
    { "name": "TypeScript", "bytes": 45200, "percentage": 73.1 },
    { "name": "CSS", "bytes": 9800, "percentage": 15.8 }
  ],
  "stack": {
    "frameworks": ["Next.js", "React"],
    "styling": ["Tailwind CSS"],
    "database": ["Prisma", "PostgreSQL"],
    "auth": ["NextAuth.js"],
    "testing": ["Vitest", "Playwright"],
    "tooling": ["ESLint", "Prettier"],
    "devops": ["Docker", "GitHub Actions"]
  },
  "total_detected": 11
}
```

---

### `GET /live/analyze?url={url}`
Analyze a live website URL.

**Query params:** `url` (full URL including `https://`)

**Response:**
```json
{
  "performance": {
    "load_time_ms": 342,
    "status_code": 200,
    "page_size_kb": 128.4,
    "redirect_count": 1,
    "final_url": "https://www.example.com/",
    "is_https": true
  },
  "assets": {
    "total_scripts": 12,
    "total_stylesheets": 3,
    "total_images": 8
  },
  "seo": {
    "title": "Example Domain",
    "title_length": 14,
    "meta_description": "An example website",
    "h1_count": 1,
    "og_title": "Example Domain",
    "images_missing_alt": 2
  },
  "security_headers": {
    "Strict-Transport-Security (HSTS)": { "present": true, "value": "max-age=31536000" },
    "Content-Security-Policy": { "present": false, "value": null }
  },
  "tech_stack": ["Cloudflare", "Next.js", "Tailwind CSS"],
  "meta": {
    "has_viewport": true,
    "server": "cloudflare",
    "cache_control": "public, max-age=3600"
  }
}
```

---

## Frontend Architecture

Each feature follows the same three-layer pattern:

```
lib/feature.ts          → raw fetch function (calls the API)
hooks/useFeature.ts     → React hook (manages loading/error/data state)
components/Feature.tsx  → UI component (renders the data)
```

All hooks expose `{ data, loading, error, analyze }`. The `analyze` function is called from `handleAnalyze` in `analyze.tsx`, with all repo analyses running in parallel via `Promise.all`.

Results are displayed in an accordion for repo analysis, and rendered directly (no accordion) for live link analysis.

---

## Roadmap

- [ ] **Vibe Coding Score** — proprietary 0–100 score measuring code organization, file sizes, duplication, and consistency
- [ ] **Architecture Analysis** — monolith vs microservices inference, folder structure evaluation
- [ ] **Documentation & Tests** — README quality scoring, test coverage estimation, testing framework detection
- [ ] **Hireability Score** — recruiter-friendly metric combining all analysis dimensions
- [ ] **PDF Report Export** — downloadable full report
- [ ] **Share Report** — public shareable report links

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure new API endpoints follow the existing router pattern and include proper error handling. Frontend components should follow the `lib → hook → component` pattern.

---

## License

MIT License — see `LICENSE` for details.

---

> Developed by Arnold