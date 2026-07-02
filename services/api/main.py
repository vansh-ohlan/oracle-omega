from fastapi import FastAPI
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="ORACLE Omega API")

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

@app.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "database": db_status
    }

@app.get("/")
def root():
    return {"message": "ORACLE Omega API is running"}
