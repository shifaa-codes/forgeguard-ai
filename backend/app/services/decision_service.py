from typing import List, Dict, Any, Literal
from app.core.config import settings

Decision = Literal["PASS", "REJECT", "REVIEW"]
_BAD = {"high", "critical"}


def decide(detections: List[Dict[str, Any]], standard_match: float,
           standard_status: str) -> Decision:
    if standard_status == "NO_STANDARD":
        return "REVIEW" if detections else "PASS"

    for d in detections:
        if d.get("severity") in _BAD and d.get("confidence", 0) >= settings.CONFIDENCE_THRESHOLD:
            return "REJECT"

    if standard_match < settings.STANDARD_MATCH_THRESHOLD:
        return "REVIEW"

    for d in detections:
        if d.get("confidence", 0) < settings.CONFIDENCE_THRESHOLD:
            return "REVIEW"

    for d in detections:
        if d.get("severity") == "medium" and d.get("confidence", 0) >= settings.CONFIDENCE_THRESHOLD:
            return "REJECT"

    return "PASS"