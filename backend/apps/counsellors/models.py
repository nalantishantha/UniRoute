from django.db import models
from django.utils import timezone


class Counsellors(models.Model):
    counsellor_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        'accounts.Users',
        models.DO_NOTHING,
        related_name='counsellor_profile',
    )
    expertise = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField(blank=True, null=True)
    qualifications = models.TextField(blank=True, null=True)
    specializations = models.TextField(blank=True, null=True)
    available_for_sessions = models.IntegerField()
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'counsellors'

    def __str__(self):
        if hasattr(self, 'user') and self.user:
            return f"Counsellor {getattr(self.user, 'username', self.user_id)}"
        return f"Counsellor {self.counsellor_id}"


class CounsellingSessions(models.Model):
    session_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey(
        Counsellors,
        models.DO_NOTHING,
        related_name='sessions',
    )
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    request = models.ForeignKey(
        'CounsellingRequests',
        models.DO_NOTHING,
        blank=True,
        null=True,
        related_name='sessions',
    )
    topic = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField()
    status = models.CharField(max_length=9)
    session_type = models.CharField(max_length=8)
    meeting_link = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    completion_notes = models.TextField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'counselling_sessions'


class CounsellingRequests(models.Model):
    request_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey(
        Counsellors,
        models.DO_NOTHING,
        related_name='requests',
    )
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    topic = models.CharField(max_length=255)
    description = models.TextField()
    preferred_time = models.CharField(max_length=100)
    session_type = models.CharField(max_length=8)
    urgency = models.CharField(max_length=6)
    status = models.CharField(max_length=9)
    requested_date = models.DateTimeField()
    expiry_date = models.DateTimeField()
    decline_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'counselling_requests'


class CounsellingFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey(
        Counsellors,
        models.DO_NOTHING,
        related_name='feedback',
    )
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    session = models.OneToOneField(
        CounsellingSessions,
        models.DO_NOTHING,
        related_name='feedback',
    )
    rating = models.JSONField()
    feedback_text = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'counselling_feedback'


class CounsellorAvailability(models.Model):
    availability_id = models.AutoField(primary_key=True)
    counsellor = models.ForeignKey(
        Counsellors,
        models.DO_NOTHING,
        related_name='availability',
    )
    day_of_week = models.IntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'counsellor_availability'
        unique_together = (('counsellor', 'day_of_week', 'start_time', 'end_time'),)
