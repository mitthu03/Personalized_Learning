from fastapi import APIRouter

from schemas import GeneratePathRequest, LearningPathResponse
from services.path_generator import generate_path

router = APIRouter()


@router.post("/generate-path", response_model=LearningPathResponse)
def generate_learning_path(payload: GeneratePathRequest) -> dict:
    return generate_path(
        missing_skills=payload.missing_skills,
        target_role=payload.target_role,
        weeks=payload.weeks,
    )
