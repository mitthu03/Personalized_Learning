from pydantic import BaseModel, Field


class ParsedProfile(BaseModel):
    raw_text: str
    skills: list[str] = Field(default_factory=list)
    years_experience: int | None = None
    roles: list[str] = Field(default_factory=list)


class ParseTextRequest(BaseModel):
    text: str


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str
    resume_skills: list[str] = Field(default_factory=list)
    job_skills: list[str] = Field(default_factory=list)


class SkillMatch(BaseModel):
    matched_skills: list[str]
    missing_skills: list[str]
    extra_skills: list[str]
    match_score: int
    explanation: str
    interview_questions: list[str]
    ats_score: int
    ats_feedback: list[str]
    suggested_roles: list[str]
    assessment_questions: list[str]


class GeneratePathRequest(BaseModel):
    missing_skills: list[str]
    target_role: str | None = None
    weeks: int = Field(default=8, ge=1, le=26)


class Resource(BaseModel):
    title: str
    type: str
    url: str | None = None


class PathStep(BaseModel):
    week: int
    title: str
    skill: str
    objective: str
    project: str
    resources: list[Resource]


class LearningPathResponse(BaseModel):
    target_role: str
    readiness_formula: str
    steps: list[PathStep]
