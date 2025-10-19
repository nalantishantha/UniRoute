from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class TutorAvailability(models.Model):
    """Recurring availability slots for tutors"""
    availability_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING, related_name='tutor_availability', db_constraint=False)
    day_of_week = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(6)],
        help_text="0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday"
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_recurring = models.BooleanField(default=True, help_text="Whether this slot repeats weekly")
    max_students = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING, null=True, blank=True, db_constraint=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tutor_availability'
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return f"{self.tutor.user.username} - {days[self.day_of_week]} {self.start_time}-{self.end_time}"


class TutoringBooking(models.Model):
    """Recurring booking for students with tutors"""
    booking_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('students.Students', models.DO_NOTHING, related_name='tutoring_bookings', db_constraint=False)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING, related_name='tutor_bookings', db_constraint=False)
    availability_slot = models.ForeignKey('tutoring.TutorAvailability', models.DO_NOTHING, related_name='bookings', db_constraint=False)
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING, null=True, blank=True, db_constraint=False)
    is_recurring = models.BooleanField(default=True, help_text="Whether this is a recurring weekly booking")
    start_date = models.DateField(help_text="First session date")
    end_date = models.DateField(null=True, blank=True, help_text="Last session date (null = ongoing)")
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending Payment'),
            ('confirmed', 'Confirmed'),
            ('active', 'Active'),
            ('cancelled', 'Cancelled'),
            ('completed', 'Completed')
        ],
        default='pending'
    )
    topic = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    payment_type = models.CharField(
        max_length=20,
        choices=[
            ('single', 'Single Session'),
            ('monthly', 'Monthly Package'),
            ('term', 'Term Package')
        ],
        default='single'
    )
    sessions_paid = models.IntegerField(default=1, help_text="Number of sessions paid for")
    sessions_completed = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tutoring_bookings'
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking {self.booking_id}: {self.student.user.username} with {self.tutor.user.username}"


class TutorFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    rating = models.JSONField(blank=True, null=True)
    feedback = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutor_feedback'

class TutorRatings(models.Model):
    rating_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING)
    rater_user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    rating = models.JSONField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutor_ratings'

class TutorSubjects(models.Model):
    tutor_subject_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING)
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING)
    level = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutor_subjects'

class TutoringSessions(models.Model):
    session_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING)
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutoring_sessions'

class Tutors(models.Model):
    tutor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    university_student = models.ForeignKey('university_students.UniversityStudents', models.DO_NOTHING, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    expertise = models.CharField(max_length=255, blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutors'