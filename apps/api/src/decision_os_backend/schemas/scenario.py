from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import Field

from decision_os_backend.schemas.common import APISchema


class ScenarioCreate(APISchema):
    one_line_pitch: str = Field(min_length=1)
    structured_inputs: dict[str, Any] = Field(default_factory=dict)


class ScenarioRead(APISchema):
    id: UUID
    one_line_pitch: str
    structured_inputs: dict[str, Any]
    created_at: datetime
    updated_at: datetime
