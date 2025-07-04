from fastapi import APIRouter, Depends, HTTPException
from ..ai import gemini_plan

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-plan")
def generate_plan(prompt: str):
    result = gemini_plan.generate_workout_plan(prompt)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result 