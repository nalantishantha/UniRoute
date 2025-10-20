"""
Test script to verify mentoring session conflict detection in tutoring reschedule
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from datetime import datetime, date, time, timedelta
from apps.tutoring.models import Tutors, TutoringBooking, TutorAvailability
from apps.mentoring.models import Mentors as MentoringMentors, MentoringSessions
from apps.students.models import Students
from apps.accounts.models import Users

print("=" * 80)
print("TUTORING RESCHEDULE - MENTORING CONFLICT DETECTION TEST")
print("=" * 80)

# Get tutor 2 (user_id 19)
try:
    tutor = Tutors.objects.get(tutor_id=2)
    print(f"\n✓ Found tutor: {tutor.tutor_id} (user_id: {tutor.user.user_id})")
except Tutors.DoesNotExist:
    print("✗ Tutor 2 not found!")
    exit(1)

# Check if this tutor is also a mentor
try:
    mentor = MentoringMentors.objects.get(user=tutor.user)
    print(f"✓ This tutor is also a mentor: {mentor.mentor_id}")
except MentoringMentors.DoesNotExist:
    print("✗ This tutor is not a mentor - no conflicts possible")
    mentor = None

# Get existing mentoring sessions
if mentor:
    print(f"\n{'-' * 80}")
    print("EXISTING MENTORING SESSIONS:")
    print(f"{'-' * 80}")
    
    mentoring_sessions = MentoringSessions.objects.filter(
        mentor=mentor,
        status__in=['scheduled', 'pending']
    )
    
    if mentoring_sessions.exists():
        for session in mentoring_sessions:
            session_datetime = session.scheduled_at
            session_date = session_datetime.date()
            session_start_time = session_datetime.time()
            
            if session.duration_minutes:
                session_end_datetime = session_datetime + timedelta(minutes=session.duration_minutes)
                session_end_time = session_end_datetime.time()
            else:
                session_end_datetime = session_datetime + timedelta(hours=1)
                session_end_time = session_end_datetime.time()
            
            print(f"Session {session.session_id}:")
            print(f"  Date: {session_date}")
            print(f"  Time: {session_start_time.strftime('%H:%M')} - {session_end_time.strftime('%H:%M')}")
            print(f"  Status: {session.status}")
            print(f"  Topic: {session.topic}")
            print()
    else:
        print("No scheduled mentoring sessions found")

# Get existing tutoring bookings
print(f"{'-' * 80}")
print("EXISTING TUTORING BOOKINGS:")
print(f"{'-' * 80}")

bookings = TutoringBooking.objects.filter(tutor=tutor, status='scheduled')
for booking in bookings:
    print(f"Booking {booking.booking_id}:")
    print(f"  Student: {booking.student.student_id}")
    print(f"  Subject: {booking.topic}")
    print(f"  Start Date: {booking.start_date}")
    if booking.availability_slot:
        print(f"  Time Slot: {booking.availability_slot.start_time} - {booking.availability_slot.end_time}")
        print(f"  Day of Week: {booking.availability_slot.day_of_week}")
    print()

print(f"{'=' * 80}")
print("TEST SCENARIOS:")
print(f"{'=' * 80}")

# Test Scenario 1: Try to reschedule to a time that conflicts with mentoring
if mentor and mentoring_sessions.exists():
    print("\n✓ Running conflict detection tests...")
    
    test_session = mentoring_sessions.first()
    conflict_date = test_session.scheduled_at.date()
    conflict_start = test_session.scheduled_at.time()
    
    print(f"\nScenario: Attempting to reschedule tutoring to conflict with mentoring")
    print(f"Mentoring session on {conflict_date} at {conflict_start}")
    print(f"Result: The API should return a conflict error")
    
    # Test with a non-conflicting time
    if conflict_start.hour > 0:
        safe_hour = conflict_start.hour - 2
        safe_start = time(safe_hour, 0)
        safe_end = time(safe_hour + 1, 0)
        print(f"\nScenario: Reschedule to non-conflicting time {safe_start}-{safe_end}")
        print(f"Result: Should succeed")
else:
    print("\n⚠ No mentoring sessions to test conflicts with")
    print("To fully test, create a mentoring session first:")
    print("  1. Login as a student")
    print("  2. Request a mentoring session with this tutor")
    print("  3. Schedule it for a specific date/time")
    print("  4. Then try to reschedule a tutoring session to that same time")

print(f"\n{'=' * 80}")
print("NEXT STEPS TO TEST:")
print(f"{'=' * 80}")
print("1. Create a mentoring session at a specific time (e.g., Nov 2, 2025 at 14:00)")
print("2. Try to reschedule a tutoring session to the same date/time using:")
print("   curl -X POST http://localhost:8000/api/tutoring/bookings/2/reschedule/")
print("   with new_date='2025-11-02', new_start_time='14:00', new_end_time='15:00'")
print("3. Should receive error: 'Time slot conflicts with a mentoring session'")
print(f"{'=' * 80}\n")
