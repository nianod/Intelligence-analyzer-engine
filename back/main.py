from fastapi import FastAPI, HTTPException, Header, Body
import httpx
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

GITHUB_API = "https://api.github.com"

class RepoUpdate(BaseModel):
   description: Optional[str] = None
   homepage: Optional[str] = None
   private: Optional[str] = None

# --- Helpers for Headers---
def get_headers(token: str):
   return{
      "Authorization": f"token {token}",
      "Accept" : "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28"
   }

@app.get('/')
async def landing():
    return{"message": "Hello from FastAPI"}

 
@app.get("/repo/{owner}/{repo}")
async def get_repo_details(owner: str, repo: str, token: str = Header(...)):
    """Fetch description, stars, forks, and language."""
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{GITHUB_API}/repos/{owner}/{repo}", headers=get_headers(token))
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail=res.json())
        
        data = res.json()
        return {
            "name": data["name"],
            "description": data["description"],
            "stars": data["stargazers_count"],
            "forks": data["forks_count"],
            "language": data["language"],
            "url": data["html_url"]
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

