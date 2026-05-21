import uvicorn
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1 import api_router
from app.core.config import settings

app = FastAPI(
    title="SignBridge API",
    description="Real-time bidirectional communication bridge between Sign Language and spoken/written language",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

start_time = time.time()


@app.get("/", include_in_schema=False)
async def root():
    return {"message": "SignBridge API", "version": "1.0.0"}


@app.get("/api/v1/health", include_in_schema=False)
async def health():
    uptime = round(time.time() - start_time, 2)
    return {
        "status": "healthy",
        "service": "signbridge-api",
        "version": "1.0.0",
        "uptime_seconds": uptime,
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)