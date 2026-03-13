from decision_os_backend.api.routes.health import router as health_router
from decision_os_backend.api.routes.scenarios import router as scenarios_router
from decision_os_backend.api.routes.simulations import router as simulations_router

ROUTE_REGISTRY = (
    scenarios_router,
    simulations_router,
)

__all__ = ["health_router", "scenarios_router", "simulations_router", "ROUTE_REGISTRY"]
