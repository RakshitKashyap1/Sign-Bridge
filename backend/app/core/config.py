from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SignBridge"
    PROJECT_DESCRIPTION: str = "Real-time bidirectional communication bridge between Sign Language and spoken/written language"
    
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]
    
    MODEL_PATH: str = "./ml/models"
    DEMO_ASSETS_PATH: str = "./frontend/public/demo-assets"
    HIGH_FREQUENCY_GESTURES: List[str] = [
        "hello", "yes", "no", "thanks", "please", "sorry", "love", "happy", "sad"
    ]
    
    class Config:
        case_sensitive = True


settings = Settings()