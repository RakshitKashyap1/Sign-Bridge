from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import numpy as np
import cv2
from ml.translation import GestureTranslator
from ml.audio import text_to_speech_base64
from ml.hand_detection import HandDetector


router = APIRouter()

hand_detector = HandDetector()
gesture_translator = GestureTranslator(model_path="./ml/models", offline_mode=True)


@router.post("", summary="Translate sign gesture to text and speech")
async def translate_gesture(
    file: UploadFile = File(...),
):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        landmarks = hand_detector.detect(frame)
        
        if len(landmarks) == 0:
            return JSONResponse(
                content={
                    "text": "",
                    "gesture": None,
                    "confidence": 0.0,
                    "audio_base64": None,
                    "message": "No hands detected"
                }
            )
        
        result = await gesture_translator.translate(landmarks, offline_fallback=True)
        
        audio_base64 = None
        if result.text:
            audio_base64 = text_to_speech_base64(result.text)
        
        return JSONResponse(
            content={
                "text": result.text,
                "gesture": result.gesture,
                "confidence": result.confidence,
                "audio_base64": audio_base64,
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream", summary="Process video stream for real-time gesture detection")
async def stream_gesture(
    file: UploadFile = File(...),
):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid frame")
        
        landmarks = hand_detector.detect(frame)
        result = await gesture_translator.translate(landmarks, offline_fallback=True)
        
        return JSONResponse(
            content={
                "landmarks": [{"handedness": h["handedness"], "landmarks_count": len(h["landmarks"])} for h in landmarks],
                "text": result.text,
                "confidence": result.confidence,
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))