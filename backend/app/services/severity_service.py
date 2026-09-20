"""PROTOTYPE severity thresholds — calibrate with real data before production."""
from typing import Literal
from app.core.config import settings

Severity = Literal["low", "medium", "high", "critical"]


def calculate_severity(area_pct: float) -> Severity:
    if area_pct < settings.SEVERITY_LOW_THRESHOLD:
        return "low"
    if area_pct < settings.SEVERITY_MEDIUM_THRESHOLD:
        return "medium"
    if area_pct < settings.SEVERITY_HIGH_THRESHOLD:
        return "high"
    return "critical"


def aggregate_severity(severities: list[Severity]) -> Severity | None:
    if not severities:
        return None
    order = {"low": 0, "medium": 1, "high": 2, "critical": 3}
    return max(severities, key=lambda s: order[s])