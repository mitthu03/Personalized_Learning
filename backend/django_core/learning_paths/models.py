from django.conf import settings
from django.db import models


class LearningPath(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="learning_paths")
    resume = models.ForeignKey("resumes.Resume", on_delete=models.CASCADE, related_name="learning_paths")
    job_description = models.ForeignKey("jobs.JobDescription", on_delete=models.CASCADE, related_name="learning_paths")
    match_score = models.PositiveSmallIntegerField(default=0)
    readiness_percentage = models.PositiveSmallIntegerField(default=0)
    matched_skills = models.JSONField(default=list, blank=True)
    missing_skills = models.JSONField(default=list, blank=True)
    extra_skills = models.JSONField(default=list, blank=True)
    analysis = models.TextField(blank=True)
    interview_questions = models.JSONField(default=list, blank=True)
    ats_score = models.PositiveSmallIntegerField(default=0)
    ats_feedback = models.JSONField(default=list, blank=True)
    suggested_roles = models.JSONField(default=list, blank=True)
    assessment_questions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def recalculate_readiness(self) -> None:
        total_steps = self.steps.count()
        completed_steps = self.steps.filter(status=PathStep.Status.COMPLETED).count()
        progress = 0 if total_steps == 0 else completed_steps / total_steps
        remaining_gap_weight = 100 - self.match_score
        self.readiness_percentage = min(100, round(self.match_score + (remaining_gap_weight * progress)))

    def __str__(self) -> str:
        return f"{self.user} -> {self.job_description}"


class PathStep(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"

    learning_path = models.ForeignKey(LearningPath, on_delete=models.CASCADE, related_name="steps")
    week = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=255)
    skill = models.CharField(max_length=120)
    objective = models.TextField()
    project = models.TextField(blank=True)
    resources = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["week", "position", "id"]

    def __str__(self) -> str:
        return self.title
