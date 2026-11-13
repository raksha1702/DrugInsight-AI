"""Application configuration using Pydantic Settings."""

import os
from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration for DrugInsight AI."""

    PROJECT_NAME: str = "DrugInsight AI Backend"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "druginsight-super-secret-development-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./druginsight.db"
    SYNC_DATABASE_URL: str = "sqlite:///./druginsight.db"

    # Redis & Background Workers
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # External APIs
    DAILYMED_API_BASE_URL: str = "https://dailymed.nlm.nih.gov/dailymed/services/v2"
    OPENFDA_API_BASE_URL: str = "https://api.fda.gov/drug"
    OPENFDA_API_KEY: Optional[str] = None

    # AI & Embeddings
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"

    # File & Artifact Storage
    ARTIFACTS_DIR: str = "./artifacts"
    DOCUMENT_STORAGE_PATH: str = "./artifacts/documents"
    REPORT_STORAGE_PATH: str = "./artifacts/reports"
    MODEL_STORAGE_PATH: str = "./artifacts/models"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://localhost:4173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def CORS_ORIGINS(self) -> List[str]:
        return self.cors_origins


settings = Settings()
