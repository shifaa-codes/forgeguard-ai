import uuid
from pathlib import Path
from typing import Optional, Tuple

import cv2
import numpy as np


def decode_image(data: bytes) -> Optional[np.ndarray]:
    if not data:
        return None
    arr = np.frombuffer(data, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def encode_image(img: np.ndarray, ext: str = ".jpg") -> bytes:
    ok, buf = cv2.imencode(ext, img)
    if not ok:
        raise ValueError("Failed to encode image")
    return buf.tobytes()


def resize_keep_aspect(img: np.ndarray, max_side: int = 1024) -> np.ndarray:
    h, w = img.shape[:2]
    scale = max_side / max(h, w)
    if scale >= 1:
        return img
    return cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)


def normalize_size(img: np.ndarray, size: Tuple[int, int] = (480, 480)) -> np.ndarray:
    return cv2.resize(img, size, interpolation=cv2.INTER_AREA)


def to_grayscale(img: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def defect_area_pct(bbox: dict, img_shape: Tuple[int, ...]) -> float:
    h, w = img_shape[:2]
    total = float(h * w)
    if total <= 0:
        return 0.0
    bw = max(0.0, bbox["x2"] - bbox["x1"])
    bh = max(0.0, bbox["y2"] - bbox["y1"])
    return round((bw * bh) / total * 100.0, 3)


def draw_detections(img: np.ndarray, detections: list) -> np.ndarray:
    out = img.copy()
    for det in detections:
        b = det["bbox"]
        x1, y1, x2, y2 = int(b["x1"]), int(b["y1"]), int(b["x2"]), int(b["y2"])
        label = det["class_name"]
        conf = det["confidence"]
        color = (99, 136, 181)
        cv2.rectangle(out, (x1, y1), (x2, y2), color, 2)
        text = f"{label} {conf*100:.0f}%"
        (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(out, (x1, y1 - th - 8), (x1 + tw + 8, y1), color, -1)
        cv2.putText(out, text, (x1 + 4, y1 - 4),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (11, 17, 20), 1, cv2.LINE_AA)
    return out


def safe_filename(prefix: str, ext: str = ".jpg") -> str:
    ext = ext if ext.startswith(".") else f".{ext}"
    return f"{prefix}_{uuid.uuid4().hex[:12]}{ext}"


def save_image(img: np.ndarray, directory: Path, filename: str) -> Path:
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / filename
    cv2.imwrite(str(path), img)
    return path