"""Prototype conformity scoring via OpenCV.
⚠️ NOT industrial-grade dimensional inspection.
"""
from typing import Optional, Dict, Any, Tuple
import cv2
import numpy as np
from app.core.config import settings
from app.utils.image_utils import normalize_size, to_grayscale


class StandardService:
    def __init__(self) -> None:
        self._reference_img: Optional[np.ndarray] = None
        self._reference_meta: Optional[Dict[str, Any]] = None

    def set_reference(self, image: np.ndarray, meta: Dict[str, Any]) -> None:
        self._reference_img = normalize_size(image, (480, 480))
        self._reference_meta = meta

    def get_reference(self) -> Optional[np.ndarray]:
        return self._reference_img

    def get_meta(self) -> Optional[Dict[str, Any]]:
        return self._reference_meta

    def clear(self) -> None:
        self._reference_img = None
        self._reference_meta = None

    def compare(self, image: np.ndarray) -> Tuple[float, str]:
        if self._reference_img is None:
            return 0.0, "NO_STANDARD"

        a = normalize_size(image, (480, 480))
        b = self._reference_img

        hist_a = cv2.calcHist([a], [0, 1], None, [32, 32], [0, 256, 0, 256])
        hist_b = cv2.calcHist([b], [0, 1], None, [32, 32], [0, 256, 0, 256])
        cv2.normalize(hist_a, hist_a, 0, 1, cv2.NORM_MINMAX)
        cv2.normalize(hist_b, hist_b, 0, 1, cv2.NORM_MINMAX)
        hist_score = max(0.0, cv2.compareHist(hist_a, hist_b, cv2.HISTCMP_CORREL))

        ga, gb = to_grayscale(a), to_grayscale(b)
        la = cv2.Laplacian(ga, cv2.CV_64F).flatten()
        lb = cv2.Laplacian(gb, cv2.CV_64F).flatten()
        denom = (np.linalg.norm(la) * np.linalg.norm(lb)) or 1.0
        edge_score = float(np.dot(la, lb) / denom)
        edge_score = max(0.0, (edge_score + 1) / 2)

        score = round((0.6 * hist_score + 0.4 * edge_score) * 100.0, 2)
        score = max(0.0, min(100.0, score))
        status = "MATCH" if score >= settings.STANDARD_MATCH_THRESHOLD else "MISMATCH"
        return score, status


standard_service = StandardService()