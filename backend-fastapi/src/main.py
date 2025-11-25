from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from src.routers import apod
from src.config.settings import get_settings
from src.utils.cache import cache
from src.models.apod import HealthResponse

settings = get_settings()

app = FastAPI(
    title="NASA APOD Explorer API",
    description="Backend API for NASA Astronomy Picture of the Day Explorer - Built with FastAPI",
    version="4.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(apod.router)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "NASA APOD Explorer API",
        "version": "4.0.0",
        "framework": "FastAPI",
        "endpoints": {
            "health": "/api/health",
            "today": "/api/apod/today",
            "by_date": "/api/apod/by-date?date=YYYY-MM-DD",
            "recent": "/api/apod/recent?days=N"
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with cache statistics"""
    return {
        "status": "ok",
        "cache_size": cache.size(),
        "timestamp": datetime.now().isoformat()
    }
