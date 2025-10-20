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


class PreMentors(models.Model):
    """Legacy/alternate pre-mentor table used by some flows.
    We only read from this table to detect applied=1 submissions.
    """
    pre_mentor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING, db_column='user_id')
    university_student = models.ForeignKey('university_students.UniversityStudents', models.DO_NOTHING, db_column='university_student_id', blank=True, null=True)
    status = models.CharField(max_length=20, blank=True, null=True)
    applied = models.IntegerField(blank=True, null=True)
    recommendation = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False  # table exists; don't let Django manage it
        db_table = 'pre_mentors'

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