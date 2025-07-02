from django.db import models

class OlSubjects(models.Model):
    ol_subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(unique=True, max_length=50)
    subject_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'ol_subjects'
        
    def __str__(self):
        return self.subject_name

class AlSubjects(models.Model):
    al_subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(unique=True, max_length=50)
    subject_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'al_subjects'
        
    def __str__(self):
        return self.subject_name

class SubjectStreams(models.Model):
    stream_id = models.AutoField(primary_key=True)
    stream_name = models.CharField(unique=True, max_length=30)
    stream_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'subject_streams'
        
    def __str__(self):
        return self.stream_name

class AlSubjectStreams(models.Model):
    id = models.AutoField(primary_key=True)
    stream = models.ForeignKey(SubjectStreams, models.DO_NOTHING)
    subject = models.ForeignKey(AlSubjects, models.DO_NOTHING)

    class Meta:
        db_table = 'al_subject_streams'
        
    def __str__(self):
        return f"{self.stream.stream_name} - {self.subject.subject_name}"

class AlStudentSubjects(models.Model):
    id = models.AutoField(primary_key=True)
    al_student = models.ForeignKey('students.AlStudents', models.DO_NOTHING)
    subject = models.ForeignKey(AlSubjects, models.DO_NOTHING)
    grade = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        db_table = 'al_student_subjects'
        
    def __str__(self):
        return f"AL Student Subject {self.id}"

class PostAlStudentResults(models.Model):
    result_id = models.AutoField(primary_key=True)
    post_al_student = models.ForeignKey('students.PostAlStudents', models.DO_NOTHING)
    subject = models.ForeignKey(AlSubjects, models.DO_NOTHING)
    grade = models.CharField(max_length=2)

    class Meta:
        db_table = 'post_al_student_results'
        
    def __str__(self):
        return f"Post AL Result {self.result_id}"