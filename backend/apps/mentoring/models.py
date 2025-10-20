from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class Mentors(models.Model):
    mentor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    university_student = models.ForeignKey('university_students.UniversityStudents', models.DO_NOTHING, blank=True, null=True)
    expertise = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    approved = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentors'


class PreMentorApplications(models.Model):
    """Pre-mentor applications submitted by university students.

    This table represents mentor applications awaiting university decision.
    It links to an existing mentor row (Mentors) and tracks if the student
    has actively applied (applied=1). University can accept (set mentor.approved=1)
    or reject (set applied=0 and store rejection_reason).
    """
    pre_mentor_id = models.AutoField(primary_key=True)
    mentor = models.ForeignKey('mentoring.Mentors', models.DO_NOTHING, related_name='pre_apps')
    # 1 = applied/request sent, 0 = not applied/withdrawn/rejected
    applied = models.IntegerField(default=1)
    # Raw form submission data captured from UI (flexible)
    form_data = models.JSONField(default=dict)
    rejection_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'pre_mentor_applications'

class MentoringFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('mentoring.MentoringSessions', models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    rating = models.JSONField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_feedback'

class MentoringSessionEnrollments(models.Model):
    session_enrollment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('mentoring.MentoringSessions', models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    enrolled_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_session_enrollments'

class MentoringSessions(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    session_id = models.AutoField(primary_key=True)
    mentor = models.ForeignKey('mentoring.Mentors', models.DO_NOTHING)
    topic = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=9, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_sessions'


class MentorAvailability(models.Model):
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
    mentor = models.ForeignKey('mentoring.Mentors', models.CASCADE, related_name='availability')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'mentor_availability'
        unique_together = ['mentor', 'day_of_week', 'start_time', 'end_time']

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError('Start time must be before end time')

    def __str__(self):
        return f"{self.mentor} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"


class MentorAvailabilityExceptions(models.Model):
    EXCEPTION_TYPES = [
        ('unavailable', 'Unavailable'),
        ('custom_available', 'Custom Available'),
    ]
    
    exception_id = models.AutoField(primary_key=True)
    mentor = models.ForeignKey('mentoring.Mentors', models.CASCADE, related_name='availability_exceptions')
    date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    exception_type = models.CharField(max_length=16, choices=EXCEPTION_TYPES)
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'mentor_availability_exceptions'
        unique_together = ['mentor', 'date', 'start_time', 'end_time']

    def clean(self):
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError('Start time must be before end time')
        
        # Validate that exception date is not in the past
        if self.date < timezone.now().date():
            raise ValidationError('Exception date cannot be in the past')

    def __str__(self):
        time_str = ""
        if self.start_time and self.end_time:
            time_str = f" {self.start_time}-{self.end_time}"
        return f"{self.mentor} - {self.date}{time_str} ({self.get_exception_type_display()})"


class VideoCallRoom(models.Model):
    """Model to track video call rooms for mentoring sessions"""
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('active', 'Active'),
        ('ended', 'Ended'),
    ]
    
    room_id = models.CharField(max_length=100, primary_key=True)
    session = models.ForeignKey('mentoring.MentoringSessions', models.CASCADE, related_name='video_rooms', null=True, blank=True)
    mentor = models.ForeignKey('mentoring.Mentors', models.CASCADE, related_name='video_rooms')
    student = models.ForeignKey('students.Students', models.CASCADE, related_name='video_rooms', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='waiting')
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = True
        db_table = 'video_call_rooms'
        
    def __str__(self):
        return f"Room {self.room_id} - {self.mentor} with {self.student}"


class VideoCallParticipant(models.Model):
    """Track participants in video call rooms"""
    ROLE_CHOICES = [
        ('mentor', 'Mentor'),
        ('student', 'Student'),
    ]
    
    participant_id = models.AutoField(primary_key=True)
    room = models.ForeignKey('mentoring.VideoCallRoom', models.CASCADE, related_name='participants')
    user_id = models.IntegerField()  # Can be mentor_id or student_id
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    is_online = models.BooleanField(default=True)
    
    class Meta:
        managed = True
        db_table = 'video_call_participants'
        unique_together = ['room', 'user_id', 'role']
        
    def __str__(self):
        return f"{self.role} {self.user_id} in room {self.room.room_id}"