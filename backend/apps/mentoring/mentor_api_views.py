import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from apps.mentoring.models import Mentors


@method_decorator(csrf_exempt, name='dispatch')
class MentorByUniversityStudentView(View):
    def get(self, request, university_student_id):
        """Get mentor information by university student ID"""
        try:
            mentor = Mentors.objects.get(university_student__university_student_id=university_student_id)

            return JsonResponse({
                'success': True,
                'mentor_id': mentor.mentor_id,
                'user_id': mentor.user.user_id,
                'expertise': mentor.expertise,
                'bio': mentor.bio,
                'approved': mentor.approved,
                'created_at': mentor.created_at.isoformat() if mentor.created_at else None,
            })

        except Mentors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'No mentor record found for this university student'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
