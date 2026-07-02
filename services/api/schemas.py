from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, Any


# ---- Auth ----

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    timezone: Optional[str] = "UTC"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    timezone: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---- Daily Logs ----

class Activity(BaseModel):
    name: str
    type: Optional[str] = None       # e.g. class, workout, meeting
    time: Optional[str] = None       # e.g. "14:30"
    understanding_pct: Optional[int] = None
    notes: Optional[str] = None


class DailyLogCreate(BaseModel):
    date: date
    sleep_hours: Optional[float] = None
    workout_json: Optional[dict] = None
    activities_json: Optional[list[Activity]] = None
    mood: Optional[int] = None
    stress: Optional[int] = None
    confidence: Optional[int] = None
    free_text_thought: Optional[str] = None


class DailyLogOut(DailyLogCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
