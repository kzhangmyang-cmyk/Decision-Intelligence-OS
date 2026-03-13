from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload

from decision_os_backend.models.decision_assessment import DecisionAssessment
from decision_os_backend.models.enums import ExperimentPlanDecision
from decision_os_backend.models.experiment_plan import ExperimentPlan
from decision_os_backend.models.scenario import Scenario
from decision_os_backend.models.simulation_run import SimulationRun
from decision_os_backend.models.virtual_company import VirtualCompany
from decision_os_backend.schemas.planner import (
    ExperimentPlanRead,
    PlannerCheckpointRead,
    PlannerRead,
    PlannerStageRead,
)
from decision_os_backend.services.errors import ConflictError, NotFoundError
from decision_os_backend.services.simulation_aggregator import SimulationAggregator


STAGE_SEQUENCE = [
    (0, "Day 1"),
    (1, "Week 1"),
    (2, "Month 1"),
    (3, "Month 3"),
    (4, "Month 6"),
]


@dataclass(slots=True)
class PlannerContext:
    scenario: Scenario
    assessment: DecisionAssessment
    simulation: SimulationRun
    survival_rate: float
    profitability_rate: float
    top_death_reason: str
    top_strategy: str
    top_founder_type: str


class PlannerService:
    """Builds a rule-driven execution plan from assessment and simulation outputs."""

    def __init__(self, db: Session, aggregator: SimulationAggregator | None = None) -> None:
        self.db = db
        self.aggregator = aggregator or SimulationAggregator()

    def get_or_create_planner(self, scenario_id: UUID) -> PlannerRead:
        context = self._build_context(scenario_id)
        blueprint = self._build_planner(context)
        self._sync_experiment_plans(scenario_id, blueprint)
        return self._attach_plan_items(scenario_id, blueprint)

    def _build_context(self, scenario_id: UUID) -> PlannerContext:
        scenario = self.db.scalar(select(Scenario).where(Scenario.id == scenario_id))
        if scenario is None:
            raise NotFoundError(f"Scenario '{scenario_id}' was not found.")

        assessment = self.db.scalar(
            select(DecisionAssessment)
            .where(DecisionAssessment.scenario_id == scenario_id)
            .order_by(DecisionAssessment.created_at.desc())
            .limit(1)
        )
        if assessment is None:
            raise ConflictError("Planner requires an assessment before it can generate actions.")

        simulation = self.db.scalar(
            select(SimulationRun)
            .where(SimulationRun.scenario_id == scenario_id)
            .order_by(SimulationRun.created_at.desc())
            .options(selectinload(SimulationRun.virtual_companies).selectinload(VirtualCompany.monthly_snapshots))
            .limit(1)
        )
        if simulation is None:
            raise ConflictError("Planner requires a simulation run before it can generate staged recommendations.")

        overview = self.aggregator.build_overview(simulation)
        survival_rate = overview.survival_curve[-1].value if overview.survival_curve else 0.0
        profitability_rate = overview.profitability_curve[-1].value if overview.profitability_curve else 0.0
        top_death_reason = overview.death_reason_distribution[0].label if overview.death_reason_distribution else "unknown"
        top_strategy = overview.strategy_type_performance[0].label if overview.strategy_type_performance else "focused strategy"
        top_founder_type = overview.founder_type_performance[0].label if overview.founder_type_performance else "hybrid"

        return PlannerContext(
            scenario=scenario,
            assessment=assessment,
            simulation=simulation,
            survival_rate=survival_rate,
            profitability_rate=profitability_rate,
            top_death_reason=top_death_reason,
            top_strategy=top_strategy,
            top_founder_type=top_founder_type,
        )

    def _build_planner(self, context: PlannerContext) -> PlannerRead:
        viability = context.assessment.viability_score
        confidence = context.assessment.confidence
        top_risk = self._first_title(context.assessment.top_risks)
        top_lever = self._first_title(context.assessment.top_levers)
        top_path = self._first_title(context.assessment.suggested_paths, field="title")

        stages = [
            self._build_day_one(context),
            self._build_week_one(context),
            self._build_month_one(context),
            self._build_month_three(context),
            self._build_month_six(context),
        ]

        return PlannerRead(
            scenario_id=context.scenario.id,
            headline="Turn assessment and simulation into a staged action system.",
            summary=(
                f"The scenario scores {viability:.1f}/100 with {confidence:.1f} confidence. "
                f"Simulation favors {context.top_strategy} while warning that {context.top_death_reason} is the dominant failure mode."
            ),
            primary_bet=top_lever or top_path or context.top_strategy,
            planning_north_star="Reach repeatable paid signal before burn or complexity outpaces learning.",
            failure_pattern=top_risk or context.top_death_reason,
            stages=stages,
        )

    def _build_day_one(self, context: PlannerContext) -> PlannerStageRead:
        return PlannerStageRead(
            id="day-1",
            stage_label="Day 1",
            stage_order=0,
            title="Lock the wedge and make the startup legible.",
            objective="Reduce ambiguity in user, pain, and promise before more execution branches appear.",
            recommended_actions=[
                "Rewrite the one-line pitch so it names one user segment and one high-cost pain.",
                "Write down the primary no-go failure pattern the product is designed to prevent.",
            ],
            checkpoints=[
                PlannerCheckpointRead(
                    metric="Positioning clarity",
                    current_signal=f"Current top risk: {self._first_title(context.assessment.top_risks)}",
                    success_threshold="One audience, one pain, one value promise.",
                    note="If the idea still sounds broad, the wedge is not ready for scale-oriented execution.",
                    tone="cyan",
                )
            ],
            adjustment_advice="If clarity is still weak, narrow the ICP and cut one product promise before moving to pricing tests.",
            decision=ExperimentPlanDecision.GO if context.assessment.viability_score >= 55 else ExperimentPlanDecision.ADJUST,
            decision_reason="The system should move only once the wedge is explicit enough to survive contact with the market.",
            tone="cyan",
        )

    def _build_week_one(self, context: PlannerContext) -> PlannerStageRead:
        monetization_score = self._dimension_score(context.assessment, "Monetization")
        return PlannerStageRead(
            id="week-1",
            stage_label="Week 1",
            stage_order=1,
            title="Pressure-test willingness to pay.",
            objective="Convert conceptual interest into explicit buying signal before deepening delivery complexity.",
            recommended_actions=[
                "Run 10 structured pricing conversations with high-fit prospects.",
                "Sell the outcome, not the dashboard or workflow internals.",
            ],
            checkpoints=[
                PlannerCheckpointRead(
                    metric="Paid pilot intent",
                    current_signal=f"Monetization score is {monetization_score:.1f}/100.",
                    success_threshold="At least 4 of 10 prospects accept a paid pilot range or equivalent commitment.",
                    note="This is the fastest way to test whether the opportunity deserves continued capital and founder time.",
                    tone="emerald",
                )
            ],
            adjustment_advice="If nobody pays, shift the pitch toward a more expensive problem or tighter niche before building more product.",
            decision=ExperimentPlanDecision.GO if monetization_score >= 50 else ExperimentPlanDecision.ADJUST,
            decision_reason="Pricing proof is still the key gate between plausible and actually valuable.",
            tone="emerald",
        )

    def _build_month_one(self, context: PlannerContext) -> PlannerStageRead:
        return PlannerStageRead(
            id="month-1",
            stage_label="Month 1",
            stage_order=2,
            title="Run a manual but disciplined delivery loop.",
            objective="Learn through real customers while preventing the business from collapsing into bespoke consulting.",
            recommended_actions=[
                "Deliver the first cohort through a strict template instead of custom branches.",
                "Track delivery effort, customer friction, and whether outputs change a real decision.",
            ],
            checkpoints=[
                PlannerCheckpointRead(
                    metric="Operational repeatability",
                    current_signal=f"Top simulation failure mode: {context.top_death_reason}.",
                    success_threshold="Founder hours per delivery stay low enough to preserve margin and energy.",
                    note="If delivery expands faster than learning, the line drifts toward service drag or collapse.",
                    tone="amber",
                ),
                PlannerCheckpointRead(
                    metric="Decision usefulness",
                    current_signal="Assessment says the opportunity is viable only under disciplined execution.",
                    success_threshold="Customers report that the output directly changes a real product or go-to-market decision.",
                    note="If the work is interesting but not decisive, the value proposition is still weak.",
                    tone="cyan",
                ),
            ],
            adjustment_advice="If backlog or delivery strain rises quickly, cut optional output scope and standardize the workflow harder.",
            decision=ExperimentPlanDecision.ADJUST,
            decision_reason="Month 1 is where many lines first encounter delivery drag, so this stage should be treated as a correction-heavy period.",
            tone="amber",
        )

    def _build_month_three(self, context: PlannerContext) -> PlannerStageRead:
        return PlannerStageRead(
            id="month-3",
            stage_label="Month 3",
            stage_order=3,
            title="Automate the winning loop, not the whole vision.",
            objective="Translate repeated workflow steps into product leverage only after they demonstrate repeatability.",
            recommended_actions=[
                f"Double down on the strongest simulated strategy pattern: {context.top_strategy}.",
                "Automate intake, parsing, and recurring workflow steps that already repeat across customers.",
            ],
            checkpoints=[
                PlannerCheckpointRead(
                    metric="Month-12 survival benchmark",
                    current_signal=f"Latest simulated survival rate is {context.survival_rate:.1f}%.",
                    success_threshold="The current operating loop improves survivability relative to the baseline cohort.",
                    note="If survivability does not improve as the workflow tightens, the loop may still be structurally weak.",
                    tone="cyan",
                ),
                PlannerCheckpointRead(
                    metric="Automation payoff",
                    current_signal=f"Most successful founder archetype: {context.top_founder_type}.",
                    success_threshold="Automation reduces workload or improves gross margin without lowering quality.",
                    note="Automation that increases complexity without economic relief is a trap, not leverage.",
                    tone="emerald",
                ),
            ],
            adjustment_advice="If automation adds cost but not repeatability, revert to the smaller loop and keep the business human-assisted longer.",
            decision=ExperimentPlanDecision.GO if context.survival_rate >= 25 else ExperimentPlanDecision.ADJUST,
            decision_reason="This stage should only scale the parts of the system that already show evidence of compounding.",
            tone="cyan",
        )

    def _build_month_six(self, context: PlannerContext) -> PlannerStageRead:
        stop_condition = context.survival_rate < 15 or context.profitability_rate < 10
        decision = (
            ExperimentPlanDecision.STOP
            if stop_condition
            else ExperimentPlanDecision.ADJUST
            if context.profitability_rate < 25
            else ExperimentPlanDecision.GO
        )
        return PlannerStageRead(
            id="month-6",
            stage_label="Month 6",
            stage_order=4,
            title="Make the scale / specialize / stop decision explicit.",
            objective="Use simulated survival and profitability evidence to choose the next irreversible move instead of drifting forward by habit.",
            recommended_actions=[
                "Review retention, CAC, contribution margin, and founder workload together rather than in isolation.",
                "Write a go / adjust / stop memo before adding new channels, headcount, or product surface area.",
            ],
            checkpoints=[
                PlannerCheckpointRead(
                    metric="Profitability trajectory",
                    current_signal=f"Latest simulated profitability rate is {context.profitability_rate:.1f}%.",
                    success_threshold="A meaningful share of worldlines becomes profitable without founder collapse.",
                    note="Weak profitability this late suggests the model is still structurally fragile.",
                    tone="amber",
                ),
                PlannerCheckpointRead(
                    metric="Failure avoidance",
                    current_signal=f"Primary failure pattern remains {context.top_death_reason}.",
                    success_threshold="The real operating line should show evidence that this dominant failure mode is being avoided.",
                    note="If the same failure pattern is still present, scaling is premature.",
                    tone="rose" if stop_condition else "cyan",
                ),
            ],
            adjustment_advice="If the business still needs heavy founder heroics or acquisition remains economically negative, stop expansion and either specialize deeper or kill the line.",
            decision=decision,
            decision_reason="Month 6 is the forced capital-allocation checkpoint: scale only if the economics and execution loop are both improving.",
            tone="rose" if decision == ExperimentPlanDecision.STOP else "amber" if decision == ExperimentPlanDecision.ADJUST else "emerald",
        )

    def _sync_experiment_plans(self, scenario_id: UUID, planner: PlannerRead) -> None:
        self.db.execute(delete(ExperimentPlan).where(ExperimentPlan.scenario_id == scenario_id))

        for stage in planner.stages:
            metric = stage.checkpoints[0].metric if stage.checkpoints else "signal"
            threshold = stage.checkpoints[0].success_threshold if stage.checkpoints else "n/a"
            actions = stage.recommended_actions or [stage.title]
            for action in actions:
                self.db.add(
                    ExperimentPlan(
                        scenario_id=scenario_id,
                        stage_order=stage.stage_order,
                        stage_label=stage.stage_label,
                        action=action,
                        metric=metric,
                        threshold=threshold,
                        fallback_suggestion=stage.adjustment_advice,
                        decision=stage.decision,
                    )
                )

        self.db.commit()

    def _attach_plan_items(self, scenario_id: UUID, planner: PlannerRead) -> PlannerRead:
        items = self.db.scalars(
            select(ExperimentPlan)
            .where(ExperimentPlan.scenario_id == scenario_id)
            .order_by(ExperimentPlan.stage_order.asc(), ExperimentPlan.created_at.asc(), ExperimentPlan.id.asc())
        ).all()

        stages = [
            stage.model_copy(
                update={
                    "items": [
                        ExperimentPlanRead.model_validate(item)
                        for item in items
                        if item.stage_order == stage.stage_order and item.stage_label == stage.stage_label
                    ]
                }
            )
            for stage in planner.stages
        ]

        return planner.model_copy(update={"stages": stages})

    def _dimension_score(self, assessment: DecisionAssessment, label: str) -> float:
        for item in assessment.dimension_scores:
            if str(item.get("label", "")).lower() == label.lower():
                return float(item.get("score", 0.0))
        return 0.0

    def _first_title(self, items: list[dict[str, object]], field: str = "title") -> str:
        if not items:
            return ""
        return str(items[0].get(field, ""))
