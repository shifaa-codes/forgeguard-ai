import uuid
import logging
from datetime import datetime

from fastapi import APIRouter, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect, Query

from app.core.config import settings
from app.models.schemas import InspectionResult, Detection, BBox, InspectionHistoryResponse, InspectionHistoryItem
from app.services.yolo_detector import detector
from app.services.severity_service import calculate_severity, aggregate_severity
from app.services.standard_service import standard_service
from app.services.decision_service import decide
from app.services.repository import repo
from app.utils.image_utils import (
    decode_image, resize_keep_aspect, defect_area_pct, save_image, safe_filename
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/inspection", tags=["inspection"])


def _run_pipeline(img):
    """Shared pipeline for both image and WebSocket paths. Does NOT save to DB."""
    detector.load_model()
    img = resize_keep_aspect(img, 1024)

    raw = detector.detect(img)
    detections = []
    for d in raw:
        d["area_pct"] = defect_area_pct(d["bbox"], img.shape)
        d["severity"] = calculate_severity(d["area_pct"])
        detections.append(d)

    match_score, match_status = standard_service.compare(img)
    decision = decide(detections, match_score, match_status)
    sev = aggregate_severity([d["severity"] for d in detections])
    return detections, match_score, match_status, decision, sev


@router.post("/image", response_model=InspectionResult)
async def inspect_image(file: UploadFile = File(...)):
    raw = await file.read()
    if len(raw) > settings.max_upload_bytes:
        raise HTTPException(413, {"success": False, "error": "File too large"})
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(400, {"success": False, "error": "Invalid image format"})

    img = decode_image(raw)
    if img is None:
        raise HTTPException(400, {"success": False, "error": "Cannot decode image"})

    detections, match_score, match_status, decision, sev = _run_pipeline(img)

    inspection_id = f"INS-{uuid.uuid4().hex[:6].upper()}"
    product_id = f"P-{uuid.uuid4().hex[:6].upper()}"
    filename = safe_filename("insp")
    save_image(img, settings.inspection_upload_path, filename)
    image_url = f"/uploads/inspections/{filename}"

    repo.save_inspection(
        {
            "id": str(uuid.uuid4()),
            "inspection_id": inspection_id,
            "product_id": product_id,
            "timestamp": datetime.utcnow().isoformat(),
            "standard_match": match_score,
            "decision": decision,
            "image_url": image_url,
            "mode": "live",
        },
        detections,
    )

    return InspectionResult(
        inspection_id=inspection_id,
        product_id=product_id,
        defects=[Detection(**d) for d in detections],
        standard_match=match_score,
        standard_status=match_status,
        decision=decision,
        severity=sev,
        image_url=image_url,
        timestamp=datetime.utcnow(),
        model_mode=detector.mode,
    )


@router.get("/history", response_model=InspectionHistoryResponse)
def history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=200),
    decision: str | None = None,
    severity: str | None = None,
    defect_type: str | None = None,
    search: str | None = None,
):
    res = repo.list_inspections(page, limit, {
        "decision": decision,
        "severity": severity,
        "defect_type": defect_type,
        "search": search,
    })
    items = []
    for r in res["items"]:
        top = r["defects"][0] if r["defects"] else None
        items.append(InspectionHistoryItem(
            inspection_id=r["inspection_id"],
            product_id=r["product_id"],
            timestamp=datetime.fromisoformat(r["timestamp"]),
            defect=top["defect_type"] if top else "None",
            severity=top["severity"] if top else "—",
            confidence=top["confidence"] if top else 1.0,
            standard_match=r["standard_match"],
            decision=r["decision"],
            image_url=r.get("image_url"),
        ))
    return InspectionHistoryResponse(items=items, total=res["total"], page=page, limit=limit)


@router.get("/{inspection_id}")
def get_inspection(inspection_id: str):
    rec = repo.get_inspection(inspection_id)
    if not rec:
        raise HTTPException(404, {"success": False, "error": "Inspection not found"})
    return {"success": True, **rec}


# ---------------- WebSocket ----------------
@router.websocket("/live")
async def live_inspection(ws: WebSocket):
    await ws.accept()
    logger.info("WS connected: /api/inspection/live")
    try:
        while True:
            data = await ws.receive_bytes()
            img = decode_image(data)
            if img is None:
                await ws.send_json({
                    "type": "error",
                    "message": "Invalid frame",
                    "timestamp": datetime.utcnow().isoformat(),
                    "model_mode": detector.mode,
                })
                continue

            detections, match_score, match_status, decision, sev = _run_pipeline(img)
            await ws.send_json({
                "type": "inspection_result",
                "detections": detections,
                "decision": decision,
                "severity": sev,
                "standard_match": match_score,
                "standard_status": match_status,
                "timestamp": datetime.utcnow().isoformat(),
                "model_mode": detector.mode,
                "mode": "demo",
            })
    except WebSocketDisconnect:
        logger.info("WS disconnected")
    except Exception as exc:
        logger.exception("WS error: %s", exc)
        try:
            await ws.close()
        except Exception:
            pass