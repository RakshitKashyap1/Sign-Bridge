import numpy as np
import cv2
from fastapi import WebSocket, WebSocketDisconnect
from ml.hand_detection import HandDetector
from ml.translation import GestureTranslator

hand_detector = HandDetector()
gesture_translator = GestureTranslator(model_path="./ml/models", offline_mode=True)


async def handle_gesture_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()
            nparr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is None:
                continue

            landmarks = hand_detector.detect(frame)
            if not landmarks:
                await websocket.send_json({
                    "text": "",
                    "gesture": None,
                    "confidence": 0.0,
                })
                continue

            result = await gesture_translator.translate(landmarks, offline_fallback=True)
            await websocket.send_json({
                "text": result.text,
                "gesture": result.gesture,
                "confidence": result.confidence,
            })
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
