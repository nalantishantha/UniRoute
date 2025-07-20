from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import Mentors, MentoringSessions, MentoringSessionEnrollments, MentoringFeedback
from apps.accounts.models import Users
from apps.students.models import Students


@csrf_exempt
def create_mentoring_session(request):
    """Create a new mentoring session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get required fields
            mentor_id = data.get('mentor_id')
            topic = data.get('topic')
            scheduled_at = data.get('scheduled_at')
            duration_minutes = data.get('duration_minutes', 60)
            status = data.get('status', 'scheduled')
            
            # Validation
            if not all([mentor_id, topic, scheduled_at]):
                return JsonResponse({
                    'success': False,
                    'message': 'Mentor ID, topic, and scheduled time are required'
                }, status=400)
            
            # Check if mentor exists and is approved
            try:
                mentor = Mentors.objects.get(mentor_id=mentor_id, approved=1)
            except Mentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Mentor not found or not approved'
                }, status=404)
            
            # Create the session
            with transaction.atomic():
                session = MentoringSessions.objects.create(
                    mentor=mentor,
                    topic=topic,
                    scheduled_at=scheduled_at,
                    duration_minutes=duration_minutes,
                    status=status,
                    created_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Mentoring session created successfully',
                    'session': {
                        'session_id': session.session_id,
                        'topic': session.topic,
                        'scheduled_at': session.scheduled_at,
                        'mentor_id': mentor.mentor_id,
                        'status': session.status
                    }
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error creating session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def get_mentoring_sessions(request):
    """Get all mentoring sessions or sessions by mentor"""
    if request.method == 'GET':
        try:
            mentor_id = request.GET.get('mentor_id')
            status = request.GET.get('status')
            
            filters = {}
            if mentor_id:
                filters['mentor_id'] = mentor_id
            if status:
                filters['status'] = status
            
            sessions = MentoringSessions.objects.filter(**filters)
            
            sessions_data = []
            for session in sessions:
                # Get mentor user details
                mentor_user = session.mentor.user
                try:
                    from apps.accounts.models import UserDetails
                    user_details = UserDetails.objects.get(user=mentor_user)
                    mentor_name = f"{user_details.first_name} {user_details.last_name}"
                except:
                    mentor_name = mentor_user.username
                
                # Count enrollments
                enrollment_count = MentoringSessionEnrollments.objects.filter(session=session).count()
                
                sessions_data.append({
                    'session_id': session.session_id,
                    'mentor_id': session.mentor.mentor_id,
                    'mentor_name': mentor_name,
                    'mentor_expertise': session.mentor.expertise,
                    'topic': session.topic,
                    'scheduled_at': session.scheduled_at,
                    'duration_minutes': session.duration_minutes,
                    'status': session.status,
                    'enrollment_count': enrollment_count,
                    'created_at': session.created_at
                })
            
            return JsonResponse({
                'success': True,
                'sessions': sessions_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching sessions: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def enroll_in_mentoring_session(request):
    """Enroll a student in a mentoring session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            session_id = data.get('session_id')
            user_id = data.get('user_id')
            
            if not all([session_id, user_id]):
                return JsonResponse({
                    'success': False,
                    'message': 'Session ID and User ID are required'
                }, status=400)
            
            # Check if session exists and is scheduled
            try:
                session = MentoringSessions.objects.get(session_id=session_id, status='scheduled')
            except MentoringSessions.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Session not found or not available for enrollment'
                }, status=404)
            
            # Check if user exists and is a student
            try:
                user = Users.objects.get(user_id=user_id)
                student = Students.objects.get(user=user)
            except (Users.DoesNotExist, Students.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            # Check if student is already enrolled
            if MentoringSessionEnrollments.objects.filter(session=session, student=student).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Student is already enrolled in this session'
                }, status=400)
            
            # Create enrollment
            with transaction.atomic():
                enrollment = MentoringSessionEnrollments.objects.create(
                    session=session,
                    student=student,
                    enrolled_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Successfully enrolled in the mentoring session',
                    'enrollment': {
                        'session_enrollment_id': enrollment.session_enrollment_id,
                        'session_topic': session.topic,
                        'scheduled_at': session.scheduled_at,
                        'enrolled_at': enrollment.enrolled_at
                    }
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error enrolling in session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def update_mentoring_session(request, session_id):
    """Update a mentoring session"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            try:
                session = MentoringSessions.objects.get(session_id=session_id)
            except MentoringSessions.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Session not found'
                }, status=404)
            
            # Update fields if provided
            if 'topic' in data:
                session.topic = data['topic']
            if 'scheduled_at' in data:
                session.scheduled_at = data['scheduled_at']
            if 'duration_minutes' in data:
                session.duration_minutes = data['duration_minutes']
            if 'status' in data:
                session.status = data['status']
            
            session.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Session updated successfully',
                'session': {
                    'session_id': session.session_id,
                    'topic': session.topic,
                    'scheduled_at': session.scheduled_at,
                    'status': session.status
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error updating session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)


@csrf_exempt
def delete_mentoring_session(request, session_id):
    """Delete a mentoring session"""
    if request.method == 'DELETE':
        try:
            try:
                session = MentoringSessions.objects.get(session_id=session_id)
            except MentoringSessions.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Session not found'
                }, status=404)
            
            # Check if session can be deleted (only if not completed)
            if session.status == 'completed':
                return JsonResponse({
                    'success': False,
                    'message': 'Cannot delete a completed session'
                }, status=400)
            
            # Delete the session (this will also delete related enrollments due to CASCADE)
            session.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Session deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error deleting session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only DELETE method allowed'
    }, status=405)


@csrf_exempt
def get_mentors(request):
    """Get all approved mentors"""
    if request.method == 'GET':
        try:
            mentors = Mentors.objects.filter(approved=1)
            
            mentors_data = []
            for mentor in mentors:
                # Get mentor user details
                try:
                    from apps.accounts.models import UserDetails
                    user_details = UserDetails.objects.get(user=mentor.user)
                    mentor_name = f"{user_details.first_name} {user_details.last_name}"
                except:
                    mentor_name = mentor.user.username
                
                # Get university info if available
                university_info = None
                if mentor.university_student:
                    university_info = {
                        'university_name': getattr(mentor.university_student, 'university_name', 'N/A'),
                        'program': getattr(mentor.university_student, 'program', 'N/A')
                    }
                
                mentors_data.append({
                    'mentor_id': mentor.mentor_id,
                    'mentor_name': mentor_name,
                    'expertise': mentor.expertise,
                    'bio': mentor.bio,
                    'university_info': university_info,
                    'created_at': mentor.created_at
                })
            
            return JsonResponse({
                'success': True,
                'mentors': mentors_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching mentors: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)
