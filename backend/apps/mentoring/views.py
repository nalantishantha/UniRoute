from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.db import transaction
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import MentoringSessions, MentoringRequests, SessionDetails, Mentors
from apps.students.models import Students
from apps.accounts.models import Users, UserDetails


class MentoringRequestsView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, mentor_id):
        """Get all mentoring requests for a specific mentor"""
        try:
            # Update expired requests
            self.update_expired_requests()
            
            requests = MentoringRequests.objects.filter(
                mentor_id=mentor_id
            ).select_related(
                'student__user',
                'student__user__userdetails'
            ).order_by('-created_at')
            
            requests_data = []
            for req in requests:
                student_user = req.student.user
                user_details = getattr(student_user, 'userdetails', None)
                
                request_data = {
                    'id': req.request_id,
                    'student_id': req.student.student_id,
                    'student': user_details.full_name if user_details else student_user.username,
                    'topic': req.topic,
                    'description': req.description,
                    'preferred_time': req.preferred_time,
                    'session_type': req.session_type,
                    'urgency': req.urgency,
                    'status': req.status,
                    'requested_date': req.requested_date.isoformat(),
                    'expiry_date': req.expiry_date.isoformat(),
                    'decline_reason': req.decline_reason,
                    'avatar': user_details.profile_picture if user_details else None,
                    'contact': student_user.email,
                }
                
                # For scheduled requests, include session information
                if req.status == 'scheduled':
                    try:
                        session_detail = req.sessiondetails_set.first()
                        if session_detail and session_detail.session:
                            session = session_detail.session
                            request_data.update({
                                'session_id': session.session_id,
                                'scheduled_date': session.scheduled_at.isoformat(),
                                'duration_minutes': session.duration_minutes,
                                'location': session_detail.location,
                                'meeting_link': session_detail.meeting_link,
                            })
                    except:
                        pass
                
                requests_data.append(request_data)
            
            return JsonResponse({
                'status': 'success',
                'requests': requests_data
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    def update_expired_requests(self):
        """Update expired requests"""
        expired_requests = MentoringRequests.objects.filter(
            status='pending',
            expiry_date__lt=timezone.now()
        )
        expired_requests.update(status='expired')


class MentoringSessionsView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, mentor_id):
        """Get all scheduled and completed sessions for a specific mentor"""
        try:
            sessions = MentoringSessions.objects.filter(
                mentor_id=mentor_id,
                status__iregex=r'^(scheduled|completed)$'
            ).prefetch_related(
                'details', 
                'mentoringsessionenrollments_set__student__user__userdetails'
            ).order_by('scheduled_at')
            
            sessions_data = []
            for session in sessions:
                # Try to get student info from multiple sources
                student_info = None
                session_details = getattr(session, 'details', None)
                
                # First try to get from session details and request
                if session_details and hasattr(session_details, 'request') and session_details.request:
                    student = session_details.request.student
                    student_user = student.user
                    user_details = getattr(student_user, 'userdetails', None)
                    student_info = {
                        'student_id': student.student_id,
                        'student': user_details.full_name if user_details else student_user.username,
                        'avatar': user_details.profile_picture if user_details else None,
                        'session_type': session_details.request.session_type,
                    }
                
                # Fallback to enrollment data if available
                if not student_info:
                    enrollment = session.mentoringsessionenrollments_set.first()
                    if enrollment:
                        student = enrollment.student
                        student_user = student.user
                        user_details = getattr(student_user, 'userdetails', None)
                        student_info = {
                            'student_id': student.student_id,
                            'student': user_details.full_name if user_details else student_user.username,
                            'avatar': user_details.profile_picture if user_details else None,
                            'session_type': 'online',  # Default
                        }
                
                # Create a placeholder if no student info found (for testing)
                if not student_info:
                    student_info = {
                        'student_id': 0,
                        'student': 'Unknown Student',
                        'avatar': None,
                        'session_type': 'online',
                    }
                
                sessions_data.append({
                    'id': session.session_id,
                    'student_id': student_info['student_id'],
                    'student': student_info['student'],
                    'topic': session.topic,
                    'scheduled_at': session.scheduled_at.isoformat(),
                    'duration_minutes': session.duration_minutes,
                    'status': session.status,
                    'location': session_details.location if session_details else None,
                    'meeting_link': session_details.meeting_link if session_details else None,
                    'avatar': student_info['avatar'],
                    'session_type': student_info['session_type'],
                })
            
            return JsonResponse({
                'status': 'success',
                'sessions': sessions_data
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def accept_request(request, request_id):
    """Accept a mentoring request and create a session"""
    try:
        data = json.loads(request.body)
        scheduled_datetime = data.get('scheduled_datetime')
        location = data.get('location', '')
        meeting_link = data.get('meeting_link', '')
        
        if not scheduled_datetime:
            return JsonResponse({
                'status': 'error',
                'message': 'Scheduled datetime is required'
            }, status=400)
        
        with transaction.atomic():
            # Get the mentoring request
            mentoring_request = MentoringRequests.objects.get(request_id=request_id)
            
            if mentoring_request.status != 'pending':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Request is not in pending status'
                }, status=400)
            
            # Parse the scheduled datetime
            scheduled_dt = datetime.fromisoformat(scheduled_datetime.replace('Z', '+00:00'))
            
            # Update the request status
            mentoring_request.status = 'scheduled'
            mentoring_request.save()
            
            # Create a session in the mentoring_sessions table
            session = MentoringSessions.objects.create(
                mentor=mentoring_request.mentor,
                topic=mentoring_request.topic,
                scheduled_at=scheduled_dt,
                duration_minutes=60,  # Default duration
                status='scheduled'
            )
            
            # Create session details
            SessionDetails.objects.create(
                session=session,
                request=mentoring_request,
                location=location,
                meeting_link=meeting_link
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Request accepted successfully',
                'session_id': session.session_id
            })
            
    except MentoringRequests.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Request not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def decline_request(request, request_id):
    """Decline a mentoring request"""
    try:
        data = json.loads(request.body)
        reason = data.get('reason', '')
        
        if not reason:
            return JsonResponse({
                'status': 'error',
                'message': 'Decline reason is required'
            }, status=400)
        
        mentoring_request = MentoringRequests.objects.get(request_id=request_id)
        
        if mentoring_request.status != 'pending':
            return JsonResponse({
                'status': 'error',
                'message': 'Request is not in pending status'
            }, status=400)
        
        mentoring_request.status = 'declined'
        mentoring_request.decline_reason = reason
        mentoring_request.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Request declined successfully'
        })
        
    except MentoringRequests.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Request not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def cancel_session(request, session_id):
    """Cancel a scheduled session"""
    try:
        data = json.loads(request.body)
        reason = data.get('reason', '')
        
        session = MentoringSessions.objects.get(session_id=session_id)
        
        if session.status.lower() != 'scheduled':
            return JsonResponse({
                'status': 'error',
                'message': 'Session is not in scheduled status'
            }, status=400)
        
        with transaction.atomic():
            session.status = 'cancelled'
            session.save()
            
            # Update session details with cancellation reason
            session_details, created = SessionDetails.objects.get_or_create(session=session)
            session_details.cancellation_reason = reason
            session_details.save()
            
            # Update the related request status if it exists
            if session_details.request:
                session_details.request.status = 'declined'
                session_details.request.decline_reason = f"Session cancelled: {reason}"
                session_details.request.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Session cancelled successfully'
        })
        
    except MentoringSessions.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Session not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def reschedule_session(request, session_id):
    """Reschedule a session"""
    try:
        data = json.loads(request.body)
        new_datetime = data.get('new_datetime')
        location = data.get('location', '')
        meeting_link = data.get('meeting_link', '')
        
        if not new_datetime:
            return JsonResponse({
                'status': 'error',
                'message': 'New datetime is required'
            }, status=400)
        
        session = MentoringSessions.objects.get(session_id=session_id)
        
        if session.status != 'scheduled':
            return JsonResponse({
                'status': 'error',
                'message': 'Session is not in scheduled status'
            }, status=400)
        
        # Parse the new datetime
        new_dt = datetime.fromisoformat(new_datetime.replace('Z', '+00:00'))
        
        with transaction.atomic():
            session.scheduled_at = new_dt
            session.save()
            
            # Update session details
            session_details, created = SessionDetails.objects.get_or_create(session=session)
            session_details.location = location
            session_details.meeting_link = meeting_link
            session_details.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Session rescheduled successfully'
        })
        
    except MentoringSessions.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Session not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def complete_session(request, session_id):
    """Mark a session as completed"""
    try:
        data = json.loads(request.body)
        completion_notes = data.get('completion_notes', '')
        
        session = MentoringSessions.objects.get(session_id=session_id)
        
        if session.status.lower() != 'scheduled':
            return JsonResponse({
                'status': 'error',
                'message': 'Session is not in scheduled status'
            }, status=400)
        
        with transaction.atomic():
            session.status = 'completed'
            session.save()
            
            # Update session details with completion notes
            session_details, created = SessionDetails.objects.get_or_create(session=session)
            session_details.completion_notes = completion_notes
            session_details.save()
            
            # Update the related request status if it exists
            if session_details.request:
                session_details.request.status = 'completed'
                session_details.request.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Session marked as completed'
        })
        
    except MentoringSessions.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Session not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_all_sessions(request, mentor_id):
    """Get all sessions for a mentor (including existing data without requests)"""
    try:
        sessions = MentoringSessions.objects.filter(mentor_id=mentor_id).order_by('-created_at')
        
        sessions_data = []
        for session in sessions:
            # Try to get student info from enrollments
            enrollment = session.mentoringsessionenrollments_set.first()
            student_info = {
                'student_id': 0,
                'student': 'Student',
                'avatar': None,
            }
            
            if enrollment:
                student = enrollment.student
                student_user = student.user
                user_details = getattr(student_user, 'userdetails', None)
                student_info = {
                    'student_id': student.student_id,
                    'student': user_details.full_name if user_details else student_user.username,
                    'avatar': user_details.profile_picture if user_details else None,
                }
            
            sessions_data.append({
                'id': session.session_id,
                'student_id': student_info['student_id'],
                'student': student_info['student'],
                'topic': session.topic,
                'scheduled_at': session.scheduled_at.isoformat() if session.scheduled_at else None,
                'duration_minutes': session.duration_minutes,
                'status': session.status or 'pending',
                'avatar': student_info['avatar'],
                'session_type': 'online',
                'created_at': session.created_at.isoformat() if session.created_at else None,
            })
        
        return JsonResponse({
            'status': 'success',
            'sessions': sessions_data,
            'total': len(sessions_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_mentor_stats(request, mentor_id):
    """Get statistics for a mentor"""
    try:
        # Get all requests and sessions for this mentor
        total_requests = MentoringRequests.objects.filter(mentor_id=mentor_id).count()
        pending_requests = MentoringRequests.objects.filter(mentor_id=mentor_id, status='pending').count()
        
        # Use case-insensitive queries for sessions
        all_sessions = MentoringSessions.objects.filter(mentor_id=mentor_id)
        scheduled_sessions = all_sessions.filter(status__iregex=r'^scheduled$').count()
        completed_sessions = all_sessions.filter(status__iregex=r'^completed$').count()
        
        # Calculate additional metrics
        declined_requests = MentoringRequests.objects.filter(mentor_id=mentor_id, status='declined').count()
        expired_requests = MentoringRequests.objects.filter(mentor_id=mentor_id, status='expired').count()
        
        # Calculate response rate (accepted + declined vs total pending + accepted + declined)
        responded_requests = (total_requests - pending_requests - expired_requests)
        response_rate = round((responded_requests / max(total_requests, 1)) * 100, 1) if total_requests > 0 else 0
        
        return JsonResponse({
            'status': 'success',
            'stats': {
                'total_requests': total_requests,
                'pending_requests': pending_requests,
                'scheduled_sessions': scheduled_sessions,
                'completed_sessions': completed_sessions,
                'declined_requests': declined_requests,
                'expired_requests': expired_requests,
                'average_rating': 4.8,  # This can be calculated from feedback later
                'response_rate': response_rate,
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
