# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from database import engine, Base  # Add Base
from models import Video  # Import your models
from routers import video, chat, search, timestamps  # Import the video, chat, search, and timestamps routers

# Create tables on startup (for development only, Alembic handles migrations)
# This is a simple way to ensure tables are created when the app starts.
# For production, you'd rely on Alembic migrations.
async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(title="Video Chat App API")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the video router
app.include_router(video.router)
# Include the chat router
app.include_router(chat.router)
# Include the search router
app.include_router(search.router)
# Include the timestamps router
app.include_router(timestamps.router)

@app.on_event("startup")
async def on_startup():
    await create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Welcome to the Video Chat App API"}

# Placeholder for API routers
# from .routers import video, chat, search
# app.include_router(video.router, prefix="/api/video", tags=["video"])
# app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
# app.include_router(search.router, prefix="/api/search", tags=["search"])

# For development: run with uvicorn main:app --reload