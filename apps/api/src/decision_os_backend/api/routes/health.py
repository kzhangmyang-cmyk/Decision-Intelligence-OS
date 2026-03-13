from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends

from decision_os_backend.core.config import Settings, get_settings
from decision_os_backend.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse, summary="Health check")
def health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        environment=settings.environment,
        version=settings.version,
        timestamp=datetime.now(timezone.utc),
    )
