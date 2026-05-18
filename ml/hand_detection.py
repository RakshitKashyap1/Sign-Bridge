import numpy as np
import cv2
import mediapipe as mp
from typing import Optional, Tuple, List, Dict
from dataclasses import dataclass


@dataclass
class HandLandmark:
    x: float
    y: float
    z: float


class HandDetector:
    def __init__(self, static_image_mode: bool = False, max_num_hands: int = 2, min_detection_confidence: float = 0.5, min_tracking_confidence: float = 0.5):
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence,
        )
    
    def detect(self, frame: np.ndarray) -> List[Dict]:
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        
        landmarks_list = []
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                landmarks = []
                for lm in hand_landmarks.landmark:
                    landmarks.append(HandLandmark(x=lm.x, y=lm.y, z=lm.z))
                landmarks_list.append({
                    "landmarks": landmarks,
                    "handedness": "right" if len(landmarks_list) == 0 else "left"
                })
        return landmarks_list
    
    def draw_landmarks(self, frame: np.ndarray, results) -> np.ndarray:
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                self.mp_drawing.draw_landmarks(
                    frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS
                )
        return frame
    
    def close(self):
        self.hands.close()