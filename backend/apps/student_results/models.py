from django.db import models

class OlSubjects(models.Model):
    ol_subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(max_length=50, unique=True)
    subject_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ol_subjects'

class AlSubjects(models.Model):
    al_subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(max_length=50, unique=True)
    subject_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'al_subjects'

class SubjectStreams(models.Model):
    stream_id = models.AutoField(primary_key=True)
    stream_name = models.CharField(max_length=30, unique=True)
    stream_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'subject_streams'

class OlStudentResults(models.Model):
    student_result_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    subject = models.ForeignKey('student_results.OlSubjects', models.DO_NOTHING)
    grade = models.CharField(max_length=2)

    class Meta:
        managed = True
        db_table = 'ol_student_results'

class PostAlStudentResults(models.Model):
    result_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('students.PostAlStudents', models.DO_NOTHING)
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING)
    grade = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'post_al_student_results'

class AlStudentSubjects(models.Model):
    student = models.ForeignKey('students.AlStudents', models.DO_NOTHING)
    subject = models.ForeignKey('student_results.AlSubjects', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'al_student_subjects'