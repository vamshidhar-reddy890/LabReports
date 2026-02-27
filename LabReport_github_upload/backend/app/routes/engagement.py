from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import ContactMessage, Review, User
from app.schemas import ContactCreate, ContactOut, MessageResponse, ReviewCreate, ReviewOut

router = APIRouter(prefix="/api/engagement", tags=["engagement"])


@router.get("/reviews", response_model=List[ReviewOut])
def list_reviews(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    output = []
    for item in reviews:
        output.append(
            {
                "id": item.id,
                "user_id": item.user_id,
                "user_name": item.user.full_name if item.user else "User",
                "rating": item.rating,
                "comment": item.comment,
                "created_at": item.created_at,
            }
        )
    return output


@router.post("/reviews", response_model=MessageResponse)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    row = Review(
        user_id=current_user.id,
        rating=payload.rating,
        comment=payload.comment.strip(),
    )
    db.add(row)
    db.commit()
    return {"message": "Review submitted successfully"}


@router.post("/contact", response_model=MessageResponse)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    row = ContactMessage(
        user_id=current_user.id,
        name=payload.name.strip(),
        contact_number=payload.contact_number.strip(),
        subject=payload.subject.strip(),
        message=payload.message.strip(),
    )
    db.add(row)
    db.commit()
    return {"message": "Contact request submitted successfully"}


@router.get("/contact/me", response_model=List[ContactOut])
def my_contacts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = (
        db.query(ContactMessage)
        .filter(ContactMessage.user_id == current_user.id)
        .order_by(ContactMessage.created_at.desc())
        .all()
    )
    return rows
