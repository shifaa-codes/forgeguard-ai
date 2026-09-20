import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.cors import setup_cors
from app.api.routes import health, standard, inspection, dashboard, analytics

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


def create_app() -> FastAPI:
    app = FastAPI(
        title="ForgeGuard AI",
        description="AI-Powered Manufacturing Quality Inspection API",
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    setup_cors(app)

    # Serve uploaded images statically
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

    # Routers
    prefix = settings.API_PREFIX
    app.include_router(health.router, prefix=prefix)
    app.include_router(standard.router, prefix=prefix)
    app.include_router(inspection.router, prefix=prefix)
    app.include_router(dashboard.router, prefix=prefix)
    app.include_router(analytics.router, prefix=prefix)

    # Global exception handler — never leak stack traces
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logging.exception("Unhandled: %s", exc)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "Internal server error"},
        )

    @app.on_event("startup")
    async def on_startup():
        logging.info("ForgeGuard AI backend starting...")
        from app.services.yolo_detector import detector
        detector.load_model()
        logging.info("Model mode: %s", detector.mode)

    @app.on_event("shutdown")
    async def on_shutdown():
        logging.info("ForgeGuard AI backend shutting down...")

    return app


app = create_app()