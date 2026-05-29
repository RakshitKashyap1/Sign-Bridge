import json
import os
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import numpy as np
import cv2
from ml.hand_detection import HandDetector

router = APIRouter()
VOCAB_DIR = "./ml/models/vocabulary"
hand_detector = HandDetector()


class FrameLandmark(BaseModel):
    x: float
    y: float
    z: float


class FrameData(BaseModel):
    frame_index: int
    landmarks: List[FrameLandmark]


class SaveGestureRequest(BaseModel):
    label: str
    frames: List[FrameData]


@router.post("/record", summary="Save a recorded gesture")
async def save_gesture(request: SaveGestureRequest):
    if not request.label.strip():
        raise HTTPException(status_code=400, detail="Label cannot be empty")
    if not request.frames:
        raise HTTPException(status_code=400, detail="At least one frame required")

    os.makedirs(VOCAB_DIR, exist_ok=True)

    filepath = os.path.join(VOCAB_DIR, f"{request.label.strip().lower()}.json")

    data = {
        "label": request.label.strip().lower(),
        "frames": [f.model_dump() for f in request.frames],
        "num_frames": len(request.frames),
        "created_at": datetime.utcnow().isoformat(),
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    return {"message": f"Gesture '{request.label}' saved", "num_frames": len(request.frames)}


@router.post("/record-from-frames", summary="Upload frames + label to record a gesture")
async def record_from_frames(
    label: str = Form(...),
    files: List[UploadFile] = File(...),
):
    if not label.strip():
        raise HTTPException(status_code=400, detail="Label cannot be empty")
    if not files:
        raise HTTPException(status_code=400, detail="At least one frame image required")

    os.makedirs(VOCAB_DIR, exist_ok=True)
    all_frames = []

    for idx, file in enumerate(files):
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None:
            continue

        landmarks_result = hand_detector.detect(frame)
        if not landmarks_result:
            continue

        landmarks_flat = []
        for hand in landmarks_result:
            for lm in hand["landmarks"]:
                landmarks_flat.append({"x": lm.x, "y": lm.y, "z": lm.z})

        if landmarks_flat:
            all_frames.append({"frame_index": idx, "landmarks": landmarks_flat})

    if not all_frames:
        return JSONResponse(
            content={"message": "No hands detected in any frame", "saved": False},
            status_code=400,
        )

    filepath = os.path.join(VOCAB_DIR, f"{label.strip().lower()}.json")
    data = {
        "label": label.strip().lower(),
        "frames": all_frames,
        "num_frames": len(all_frames),
        "created_at": datetime.utcnow().isoformat(),
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    return {"message": f"Gesture '{label}' saved", "num_frames": len(all_frames)}


@router.get("/gestures", summary="List all recorded gestures")
async def list_gestures():
    os.makedirs(VOCAB_DIR, exist_ok=True)

    gestures = []
    for fname in os.listdir(VOCAB_DIR):
        if fname.endswith(".json"):
            filepath = os.path.join(VOCAB_DIR, fname)
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                gestures.append({
                    "label": data["label"],
                    "num_frames": data["num_frames"],
                    "created_at": data.get("created_at", "unknown"),
                })

    return {"gestures": sorted(gestures, key=lambda g: g["label"])}


@router.delete("/gestures/{label}", summary="Delete a recorded gesture")
async def delete_gesture(label: str):
    filepath = os.path.join(VOCAB_DIR, f"{label.strip().lower()}.json")
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"Gesture '{label}' not found")

    os.remove(filepath)
    return {"message": f"Gesture '{label}' deleted"}
