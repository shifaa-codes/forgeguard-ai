from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import HealthResponse
from app.services.yolo_detector import detector

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health():
    detector.load_model()
    return HealthResponse(
        status="ok",
        service="ForgeGuard AI",
        version=settings.APP_VERSION,
        model_mode=detector.mode,
    )