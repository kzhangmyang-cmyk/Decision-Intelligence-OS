from __future__ import annotations

from collections.abc import Mapping
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from decision_os_backend.models.decision_assessment import DecisionAssessment
from decision_os_backend.models.scenario import Scenario
from decision_os_backend.services.decision_engine import RuleBasedDecisionEngine
from decision_os_backend.services.decision_engine.types import DecisionEngineResult
from decision_os_backend.services.errors import NotFoundError


class AssessmentService:
    """Coordinates rule-based decision assessment workflows for V1."""

    def __init__(self, db: Session, engine: RuleBasedDecisionEngine | None = None) -> None:
        self.db = db
        self.engine = engine or RuleBasedDecisionEngine()

    def assess(self, one_line_pitch: str, structured_inputs: Mapping[str, Any] | None = None) -> DecisionEngineResult:
        return self.engine.evaluate(one_line_pitch=one_line_pitch, structured_inputs=structured_inputs)

    def assess_scenario(self, scenario: Scenario) -> DecisionEngineResult:
        return self.assess(one_line_pitch=scenario.one_line_pitch, structured_inputs=scenario.structured_inputs)

    def build_assessment_model(self, scenario: Scenario) -> DecisionAssessment:
        result = self.assess_scenario(scenario)
        return DecisionAssessment(
            scenario_id=scenario.id,
            viability_score=result.viability_score,
            dimension_scores=[item.model_dump(by_alias=False) for item in result.dimension_scores],
            data_sufficiency=result.data_sufficiency,
            confidence=result.confidence,
            top_risks=[item.model_dump(by_alias=False) for item in result.top_risks],
            top_levers=[item.model_dump(by_alias=False) for item in result.top_levers],
            suggested_paths=[item.model_dump(by_alias=False) for item in result.suggested_paths],
            next_best_experiments=[item.model_dump(by_alias=False) for item in result.next_best_experiments],
        )

    def create_for_scenario(self, scenario: Scenario) -> DecisionAssessment:
        assessment = self.build_assessment_model(scenario)
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    def get_latest_for_scenario(self, scenario_id: UUID) -> DecisionAssessment:
        statement = (
            select(DecisionAssessment)
            .where(DecisionAssessment.scenario_id == scenario_id)
            .order_by(DecisionAssessment.created_at.desc())
            .limit(1)
        )
        assessment = self.db.scalar(statement)
        if assessment is None:
            raise NotFoundError(f"No assessment found for scenario '{scenario_id}'.")
        return assessment

    def get_latest_for_scenario_or_none(self, scenario_id: UUID) -> DecisionAssessment | None:
        statement = (
            select(DecisionAssessment)
            .where(DecisionAssessment.scenario_id == scenario_id)
            .order_by(DecisionAssessment.created_at.desc())
            .limit(1)
        )
        return self.db.scalar(statement)
