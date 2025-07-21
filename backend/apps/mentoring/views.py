from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import Mentors, MentoringSessions, MentoringSessionEnrollments
from apps.accounts.models import UserDetails
from apps.universities.models import Universities
from apps.university_programs.models import DegreePrograms, DegreeProgramDurations
from apps.university_students.models import UniversityStudents

def mentors_list(request):
    """
    Get all approved mentors with their details
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
                print(f"UserDetails found for mentor {mentor.mentor_id}")  # Add this
                
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
                print(f"UserDetails missing for mentor {mentor.mentor_id}")  # Add this
                continue
            except Exception as e:
                print(f"Error for mentor {mentor.mentor_id}: {e}")  # Add this
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
    Create a new mentoring session
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
            
            # For now, we'll create a session enrollment with a default student_id
            # In a real application, you would get the student_id from the authenticated user
            try:
                # Create session enrollment (using a placeholder student_id for now)
                # You should replace this with the actual logged-in student's ID
                from apps.students.models import Students
                
                # For demo purposes, we'll try to get the first student or create a placeholder
                try:
                    # This is just for testing - you should get the actual logged-in student
                    student = Students.objects.first()
                    if student:
                        MentoringSessionEnrollments.objects.create(
                            session=session,
                            student=student,
                            enrolled_at=timezone.now()
                        )
                except Exception as e:
                    # If no students exist, just create the session without enrollment for now
                    pass
            except Exception as e:
                # Continue even if enrollment creation fails
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
