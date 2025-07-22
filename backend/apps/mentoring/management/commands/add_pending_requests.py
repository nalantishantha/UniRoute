from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.mentoring.models import MentoringRequests, Mentors
from apps.students.models import Students


class Command(BaseCommand):
    help = 'Add pending mentoring requests for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=2,
            help='Number of pending requests to create'
        )

    def handle(self, *args, **options):
        try:
            # Get mentor and students
            mentor = Mentors.objects.first()
            if not mentor:
                self.stdout.write(self.style.ERROR('No mentors found. Please create a mentor first.'))
                return

            students = list(Students.objects.all())
            if not students:
                self.stdout.write(self.style.ERROR('No students found. Please create students first.'))
                return

            count = options['count']
            
            # Sample pending requests
            sample_requests = [
                {
                    'topic': 'Research Methods & Academic Writing',
                    'description': 'Need guidance on research methodology and academic writing for my thesis project.',
                    'preferred_time': 'Weekdays 1-3 PM',
                    'session_type': 'online',
                    'urgency': 'medium',
                },
                {
                    'topic': 'Job Interview Preparation',
                    'description': 'Looking for help with mock interviews and tips for technical interviews in software development.',
                    'preferred_time': 'Weekends 2-5 PM',
                    'session_type': 'physical',
                    'urgency': 'high',
                },
                {
                    'topic': 'Graduate School Applications',
                    'description': 'Need assistance with graduate school application essays and recommendation letters.',
                    'preferred_time': 'Weekdays 4-6 PM',
                    'session_type': 'online',
                    'urgency': 'medium',
                },
                {
                    'topic': 'Networking & Professional Development',
                    'description': 'Want to learn about professional networking and building industry connections.',
                    'preferred_time': 'Weekends 10 AM-12 PM',
                    'session_type': 'physical',
                    'urgency': 'low',
                },
                {
                    'topic': 'Scholarship Applications',
                    'description': 'Need help with scholarship essays and application strategies.',
                    'preferred_time': 'Weekdays 3-5 PM',
                    'session_type': 'online',
                    'urgency': 'high',
                }
            ]

            created_count = 0
            for i in range(count):
                if i < len(sample_requests):
                    request_data = sample_requests[i]
                    student = students[i % len(students)]  # Rotate through available students
                    
                    request_obj = MentoringRequests.objects.create(
                        mentor=mentor,
                        student=student,
                        topic=request_data['topic'],
                        description=request_data['description'],
                        preferred_time=request_data['preferred_time'],
                        session_type=request_data['session_type'],
                        urgency=request_data['urgency'],
                        status='pending',
                        expiry_date=timezone.now() + timedelta(days=7)
                    )
                    
                    self.stdout.write(f'Created pending request {created_count + 1}: {request_obj.topic}')
                    created_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created {created_count} pending mentoring requests!'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating pending requests: {str(e)}')
            )
