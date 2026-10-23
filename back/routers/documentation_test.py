

import asyncio
import base64
import json
import re
from urllib.parse import quote

import httpx
from fastapi import APIRouter, HTTPException

from .dependancies import GITHUB_API, get_headers

router = APIRouter()

IGNORED_DIRS = {
    "node_modules", "dist", "build", ".git", ".next", ".nuxt", "out", "target",
    "venv", ".venv", "env", "__pycache__", ".idea", ".vscode", "vendor",
    "coverage", ".cache", ".turbo", "bin", "obj", ".gradle", "site-packages",
}

SOURCE_EXT = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".go", ".rs", ".java",
    ".kt", ".rb", ".php", ".cs", ".swift", ".c", ".cc", ".cpp", ".h", ".hpp",
    ".vue", ".svelte", ".scala", ".ex", ".exs", ".dart",
}

TEST_DIRS = {"test", "tests", "__tests__", "spec", "specs", "e2e", "cypress"}

TEST_FILE_RE = re.compile(
    r"^(test_.*\.py"
    r"|.*_test\.(py|go|rb|rs|exs?)"
    r"|.*\.(test|spec)\.(js|jsx|ts|tsx|mjs|cjs|vue|svelte)"
    r"|.*(Test|Tests|IT)\.(java|kt|cs|scala)"
    r"|.*_spec\.rb"
    r"|.*Test\.php)$"
)

JS_TEST_DEPS = {
    "jest": "Jest",
    "vitest": "Vitest",
    "mocha": "Mocha",
    "jasmine": "Jasmine",
    "ava": "AVA",
    "karma": "Karma",
    "@playwright/test": "Playwright",
    "playwright": "Playwright",
    "cypress": "Cypress",
    "puppeteer": "Puppeteer",
    "supertest": "Supertest",
    "@testing-library/react": "React Testing Library",
    "@testing-library/vue": "Vue Testing Library",
    "@testing-library/jest-dom": "Testing Library",
}

JS_COVERAGE_DEPS = {
    "nyc": "nyc", "c8": "c8", "istanbul": "Istanbul",
    "@vitest/coverage-v8": "Vitest coverage", "@vitest/coverage-istanbul": "Vitest coverage",
    "jest-coverage": "Jest coverage",
}

PY_TEST_TOKENS = {
    "pytest": "pytest", "nose2": "nose2", "hypothesis": "Hypothesis",
    "tox": "tox", "behave": "behave", "robotframework": "Robot Framework",
}

CONFIG_FILES = {
    "jest.config.js": "Jest", "jest.config.ts": "Jest", "jest.config.mjs": "Jest",
    "vitest.config.ts": "Vitest", "vitest.config.js": "Vitest", "vitest.config.mts": "Vitest",
    "playwright.config.ts": "Playwright", "playwright.config.js": "Playwright",
    "cypress.config.ts": "Cypress", "cypress.config.js": "Cypress", "cypress.json": "Cypress",
    ".mocharc.json": "Mocha", ".mocharc.js": "Mocha", ".mocharc.yml": "Mocha",
    "karma.conf.js": "Karma",
    "pytest.ini": "pytest", "tox.ini": "tox", "conftest.py": "pytest",
    ".rspec": "RSpec", "phpunit.xml": "PHPUnit", "phpunit.xml.dist": "PHPUnit",
}

COVERAGE_FILES = {
    ".coveragerc": "coverage.py", ".nycrc": "nyc", ".nycrc.json": "nyc",
    "codecov.yml": "Codecov", ".codecov.yml": "Codecov", "codecov.yaml": "Codecov",
    ".coveralls.yml": "Coveralls", "jest.config.js": None,
}

CI_ROOT_FILES = {
    ".gitlab-ci.yml", "jenkinsfile", ".travis.yml", "azure-pipelines.yml",
    "bitbucket-pipelines.yml", ".drone.yml",
}

