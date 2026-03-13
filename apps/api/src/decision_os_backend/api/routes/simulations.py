from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from decision_os_backend.api.deps import SimulationServiceDep
from decision_os_backend.schemas.simulation import (
    CompanyDetailRead,
    CompanyTimelineRead,
    SimulationCompanyListRead,
    SimulationOverviewRead,
)
from decision_os_backend.services.errors import NotFoundError

router = APIRouter(tags=["simulations"])


def _not_found(exc: NotFoundError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/simulations/{simulation_id}", response_model=SimulationOverviewRead, summary="Get simulation overview")
def get_simulation(simulation_id: UUID, simulation_service: SimulationServiceDep) -> SimulationOverviewRead:
    try:
        return simulation_service.get_overview(simulation_id)
    except NotFoundError as exc:
        raise _not_found(exc) from exc


@router.get(
    "/simulations/{simulation_id}/companies",
    response_model=SimulationCompanyListRead,
    summary="List simulation companies",
)
def get_simulation_companies(
    simulation_id: UUID,
    simulation_service: SimulationServiceDep,
) -> SimulationCompanyListRead:
    try:
        return simulation_service.list_companies(simulation_id)
    except NotFoundError as exc:
        raise _not_found(exc) from exc


@router.get("/companies/{company_id}", response_model=CompanyDetailRead, summary="Get company detail")
def get_company(company_id: UUID, simulation_service: SimulationServiceDep) -> CompanyDetailRead:
    try:
        return simulation_service.get_company_detail(company_id)
    except NotFoundError as exc:
        raise _not_found(exc) from exc


@router.get("/companies/{company_id}/timeline", response_model=CompanyTimelineRead, summary="Get company timeline")
def get_company_timeline(company_id: UUID, simulation_service: SimulationServiceDep) -> CompanyTimelineRead:
    try:
        return simulation_service.get_company_timeline(company_id)
    except NotFoundError as exc:
        raise _not_found(exc) from exc
