from app.core.config import settings
from app.services.repository import repo


def get_dashboard_stats():
    return repo.stats()


def get_defect_distribution():
    return repo.defect_distribution()


def get_severity_distribution():
    return repo.severity_distribution()


def get_trend():
    return repo.trend()


def get_quality_alert():
    stats = repo.stats()
    top = repo.most_common_defect()
    alert = stats["defect_rate"] >= settings.DEFECT_RATE_ALERT_THRESHOLD
    msg = (
        f"Defect rate is {stats['defect_rate']}% — above threshold "
        f"({settings.DEFECT_RATE_ALERT_THRESHOLD}%)."
        if alert else
        f"Defect rate is within acceptable limits ({stats['defect_rate']}%)."
    )
    return {
        "alert": alert,
        "message": msg,
        "defect_rate": stats["defect_rate"],
        "most_common_defect": top,
    }