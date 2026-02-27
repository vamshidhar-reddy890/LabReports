import json
from urllib.error import URLError
from urllib.parse import quote_plus
from urllib.request import Request, urlopen

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.config import settings

router = APIRouter(prefix="/api/translate", tags=["translate"])


class TranslateBatchIn(BaseModel):
    target_lang: str = Field(min_length=2, max_length=10)
    texts: list[str] = Field(default_factory=list, max_length=200)


class TranslateBatchOut(BaseModel):
    translations: list[str]


def _translate_text(text: str, target_lang: str) -> str:
    if not text.strip():
        return text

    payload = {
        "q": text,
        "source": "en",
        "target": target_lang,
        "format": "text",
    }
    if settings.translation_api_key:
        payload["api_key"] = settings.translation_api_key

    # Provider 1: LibreTranslate-compatible API
    try:
        req = Request(
            settings.translation_api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urlopen(req, timeout=settings.translation_api_timeout_seconds) as response:
            body = response.read().decode("utf-8", errors="ignore")
            data = json.loads(body or "{}")
            translated = data.get("translatedText")
            if isinstance(translated, str) and translated.strip() and translated.strip() != text.strip():
                return translated
    except (URLError, TimeoutError, json.JSONDecodeError, ValueError):
        pass

    # Provider 2 fallback: MyMemory public API
    try:
        url = (
            "https://api.mymemory.translated.net/get?q="
            + quote_plus(text)
            + "&langpair=en|"
            + quote_plus(target_lang)
        )
        req = Request(url, method="GET")
        with urlopen(req, timeout=settings.translation_api_timeout_seconds) as response:
            body = response.read().decode("utf-8", errors="ignore")
            data = json.loads(body or "{}")
            translated = (data.get("responseData") or {}).get("translatedText")
            if isinstance(translated, str) and translated.strip():
                return translated
    except (URLError, TimeoutError, json.JSONDecodeError, ValueError):
        pass

    # Provider 3 fallback: Google public translate endpoint
    try:
        url = (
            "https://translate.googleapis.com/translate_a/single?client=gtx"
            "&sl=en&tl="
            + quote_plus(target_lang)
            + "&dt=t&q="
            + quote_plus(text)
        )
        req = Request(url, method="GET")
        with urlopen(req, timeout=settings.translation_api_timeout_seconds) as response:
            body = response.read().decode("utf-8", errors="ignore")
            data = json.loads(body or "[]")
            # Expected format: [[["translated", "source", ...], ...], ...]
            if isinstance(data, list) and data and isinstance(data[0], list):
                chunks = []
                for item in data[0]:
                    if isinstance(item, list) and item and isinstance(item[0], str):
                        chunks.append(item[0])
                translated = "".join(chunks).strip()
                if translated:
                    return translated
    except (URLError, TimeoutError, json.JSONDecodeError, ValueError):
        pass
    return text


@router.post("/batch", response_model=TranslateBatchOut)
def translate_batch(payload: TranslateBatchIn):
    target_lang = (payload.target_lang or "en").strip().lower()
    if target_lang == "en":
        return {"translations": payload.texts}

    translations = [_translate_text(text, target_lang) for text in payload.texts]
    return {"translations": translations}
