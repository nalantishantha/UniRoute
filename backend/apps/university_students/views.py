from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import UniversityStudents
from apps.accounts.models import Users


@csrf_exempt
@require_http_methods(["GET"])
def get_university_student_by_user(request, user_id):
    """Get university student information by user ID"""
    try:
        university_student = UniversityStudents.objects.get(user__user_id=user_id)
        
        return JsonResponse({
            'success': True,
            'university_student_id': university_student.university_student_id,
            'user_id': university_student.user.user_id,
            'university_id': university_student.university.university_id,
            'degree_program_id': university_student.degree_program.degree_program_id,
            'year_of_study': university_student.year_of_study,
            'registration_number': university_student.registration_number,
            'status': university_student.status,
        })
    
    except UniversityStudents.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'No university student record found for this user'
        }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
