from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime
    class Config:
        orm_mode = True

class WorkoutCollectionBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkoutCollectionCreate(WorkoutCollectionBase):
    pass

class WorkoutCollectionOut(WorkoutCollectionBase):
    id: int
    class Config:
        orm_mode = True

class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None
    collection_id: Optional[int] = None

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutOut(WorkoutBase):
    id: int
    class Config:
        orm_mode = True

class WorkoutPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    workout_id: int

class WorkoutPlanCreate(WorkoutPlanBase):
    pass

class WorkoutPlanOut(WorkoutPlanBase):
    id: int
    class Config:
        orm_mode = True

class WorkoutSessionBase(BaseModel):
    plan_id: int
    completed_at: Optional[datetime.datetime] = None

class WorkoutSessionCreate(WorkoutSessionBase):
    pass

class WorkoutSessionOut(WorkoutSessionBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True 