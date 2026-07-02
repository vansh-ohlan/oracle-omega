from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import engine, get_db
from models.schema import DailyLog
from schemas import DailyLogCreate, DailyLogOut

load_dotenv()

app = FastAPI(title="ORACLE Omega API")


@app.get("/")
def root():
    return {"message": "ORACLE Omega API is running"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {"status": "ok", "database": db_status}


@app.post("/daily-logs", response_model=DailyLogOut)
def create_daily_log(log: DailyLogCreate, db: Session = Depends(get_db)):
    db_log = DailyLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@app.get("/daily-logs/{user_id}", response_model=list[DailyLogOut])
def get_daily_logs(user_id: int, db: Session = Depends(get_db)):
    logs = db.query(DailyLog).filter(DailyLog.user_id == user_id).order_by(DailyLog.date.desc()).all()
    return logs


@app.get("/daily-logs/entry/{log_id}", response_model=DailyLogOut)
def get_daily_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(DailyLog).filter(DailyLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log
