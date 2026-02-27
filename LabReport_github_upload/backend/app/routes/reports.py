import os
import shutil
import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import resolve_path, settings
from app.database import get_db
from app.deps import get_current_user
from app.models import Report, ReportTest, User
from app.schemas import ReportListItem, ReportOut
from app.services.analysis_service import analyze_test, build_report_summary, risk_score
from app.services.benchmark_service import load_benchmarks
from app.services.document_parser import extract_structured_data
from app.services.llm_service import extract_medical_from_image_with_ai

router = APIRouter(prefix="/api/reports", tags=["reports"])
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"}


def _is_placeholder_test(item: dict) -> bool:
    name = str(item.get("test_name", "")).strip().lower()
    return name in {"document review", "general extraction confidence", "data structure consistency", "clinical context match"}


def _only_placeholders(tests: list[dict]) -> bool:
    return bool(tests) and all(_is_placeholder_test(t) for t in tests)

@router.post("/upload", response_model=ReportOut)
def upload_report(
    file: UploadFile = File(...),
    gender: str | None = Form(default=None),
    age: int | None = Form(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is missing")

    upload_dir = Path(resolve_path(settings.upload_dir))
    upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = upload_dir / safe_name
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        tests = extract_structured_data(str(file_path))
        ext = Path(file.filename).suffix.lower()

        # AI vision fallback for image uploads when OCR/parser cannot extract usable tests.
        if ext in IMAGE_EXTS and (not tests or _only_placeholders(tests)):
            ai_tests = extract_medical_from_image_with_ai(str(file_path))
            if ai_tests:
                tests = ai_tests

        if not tests:
            tests = [
                {
                    "test_name": "Document Review",
                    "value": 0.0,
                    "unit": None,
                    "reference_range": None,
                }
            ]

        benchmarks = load_benchmarks()
        analyzed = []
        for test in tests:
            if test.get("status_override") in {"low", "normal", "high", "unknown"}:
                result = {
                    "status": test.get("status_override"),
                    "description": "Heuristic signal from uploaded imaging/document text.",
                    "reference_range": test.get("reference_range"),
                    "interpretation": test.get("interpretation_override")
                    or "Pattern-based signal extracted from upload; clinical confirmation is required.",
                }
            else:
                result = analyze_test(
                    test,
                    benchmarks,
                    gender=gender or current_user.gender,
                    age=age if age is not None else current_user.age,
                )
            analyzed.append({**test, **result})

        summary = build_report_summary(analyzed)
        abnormal_count = sum(1 for x in analyzed if x["status"] in {"low", "high"})
        score = risk_score(analyzed)

        report = Report(
            user_id=current_user.id,
            filename=file.filename,
            summary=summary,
            abnormal_count=abnormal_count,
            risk_score=score,
        )
        db.add(report)
        db.flush()

        for item in analyzed:
            db.add(
                ReportTest(
                    report_id=report.id,
                    test_name=item["test_name"],
                    value=item["value"],
                    unit=item.get("unit"),
                    status=item["status"],
                    reference_range=item.get("reference_range"),
                    interpretation=item.get("interpretation"),
                )
            )

        db.commit()
        db.refresh(report)
        return report
    finally:
        if file_path.exists():
            os.remove(file_path)


@router.get("", response_model=List[ReportListItem])
def list_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .all()
    )
    return reports


@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = (
        db.query(Report)
        .filter(Report.id == report_id, Report.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = (
        db.query(Report)
        .filter(Report.id == report_id, Report.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted"}
