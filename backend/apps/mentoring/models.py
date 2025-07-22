from django.db import models

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

class MentoringRequests(models.Model):
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
    mentor = models.ForeignKey('mentoring.Mentors', models.DO_NOTHING)
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
        db_table = 'mentoring_requests'

class SessionDetails(models.Model):
    detail_id = models.AutoField(primary_key=True)
    session = models.OneToOneField('mentoring.MentoringSessions', models.CASCADE, related_name='details')
    request = models.ForeignKey('mentoring.MentoringRequests', models.CASCADE, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    meeting_link = models.URLField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)
    completion_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'session_details'

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
    session_id = models.AutoField(primary_key=True)
    mentor = models.ForeignKey('mentoring.Mentors', models.DO_NOTHING)
    topic = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_sessions'