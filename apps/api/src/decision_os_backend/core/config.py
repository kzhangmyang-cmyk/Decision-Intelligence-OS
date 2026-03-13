from __future__ import annotations

import json
from functools import lru_cache
from typing import Any, Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _parse_env_list(value: Any) -> Any:
    if value is None:
        return []

    if isinstance(value, str):
        raw_value = value.strip()

        if not raw_value:
            return []

        if raw_value.startswith("["):
            return json.loads(raw_value)

        return [item.strip() for item in raw_value.split(",") if item.strip()]

    return value


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = Field(default="Astrological Decision Simulator Backend", alias="APP_NAME")
    environment: Literal["local", "development", "staging", "production"] = Field(
        default="local",
        alias="ENVIRONMENT",
    )
    debug: bool = Field(default=True, alias="DEBUG")
    version: str = Field(default="0.1.0", alias="VERSION")

    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")
    docs_url: str | None = Field(default="/docs", alias="DOCS_URL")
    redoc_url: str | None = Field(default="/redoc", alias="REDOC_URL")

    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/decision_os",
        alias="DATABASE_URL",
    )
    sql_echo: bool = Field(default=False, alias="SQL_ECHO")

    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"], alias="CORS_ORIGINS")
    cors_allow_credentials: bool = Field(default=True, alias="CORS_ALLOW_CREDENTIALS")
    cors_allow_methods: list[str] = Field(default_factory=lambda: ["*"], alias="CORS_ALLOW_METHODS")
    cors_allow_headers: list[str] = Field(default_factory=lambda: ["*"], alias="CORS_ALLOW_HEADERS")

    @field_validator("cors_origins", "cors_allow_methods", "cors_allow_headers", mode="before")
    @classmethod
    def parse_list_fields(cls, value: Any) -> Any:
        return _parse_env_list(value)


@lru_cache
def get_settings() -> Settings:
    return Settings()
