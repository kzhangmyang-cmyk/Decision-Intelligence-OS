from fastapi import APIRouter

from decision_os_backend.api.routes import ROUTE_REGISTRY

api_router = APIRouter()
for route in ROUTE_REGISTRY:
    api_router.include_router(route)
