from fastapi import APIRouter, HTTPException
import httpx
import re
import base64
import json
from collections import defaultdict
from routers.dependancies import get_headers, GITHUB_API

router = APIRouter(prefix="/repo", tags=["Vibe Score"])


MAX_FILES_TO_SCAN = 200
MAX_FILE_SIZE = 300_000  # 300KB

SKIP_DIRS = {
    "node_modules", ".git", "dist", "build", ".next", "vendor",
    "__pycache__", ".venv", "coverage", ".turbo", "out", ".cache"
}
SKIP_EXTENSIONS = {
    ".lock", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".woff", ".woff2", ".ttf", ".eot", ".pdf", ".zip", ".tar",
    ".gz", ".mp4", ".mp3", ".mov", ".env", ".map"
}

CODE_EXTENSIONS = {
    ".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs",
    ".java", ".rb", ".php", ".cs", ".cpp", ".c", ".vue", ".svelte"
}

DEPENDENCY_GROUPS = {
    "HTTP Clients":       {"axios", "node-fetch", "got", "superagent", "ky", "unfetch", "cross-fetch"},
    "Date Libraries":     {"moment", "dayjs", "date-fns", "luxon", "fecha"},
    "State Management":   {"redux", "@reduxjs/toolkit", "zustand", "jotai", "recoil", "mobx", "valtio", "xstate"},
    "UI Libraries":       {"@mui/material", "antd", "chakra-ui", "@chakra-ui/react", "daisyui", "mantine", "@mantine/core"},
    "Form Libraries":     {"react-hook-form", "formik", "final-form", "react-final-form"},
    "Validation":         {"zod", "yup", "joi", "vest", "valibot"},
    "CSS-in-JS":          {"styled-components", "@emotion/react", "@emotion/styled", "stitches", "linaria"},
    "Testing":            {"jest", "vitest", "mocha", "jasmine"},
    "ORM/DB":             {"prisma", "typeorm", "sequelize", "drizzle-orm", "mongoose", "mikro-orm"},
}

# Hardcoded value patterns
HARDCODED_PATTERNS = [
    (r'https?://localhost[:\d]*', "Localhost URL in code"),
    (r'https?://127\.0\.0\.\d+[:\d]*', "Hardcoded IP address"),
    (r'https?://(?!localhost|127\.0\.0\.1)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(?:/[^\s"\']*)?(?=["\'\s])',
     "Hardcoded external URL"),
    (r'(?i)(port|PORT)\s*[=:]\s*["\']?\d{4,5}["\']?', "Hardcoded port"),
    (r'(?i)(db_host|database_host|DB_HOST)\s*[=:]\s*["\'][^"\']+["\']', "Hardcoded DB host"),
]

# Emoji regex
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F600-\U0001F64F"
    "\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F9FF"
    "\U00002600-\U000027BF"
    "\U0001FA00-\U0001FA6F"
    "]+",
    flags=re.UNICODE
)


def should_skip(path: str) -> bool:
    parts = path.split("/")
    for part in parts[:-1]:
        if part in SKIP_DIRS:
            return True
    ext = "." + path.rsplit(".", 1)[-1] if "." in path else ""
    return ext in SKIP_EXTENSIONS


def is_code_file(path: str) -> bool:
    ext = "." + path.rsplit(".", 1)[-1].lower() if "." in path else ""
    return ext in CODE_EXTENSIONS


def is_test_file(path: str) -> bool:
    name = path.lower()
    return (
        ".test." in name or ".spec." in name or
        "/__tests__/" in name or "/tests/" in name or
        "/test/" in name or name.endswith("_test.py") or
        name.endswith("_spec.rb")
    )


async def fetch_content(client, owner, repo, path) -> str | None:
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
    return data.get("content", "")


def check_massive_files(files_with_sizes: list[dict]) -> dict:
    """Flag files that are too large — sign of no separation of concerns."""
    THRESHOLDS = {
        "component": (300, {".jsx", ".tsx", ".vue", ".svelte"}),
        "general":   (500, CODE_EXTENSIONS),
    }
    flagged = []
    for f in files_with_sizes:
        path = f["path"]
        size = f.get("size", 0)
        ext = "." + path.rsplit(".", 1)[-1].lower() if "." in path else ""

        estimated_lines = size // 40

        is_component = ext in THRESHOLDS["component"][1]
        threshold = THRESHOLDS["component"][0] if is_component else THRESHOLDS["general"][0]

        if is_code_file(path) and estimated_lines > threshold:
            flagged.append({
                "file": path,
                "estimated_lines": estimated_lines,
                "threshold": threshold,
            })

    penalty = min(15, len(flagged) * 3)
    return {
        "flagged_files": flagged,
        "count": len(flagged),
        "penalty": penalty,
        "verdict": "pass" if not flagged else "fail",
        "detail": f"{len(flagged)} oversized file(s) detected" if flagged else "File sizes look reasonable",
    }


