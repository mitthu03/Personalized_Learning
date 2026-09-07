from __future__ import annotations

import requests
from django.conf import settings


class AIServiceError(RuntimeError):
    pass


class AIClient:
    def __init__(self, base_url: str | None = None) -> None:
        self.base_url = (base_url or settings.FASTAPI_AI_BASE_URL).rstrip("/")

    def parse_text(self, text: str) -> dict:
        return self._post("/parse-text", {"text": text})

    def parse_file(self, uploaded_file) -> dict:
        try:
            result = requests.post(
                f"{self.base_url}/parse",
                files={"file": (uploaded_file.name, uploaded_file.file, uploaded_file.content_type)},
                timeout=30,
            )
            result.raise_for_status()
        except requests.RequestException as exc:
            raise AIServiceError(str(exc)) from exc
        return result.json()

    def match(self, resume_text: str, job_description: str, resume_skills: list[str], job_skills: list[str]) -> dict:
        return self._post(
            "/match",
            {
                "resume_text": resume_text,
                "job_description": job_description,
                "resume_skills": resume_skills,
                "job_skills": job_skills,
            },
        )

    def generate_path(self, missing_skills: list[str], target_role: str | None = None, weeks: int = 8) -> dict:
        return self._post(
            "/generate-path",
            {
                "missing_skills": missing_skills,
                "target_role": target_role,
                "weeks": weeks,
            },
        )

    def _post(self, path: str, payload: dict) -> dict:
        try:
            result = requests.post(f"{self.base_url}{path}", json=payload, timeout=30)
            result.raise_for_status()
        except requests.RequestException as exc:
            raise AIServiceError(str(exc)) from exc
        return result.json()
