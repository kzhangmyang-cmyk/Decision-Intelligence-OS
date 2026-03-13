from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from decision_os_backend.api.deps import AssessmentServiceDep, PlannerServiceDep, ScenarioServiceDep, SimulationServiceDep
from decision_os_backend.schemas.assessment import AssessmentRead
from decision_os_backend.schemas.planner import PlannerRead
from decision_os_backend.schemas.scenario import ScenarioCreate, ScenarioRead
from decision_os_backend.schemas.simulation import SimulationOverviewRead, SimulationRunCreate
from decision_os_backend.services.errors import ConflictError, NotFoundError

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


def _not_found(exc: NotFoundError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


def _conflict(exc: ConflictError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.post("", response_model=ScenarioRead, status_code=status.HTTP_201_CREATED, summary="Create scenario")
def create_scenario(payload: ScenarioCreate, scenario_service: ScenarioServiceDep) -> ScenarioRead:
    scenario = scenario_service.create(payload)
    return ScenarioRead.model_validate(scenario)


@router.get("/{scenario_id}", response_model=ScenarioRead, summary="Get scenario")
def get_scenario(scenario_id: UUID, scenario_service: ScenarioServiceDep) -> ScenarioRead:
    try:
        scenario = scenario_service.get_or_raise(scenario_id)
    except NotFoundError as exc:
        raise _not_found(exc) from exc
    return ScenarioRead.model_validate(scenario)


@router.post(
    "/{scenario_id}/assess",
    response_model=AssessmentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Run decision assessment",
)
def assess_scenario(
    scenario_id: UUID,
    scenario_service: ScenarioServiceDep,
    assessment_service: AssessmentServiceDep,
) -> AssessmentRead:
    try:
        scenario = scenario_service.get_or_raise(scenario_id)
        assessment = assessment_service.create_for_scenario(scenario)
    except NotFoundError as exc:
        raise _not_found(exc) from exc

    return AssessmentRead.model_validate(assessment)


@router.get("/{scenario_id}/assessment", response_model=AssessmentRead, summary="Get latest assessment")
def get_latest_assessment(
    scenario_id: UUID,
    scenario_service: ScenarioServiceDep,
    assessment_service: AssessmentServiceDep,
) -> AssessmentRead:
    try:
        scenario_service.get_or_raise(scenario_id)
        assessment = assessment_service.get_latest_for_scenario(scenario_id)
    except NotFoundError as exc:
        raise _not_found(exc) from exc

    return AssessmentRead.model_validate(assessment)


@router.post(
    "/{scenario_id}/simulate",
    response_model=SimulationOverviewRead,
    status_code=status.HTTP_201_CREATED,
    summary="Run simulation for scenario",
)
def simulate_scenario(
    scenario_id: UUID,
    payload: SimulationRunCreate,
    scenario_service: ScenarioServiceDep,
    assessment_service: AssessmentServiceDep,
    simulation_service: SimulationServiceDep,
) -> SimulationOverviewRead:
    try:
        scenario = scenario_service.get_or_raise(scenario_id)
        assessment = assessment_service.get_latest_for_scenario_or_none(scenario_id)
        simulation_run = simulation_service.run_for_scenario(
            scenario=scenario,
            assessment=assessment,
            company_count=payload.company_count,
            duration_months=payload.duration_months,
        )
    except NotFoundError as exc:
        raise _not_found(exc) from exc
    except ConflictError as exc:
        raise _conflict(exc) from exc

    return simulation_service.get_overview(simulation_run.id)


@router.get("/{scenario_id}/planner", response_model=PlannerRead, summary="Get scenario planner")
def get_planner(
    scenario_id: UUID,
    scenario_service: ScenarioServiceDep,
    planner_service: PlannerServiceDep,
) -> PlannerRead:
    try:
        scenario_service.get_or_raise(scenario_id)
        return planner_service.get_or_create_planner(scenario_id)
    except NotFoundError as exc:
        raise _not_found(exc) from exc
    except ConflictError as exc:
        raise _conflict(exc) from exc
