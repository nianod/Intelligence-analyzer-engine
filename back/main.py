from fastapi import FastAPI, HTTPException, Header, Body
import httpx
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware  
import os
from dotenv import load_dotenv


load_dotenv()
GITHUB_TOKEN=os.getenv('GITHUB_TOKEN')
GITHUB_API = "https://api.github.com"
app = FastAPI()


app.add_middleware(
    CORSMiddleware,                                 
    allow_origins=['http://localhost:3000'],                        
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*']
)




class RepoUpdate(BaseModel):
   description: Optional[str] = None
   homepage: Optional[str] = None
   private: Optional[str] = None


# --- Helpers for Headers---
 

@app.get('/')
async def landing():
    return{"message": "Hello from FastAPI"}
   # print('Everythig is set. Lets Goooooooooooooooooooooo')


 
def get_headers():
    if not GITHUB_TOKEN or not GITHUB_TOKEN.strip():
        raise HTTPException(status_code=500, detail="Missing GitHub token in environment")

    return {
        "Authorization": f"Bearer {GITHUB_TOKEN.strip()}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

@app.get("/repo/{owner}/{repo}")
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
            # Basic info
            "id": data["id"],
            "name": data["name"],
            "full_name": data["full_name"],
            "description": data["description"],
            "url": data["html_url"],
            "private": data["private"],
            "fork": data["fork"],


            # Stats
            "stars": data["stargazers_count"],
            "watchers": data["watchers_count"],
            "forks": data["forks_count"],
            "open_issues": data["open_issues_count"],
            "size_kb": data["size"],


            # Language & topics
            "language": data["language"],
            "topics": data["topics"],


            # Dates
            "created_at": data["created_at"],
            "updated_at": data["updated_at"],
            "pushed_at": data["pushed_at"],


            # Owner
            "owner": {
                "username": data["owner"]["login"],
                "avatar": data["owner"]["avatar_url"],
                "profile": data["owner"]["html_url"],
                "type": data["owner"]["type"],  # User or Organization
            },


            # Repo settings
            "default_branch": data["default_branch"],
            "has_issues": data["has_issues"],
            "has_wiki": data["has_wiki"],
            "has_projects": data["has_projects"],
            "has_downloads": data["has_downloads"],
            "archived": data["archived"],
            "disabled": data["disabled"],


            # License
            "license": data["license"]["name"] if data.get("license") else None,
        }
@app.patch("/repo/{owner}/{repo}")
async def update_repo(owner: str, repo: str, details: RepoUpdate, token: str = Header(...)):
    """Update repository description or settings."""
    async with httpx.AsyncClient() as client:
        res = await client.patch(
            f"{GITHUB_API}/repos/{owner}/{repo}",
            headers=get_headers(token),
            json=details.dict(exclude_unset=True)
        )
        return res.json()


@app.put("/repo/{owner}/{repo}/star")
async def star_repo(owner: str, repo: str, token: str = Header(...)):
    """Star a repository (Requires 'public_repo' or 'repo' scope)."""
    async with httpx.AsyncClient() as client:
        # GitHub uses /user/starred/{owner}/{repo} for starring
        res = await client.put(
            f"{GITHUB_API}/user/starred/{owner}/{repo}",
            headers={**get_headers(token), "Content-Length": "0"}
        )
        if res.status_code == 204:
            return {"message": f"Successfully starred {owner}/{repo}"}
        raise HTTPException(status_code=res.status_code, detail="Could not star repository")


@app.post("/repo/{owner}/{repo}/fork")
async def fork_repo(owner: str, repo: str, token: str = Header(...)):
    """Fork a repository to your account."""
    async with httpx.AsyncClient() as client:
        res = await client.post(f"{GITHUB_API}/repos/{owner}/{repo}/forks", headers=get_headers(token))
        if res.status_code == 202:
            return {"message": "Forking in progress", "url": res.json()["html_url"]}
        raise HTTPException(status_code=res.status_code, detail="Fork failed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)