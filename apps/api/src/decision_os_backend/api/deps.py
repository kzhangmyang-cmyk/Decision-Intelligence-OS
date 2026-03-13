from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from decision_os_backend.db.session import get_db
from decision_os_backend.services.assessment_service import AssessmentService
from decision_os_backend.services.planner_service import PlannerService
from decision_os_backend.services.scenario_service import ScenarioService
from decision_os_backend.services.simulation_service import SimulationService

DBSession = Annotated[Session, Depends(get_db)]


def get_scenario_service(db: DBSession) -> ScenarioService:
    return ScenarioService(db=db)


def get_assessment_service(db: DBSession) -> AssessmentService:
    return AssessmentService(db=db)


def get_simulation_service(db: DBSession) -> SimulationService:
    return SimulationService(db=db)


def get_planner_service(db: DBSession) -> PlannerService:
    return PlannerService(db=db)


ScenarioServiceDep = Annotated[ScenarioService, Depends(get_scenario_service)]
AssessmentServiceDep = Annotated[AssessmentService, Depends(get_assessment_service)]
SimulationServiceDep = Annotated[SimulationService, Depends(get_simulation_service)]
PlannerServiceDep = Annotated[PlannerService, Depends(get_planner_service)]
