from django.core.management.base import BaseCommand
import string

from apps.universities.models import Universities, Faculties
from apps.university_programs.models import DegreePrograms


def normalize_title(s):
    if not s:
        return s
    try:
        return string.capwords(s.strip().lower())
    except Exception:
        return s


def sentence_case(s):
    if not s:
        return s
    s = s.strip()
    if len(s) == 0:
        return s
    return s[0].upper() + s[1:].lower()


class Command(BaseCommand):
    help = 'Normalize text fields for universities, faculties, and degree programs (title/sentence case)'

    def handle(self, *args, **options):
        # Universities
        self.stdout.write('Normalizing Universities...')
        count_u = 0
        for u in Universities.objects.all():
            changed = False
            if u.name:
                new = normalize_title(u.name)
                if new != u.name:
                    u.name = new
                    changed = True
            if u.location:
                new = normalize_title(u.location)
                if new != u.location:
                    u.location = new
                    changed = True
            if u.district:
                new = normalize_title(u.district)
                if new != u.district:
                    u.district = new
                    changed = True
            if u.description:
                new = sentence_case(u.description)
                if new != u.description:
                    u.description = new
                    changed = True
            if changed:
                u.save()
                count_u += 1

        self.stdout.write(self.style.SUCCESS(f'Updated {count_u} universities.'))

        # Faculties
        self.stdout.write('Normalizing Faculties...')
        count_f = 0
        for f in Faculties.objects.all():
            changed = False
            if f.name:
                new = normalize_title(f.name)
                if new != f.name:
                    f.name = new
                    changed = True
            if f.description:
                new = sentence_case(f.description)
                if new != f.description:
                    f.description = new
                    changed = True
            if changed:
                f.save()
                count_f += 1

        self.stdout.write(self.style.SUCCESS(f'Updated {count_f} faculties.'))

        # Degree Programs
        self.stdout.write('Normalizing Degree Programs...')
        count_p = 0
        for p in DegreePrograms.objects.all():
            changed = False
            if p.title:
                new = normalize_title(p.title)
                if new != p.title:
                    p.title = new
                    changed = True
            if p.description:
                new = sentence_case(p.description)
                if new != p.description:
                    p.description = new
                    changed = True
            if changed:
                p.save()
                count_p += 1

        self.stdout.write(self.style.SUCCESS(f'Updated {count_p} degree programs.'))
