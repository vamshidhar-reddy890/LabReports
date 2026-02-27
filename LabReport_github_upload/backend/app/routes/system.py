from fastapi import APIRouter

from app.config import settings

router = APIRouter(prefix="/api/system", tags=["system"])


@router.get("/status")
def system_status():
    return {
        "ai_extraction_enabled": bool(settings.openai_api_key),
        "translation_enabled": True,
    }