CI_TEST_RE = re.compile(
    r"(npm (run )?test|yarn (run )?test|pnpm (run )?test|bun test|pytest|py\.test|"
    r"python -m (pytest|unittest)|tox\b|go test|cargo (test|nextest)|mvn[^\n]* test|"
    r"mvn[^\n]* verify|gradle[w]?[^\n]* (test|check)|jest\b|vitest\b|rspec|"
    r"phpunit|dotnet test|playwright test|cypress run|mix test|make test)"
)
CI_COVERAGE_RE = re.compile(r"(--cov|coverage|codecov|coveralls)")

SECTION_KEYS = {
    "installation": ("install", "setup", "set up", "getting started", "quick start", "quickstart", "prerequisites", "requirements"),
    "usage": ("usage", "example", "how to use", "quick start", "quickstart", "demo", "getting started"),
    "features": ("feature", "overview", "about", "what is", "what it does", "highlights"),
    "configuration": ("config", "environment", "env", "settings", "options"),
    "api": ("api", "reference", "endpoints", "documentation"),
    "testing": ("test",),
    "contributing": ("contribut",),
    "license": ("license", "licence"),
}

INSTALL_BODY_RE = re.compile(
    r"(npm install|npm i |yarn add|pnpm (add|install)|pip install|go get|cargo (install|add)|"
    r"git clone|docker (run|compose)|npx |brew install|gem install|composer require)"
)



def _raise_for_github(res: httpx.Response):
    if res.status_code == 404:
        raise HTTPException(status_code=404, detail="Repository not found")
    if res.status_code == 401:
        raise HTTPException(status_code=401, detail="GitHub token is invalid or expired")
    if res.status_code == 403:
        if res.headers.get("x-ratelimit-remaining") == "0":
            raise HTTPException(status_code=429, detail="GitHub API rate limit reached")
        raise HTTPException(status_code=403, detail="GitHub access denied")
    if res.status_code >= 400:
        raise HTTPException(status_code=res.status_code, detail="GitHub API error")


def _decode(data) -> str | None:
    if not isinstance(data, dict) or data.get("encoding") != "base64":
        return None
    try:
        return base64.b64decode(data.get("content", "")).decode("utf-8", errors="ignore")
    except ValueError:
        return None


async def _get_file(client: httpx.AsyncClient, owner: str, repo: str, path: str, branch: str):
    res = await client.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/contents/{quote(path)}",
        params={"ref": branch},
        headers=get_headers(),
    )
    if res.status_code != 200:
        return path, None
    return path, _decode(res.json())


async def _get_readme(client: httpx.AsyncClient, owner: str, repo: str, branch: str):
    res = await client.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/readme",
        params={"ref": branch},
        headers=get_headers(),
    )
    if res.status_code != 200:
        return None, None
    data = res.json()
    return data.get("path") or data.get("name"), _decode(data)


def _pick_manifests(paths: list[str]) -> list[str]:
    wanted = {"package.json", "requirements.txt", "pyproject.toml"}
    picked = [p for p in paths if p.rsplit("/", 1)[-1] in wanted and p.count("/") <= 1]
    picked.sort(key=lambda p: (p.count("/"), p))
    return picked[:6]


def _pick_ci(paths: list[str]) -> list[str]:
    workflows = [
        p for p in paths
        if p.startswith(".github/workflows/") and p.endswith((".yml", ".yaml"))
    ][:5]
    others = [
        p for p in paths
        if p.lower() in CI_ROOT_FILES or p == ".circleci/config.yml"
    ]
    return (workflows + others)[:6]


