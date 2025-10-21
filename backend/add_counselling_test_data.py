#!/usr/bin/env python
"""
Script to add test counselling data to the database.
Run with: python manage.py shell < add_counselling_test_data.py
"""

import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from apps.counsellors.models import Counsellors, CounsellingRequests, CounsellingSessions
from apps.students.models import Students

def add_test_data():
        print("Adding test counselling data...")
        
        try:
            # Get the first counsellor
            counsellor = Counsellors.objects.first()
            if not counsellor:
                print("No counsellors found in database")
                return
                
            print(f"Found counsellor: {counsellor.user.username}")
            
            # Get the first student
            student = Students.objects.first()
            if not student:
                print("No students found in database")
                return
                
            print(f"Found student: {student.user.username}")        # Create test counselling requests
        test_requests_data = [
            {
                'topic': 'Career Guidance',
                'description': 'I need help choosing the right career path after graduation. Looking for insights into different industries and job prospects.',
                'preferred_time': 'Weekdays 2-5 PM',
                'session_type': 'online',
                'urgency': 'medium',
                'status': 'pending'
            },
            {
                'topic': 'Study Strategies',
                'description': 'Struggling with time management and effective study techniques. Need personalized advice to improve academic performance.',
                'preferred_time': 'Weekends 10-12 AM',
                'session_type': 'physical', 
                'urgency': 'high',
                'status': 'pending'
            },
            {
                'topic': 'University Application',
                'description': 'Need guidance on university applications, scholarship opportunities, and choosing the right program.',
                'preferred_time': 'Any time',
                'session_type': 'online',
                'urgency': 'low',
                'status': 'scheduled'
            }
        ]
        
        # Create requests
        created_requests = []
        for req_data in test_requests_data:
            request, created = CounsellingRequests.objects.get_or_create(
                counsellor=counsellor,
                student=student,
                topic=req_data['topic'],
                defaults={
                    'description': req_data['description'],
                    'preferred_time': req_data['preferred_time'],
                    'session_type': req_data['session_type'],
                    'urgency': req_data['urgency'],
                    'status': req_data['status'],
                    'requested_date': timezone.now(),
                    'expiry_date': timezone.now() + timedelta(days=7),
                }
            )
            
            if created:
                print(f"Created counselling request: {request.topic}")
                created_requests.append(request)
            else:
                print(f"Request already exists: {request.topic}")
                created_requests.append(request)
        
        # Create a scheduled session for one of the requests
        if created_requests:
            scheduled_request = None
            for req in created_requests:
                if req.status == 'scheduled':
                    scheduled_request = req
                    break
            
            if scheduled_request:
                session, created = CounsellingSessions.objects.get_or_create(
                    counsellor=counsellor,
                    student=student,
                    request=scheduled_request,
                    defaults={
                        'session_date': timezone.now().date() + timedelta(days=2),
                        'scheduled_at': timezone.now() + timedelta(days=2, hours=2),
                        'duration_minutes': 60,
                        'session_type': scheduled_request.session_type,
                        'location': 'Campus Library, Room 301' if scheduled_request.session_type == 'physical' else None,
                        'meeting_link': 'https://meet.google.com/test-session-link' if scheduled_request.session_type == 'online' else None,
                        'status': 'scheduled',
                        'notes': 'Test session for university application guidance'
                    }
                )
                
                if created:
                    print(f"Created counselling session: {session.session_id}")
                else:
                    print(f"Session already exists: {session.session_id}")
        
        print("Test counselling data added successfully!")
        
    except Exception as e:
        print(f"Error adding test data: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    add_test_data()