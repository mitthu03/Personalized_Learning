from rest_framework import serializers

from .models import JobDescription


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = [
            "id",
            "title",
            "company",
            "raw_text",
            "extracted_requirements",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["extracted_requirements", "created_at", "updated_at"]