async def _fetch_all(owner: str, repo: str):
    async with httpx.AsyncClient(timeout=25.0) as client:
        repo_res = await client.get(f"{GITHUB_API}/repos/{owner}/{repo}", headers=get_headers())
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

        paths = _clean_paths(tree_data.get("tree", []))
        manifests = _pick_manifests(paths)
        ci_files = _pick_ci(paths)

        readme_task = _get_readme(client, owner, repo, branch)
        file_tasks = [_get_file(client, owner, repo, p, branch) for p in manifests + ci_files]
        readme_result, *file_results = await asyncio.gather(readme_task, *file_tasks)

    contents = {p: t for p, t in file_results if t is not None}
    manifest_texts = {p: contents[p] for p in manifests if p in contents}
    ci_texts = {p: contents[p] for p in ci_files if p in contents}
    return repo_data, tree_data, readme_result, manifest_texts, ci_texts


 

def _clean_paths(tree: list) -> list[str]:
    paths = []
    for item in tree:
        if item.get("type") != "blob":
            continue
        parts = item["path"].split("/")
        if any(p in IGNORED_DIRS for p in parts[:-1]):
            continue
        paths.append(item["path"])
    return paths


def _basename(p: str) -> str:
    return p.rsplit("/", 1)[-1]


def _is_test_path(p: str) -> bool:
    parts = p.split("/")
    in_test_dir = any(seg.lower() in TEST_DIRS for seg in parts[:-1])
    ext = "." + parts[-1].rsplit(".", 1)[-1].lower() if "." in parts[-1] else ""
    if in_test_dir and ext in SOURCE_EXT:
        return True
    return bool(TEST_FILE_RE.match(parts[-1]))


def _is_source_path(p: str) -> bool:
    name = _basename(p)
    if "." not in name or _is_test_path(p):
        return False
    ext = "." + name.rsplit(".", 1)[-1].lower()
    if ext not in SOURCE_EXT:
        return False
    if name == "__init__.py" or name.endswith(".d.ts") or ".config." in name:
        return False
    return True


def _find_project_file(paths: list[str], stems: set[str]) -> str | None:
    for p in paths:
        folder, _, base = p.rpartition("/")
        if folder.lower() in ("", ".github", "docs") and base.lower().split(".")[0] in stems:
            return p
    return None


 

