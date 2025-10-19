from apps.accounts.models import Users
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from apps.mentoring.models import Mentors, PreMentorApplications
from apps.university_students.models import UniversityStudents
import random


class Command(BaseCommand):
    help = "Seed mentor requests for a given university by creating Mentors linked to existing UniversityStudents and PreMentorApplications."

    def add_arguments(self, parser):
        parser.add_argument('--university-id', type=int,
                            required=True, help='University ID to seed for')
        parser.add_argument('--count', type=int, default=3,
                            help='How many mentor requests to create')
        parser.add_argument('--approve', type=int, default=0,
                            help='Number of mentors to auto-approve (become active)')

    def handle(self, *args, **options):
        uni_id = options['university_id']
        count = options['count']
        approve_n = options['approve']

        students = list(UniversityStudents.objects.select_related(
            'user').filter(university_id=uni_id))
        if not students:
            raise CommandError(
                f"No UniversityStudents found for university_id={uni_id}")

        created_preapps = 0
        approved = 0
        for i in range(count):
            stu = random.choice(students)
            mentor = Mentors.objects.create(
                user=stu.user,
                university_student=stu,
                expertise=random.choice([
                    'AI & Data Science', 'Web Development', 'Cybersecurity', 'Cloud Computing', 'Mobile Development'
                ]),
                bio='Passionate about mentoring and helping students grow.',
                approved=None,
                created_at=timezone.now(),
            )
            skills = random.sample(
                ['Python', 'React', 'Django', 'Node.js', 'AWS', 'Docker', 'SQL', 'ML'], k=3)
            PreMentorApplications.objects.create(
                mentor=mentor,
                applied=1,
                form_data={
                    'registration_number': stu.registration_number or f'REG-{mentor.mentor_id:04d}',
                    'year_of_study': stu.year_of_study or random.choice([1, 2, 3, 4]),
                    'skills': skills,
                    'phone': '+94-7' + str(random.randint(10000000, 99999999)),
                    'specialization': mentor.expertise,
                    'recommendation_from': 'Head of Department',
                    'bio': mentor.bio,
                },
            )
            created_preapps += 1

        # Approve first N pre-apps (by mentor order of creation)
        if approve_n > 0:
            apps = PreMentorApplications.objects.select_related('mentor', 'mentor__university_student').filter(
                mentor__university_student__university_id=uni_id,
                applied=1,
            ).order_by('-created_at')[:approve_n]
            for app in apps:
                m = app.mentor
                m.approved = 1
                if not m.created_at:
                    m.created_at = timezone.now()
                m.save(update_fields=['approved', 'created_at'])
                approved += 1

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {created_preapps} mentor requests for university_id={uni_id}; auto-approved {approved}."
        ))


class Command(BaseCommand):
    help = 'Seed pre-mentor applications (and some approved mentors) for a university.'

    def add_arguments(self, parser):
        parser.add_argument('--university-id', type=int,
                            required=True, help='Target university_id')
        parser.add_argument('--count', type=int, default=3,
                            help='How many requests to create')
        parser.add_argument('--approve', type=int, default=1,
                            help='How many to auto-approve into active mentors')

    def handle(self, *args, **options):
        uid = options['university_id']
        count = options['count']
        approve_n = max(0, min(options['approve'], count))

        students = list(UniversityStudents.objects.select_related(
            'user', 'university', 'degree_program').filter(university_id=uid)[:count])
        if not students:
            raise CommandError(
                'No UniversityStudents found for university_id=%s. Create some first.' % uid)

        created_apps = []
        for idx, us in enumerate(students):
            user = us.user
            # Create or get a mentor row for this student
            mentor, _ = Mentors.objects.get_or_create(
                user=user,
                defaults={
                    'university_student': us,
                    'expertise': random.choice(['Data Science', 'Web Development', 'AI/ML', 'Cybersecurity', 'Cloud']),
                    'bio': 'Passionate about mentoring and student success.',
                    'approved': 0,
                    'created_at': timezone.now(),
                }
            )
            # Link university_student if missing
            if mentor.university_student_id != us.university_student_id:
                mentor.university_student = us
                mentor.save(update_fields=['university_student'])

            # Create a pre-mentor application (applied=1)
            app = PreMentorApplications.objects.create(
                mentor=mentor,
                applied=1,
                form_data={
                    'registration_number': us.registration_number or f'R{user.user_id:04d}',
                    'year_of_study': us.year_of_study or random.randint(1, 4),
                    'skills': random.sample(['Python', 'React', 'Django', 'SQL', 'AWS', 'Docker', 'UI/UX'], k=3),
                    'phone': getattr(user, 'phone', '') or '',
                    'specialization': mentor.expertise,
                    'recommendation_from': 'Faculty Advisor',
                    'bio': mentor.bio,
                }
            )
            created_apps.append(app)

        # Optionally approve some to show up in active list
        for app in created_apps[:approve_n]:
            m = app.mentor
            m.approved = 1
            m.save(update_fields=['approved'])

        self.stdout.write(self.style.SUCCESS(
            f'Created {len(created_apps)} mentor requests for university_id={uid}, approved {approve_n}.'
        ))
