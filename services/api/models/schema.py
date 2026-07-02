from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    timezone = Column(String, default="UTC")
    created_at = Column(DateTime, server_default=func.now())


class DailyLog(Base):
    __tablename__ = "daily_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    sleep_hours = Column(Float)
    workout_json = Column(JSON)
    class_name = Column(String)
    understanding_pct = Column(Integer)
    attendance_status = Column(String)
    mood = Column(Integer)
    stress = Column(Integer)
    confidence = Column(Integer)
    free_text_thought = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class MemoryEpisode(Base):
    __tablename__ = "memory_episodes"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    category = Column(String)
    content = Column(Text)
    embedding_id = Column(String)
    importance_score = Column(Float)


class EmotionEvent(Base):
    __tablename__ = "emotion_events"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    trigger_type = Column(String)
    trigger_desc = Column(Text)
    emotion = Column(String)
    intensity = Column(Integer)


class PersonalitySnapshot(Base):
    __tablename__ = "personality_snapshots"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    discipline = Column(Float)
    confidence = Column(Float)
    introversion = Column(Float)
    emotional_stability = Column(Float)
    curiosity = Column(Float)
    risk_tolerance = Column(Float)
    ambition = Column(Float)
    consistency = Column(Float)
    self_esteem = Column(Float)
    resilience = Column(Float)
    conscientiousness = Column(Float)


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    target = Column(String)
    input_features_json = Column(JSON)
    prediction_json = Column(JSON)
    confidence = Column(Float)
    explanation = Column(Text)
    outcome_actual = Column(String, nullable=True)


class MotivationSeries(Base):
    __tablename__ = "motivation_series"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    motivation_pct = Column(Float)
    contributing_factors_json = Column(JSON)


class ScheduleEvent(Base):
    __tablename__ = "schedule_events"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    type = Column(String)
    title = Column(String)
    energy_forecast = Column(Float)
    notes = Column(Text)


class Person(Base):
    __tablename__ = "people"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    relation_type = Column(String)
    importance_score = Column(Float)
    trust_level = Column(Float)
    comm_frequency = Column(String)
    compatibility = Column(Float)
    conflict_history_json = Column(JSON)


class FutureSelfConversation(Base):
    __tablename__ = "future_self_conversations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    horizon = Column(String)
    question = Column(Text)
    response = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String)
    assumptions_json = Column(JSON)
    predicted_outcomes_json = Column(JSON)


class FailureRiskScore(Base):
    __tablename__ = "failure_risk_scores"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    domain = Column(String)
    probability = Column(Float)
    reasons_json = Column(JSON)


class LifeGraphEdge(Base):
    __tablename__ = "life_graph_edges"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    from_node = Column(String)
    to_node = Column(String)
    relationship = Column(String)
    strength = Column(Float)
