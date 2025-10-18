from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.db import transaction
from datetime import datetime, timedelta, time, date
from django.utils import timezone
import json
from .models import (
    MentoringSessions, MentoringRequests, SessionDetails, Mentors, 
    MentoringSessionEnrollments, MentorAvailability, MentorAvailabilityExceptions
)
from apps.accounts.models import UserDetails
from apps.students.models import Students


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

    def post(self, request, mentor_id):
        """Create a new mentoring request"""
        try:
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['topic', 'description', 'scheduled_at']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'status': 'error',
                        'message': f'{field} is required'
                    }, status=400)
            
            # Check if mentor exists
            try:
                mentor = Mentors.objects.get(mentor_id=mentor_id)
            except Mentors.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Mentor not found'
                }, status=404)
            
            # Get the student ID from the request body or session
            student_id = data.get('student_id') or request.session.get('student_id')
            if not student_id:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Student ID is required. Please include student_id in the request.'
                }, status=400)
            
            try:
                student = Students.objects.get(student_id=student_id)
            except Students.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Student not found'
                }, status=404)
            
            # Parse the scheduled datetime
            try:
                scheduled_at = datetime.fromisoformat(data['scheduled_at'].replace('Z', '+00:00'))
            except ValueError:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid datetime format'
                }, status=400)
            
            # Create the mentoring request
            mentoring_request = MentoringRequests.objects.create(
                student=student,
                mentor=mentor,
                topic=data['topic'],
                description=data['description'],
                preferred_time=scheduled_at,
                session_type=data.get('session_type', 'online'),
                urgency='normal',
                status='pending',
                requested_date=timezone.now(),
                expiry_date=timezone.now() + timedelta(days=7)  # Expires in 7 days
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Mentoring request created successfully',
                'request_id': mentoring_request.request_id
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)

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
    """Accept a mentoring request and create a session using the student's preferred time"""
    try:
        data = json.loads(request.body)
        # Optional: Allow override of scheduled datetime, location, and meeting link
        scheduled_datetime = data.get('scheduled_datetime')
        location = data.get('location', '')
        meeting_link = data.get('meeting_link', '')
        
        with transaction.atomic():
            # Get the mentoring request
            mentoring_request = MentoringRequests.objects.get(request_id=request_id)
            
            if mentoring_request.status != 'pending':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Request is not in pending status'
                }, status=400)
            
            # Use the student's preferred time if scheduled_datetime is not provided
            if scheduled_datetime:
                scheduled_dt = datetime.fromisoformat(scheduled_datetime.replace('Z', '+00:00'))
            else:
                # Parse preferred_time from the request
                # The preferred_time should be a datetime string
                try:
                    scheduled_dt = datetime.fromisoformat(str(mentoring_request.preferred_time).replace('Z', '+00:00'))
                except (ValueError, AttributeError):
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Invalid preferred time format in the request'
                    }, status=400)
            
            # Check for conflicts with existing scheduled sessions
            mentor = mentoring_request.mentor
            session_end = scheduled_dt + timedelta(hours=1)  # 1 hour session
            
            conflicting_sessions = MentoringSessions.objects.filter(
                mentor=mentor,
                status='scheduled',
                scheduled_at__lt=session_end,
                scheduled_at__gte=scheduled_dt - timedelta(hours=1)
            ).exists()
            
            if conflicting_sessions:
                # Log warning but still allow scheduling
                print(f"Warning: Potential conflict detected for mentor {mentor.mentor_id} at {scheduled_dt}")
            
            # Update the request status
            mentoring_request.status = 'scheduled'
            mentoring_request.save()
            
            # Create a session in the mentoring_sessions table
            session = MentoringSessions.objects.create(
                mentor=mentoring_request.mentor,
                topic=mentoring_request.topic,
                scheduled_at=scheduled_dt,
                duration_minutes=60,  # Default duration (1 hour)
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
                'message': 'Request accepted and session scheduled successfully',
                'session_id': session.session_id,
                'scheduled_at': scheduled_dt.isoformat()
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
    """Reschedule a session to a new time, checking for conflicts"""
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
        
        # Check if the new time is the same as the current time
        if session.scheduled_at == new_dt:
            return JsonResponse({
                'status': 'error',
                'message': 'The new time is the same as the current session time'
            }, status=400)
        
        # Check for conflicts with other scheduled sessions (excluding current session)
        mentor = session.mentor
        session_end = new_dt + timedelta(hours=1)  # 1 hour session
        
        conflicting_sessions = MentoringSessions.objects.filter(
            mentor=mentor,
            status='scheduled',
            scheduled_at__lt=session_end,
            scheduled_at__gte=new_dt - timedelta(hours=1)
        ).exclude(session_id=session_id).exists()
        
        if conflicting_sessions:
            return JsonResponse({
                'status': 'error',
                'message': 'This time slot conflicts with another scheduled session'
            }, status=400)
        
        with transaction.atomic():
            # Update the session with the new datetime (this frees up the old slot)
            session.scheduled_at = new_dt
            session.save()
            
            # Update session details
            session_details, created = SessionDetails.objects.get_or_create(session=session)
            if location:
                session_details.location = location
            if meeting_link:
                session_details.meeting_link = meeting_link
            session_details.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Session rescheduled successfully',
            'new_scheduled_at': new_dt.isoformat()
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


class MentorAvailabilityView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, mentor_id):
        """Get mentor's availability schedule"""
        try:
            availability = MentorAvailability.objects.filter(
                mentor_id=mentor_id,
                is_active=True
            ).order_by('day_of_week', 'start_time')
            
            availability_data = []
            for avail in availability:
                availability_data.append({
                    'id': avail.availability_id,
                    'day_of_week': avail.day_of_week,
                    'day_name': avail.get_day_of_week_display(),
                    'start_time': avail.start_time.strftime('%H:%M'),
                    'end_time': avail.end_time.strftime('%H:%M'),
                    'is_active': avail.is_active,
                    'created_at': avail.created_at.isoformat() if avail.created_at else None,
                    'updated_at': avail.updated_at.isoformat() if avail.updated_at else None
                })
            
            return JsonResponse({
                'status': 'success',
                'availability': availability_data
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    def post(self, request, mentor_id):
        """Add new availability slot"""
        try:
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['day_of_week', 'start_time', 'end_time']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'status': 'error',
                        'message': f'{field} is required'
                    }, status=400)
            
            # Check if mentor exists
            try:
                mentor = Mentors.objects.get(mentor_id=mentor_id)
            except Mentors.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Mentor not found'
                }, status=404)
            
            # Parse time strings
            start_time = datetime.strptime(data['start_time'], '%H:%M').time()
            end_time = datetime.strptime(data['end_time'], '%H:%M').time()
            
            # Validate time range
            if start_time >= end_time:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Start time must be before end time'
                }, status=400)
            
            # Check for overlapping availability
            overlapping = MentorAvailability.objects.filter(
                mentor=mentor,
                day_of_week=data['day_of_week'],
                is_active=True
            ).filter(
                Q(start_time__lt=end_time, end_time__gt=start_time)
            )
            
            if overlapping.exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'This time slot overlaps with existing availability'
                }, status=400)
            
            # Create availability
            availability = MentorAvailability.objects.create(
                mentor=mentor,
                day_of_week=data['day_of_week'],
                start_time=start_time,
                end_time=end_time,
                is_active=data.get('is_active', True)
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability added successfully',
                'availability': {
                    'id': availability.availability_id,
                    'day_of_week': availability.day_of_week,
                    'day_name': availability.get_day_of_week_display(),
                    'start_time': availability.start_time.strftime('%H:%M'),
                    'end_time': availability.end_time.strftime('%H:%M'),
                    'is_active': availability.is_active
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON'
            }, status=400)
        except ValueError as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Invalid time format: {str(e)}'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    def put(self, request, mentor_id):
        """Update availability slot"""
        try:
            data = json.loads(request.body)
            
            if 'availability_id' not in data:
                return JsonResponse({
                    'status': 'error',
                    'message': 'availability_id is required'
                }, status=400)
            
            try:
                availability = MentorAvailability.objects.get(
                    availability_id=data['availability_id'],
                    mentor_id=mentor_id
                )
            except MentorAvailability.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Availability not found'
                }, status=404)
            
            # Update fields if provided
            if 'start_time' in data:
                availability.start_time = datetime.strptime(data['start_time'], '%H:%M').time()
            if 'end_time' in data:
                availability.end_time = datetime.strptime(data['end_time'], '%H:%M').time()
            if 'is_active' in data:
                availability.is_active = data['is_active']
            
            # Validate time range
            if availability.start_time >= availability.end_time:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Start time must be before end time'
                }, status=400)
            
            availability.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability updated successfully',
                'availability': {
                    'id': availability.availability_id,
                    'day_of_week': availability.day_of_week,
                    'day_name': availability.get_day_of_week_display(),
                    'start_time': availability.start_time.strftime('%H:%M'),
                    'end_time': availability.end_time.strftime('%H:%M'),
                    'is_active': availability.is_active
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON'
            }, status=400)
        except ValueError as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Invalid time format: {str(e)}'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    def delete(self, request, mentor_id):
        """Delete availability slot"""
        try:
            data = json.loads(request.body)
            
            if 'availability_id' not in data:
                return JsonResponse({
                    'status': 'error',
                    'message': 'availability_id is required'
                }, status=400)
            
            try:
                availability = MentorAvailability.objects.get(
                    availability_id=data['availability_id'],
                    mentor_id=mentor_id
                )
            except MentorAvailability.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Availability not found'
                }, status=404)
            
            availability.delete()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability deleted successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


