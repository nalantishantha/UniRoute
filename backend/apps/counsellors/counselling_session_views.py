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
    CouncellingSessions, CounsellingRequests, CounsellingSessionDetails, Counsellors,
    CounsellingSessionEnrollments, CounsellorAvailability, CounsellorAvailabilityExceptions,
    CounsellingFeedback
)
from apps.accounts.models import UserDetails
from apps.students.models import Students


def parse_request_json(request):
    """Safely parse request body to JSON/dict."""
    try:
        body = request.body
        if not body:
            return {}
        if isinstance(body, bytes):
            body = body.decode('utf-8')
        if isinstance(body, str):
            body = body.strip()
            if not body:
                return {}
            return json.loads(body)
        if isinstance(body, dict):
            return body
        return json.loads(body)
    except Exception:
        return {}


class CounsellingRequestsView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, counsellor_id):
        """Get all counselling requests for a specific counsellor"""
        try:
            # Update expired requests
            self.update_expired_requests()
            
            requests = CounsellingRequests.objects.filter(
                counsellor_id=counsellor_id
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
                        session_detail = req.counsellingsessiondetails_set.first()
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
        expired_requests = CounsellingRequests.objects.filter(
            status='pending',
            expiry_date__lt=timezone.now()
        )
        expired_requests.update(status='expired')

    def post(self, request, counsellor_id):
        """Create a new counselling request"""
        try:
            data = parse_request_json(request)
            
            # Validate required fields
            required_fields = ['topic', 'description', 'scheduled_at']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'status': 'error',
                        'message': f'{field} is required'
                    }, status=400)
            
            # Check if counsellor exists
            try:
                counsellor = Counsellors.objects.get(counsellor_id=counsellor_id)
            except Counsellors.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Counsellor not found'
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
                
                if timezone.is_naive(scheduled_at):
                    scheduled_at = timezone.make_aware(scheduled_at)
                    
            except ValueError:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid datetime format'
                }, status=400)
            
            # Calculate expiry date (3 hours before the preferred time)
            expiry_datetime = scheduled_at - timedelta(hours=3)
            
            # Create the counselling request
            counselling_request = CounsellingRequests.objects.create(
                student=student,
                counsellor=counsellor,
                topic=data['topic'],
                description=data['description'],
                preferred_time=scheduled_at,
                session_type=data.get('session_type', 'online'),
                urgency='normal',
                status='pending',
                requested_date=timezone.now(),
                expiry_date=expiry_datetime
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Counselling request created successfully',
                'request_id': counselling_request.request_id
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


class CounsellingSessionsView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, counsellor_id):
        """Get all counselling sessions for a specific counsellor"""
        try:
            sessions = CouncellingSessions.objects.filter(
                counsellor_id=counsellor_id
            ).select_related('details').order_by('-scheduled_at')
            
            sessions_data = []
            for session in sessions:
                # Get enrollments
                enrollments = CounsellingSessionEnrollments.objects.filter(
                    session=session
                ).select_related('student__user', 'student__user__userdetails')
                
                students_list = []
                for enrollment in enrollments:
                    student_user = enrollment.student.user
                    user_details = getattr(student_user, 'userdetails', None)
                    students_list.append({
                        'student_id': enrollment.student.student_id,
                        'name': user_details.full_name if user_details else student_user.username,
                        'avatar': user_details.profile_picture if user_details else None
                    })
                
                session_data = {
                    'id': session.session_id,
                    'topic': session.topic,
                    'scheduled_at': session.scheduled_at.isoformat(),
                    'duration_minutes': session.duration_minutes,
                    'status': session.status,
                    'students': students_list,
                }
                
                # Add details if available
                if hasattr(session, 'details'):
                    details = session.details
                    session_data.update({
                        'location': details.location,
                        'meeting_link': details.meeting_link,
                        'cancellation_reason': details.cancellation_reason,
                        'completion_notes': details.completion_notes,
                    })
                
                sessions_data.append(session_data)
            
            return JsonResponse({
                'status': 'success',
                'sessions': sessions_data
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


class CounsellorAvailabilityView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, counsellor_id):
        """Get counsellor availability schedule"""
        try:
            availabilities = CounsellorAvailability.objects.filter(
                counsellor_id=counsellor_id,
                is_active=True
            ).order_by('day_of_week', 'start_time')
            
            availability_data = []
            for avail in availabilities:
                availability_data.append({
                    'id': avail.availability_id,
                    'day_of_week': avail.day_of_week,
                    'day_name': avail.get_day_of_week_display(),
                    'start_time': avail.start_time.strftime('%H:%M'),
                    'end_time': avail.end_time.strftime('%H:%M'),
                    'is_active': avail.is_active,
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
    
    def post(self, request, counsellor_id):
        """Add new availability slot"""
        try:
            data = parse_request_json(request)
            
            counsellor = Counsellors.objects.get(counsellor_id=counsellor_id)
            
            availability = CounsellorAvailability.objects.create(
                counsellor=counsellor,
                day_of_week=data['day_of_week'],
                start_time=data['start_time'],
                end_time=data['end_time'],
                is_active=True
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability added successfully',
                'availability_id': availability.availability_id
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


class AvailableTimeSlotsView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, counsellor_id):
        """Get available time slots for booking"""
        try:
            # Get counsellor
            counsellor = Counsellors.objects.get(counsellor_id=counsellor_id)
            
            # Get date range (default: next 14 days)
            start_date_str = request.GET.get('start_date')
            end_date_str = request.GET.get('end_date')
            
            if start_date_str:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            else:
                start_date = timezone.now().date()
            
            if end_date_str:
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            else:
                end_date = start_date + timedelta(days=14)
            
            # Get counsellor's regular availability
            regular_availability = CounsellorAvailability.objects.filter(
                counsellor=counsellor,
                is_active=True
            )
            
            # Get exceptions
            exceptions = CounsellorAvailabilityExceptions.objects.filter(
                counsellor=counsellor,
                date__gte=start_date,
                date__lte=end_date
            )
            
            # Get existing sessions
            existing_sessions = CouncellingSessions.objects.filter(
                counsellor=counsellor,
                scheduled_at__date__gte=start_date,
                scheduled_at__date__lte=end_date,
                status__in=['scheduled', 'pending']
            )
            
            # Generate available slots
            available_slots = self.generate_available_slots(
                start_date, end_date, regular_availability, exceptions, existing_sessions
            )
            
            return JsonResponse({
                'status': 'success',
                'available_slots': available_slots,
                'counsellor_id': counsellor_id
            })
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    def generate_available_slots(self, start_date, end_date, regular_availability, exceptions, existing_sessions):
        """Generate available time slots"""
        slots = []
        current_date = start_date
        
        # Create a dict of exceptions by date for quick lookup
        exceptions_dict = {}
        for exc in exceptions:
            if exc.date not in exceptions_dict:
                exceptions_dict[exc.date] = []
            exceptions_dict[exc.date].append(exc)
        
        # Create a set of booked times for quick lookup
        booked_times = set()
        for session in existing_sessions:
            booked_times.add((session.scheduled_at.date(), session.scheduled_at.time()))
        
        while current_date <= end_date:
            day_of_week = (current_date.weekday() + 1) % 7  # Convert to 0=Sunday
            
            # Check if there are exceptions for this date
            date_exceptions = exceptions_dict.get(current_date, [])
            unavailable_full_day = any(
                exc.exception_type == 'unavailable' and not exc.start_time
                for exc in date_exceptions
            )
            
            if not unavailable_full_day:
                # Get regular availability for this day
                day_availability = regular_availability.filter(day_of_week=day_of_week)
                
                for avail in day_availability:
                    # Check if this specific time is marked as unavailable
                    is_unavailable = any(
                        exc.exception_type == 'unavailable' and
                        exc.start_time and exc.end_time and
                        avail.start_time >= exc.start_time and avail.end_time <= exc.end_time
                        for exc in date_exceptions
                    )
                    
                    if not is_unavailable:
                        # Generate 1-hour slots
                        slot_time = datetime.combine(current_date, avail.start_time)
                        end_time = datetime.combine(current_date, avail.end_time)
                        
                        while slot_time < end_time:
                            # Check if slot is not already booked
                            if (current_date, slot_time.time()) not in booked_times:
                                # Only show slots that are in the future
                                slot_datetime = timezone.make_aware(slot_time)
                                if slot_datetime > timezone.now():
                                    slots.append({
                                        'date': current_date.isoformat(),
                                        'start_time': slot_time.time().strftime('%H:%M'),
                                        'end_time': (slot_time + timedelta(hours=1)).time().strftime('%H:%M'),
                                        'datetime': slot_datetime.isoformat(),
                                        'formatted_time': slot_time.time().strftime('%I:%M %p'),
                                        'day_name': current_date.strftime('%A')
                                    })
                            
                            slot_time += timedelta(hours=1)
            
            current_date += timedelta(days=1)
        
        return slots


@csrf_exempt
@require_http_methods(["POST"])
def accept_request(request, request_id):
    """Accept a counselling request and create a session"""
    try:
        data = parse_request_json(request)
        
        # Get the request
        counselling_request = CounsellingRequests.objects.get(request_id=request_id)
        
        if counselling_request.status != 'pending':
            return JsonResponse({
                'status': 'error',
                'message': 'This request has already been processed'
            }, status=400)
        
        # Parse scheduled datetime
        scheduled_at = datetime.fromisoformat(data.get('scheduled_at', '').replace('Z', '+00:00'))
        if timezone.is_naive(scheduled_at):
            scheduled_at = timezone.make_aware(scheduled_at)
        
        with transaction.atomic():
            # Create session
            session = CouncellingSessions.objects.create(
                counsellor=counselling_request.counsellor,
                topic=counselling_request.topic,
                scheduled_at=scheduled_at,
                duration_minutes=data.get('duration_minutes', 60),
                status='scheduled',
                created_at=timezone.now()
            )
            
            # Create session details
            session_details = CounsellingSessionDetails.objects.create(
                session=session,
                request=counselling_request,
                location=data.get('location', ''),
                meeting_link=data.get('meeting_link', '')
            )
            
            # Create enrollment
            CounsellingSessionEnrollments.objects.create(
                session=session,
                student=counselling_request.student,
                enrolled_at=timezone.now()
            )
            
            # Update request status
            counselling_request.status = 'scheduled'
            counselling_request.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Request accepted and session scheduled',
            'session_id': session.session_id
        })
        
    except CounsellingRequests.DoesNotExist:
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
    """Decline a counselling request"""
    try:
        data = parse_request_json(request)
        
        counselling_request = CounsellingRequests.objects.get(request_id=request_id)
        
        if counselling_request.status != 'pending':
            return JsonResponse({
                'status': 'error',
                'message': 'This request has already been processed'
            }, status=400)
        
        counselling_request.status = 'declined'
        counselling_request.decline_reason = data.get('reason', '')
        counselling_request.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Request declined successfully'
        })
        
    except CounsellingRequests.DoesNotExist:
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
    """Cancel a counselling session"""
    try:
        data = parse_request_json(request)
        
        session = CouncellingSessions.objects.get(session_id=session_id)
        
        if session.status == 'cancelled':
            return JsonResponse({
                'status': 'error',
                'message': 'Session is already cancelled'
            }, status=400)
        
        if session.status == 'completed':
            return JsonResponse({
                'status': 'error',
                'message': 'Cannot cancel a completed session'
            }, status=400)
        
        with transaction.atomic():
            session.status = 'cancelled'
            session.save()
            
            if hasattr(session, 'details'):
                session.details.cancellation_reason = data.get('reason', '')
                session.details.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Session cancelled successfully'
        })
        
    except CouncellingSessions.DoesNotExist:
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
    """Mark a counselling session as completed"""
    try:
        data = parse_request_json(request)
        
        session = CouncellingSessions.objects.get(session_id=session_id)
        
        if session.status == 'completed':
            return JsonResponse({
                'status': 'error',
                'message': 'Session is already marked as completed'
            }, status=400)
        
        with transaction.atomic():
            session.status = 'completed'
            session.save()
            
            if hasattr(session, 'details'):
                session.details.completion_notes = data.get('completion_notes', '')
                session.details.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Session marked as completed'
        })
        
    except CouncellingSessions.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Session not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_counsellor_stats(request, counsellor_id):
    """Get counsellor statistics"""
    try:
        total_requests = CounsellingRequests.objects.filter(counsellor_id=counsellor_id).count()
        pending_requests = CounsellingRequests.objects.filter(counsellor_id=counsellor_id, status='pending').count()
        total_sessions = CouncellingSessions.objects.filter(counsellor_id=counsellor_id).count()
        completed_sessions = CouncellingSessions.objects.filter(counsellor_id=counsellor_id, status='completed').count()
        
        return JsonResponse({
            'status': 'success',
            'stats': {
                'total_requests': total_requests,
                'pending_requests': pending_requests,
                'total_sessions': total_sessions,
                'completed_sessions': completed_sessions,
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
