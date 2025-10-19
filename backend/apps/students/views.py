from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from apps.accounts.models import Users, UserDetails
from apps.accounts.models import UserDetails
from apps.students.models import Students
from django.utils import timezone
from datetime import timedelta
from apps.mentoring.models import Mentors, MentoringSessions, MentoringSessionEnrollments, MentoringRequests
from apps.universities.models import UniversityAnnouncements
from .models import Students
import json


def get_student_mentoring_requests_grouped(request):
    """
    Returns mentoring requests for a student grouped into three lists:
    - pending: status == 'pending'
    - accepted: status == 'scheduled'
    - completed: status in ['completed', 'declined']

    Expects query param `user_id` (Users.user_id). This is intentionally
    separate from session enrollments and focuses on MentoringRequests table.
    """
    if request.method != 'GET':
        return JsonResponse({'success': False, 'message': 'Only GET allowed'}, status=405)

    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'message': 'user_id query parameter is required'}, status=400)

    try:
        try:
            student = Students.objects.get(user__user_id=user_id)
        except Students.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Student not found for given user_id'}, status=404)

        pending = []
        accepted = []
        completed = []

        qs = MentoringRequests.objects.select_related('mentor', 'mentor__user').filter(student=student)
        for r in qs:
            status = (getattr(r, 'status', '') or '').lower()
            entry = {
                'id': getattr(r, 'request_id', r.id if hasattr(r, 'id') else None),
                'mentor': None,
                'subject': getattr(r, 'topic', None) or getattr(r, 'description', None) or '',
                'preferred_time': getattr(r, 'preferred_time', None) or getattr(r, 'requested_date', None) or None,
                'status': getattr(r, 'status', '') or '',
                'created_at': getattr(r, 'created_at', None),
            }
            try:
                mentor_obj = getattr(r, 'mentor', None)
                if mentor_obj:
                    # Try to get a friendly name
                    ud = None
                    try:
                        ud = UserDetails.objects.get(user=mentor_obj.user)
                    except Exception:
                        ud = None
                    if ud and getattr(ud, 'full_name', None):
                        entry['mentor'] = ud.full_name
                    elif hasattr(mentor_obj, 'full_name'):
                        entry['mentor'] = mentor_obj.full_name
                    elif hasattr(mentor_obj, 'name'):
                        entry['mentor'] = mentor_obj.name
                    elif hasattr(mentor_obj, 'user') and hasattr(mentor_obj.user, 'username'):
                        entry['mentor'] = mentor_obj.user.username
            except Exception:
                entry['mentor'] = None

            if status == 'pending':
                pending.append(entry)
            elif status == 'scheduled':
                accepted.append(entry)
            elif status in ['completed', 'declined']:
                completed.append(entry)
            else:
                # Treat unknown statuses conservatively as pending
                pending.append(entry)

        return JsonResponse({'success': True, 'pending': pending, 'accepted': accepted, 'completed': completed})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Error retrieving mentoring requests: {str(e)}'}, status=500)


def get_student_upcoming_sessions(request):
    """
    Return upcoming scheduled mentoring sessions for a student.
    Filters MentoringSessionEnrollments where session.status == 'scheduled'
    and session.scheduled_at >= now().
    Expects query param `user_id` (Users.user_id).
    """
    if request.method != 'GET':
        return JsonResponse({'success': False, 'message': 'Only GET allowed'}, status=405)

    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'message': 'user_id query parameter is required'}, status=400)

    try:
        try:
            student = Students.objects.get(user__user_id=user_id)
        except Students.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Student not found for given user_id'}, status=404)

        now_dt = timezone.now()
        upcoming = []

        enrollments = MentoringSessionEnrollments.objects.select_related('session', 'session__mentor', 'session__mentor__user').filter(
            student=student,
            session__status='scheduled',
            session__scheduled_at__gte=now_dt
        ).order_by('session__scheduled_at')

        for enroll in enrollments:
            session = enroll.session
            if not session:
                continue
            mentor_name = 'Mentor'
            try:
                mentor_obj = getattr(session, 'mentor', None)
                if mentor_obj:
                    try:
                        ud = UserDetails.objects.get(user=mentor_obj.user)
                    except Exception:
                        ud = None
                    if ud and getattr(ud, 'full_name', None):
                        mentor_name = ud.full_name
                    elif hasattr(mentor_obj, 'full_name'):
                        mentor_name = mentor_obj.full_name
                    elif hasattr(mentor_obj, 'name'):
                        mentor_name = mentor_obj.name
                    elif hasattr(mentor_obj, 'user') and hasattr(mentor_obj.user, 'username'):
                        mentor_name = mentor_obj.user.username
            except Exception:
                pass

            upcoming.append({
                'id': getattr(session, 'session_id', session.id if hasattr(session, 'id') else None),
                'topic': getattr(session, 'topic', ''),
                'mentor': mentor_name,
                'scheduled_at': session.scheduled_at.isoformat() if getattr(session, 'scheduled_at', None) else None,
                'duration_minutes': getattr(session, 'duration_minutes', None),
                'status': getattr(session, 'status', '') or '',
            })

        return JsonResponse({'success': True, 'upcoming': upcoming})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Error retrieving upcoming sessions: {str(e)}'}, status=500)


