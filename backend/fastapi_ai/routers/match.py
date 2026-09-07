from fastapi import APIRouter

from schemas import MatchRequest, SkillMatch
from services.matcher import analyze_match

router = APIRouter()


@router.post("/match", response_model=SkillMatch)
def match_profile(payload: MatchRequest) -> dict:
    return analyze_match(
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        resume_skills=payload.resume_skills,
        job_skills=payload.job_skills,
    )
