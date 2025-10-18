import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from apps.mentoring.models import Mentors
from apps.accounts.models import Users
from apps.university_students.models import UniversityStudents


@method_decorator(csrf_exempt, name='dispatch')
class UserMentorStatusView(View):
    """Return mentor status for a given user or current user.

    GET /api/mentoring/user-status/            -> uses authenticated user (not implemented auth-wise)
    GET /api/mentoring/user-status/<int:user_id>/ -> check by user id

    Response:
    { "success": True, "is_mentor": True/False, "mentor": {...} }
    """

    def get(self, request, user_id=None):
        try:
            # If user_id provided in URL, use it; else try to read from query or session
            if user_id is None:
                # Attempt to read user id from GET param 'user_id'
                user_id = request.GET.get('user_id')
                if user_id:
                    try:
                        user_id = int(user_id)
                    except (ValueError, TypeError):
                        return JsonResponse({
                            'success': False,
                            'error': 'Invalid user_id'
                        }, status=400)
                else:
                    return JsonResponse({
                        'success': False,
                        'error': 'user_id not provided'
                    }, status=400)

            # Find the user
            try:
                user = Users.objects.get(user_id=user_id)
            except Users.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'User not found'
                }, status=404)

            # Find university student record
            try:
                uni_student = UniversityStudents.objects.get(user=user)
            except UniversityStudents.DoesNotExist:
                return JsonResponse({
                    'success': True,
                    'is_mentor': False,
                    'mentor': None,
                    'message': 'User is not a university student'
                })

            # Find mentor record if exists
            try:
                mentor = Mentors.objects.get(university_student=uni_student)
                mentor_info = {
                    'mentor_id': mentor.mentor_id,
                    'user_id': mentor.user.user_id,
                    'expertise': mentor.expertise,
                    'bio': mentor.bio,
                    'approved': mentor.approved,
                    'created_at': mentor.created_at.isoformat() if mentor.created_at else None,
                }
                return JsonResponse({
                    'success': True,
                    'is_mentor': True,
                    'mentor': mentor_info
                })
            except Mentors.DoesNotExist:
                return JsonResponse({
                    'success': True,
                    'is_mentor': False,
                    'mentor': None
                })

        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
