from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Any


class DailyLogCreate(BaseModel):
    user_id: int
    date: date
    sleep_hours: Optional[float] = None
    workout_json: Optional[dict] = None
    class_name: Optional[str] = None
    understanding_pct: Optional[int] = None
    attendance_status: Optional[str] = None
    mood: Optional[int] = None
    stress: Optional[int] = None
    confidence: Optional[int] = None
    free_text_thought: Optional[str] = None


class DailyLogOut(DailyLogCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
