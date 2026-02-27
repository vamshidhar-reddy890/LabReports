from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Report, ReportTest, User

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/table-counts")
def table_counts(db: Session = Depends(get_db), _=Depends(get_current_user)):
    users_count = db.query(func.count(User.id)).scalar() or 0
    reports_count = db.query(func.count(Report.id)).scalar() or 0
    reports_tests_count = db.query(func.count(ReportTest.id)).scalar() or 0
    return {
        "users": users_count,
        "reports": reports_count,
        "reports_tests": reports_tests_count,
    }
