import json
import re
from difflib import SequenceMatcher
from pathlib import Path
from typing import Dict, Optional, Tuple

from app.config import resolve_path, settings


def load_benchmarks() -> Dict:
    path = Path(resolve_path(settings.benchmark_path))
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def find_benchmark(test_name: str, benchmarks: Dict) -> Optional[Dict]:
    aliases = {
        "hb": "Hemoglobin",
        "hemoglobin": "Hemoglobin",
        "wbc": "WBC",
        "white blood cell": "WBC",
        "rbc": "RBC",
        "platelet": "Platelets",
        "platelets": "Platelets",
        "glucose": "Glucose",
        "fasting glucose": "Glucose",
        "cholesterol": "Total Cholesterol",
        "total cholesterol": "Total Cholesterol",
        "hdl": "HDL",
        "ldl": "LDL",
        "triglycerides": "Triglycerides",
        "triglyceride": "Triglycerides",
        "vldl": "VLDL",
        "non hdl cholesterol": "Non-HDL Cholesterol",
        "creatinine": "Creatinine",
        "vitamin d": "Vitamin D",
    }

    lowered = (test_name or "").strip().lower()
    if lowered in aliases and aliases[lowered] in benchmarks:
        return benchmarks[aliases[lowered]]

    direct = benchmarks.get(test_name)
    if direct:
        return direct

    normalized_name = re.sub(r"[^a-z0-9]", "", test_name.lower())
    for key, value in benchmarks.items():
        if re.sub(r"[^a-z0-9]", "", key.lower()) == normalized_name:
            return value

    name_tokens = set(re.findall(r"[a-z0-9]+", test_name.lower()))
    if name_tokens:
        for key, value in benchmarks.items():
            key_tokens = set(re.findall(r"[a-z0-9]+", key.lower()))
            if key_tokens and (key_tokens.issubset(name_tokens) or name_tokens.issubset(key_tokens)):
                return value

    # Final fallback for OCR noise: fuzzy match against benchmark keys.
    best_key = None
    best_score = 0.0
    for key in benchmarks.keys():
        score = SequenceMatcher(None, normalized_name, re.sub(r"[^a-z0-9]", "", key.lower())).ratio()
        if score > best_score:
            best_score = score
            best_key = key
    if best_key and best_score >= 0.76:
        return benchmarks[best_key]
    return None


def get_reference_values(ref_obj: Dict, gender: Optional[str] = None, age: Optional[int] = None) -> Tuple[Optional[float], Optional[float], str]:
    unit = ref_obj.get("unit", "")
    normalized_gender = (gender or "").strip().lower()

    if normalized_gender in {"male", "female"} and isinstance(ref_obj.get(normalized_gender), dict):
        gender_ref = ref_obj[normalized_gender]
        return gender_ref.get("min"), gender_ref.get("max"), unit

    if age is not None and isinstance(ref_obj.get("age_ranges"), list):
        for age_range in ref_obj["age_ranges"]:
            if age_range["min_age"] <= age <= age_range["max_age"]:
                return age_range.get("min"), age_range.get("max"), unit

    return ref_obj.get("min"), ref_obj.get("max"), unit
