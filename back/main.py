from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI()
GITHUB_API = "https://api.github.com"

@app.get('/')
async def landing():
    return{"message": "Hello from FastAPI"}

@app.get("/github/{username}")
async def get_github_user(username: str):
    async with httpx.Asyncclient() as client:


# print(GITHUB_API)