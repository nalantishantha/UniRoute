from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
import random
from apps.mentoring.models import MentoringRequests, MentoringSessions, Mentors, SessionDetails
from apps.students.models import Students

class Command(BaseCommand):
    help = 'Add sample data to MentoringRequests and MentoringSessions tables'

    def handle(self, *args, **options):
        # Clear existing data
        self.stdout.write('Clearing existing mentoring data...')
        MentoringRequests.objects.all().delete()
        MentoringSessions.objects.all().delete()
        SessionDetails.objects.all().delete()

        # Get existing mentors and students
        mentors = list(Mentors.objects.all())
        students = list(Students.objects.all())

        if not mentors:
            self.stdout.write(self.style.ERROR('No mentors found. Please create mentors first.'))
            return

        if not students:
            self.stdout.write(self.style.ERROR('No students found. Please create students first.'))
            return

        self.stdout.write(f'Found {len(mentors)} mentors and {len(students)} students')

        # Sample topics for mentoring
        topics = [
            'Data Structures and Algorithms',
            'Web Development Fundamentals',
            'Machine Learning Basics',
            'Database Design',
            'Software Engineering Principles',
            'Mobile App Development',
            'Cloud Computing',
            'Cybersecurity Fundamentals',
            'Python Programming',
            'JavaScript and React',
            'System Design',
            'Career Guidance',
            'Interview Preparation',
            'Project Management',
            'Research Methodology'
        ]

        # Sample descriptions
        descriptions = [
            'I need help understanding fundamental concepts and best practices.',
            'Looking for guidance on practical implementation and real-world applications.',
            'Struggling with advanced topics and need clarification on key concepts.',
            'Preparing for upcoming assignments and exams in this subject.',
            'Want to learn industry best practices and current trends.',
            'Need help with project development and implementation strategies.',
            'Looking for career advice and skill development guidance.',
            'Seeking mentorship for professional growth and networking.',
        ]

        # Create mentoring requests
        requests_created = 0
        sessions_created = 0

        for i in range(8):  # Create 8 requests
            mentor = random.choice(mentors)
            student = random.choice(students)
            topic = random.choice(topics)
            description = random.choice(descriptions)
            
            # Random dates
            requested_date = timezone.now() - timedelta(days=random.randint(1, 30))
            
            # Calculate preferred_time as a future datetime
            days_ahead = random.randint(1, 14)
            hours_ahead = random.randint(9, 17)
            preferred_datetime = timezone.now() + timedelta(days=days_ahead, hours=hours_ahead)
            
            # Calculate expiry date (3 hours before the preferred time)
            expiry_datetime = preferred_datetime - timedelta(hours=3)
            
            # Random status with realistic distribution
            status_weights = {
                'pending': 25,
                'scheduled': 30,
                'completed': 25,
                'declined': 10,
                'expired': 10
            }
            status = random.choices(
                list(status_weights.keys()),
                weights=list(status_weights.values())
            )[0]

            request = MentoringRequests.objects.create(
                mentor=mentor,
                student=student,
                topic=topic,
                description=description,
                preferred_time=preferred_datetime.isoformat(),  # Store as ISO string
                session_type=random.choice(['online', 'physical']),
                urgency=random.choice(['low', 'medium', 'high']),
                status=status,
                requested_date=requested_date,
                expiry_date=expiry_datetime,  # 3 hours before preferred time
                decline_reason='Not available during requested time' if status == 'declined' else None
            )
            requests_created += 1

            # Create corresponding sessions for scheduled and completed requests
            if status in ['scheduled', 'completed']:
                # Create session
                scheduled_time = requested_date + timedelta(
                    days=random.randint(1, 7),
                    hours=random.randint(9, 17)
                )
                
                session = MentoringSessions.objects.create(
                    mentor=mentor,
                    topic=topic,
                    scheduled_at=scheduled_time,
                    duration_minutes=random.choice([30, 45, 60, 90]),
                    status='Scheduled' if status == 'scheduled' else 'Completed',
                    created_at=requested_date
                )
                sessions_created += 1

                # Create session details
                SessionDetails.objects.create(
                    session=session,
                    request=request,
                    location='Online Meeting Room' if request.session_type == 'online' else 'Campus Library',
                    meeting_link='https://meet.google.com/abc-def-ghi' if request.session_type == 'online' else None,
                    completion_notes='Session completed successfully. Student showed good progress.' if status == 'completed' else None
                )

        # Create some additional standalone sessions (not from requests)
        for i in range(4):  # Create 4 additional sessions
            mentor = random.choice(mentors)
            topic = random.choice(topics)
            
            scheduled_time = timezone.now() + timedelta(
                days=random.randint(1, 30),
                hours=random.randint(9, 17)
            )
            
            session = MentoringSessions.objects.create(
                mentor=mentor,
                topic=topic,
                scheduled_at=scheduled_time,
                duration_minutes=random.choice([30, 45, 60, 90]),
                status=random.choice(['Scheduled', 'Completed', 'Cancelled']),
                created_at=timezone.now() - timedelta(days=random.randint(1, 10))
            )
            sessions_created += 1

            # Create session details for standalone sessions
            SessionDetails.objects.create(
                session=session,
                request=None,  # No associated request
                location=random.choice(['Online Meeting Room', 'Campus Library', 'Study Hall']),
                meeting_link='https://meet.google.com/xyz-abc-def' if random.choice([True, False]) else None
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {requests_created} mentoring requests and {sessions_created} mentoring sessions'
            )
        )

        # Display some statistics
        total_requests = MentoringRequests.objects.count()
        total_sessions = MentoringSessions.objects.count()
        pending_requests = MentoringRequests.objects.filter(status='pending').count()
        scheduled_sessions = MentoringSessions.objects.filter(status__iexact='scheduled').count()
        completed_sessions = MentoringSessions.objects.filter(status__iexact='completed').count()

        self.stdout.write(f'\nData Summary:')
        self.stdout.write(f'Total Requests: {total_requests}')
        self.stdout.write(f'Total Sessions: {total_sessions}')
        self.stdout.write(f'Pending Requests: {pending_requests}')
        self.stdout.write(f'Scheduled Sessions: {scheduled_sessions}')
        self.stdout.write(f'Completed Sessions: {completed_sessions}')
