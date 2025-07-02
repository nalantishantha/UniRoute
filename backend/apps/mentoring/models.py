from django.db import models

class Mentors(models.Model):
    mentor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    expertise_area = models.CharField(max_length=100, blank=True, null=True)
    experience_years = models.IntegerField(blank=True, null=True)
    current_position = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    availability_schedule = models.TextField(blank=True, null=True)
    is_verified = models.IntegerField(blank=True, null=True)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    total_sessions_conducted = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'mentors'
        
    def __str__(self):
        return f"Mentor {self.mentor_id}"

class MentoringSessions(models.Model):
    session_id = models.AutoField(primary_key=True)
    mentor = models.ForeignKey(Mentors, models.DO_NOTHING)
    session_title = models.CharField(max_length=200)
    session_description = models.TextField(blank=True, null=True)
    session_date = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    max_participants = models.IntegerField(blank=True, null=True)
    session_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    session_type = models.CharField(max_length=20, blank=True, null=True)
    target_audience = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'mentoring_sessions'
        
    def __str__(self):
        return self.session_title

class MentoringSessionEnrollments(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey(MentoringSessions, models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    enrollment_date = models.DateTimeField(blank=True, null=True)
    attendance_status = models.CharField(max_length=15, blank=True, null=True)
    payment_status = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        db_table = 'mentoring_session_enrollments'
        
    def __str__(self):
        return f"Mentoring Enrollment {self.enrollment_id}"

class MentoringFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    mentor = models.ForeignKey(Mentors, models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    session = models.ForeignKey(MentoringSessions, models.DO_NOTHING)
    feedback_text = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    submitted_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'mentoring_feedback'
        
    def __str__(self):
        return f"Mentoring Feedback {self.feedback_id}"