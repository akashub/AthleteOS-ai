from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Table
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    workouts = relationship("WorkoutSession", back_populates="user")

class WorkoutCollection(Base):
    __tablename__ = "workout_collections"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    workouts = relationship("Workout", back_populates="collection")

class Workout(Base):
    __tablename__ = "workouts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    collection_id = Column(Integer, ForeignKey("workout_collections.id"))
    collection = relationship("WorkoutCollection", back_populates="workouts")
    plans = relationship("WorkoutPlan", back_populates="workout")

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    workout_id = Column(Integer, ForeignKey("workouts.id"))
    workout = relationship("Workout", back_populates="plans")
    sessions = relationship("WorkoutSession", back_populates="plan")

class WorkoutSession(Base):
    __tablename__ = "workout_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_id = Column(Integer, ForeignKey("workout_plans.id"))
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="workouts")
    plan = relationship("WorkoutPlan", back_populates="sessions") 