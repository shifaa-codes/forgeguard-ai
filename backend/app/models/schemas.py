from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class BBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "ForgeGuard AI"
    version: str
    model_mode: Literal["real", "mock"]


class StandardProductResponse(BaseModel):
    success: bool = True
    product_id: str
    name: str
    image_url: str
    status: Literal["active", "inactive"] = "active"
    registered_at: datetime


class Detection(BaseModel):
    class_name: str
    confidence: float
    bbox: BBox
    area_pct: float = 0.0
    severity: Optional[Literal["low", "medium", "high", "critical"]] = None


class InspectionResult(BaseModel):
    inspection_id: str
    product_id: str
    defects: List[Detection] = []
    standard_match: float
    standard_status: str
    decision: Literal["PASS", "REJECT", "REVIEW"]
    severity: Optional[str] = None
    image_url: Optional[str] = None
    timestamp: datetime
    model_mode: Literal["real", "mock"]


class InspectionHistoryItem(BaseModel):
    inspection_id: str
    product_id: str
    timestamp: datetime
    defect: str
    severity: str
    confidence: float
    standard_match: float
    decision: str
    image_url: Optional[str] = None


class InspectionHistoryResponse(BaseModel):
    items: List[InspectionHistoryItem]
    total: int
    page: int
    limit: int


class DashboardStats(BaseModel):
    total_inspected: int
    passed: int
    rejected: int
    defect_rate: float


class DefectDistribution(BaseModel):
    scratch: int = 0
    crack: int = 0
    dent: int = 0
    surface_defect: int = 0
    deformation: int = 0


class SeverityDistribution(BaseModel):
    low: int = 0
    medium: int = 0
    high: int = 0
    critical: int = 0


class TrendPoint(BaseModel):
    time: str
    inspected: int
    defects: int


class QualityAlert(BaseModel):
    alert: bool
    message: str
    defect_rate: float
    most_common_defect: str