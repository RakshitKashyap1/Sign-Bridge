from fastapi import APIRouter

from app.api.v1.endpoints import gesture, text

api_router = APIRouter()
api_router.include_router(gesture.router, prefix="/translateGesture", tags=["translation"])
api_router.include_router(text.router, prefix="/translateText", tags=["translation"])