
import base64
import json
from collections import Counter, defaultdict

import httpx
from fastapi import APIRouter, HTTPException
from routers.dependancies import GITHUB_API, get_headers


router = APIRouter()

IGNORED_DIRS = {
    "node_modules", "dist", "build", ".git", ".next", ".nuxt", "out", "target",
    "venv", ".venv", "env", "__pycache__", ".idea", ".vscode", "vendor",
    "coverage", ".cache", ".turbo", "bin", "obj", ".gradle", "site-packages",
}

MANIFEST_FILES = {
    "package.json", "requirements.txt", "pyproject.toml", "setup.py", "go.mod",
    "Cargo.toml", "pom.xml", "build.gradle", "build.gradle.kts", "Gemfile",
    "composer.json", "mix.exs",
}

SOURCE_DIRS = {
    "src", "app", "lib", "packages", "apps", "cmd", "pkg", "internal",
    "backend", "frontend", "server", "client", "api", "web", "services",
}

TEST_DIRS = {"test", "tests", "__tests__", "spec", "specs", "e2e", "cypress"}

MONOREPO_FILES = {"pnpm-workspace.yaml", "lerna.json", "nx.json", "turbo.json", "rush.json"}

SPLIT_PAIRS = [
    ("frontend", "backend"),
    ("client", "server"),
    ("web", "api"),
    ("ui", "api"),
    ("frontend", "api"),
    ("client", "api"),
    ("web", "server"),
]



# GitHub helpe

async def _fetch_repo_and_tree(owner: str, repo: str):
    async with httpx.AsyncClient(timeout=25.0) as client:
        repo_res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}", headers=get_headers()
        )
        _raise_for_github(repo_res)
        repo_data = repo_res.json()
        branch = repo_data.get("default_branch", "main")

        tree_res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/{branch}",
            params={"recursive": "1"},
            headers=get_headers(),
        )
        if tree_res.status_code == 409:
            raise HTTPException(status_code=422, detail="Repository is empty")
        _raise_for_github(tree_res)
        tree_data = tree_res.json()

        root_files = {
            i["path"] for i in tree_data.get("tree", [])
            if i["type"] == "blob" and "/" not in i["path"]
        }

        pkg_json = None
        if "package.json" in root_files:
            pkg_res = await client.get(
                f"{GITHUB_API}/repos/{owner}/{repo}/contents/package.json",
                params={"ref": branch},
                headers=get_headers(),
            )
            if pkg_res.status_code == 200:
                try:
                    raw = base64.b64decode(pkg_res.json().get("content", ""))
                    pkg_json = json.loads(raw)
                except (ValueError, json.JSONDecodeError):
                    pkg_json = None

    return repo_data, tree_data, pkg_json


def _raise_for_github(res: httpx.Response):
    if res.status_code == 404:
        raise HTTPException(status_code=404, detail="Repository not found")
    if res.status_code in (401, 403):
        if res.headers.get("x-ratelimit-remaining") == "0":
            raise HTTPException(status_code=429, detail="GitHub API rate limit reached")
        raise HTTPException(status_code=res.status_code, detail="GitHub access denied")
    if res.status_code >= 400:
        raise HTTPException(status_code=res.status_code, detail="GitHub API error")


# Path analysis

def _clean_paths(tree: list) -> list[str]:
    paths = []
    for item in tree:
        if item["type"] != "blob":
            continue
        parts = item["path"].split("/")
        if any(p in IGNORED_DIRS for p in parts[:-1]):
            continue
        paths.append(item["path"])
    return paths


def _dir_names(paths: list[str]) -> set[str]:
    names = set()
    for p in paths:
        for seg in p.split("/")[:-1]:
            names.add(seg.lower())
    return names


def _children_of(paths: list[str], dir_name: str) -> set[str]:
    """Distinct subdirectories directly under any directory called dir_name."""
    kids = set()
    for p in paths:
        parts = p.split("/")
        for i, seg in enumerate(parts[:-2]):
            if seg.lower() == dir_name:
                kids.add("/".join(parts[: i + 2]))
    return kids


def _manifest_dirs(paths: list[str]) -> set[str]:
    dirs = set()
    for p in paths:
        base = p.rsplit("/", 1)[-1]
        if base in MANIFEST_FILES or base.endswith(".csproj"):
            d = p.rsplit("/", 1)[0] if "/" in p else ""
            if d:
                dirs.add(d)
    return dirs


# Architecture type detection

