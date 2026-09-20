from fastapi import APIRouter
from app.models.schemas import DashboardStats
from app.services.analytics_service import get_dashboard_stats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats():
    return DashboardStats(**get_dashboard_stats())