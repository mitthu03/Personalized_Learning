from django.conf import settings
from django.db import models


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resumes")
    title = models.CharField(max_length=255, default="Resume")
    file = models.FileField(upload_to="resumes/", blank=True, null=True)
    raw_text = models.TextField(blank=True)
    extracted_skills = models.JSONField(default=list, blank=True)
    years_experience = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.user})"
