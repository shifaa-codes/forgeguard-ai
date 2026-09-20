"""Conceptual DB tables — reference for Supabase/SQLite schema."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class StandardProductRecord:
    id: str
    product_id: str
    name: str
    image_url: str
    status: str
    created_at: datetime


@dataclass
class InspectionRecord:
    id: str
    inspection_id: str
    product_id: str
    timestamp: datetime
    standard_match: float
    decision: str
    image_url: Optional[str]
    mode: str


@dataclass
class DefectRecord:
    id: str
    inspection_id: str
    defect_type: str
    confidence: float
    severity: str
    x1: float
    y1: float
    x2: float
    y2: float