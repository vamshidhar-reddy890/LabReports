from fastapi import APIRouter, Depends

from app.deps import get_current_user
from app.models import User
from app.services.benchmark_service import load_benchmarks

router = APIRouter(prefix="/api/benchmarks", tags=["benchmarks"])


@router.get("")
def get_benchmarks(current_user: User = Depends(get_current_user)):
    return load_benchmarks()
