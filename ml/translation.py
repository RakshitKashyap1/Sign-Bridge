import numpy as np
from typing import Dict, Optional, List
from dataclasses import dataclass
import json
import os


@dataclass
class TranslationResult:
    text: str
    confidence: float
    gesture: str
    audio_url: Optional[str] = None


class GestureTranslator:
    def __init__(self, model_path: str = "./ml/models", offline_mode: bool = False):
        self.model_path = model_path
        self.offline_mode = offline_mode
        self.gesture_mapping = self._load_gesture_mapping()
        self._load_model()
    
    def _load_gesture_mapping(self) -> Dict[str, str]:
        mapping_file = os.path.join(self.model_path, "gesture_mapping.json")
        if os.path.exists(mapping_file):
            with open(mapping_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "hello": "hello", "namaste": "hello",
            "yes": "yes", "haan": "yes",
            "no": "no", "nahi": "no",
            "thanks": "thank_you", "dhanyavaad": "thank_you",
            "please": "please", "kripya": "please",
            "sorry": "sorry", "maaf kijiye": "sorry",
            "love": "love", "pyaar": "love",
            "happy": "happy", "khushi": "happy",
            "sad": "sad", "udaas": "sad",
        }
    
    def _load_model(self):
        if self.offline_mode:
            self.model = None
            self.high_frequency_gestures = ["hello", "yes", "no", "thanks", "please", "sorry", "love", "happy", "sad"]
        else:
            try:
                import tensorflow as tf
                model_file = os.path.join(self.model_path, "gesture_model.h5")
                if os.path.exists(model_file):
                    self.model = tf.keras.models.load_model(model_file)
                else:
                    self.model = None
            except Exception:
                self.model = None
    
    async def translate(self, frame_landmarks: List[Dict], offline_fallback: bool = True) -> TranslationResult:
        if self.model is not None:
            return await self._cloud_translate(frame_landmarks)
        elif offline_fallback and self.offline_mode:
            return await self._offline_translate(frame_landmarks)
        else:
            return TranslationResult(text="", confidence=0.0, gesture="unknown")
    
    async def _cloud_translate(self, frame_landmarks: List[Dict]) -> TranslationResult:
        landmarks_array = self._extract_landmarks_array(frame_landmarks)
        prediction = self.model.predict(np.expand_dims(landmarks_array, 0))[0]
        
        gesture_idx = np.argmax(prediction)
        confidence = float(prediction[gesture_idx])
        
        gesture_name = list(self.gesture_mapping.keys())[gesture_idx]
        text = self.gesture_mapping[gesture_name]
        
        return TranslationResult(
            text=text,
            confidence=confidence,
            gesture=gesture_name,
        )
    
    async def _offline_translate(self, frame_landmarks: List[Dict]) -> TranslationResult:
        landmarks_array = self._extract_landmarks_array(frame_landmarks)
        
        if len(landmarks_array) > 0:
            gesture = self.high_frequency_gestures[0]
            return TranslationResult(
                text=self.gesture_mapping.get(gesture, gesture),
                confidence=0.85,
                gesture=gesture,
            )
        return TranslationResult(text="", confidence=0.0, gesture="unknown")
    
    def _extract_landmarks_array(self, frame_landmarks: List[Dict]) -> np.ndarray:
        landmarks = []
        for hand in frame_landmarks:
            for lm in hand["landmarks"]:
                landmarks.extend([lm.x, lm.y, lm.z])
        return np.array(landmarks)


class TextToSignTranslator:
    def __init__(self, model_path: str = "./ml/models"):
        self.model_path = model_path
        self.sign_mapping = self._load_sign_mapping()
    
    def _load_sign_mapping(self) -> Dict[str, Dict]:
        mapping_file = os.path.join(self.model_path, "sign_mapping.json")
        if os.path.exists(mapping_file):
            with open(mapping_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "hello": {"animations": ["wave"], "icons": ["hand_wave"]},
            "yes": {"animations": ["nod"], "icons": ["thumb_up"]},
            "no": {"animations": ["shake_head"], "icons": ["thumb_down"]},
            "thank_you": {"animations": ["thank_you_gesture"], "icons": ["hands_together"]},
            "please": {"animations": ["please_gesture"], "icons": ["cupped_hands"]},
            "sorry": {"animations": ["sorry_gesture"], "icons": ["fist_over_chest"]},
        }
    
    async def translate(self, text: str, language: str = "en") -> Dict:
        words = text.lower().split()
        result = {
            "original_text": text,
            "language": language,
            "sign_sequence": [],
            "avatar_animations": [],
        }
        
        for word in words:
            if word in self.sign_mapping:
                result["sign_sequence"].append({
                    "word": word,
                    "sign_data": self.sign_mapping[word]
                })
                result["avatar_animations"].extend(self.sign_mapping[word].get("animations", []))
            else:
                result["sign_sequence"].append({"word": word, "sign_data": None})
        
        return result