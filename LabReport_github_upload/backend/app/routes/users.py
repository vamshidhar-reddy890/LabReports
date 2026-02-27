from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import UserOut, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    email_owner = db.query(User).filter(User.email == payload.email, User.id != current_user.id).first()
    if email_owner:
        raise HTTPException(status_code=400, detail="Email already in use")

    current_user.full_name = payload.full_name
    current_user.email = payload.email
    current_user.gender = payload.gender
    current_user.age = payload.age

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
