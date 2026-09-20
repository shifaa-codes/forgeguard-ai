import logging
from typing import List, Dict, Any

import numpy as np

from app.core.config import settings

logger = logging.getLogger(__name__)

CLASS_NAMES = ["scratch", "crack", "dent", "surface_defect", "deformation"]


class YOLODetector:
    def __init__(self) -> None:
        self.model = None
        self.mode: str = "mock"
        self.class_names: List[str] = CLASS_NAMES.copy()
        self._load_attempted = False

    def load_model(self) -> None:
        if self._load_attempted:
            return
        self._load_attempted = True

        if settings.MOCK_MODE == "force_mock":
            logger.warning("MOCK_MODE=force_mock → running in MOCK mode")
            self.mode = "mock"
            return

        if not settings.model_path.exists():
            logger.warning("YOLO model not found → MOCK mode active")
            self.mode = "mock"
            return

        try:
            from ultralytics import YOLO
            self.model = YOLO(str(settings.model_path))
            names = getattr(self.model, "names", None)
            if isinstance(names, dict):
                self.class_names = [names[i] for i in sorted(names.keys())]
            self.mode = "real"
            logger.info("YOLO loaded: %s", self.class_names)
        except Exception as exc:
            logger.exception("YOLO load failed: %s → mock fallback", exc)
            self.model = None
            self.mode = "mock"

    @property
    def is_ready(self) -> bool:
        return self.mode == "real" and self.model is not None

    def detect(self, image: np.ndarray) -> List[Dict[str, Any]]:
        self.load_model()
        if self.mode == "mock":
            return []
        results = self.model.predict(
            source=image,
            conf=settings.CONFIDENCE_THRESHOLD,
            verbose=False,
        )
        detections: List[Dict[str, Any]] = []
        for r in results:
            boxes = getattr(r, "boxes", None)
            if boxes is None:
                continue
            for b in boxes:
                xyxy = b.xyxy[0].tolist()
                conf = float(b.conf[0].item())
                cls_id = int(b.cls[0].item())
                name = self.class_names[cls_id] if cls_id < len(self.class_names) else f"class_{cls_id}"
                detections.append({
                    "class_name": name,
                    "confidence": round(conf, 4),
                    "bbox": {"x1": xyxy[0], "y1": xyxy[1], "x2": xyxy[2], "y2": xyxy[3]},
                })
        return detections


detector = YOLODetector()