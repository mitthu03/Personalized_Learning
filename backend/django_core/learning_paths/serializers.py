from rest_framework import serializers

from .models import LearningPath, PathStep


class PathStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = PathStep
        fields = [
            "id",
            "week",
            "title",
            "skill",
            "objective",
            "project",
            "resources",
            "status",
            "position",
        ]


class LearningPathSerializer(serializers.ModelSerializer):
    steps = PathStepSerializer(many=True, read_only=True)
    job_title = serializers.CharField(source="job_description.title", read_only=True)

    class Meta:
        model = LearningPath
        fields = [
            "id",
            "resume",
            "job_description",
            "job_title",
            "match_score",
            "readiness_percentage",
            "matched_skills",
            "missing_skills",
            "extra_skills",
            "analysis",
            "interview_questions",
            "ats_score",
            "ats_feedback",
            "suggested_roles",
            "assessment_questions",
            "steps",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "match_score",
            "readiness_percentage",
            "matched_skills",
            "missing_skills",
            "extra_skills",
            "analysis",
            "interview_questions",
            "ats_score",
            "ats_feedback",
            "suggested_roles",
            "assessment_questions",
            "steps",
            "created_at",
            "updated_at",
        ]
