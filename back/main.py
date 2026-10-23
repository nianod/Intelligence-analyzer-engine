from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import repo, security, techStack
from services import live, aifootprint
from routers import archtecture_analysis
from routers import documentation_test
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://analyzer-engine.top", "http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(repo.router)
app.include_router(security.router)
app.include_router(live.router)
app.include_router(techStack.router)
app.include_router(aifootprint.router)
app.include_router(archtecture_analysis.router)
app.include_router(documentation_test.router)


@app.get("/")
async def landing():
    return {"message": "Hello from FastAPI"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