def get_student_upcoming_requests(request):
    """
    Return upcoming mentoring requests for a student where status == 'scheduled'
    and requested_date >= today. Uses MentoringRequests table.
    Expects query param `user_id` (Users.user_id).
    NOTE: There is no explicit `session_date` field on MentoringRequests in this schema;
    we use `requested_date` as the scheduled date for requests marked scheduled.
    """
    if request.method != 'GET':
        return JsonResponse({'success': False, 'message': 'Only GET allowed'}, status=405)

    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'message': 'user_id query parameter is required'}, status=400)

    try:
        try:
            student = Students.objects.get(user__user_id=user_id)
        except Students.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Student not found for given user_id'}, status=404)

        today = timezone.now().date()
        upcoming = []

        qs = MentoringRequests.objects.select_related('mentor', 'mentor__user').filter(
            student=student,
            status='scheduled',
            requested_date__date__gte=today
        ).order_by('requested_date')

        for r in qs:
            mentor_name = 'Mentor'
            try:
                mentor_obj = getattr(r, 'mentor', None)
                if mentor_obj:
                    try:
                        ud = UserDetails.objects.get(user=mentor_obj.user)
                    except Exception:
                        ud = None
                    if ud and getattr(ud, 'full_name', None):
                        mentor_name = ud.full_name
                    elif hasattr(mentor_obj, 'full_name'):
                        mentor_name = mentor_obj.full_name
                    elif hasattr(mentor_obj, 'name'):
                        mentor_name = mentor_obj.name
                    elif hasattr(mentor_obj, 'user') and hasattr(mentor_obj.user, 'username'):
                        mentor_name = mentor_obj.user.username
            except Exception:
                pass

            upcoming.append({
                'id': getattr(r, 'request_id', r.id if hasattr(r, 'id') else None),
                'mentor': mentor_name,
                'subject': getattr(r, 'topic', None) or getattr(r, 'description', None) or '',
                'session_date': getattr(r, 'requested_date', None).isoformat() if getattr(r, 'requested_date', None) else None,
                'status': getattr(r, 'status', '') or '',
            })

        return JsonResponse({'success': True, 'upcoming': upcoming})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Error retrieving upcoming requests: {str(e)}'}, status=500)


