import re
from typing import Dict, List

import pdfplumber


TEST_ALIASES = {
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
    "cholesterol total": "Total Cholesterol",
    "total cholesterol": "Total Cholesterol",
    "total cholesterol serum": "Total Cholesterol",
    "cholesterol hdl": "HDL",
    "hdl cholesterol": "HDL",
    "cholesterol ldl": "LDL",
    "ldl cholesterol": "LDL",
    "ldl cholesterol direct": "LDL",
    "cholesterol vldl": "VLDL",
    "vldl cholesterol": "VLDL",
    "non hdl cholesterol": "Non-HDL Cholesterol",
    "total cholesterol": "Total Cholesterol",
    "hdl": "HDL",
    "ldl": "LDL",
    "triglycerides": "Triglycerides",
    "creatinine": "Creatinine",
    "urea": "Urea",
    "bun": "BUN",
    "vitamin d": "Vitamin D",
}

TEST_KEYWORDS = {
    "hemoglobin",
    "wbc",
    "rbc",
    "platelet",
    "glucose",
    "cholesterol",
    "hdl",
    "ldl",
    "vldl",
    "triglyceride",
    "creatinine",
    "urea",
    "bun",
    "vitamin d",
}

NOISE_TERMS = {
    "direct",
    "page",
    "sample",
    "samples",
    "report",
    "address",
    "sector",
    "delhi",
    "iso",
    "hours",
    "years",
    "week",
    "kindly",
    "submit",
    "request",
}

UNIT_HINTS = {
    "mg/dl",
    "g/dl",
    "ng/ml",
    "mmol/l",
    "cells/mcl",
    "million cells/mcl",
    "platelets/mcl",
}


def _normalize_test_name(raw_name: str) -> str:
    key = re.sub(r"[^a-zA-Z ]", " ", raw_name).strip().lower()
    key = re.sub(r"\s+", " ", key)
    if key in TEST_ALIASES:
        return TEST_ALIASES[key]
    return raw_name.strip()


def _is_likely_lab_test(name: str, unit: str | None = None) -> bool:
    lowered = name.lower().strip()
    if not lowered:
        return False
    if any(term in lowered for term in NOISE_TERMS):
        return False
    if len(lowered.split()) > 6:
        return False
    if any(keyword in lowered for keyword in TEST_KEYWORDS):
        return True
    if unit and unit.lower().strip() in UNIT_HINTS:
        return True
    return False


def extract_lab_data(pdf_path: str) -> List[Dict]:
    """
    Parses lab values from free text and tables.
    Expected output: [{test_name, value, unit, reference_range?}, ...]
    """
    lab_data = []
    seen = set()

    text_pattern = re.compile(
        r"([A-Za-z][A-Za-z0-9 ()/%+-]{1,50})\s+([0-9]+(?:\.[0-9]+)?)\s*([A-Za-z/%^0-9-]+)"
    )

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for name, value, unit in text_pattern.findall(text):
                if not _is_likely_lab_test(name, unit):
                    continue
                test_name = _normalize_test_name(name)
                row_key = (test_name.lower(), value, unit.lower())
                if row_key in seen:
                    continue
                seen.add(row_key)
                lab_data.append(
                    {
                        "test_name": test_name,
                        "value": float(value),
                        "unit": unit,
                        "reference_range": None,
                    }
                )

            tables = page.extract_tables() or []
            for table in tables:
                for row in table:
                    if not row or len(row) < 2:
                        continue
                    name = str(row[0] or "").strip()
                    value_str = str(row[1] or "").strip()
                    if not name or not re.search(r"[A-Za-z]", name):
                        continue
                    if not _is_likely_lab_test(name, str(row[2] if len(row) > 2 and row[2] else "")):
                        continue
                    numeric = re.search(r"([0-9]+(?:\.[0-9]+)?)", value_str)
                    if not numeric:
                        continue
                    unit = ""
                    if len(row) > 2 and row[2]:
                        unit = str(row[2]).strip()
                    ref_range = ""
                    if len(row) > 3 and row[3]:
                        ref_range = str(row[3]).strip()

                    test_name = _normalize_test_name(name)
                    value = float(numeric.group(1))
                    row_key = (test_name.lower(), f"{value}", unit.lower())
                    if row_key in seen:
                        continue
                    seen.add(row_key)
                    lab_data.append(
                        {
                            "test_name": test_name,
                            "value": value,
                            "unit": unit or None,
                            "reference_range": ref_range or None,
                        }
                    )

    return lab_data
