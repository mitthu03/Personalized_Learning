from __future__ import annotations

import math

import networkx as nx


DEPENDENCIES: dict[str, list[str]] = {
    "django": ["python", "rest api", "authentication"],
    "fastapi": ["python", "rest api"],
    "celery": ["python", "redis"],
    "websocket": ["django", "redis"],
    "machine learning": ["python"],
    "nlp": ["python", "machine learning"],
    "llm": ["python", "rest api"],
    "vector database": ["python", "machine learning"],
    "networkx": ["python"],
    "docker": [],
    "postgresql": [],
    "react": ["javascript"],
    "typescript": ["javascript"],
}


def generate_path(missing_skills: list[str], target_role: str | None, weeks: int) -> dict:
    ordered_skills = order_skills(missing_skills)
    if not ordered_skills:
        ordered_skills = ["portfolio polish", "mock interviews"]

    chunk_size = max(1, math.ceil(len(ordered_skills) / weeks))
    steps = []
    week = 1
    for index in range(0, len(ordered_skills), chunk_size):
        for skill in ordered_skills[index : index + chunk_size]:
            steps.append(build_step(week, skill))
        week += 1

    return {
        "target_role": target_role or "Target Role",
        "readiness_formula": "readiness = initial match score + completed roadmap step percentage weighted by remaining gap",
        "steps": steps,
    }


def order_skills(skills: list[str]) -> list[str]:
    requested = {skill.lower() for skill in skills}
    graph = nx.DiGraph()

    for skill in requested:
        graph.add_node(skill)
        for dependency in DEPENDENCIES.get(skill, []):
            if dependency in requested:
                graph.add_edge(dependency, skill)

    try:
        return list(nx.topological_sort(graph))
    except nx.NetworkXUnfeasible:
        return sorted(requested)


def build_step(week: int, skill: str) -> dict:
    title = f"Build capability in {skill.title()}"
    return {
        "week": week,
        "title": title,
        "skill": skill,
        "objective": f"Understand the core concepts of {skill} and apply them in a job-relevant workflow.",
        "project": f"Create a small portfolio artifact that demonstrates practical {skill} usage.",
        "resources": [
            {
                "title": f"Official {skill.title()} documentation or guide",
                "type": "documentation",
                "url": None,
            },
            {
                "title": f"Hands-on {skill.title()} mini project",
                "type": "project",
                "url": None,
            },
        ],
    }
