import base64
import json
import mimetypes
import re
from functools import lru_cache
from pathlib import Path

from app.config import settings


@lru_cache(maxsize=1)
def _get_llm():
    if not settings.openai_api_key:
        return None
    try:
        from langchain_openai import ChatOpenAI
    except Exception:
        return None
    return ChatOpenAI(model="gpt-4o-mini", api_key=settings.openai_api_key, temperature=0.2)


def generate_patient_friendly_text(
    test_name: str,
    value: float,
    status: str,
    reference_range: str | None,
    description: str,
    context: str,
) -> str:
    llm = _get_llm()
    if not llm:
        return ""

    prompt = f"""
You are a medical lab report assistant.
Explain this result in simple, calm language for a patient.
Keep it to 2-4 sentences.
Avoid diagnosis claims and fear language.

Test: {test_name}
Value: {value}
Status: {status}
Reference Range: {reference_range or 'N/A'}
Description: {description}
Context: {context}
"""
    try:
        response = llm.invoke(prompt)
        text = getattr(response, "content", "") or ""
        return text.strip()
    except Exception:
        return ""


def _extract_json_block(raw: str) -> dict:
    text = (raw or "").strip()
    if not text:
        return {}
    try:
        return json.loads(text)
    except Exception:
        pass

    fenced = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text, re.IGNORECASE)
    if fenced:
        try:
            return json.loads(fenced.group(1))
        except Exception:
            return {}

    brace = re.search(r"(\{[\s\S]*\})", text)
    if brace:
        try:
            return json.loads(brace.group(1))
        except Exception:
            return {}
    return {}


def _status_from_severity(severity: str) -> str:
    value = (severity or "").strip().lower()
    if value in {"high", "severe", "critical", "major"}:
        return "high"
    if value in {"low", "mild", "minor"}:
        return "low"
    return "normal"


def _score_from_status(status: str) -> float:
    if status == "high":
        return 82.0
    if status == "low":
        return 38.0
    return 22.0


def extract_medical_from_image_with_ai(image_path: str) -> list[dict]:
    llm = _get_llm()
    if not llm:
        return []

    path = Path(image_path)
    if not path.exists():
        return []

    mime, _ = mimetypes.guess_type(path.name)
    if not mime:
        mime = "image/jpeg"
    try:
        b64 = base64.b64encode(path.read_bytes()).decode("utf-8")
    except Exception:
        return []

    prompt = """
You are a medical report vision extraction assistant.
Analyze the image and return ONLY JSON with this exact structure:
{
  "tests": [
    {"test_name": "...", "value": 0, "unit": "...", "reference_range": "..."}
  ],
  "findings": [
    {"name": "...", "severity": "normal|low|high", "note": "..."}
  ]
}

Rules:
- If numeric lab values are visible, add them in "tests".
- If this looks like x-ray/radiology and no numeric labs are visible, add clinically meaningful "findings".
- Do not invent patient identity data.
- Keep findings concise and clinically cautious.
- Output valid JSON only.
"""

    try:
        from langchain_core.messages import HumanMessage
    except Exception:
        return []

    try:
        response = llm.invoke(
            [
                HumanMessage(
                    content=[
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
                    ]
                )
            ]
        )
    except Exception:
        return []

    raw = getattr(response, "content", "")
    if isinstance(raw, list):
        parts = []
        for chunk in raw:
            if isinstance(chunk, dict) and chunk.get("type") == "text":
                parts.append(str(chunk.get("text", "")))
            else:
                parts.append(str(chunk))
        raw = "\n".join(parts)
    data = _extract_json_block(str(raw))

    out: list[dict] = []
    tests = data.get("tests") if isinstance(data, dict) else []
    findings = data.get("findings") if isinstance(data, dict) else []

    if isinstance(tests, list):
        for row in tests:
            if not isinstance(row, dict):
                continue
            name = str(row.get("test_name", "")).strip()
            if not name:
                continue
            try:
                value = float(row.get("value"))
            except Exception:
                continue
            out.append(
                {
                    "test_name": name,
                    "value": value,
                    "unit": (str(row.get("unit", "")).strip() or None),
                    "reference_range": (str(row.get("reference_range", "")).strip() or None),
                }
            )

    if isinstance(findings, list):
        for row in findings:
            if not isinstance(row, dict):
                continue
            name = str(row.get("name", "")).strip()
            if not name:
                continue
            status = _status_from_severity(str(row.get("severity", "")))
            note = str(row.get("note", "")).strip() or "AI-detected imaging finding; please confirm clinically."
            out.append(
                {
                    "test_name": f"Imaging Finding: {name}",
                    "value": _score_from_status(status),
                    "unit": "score",
                    "reference_range": "0-40",
                    "status_override": status,
                    "interpretation_override": note,
                }
            )

    return out
