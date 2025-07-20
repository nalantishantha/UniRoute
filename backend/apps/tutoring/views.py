from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import Tutors, TutoringSessions, TutorSubjects, TutorRatings, TutorFeedback
from apps.accounts.models import Users
from apps.students.models import Students


@csrf_exempt
def create_tutoring_session(request):
    """Create a new tutoring session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get required fields
            tutor_id = data.get('tutor_id')
            subject_id = data.get('subject_id')
            scheduled_at = data.get('scheduled_at')
            duration_minutes = data.get('duration_minutes', 60)
            status = data.get('status', 'scheduled')
            description = data.get('description', '')
            
            # Validation
            if not all([tutor_id, subject_id, scheduled_at]):
                return JsonResponse({
                    'success': False,
                    'message': 'Tutor ID, subject ID, and scheduled time are required'
                }, status=400)
            
            # Check if tutor exists
            try:
                tutor = Tutors.objects.get(tutor_id=tutor_id)
            except Tutors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Tutor not found'
                }, status=404)
            
            # Check if tutor teaches this subject
            from apps.student_results.models import AlSubjects
            try:
                subject = AlSubjects.objects.get(subject_id=subject_id)
                if not TutorSubjects.objects.filter(tutor=tutor, subject=subject).exists():
                    return JsonResponse({
                        'success': False,
                        'message': 'Tutor does not teach this subject'
                    }, status=400)
            except AlSubjects.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Subject not found'
                }, status=404)
            
            # Create the session
            with transaction.atomic():
                session = TutoringSessions.objects.create(
                    tutor=tutor,
                    subject=subject,
                    scheduled_at=scheduled_at,
                    duration_minutes=duration_minutes,
                    status=status,
                    description=description,
                    created_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Tutoring session created successfully',
                    'session': {
                        'session_id': session.session_id,
                        'tutor_id': tutor.tutor_id,
                        'subject_name': subject.subject_name,
                        'scheduled_at': session.scheduled_at,
                        'status': session.status,
                        'description': session.description
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
def get_tutoring_sessions(request):
    """Get all tutoring sessions or sessions by tutor/subject"""
    if request.method == 'GET':
        try:
            tutor_id = request.GET.get('tutor_id')
            subject_id = request.GET.get('subject_id')
            status = request.GET.get('status')
            
            filters = {}
            if tutor_id:
                filters['tutor_id'] = tutor_id
            if subject_id:
                filters['subject_id'] = subject_id
            if status:
                filters['status'] = status
            
            sessions = TutoringSessions.objects.filter(**filters)
            
            sessions_data = []
            for session in sessions:
                # Get tutor user details
                tutor_user = session.tutor.user
                try:
                    from apps.accounts.models import UserDetails
                    user_details = UserDetails.objects.get(user=tutor_user)
                    tutor_name = f"{user_details.first_name} {user_details.last_name}"
                except:
                    tutor_name = tutor_user.username
                
                sessions_data.append({
                    'session_id': session.session_id,
                    'tutor_id': session.tutor.tutor_id,
                    'tutor_name': tutor_name,
                    'tutor_bio': session.tutor.bio,
                    'tutor_rating': float(session.tutor.rating) if session.tutor.rating else None,
                    'subject_id': session.subject.subject_id,
                    'subject_name': session.subject.subject_name,
                    'scheduled_at': session.scheduled_at,
                    'duration_minutes': session.duration_minutes,
                    'status': session.status,
                    'description': session.description,
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
def update_tutoring_session(request, session_id):
    """Update a tutoring session"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            try:
                session = TutoringSessions.objects.get(session_id=session_id)
            except TutoringSessions.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Session not found'
                }, status=404)
            
            # Update fields if provided
            if 'scheduled_at' in data:
                session.scheduled_at = data['scheduled_at']
            if 'duration_minutes' in data:
                session.duration_minutes = data['duration_minutes']
            if 'status' in data:
                session.status = data['status']
            if 'description' in data:
                session.description = data['description']
            
            session.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Session updated successfully',
                'session': {
                    'session_id': session.session_id,
                    'scheduled_at': session.scheduled_at,
                    'status': session.status,
                    'description': session.description
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
def delete_tutoring_session(request, session_id):
    """Delete a tutoring session"""
    if request.method == 'DELETE':
        try:
            try:
                session = TutoringSessions.objects.get(session_id=session_id)
            except TutoringSessions.DoesNotExist:
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
            
            # Delete the session
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
def get_tutors(request):
    """Get all tutors with their subjects"""
    if request.method == 'GET':
        try:
            subject_id = request.GET.get('subject_id')
            
            if subject_id:
                # Get tutors who teach a specific subject
                tutor_subjects = TutorSubjects.objects.filter(subject_id=subject_id)
                tutors = [ts.tutor for ts in tutor_subjects]
            else:
                tutors = Tutors.objects.all()
            
            tutors_data = []
            for tutor in tutors:
                # Get tutor user details
                try:
                    from apps.accounts.models import UserDetails
                    user_details = UserDetails.objects.get(user=tutor.user)
                    tutor_name = f"{user_details.first_name} {user_details.last_name}"
                except:
                    tutor_name = tutor.user.username
                
                # Get subjects taught by this tutor
                tutor_subjects = TutorSubjects.objects.filter(tutor=tutor)
                subjects = []
                for ts in tutor_subjects:
                    subjects.append({
                        'subject_id': ts.subject.subject_id,
                        'subject_name': ts.subject.subject_name,
                        'level': ts.level
                    })
                
                # Get university info if available
                university_info = None
                if tutor.university_student:
                    university_info = {
                        'university_name': getattr(tutor.university_student, 'university_name', 'N/A'),
                        'program': getattr(tutor.university_student, 'program', 'N/A')
                    }
                
                tutors_data.append({
                    'tutor_id': tutor.tutor_id,
                    'tutor_name': tutor_name,
                    'bio': tutor.bio,
                    'expertise': tutor.expertise,
                    'rating': float(tutor.rating) if tutor.rating else None,
                    'subjects': subjects,
                    'university_info': university_info,
                    'created_at': tutor.created_at
                })
            
            return JsonResponse({
                'success': True,
                'tutors': tutors_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching tutors: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def get_subjects(request):
    """Get all subjects for tutoring"""
    if request.method == 'GET':
        try:
            from apps.student_results.models import AlSubjects
            subjects = AlSubjects.objects.all()
            
            subjects_data = []
            for subject in subjects:
                subjects_data.append({
                    'subject_id': subject.subject_id,
                    'subject_name': subject.subject_name,
                    'subject_code': getattr(subject, 'subject_code', ''),
                })
            
            return JsonResponse({
                'success': True,
                'subjects': subjects_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching subjects: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)
