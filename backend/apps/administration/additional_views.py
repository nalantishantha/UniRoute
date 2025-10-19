from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Q
from django.core.paginator import Paginator
import json

from apps.accounts.models import Users, UserDetails, UserTypes
from apps.students.models import Students
from apps.university_students.models import UniversityStudents
from apps.universities.models import Universities

@csrf_exempt
def get_all_users(request):
    """Get all users with their details and user types"""
    if request.method == 'GET':
        try:
            # Get query parameters
            user_type = request.GET.get('type', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            users = Users.objects.select_related('user_type').prefetch_related('userdetails')
            
            # Apply filters
            if user_type != 'all':
                users = users.filter(user_type__type_name=user_type)
            if search:
                users = users.filter(
                    Q(username__icontains=search) | 
                    Q(email__icontains=search) |
                    Q(userdetails__full_name__icontains=search)
                )
            
            # Order by creation date
            users = users.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(users, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            users_data = []
            for user in page_obj:
                try:
                    user_details = user.userdetails
                except:
                    user_details = None
                
                users_data.append({
                    'user_id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type.type_name,
                    'is_active': bool(user.is_active),
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'is_verified': bool(user_details.is_verified) if user_details else False,
                    'created_at': user.created_at.isoformat() if user.created_at else '',
                    'last_login': None  # You can implement login tracking
                })
            
            return JsonResponse({
                'success': True,
                'users': users_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch users: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_students(request):
    """Get all high school students"""
    if request.method == 'GET':
        try:
            # Get query parameters
            stage = request.GET.get('stage', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            students = Students.objects.select_related('user', 'user__userdetails')
            
            # Apply filters
            if stage != 'all':
                students = students.filter(current_stage=stage)
            if search:
                students = students.filter(
                    Q(user__username__icontains=search) | 
                    Q(user__email__icontains=search) |
                    Q(user__userdetails__full_name__icontains=search) |
                    Q(school__icontains=search) |
                    Q(district__icontains=search)
                )
            
            # Order by creation date
            students = students.order_by('-user__created_at')
            
            # Pagination
            paginator = Paginator(students, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            students_data = []
            for student in page_obj:
                try:
                    user_details = student.user.userdetails
                except:
                    user_details = None
                
                students_data.append({
                    'student_id': student.student_id,
                    'user_id': student.user.user_id,
                    'username': student.user.username,
                    'email': student.user.email,
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'current_stage': student.current_stage,
                    'district': student.district or '',
                    'school': student.school or '',
                    'is_active': bool(student.user.is_active),
                    'created_at': student.user.created_at.isoformat() if student.user.created_at else ''
                })
            
            return JsonResponse({
                'success': True,
                'students': students_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch students: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_university_students(request):
    """Get all university students"""
    if request.method == 'GET':
        try:
            # Get query parameters
            university = request.GET.get('university', 'all')
            degree = request.GET.get('degree', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            university_students = UniversityStudents.objects.select_related(
                'user', 'user__userdetails', 'university', 'degree_program'
            )
            
            # Apply filters
            if university != 'all':
                university_students = university_students.filter(university_id=university)
            if degree != 'all':
                university_students = university_students.filter(degree_program_id=degree)
            if search:
                university_students = university_students.filter(
                    Q(user__username__icontains=search) | 
                    Q(user__email__icontains=search) |
                    Q(user__userdetails__full_name__icontains=search) |
                    Q(registration_number__icontains=search) |
                    Q(university__name__icontains=search) |
                    Q(degree_program__title__icontains=search)
                )
            
            # Order by creation date
            university_students = university_students.order_by('-user__created_at')
            
            # Pagination
            paginator = Paginator(university_students, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            students_data = []
            for student in page_obj:
                try:
                    user_details = student.user.userdetails
                except:
                    user_details = None
                
                # Calculate graduation year
                graduation_year = ''
                if student.enrollment_date and hasattr(student, 'duration'):
                    try:
                        graduation_year = student.enrollment_date.year + student.duration.duration_years
                    except:
                        graduation_year = ''
                
                students_data.append({
                    'university_student_id': student.university_student_id,
                    'user_id': student.user.user_id,
                    'username': student.user.username,
                    'email': student.user.email,
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'university': student.university.name,
                    'faculty': student.faculty.name if student.faculty else '',
                    'degree_program': student.degree_program.title,
                    'year_of_study': student.year_of_study or '',
                    'registration_number': student.registration_number or '',
                    'enrollment_date': student.enrollment_date.isoformat() if student.enrollment_date else '',
                    'graduation_year': str(graduation_year) if graduation_year else '',
                    'status': student.status or 'active',
                    'is_active': bool(student.user.is_active),
                    'created_at': student.user.created_at.isoformat() if student.user.created_at else ''
                })
            
            return JsonResponse({
                'success': True,
                'university_students': students_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch university students: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_universities(request):
    """Get all universities"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            universities = Universities.objects.all()
            
            # Apply filters
            if search:
                universities = universities.filter(
                    Q(name__icontains=search) | 
                    Q(location__icontains=search) |
                    Q(district__icontains=search)
                )
            
            # Order by creation date
            universities = universities.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(universities, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            universities_data = []
            for university in page_obj:
                # Count students
                student_count = UniversityStudents.objects.filter(university=university).count()
                
                # Count faculties
                faculty_count = 0
                try:
                    from apps.universities.models import Faculties
                    faculty_count = Faculties.objects.filter(university=university).count()
                except:
                    faculty_count = 0
                
                universities_data.append({
                    'university_id': university.university_id,
                    'name': university.name,
                    'location': university.location or '',
                    'district': university.district or '',
                    'address': university.address or '',
                    'description': university.description or '',
                    'contact_email': university.contact_email or '',
                    'phone_number': university.phone_number or '',
                    'website': university.website or '',
                    'ugc_ranking': university.ugc_ranking or '',
                    'student_count': student_count,
                    'faculty_count': faculty_count,
                    'established': university.created_at.year if university.created_at else '',
                    'is_active': bool(university.is_active),
                    'created_at': university.created_at.isoformat() if university.created_at else ''
                })
            
            return JsonResponse({
                'success': True,
                'universities': universities_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch universities: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)