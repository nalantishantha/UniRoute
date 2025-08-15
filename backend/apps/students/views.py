from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from apps.accounts.models import Users, UserDetails
from apps.students.models import Students
import json


# def students_list(request):
#     with connection.cursor() as cursor:
#         cursor.execute("SELECT student_id, user_id, current_stage, district, school FROM students LIMIT 10")
#         students = cursor.fetchall()
    
#     data = []
#     for student in students:
#         data.append({
#             'id': student[0],           # student_id
#             'user_id': student[1],      # user_id  
#             'stage': student[2],        # current_stage
#             'district': student[3],     # district
#             'school': student[4]        # school
#         })
    
#     return JsonResponse({'students': data, 'count': len(data)})


@csrf_exempt
def get_student_profile(request):
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            # Use raw SQL to avoid model relationship issues
            with connection.cursor() as cursor:
                query = """
                    SELECT 
                        u.user_id,
                        u.username,
                        u.email,
                        u.is_active,
                        u.created_at,
                        u.user_type_id,
                        ud.full_name,
                        ud.profile_picture,
                        ud.bio,
                        ud.contact_number,
                        ud.location,
                        ud.gender,
                        ud.is_verified,
                        ud.updated_at,
                        s.student_id,
                        s.current_stage,
                        s.district,
                        s.school
                    FROM users u
                    LEFT JOIN user_details ud ON u.user_id = ud.user_id
                    LEFT JOIN students s ON u.user_id = s.user_id
                    WHERE u.user_id = %s AND u.user_type_id = 1
                """
                cursor.execute(query, [user_id])
                result = cursor.fetchone()
                
                if result:
                    # Prepare response data
                    profile_data = {
                        'user_id': result[0],
                        'username': result[1],
                        'email': result[2],
                        'is_active': result[3],
                        'created_at': result[4].isoformat() if result[4] else None,
                        'user_type_id': result[5],
                        
                        # User details
                        'full_name': result[6] or '',
                        'profile_picture': result[7] or '',
                        'bio': result[8] or '',
                        'contact_number': result[9] or '',
                        'location': result[10] or '',
                        'gender': result[11] or '',
                        'is_verified': result[12] or 0,
                        'updated_at': result[13].isoformat() if result[13] else None,
                        
                        # Student specific data
                        'student_id': result[14],
                        'current_stage': result[15] or '',
                        'district': result[16] or '',
                        'school': result[17] or '',
                    }
                    
                    return JsonResponse({
                        'success': True,
                        'student_data': profile_data
                    })
                else:
                    return JsonResponse({
                        'success': False,
                        'message': 'Student profile not found'
                    }, status=404)
                    
        except Exception as e:
            print(f"Error in get_student_profile: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({
                'success': False,
                'message': f'Error retrieving profile: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


# Note: update_student_profile function is defined below to handle both PUT and POST requests


@csrf_exempt
def update_student_profile(request):
    if request.method in ['PUT', 'POST']:
        try:
            # Handle both JSON data (PUT) and form data with files (POST)
            if request.method == 'PUT':
                data = json.loads(request.body)
                user_id = data.get('user_id')
            else:  # POST
                data = request.POST.dict()
                user_id = data.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            # Get user data
            try:
                user = Users.objects.get(user_id=user_id)
            except Users.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'User not found'
                }, status=404)
            
            # Verify user is a student
            if user.user_type.type_name != 'student':
                return JsonResponse({
                    'success': False,
                    'message': 'User is not a student'
                }, status=403)
            
            # Update user table fields
            if 'username' in data:
                user.username = data['username']
            if 'email' in data:
                user.email = data['email']
            user.save()
            
            # Get or create user details
            user_details, created = UserDetails.objects.get_or_create(user=user)
            
            # Update user_details table fields
            if 'full_name' in data:
                user_details.full_name = data['full_name']
            if 'bio' in data:
                user_details.bio = data['bio']
            if 'contact_number' in data:
                user_details.contact_number = data['contact_number']
            if 'location' in data:
                user_details.location = data['location']
            if 'gender' in data:
                user_details.gender = data['gender']
            
            # Handle profile picture upload (only for POST requests with files)
            if request.method == 'POST' and 'profile_picture' in request.FILES:
                profile_picture = request.FILES['profile_picture']
                
                # Validate file type
                allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
                if profile_picture.content_type not in allowed_types:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'
                    }, status=400)
                
                # Validate file size (5MB limit)
                if profile_picture.size > 5 * 1024 * 1024:
                    return JsonResponse({
                        'success': False,
                        'message': 'File size too large. Maximum size is 5MB.'
                    }, status=400)
                
                # Django will handle the file saving automatically
                user_details.profile_picture = profile_picture
            elif 'profile_picture' in data and request.method == 'PUT':
                # Handle profile picture URL for PUT requests
                user_details.profile_picture = data['profile_picture']
            
            user_details.save()
            
            # Update student specific data if provided
            try:
                student = Students.objects.get(user=user)
                if 'current_stage' in data:
                    student.current_stage = data['current_stage']
                if 'district' in data:
                    student.district = data['district']
                if 'school' in data:
                    student.school = data['school']
                student.save()
            except Students.DoesNotExist:
                # Create student record if it doesn't exist
                if any(key in data for key in ['current_stage', 'district', 'school']):
                    Students.objects.create(
                        user=user,
                        current_stage=data.get('current_stage', ''),
                        district=data.get('district', ''),
                        school=data.get('school', '')
                    )
            
            # Prepare profile picture URL for response
            profile_picture_url = None
            if user_details.profile_picture:
                try:
                    # After saving, the file should have a proper URL
                    profile_picture_url = user_details.profile_picture.url
                except (ValueError, AttributeError):
                    # If URL access fails, construct it manually
                    from django.conf import settings
                    if hasattr(user_details.profile_picture, 'name'):
                        profile_picture_url = f"{settings.MEDIA_URL}{user_details.profile_picture.name}"
                    else:
                        profile_picture_url = f"{settings.MEDIA_URL}{str(user_details.profile_picture)}"
            
            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully',
                'profile_picture_url': profile_picture_url
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error updating profile: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT and POST methods allowed'
    }, status=405)