def check_naming_consistency(content: str, path: str) -> dict:
    """Detect mixed naming conventions within a single file."""
    ext = "." + path.rsplit(".", 1)[-1].lower() if "." in path else ""

    if ext in {".py", ".rb"}:
        camel = len(re.findall(r'\b[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b', content))
        snake = len(re.findall(r'\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b', content))
        total = camel + snake
        if total == 0:
            return {"mixed": False}
        camel_pct = camel / total
        mixed = camel_pct > 0.2 and snake > 5
        return {"mixed": mixed, "camel": camel, "snake": snake}

    else:
        snake = len(re.findall(r'\b[a-z][a-z0-9]*(?:_[a-z0-9]+){2,}\b', content))
        camel = len(re.findall(r'\b[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b', content))
        total = snake + camel
        if total == 0:
            return {"mixed": False}
        snake_pct = snake / total
        mixed = snake_pct > 0.15 and snake > 5
        return {"mixed": mixed, "snake_in_js": snake, "camel": camel}


def check_comment_overload(content: str, path: str) -> dict:
    """Flag files where comments and emojis dominate over actual code."""
    lines = content.splitlines()
    total_lines = len(lines)
    if total_lines == 0:
        return {"overloaded": False, "emoji_count": 0}

    ext = "." + path.rsplit(".", 1)[-1].lower() if "." in path else ""

    if ext == ".py":
        comment_lines = [l for l in lines if l.strip().startswith("#")]
    else:
        comment_lines = [l for l in lines if re.match(r'\s*(//|/\*|\*)', l)]

    blank_lines = [l for l in lines if not l.strip()]
    code_lines = total_lines - len(comment_lines) - len(blank_lines)

    comment_ratio = len(comment_lines) / max(code_lines, 1)

    emoji_count = sum(len(EMOJI_PATTERN.findall(line)) for line in lines)

    overloaded = comment_ratio > 0.5 or emoji_count > 3

    return {
        "overloaded": overloaded,
        "comment_lines": len(comment_lines),
        "code_lines": code_lines,
        "comment_ratio": round(comment_ratio, 2),
        "emoji_count": emoji_count,
    }


def check_hardcoded_values(content: str, path: str) -> list[dict]:
    """Detect hardcoded URLs, IPs, ports in logic files."""
    skip_names = {"config.js", "config.ts", "constants.js", "constants.ts",
                  ".env", "env.js", "env.ts", "next.config.js", "next.config.ts"}
    filename = path.split("/")[-1].lower()
    if filename in skip_names:
        return []

    findings = []
    for line_num, line in enumerate(content.splitlines(), 1):
        stripped = line.strip()
        if stripped.startswith("//") or stripped.startswith("#") or stripped.startswith("*"):
            continue
        for pattern, label in HARDCODED_PATTERNS:
            if re.search(pattern, line):
                findings.append({
                    "file": path,
                    "line": line_num,
                    "type": label,
                })
    return findings


def check_dependency_spam(package_json_content: str) -> dict:
    """Detect redundant dependencies doing the same job."""
    try:
        pkg = json.loads(package_json_content)
    except Exception:
        return {"spam_groups": [], "penalty": 0}

    all_deps = set()
    all_deps.update(pkg.get("dependencies", {}).keys())
    all_deps.update(pkg.get("devDependencies", {}).keys())
    all_deps_lower = {d.lower() for d in all_deps}

    spam_groups = []
    for group_name, group_packages in DEPENDENCY_GROUPS.items():
        hits = [p for p in group_packages if p in all_deps_lower]
        if len(hits) > 1:
            spam_groups.append({
                "group": group_name,
                "found": hits,
                "count": len(hits),
            })

    total_deps = len(all_deps)
    dep_count_flag = total_deps > 50

    penalty = min(12, len(spam_groups) * 3 + (4 if dep_count_flag else 0))
    return {
        "spam_groups": spam_groups,
        "total_dependencies": total_deps,
        "excessive_total": dep_count_flag,
        "penalty": penalty,
        "verdict": "fail" if spam_groups or dep_count_flag else "pass",
        "detail": (
            f"{len(spam_groups)} redundant dependency group(s)" if spam_groups
            else f"{total_deps} total dependencies — looks fine"
        ),
    }


