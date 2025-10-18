from django.db import models

class PreMentors(models.Model):
    pre_mentor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    university_student = models.ForeignKey('university_students.UniversityStudents', models.DO_NOTHING)
    status = models.CharField(max_length=20, default='active')
    
    # New fields for mentor application system
    mentor = models.ForeignKey('mentoring.Mentors', models.SET_NULL, blank=True, null=True, help_text='Reference to associated mentor record')
    applied = models.IntegerField(default=0, help_text='0=not applied, 1=applied')
    recommendation = models.TextField(blank=True, null=True, help_text='Recommendation text from application form')
    skills = models.TextField(blank=True, null=True, help_text='Skills and expertise from application form')
    nic_photo = models.CharField(max_length=255, blank=True, null=True, help_text='Path to NIC photo file')
    student_id_photo = models.CharField(max_length=255, blank=True, null=True, help_text='Path to Student ID photo file')
    recommendation_letter = models.CharField(max_length=255, blank=True, null=True, help_text='Path to recommendation letter file')
    application_date = models.DateTimeField(blank=True, null=True, help_text='Date when application was submitted')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'pre_mentors'

class PreMentorAvailability(models.Model):
    availability_id = models.AutoField(primary_key=True)
    pre_mentor = models.ForeignKey(PreMentors, models.CASCADE)
    day_of_week = models.IntegerField()  # 0=Monday, 1=Tuesday, etc.
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'pre_mentor_availability'

class PreMentorSessions(models.Model):
    session_id = models.AutoField(primary_key=True)
    pre_mentor = models.ForeignKey(PreMentors, models.CASCADE)
    student = models.ForeignKey('accounts.Users', models.DO_NOTHING)  # The student who booked
    subject = models.CharField(max_length=100)
    session_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_minutes = models.IntegerField()
    session_fee = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='scheduled')  # scheduled, completed, cancelled
    notes = models.TextField(blank=True, null=True)
    rating_by_student = models.IntegerField(blank=True, null=True)
    feedback_by_student = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'pre_mentor_sessions'

class PreMentorEarnings(models.Model):
    earning_id = models.AutoField(primary_key=True)
    pre_mentor = models.ForeignKey(PreMentors, models.CASCADE)
    session = models.ForeignKey(PreMentorSessions, models.DO_NOTHING, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    earning_date = models.DateField()
    payment_status = models.CharField(max_length=20, default='pending')  # pending, paid, cancelled
    payment_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'pre_mentor_earnings'
