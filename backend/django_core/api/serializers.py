from rest_framework import serializers


class AnalyzeRequestSerializer(serializers.Serializer):
    resume_title = serializers.CharField(default="Resume", required=False)
    resume_text = serializers.CharField(required=False, allow_blank=True)
    resume_file = serializers.FileField(required=False, allow_null=True)
    job_title = serializers.CharField()
    company = serializers.CharField(required=False, allow_blank=True)
    job_description = serializers.CharField()
    weeks = serializers.IntegerField(default=8, min_value=1, max_value=26)

    def validate(self, attrs):
        if not attrs.get("resume_text") and not attrs.get("resume_file"):
            raise serializers.ValidationError("Provide resume text or a PDF, DOCX, or TXT resume file.")
        return attrs
