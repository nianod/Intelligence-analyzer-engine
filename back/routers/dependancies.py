import os
from fastapi import HTTPException

GITHUB_API = "https://api.github.com"


def get_headers():
    token = os.getenv("GITHUB_TOKEN", "").strip()
    if not token:
        raise HTTPException(status_code=500, detail="Missing GitHub token in environment")
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }