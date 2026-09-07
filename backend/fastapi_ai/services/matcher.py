from __future__ import annotations

from services.skill_extractor import extract_skills


ROLE_PROFILES = {
    "Backend Python Developer": {"python", "django", "fastapi", "rest api", "postgresql"},
    "Full-Stack Developer": {"python", "react", "javascript", "rest api", "postgresql"},
    "AI/ML Engineer": {"python", "machine learning", "nlp", "llm", "vector database"},
    "Platform Engineer": {"python", "docker", "redis", "celery", "postgresql", "authentication"},
}


def analyze_match(
    resume_text: str,
    job_description: str,
    resume_skills: list[str] | None = None,
    job_skills: list[str] | None = None,
) -> dict:
    resume_set = set(resume_skills or extract_skills(resume_text))
    job_set = set(job_skills or extract_skills(job_description))

    matched = sorted(resume_set & job_set)
    missing = sorted(job_set - resume_set)
    extra = sorted(resume_set - job_set)

    if not job_set:
        score = 0
    else:
        score = round((len(matched) / len(job_set)) * 100)

    if missing:
        explanation = (
            f"The profile matches {len(matched)} of {len(job_set)} required skills. "
            f"Priority gaps are {', '.join(missing[:5])}."
        )
    else:
        explanation = "The profile covers the detected job requirements. Focus on interview practice and project evidence."

    ats_score = min(100, round((len(matched) / max(len(job_set), 1)) * 85 + (15 if resume_text.strip() else 0)))
    ats_feedback = []
    if missing:
        ats_feedback.append(f"Add evidence for: {', '.join(missing[:4])}.")
    if len(resume_text.split()) < 45:
        ats_feedback.append("Add measurable achievements and project outcomes to improve keyword coverage.")
    if not ats_feedback:
        ats_feedback.append("Strong keyword alignment. Keep skills grouped near relevant experience and projects.")

    suggested_roles = [
        role for role, required in ROLE_PROFILES.items()
        if len(resume_set & required) >= 2
    ]
    if not suggested_roles:
        suggested_roles = ["Backend Python Developer", "Platform Engineer"]

    assessment_questions = build_assessment_questions(missing or matched)

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills": extra,
        "match_score": score,
        "explanation": explanation,
        "interview_questions": build_interview_questions(matched, missing),
        "ats_score": ats_score,
        "ats_feedback": ats_feedback,
        "suggested_roles": suggested_roles[:4],
        "assessment_questions": assessment_questions,
    }


def build_interview_questions(matched: list[str], missing: list[str]) -> list[str]:
    questions: list[str] = []
    for skill in missing[:4]:
        questions.append(f"How would you learn and apply {skill} in a production project?")
    for skill in matched[:4]:
        questions.append(f"Describe a project where you used {skill} and the tradeoffs you handled.")
    if not questions:
        questions.append("Walk through your most relevant project and explain the technical decisions.")
    return questions[:8]


def build_assessment_questions(skills: list[str]) -> list[str]:
    questions = [
        f"Explain the core concepts of {skill} and when you would use it."
        for skill in skills[:5]
    ]
    return questions or ["Describe the architecture of your strongest technical project."]
