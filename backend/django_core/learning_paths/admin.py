from django.contrib import admin

from .models import LearningPath, PathStep


class PathStepInline(admin.TabularInline):
    model = PathStep
    extra = 0


@admin.register(LearningPath)
class LearningPathAdmin(admin.ModelAdmin):
    inlines = [PathStepInline]
    list_display = ["user", "job_description", "match_score", "readiness_percentage", "created_at"]
