from services.matcher import analyze_match
from services.path_generator import order_skills
from services.skill_extractor import extract_skills


def test_extract_skills_detects_aliases():
    assert extract_skills("Built DRF APIs with Postgres and JWT auth") == [
        "authentication",
        "django",
        "postgresql",
    ]


def test_analyze_match_scores_detected_requirements():
    result = analyze_match("Python Django", "Python Django Redis")
    assert result["match_score"] == 67
    assert result["missing_skills"] == ["redis"]


def test_order_skills_places_dependencies_first():
    ordered = order_skills(["django", "python"])
    assert ordered.index("python") < ordered.index("django")
