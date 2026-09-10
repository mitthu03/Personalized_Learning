from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db import transaction
from rest_framework import parsers, permissions, response, status, views

from jobs.models import JobDescription
from learning_paths.models import LearningPath, PathStep
from learning_paths.serializers import LearningPathSerializer
from resumes.models import Resume

from .ai_client import AIClient, AIServiceError
from .serializers import AnalyzeRequestSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    return JsonResponse({"status": "ok"})
    
class AnalyzeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        serializer = AnalyzeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        ai = AIClient()

        try:
            resume_file = data.get("resume_file")
            resume_profile = ai.parse_file(resume_file) if resume_file else ai.parse_text(data["resume_text"])
            resume_text = resume_profile["raw_text"]
            job_profile = ai.parse_text(data["job_description"])
            match = ai.match(
                resume_text=resume_text,
                job_description=data["job_description"],
                resume_skills=resume_profile["skills"],
                job_skills=job_profile["skills"],
            )
            generated_path = ai.generate_path(
                missing_skills=match["missing_skills"],
                target_role=data["job_title"],
                weeks=data["weeks"],
            )
        except AIServiceError as exc:
            return response.Response(
                {"detail": f"AI service unavailable: {exc}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        with transaction.atomic():
            resume = Resume.objects.create(
                user=request.user,
                title=data.get("resume_title") or "Resume",
                file=resume_file,
                raw_text=resume_text,
                extracted_skills=resume_profile["skills"],
                years_experience=resume_profile.get("years_experience"),
            )
            job = JobDescription.objects.create(
                user=request.user,
                title=data["job_title"],
                company=data.get("company", ""),
                raw_text=data["job_description"],
                extracted_requirements=job_profile["skills"],
            )
            path = LearningPath.objects.create(
                user=request.user,
                resume=resume,
                job_description=job,
                match_score=match["match_score"],
                readiness_percentage=match["match_score"],
                matched_skills=match["matched_skills"],
                missing_skills=match["missing_skills"],
                extra_skills=match["extra_skills"],
                analysis=match["explanation"],
                interview_questions=match["interview_questions"],
                ats_score=match["ats_score"],
                ats_feedback=match["ats_feedback"],
                suggested_roles=match["suggested_roles"],
                assessment_questions=match["assessment_questions"],
            )
            for position, step in enumerate(generated_path["steps"], start=1):
                PathStep.objects.create(
                    learning_path=path,
                    week=step["week"],
                    title=step["title"],
                    skill=step["skill"],
                    objective=step["objective"],
                    project=step["project"],
                    resources=step["resources"],
                    position=position,
                )

        return response.Response(LearningPathSerializer(path).data, status=status.HTTP_201_CREATED)
