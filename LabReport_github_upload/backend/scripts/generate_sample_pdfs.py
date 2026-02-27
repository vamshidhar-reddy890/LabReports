from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


SAMPLES = {
    "normal_case_1.pdf": [
        ("Hemoglobin", "14.5", "g/dL"),
        ("WBC", "7400", "cells/mcL"),
        ("Glucose", "92", "mg/dL"),
        ("Platelets", "280000", "platelets/mcL"),
    ],
    "normal_case_2.pdf": [
        ("Hemoglobin", "13.9", "g/dL"),
        ("WBC", "6200", "cells/mcL"),
        ("Creatinine", "0.9", "mg/dL"),
        ("Vitamin D", "32", "ng/mL"),
    ],
    "abnormal_case_1.pdf": [
        ("Hemoglobin", "11.2", "g/dL"),
        ("WBC", "12800", "cells/mcL"),
        ("Glucose", "122", "mg/dL"),
        ("Platelets", "510000", "platelets/mcL"),
    ],
    "abnormal_case_2.pdf": [
        ("LDL", "167", "mg/dL"),
        ("Triglycerides", "220", "mg/dL"),
        ("Vitamin D", "14", "ng/mL"),
        ("Creatinine", "1.45", "mg/dL"),
    ],
}


def create_pdf(path: Path, rows):
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter
    y = height - 60
    c.setFont("Helvetica-Bold", 14)
    c.drawString(60, y, "Sample Lab Report")
    y -= 30
    c.setFont("Helvetica", 11)
    c.drawString(60, y, "Test Name")
    c.drawString(260, y, "Value")
    c.drawString(360, y, "Unit")
    y -= 20
    c.line(60, y, 540, y)
    y -= 20
    for test, value, unit in rows:
        c.drawString(60, y, test)
        c.drawString(260, y, value)
        c.drawString(360, y, unit)
        y -= 22
    c.save()


def main():
    out = Path("sample_reports")
    out.mkdir(parents=True, exist_ok=True)
    for filename, rows in SAMPLES.items():
        create_pdf(out / filename, rows)
    print(f"Generated {len(SAMPLES)} sample PDFs in {out.resolve()}")


if __name__ == "__main__":
    main()
