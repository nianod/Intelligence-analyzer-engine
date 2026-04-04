from fastapi import FastAPI
 

app = FastAPI()

@app.get('/')
async def landing():
    return{"message": "Hello from FastAPI"}
