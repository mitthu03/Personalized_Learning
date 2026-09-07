from rest_framework import decorators, response, status, viewsets

from .models import LearningPath, PathStep
from .serializers import LearningPathSerializer, PathStepSerializer


class LearningPathViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LearningPathSerializer

    def get_queryset(self):
        return (
            LearningPath.objects.filter(user=self.request.user)
            .select_related("resume", "job_description")
            .prefetch_related("steps")
            .order_by("-created_at")
        )


class PathStepViewSet(viewsets.ModelViewSet):
    serializer_class = PathStepSerializer
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        return PathStep.objects.filter(learning_path__user=self.request.user)

    @decorators.action(detail=True, methods=["patch"])
    def status(self, request, pk=None):
        step = self.get_object()
        new_status = request.data.get("status")
        if new_status not in PathStep.Status.values:
            return response.Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        step.status = new_status
        step.save(update_fields=["status"])
        path = step.learning_path
        path.recalculate_readiness()
        path.save(update_fields=["readiness_percentage", "updated_at"])
        return response.Response(PathStepSerializer(step).data)
