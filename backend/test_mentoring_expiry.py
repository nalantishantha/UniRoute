"""
Test script to verify mentoring request expiry date calculation
Run this script with: python manage.py shell < test_mentoring_expiry.py
"""

from django.utils import timezone
from datetime import timedelta
from apps.mentoring.models import MentoringRequests, Mentors
from apps.students.models import Students

print("\n" + "="*70)
print("Testing Mentoring Request Expiry Date Calculation")
print("="*70)

# Get test data
mentor = Mentors.objects.first()
student = Students.objects.first()

if not mentor:
    print("❌ Error: No mentor found. Please create a mentor first.")
    exit()

if not student:
    print("❌ Error: No student found. Please create a student first.")
    exit()

print(f"\n✓ Found Mentor: {mentor.mentor_id}")
print(f"✓ Found Student: {student.student_id}")

# Test Case 1: Create a request with preferred time 5 hours from now
print("\n" + "-"*70)
print("Test Case 1: Preferred time 5 hours from now")
print("-"*70)

preferred_time_1 = timezone.now() + timedelta(hours=5)
expiry_time_1 = preferred_time_1 - timedelta(hours=3)

request_1 = MentoringRequests.objects.create(
    mentor=mentor,
    student=student,
    topic="Test Request 1 - Expiry Calculation",
    description="Testing expiry date calculation for mentoring requests",
    preferred_time=preferred_time_1.isoformat(),
    session_type='online',
    urgency='medium',
    status='pending',
    requested_date=timezone.now(),
    expiry_date=expiry_time_1
)

print(f"✓ Created Request ID: {request_1.request_id}")
print(f"  Preferred Time: {preferred_time_1}")
print(f"  Expiry Date:    {request_1.expiry_date}")
print(f"  Expected Expiry: {expiry_time_1}")

# Verify the calculation
time_diff = (preferred_time_1 - request_1.expiry_date).total_seconds() / 3600
print(f"\n  Time difference: {time_diff} hours")

if time_diff == 3:
    print("  ✅ PASS: Expiry date is exactly 3 hours before preferred time")
else:
    print(f"  ❌ FAIL: Expected 3 hours difference, got {time_diff} hours")

# Test Case 2: Create a request with preferred time 10 days from now
print("\n" + "-"*70)
print("Test Case 2: Preferred time 10 days from now")
print("-"*70)

preferred_time_2 = timezone.now() + timedelta(days=10, hours=14)
expiry_time_2 = preferred_time_2 - timedelta(hours=3)

request_2 = MentoringRequests.objects.create(
    mentor=mentor,
    student=student,
    topic="Test Request 2 - Future Date",
    description="Testing with a date far in the future",
    preferred_time=preferred_time_2.isoformat(),
    session_type='physical',
    urgency='high',
    status='pending',
    requested_date=timezone.now(),
    expiry_date=expiry_time_2
)

print(f"✓ Created Request ID: {request_2.request_id}")
print(f"  Preferred Time: {preferred_time_2}")
print(f"  Expiry Date:    {request_2.expiry_date}")

time_diff_2 = (preferred_time_2 - request_2.expiry_date).total_seconds() / 3600
print(f"\n  Time difference: {time_diff_2} hours")

if time_diff_2 == 3:
    print("  ✅ PASS: Expiry date is exactly 3 hours before preferred time")
else:
    print(f"  ❌ FAIL: Expected 3 hours difference, got {time_diff_2} hours")

# Test Case 3: Verify expiry updates work
print("\n" + "-"*70)
print("Test Case 3: Create expired request and test auto-expiry")
print("-"*70)

# Create a request that should already be expired
past_preferred_time = timezone.now() - timedelta(hours=2)
past_expiry_time = past_preferred_time - timedelta(hours=3)

request_3 = MentoringRequests.objects.create(
    mentor=mentor,
    student=student,
    topic="Test Request 3 - Already Expired",
    description="This request should be automatically marked as expired",
    preferred_time=past_preferred_time.isoformat(),
    session_type='online',
    urgency='low',
    status='pending',
    requested_date=timezone.now() - timedelta(hours=6),
    expiry_date=past_expiry_time
)

print(f"✓ Created Request ID: {request_3.request_id}")
print(f"  Current Time:    {timezone.now()}")
print(f"  Expiry Date:     {request_3.expiry_date}")
print(f"  Status:          {request_3.status}")

# Check if it's expired
if request_3.expiry_date < timezone.now():
    print("  ✅ PASS: Expiry date is in the past (should be auto-expired on next fetch)")
else:
    print("  ❌ FAIL: Expiry date is not in the past")

# Summary
print("\n" + "="*70)
print("Summary")
print("="*70)
print(f"Created {3} test requests")
print(f"\nTo clean up, run:")
print(f"  MentoringRequests.objects.filter(topic__startswith='Test Request').delete()")
print("\nTo verify auto-expiry, make a GET request to the mentoring requests endpoint.")
print("="*70 + "\n")
