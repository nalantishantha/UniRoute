"""
Views for tutor session management (tutor-side operations)
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.utils import timezone
from datetime import datetime, timedelta, date, time
import json

from .models import (
    Tutors, TutoringBooking, TutoringSessionReschedule, 
    TutorAvailability
)
from .serializers import serialize_tutoring_booking
from apps.mentoring.models import MentoringSessions  # For conflict checking with mentoring sessions


@csrf_exempt
@require_http_methods(['POST'])
def mark_session_completed(request, booking_id):
    """Mark an individual session as completed (increment sessions_completed)"""
    try:
        try:
            booking = TutoringBooking.objects.get(booking_id=booking_id)
        except TutoringBooking.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
        
        # Check if already all sessions are completed
        if booking.sessions_completed >= booking.sessions_paid:
            return JsonResponse({
                'status': 'error',
                'message': 'All sessions have already been completed.'
            }, status=400)
        
        # Increment sessions_completed
        booking.sessions_completed += 1
        booking.save()
        
        return JsonResponse({
            'status': 'success',
            'message': f'Session marked as completed. {booking.sessions_completed}/{booking.sessions_paid} sessions completed.',
            'booking': serialize_tutoring_booking(booking)
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def complete_tutoring_booking(request, booking_id):
    """Mark a tutoring booking as completed (all sessions done)"""
    try:
        try:
            booking = TutoringBooking.objects.get(booking_id=booking_id)
        except TutoringBooking.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
        
        # Check if all paid sessions are completed
        if booking.sessions_completed < booking.sessions_paid:
            return JsonResponse({
                'status': 'error',
                'message': f'Cannot complete booking. Only {booking.sessions_completed} of {booking.sessions_paid} sessions completed.'
            }, status=400)
        
        # Check if booking is already completed
        if booking.status == 'completed':
            return JsonResponse({'status': 'error', 'message': 'Booking is already completed'}, status=400)
        
        booking.status = 'completed'
        booking.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Booking marked as completed successfully',
            'booking': serialize_tutoring_booking(booking)
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def reschedule_tutoring_session(request, booking_id):
    """Reschedule a specific session within a booking"""
    try:
        data = json.loads(request.body)
        
        # Get booking
        try:
            booking = TutoringBooking.objects.get(booking_id=booking_id)
        except TutoringBooking.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
        
        # Validate required fields
        required_fields = ['original_date', 'new_date', 'new_start_time', 'new_end_time', 'requested_by']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return JsonResponse({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=400)
        
        # Parse dates and times
        try:
            original_date = datetime.strptime(data['original_date'], '%Y-%m-%d').date()
            new_date = datetime.strptime(data['new_date'], '%Y-%m-%d').date()
            new_start_time = datetime.strptime(data['new_start_time'], '%H:%M').time()
            new_end_time = datetime.strptime(data['new_end_time'], '%H:%M').time()
        except ValueError as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Invalid date/time format: {str(e)}'
            }, status=400)
        
        # Validate requested_by
        if data['requested_by'] not in ['tutor', 'student']:
            return JsonResponse({
                'status': 'error',
                'message': 'requested_by must be either "tutor" or "student"'
            }, status=400)
        
        # Check if original date is within booking period
        if original_date < booking.start_date or (booking.end_date and original_date > booking.end_date):
            return JsonResponse({
                'status': 'error',
                'message': 'Original date is not within booking period'
            }, status=400)
        
        # Check if original date is in the past
        if original_date < date.today():
            return JsonResponse({
                'status': 'error',
                'message': 'Cannot reschedule a session that has already passed'
            }, status=400)
        
        # Check if new date is not in the past
        if new_date < date.today():
            return JsonResponse({
                'status': 'error',
                'message': 'Cannot reschedule to a past date'
            }, status=400)
        
        # Check if time range is valid
        if new_start_time >= new_end_time:
            return JsonResponse({
                'status': 'error',
                'message': 'Start time must be before end time'
            }, status=400)
        
        # Check for conflicts with existing tutoring bookings
        tutor = booking.tutor
        day_of_week = new_date.weekday()  # 0=Monday, 6=Sunday
        
        # Convert to our format (0=Sunday)
        day_of_week = (day_of_week + 1) % 7
        
        # Check for conflicts with tutor's existing tutoring bookings
        conflict_bookings = TutoringBooking.objects.filter(
            tutor=tutor,
            status__in=['scheduled', 'active', 'confirmed']
        ).exclude(booking_id=booking_id)
        
        for other_booking in conflict_bookings:
            # Check if it's a recurring booking that falls on the new date
            if other_booking.is_recurring:
                slot = other_booking.availability_slot
                if slot.day_of_week == day_of_week:
                    # Check time overlap
                    if not (new_end_time <= slot.start_time or new_start_time >= slot.end_time):
                        return JsonResponse({
                            'status': 'error',
                            'message': f'Time slot conflicts with another tutoring booking at {slot.start_time}-{slot.end_time}'
                        }, status=400)
            
            # Check reschedules of other bookings
            other_reschedules = TutoringSessionReschedule.objects.filter(
                booking=other_booking,
                new_date=new_date,
                status='approved'
            )
            for reschedule in other_reschedules:
                if not (new_end_time <= reschedule.new_start_time or new_start_time >= reschedule.new_end_time):
                    return JsonResponse({
                        'status': 'error',
                        'message': f'Time slot conflicts with a rescheduled tutoring session at {reschedule.new_start_time}-{reschedule.new_end_time}'
                    }, status=400)
        
        # Check for conflicts with mentoring sessions
        try:
            from apps.mentoring.models import Mentors as MentoringMentors
            
            # Get the mentor profile from the tutor's user
            try:
                mentor = MentoringMentors.objects.get(user=tutor.user)
                
                # Check for scheduled mentoring sessions on the new date
                mentoring_conflicts = MentoringSessions.objects.filter(
                    mentor=mentor,
                    status__in=['scheduled', 'pending'],
                )
                
                for mentoring_session in mentoring_conflicts:
                    # Extract date and time from scheduled_at
                    session_datetime = mentoring_session.scheduled_at
                    session_date = session_datetime.date()
                    session_start_time = session_datetime.time()
                    
                    # Calculate end time using duration_minutes
                    if mentoring_session.duration_minutes:
                        session_end_datetime = session_datetime + timedelta(minutes=mentoring_session.duration_minutes)
                        session_end_time = session_end_datetime.time()
                    else:
                        # Default to 1 hour if duration not specified
                        session_end_datetime = session_datetime + timedelta(hours=1)
                        session_end_time = session_end_datetime.time()
                    
                    # Check if it's on the same date
                    if session_date == new_date:
                        # Check for time overlap
                        if not (new_end_time <= session_start_time or new_start_time >= session_end_time):
                            return JsonResponse({
                                'status': 'error',
                                'message': f'Time slot conflicts with a mentoring session at {session_start_time.strftime("%H:%M")}-{session_end_time.strftime("%H:%M")}'
                            }, status=400)
            except MentoringMentors.DoesNotExist:
                pass  # Tutor is not a mentor, no conflicts possible
        except Exception as e:
            # Log error but don't fail the request if mentoring module is unavailable
            print(f"Warning: Could not check mentoring conflicts: {str(e)}")
            pass
        
        # Create reschedule record
        with transaction.atomic():
            reschedule = TutoringSessionReschedule.objects.create(
                booking=booking,
                original_date=original_date,
                new_date=new_date,
                new_start_time=new_start_time,
                new_end_time=new_end_time,
                reason=data.get('reason', ''),
                requested_by=data['requested_by'],
                status='approved'  # Auto-approve for now
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Session rescheduled successfully',
                'reschedule': {
                    'reschedule_id': reschedule.reschedule_id,
                    'booking_id': booking.booking_id,
                    'original_date': reschedule.original_date.isoformat(),
                    'new_date': reschedule.new_date.isoformat(),
                    'new_start_time': reschedule.new_start_time.strftime('%H:%M'),
                    'new_end_time': reschedule.new_end_time.strftime('%H:%M'),
                    'reason': reschedule.reason,
                    'requested_by': reschedule.requested_by,
                    'status': reschedule.status,
                    'created_at': reschedule.created_at.isoformat()
                }
            })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(['GET'])
def get_booking_reschedules(request, booking_id):
    """Get all reschedules for a specific booking"""
    try:
        try:
            booking = TutoringBooking.objects.get(booking_id=booking_id)
        except TutoringBooking.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
        
        reschedules = TutoringSessionReschedule.objects.filter(booking=booking)
        
        reschedules_data = [{
            'reschedule_id': r.reschedule_id,
            'booking_id': booking.booking_id,
            'original_date': r.original_date.isoformat(),
            'new_date': r.new_date.isoformat(),
            'new_start_time': r.new_start_time.strftime('%H:%M'),
            'new_end_time': r.new_end_time.strftime('%H:%M'),
            'reason': r.reason,
            'requested_by': r.requested_by,
            'status': r.status,
            'created_at': r.created_at.isoformat()
        } for r in reschedules]
        
        return JsonResponse({
            'status': 'success',
            'reschedules': reschedules_data,
            'count': len(reschedules_data)
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(['GET'])
def get_tutor_sessions_detailed(request, tutor_id):
    """Get detailed session information for a tutor including reschedules"""
    try:
        try:
            tutor = Tutors.objects.get(tutor_id=tutor_id)
        except Tutors.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Tutor not found'}, status=404)
        
        status_filter = request.GET.get('status', 'scheduled')
        
        # Get bookings
        filters = {'tutor': tutor}
        if status_filter:
            if status_filter == 'upcoming':
                filters['status__in'] = ['scheduled', 'active', 'confirmed']
            elif status_filter == 'completed':
                filters['status'] = 'completed'
            else:
                filters['status'] = status_filter
        
        bookings = TutoringBooking.objects.filter(**filters).select_related(
            'student', 'student__user', 'availability_slot'
        )
        
        sessions_data = []
        today = date.today()
        
        for booking in bookings:
            # Get student details
            student_user = booking.student.user
            try:
                from apps.accounts.models import UserDetails
                student_details = UserDetails.objects.get(user=student_user)
                student_name = student_details.full_name or student_user.username
                student_picture = student_details.profile_picture or ''
            except:
                student_name = student_user.username
                student_picture = ''
            
            # Get all reschedules for this booking
            reschedules = TutoringSessionReschedule.objects.filter(
                booking=booking,
                status='approved'
            )
            reschedules_dict = {r.original_date: r for r in reschedules}
            
            # Generate session dates
            slot = booking.availability_slot
            
            # Skip bookings without a valid availability slot
            if not slot:
                continue
            
            current_date = booking.start_date
            end_date = booking.end_date or (today + timedelta(days=365))  # Default to 1 year
            
            session_count = 0
            while current_date <= end_date and session_count < booking.sessions_paid:
                # Check if this date matches the availability slot's day of week
                day_of_week = (current_date.weekday() + 1) % 7  # Convert to 0=Sunday
                
                if day_of_week == slot.day_of_week and current_date >= booking.start_date:
                    # Check if this session has been rescheduled
                    if current_date in reschedules_dict:
                        reschedule = reschedules_dict[current_date]
                        session_date = reschedule.new_date
                        start_time = reschedule.new_start_time
                        end_time = reschedule.new_end_time
                        is_rescheduled = True
                    else:
                        session_date = current_date
                        start_time = slot.start_time
                        end_time = slot.end_time
                        is_rescheduled = False
                    
                    # Determine if session is expired (date has passed)
                    is_expired = session_date < today
                    
                    # Determine session status
                    if session_count < booking.sessions_completed:
                        session_status = 'completed'
                    elif is_expired:
                        session_status = 'expired'
                    else:
                        session_status = 'scheduled'
                    
                    sessions_data.append({
                        'booking_id': booking.booking_id,
                        'session_number': session_count + 1,
                        'student_id': booking.student.student_id,
                        'student_name': student_name,
                        'student_picture': student_picture,
                        'subject': booking.topic or 'General Tutoring',  # Use topic as subject since subject field has issues
                        'topic': booking.topic or '',
                        'description': booking.description or '',
                        'date': session_date.isoformat(),
                        'start_time': start_time.strftime('%H:%M'),
                        'end_time': end_time.strftime('%H:%M'),
                        'status': session_status,
                        'is_rescheduled': is_rescheduled,
                        'is_expired': is_expired,
                        'payment_type': booking.payment_type,
                        'sessions_total': booking.sessions_paid,
                        'sessions_completed': booking.sessions_completed,
                    })
                    
                    session_count += 1
                
                current_date += timedelta(days=1)
        
        return JsonResponse({
            'status': 'success',
            'sessions': sessions_data,
            'count': len(sessions_data)
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(['GET'])
def get_tutor_stats(request, tutor_id):
    """Get statistics for a tutor's tutoring sessions"""
    try:
        try:
            tutor = Tutors.objects.get(tutor_id=tutor_id)
        except Tutors.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Tutor not found'}, status=404)
        
        # Get all bookings
        all_bookings = TutoringBooking.objects.filter(tutor=tutor)
        
        # Calculate stats
        total_bookings = all_bookings.count()
        active_bookings = all_bookings.filter(status__in=['scheduled', 'active', 'confirmed']).count()
        completed_bookings = all_bookings.filter(status='completed').count()
        
        # Calculate total sessions
        total_sessions = sum(b.sessions_paid for b in all_bookings)
        completed_sessions = sum(b.sessions_completed for b in all_bookings)
        
        # Calculate average rating (if available)
        avg_rating = float(tutor.rating) if tutor.rating else 0.0
        
        return JsonResponse({
            'status': 'success',
            'stats': {
                'total_bookings': total_bookings,
                'active_bookings': active_bookings,
                'completed_bookings': completed_bookings,
                'total_sessions': total_sessions,
                'completed_sessions': completed_sessions,
                'average_rating': avg_rating,
            }
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(['GET'])
def get_tutor_by_user_id(request, user_id):
    """Get tutor ID from user ID"""
    try:
        try:
            tutor = Tutors.objects.get(user_id=user_id)
        except Tutors.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Tutor not found for this user'}, status=404)
        
        return JsonResponse({
            'status': 'success',
            'tutor': {
                'tutor_id': tutor.tutor_id,
                'user_id': tutor.user_id,
                'bio': tutor.bio,
                'expertise': tutor.expertise,
                'hourly_rate': str(tutor.hourly_rate),
                'rating': float(tutor.rating) if tutor.rating else 0.0,
            }
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
