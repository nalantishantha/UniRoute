from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction, connection
from django.utils import timezone
import json
from .models import Tutors, TutoringSessions, TutorSubjects, TutorRatings, TutorFeedback, TutorAvailability, TutoringBooking
from .serializers import serialize_tutor_availability, serialize_tutoring_booking, serialize_tutor_detail
from apps.accounts.models import Users, UserDetails
from apps.students.models import Students
from apps.payments.models import TutoringPayments
from django.views.decorators.http import require_http_methods
from django.utils.dateparse import parse_datetime, parse_date
from datetime import datetime, timedelta, date
from decimal import Decimal


@csrf_exempt
def get_tutors_list(request):
    """Get list of all tutors with their details from the database"""
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                query = """
                    SELECT 
                        t.tutor_id,
                        t.user_id,
                        t.university_student_id,
                        t.bio,
                        t.expertise,
                        t.rating,
                        t.created_at,
                        u.username,
                        u.email,
                        ud.full_name,
                        ud.profile_picture,
                        ud.contact_number,
                        ud.location,
                        ud.gender
                    FROM tutors t
                    INNER JOIN users u ON t.user_id = u.user_id
                    LEFT JOIN user_details ud ON u.user_id = ud.user_id
                    WHERE u.is_active = 1
                    ORDER BY t.rating DESC, t.created_at DESC
                """
                cursor.execute(query)
                results = cursor.fetchall()
                
                tutors_data = []
                for row in results:
                    tutor_data = {
                        'tutor_id': row[0],
                        'user_id': row[1],
                        'university_student_id': row[2],
                        'bio': row[3] or '',
                        'expertise': row[4] or '',
                        'rating': float(row[5]) if row[5] else 0.0,
                        'created_at': row[6].isoformat() if row[6] else None,
                        'username': row[7],
                        'email': row[8],
                        'full_name': row[9] or row[7],  # Use username as fallback
                        'profile_picture': row[10] or '',
                        'contact_number': row[11] or '',
                        'location': row[12] or '',
                        'gender': row[13] or '',
                        # Additional computed fields
                        'years_experience': 2,  # You can calculate this based on created_at
                        'hourly_rate': 'Rs. 2000-3000',  # You might want to add this to tutors table
                        'availability': 'Available',  # You might want to add this to tutors table
                    }
                    tutors_data.append(tutor_data)
                
                return JsonResponse({
                    'success': True,
                    'tutors': tutors_data,
                    'count': len(tutors_data)
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


@csrf_exempt
def get_available_slots(request, tutor_id):
    """Return a list of available slots for the tutor. This is a lightweight implementation
    intended to provide parity with the mentoring API used by the frontend.
    """
    if request.method != 'GET':
        return JsonResponse({'status': 'error', 'message': 'Only GET allowed'}, status=405)

    try:
        # Simple availability: next 7 days, 3 slots per day (10:00, 14:00, 18:00)
        slots = []
        now = datetime.utcnow()
        for d in range(0, 7):
            day = now + timedelta(days=d)
            date_str = day.date().isoformat()
            for h in (10, 14, 18):
                dt = datetime(day.year, day.month, day.day, h, 0)
                # Do not include past slots
                if dt < now:
                    continue
                slots.append({
                    'date': date_str,
                    'start_time': dt.time().isoformat(),
                    'datetime': dt.isoformat() + 'Z',
                    'formatted_time': dt.strftime('%I:%M %p'),
                })

        return JsonResponse({'status': 'success', 'available_slots': slots})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def create_tutoring_request(request, tutor_id):
    """Create a tutoring request (mirrors mentoring request flow).
    Expects JSON: { student_id, topic, scheduled_at, session_type, description }
    If valid, create a TutoringSessions record with status 'pending' and return request id.
    """
    try:
        data = json.loads(request.body)

        required_fields = ['topic', 'scheduled_at']
        for f in required_fields:
            if f not in data:
                return JsonResponse({'status': 'error', 'message': f'{f} is required'}, status=400)

        # Validate tutor
        try:
            tutor = Tutors.objects.get(tutor_id=tutor_id)
        except Tutors.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Tutor not found'}, status=404)

        # Validate student
        student_id = data.get('student_id')
        if not student_id:
            return JsonResponse({'status': 'error', 'message': 'Student ID is required'}, status=400)
        try:
            student = Students.objects.get(student_id=student_id)
        except Students.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Student not found'}, status=404)

        # Parse datetime
        try:
            scheduled_at = parse_datetime(data['scheduled_at'])
            if scheduled_at is None:
                # try basic iso
                scheduled_at = datetime.fromisoformat(data['scheduled_at'].replace('Z', '+00:00'))
        except Exception:
            return JsonResponse({'status': 'error', 'message': 'Invalid datetime format'}, status=400)

        # Try to pick a subject (optional)
        subject = None
        subject_id = data.get('subject_id')
        if subject_id:
            try:
                from apps.student_results.models import AlSubjects
                subject = AlSubjects.objects.get(subject_id=subject_id)
            except Exception:
                subject = None

        # Create tutoring session with status 'pending' so tutor can accept/confirm
        session = TutoringSessions.objects.create(
            tutor=tutor,
            subject=subject if subject is not None else None,
            scheduled_at=scheduled_at,
            duration_minutes=data.get('duration_minutes', 60),
            status='pending',
            description=data.get('description', ''),
            created_at=timezone.now()
        )

        return JsonResponse({'status': 'success', 'message': 'Tutoring request created', 'session_id': session.session_id})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============================================================================
# TUTOR AVAILABILITY MANAGEMENT - Recurring Slots
# ============================================================================

@csrf_exempt
def manage_tutor_availability(request, tutor_id):
    """
    GET: Get all availability slots for a tutor
    POST: Create a new availability slot
    PUT: Update an existing availability slot
    DELETE: Delete an availability slot
    """
    try:
        tutor = Tutors.objects.get(tutor_id=tutor_id)
    except Tutors.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Tutor not found'}, status=404)

    if request.method == 'GET':
        try:
            availability = TutorAvailability.objects.filter(tutor=tutor)
            availability_data = [serialize_tutor_availability(slot) for slot in availability]
            return JsonResponse({
                'status': 'success',
                'availability': availability_data
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    elif request.method == 'POST':
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
            
            # Validate day_of_week
            if data['day_of_week'] < 0 or data['day_of_week'] > 6:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Day of week must be between 0 (Sunday) and 6 (Saturday)'
                }, status=400)
            
            # Validate times
            from datetime import time
            try:
                start_time = time.fromisoformat(data['start_time'])
                end_time = time.fromisoformat(data['end_time'])
                if start_time >= end_time:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'End time must be after start time'
                    }, status=400)
            except ValueError:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid time format. Use HH:MM format'
                }, status=400)
            
            # Create availability
            from apps.student_results.models import AlSubjects
            subject = None
            if data.get('subject'):
                try:
                    subject = AlSubjects.objects.get(subject_id=data['subject'])
                except AlSubjects.DoesNotExist:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Subject not found'
                    }, status=404)
            
            availability = TutorAvailability.objects.create(
                tutor=tutor,
                day_of_week=data['day_of_week'],
                start_time=start_time,
                end_time=end_time,
                is_recurring=data.get('is_recurring', True),
                max_students=data.get('max_students', 1),
                subject=subject,
                is_active=data.get('is_active', True)
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability slot created successfully',
                'availability': serialize_tutor_availability(availability)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            availability_id = data.get('availability_id')
            
            if not availability_id:
                return JsonResponse({'status': 'error', 'message': 'availability_id is required'}, status=400)
            
            try:
                availability = TutorAvailability.objects.get(
                    availability_id=availability_id,
                    tutor=tutor
                )
            except TutorAvailability.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Availability slot not found'}, status=404)
            
            # Update fields if provided
            if 'day_of_week' in data:
                if data['day_of_week'] < 0 or data['day_of_week'] > 6:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Day of week must be between 0 (Sunday) and 6 (Saturday)'
                    }, status=400)
                availability.day_of_week = data['day_of_week']
            
            if 'start_time' in data or 'end_time' in data:
                from datetime import time
                try:
                    if 'start_time' in data:
                        start_time = time.fromisoformat(data['start_time'])
                        availability.start_time = start_time
                    if 'end_time' in data:
                        end_time = time.fromisoformat(data['end_time'])
                        availability.end_time = end_time
                    
                    if availability.start_time >= availability.end_time:
                        return JsonResponse({
                            'status': 'error',
                            'message': 'End time must be after start time'
                        }, status=400)
                except ValueError:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Invalid time format. Use HH:MM format'
                    }, status=400)
            
            if 'is_recurring' in data:
                availability.is_recurring = data['is_recurring']
            if 'max_students' in data:
                availability.max_students = data['max_students']
            if 'is_active' in data:
                availability.is_active = data['is_active']
            
            if 'subject' in data:
                if data['subject']:
                    from apps.student_results.models import AlSubjects
                    try:
                        availability.subject = AlSubjects.objects.get(subject_id=data['subject'])
                    except AlSubjects.DoesNotExist:
                        return JsonResponse({
                            'status': 'error',
                            'message': 'Subject not found'
                        }, status=404)
                else:
                    availability.subject = None
            
            availability.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability slot updated successfully',
                'availability': serialize_tutor_availability(availability)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    elif request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            availability_id = data.get('availability_id')
            
            if not availability_id:
                return JsonResponse({'status': 'error', 'message': 'availability_id is required'}, status=400)
            
            try:
                availability = TutorAvailability.objects.get(
                    availability_id=availability_id,
                    tutor=tutor
                )
            except TutorAvailability.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Availability slot not found'}, status=404)
            
            # Check if there are active bookings
            active_bookings = TutoringBooking.objects.filter(
                availability_slot=availability,
                status__in=['confirmed', 'active']
            ).count()
            
            if active_bookings > 0:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Cannot delete slot with {active_bookings} active booking(s). Please cancel bookings first.'
                }, status=400)
            
            availability.delete()
            return JsonResponse({
                'status': 'success',
                'message': 'Availability slot deleted successfully'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(['GET'])
def get_available_tutors(request):
    """
    Get list of tutors with their recurring availability slots
    Optionally filter by subject
    """
    try:
        subject_id = request.GET.get('subject_id')
        day_of_week = request.GET.get('day_of_week')
        
        # Start with all tutors
        tutors = Tutors.objects.filter(user__is_active=True)
        
        # Filter by subject if provided
        if subject_id:
            tutor_ids = TutorSubjects.objects.filter(
                subject_id=subject_id
            ).values_list('tutor_id', flat=True)
            tutors = tutors.filter(tutor_id__in=tutor_ids)
        
        # Filter by day if provided
        if day_of_week is not None:
            tutor_ids_with_availability = TutorAvailability.objects.filter(
                day_of_week=int(day_of_week),
                is_active=True
            ).values_list('tutor_id', flat=True)
            tutors = tutors.filter(tutor_id__in=tutor_ids_with_availability)
        
        tutors_data = [serialize_tutor_detail(tutor) for tutor in tutors]
        
        return JsonResponse({
            'status': 'success',
            'tutors': tutors_data,
            'count': tutors.count()
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def get_tutor_available_slots(request, tutor_id):
    """
    Get available recurring slots for a specific tutor
    Optionally filter by subject
    """
    try:
        tutor = Tutors.objects.get(tutor_id=tutor_id)
    except Tutors.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Tutor not found'}, status=404)
    
    try:
        subject_id = request.GET.get('subject_id')
        
        filters = {'tutor': tutor, 'is_active': True}
        if subject_id:
            filters['subject_id'] = subject_id
        
        availability = TutorAvailability.objects.filter(**filters)
        
        # Check booking capacity for each slot
        slots_with_capacity = []
        for slot in availability:
            active_bookings = TutoringBooking.objects.filter(
                availability_slot=slot,
                status__in=['confirmed', 'active']
            ).count()
            
            if active_bookings < slot.max_students:
                slot_data = serialize_tutor_availability(slot)
                slot_data['available_spots'] = slot.max_students - active_bookings
                slot_data['total_spots'] = slot.max_students
                slots_with_capacity.append(slot_data)
        
        return JsonResponse({
            'status': 'success',
            'available_slots': slots_with_capacity
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============================================================================
# TUTORING BOOKING MANAGEMENT - Recurring Bookings
# ============================================================================

@csrf_exempt
@require_http_methods(['POST'])
def create_tutoring_booking(request):
    """
    Create a recurring tutoring booking
    Requires payment before confirmation
    """
    try:
        data = json.loads(request.body)
        
        # Required fields
        required_fields = ['student_id', 'tutor_id', 'availability_slot_id', 'start_date', 'payment_type']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'status': 'error', 'message': f'{field} is required'}, status=400)
        
        # Validate student
        try:
            student = Students.objects.get(student_id=data['student_id'])
        except Students.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Student not found'}, status=404)
        
        # Validate tutor
        try:
            tutor = Tutors.objects.get(tutor_id=data['tutor_id'])
        except Tutors.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Tutor not found'}, status=404)
        
        # Validate availability slot
        try:
            availability_slot = TutorAvailability.objects.get(
                availability_id=data['availability_slot_id'],
                tutor=tutor,
                is_active=True
            )
        except TutorAvailability.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Availability slot not found or inactive'}, status=404)
        
        # Check if slot is full
        active_bookings = TutoringBooking.objects.filter(
            availability_slot=availability_slot,
            status__in=['confirmed', 'active']
        ).count()
        
        if active_bookings >= availability_slot.max_students:
            return JsonResponse({'status': 'error', 'message': 'This time slot is fully booked'}, status=400)
        
        # Check if student already has a booking in this slot
        existing_booking = TutoringBooking.objects.filter(
            student=student,
            availability_slot=availability_slot,
            status__in=['pending', 'confirmed', 'active']
        ).first()
        
        if existing_booking:
            return JsonResponse({
                'status': 'error',
                'message': 'You already have a booking in this time slot'
            }, status=400)
        
        # Parse dates
        try:
            start_date = parse_date(data['start_date'])
        except Exception:
            return JsonResponse({'status': 'error', 'message': 'Invalid start_date format'}, status=400)
        
        end_date = None
        if data.get('end_date'):
            try:
                end_date = parse_date(data['end_date'])
            except Exception:
                return JsonResponse({'status': 'error', 'message': 'Invalid end_date format'}, status=400)
        
        # Calculate sessions paid based on payment type
        payment_type = data['payment_type']
        sessions_paid = 1
        if payment_type == 'monthly':
            sessions_paid = 4  # 4 weeks
        elif payment_type == 'term':
            sessions_paid = 12  # 12 weeks (3 months)
        
        # Create booking with pending status (awaiting payment)
        with transaction.atomic():
            booking_data = {
                'student': student,
                'tutor': tutor,
                'availability_slot': availability_slot,
                'subject': availability_slot.subject,
                'is_recurring': data.get('is_recurring', True),
                'start_date': start_date,
                'end_date': end_date,
                'status': 'pending',
                'topic': data.get('topic', ''),
                'description': data.get('description', ''),
                'payment_type': payment_type,
                'sessions_paid': sessions_paid,
                'sessions_completed': 0
            }
            
            booking = TutoringBooking.objects.create(**booking_data)
            
            # Calculate payment amount using tutor's hourly rate
            base_rate = booking.tutor.hourly_rate  # Dynamic rate from tutor profile
            
            if payment_type == 'monthly':
                amount = base_rate * 4 * Decimal('0.95')  # 5% discount
            elif payment_type == 'term':
                amount = base_rate * 12 * Decimal('0.90')  # 10% discount
            else:
                amount = base_rate
            
            booking_serialized = serialize_tutoring_booking(booking)
            
            return JsonResponse({
                'status': 'success',
                'message': 'Booking created successfully. Please complete payment to confirm.',
                'booking': booking_serialized,
                'payment_required': {
                    'amount': float(amount),
                    'currency': 'LKR',
                    'sessions': sessions_paid,
                    'payment_type': payment_type
                }
            })
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def confirm_tutoring_booking_payment(request, booking_id):
    """
    Confirm payment and activate the tutoring booking
    """
    try:
        data = json.loads(request.body)
        
        try:
            booking = TutoringBooking.objects.get(booking_id=booking_id)
        except TutoringBooking.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
        
        if booking.status != 'pending':
            return JsonResponse({
                'status': 'error',
                'message': f'Booking is already {booking.status}'
            }, status=400)
        
        # Validate payment data
        required_payment_fields = ['amount', 'payment_method']
        for field in required_payment_fields:
            if field not in data:
                return JsonResponse({'status': 'error', 'message': f'{field} is required'}, status=400)
        
        with transaction.atomic():
            # Create payment record
            payment_data = {
                'student': booking.student,
                'booking': booking,
                'amount': Decimal(str(data['amount'])),
                'payment_method': data['payment_method'],
                'paid_at': timezone.now(),
                'created_at': timezone.now()
            }
            
            # Add optional card payment details if provided
            if data.get('card_type'):
                payment_data['card_type'] = data['card_type']
            if data.get('card_holder_name'):
                payment_data['card_holder_name'] = data['card_holder_name']
            if data.get('card_last_four'):
                payment_data['card_last_four'] = data['card_last_four']
            if data.get('transaction_id'):
                payment_data['transaction_id'] = data['transaction_id']
            
            payment = TutoringPayments.objects.create(**payment_data)
            
            # Update booking status to confirmed
            booking.status = 'confirmed'
            booking.save()
            
            booking_serialized = serialize_tutoring_booking(booking)
            
            return JsonResponse({
                'status': 'success',
                'message': 'Payment confirmed! Your recurring tutoring session is now active.',
                'booking': booking_serialized,
                'payment_id': payment.payment_id
            })
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def get_student_bookings(request, student_id):
    """Get all bookings for a student"""
    try:
        student = Students.objects.get(student_id=student_id)
    except Students.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Student not found'}, status=404)
    
    try:
        status_filter = request.GET.get('status')
        
        filters = {'student': student}
        if status_filter:
            filters['status'] = status_filter
        
        bookings = TutoringBooking.objects.filter(**filters)
        bookings_data = [serialize_tutoring_booking(booking) for booking in bookings]
        
        return JsonResponse({
            'status': 'success',
            'bookings': bookings_data,
            'count': bookings.count()
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def get_tutor_bookings(request, tutor_id):
    """Get all bookings for a tutor"""
    try:
        tutor = Tutors.objects.get(tutor_id=tutor_id)
    except Tutors.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Tutor not found'}, status=404)
    
    try:
        status_filter = request.GET.get('status')
        
        filters = {'tutor': tutor}
        if status_filter:
            filters['status'] = status_filter
        
        bookings = TutoringBooking.objects.filter(**filters)
        bookings_data = [serialize_tutoring_booking(booking) for booking in bookings]
        
        return JsonResponse({
            'status': 'success',
            'bookings': bookings_data,
            'count': bookings.count()
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def cancel_tutoring_booking(request, booking_id):
    """Cancel a tutoring booking"""
    try:
        data = json.loads(request.body)
        
        try:
            booking = TutoringBooking.objects.get(booking_id=booking_id)
        except TutoringBooking.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Booking not found'}, status=404)
        
        if booking.status == 'cancelled':
            return JsonResponse({'status': 'error', 'message': 'Booking is already cancelled'}, status=400)
        
        if booking.status == 'completed':
            return JsonResponse({'status': 'error', 'message': 'Cannot cancel completed booking'}, status=400)
        
        booking.status = 'cancelled'
        booking.save()
        
        booking_serialized = serialize_tutoring_booking(booking)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Booking cancelled successfully',
            'booking': booking_serialized
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
