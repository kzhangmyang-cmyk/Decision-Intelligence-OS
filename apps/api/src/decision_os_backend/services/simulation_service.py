from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from decision_os_backend.models.decision_assessment import DecisionAssessment
from decision_os_backend.models.enums import SimulationRunStatus
from decision_os_backend.models.monthly_snapshot import MonthlySnapshot
from decision_os_backend.models.scenario import Scenario
from decision_os_backend.models.simulation_run import SimulationRun
from decision_os_backend.models.virtual_company import VirtualCompany
from decision_os_backend.schemas.simulation import CompanyDetailRead, CompanyTimelineRead, SimulationCompanyListRead, SimulationOverviewRead
from decision_os_backend.services.errors import ConflictError, NotFoundError
from decision_os_backend.services.simulation_aggregator import SimulationAggregator
from decision_os_backend.services.simulation_engine.domain import SimulationContext
from decision_os_backend.services.simulation_engine.runner import SimulationRunner, to_snapshot_state_payload


class SimulationService:
    """Coordinates state-driven worldline simulation workflows for V1."""

    def __init__(
        self,
        db: Session,
        runner: SimulationRunner | None = None,
        aggregator: SimulationAggregator | None = None,
    ) -> None:
        self.db = db
        self.runner = runner or SimulationRunner()
        self.aggregator = aggregator or SimulationAggregator()

    def build_context(
        self,
        scenario: Scenario,
        assessment: DecisionAssessment,
        company_count: int = 100,
        duration_months: int = 12,
        seed: int = 7,
    ) -> SimulationContext:
        dimension_scores = {
            str(item.get("label", "unknown")).lower().replace(" ", "_"): float(item.get("score", 50.0))
            for item in assessment.dimension_scores
        }
        return SimulationContext(
            scenario_id=scenario.id,
            one_line_pitch=scenario.one_line_pitch,
            structured_inputs=scenario.structured_inputs,
            viability_score=assessment.viability_score,
            dimension_scores=dimension_scores,
            confidence=assessment.confidence,
            company_count=company_count,
            duration_months=duration_months,
            seed=seed,
        )

    def run_sync(
        self,
        scenario: Scenario,
        assessment: DecisionAssessment,
        company_count: int = 100,
        duration_months: int = 12,
        seed: int = 7,
    ) -> SimulationRun:
        simulation_run = SimulationRun(
            scenario_id=scenario.id,
            status=SimulationRunStatus.RUNNING,
            company_count=company_count,
            duration_months=duration_months,
        )
        self.db.add(simulation_run)
        self.db.flush()

        context = self.build_context(
            scenario=scenario,
            assessment=assessment,
            company_count=company_count,
            duration_months=duration_months,
            seed=seed,
        )
        execution = self.runner.run(context)

        for company_result in execution.companies:
            company_model = VirtualCompany(
                simulation_run_id=simulation_run.id,
                company_index=company_result.company.company_index,
                company_name=company_result.company.company_name,
                founder_type=company_result.company.founder_profile.archetype.value,
                pricing_strategy=company_result.company.strategy.pricing_strategy.value,
                channel_strategy=company_result.company.strategy.channel_strategy.value,
                final_stage=company_result.final_state.stage.value,
                final_outcome=company_result.final_state.final_outcome,
                death_reason=company_result.final_state.death_reason,
                summary=company_result.heartbeat_records[-1].judge_report.summary if company_result.heartbeat_records else None,
            )
            self.db.add(company_model)
            self.db.flush()

            for heartbeat in company_result.heartbeat_records:
                snapshot = MonthlySnapshot(
                    company_id=company_model.id,
                    month_index=heartbeat.month_index,
                    state_json=to_snapshot_state_payload(heartbeat),
                    judge_summary=heartbeat.judge_report.summary,
                )
                self.db.add(snapshot)

        simulation_run.status = SimulationRunStatus.COMPLETED
        self.db.commit()
        self.db.refresh(simulation_run)
        return simulation_run

    def run_for_scenario(
        self,
        scenario: Scenario,
        assessment: DecisionAssessment | None,
        company_count: int = 100,
        duration_months: int = 12,
        seed: int = 7,
    ) -> SimulationRun:
        if assessment is None:
            raise ConflictError("Scenario must have an assessment before simulation can run.")
        return self.run_sync(
            scenario=scenario,
            assessment=assessment,
            company_count=company_count,
            duration_months=duration_months,
            seed=seed,
        )

    def get_run_or_raise(self, simulation_id: UUID) -> SimulationRun:
        statement = (
            select(SimulationRun)
            .where(SimulationRun.id == simulation_id)
            .options(
                selectinload(SimulationRun.virtual_companies).selectinload(VirtualCompany.monthly_snapshots),
            )
        )
        simulation_run = self.db.scalar(statement)
        if simulation_run is None:
            raise NotFoundError(f"Simulation '{simulation_id}' was not found.")
        return simulation_run

    def get_company_or_raise(self, company_id: UUID) -> VirtualCompany:
        statement = (
            select(VirtualCompany)
            .where(VirtualCompany.id == company_id)
            .options(selectinload(VirtualCompany.monthly_snapshots))
        )
        company = self.db.scalar(statement)
        if company is None:
            raise NotFoundError(f"Company '{company_id}' was not found.")
        return company

    def get_overview(self, simulation_id: UUID) -> SimulationOverviewRead:
        simulation_run = self.get_run_or_raise(simulation_id)
        return self.aggregator.build_overview(simulation_run)

    def list_companies(self, simulation_id: UUID) -> SimulationCompanyListRead:
        simulation_run = self.get_run_or_raise(simulation_id)
        return self.aggregator.build_company_list(simulation_run)

    def get_company_detail(self, company_id: UUID) -> CompanyDetailRead:
        company = self.get_company_or_raise(company_id)
        return self.aggregator.build_company_detail(company)

    def get_company_timeline(self, company_id: UUID) -> CompanyTimelineRead:
        company = self.get_company_or_raise(company_id)
        return self.aggregator.build_company_timeline(company)
