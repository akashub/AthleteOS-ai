from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, crud, database
from typing import List

router = APIRouter(prefix="/collections", tags=["workout_collections"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.WorkoutCollectionOut)
def create_collection(collection: schemas.WorkoutCollectionCreate, db: Session = Depends(get_db)):
    return crud.create_workout_collection(db, collection)

@router.get("/", response_model=List[schemas.WorkoutCollectionOut])
def get_collections(db: Session = Depends(get_db)):
    return db.query(models.WorkoutCollection).all()

@router.get("/{collection_id}", response_model=schemas.WorkoutCollectionOut)
def get_collection(collection_id: int, db: Session = Depends(get_db)):
    collection = crud.get_workout_collection(db, collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection 