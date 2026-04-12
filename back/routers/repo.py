from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import httpx

from routers.dependancies import get_headers, GITHUB_API

router = APIRouter(prefix="/repo", tags=["Repository"])


class RepoUpdate(BaseModel):
    description: Optional[str] = None
    homepage: Optional[str] = None
    private: Optional[str] = None


@router.get("/{owner}/{repo}")
async def get_repo_details(owner: str, repo: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}",
            headers=get_headers(),
        )
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail=res.json())

        data = res.json()
        return {
        
            "id": data["id"],
            "name": data["name"],
            "full_name": data["full_name"],
            "description": data["description"],
            "url": data["html_url"],
            "private": data["private"],
            "fork": data["fork"],

     
            "stars": data["stargazers_count"],
            "watchers": data["watchers_count"],
            "forks": data["forks_count"],
            "open_issues": data["open_issues_count"],
            "size_kb": data["size"],

         
            "language": data["language"],
            "topics": data["topics"],

   
            "created_at": data["created_at"],
            "updated_at": data["updated_at"],
            "pushed_at": data["pushed_at"],

 
            "owner": {
                "username": data["owner"]["login"],
                "avatar": data["owner"]["avatar_url"],
                "profile": data["owner"]["html_url"],
                "type": data["owner"]["type"],
            },

  
            "default_branch": data["default_branch"],
            "has_issues": data["has_issues"],
            "has_wiki": data["has_wiki"],
            "has_projects": data["has_projects"],
            "has_downloads": data["has_downloads"],
            "archived": data["archived"],
            "disabled": data["disabled"],

 
            "license": data["license"]["name"] if data.get("license") else None,
        }


@router.patch("/{owner}/{repo}")
async def update_repo(owner: str, repo: str, details: RepoUpdate):
    """Update repository description or settings."""
    async with httpx.AsyncClient() as client:
        res = await client.patch(
            f"{GITHUB_API}/repos/{owner}/{repo}",
            headers=get_headers(),
            json=details.dict(exclude_unset=True),
        )
        return res.json()


@router.put("/{owner}/{repo}/star")
async def star_repo(owner: str, repo: str):
    """Star a repository."""
    async with httpx.AsyncClient() as client:
        res = await client.put(
            f"{GITHUB_API}/user/starred/{owner}/{repo}",
            headers={**get_headers(), "Content-Length": "0"},
        )
        if res.status_code == 204:
            return {"message": f"Successfully starred {owner}/{repo}"}
        raise HTTPException(status_code=res.status_code, detail="Could not star repository")


@router.post("/{owner}/{repo}/fork")
async def fork_repo(owner: str, repo: str):
    """Fork a repository to your account."""
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{GITHUB_API}/repos/{owner}/{repo}/forks",
            headers=get_headers(),
        )
        if res.status_code == 202:
            return {"message": "Forking in progress", "url": res.json()["html_url"]}
        raise HTTPException(status_code=res.status_code, detail="Fork failed")