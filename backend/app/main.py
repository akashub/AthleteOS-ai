from fastapi import FastAPI
from .routers import users
from .routers import ai
from .routers import workouts

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to Hybreed.ai backend!"}

app.include_router(users.router)
app.include_router(ai.router)
app.include_router(workouts.router) 