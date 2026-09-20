from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_ENV: str = "development"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    MODEL_PATH: str = "models/best.pt"
    MOCK_MODE: str = "auto"

    CONFIDENCE_THRESHOLD: float = 0.50
    STANDARD_MATCH_THRESHOLD: float = 90.0
    DEFECT_RATE_ALERT_THRESHOLD: float = 10.0

    SEVERITY_LOW_THRESHOLD: float = 0.5
    SEVERITY_MEDIUM_THRESHOLD: float = 2.0
    SEVERITY_HIGH_THRESHOLD: float = 5.0

    MAX_UPLOAD_MB: int = 10
    ALLOWED_IMAGE_TYPES: str = "image/jpeg,image/png,image/webp"
    UPLOAD_DIR: str = "uploads"

    DATABASE_FALLBACK: str = "sqlite:///./forgeguard.db"

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def allowed_image_types_list(self) -> List[str]:
        return [t.strip() for t in self.ALLOWED_IMAGE_TYPES.split(",") if t.strip()]

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_MB * 1024 * 1024

    @property
    def upload_path(self) -> Path:
        return Path(self.UPLOAD_DIR)

    @property
    def standard_upload_path(self) -> Path:
        return self.upload_path / "standard"

    @property
    def inspection_upload_path(self) -> Path:
        return self.upload_path / "inspections"

    @property
    def model_path(self) -> Path:
        return Path(self.MODEL_PATH)

    def ensure_dirs(self) -> None:
        self.standard_upload_path.mkdir(parents=True, exist_ok=True)
        self.inspection_upload_path.mkdir(parents=True, exist_ok=True)


settings = Settings()
settings.ensure_dirs()