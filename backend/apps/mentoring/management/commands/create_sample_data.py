from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from apps.mentoring.models import MentoringSessions, MentoringRequests, SessionDetails, Mentors
from apps.students.models import Students
from apps.accounts.models import Users


class Command(BaseCommand):
    help = 'Create sample mentoring data for testing'

    def handle(self, *args, **options):
        try:
            # Get or create a mentor
            mentor = Mentors.objects.first()
            if not mentor:
                # Create a sample mentor if none exists
                user = Users.objects.first()
                if user:
                    mentor = Mentors.objects.create(
                        user=user,
                        expertise="University Admissions, Career Guidance",
                        bio="Experienced mentor helping students with university applications",
                        approved=1,
                        created_at=timezone.now()
                    )
                    self.stdout.write(f'Created mentor: {mentor.mentor_id}')
                else:
                    self.stdout.write(self.style.ERROR('No users found. Please create a user first.'))
                    return

            # Get or create students
            students = list(Students.objects.all()[:3])
            if not students:
                self.stdout.write(self.style.ERROR('No students found. Please create students first.'))
                return

            # Create sample mentoring requests
            sample_requests = [
                {
                    'mentor': mentor,
                    'student': students[0],
                    'topic': 'University Admissions Guidance',
                    'description': 'I need help with university application process and personal statement writing.',
                    'preferred_time': (timezone.now() + timedelta(days=7, hours=14)).isoformat(),  # 7 days ahead at 2 PM
                    'session_type': 'online',
                    'urgency': 'high',
                    'status': 'pending',
                    'expiry_date': timezone.now() + timedelta(days=7, hours=11)  # 3 hours before preferred time
                },
                {
                    'mentor': mentor,
                    'student': students[1] if len(students) > 1 else students[0],
                    'topic': 'Career Planning',
                    'description': 'Looking for guidance on career paths in engineering field.',
                    'preferred_time': (timezone.now() + timedelta(days=5, hours=10)).isoformat(),  # 5 days ahead at 10 AM
                    'session_type': 'physical',
                    'urgency': 'medium',
                    'status': 'pending',
                    'expiry_date': timezone.now() + timedelta(days=5, hours=7)  # 3 hours before preferred time
                },
                {
                    'mentor': mentor,
                    'student': students[2] if len(students) > 2 else students[0],
                    'topic': 'Study Strategies',
                    'description': 'Need help with time management and effective study techniques.',
                    'preferred_time': (timezone.now() + timedelta(days=3, hours=18)).isoformat(),  # 3 days ahead at 6 PM
                    'session_type': 'online',
                    'urgency': 'low',
                    'status': 'scheduled',
                    'expiry_date': timezone.now() + timedelta(days=3, hours=15)  # 3 hours before preferred time
                },
                # Two new pending requests
                {
                    'mentor': mentor,
                    'student': students[0],
                    'topic': 'Research Methods & Academic Writing',
                    'description': 'Need guidance on research methodology and academic writing for my thesis project.',
                    'preferred_time': (timezone.now() + timedelta(days=10, hours=14)).isoformat(),  # 10 days ahead at 2 PM
                    'session_type': 'online',
                    'urgency': 'medium',
                    'status': 'pending',
                    'expiry_date': timezone.now() + timedelta(days=10, hours=11)  # 3 hours before preferred time
                },
                {
                    'mentor': mentor,
                    'student': students[1] if len(students) > 1 else students[0],
                    'topic': 'Job Interview Preparation',
                    'description': 'Looking for help with mock interviews and tips for technical interviews in software development.',
                    'preferred_time': (timezone.now() + timedelta(days=4, hours=15)).isoformat(),  # 4 days ahead at 3 PM
                    'session_type': 'physical',
                    'urgency': 'high',
                    'status': 'pending',
                    'expiry_date': timezone.now() + timedelta(days=4, hours=12)  # 3 hours before preferred time
                }
            ]

            for req_data in sample_requests:
                request_obj = MentoringRequests.objects.create(**req_data)
                self.stdout.write(f'Created mentoring request: {request_obj.request_id} - {request_obj.topic}')

                # If the request is scheduled, create a corresponding session
                if req_data['status'] == 'scheduled':
                    session = MentoringSessions.objects.create(
                        mentor=mentor,
                        topic=req_data['topic'],
                        scheduled_at=timezone.now() + timedelta(days=2),
                        duration_minutes=60,
                        status='scheduled',
                        created_at=timezone.now()
                    )
                    self.stdout.write(f'Created mentoring session: {session.session_id}')

                    # Create session details
                    SessionDetails.objects.create(
                        session=session,
                        request=request_obj,
                        location='Campus Library, Room 204' if req_data['session_type'] == 'physical' else None,
                        meeting_link='https://zoom.us/j/123456789' if req_data['session_type'] == 'online' else None
                    )
                    self.stdout.write(f'Created session details for session: {session.session_id}')

            # Create some completed sessions
            completed_session = MentoringSessions.objects.create(
                mentor=mentor,
                topic='Interview Preparation',
                scheduled_at=timezone.now() - timedelta(days=1),
                duration_minutes=90,
                status='completed',
                created_at=timezone.now() - timedelta(days=2)
            )

            # Create a completed request
            past_preferred_time = timezone.now() - timedelta(days=1, hours=14)  # Yesterday at 2 PM
            completed_request = MentoringRequests.objects.create(
                mentor=mentor,
                student=students[0],
                topic='Interview Preparation',
                description='Mock interviews and feedback for university admissions.',
                preferred_time=past_preferred_time.isoformat(),
                session_type='online',
                urgency='medium',
                status='completed',
                expiry_date=past_preferred_time - timedelta(hours=3)  # 3 hours before preferred time
            )

            SessionDetails.objects.create(
                session=completed_session,
                request=completed_request,
                meeting_link='https://zoom.us/j/987654321',
                completion_notes='Great session! Student showed good improvement in interview skills.'
            )

            self.stdout.write(
                self.style.SUCCESS(
                    'Successfully created sample mentoring data!'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating sample data: {str(e)}')
            )
