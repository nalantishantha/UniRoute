from django.db import models

class Tutors(models.Model):
    tutor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    qualification = models.CharField(max_length=200, blank=True, null=True)
    experience_years = models.IntegerField(blank=True, null=True)
    specialization = models.CharField(max_length=100, blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    availability_schedule = models.TextField(blank=True, null=True)
    is_verified = models.IntegerField(blank=True, null=True)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    total_sessions_conducted = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'tutors'
        
    def __str__(self):
        return f"Tutor {self.tutor_id}"

class TutorSubjects(models.Model):
    id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey(Tutors, models.DO_NOTHING)
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING)
    proficiency_level = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'tutor_subjects'
        
    def __str__(self):
        return f"{self.tutor} - {self.subject}"

class TutoringSessions(models.Model):
    session_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey(Tutors, models.DO_NOTHING)
    session_title = models.CharField(max_length=200)
    session_description = models.TextField(blank=True, null=True)
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING)
    session_date = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    max_participants = models.IntegerField(blank=True, null=True)
    session_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    session_type = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'tutoring_sessions'
        
    def __str__(self):
        return self.session_title

class SessionEnrollments(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey(TutoringSessions, models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    enrollment_date = models.DateTimeField(blank=True, null=True)
    attendance_status = models.CharField(max_length=15, blank=True, null=True)
    payment_status = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        db_table = 'session_enrollments'
        
    def __str__(self):
        return f"Enrollment {self.enrollment_id}"

class TutorFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey(Tutors, models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    session = models.ForeignKey(TutoringSessions, models.DO_NOTHING)
    feedback_text = models.TextField(blank=True, null=True)
    submitted_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'tutor_feedback'
        
    def __str__(self):
        return f"Feedback {self.feedback_id}"

class TutorRatings(models.Model):
    rating_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey(Tutors, models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    session = models.ForeignKey(TutoringSessions, models.DO_NOTHING)
    rating = models.IntegerField()
    rating_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'tutor_ratings'
        
    def __str__(self):
        return f"Rating {self.rating_id}"