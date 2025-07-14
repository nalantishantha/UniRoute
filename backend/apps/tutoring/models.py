from django.db import models

class TutorFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
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