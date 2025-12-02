import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "")

    class Config:
        env_file = ".env"


settings = Settings()
