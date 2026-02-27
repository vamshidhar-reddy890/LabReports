from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    demo_password_hint: Optional[str] = Field(default=None, max_length=255)
    gender: Optional[str] = None
    age: Optional[int] = Field(default=None, ge=1, le=120)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    gender: Optional[str]
    age: Optional[int]
    demo_password_hint: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    gender: Optional[str] = None
    age: Optional[int] = Field(default=None, ge=1, le=120)


class LabTestOut(BaseModel):
    id: int
    test_name: str
    value: float
    unit: Optional[str] = None
    status: str
    reference_range: Optional[str] = None
    interpretation: Optional[str] = None

    class Config:
        from_attributes = True


class ReportOut(BaseModel):
    id: int
    filename: str
    summary: str
    abnormal_count: int
    risk_score: float
    created_at: datetime
    tests: List[LabTestOut]

    class Config:
        from_attributes = True


class ReportListItem(BaseModel):
    id: int
    filename: str
    abnormal_count: int
    risk_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=5, max_length=1200)


class ReviewOut(BaseModel):
    id: int
    user_id: int
    user_name: str
    rating: int
    comment: str
    created_at: datetime


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    contact_number: str = Field(min_length=7, max_length=25)
    subject: str = Field(min_length=3, max_length=150)
    message: str = Field(min_length=10, max_length=2000)


class ContactOut(BaseModel):
    id: int
    user_id: int
    name: Optional[str] = None
    contact_number: Optional[str] = None
    subject: str
    message: str
    created_at: datetime


class MessageResponse(BaseModel):
    message: str
