from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("jobs", "0001_initial"),
        ("resumes", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="LearningPath",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("match_score", models.PositiveSmallIntegerField(default=0)),
                ("readiness_percentage", models.PositiveSmallIntegerField(default=0)),
                ("matched_skills", models.JSONField(blank=True, default=list)),
                ("missing_skills", models.JSONField(blank=True, default=list)),
                ("extra_skills", models.JSONField(blank=True, default=list)),
                ("analysis", models.TextField(blank=True)),
                ("interview_questions", models.JSONField(blank=True, default=list)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "job_description",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="learning_paths", to="jobs.jobdescription"),
                ),
                (
                    "resume",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="learning_paths", to="resumes.resume"),
                ),
                (
                    "user",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="learning_paths", to=settings.AUTH_USER_MODEL),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PathStep",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("week", models.PositiveSmallIntegerField()),
                ("title", models.CharField(max_length=255)),
                ("skill", models.CharField(max_length=120)),
                ("objective", models.TextField()),
                ("project", models.TextField(blank=True)),
                ("resources", models.JSONField(blank=True, default=list)),
                (
                    "status",
                    models.CharField(
                        choices=[("pending", "Pending"), ("in_progress", "In Progress"), ("completed", "Completed")],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("position", models.PositiveSmallIntegerField(default=0)),
                (
                    "learning_path",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="steps", to="learning_paths.learningpath"),
                ),
            ],
            options={
                "ordering": ["week", "position", "id"],
            },
        ),
    ]
