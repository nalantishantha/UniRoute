# Serializer utility functions for tutoring app
# Using plain Python dictionaries instead of DRF serializers for consistency with existing codebase

from .models import TutorAvailability, TutoringBooking, Tutors
from apps.accounts.models import UserDetails


def serialize_tutor_availability(availability_obj):
    """Convert TutorAvailability model instance to dictionary"""
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    # Get tutor name
    try:
        user_details = UserDetails.objects.get(user=availability_obj.tutor.user)
        tutor_name = user_details.full_name or availability_obj.tutor.user.username
    except UserDetails.DoesNotExist:
        tutor_name = availability_obj.tutor.user.username
    
    # Count current bookings
    current_bookings = availability_obj.bookings.filter(status__in=['confirmed', 'active']).count()
    
    return {
        'availability_id': availability_obj.availability_id,
        'tutor': availability_obj.tutor.tutor_id,
        'day_of_week': availability_obj.day_of_week,
        'day_name': days[availability_obj.day_of_week],
        'start_time': availability_obj.start_time.strftime('%H:%M'),
        'end_time': availability_obj.end_time.strftime('%H:%M'),
        'is_recurring': availability_obj.is_recurring,
        'max_students': availability_obj.max_students,
        'subject': availability_obj.subject.subject_id if availability_obj.subject else None,
        'subject_name': availability_obj.subject.subject_name if availability_obj.subject else None,
        'is_active': availability_obj.is_active,
        'tutor_name': tutor_name,
        'current_bookings': current_bookings,
        'created_at': availability_obj.created_at.isoformat() if availability_obj.created_at else None,
        'updated_at': availability_obj.updated_at.isoformat() if availability_obj.updated_at else None
    }


def serialize_tutoring_booking(booking_obj):
    """Convert TutoringBooking model instance to dictionary"""
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    # Get student name
    try:
        user_details = UserDetails.objects.get(user=booking_obj.student.user)
        student_name = user_details.full_name or booking_obj.student.user.username
    except UserDetails.DoesNotExist:
        student_name = booking_obj.student.user.username
    
    # Get tutor name
    try:
        user_details = UserDetails.objects.get(user=booking_obj.tutor.user)
        tutor_name = user_details.full_name or booking_obj.tutor.user.username
    except UserDetails.DoesNotExist:
        tutor_name = booking_obj.tutor.user.username
    
    return {
        'booking_id': booking_obj.booking_id,
        'student': booking_obj.student.student_id,
        'tutor': booking_obj.tutor.tutor_id,
        'availability_slot': booking_obj.availability_slot.availability_id,
        'subject': booking_obj.subject.subject_id if booking_obj.subject else None,
        'subject_name': booking_obj.subject.subject_name if booking_obj.subject else None,
        'is_recurring': booking_obj.is_recurring,
        'start_date': booking_obj.start_date.isoformat(),
        'end_date': booking_obj.end_date.isoformat() if booking_obj.end_date else None,
        'status': booking_obj.status,
        'topic': booking_obj.topic,
        'description': booking_obj.description,
        'payment_type': booking_obj.payment_type,
        'sessions_paid': booking_obj.sessions_paid,
        'sessions_completed': booking_obj.sessions_completed,
        'student_name': student_name,
        'tutor_name': tutor_name,
        'day_of_week': days[booking_obj.availability_slot.day_of_week],
        'time_slot': f"{booking_obj.availability_slot.start_time.strftime('%H:%M')} - {booking_obj.availability_slot.end_time.strftime('%H:%M')}",
        'created_at': booking_obj.created_at.isoformat() if booking_obj.created_at else None,
        'updated_at': booking_obj.updated_at.isoformat() if booking_obj.updated_at else None
    }


def serialize_tutor_detail(tutor_obj):
    """Convert Tutors model instance to dictionary with details"""
    from .models import TutorSubjects
    
    # Get user name
    try:
        user_details = UserDetails.objects.get(user=tutor_obj.user)
        user_name = user_details.full_name or tutor_obj.user.username
        profile_picture = user_details.profile_picture if user_details.profile_picture else None
    except UserDetails.DoesNotExist:
        user_name = tutor_obj.user.username
        profile_picture = None
    
    # Get subjects
    tutor_subjects = TutorSubjects.objects.filter(tutor=tutor_obj)
    subjects = [
        {
            'subject_id': ts.subject.subject_id,
            'subject_name': ts.subject.subject_name,
            'level': ts.level
        }
        for ts in tutor_subjects
    ]
    
    # Get available slots
    availability = TutorAvailability.objects.filter(tutor=tutor_obj, is_active=True)
    available_slots = [serialize_tutor_availability(slot) for slot in availability]
    
    return {
        'tutor_id': tutor_obj.tutor_id,
        'user': tutor_obj.user.user_id,
        'user_name': user_name,
        'email': tutor_obj.user.email,
        'profile_picture': profile_picture,
        'bio': tutor_obj.bio,
        'expertise': tutor_obj.expertise,
        'rating': float(tutor_obj.rating) if tutor_obj.rating else None,
        'subjects': subjects,
        'available_slots': available_slots,
        'created_at': tutor_obj.created_at.isoformat() if tutor_obj.created_at else None
    }