def _detect_type(paths: list[str], top_dirs: set[str], pkg_json: dict | None) -> dict:
    basenames = {p.rsplit("/", 1)[-1] for p in paths}
    manifest_dirs = _manifest_dirs(paths)
    dockerfile_dirs = {
        (p.rsplit("/", 1)[0] if "/" in p else "")
        for p in paths
        if p.rsplit("/", 1)[-1].lower().startswith("dockerfile")
    }

    # Monorepo signals
    mono = []
    for f in sorted(MONOREPO_FILES & basenames):
        mono.append(f"{f} present")
    if pkg_json and pkg_json.get("workspaces"):
        mono.append("package.json defines workspaces")
    for d in ("packages", "apps"):
        kids = {k for k in _children_of(paths, d) if k.count("/") == 1}
        with_manifest = [k for k in kids if any(m.startswith(k) for m in manifest_dirs)]
        if len(with_manifest) >= 2:
            mono.append(f"{len(with_manifest)} packages under {d}/")

    # Microservices signals
    micro = []
    for d in ("services", "microservices"):
        kids = {k for k in _children_of(paths, d) if k.count("/") == 1}
        deployable = [
            k for k in kids
            if any(m.startswith(k) for m in manifest_dirs | dockerfile_dirs)
        ]
        if len(deployable) >= 2:
            micro.append(f"{len(deployable)} deployable services under {d}/")
    if len([d for d in dockerfile_dirs if d]) >= 3:
        micro.append(f"{len(dockerfile_dirs)} Dockerfiles in separate directories")
    if basenames & {"docker-compose.yml", "docker-compose.yaml", "compose.yaml", "compose.yml"}:
        micro.append("docker-compose file present")
    if top_dirs & {"k8s", "kubernetes", "helm", "charts", "deploy", "deployments"}:
        micro.append("Kubernetes/Helm deployment config")

    # Client-server split
    split = [f"{a}/ + {b}/" for a, b in SPLIT_PAIRS if a in top_dirs and b in top_dirs]

    if len(micro) >= 3 or (len(micro) >= 2 and any("services" in m for m in micro)):
        return {"type": "Microservices", "confidence": min(95, 55 + 10 * len(micro)), "signals": micro}
    if len(mono) >= 1 and (len(mono) >= 2 or "packages" in " ".join(mono) or "apps" in " ".join(mono)):
        return {"type": "Monorepo", "confidence": min(95, 55 + 15 * len(mono)), "signals": mono}
    if split:
        return {
            "type": "Client-Server Split (monorepo-style)",
            "confidence": 80,
            "signals": [f"Separate directories: {s}" for s in split],
        }
    return {
        "type": "Monolith",
        "confidence": 65 if not (mono or micro) else 50,
        "signals": ["Single deployable unit, no workspace/service split detected"]
        + mono + micro,
    }



# Layout pattern detection

def _detect_patterns(paths: list[str], dir_names: set[str]) -> list[dict]:
    patterns = []

    def hit(*names):
        return [n for n in names if n in dir_names]

    mvc = hit("models", "views", "controllers", "model", "view", "controller")
    if len(mvc) >= 2:
        patterns.append({"name": "MVC", "evidence": mvc})

    layered = (
        hit("routes", "routers", "api", "handlers")
        + hit("services", "service")
        + hit("repositories", "repository", "repos", "dao")
        + hit("schemas", "entities", "models")
    )
    if len(set(layered)) >= 3:
        patterns.append({"name": "Layered (routes / services / data)", "evidence": sorted(set(layered))})

    for feat_dir in ("features", "modules", "domains"):
        if feat_dir in dir_names and len(_children_of(paths, feat_dir)) >= 2:
            patterns.append({"name": "Feature-based / modular", "evidence": [f"{feat_dir}/"]})
            break

    clean = hit("domain") + hit("application", "usecases", "use_cases") + hit("infrastructure", "adapters", "ports")
    if len(clean) >= 3:
        patterns.append({"name": "Clean / Hexagonal", "evidence": clean})

    ui = hit("components") + hit("hooks", "pages", "app", "views", "composables")
    if "components" in dir_names and len(ui) >= 2:
        patterns.append({"name": "Component-based UI", "evidence": ui})

    if any(p.startswith(("app/", "src/app/")) and p.rsplit("/", 1)[-1].startswith(("page.", "layout.")) for p in paths):
        patterns.append({"name": "Next.js App Router", "evidence": ["app/**/page.*"]})
    elif any(p.startswith(("pages/", "src/pages/")) for p in paths) and "next.config.js" in {p.rsplit("/", 1)[-1] for p in paths}:
        patterns.append({"name": "Next.js Pages Router", "evidence": ["pages/"]})

    if "manage.py" in {p.rsplit("/", 1)[-1] for p in paths} and any(p.endswith("/models.py") for p in paths):
        patterns.append({"name": "Django apps", "evidence": ["manage.py", "*/models.py"]})

    return patterns


 # Metrics and scoring
 

