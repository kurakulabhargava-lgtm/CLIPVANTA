import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "ClipVanta"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    STORAGE_DIR: Path = BASE_DIR / "storage"
    UPLOAD_DIR: Path = BASE_DIR / "storage" / "uploads"
    AUDIO_DIR: Path = BASE_DIR / "storage" / "audio"
    CLIPS_DIR: Path = BASE_DIR / "storage" / "clips"

    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/storage/clipvanta.db"

    LLM_PROVIDER: str = "local"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    DEFAULT_TTS_VOICE: str = "en-US-ChristopherNeural"
    DEFAULT_TTS_RATE: str = "+0%"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
for folder in [settings.STORAGE_DIR, settings.UPLOAD_DIR, settings.AUDIO_DIR, settings.CLIPS_DIR]:
    folder.mkdir(parents=True, exist_ok=True)
