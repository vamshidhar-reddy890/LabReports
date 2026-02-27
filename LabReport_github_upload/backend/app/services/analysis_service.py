from typing import Dict, List, Optional

from app.services.benchmark_service import find_benchmark, get_reference_values
from app.services.llm_service import generate_patient_friendly_text
from app.services.rag_service import retrieve_context


def analyze_test(test: Dict, benchmarks: Dict, gender: Optional[str] = None, age: Optional[int] = None) -> Dict:
    ref = find_benchmark(test["test_name"], benchmarks)
    if not ref:
        return {
            "status": "unknown",
            "description": "No benchmark found for this test.",
            "reference_range": test.get("reference_range"),
            "interpretation": "This result was extracted, but benchmark data is not available.",
        }

    min_val, max_val, unit = get_reference_values(ref, gender=gender, age=age)
    value = test["value"]
    if min_val is None or max_val is None:
        status = "unknown"
    elif value < min_val:
        status = "low"
    elif value > max_val:
        status = "high"
    else:
        status = "normal"

    reference_range = f"{min_val}-{max_val} {unit}".strip() if min_val is not None and max_val is not None else None
    context = retrieve_context(test["test_name"], status)
    interpretation = build_interpretation(test["test_name"], value, status, reference_range, ref.get("description", ""), context)

    return {
        "status": status,
        "description": ref.get("description", ""),
        "reference_range": reference_range,
        "interpretation": interpretation,
    }


def build_interpretation(test_name: str, value: float, status: str, reference_range: Optional[str], description: str, context: str) -> str:
    llm_text = generate_patient_friendly_text(
        test_name=test_name,
        value=value,
        status=status,
        reference_range=reference_range,
        description=description,
        context=context,
    )
    if llm_text:
        return llm_text

    if status == "normal":
        lead = f"{test_name} is within the expected range."
        reassurance = "This is generally a reassuring sign."
    elif status == "low":
        lead = f"{test_name} is slightly below the expected range."
        reassurance = "This can happen for many manageable reasons and is usually worth routine follow-up."
    elif status == "high":
        lead = f"{test_name} is above the expected range."
        reassurance = "This does not always mean serious disease, but it should be reviewed with your doctor."
    else:
        lead = f"{test_name} was identified in your report."
        reassurance = "A direct benchmark was not found, so discuss this value with your clinician."

    ref_text = f" Reference range: {reference_range}." if reference_range else ""
    base = f"{lead} Your value is {value}.{ref_text} {description} {reassurance}".strip()
    if context:
        return f"{base} Context: {context[:320]}"
    return base


def risk_score(results: List[Dict]) -> float:
    if not results:
        return 0.0
    known = [item for item in results if item["status"] in {"high", "low", "normal"}]
    if not known:
        return 0.0
    penalty = sum(1 for item in known if item["status"] in {"high", "low"})
    score = min(100.0, (penalty / len(known)) * 100.0)
    return round(score, 2)


def build_report_summary(analyzed_tests: List[Dict]) -> str:
    abnormal = [t for t in analyzed_tests if t["status"] in {"high", "low"}]
    normal = [t for t in analyzed_tests if t["status"] == "normal"]
    unknown = [t for t in analyzed_tests if t["status"] == "unknown"]

    lines = ["Your lab report was analyzed with medical benchmark references."]
    if abnormal:
        lines.append(f"{len(abnormal)} test(s) are outside the expected range and need attention.")
    else:
        lines.append("No major out-of-range values were detected.")
    if normal:
        lines.append(f"{len(normal)} test(s) are within normal range.")
    if unknown:
        lines.append(f"{len(unknown)} extracted item(s) were ignored from risk scoring due to missing benchmark mapping.")
    lines.append("This summary supports understanding and does not replace medical diagnosis.")
    return " ".join(lines)