def _metrics(paths: list[str]) -> dict:
    total = len(paths)
    depths = [p.count("/") for p in paths]
    root_files = sum(1 for d in depths if d == 0)
    per_top = Counter(p.split("/")[0] for p in paths if "/" in p)
    all_dirs = {p.rsplit("/", 1)[0] for p in paths if "/" in p}
    largest_name, largest_count = (per_top.most_common(1)[0] if per_top else ("", 0))

    return {
        "total_files": total,
        "total_directories": len(all_dirs),
        "root_files": root_files,
        "max_depth": max(depths) if depths else 0,
        "avg_depth": round(sum(depths) / total, 2) if total else 0,
        "largest_top_level_dir": largest_name,
        "largest_dir_share": round(largest_count / total, 2) if total else 0,
        "top_level_dirs": [
            {"name": n, "files": c, "share": round(c / total, 2)}
            for n, c in per_top.most_common(8)
        ],
    }


def _score(arch: dict, patterns: list[dict], m: dict, paths: list[str], dir_names: set[str], top_dirs: set[str]):
    basenames = {p.rsplit("/", 1)[-1] for p in paths}
    notes = []

    # 1. Separation of concerns (30)
    soc = {0: 8, 1: 20}.get(len(patterns), 30)
    if arch["type"] != "Monolith":
        soc = max(soc, 22)
    if not patterns:
        notes.append("No recognisable layering (routes/services/models, MVC, features). Consider grouping code by responsibility.")

    # 2. Organization (25)
    if m["root_files"] <= 10:
        root_pts = 10
    elif m["root_files"] <= 20:
        root_pts = 6
        notes.append(f"{m['root_files']} files in the repo root; move config/scripts into subfolders where possible.")
    else:
        root_pts = 2
        notes.append(f"{m['root_files']} files in the repo root is cluttered.")
    depth_pts = 8 if m["max_depth"] <= 6 else 5 if m["max_depth"] <= 9 else 2
    if m["max_depth"] > 9:
        notes.append(f"Directory nesting reaches {m['max_depth']} levels; flatten deeply nested folders.")
    src_pts = 7 if (top_dirs & SOURCE_DIRS) else 2
    if src_pts == 2:
        notes.append("No conventional source directory (src/, app/, lib/, backend/, ...).")
    organization = root_pts + depth_pts + src_pts

    # 3. Conventions (20)
    conv = 0
    if dir_names & TEST_DIRS or any(".test." in b or ".spec." in b or b.startswith("test_") for b in basenames):
        conv += 5
    else:
        notes.append("No test directory or test files detected.")
    if any(p.startswith(".github/workflows/") or p in (".gitlab-ci.yml", "Jenkinsfile", ".travis.yml") for p in paths):
        conv += 5
    else:
        notes.append("No CI configuration found.")
    if ".gitignore" in basenames:
        conv += 4
    if any(b.startswith(("Dockerfile", "docker-compose")) for b in basenames):
        conv += 3
    if basenames & {".editorconfig", ".prettierrc", ".eslintrc", ".eslintrc.json", "eslint.config.js", "ruff.toml", ".flake8", "pyproject.toml"}:
        conv += 3

    # 4. Balance / modularity (25)
    share = m["largest_dir_share"]
    share_pts = 15 if share <= 0.5 else 10 if share <= 0.7 else 4
    if share > 0.7:
        notes.append(f"{int(share * 100)}% of files live in '{m['largest_top_level_dir']}/'; consider splitting it into modules.")
    dir_pts = 10 if m["total_directories"] >= 8 else 6 if m["total_directories"] >= 3 else 2
    balance = share_pts + dir_pts

    total = soc + organization + conv + balance
    grade = "A" if total >= 85 else "B" if total >= 70 else "C" if total >= 55 else "D" if total >= 40 else "F"

    return {
        "overall": total,
        "grade": grade,
        "breakdown": {
            "separation_of_concerns": {"score": soc, "max": 30},
            "organization": {"score": organization, "max": 25},
            "conventions": {"score": conv, "max": 20},
            "balance": {"score": balance, "max": 25},
        },
    }, notes


# Routes


@router.get("/repo/{owner}/{repo}/architecture")
async def analyze_architecture(owner: str, repo: str):
    try:
        repo_data, tree_data, pkg_json = await _fetch_repo_and_tree(owner, repo)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="GitHub request timed out")
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Could not reach GitHub")

    paths = _clean_paths(tree_data.get("tree", []))
    if not paths:
        raise HTTPException(status_code=422, detail="No analysable files found")

    dir_names = _dir_names(paths)
    top_dirs = {p.split("/")[0].lower() for p in paths if "/" in p}

    arch = _detect_type(paths, top_dirs, pkg_json)
    patterns = _detect_patterns(paths, dir_names)
    metrics = _metrics(paths)
    score, recommendations = _score(arch, patterns, metrics, paths, dir_names, top_dirs)

    return {
        "repo": repo_data.get("full_name", f"{owner}/{repo}"),
        "architecture": arch,
        "patterns": patterns,
        "metrics": metrics,
        "score": score,
        "recommendations": recommendations,
        "truncated": bool(tree_data.get("truncated", False)),
    }