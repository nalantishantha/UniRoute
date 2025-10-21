from django.db import models
from django.core.exceptions import ValidationError
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

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError('Start time must be before end time')

    def __str__(self):
        return f"{self.counsellor} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"


class CounsellorAvailabilityExceptions(models.Model):
    EXCEPTION_TYPES = [
        ('unavailable', 'Unavailable'),
        ('custom_available', 'Custom Available'),
    ]
    
    exception_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey('counsellors.Counsellors', models.CASCADE, related_name='availability_exceptions')
    date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    exception_type = models.CharField(max_length=16, choices=EXCEPTION_TYPES)
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'counsellor_availability_exceptions'
        unique_together = ['counsellor', 'date', 'start_time', 'end_time']

    def clean(self):
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError('Start time must be before end time')
        
        if self.date < timezone.now().date():
            raise ValidationError('Exception date cannot be in the past')

    def __str__(self):
        time_str = ""
        if self.start_time and self.end_time:
            time_str = f" {self.start_time}-{self.end_time}"
        return f"{self.counsellor} - {self.date}{time_str} ({self.get_exception_type_display()})"


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
    counsellor = models.ForeignKey('counsellors.Counsellors', models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
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

    def __str__(self):
        return f"Request {self.request_id} - {self.student} to {self.counsellor}"


class CouncellingSessions(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    session_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey('counsellors.Counsellors', models.DO_NOTHING)
    topic = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=9, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'counselling_sessions'

    def __str__(self):
        return f"Session {self.session_id} - {self.counsellor} on {self.scheduled_at}"


class CounsellingSessionDetails(models.Model):
    detail_id = models.AutoField(primary_key=True)
    session = models.OneToOneField('counsellors.CouncellingSessions', models.CASCADE, related_name='details')
    request = models.ForeignKey('counsellors.CounsellingRequests', models.CASCADE, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    meeting_link = models.URLField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)
    completion_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'counselling_session_details'

    def __str__(self):
        return f"Details for Session {self.session.session_id}"


class CounsellingSessionEnrollments(models.Model):
    session_enrollment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('counsellors.CouncellingSessions', models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    enrolled_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'counselling_session_enrollments'

    def __str__(self):
        return f"Enrollment {self.session_enrollment_id} - Student {self.student} in Session {self.session}"


class CounsellingFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('counsellors.CouncellingSessions', models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    rating = models.JSONField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'counselling_feedback'

    def __str__(self):
        return f"Feedback {self.feedback_id} - Session {self.session}"