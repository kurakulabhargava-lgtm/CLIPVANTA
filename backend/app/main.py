from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.projects import router as projects_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite/Postgres tables on startup
    await init_db()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Autonomous AI Video Production and Clipping Pipeline",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static media serving for rendered clips
app.mount("/media/clips", StaticFiles(directory=str(settings.CLIPS_DIR)), name="clips")

# Register routes
app.include_router(projects_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV
    }