def check_documentation(all_paths: set, readme_content: str | None) -> dict:
    """Check README quality and presence of docstrings/JSDoc."""
    has_readme = "README.md" in all_paths or "readme.md" in all_paths

    readme_length = 0
    readme_quality = "missing"
    if readme_content:
        readme_length = len(readme_content.strip())
        if readme_length < 200:
            readme_quality = "stub"
        elif readme_length < 800:
            readme_quality = "basic"
        else:
            readme_quality = "good"

    penalty = 0
    if not has_readme:
        penalty += 10
    elif readme_quality == "stub":
        penalty += 7
    elif readme_quality == "basic":
        penalty += 3

    return {
        "has_readme": has_readme,
        "readme_quality": readme_quality,
        "readme_length": readme_length,
        "penalty": penalty,
        "verdict": "pass" if readme_quality == "good" else "fail",
        "detail": f"README is {readme_quality}" if has_readme else "No README found",
    }


def check_tests(all_paths: set) -> dict:
    """Check if any test files exist."""
    test_files = [p for p in all_paths if is_test_file(p)]
    has_tests = len(test_files) > 0

    test_configs = {"jest.config.js", "jest.config.ts", "vitest.config.ts",
                    "vitest.config.js", "pytest.ini", "setup.cfg"}
    has_test_config = bool(test_configs & all_paths)

    penalty = 0
    if not has_tests:
        penalty = 15
    elif len(test_files) < 3:
        penalty = 7

    return {
        "has_tests": has_tests,
        "test_file_count": len(test_files),
        "has_test_config": has_test_config,
        "sample_test_files": test_files[:5],
        "penalty": penalty,
        "verdict": "pass" if has_tests and len(test_files) >= 3 else "fail",
        "detail": (
            f"{len(test_files)} test file(s) found" if has_tests
            else "No test files found anywhere in the repo"
        ),
    }


def check_structure(all_paths: set) -> dict:
    """Check folder structure and separation of concerns."""
    issues = []

    dirs = {"/".join(p.split("/")[:-1]) for p in all_paths if "/" in p}

    root_code_files = [
        p for p in all_paths
        if "/" not in p and is_code_file(p)
    ]
    if len(root_code_files) > 10:
        issues.append("Too many code files dumped in root directory")

    src_flat = [
        p for p in all_paths
        if p.startswith("src/") and p.count("/") == 1 and is_code_file(p)
    ]
    if len(src_flat) > 15:
        issues.append("All files flat in src/ with no subfolders")

    component_with_api = []
    for p in all_paths:
        ext = "." + p.rsplit(".", 1)[-1].lower() if "." in p else ""
        if ext in {".jsx", ".tsx"} and ("page" in p.lower() or "component" in p.lower()):
            component_with_api.append(p)

    penalty = min(11, len(issues) * 4)
    return {
        "issues": issues,
        "total_dirs": len(dirs),
        "root_code_files": len(root_code_files),
        "penalty": penalty,
        "verdict": "pass" if not issues else "fail",
        "detail": issues[0] if issues else "Structure looks organized",
    }