def students_list(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT student_id, user_id, current_stage, district, school FROM students LIMIT 10")
        students = cursor.fetchall()
    
    data = []
    for student in students:
        data.append({
            'id': student[0],           # student_id
            'user_id': student[1],      # user_id  
            'stage': student[2],        # current_stage
            'district': student[3],     # district
            'school': student[4]        # school
        })
    
    return JsonResponse({'students': data, 'count': len(data)})


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


def mentors_list(request):
    """
    Get all approved mentors with their details (Student perspective)
    """
    print("Mentors API called")
    try:
        # Get all approved mentors with related data
        mentors = Mentors.objects.select_related(
            'user',
            'university_student__user',
            'university_student__university', 
            'university_student__degree_program',
            'university_student__duration'
        ).filter(approved=1)
        print(f"Mentors found: {mentors.count()}")
        
        data = []
        for mentor in mentors:
            try:
                # Get user details
                user_details = UserDetails.objects.get(user=mentor.user)
                print(f"UserDetails found for mentor {mentor.mentor_id}")
                
                # Get university student details
                university_student = mentor.university_student
                if university_student:
                    university_name = university_student.university.name if university_student.university else "Not specified"
                    degree_title = university_student.degree_program.title if university_student.degree_program else "Not specified"
                    duration_years = university_student.duration.duration_years if university_student.duration else 0
                else:
                    university_name = "Not specified"
                    degree_title = "Not specified"
                    duration_years = 0
                
                mentor_data = {
                    'id': mentor.mentor_id,
                    'name': user_details.full_name or mentor.user.username,
                    'title': f"{degree_title} Student",
                    'university': university_name,
                    'degree': degree_title,
                    'location': user_details.location or "Not specified",
                    'duration': f"{duration_years} years",
                    'rating': 4.8,  # Default rating for now
                    'reviews': 25,  # Default review count for now
                    'students': 5,  # Default student count for now
                    'image': user_details.profile_picture or "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
                    'description': mentor.bio or user_details.bio or "Passionate about helping students with their university journey.",
                    'expertise': mentor.expertise or "General mentoring"
                }
                
                data.append(mentor_data)
                
            except UserDetails.DoesNotExist:
                print(f"UserDetails missing for mentor {mentor.mentor_id}")
                continue
            except Exception as e:
                print(f"Error for mentor {mentor.mentor_id}: {e}")
                continue
        
        return JsonResponse({
            'success': True,
            'mentors': data,
            'count': len(data)
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Error fetching mentors',
            'error': str(e)
        }, status=500)


@csrf_exempt
def create_mentoring_session(request):
    """
    Create a new mentoring session (Student perspective)
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract data from request
            mentor_id = data.get('mentor_id')
            topic = data.get('topic')
            scheduled_at = data.get('scheduled_at')
            duration_minutes = data.get('duration_minutes')
            status = data.get('status', 'scheduled')
            
            # Validate required fields
            if not all([mentor_id, topic, scheduled_at, duration_minutes]):
                return JsonResponse({
                    'success': False,
                    'message': 'Missing required fields'
                }, status=400)
            
            # Check if mentor exists
            try:
                mentor = Mentors.objects.get(mentor_id=mentor_id)
            except Mentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Mentor not found'
                }, status=404)
            
            # Create the mentoring session
            session = MentoringSessions.objects.create(
                mentor=mentor,
                topic=topic,
                scheduled_at=scheduled_at,
                duration_minutes=duration_minutes,
                status=status,
                created_at=timezone.now()
            )
            
            # Create session enrollment and request
            try:
                # For demo purposes, we'll try to get the first student or create a placeholder
                # In a real application, you would get the student_id from the authenticated user
                student = Students.objects.first()
                if student:
                    MentoringSessionEnrollments.objects.create(
                        session=session,
                        student=student,
                        enrolled_at=timezone.now()
                    )
                    
                    # Also create a mentoring request entry
                    MentoringRequests.objects.create(
                        student=student,
                        mentor=mentor,
                        topic=topic,
                        description=f"Mentoring session request for: {topic}",
                        preferred_time="Flexible",  # We don't have this from the form
                        session_type="online",  # Default value since not in form
                        urgency="medium",  # Default value since not in form
                        status="pending",
                        requested_date=scheduled_at,
                        decline_reason=None,
                        created_at=timezone.now(),
                        updated_at=timezone.now(),
                        expiry_date=timezone.now() + timedelta(days=7)  # Expire in 7 days
                    )
                    
            except Exception as e:
                # Continue even if enrollment creation fails
                print(f"Warning: Could not create session enrollment: {e}")
                pass
            
            return JsonResponse({
                'success': True,
                'message': 'Mentoring session created successfully',
                'session': {
                    'session_id': session.session_id,
                    'mentor_id': mentor_id,
                    'topic': topic,
                    'scheduled_at': scheduled_at,
                    'duration_minutes': duration_minutes,
                    'status': status
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Error creating session',
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


def get_published_announcements(request):
    """
    Get all published university announcements for news feed (Student perspective)
    """
    if request.method == 'GET':
        try:
            # Get only published announcements, ordered by newest first
            announcements = UniversityAnnouncements.objects.filter(
                announcement_type='published'
            ).select_related('university').order_by('-created_at')
            
            data = []
            for announcement in announcements:
                data.append({
                    'announcement_id': announcement.announcement_id,
                    'title': announcement.title,
                    'message': announcement.message,
                    'university_name': announcement.university.name if announcement.university else 'Unknown University',
                    'university_id': announcement.university.university_id if announcement.university else None,
                    'created_at': announcement.created_at.isoformat() if announcement.created_at else None,
                    'valid_from': announcement.valid_from.isoformat() if announcement.valid_from else None,
                    'valid_to': announcement.valid_to.isoformat() if announcement.valid_to else None,
                })
            
            return JsonResponse({
                'success': True,
                'announcements': data,
                'count': len(data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching announcements: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)