class AvailableTimeSlotsView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, mentor_id):
        """Get available time slots for a mentor within the next 2 weeks"""
        try:
            # Get optional exclude_session_id parameter (for rescheduling)
            exclude_session_id = request.GET.get('exclude_session_id')
            
            # Get current time for filtering past slots
            now = timezone.now()
            
            # Get date range - start from today for rescheduling, tomorrow for new bookings
            if exclude_session_id:
                # For rescheduling, allow today's future slots
                start_date = now.date()
            else:
                # For new bookings, require 24 hours advance notice
                start_date = now.date() + timedelta(days=1)
            
            end_date = now.date() + timedelta(days=14)  # 2 weeks from today
            
            # Override dates if provided in query params
            if 'start_date' in request.GET:
                start_date = datetime.strptime(request.GET['start_date'], '%Y-%m-%d').date()
            if 'end_date' in request.GET:
                end_date = datetime.strptime(request.GET['end_date'], '%Y-%m-%d').date()
            
            # Ensure start date is not in the past
            if start_date < now.date():
                start_date = now.date()
            
            # Ensure end date is within 2 weeks from today
            max_date = now.date() + timedelta(days=14)
            if end_date > max_date:
                end_date = max_date
            
            # Get mentor's regular availability
            availability = MentorAvailability.objects.filter(
                mentor_id=mentor_id,
                is_active=True
            )
            
            # Get mentor's exceptions
            exceptions = MentorAvailabilityExceptions.objects.filter(
                mentor_id=mentor_id,
                date__gte=start_date,
                date__lte=end_date
            )
            
            # Get existing sessions (booked slots), excluding the session being rescheduled
            existing_sessions_query = MentoringSessions.objects.filter(
                mentor_id=mentor_id,
                scheduled_at__date__gte=start_date,
                scheduled_at__date__lte=end_date,
                status__in=['pending', 'scheduled']
            )
            
            # Exclude the current session if rescheduling
            if exclude_session_id:
                existing_sessions_query = existing_sessions_query.exclude(session_id=exclude_session_id)
            
            existing_sessions = existing_sessions_query
            
            available_slots = []
            current_date = start_date
            
            while current_date <= end_date:
                day_of_week = current_date.weekday()
                # Convert Python weekday (0=Monday) to our weekday (0=Sunday)
                our_day_of_week = (day_of_week + 1) % 7
                
                # Get regular availability for this day
                day_availability = availability.filter(day_of_week=our_day_of_week)
                
                # Check for exceptions on this date
                day_exceptions = exceptions.filter(date=current_date)
                
                for avail in day_availability:
                    # Check if this slot is affected by exceptions
                    slot_available = True
                    
                    for exception in day_exceptions:
                        if exception.exception_type == 'unavailable':
                            # If exception covers whole day or overlaps with this slot
                            if (not exception.start_time and not exception.end_time) or \
                               (exception.start_time and exception.end_time and 
                                exception.start_time <= avail.start_time and 
                                exception.end_time >= avail.end_time):
                                slot_available = False
                                break
                    
                    if slot_available:
                        # Generate time slots (assuming 1-hour sessions)
                        session_duration = timedelta(hours=1)
                        current_time = datetime.combine(current_date, avail.start_time)
                        end_time = datetime.combine(current_date, avail.end_time)
                        
                        while current_time + session_duration <= end_time:
                            # Make slot_datetime timezone-aware for proper comparison
                            slot_datetime = timezone.make_aware(current_time)
                            slot_end = slot_datetime + session_duration
                            
                            # Skip past time slots (must be at least current time or later)
                            if slot_datetime <= now:
                                current_time += session_duration
                                continue
                            
                            # Check if this slot conflicts with existing sessions
                            # A conflict occurs if there's overlap between slot and existing session
                            conflict = False
                            for session in existing_sessions:
                                session_start = session.scheduled_at
                                # Ensure session_start is timezone-aware
                                if timezone.is_naive(session_start):
                                    session_start = timezone.make_aware(session_start)
                                session_end = session_start + timedelta(hours=1)
                                
                                # Check for overlap: slot starts before session ends AND slot ends after session starts
                                if slot_datetime < session_end and slot_end > session_start:
                                    conflict = True
                                    break
                            
                            if not conflict:
                                available_slots.append({
                                    'date': current_date.isoformat(),
                                    'start_time': current_time.time().strftime('%H:%M'),
                                    'end_time': (current_time + session_duration).time().strftime('%H:%M'),
                                    'datetime': slot_datetime.isoformat(),
                                    'day_name': current_date.strftime('%A'),
                                    'formatted_date': current_date.strftime('%B %d, %Y'),
                                    'formatted_time': current_time.time().strftime('%I:%M %p')
                                })
                            
                            current_time += session_duration
                
                current_date += timedelta(days=1)
            
            # Sort slots by datetime
            available_slots.sort(key=lambda x: x['datetime'])
            
            return JsonResponse({
                'status': 'success',
                'available_slots': available_slots,
                'date_range': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
