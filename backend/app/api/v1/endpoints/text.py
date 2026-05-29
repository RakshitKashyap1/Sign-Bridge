from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ml.translation import TextToSignTranslator

router = APIRouter()
text_translator = TextToSignTranslator(model_path="./ml/models")


class TextTranslateRequest(BaseModel):
    text: str
    language: str = "en"


class TextTranslateResponse(BaseModel):
    original_text: str
    language: str
    sign_sequence: List[dict]
    avatar_animations: List[str]


@router.post("", summary="Translate text to sign language animations")
async def translate_text(request: TextTranslateRequest):
    try:
        result = await text_translator.translate(request.text, request.language)
        return TextTranslateResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/gestures", summary="Get available gestures")
async def list_gestures():
    return {"gestures": list(text_translator.sign_mapping.keys())}