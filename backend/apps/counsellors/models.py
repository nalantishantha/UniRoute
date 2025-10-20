from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


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

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError('Start time must be before end time')

    def __str__(self):
        return f"{self.counsellor} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"


class CounsellingRequests(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('declined', 'Declined'),
        ('expired', 'Expired'),
    ]
    
    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    SESSION_TYPE_CHOICES = [
        ('online', 'Online'),
        ('physical', 'Physical'),
    ]
    
    request_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey('counsellors.Counsellors', models.CASCADE, related_name='counselling_requests')
    student = models.ForeignKey('students.Students', models.CASCADE, related_name='counselling_requests')
    topic = models.CharField(max_length=255)
    description = models.TextField()
    preferred_time = models.CharField(max_length=100)
    session_type = models.CharField(max_length=8, choices=SESSION_TYPE_CHOICES, default='online')
    urgency = models.CharField(max_length=6, choices=URGENCY_CHOICES, default='medium')
    status = models.CharField(max_length=9, choices=STATUS_CHOICES, default='pending')
    requested_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField()
    decline_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'counselling_requests'

    def save(self, *args, **kwargs):
        if not self.expiry_date:
            # Set expiry to 7 days from creation
            from datetime import timedelta
            self.expiry_date = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Counselling Request {self.request_id} - {self.student} to {self.counsellor}"


class CounsellingSessions(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    session_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey('counsellors.Counsellors', models.CASCADE, related_name='counselling_sessions')
    student = models.ForeignKey('students.Students', models.CASCADE, related_name='counselling_sessions')
    request = models.ForeignKey('counsellors.CounsellingRequests', models.CASCADE, related_name='sessions', null=True, blank=True)
    topic = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    status = models.CharField(max_length=9, choices=STATUS_CHOICES, default='pending')
    session_type = models.CharField(max_length=8, choices=CounsellingRequests.SESSION_TYPE_CHOICES, default='online')
    meeting_link = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    completion_notes = models.TextField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'counselling_sessions'

    def __str__(self):
        return f"Counselling Session {self.session_id} - {self.counsellor} with {self.student}"


class CounsellingFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    session = models.OneToOneField('counsellors.CounsellingSessions', models.CASCADE, related_name='feedback')
    student = models.ForeignKey('students.Students', models.CASCADE, related_name='counselling_feedback')
    counsellor = models.ForeignKey('counsellors.Counsellors', models.CASCADE, related_name='counselling_feedback')
    rating = models.JSONField(help_text="JSON object with rating criteria and scores")
    feedback_text = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'counselling_feedback'

    def __str__(self):
        return f"Feedback for Session {self.session.session_id} by {self.student}"