@router.get("/{owner}/{repo}/vibescore")
async def vibe_score(owner: str, repo: str):
    """
    Analyze a repository for vibe coding patterns — AI-generated or carelessly
    written code lacking structure, consistency, tests, and intentional design.
    """
    async with httpx.AsyncClient(timeout=30) as client:
        tree_res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/HEAD?recursive=1",
            headers=get_headers()
        )
        if tree_res.status_code != 200:
            raise HTTPException(status_code=tree_res.status_code, detail="Could not fetch repo tree")

        tree = tree_res.json().get("tree", [])
        all_paths = {f["path"] for f in tree if f["type"] == "blob"}
        all_files = [f for f in tree if f["type"] == "blob" and not should_skip(f["path"])]

        structure_result = check_structure(all_paths)
        tests_result = check_tests(all_paths)

        # Fetch README
        readme_content = None
        for readme_path in ["README.md", "readme.md", "Readme.md"]:
            if readme_path in all_paths:
                readme_content = await fetch_content(client, owner, repo, readme_path)
                break
        docs_result = check_documentation(all_paths, readme_content)

        dep_result = {
            "spam_groups": [],
            "penalty": 0,
            "verdict": "pass",
            "detail": "No package.json found",
            "total_dependencies": 0,
            "excessive_total": False,
        }
        if "package.json" in all_paths:
            pkg_content = await fetch_content(client, owner, repo, "package.json")
            if pkg_content:
                dep_result = check_dependency_spam(pkg_content)

        code_files = [
            f for f in all_files
            if is_code_file(f["path"]) and not is_test_file(f["path"])
            and f.get("size", 0) < MAX_FILE_SIZE
        ][:MAX_FILES_TO_SCAN]

        massive_result = check_massive_files([
            f for f in all_files if is_code_file(f["path"])
        ])

        naming_violations = []
        comment_violations = []
        hardcoded_violations = []
        total_emoji_count = 0

        for file in code_files:
            content = await fetch_content(client, owner, repo, file["path"])
            if not content:
                continue

            naming = check_naming_consistency(content, file["path"])
            if naming.get("mixed"):
                naming_violations.append(file["path"])

            comments = check_comment_overload(content, file["path"])
            total_emoji_count += comments.get("emoji_count", 0)
            if comments.get("overloaded"):
                comment_violations.append({
                    "file": file["path"],
                    "comment_ratio": comments.get("comment_ratio"),
                    "emoji_count": comments.get("emoji_count"),
                })

            hardcoded = check_hardcoded_values(content, file["path"])
            hardcoded_violations.extend(hardcoded)

        naming_penalty = min(15, len(naming_violations) * 3)
        naming_result = {
            "violations": naming_violations,
            "count": len(naming_violations),
            "penalty": naming_penalty,
            "verdict": "pass" if not naming_violations else "fail",
            "detail": (
                f"{len(naming_violations)} file(s) mix naming conventions"
                if naming_violations else "Naming is consistent"
            ),
        }

        comment_penalty = min(10, len(comment_violations) * 2 + (3 if total_emoji_count > 10 else 0))
        comment_result = {
            "violations": comment_violations[:10],
            "total_emoji_count": total_emoji_count,
            "count": len(comment_violations),
            "penalty": comment_penalty,
            "verdict": "pass" if not comment_violations and total_emoji_count <= 3 else "fail",
            "detail": (
                f"{len(comment_violations)} over-commented file(s), {total_emoji_count} emoji(s) in code"
                if comment_violations or total_emoji_count > 3
                else "Comment density looks healthy"
            ),
        }

        hardcoded_penalty = min(12, len(hardcoded_violations) * 2)
        hardcoded_result = {
            "violations": hardcoded_violations[:15],
            "count": len(hardcoded_violations),
            "penalty": hardcoded_penalty,
            "verdict": "pass" if not hardcoded_violations else "fail",
            "detail": (
                f"{len(hardcoded_violations)} hardcoded value(s) found"
                if hardcoded_violations else "No hardcoded values detected"
            ),
        }

        total_penalty = (
            massive_result["penalty"] +
            naming_result["penalty"] +
            tests_result["penalty"] +
            hardcoded_result["penalty"] +
            dep_result["penalty"] +
            comment_result["penalty"] +
            docs_result["penalty"] +
            structure_result["penalty"]
        )

        vibe_score_value = max(0, 100 - total_penalty)

        grade = (
            "A" if vibe_score_value >= 85 else
            "B" if vibe_score_value >= 70 else
            "C" if vibe_score_value >= 55 else
            "D" if vibe_score_value >= 40 else
            "F"
        )

        verdict = (
            "Clean code" if vibe_score_value >= 85 else
            "Mostly solid, some issues" if vibe_score_value >= 70 else
            "Questionable quality" if vibe_score_value >= 55 else
            "Heavy vibe coding detected" if vibe_score_value >= 40 else
            "Pure vibe code — no structure, no tests, no discipline"
        )

        return {
            "vibe_score": vibe_score_value,
            "grade": grade,
            "verdict": verdict,
            "files_analyzed": len(code_files),
            "checks": {
                "massive_files":    massive_result,
                "naming":           naming_result,
                "tests":            tests_result,
                "hardcoded_values": hardcoded_result,
                "dependency_spam":  dep_result,
                "comments_emojis":  comment_result,
                "documentation":    docs_result,
                "structure":        structure_result,
            },
        }
        
        