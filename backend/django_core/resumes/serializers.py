from rest_framework import serializers

from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "file",
            "raw_text",
            "extracted_skills",
            "years_experience",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["extracted_skills", "years_experience", "created_at", "updated_at"]
