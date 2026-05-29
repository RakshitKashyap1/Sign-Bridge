from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from ml.audio import audio_blob_to_text
from ml.translation import TextToSignTranslator

router = APIRouter()
text_translator = TextToSignTranslator(model_path="./ml/models")


@router.post("", summary="Transcribe speech and translate to sign language")
async def translate_speech(
    file: UploadFile = File(...),
    language: str = "en-US",
):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty audio file")

        transcribed = audio_blob_to_text(contents, language=language)
        if not transcribed:
            return JSONResponse(
                content={
                    "transcribed_text": "",
                    "sign_sequence": [],
                    "avatar_animations": [],
                    "message": "Could not understand speech",
                }
            )

        lang = "hi" if language.startswith("hi") else "en"
        sign_result = await text_translator.translate(transcribed, language=lang)

        return JSONResponse(
            content={
                "transcribed_text": transcribed,
                "sign_sequence": sign_result["sign_sequence"],
                "avatar_animations": sign_result["avatar_animations"],
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
