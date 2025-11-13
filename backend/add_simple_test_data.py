import os
import sys
import django
from datetime import datetime, timedelta

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.utils import timezone
from apps.counsellors.models import Counsellors, CounsellingRequests
from apps.students.models import Students

print("Adding test counselling data...")

# Get the first counsellor
counsellor = Counsellors.objects.first()
if not counsellor:
    print("No counsellors found in database")
    exit()
    
print(f"Found counsellor: {counsellor.user.username}")

# Get the first student
student = Students.objects.first() 
if not student:
    print("No students found in database")
    exit()
    
print(f"Found student: {student.user.username}")

# Create test counselling request
request, created = CounsellingRequests.objects.get_or_create(
    counsellor=counsellor,
    student=student,
    topic='Career Guidance',
    defaults={
        'description': 'I need help choosing the right career path after graduation.',
        'preferred_time': 'Weekdays 2-5 PM',
        'session_type': 'online',
        'urgency': 'medium',
        'status': 'pending',
        'requested_date': timezone.now(),
        'expiry_date': timezone.now() + timedelta(days=7),
    }
)

if created:
    print(f"Created counselling request: {request.topic}")
else:
    print(f"Request already exists: {request.topic}")

print("Test counselling data added successfully!")