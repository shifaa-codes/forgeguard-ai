import uuid
from datetime import datetime

from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from app.core.config import settings
from app.models.schemas import StandardProductResponse
from app.services.standard_service import standard_service
from app.services.repository import repo
from app.utils.image_utils import decode_image, save_image, safe_filename

router = APIRouter(prefix="/standard", tags=["standard"])


@router.get("")
def get_standard():
    rec = repo.get_active_standard()
    if not rec:
        return {"success": False, "error": "No active standard product"}
    return {"success": True, **rec}


@router.post("/upload", response_model=StandardProductResponse)
async def upload_standard(
    file: UploadFile = File(...),
    name: str = Form("Standard Product"),
):
    raw = await file.read()
    if len(raw) > settings.max_upload_bytes:
        raise HTTPException(413, {"success": False, "error": "File too large"})
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(400, {"success": False, "error": "Invalid image format"})

    img = decode_image(raw)
    if img is None:
        raise HTTPException(400, {"success": False, "error": "Cannot decode image"})

    product_id = f"STD-{uuid.uuid4().hex[:8].upper()}"
    filename = safe_filename("standard")
    save_image(img, settings.standard_upload_path, filename)
    image_url = f"/uploads/standard/{filename}"

    # Register in the in-memory reference holder
    standard_service.set_reference(img, {"product_id": product_id, "name": name})

    # Persist metadata
    now = datetime.utcnow().isoformat()
    repo.save_standard({
        "id": str(uuid.uuid4()),
        "product_id": product_id,
        "name": name,
        "image_url": image_url,
        "status": "active",
        "created_at": now,
    })

    return StandardProductResponse(
        product_id=product_id,
        name=name,
        image_url=image_url,
        status="active",
        registered_at=datetime.fromisoformat(now),
    )


@router.post("/replace", response_model=StandardProductResponse)
async def replace_standard(
    file: UploadFile = File(...),
    name: str = Form("Standard Product"),
):
    return await upload_standard(file=file, name=name)


@router.delete("/{product_id}")
def delete_standard(product_id: str):
    ok = repo.deactivate_standard(product_id)
    standard_service.clear()
    if not ok:
        raise HTTPException(404, {"success": False, "error": "Standard not found"})
    return {"success": True, "product_id": product_id, "status": "inactive"}