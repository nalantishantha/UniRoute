from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
import json
from apps.mentoring.models import Mentors, MentoringSessions, MentoringSessionEnrollments, MentoringRequests
from apps.accounts.models import UserDetails
from .models import Students

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

