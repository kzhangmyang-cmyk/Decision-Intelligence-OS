from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from decision_os_backend.models.scenario import Scenario
from decision_os_backend.schemas.scenario import ScenarioCreate
from decision_os_backend.services.errors import NotFoundError


class ScenarioService:
    """Handles scenario persistence and retrieval."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: ScenarioCreate) -> Scenario:
        scenario = Scenario(
            one_line_pitch=payload.one_line_pitch,
            structured_inputs=payload.structured_inputs,
        )
        self.db.add(scenario)
        self.db.commit()
        self.db.refresh(scenario)
        return scenario

    def get(self, scenario_id: UUID) -> Scenario | None:
        statement = select(Scenario).where(Scenario.id == scenario_id)
        return self.db.scalar(statement)

    def get_or_raise(self, scenario_id: UUID) -> Scenario:
        scenario = self.get(scenario_id)
        if scenario is None:
            raise NotFoundError(f"Scenario '{scenario_id}' was not found.")
        return scenario
