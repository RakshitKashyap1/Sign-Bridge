from fastapi import APIRouter

from app.api.v1.endpoints import gesture, text, speech, vocabulary

api_router = APIRouter()
api_router.include_router(gesture.router, prefix="/translateGesture", tags=["translation"])
api_router.include_router(text.router, prefix="/translateText", tags=["translation"])
api_router.include_router(speech.router, prefix="/translateSpeech", tags=["translation"])
api_router.include_router(vocabulary.router, prefix="/vocabulary", tags=["vocabulary"])