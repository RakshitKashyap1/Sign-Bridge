import os
from gtts import gTTS
from io import BytesIO
import base64
from typing import Optional


def text_to_speech(text: str, lang: str = "en", slow: bool = False) -> bytes:
    tts = gTTS(text=text, lang=lang, slow=slow)
    fp = BytesIO()
    tts.write_to_fp(fp)
    fp.seek(0)
    return fp.read()


def text_to_speech_base64(text: str, lang: str = "en") -> str:
    audio_bytes = text_to_speech(text, lang)
    return base64.b64encode(audio_bytes).decode("utf-8")


def save_audio(text: str, output_path: str, lang: str = "en") -> str:
    tts = gTTS(text=text, lang=lang)
    tts.save(output_path)
    return output_path


import speech_recognition as sr


def speech_to_text(audio_file_path: str, language: str = "en-US") -> str:
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio = recognizer.record(source)
    
    try:
        return recognizer.recognize_google(audio, language=language)
    except sr.UnknownValueError:
        return ""
    except sr.RequestError:
        return ""


def audio_blob_to_text(audio_blob: bytes, language: str = "en-US") -> str:
    recognizer = sr.Recognizer()
    audio_data = sr.AudioData(audio_blob, sample_rate=16000, sample_width=2)
    
    try:
        return recognizer.recognize_google(audio_data, language=language)
    except sr.UnknownValueError:
        return ""
    except sr.RequestError:
        return ""