from fastapi import APIRouter
from app.models.schemas import (
    DefectDistribution, SeverityDistribution, TrendPoint, QualityAlert
)
from app.services.analytics_service import (
    get_defect_distribution, get_severity_distribution,
    get_trend, get_quality_alert,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/defects", response_model=DefectDistribution)
def defects():
    return DefectDistribution(**get_defect_distribution())


@router.get("/severity", response_model=SeverityDistribution)
def severity():
    return SeverityDistribution(**get_severity_distribution())


@router.get("/trend", response_model=list[TrendPoint])
def trend():
    return [TrendPoint(**t) for t in get_trend()]


@router.get("/alerts", response_model=QualityAlert)
def alerts():
    return QualityAlert(**get_quality_alert())