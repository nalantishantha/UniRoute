from django.core.management.base import BaseCommand
from apps.mentoring.models import Mentors
from apps.university_students.models import UniversityStudents


class Command(BaseCommand):
    help = "Backfill mentors.university_student using the UniversityStudents row with the same user when NULL."

    def handle(self, *args, **options):
        updated = 0
        skipped = 0
        qs = Mentors.objects.select_related('user').filter(university_student__isnull=True)
        for m in qs:
            if not m.user_id:
                skipped += 1
                continue
            stu = UniversityStudents.objects.filter(user_id=m.user_id).order_by('university_student_id').first()
            if not stu:
                skipped += 1
                continue
            m.university_student = stu
            m.save(update_fields=['university_student'])
            updated += 1

        self.stdout.write(self.style.SUCCESS(f"Backfilled {updated} mentors; skipped {skipped}"))
