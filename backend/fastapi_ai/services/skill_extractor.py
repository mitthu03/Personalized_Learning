from __future__ import annotations

import re


SKILL_ALIASES: dict[str, set[str]] = {
    "python": {"python", "py"},
    "django": {"django", "django rest framework", "drf"},
    "fastapi": {"fastapi", "fast api"},
    "react": {"react", "react.js", "reactjs"},
    "javascript": {"javascript", "js", "ecmascript"},
    "typescript": {"typescript", "ts"},
    "postgresql": {"postgresql", "postgres", "sql"},
    "redis": {"redis"},
    "celery": {"celery"},
    "docker": {"docker", "containerization"},
    "aws": {"aws", "s3", "ec2"},
    "rest api": {"rest", "rest api", "restful"},
    "websocket": {"websocket", "web socket", "django channels"},
    "machine learning": {"machine learning", "ml", "ai/ml"},
    "nlp": {"nlp", "natural language processing", "spacy"},
    "llm": {"llm", "large language model", "gemini", "openai"},
    "vector database": {"vector database", "pinecone", "chroma", "embeddings"},
    "networkx": {"networkx", "graph theory", "dag"},
    "testing": {"testing", "pytest", "unit tests"},
    "authentication": {"authentication", "auth", "jwt", "oauth"},
}

ROLE_PATTERNS = [
    r"\b(?:software|backend|frontend|full stack|machine learning|data|ai)\s+(?:engineer|developer|scientist)\b",
    r"\b(?:django|react|python|fastapi)\s+developer\b",
]


def normalize_skill(skill: str) -> str:
    return re.sub(r"\s+", " ", skill.strip().lower())


def extract_skills(text: str) -> list[str]:
    normalized_text = f" {normalize_skill(text)} "
    found: set[str] = set()

    for canonical, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            pattern = r"(?<![a-z0-9+#.])" + re.escape(alias.lower()) + r"(?![a-z0-9+#.])"
            if re.search(pattern, normalized_text):
                found.add(canonical)
                break

    return sorted(found)


def extract_roles(text: str) -> list[str]:
    normalized_text = normalize_skill(text)
    roles: set[str] = set()
    for pattern in ROLE_PATTERNS:
        roles.update(match.group(0).title() for match in re.finditer(pattern, normalized_text))
    return sorted(roles)


def extract_years_experience(text: str) -> int | None:
    matches = re.findall(r"(\d{1,2})\+?\s+years?", text, flags=re.IGNORECASE)
    if not matches:
        return None
    return max(int(value) for value in matches)


def parse_profile(text: str) -> dict:
    clean_text = text.strip()
    return {
        "raw_text": clean_text,
        "skills": extract_skills(clean_text),
        "years_experience": extract_years_experience(clean_text),
        "roles": extract_roles(clean_text),
    }
