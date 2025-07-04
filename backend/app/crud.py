from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_workout_collection(db: Session, collection_id: int):
    return db.query(models.WorkoutCollection).filter(models.WorkoutCollection.id == collection_id).first()

def create_workout_collection(db: Session, collection: schemas.WorkoutCollectionCreate):
    db_collection = models.WorkoutCollection(name=collection.name, description=collection.description)
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection 