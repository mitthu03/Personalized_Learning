from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AnalyzeView, health_check

from jobs.views import JobDescriptionViewSet
from learning_paths.views import LearningPathViewSet, PathStepViewSet
from resumes.views import ResumeViewSet
from users.views import UserViewSet

from .views import AnalyzeView

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("resumes", ResumeViewSet, basename="resumes")
router.register("jobs", JobDescriptionViewSet, basename="jobs")
router.register("paths", LearningPathViewSet, basename="paths")
router.register("path-steps", PathStepViewSet, basename="path-steps")

urlpatterns = [
    path("analyze/", AnalyzeView.as_view(), name="analyze"),
    path("health/", health_check, name="health_check"),
]
urlpatterns += router.urls
