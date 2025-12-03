import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Config Lama (Gemini) - Tetap disimpan
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "")
    API_SECRET_TOKEN: str = os.getenv("API_SECRET_TOKEN", "")

    class Config:
        env_file = ".env"


settings = Settings()