def _analyze_readme(text: str, path: str | None) -> dict:
    in_fence = False
    code_blocks = 0
    headings: list[str] = []
    prose: list[str] = []

    for line in text.splitlines():
        s = line.strip()
        if s.startswith("```") or s.startswith("~~~"):
            if not in_fence:
                code_blocks += 1
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        m = re.match(r"^#{1,6}\s+(.*?)\s*#*\s*$", s)
        if m:
            headings.append(m.group(1).lower())
            continue
        prose.append(s)

    for m in re.finditer(r"<h[1-6][^>]*>(.*?)</h[1-6]>", text, flags=re.I | re.S):
        headings.append(re.sub(r"<[^>]+>", "", m.group(1)).strip().lower())

    body = "\n".join(prose)
    images = len(re.findall(r"!\[[^\]]*\]\([^)]*\)", body)) + len(re.findall(r"<img\b", body, flags=re.I))
    badges = len(re.findall(r"(shields\.io|badge\.svg|badgen\.net|/badges?/)", body, flags=re.I))
    links = len(re.findall(r"\[[^\]]+\]\([^)]+\)", body))

    cleaned = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", body)
    cleaned = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", cleaned)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    words = len(re.findall(r"[A-Za-z0-9']+", cleaned))

    has_intro = any(
        len(re.findall(r"[A-Za-z']+", line)) >= 8
        and not line.startswith(("!", "[![", "<", "-", "*", "|", ">"))
        for line in prose
    )

    def has_heading(keys) -> bool:
        return any(k in h for h in headings for k in keys)

    sections = {name: has_heading(keys) for name, keys in SECTION_KEYS.items()}
    if not sections["installation"] and INSTALL_BODY_RE.search(text.lower()):
        sections["installation"] = True

    return {
        "found": True,
        "path": path,
        "words": words,
        "headings": len(headings),
        "code_blocks": code_blocks,
        "images": images,
        "badges": badges,
        "links": links,
        "has_intro": has_intro,
        "sections": sections,
    }


def _score_readme(r: dict) -> tuple[int, list[str]]:
    notes: list[str] = []
    if not r["found"]:
        return 0, ["Add a README.md that explains what the project does and how to run it."]

    pts = 6  # exists
    w = r["words"]
    pts += 6 if w >= 300 else 4 if w >= 100 else 2 if w >= 30 else 0
    if w < 100:
        notes.append(f"README is short ({w} words). Describe the problem, features, and setup in more detail.")

    s = r["sections"]
    if s["installation"]:
        pts += 4
    else:
        notes.append("README has no installation / getting started section.")
    if s["usage"]:
        pts += 4
    else:
        notes.append("README has no usage or examples section.")
    if r["has_intro"]:
        pts += 2
    else:
        notes.append("README lacks an introductory paragraph explaining what the project is.")

    pts += 3 if r["code_blocks"] >= 2 else 1 if r["code_blocks"] == 1 else 0
    if r["code_blocks"] == 0:
        notes.append("README has no code blocks; show the commands to install and run the project.")
    pts += 2 if r["headings"] >= 4 else 0
    pts += 2 if (r["images"] + r["badges"]) >= 1 else 0
    pts += 1 if s["configuration"] else 0
    return min(pts, 30), notes


 # Test detection
 

def _parse_package_json(text: str) -> dict | None:
    try:
        data = json.loads(text)
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        return None


def _detect_testing(paths: list[str], manifests: dict[str, str], ci: dict[str, str]) -> dict:
    basenames = {_basename(p) for p in paths}
    basenames_lower = {b.lower() for b in basenames}

    test_files = [p for p in paths if _is_test_path(p)]
    source_files = [p for p in paths if _is_source_path(p)]
    test_dirs = sorted({
        "/".join(p.split("/")[: i + 1])
        for p in test_files
        for i, seg in enumerate(p.split("/")[:-1])
        if seg.lower() in TEST_DIRS
    })[:8]

    frameworks: list[str] = []
    coverage_tools: list[str] = []
    has_test_command = False

    def add(lst: list[str], name: str | None):
        if name and name not in lst:
            lst.append(name)

    # Manifests
    for path, text in manifests.items():
        base = _basename(path)
        if base == "package.json":
            pkg = _parse_package_json(text) or {}
            deps = {**(pkg.get("dependencies") or {}), **(pkg.get("devDependencies") or {})}
            for dep, name in JS_TEST_DEPS.items():
                if dep in deps:
                    add(frameworks, name)
            for dep, name in JS_COVERAGE_DEPS.items():
                if dep in deps:
                    add(coverage_tools, name)
            scripts = pkg.get("scripts") or {}
            test_script = scripts.get("test")
            if isinstance(test_script, str) and "no test specified" not in test_script:
                has_test_command = True
            if any("coverage" in str(v) for v in scripts.values()):
                add(coverage_tools, "coverage script")
        else:
            low = text.lower()
            for token, name in PY_TEST_TOKENS.items():
                if token in low:
                    add(frameworks, name)
            if "pytest-cov" in low or "coverage" in low:
                add(coverage_tools, "coverage.py")
            if "[tool.pytest" in low or "pytest" in low:
                has_test_command = True

    # Config files anywhere in the tree
    for b in basenames:
        if b in CONFIG_FILES:
            add(frameworks, CONFIG_FILES[b])
            if CONFIG_FILES[b] in ("pytest", "tox", "RSpec", "PHPUnit"):
                has_test_command = True
        if b in COVERAGE_FILES and COVERAGE_FILES[b]:
            add(coverage_tools, COVERAGE_FILES[b])

    # Language-native test runners inferred from file patterns
    names = [_basename(p) for p in test_files]
    if any(n.endswith("_test.go") for n in names):
        add(frameworks, "go test")
        has_test_command = True
    if "Cargo.toml" in basenames and test_files:
        add(frameworks, "cargo test")
        has_test_command = True
    if any(re.search(r"(Test|Tests|IT)\.(java|kt|scala)$", n) for n in names):
        add(frameworks, "JUnit (likely)")
        has_test_command = True
    if any(n.endswith("_spec.rb") for n in names):
        add(frameworks, "RSpec")
        has_test_command = True
    if any(n.endswith("Test.php") for n in names):
        add(frameworks, "PHPUnit (likely)")
    if any(re.search(r"Tests?\.cs$", n) for n in names):
        add(frameworks, "xUnit/NUnit (likely)")
        has_test_command = True
    if any(n.startswith("test_") and n.endswith(".py") or n.endswith("_test.py") for n in names) and not any(
        f in frameworks for f in ("pytest", "tox", "nose2")
    ):
        add(frameworks, "unittest/pytest (likely)")
        has_test_command = True

    # CI
    ci_runs_tests = False
    ci_runs_coverage = False
    for text in ci.values():
        low = text.lower()
        if CI_TEST_RE.search(low):
            ci_runs_tests = True
        if CI_COVERAGE_RE.search(low):
            ci_runs_coverage = True
    if ci_runs_coverage:
        add(coverage_tools, "coverage in CI")

    ratio = round(len(test_files) / len(source_files), 2) if source_files else 0.0
    if not test_files:
        estimate = "none"
    elif ratio < 0.10:
        estimate = "low"
    elif ratio < 0.25:
        estimate = "moderate"
    else:
        estimate = "good"

    return {
        "test_files": len(test_files),
        "source_files": len(source_files),
        "test_ratio": ratio,
        "coverage_estimate": estimate,
        "test_dirs": test_dirs,
        "example_tests": test_files[:5],
        "frameworks": frameworks,
        "has_test_command": has_test_command,
        "coverage_tooling": coverage_tools,
        "ci": {
            "found": bool(ci),
            "files": list(ci.keys()),
            "runs_tests": ci_runs_tests,
            "runs_coverage": ci_runs_coverage,
        },
    }


def _score_testing(t: dict) -> tuple[dict, list[str]]:
    notes: list[str] = []
    n = t["test_files"]

    presence = 0 if n == 0 else 8 if n < 5 else 12 if n < 10 else 15
    if n == 0:
        notes.append("No tests detected. Add unit tests for the core logic first.")
    elif n < 5:
        notes.append(f"Only {n} test file(s) found. Broaden coverage of key modules.")

    r = t["test_ratio"]
    ratio_pts = 10 if r >= 0.30 else 7 if r >= 0.15 else 4 if r >= 0.05 else 2 if n else 0
    if n and r < 0.15:
        notes.append(f"Test files are only {int(r * 100)}% of source file count; more tests would raise confidence.")

    if t["frameworks"]:
        fw_pts = 7
    elif n:
        fw_pts = 3
    else:
        fw_pts = 0
    if n and not t["frameworks"]:
        notes.append("Could not identify a test framework. Declare it in your dependency manifest.")

    cmd_pts = 5 if t["has_test_command"] else 0
    if n and not t["has_test_command"]:
        notes.append("No obvious test command (e.g. an npm \"test\" script or pytest config).")

    if t["ci"]["runs_tests"]:
        ci_pts = 8
    elif t["ci"]["found"]:
        ci_pts = 2
        notes.append("CI is configured but does not appear to run tests.")
    else:
        ci_pts = 0
        notes.append("No CI configuration found. Run tests automatically on every push (e.g. GitHub Actions).")

    cov_pts = 5 if t["coverage_tooling"] else 0
    if not t["coverage_tooling"]:
        notes.append("No coverage tooling detected (e.g. pytest-cov, c8, Codecov).")

    return {
        "test_presence": {"score": presence, "max": 15},
        "test_ratio": {"score": ratio_pts, "max": 10},
        "frameworks": {"score": fw_pts, "max": 7},
        "test_command": {"score": cmd_pts, "max": 5},
        "ci": {"score": ci_pts, "max": 8},
        "coverage_tooling": {"score": cov_pts, "max": 5},
    }, notes

 

def build_report(repo_data, tree_data, readme_result, manifests, ci) -> dict:
    paths = _clean_paths(tree_data.get("tree", []))
    if not paths:
        raise HTTPException(status_code=422, detail="No analysable files found")

    # README
    readme_path, readme_text = readme_result
    if readme_text:
        readme = _analyze_readme(readme_text, readme_path)
    else:
        readme = {
            "found": False, "path": None, "words": 0, "headings": 0, "code_blocks": 0,
            "images": 0, "badges": 0, "links": 0, "has_intro": False,
            "sections": {k: False for k in SECTION_KEYS},
        }
    readme_pts, readme_notes = _score_readme(readme)

    # Project docs
    license_file = _find_project_file(paths, {"license", "licence", "copying", "unlicense"})
    has_license = bool(license_file or repo_data.get("license"))
    files = {
        "license": has_license,
        "contributing": _find_project_file(paths, {"contributing"}),
        "changelog": _find_project_file(paths, {"changelog", "changes", "history", "releases"}),
        "code_of_conduct": _find_project_file(paths, {"code_of_conduct"}),
        "security": _find_project_file(paths, {"security"}),
    }
    doc_dir_files = [
        p for p in paths
        if p.split("/")[0].lower() in {"docs", "doc", "documentation", "wiki"} and "/" in p
    ]

    project_pts = 0
    project_notes: list[str] = []
    if has_license:
        project_pts += 6
    else:
        project_notes.append("No LICENSE file. Without one, others have no legal right to reuse the code.")
    if files["contributing"]:
        project_pts += 4
    else:
        project_notes.append("Add a CONTRIBUTING.md so others know how to help.")
    if len(doc_dir_files) >= 2:
        project_pts += 4
    elif doc_dir_files:
        project_pts += 2
    if files["changelog"]:
        project_pts += 2
    if files["code_of_conduct"]:
        project_pts += 2
    if files["security"]:
        project_pts += 2
    else:
        project_notes.append("Add a SECURITY.md describing how to report vulnerabilities.")

    docs_total = readme_pts + project_pts

    # Testing
    testing = _detect_testing(paths, manifests, ci)
    test_breakdown, test_notes = _score_testing(testing)
    tests_total = sum(v["score"] for v in test_breakdown.values())

    overall = docs_total + tests_total
    grade = "A" if overall >= 85 else "B" if overall >= 70 else "C" if overall >= 55 else "D" if overall >= 40 else "F"

    return {
        "repo": repo_data.get("full_name", ""),
        "documentation": {
            "score": docs_total,
            "max": 50,
            "readme": readme,
            "files": files,
            "docs_folder": {"found": bool(doc_dir_files), "files": len(doc_dir_files)},
        },
        "testing": {"score": tests_total, "max": 50, **testing},
        "score": {
            "overall": overall,
            "grade": grade,
            "breakdown": {
                "readme": {"score": readme_pts, "max": 30},
                "project_docs": {"score": project_pts, "max": 20},
                **test_breakdown,
            },
        },
        "recommendations": readme_notes + project_notes + test_notes,
        "coverage_note": "Coverage is estimated from the test-to-source file ratio, not measured.",
        "truncated": bool(tree_data.get("truncated", False)),
    }


 

@router.get("/repo/{owner}/{repo}/docs-tests")
async def analyze_docs_and_tests(owner: str, repo: str):
    try:
        repo_data, tree_data, readme_result, manifests, ci = await _fetch_all(owner, repo)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="GitHub request timed out")
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Could not reach GitHub")

    return build_report(repo_data, tree_data, readme_result, manifests, ci)