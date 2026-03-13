from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from decision_os_backend import __version__
from decision_os_backend.api.router import api_router
from decision_os_backend.api.routes.health import router as health_router
from decision_os_backend.core.config import get_settings


def create_application() -> FastAPI:
    settings = get_settings()

    application = FastAPI(
        title=settings.app_name,
        version=__version__,
        debug=settings.debug,
        docs_url=settings.docs_url,
        redoc_url=settings.redoc_url,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    application.include_router(health_router)
    application.include_router(api_router, prefix=settings.api_v1_prefix)

    return application


app = create_application()
