from django.core.management.base import BaseCommand
from apps.mentoring.models import Mentors
from apps.pre_mentors.models import PreMentors

class Command(BaseCommand):
    help = 'Test mentor approval process and pre-mentor removal'

    def add_arguments(self, parser):
        parser.add_argument('--mentor-id', type=int, help='Mentor ID to approve')
        parser.add_argument('--user-id', type=int, help='User ID to check')

    def handle(self, *args, **options):
        mentor_id = options.get('mentor_id')
        user_id = options.get('user_id')

        if mentor_id:
            try:
                mentor = Mentors.objects.get(mentor_id=mentor_id)
                self.stdout.write(f"Found mentor: {mentor.mentor_id}")
                self.stdout.write(f"Current approval status: {mentor.approved}")
                
                if mentor.approved == 0:
                    self.stdout.write("Approving mentor...")
                    mentor.approved = 1
                    mentor.save()
                    self.stdout.write(self.style.SUCCESS(f"Mentor {mentor.mentor_id} approved successfully!"))
                else:
                    self.stdout.write("Mentor is already approved")
                    
            except Mentors.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Mentor with ID {mentor_id} not found"))

        if user_id:
            try:
                # Check pre-mentor
                pre_mentor = PreMentors.objects.filter(user_id=user_id).first()
                if pre_mentor:
                    self.stdout.write(f"Pre-mentor found: ID {pre_mentor.pre_mentor_id}")
                else:
                    self.stdout.write("No pre-mentor found for this user")
                
                # Check mentor
                mentor = Mentors.objects.filter(user_id=user_id).first()
                if mentor:
                    self.stdout.write(f"Mentor found: ID {mentor.mentor_id}, Approved: {mentor.approved}")
                else:
                    self.stdout.write("No mentor found for this user")
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
        
        if not mentor_id and not user_id:
            self.stdout.write("Please provide --mentor-id or --user-id")
            
            # List all mentors
            mentors = Mentors.objects.all()
            self.stdout.write(f"\nAll mentors:")
            for mentor in mentors:
                self.stdout.write(f"  Mentor ID: {mentor.mentor_id}, User ID: {mentor.user_id}, Approved: {mentor.approved}")
            
            # List all pre-mentors
            pre_mentors = PreMentors.objects.all()
            self.stdout.write(f"\nAll pre-mentors:")
            for pm in pre_mentors:
                self.stdout.write(f"  Pre-mentor ID: {pm.pre_mentor_id}, User ID: {pm.user_id}")