from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.mentoring.models import MentoringRequests


class Command(BaseCommand):
    help = 'Update expired mentoring requests'

    def handle(self, *args, **options):
        expired_requests = MentoringRequests.objects.filter(
            status='pending',
            expiry_date__lt=timezone.now()
        )
        
        count = expired_requests.count()
        expired_requests.update(status='expired')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated {count} expired mentoring requests'
            )
        )
