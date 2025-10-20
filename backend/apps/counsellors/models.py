from django.db import models
from django.utils import timezone


class Counsellors(models.Model):
    counsellor_id = models.AutoField(primary_key=True)
    user = models.OneToOneField('accounts.Users', models.CASCADE)
    expertise = models.TextField(blank=True, null=True, help_text="Areas of expertise and specializations")
    bio = models.TextField(blank=True, null=True, help_text="Professional biography and background")
    experience_years = models.IntegerField(blank=True, null=True, help_text="Years of counselling experience")
    qualifications = models.TextField(blank=True, null=True, help_text="Educational qualifications and certifications")
    specializations = models.TextField(blank=True, null=True, help_text="Specialized areas like career guidance, academic counselling, etc.")
    available_for_sessions = models.BooleanField(default=True, help_text="Whether accepting new mentoring sessions")
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Hourly rate for sessions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'counsellors'

    def __str__(self):
        return f"Counsellor {self.counsellor_id} - {self.user.email}"


class CounsellorAvailability(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Sunday'),
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
    ]
    
    availability_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey('counsellors.Counsellors', models.CASCADE, related_name='availability')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'counsellor_availability'
        unique_together = ['counsellor', 'day_of_week', 'start_time', 'end_time']

    def __str__(self):
        return f"{self.counsellor} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"