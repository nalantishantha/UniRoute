from django.db import models

class Students(models.Model):
    student_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    current_stage = models.CharField(max_length=7)
    district = models.CharField(max_length=50, blank=True, null=True)
    school = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'students'

class AlStudents(models.Model):
    student = models.OneToOneField(Students, models.DO_NOTHING, primary_key=True)
    stream = models.ForeignKey('student_results.SubjectStreams', models.DO_NOTHING)
    al_year = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'al_students'

class PostAlStudents(models.Model):
    student = models.OneToOneField(Students, models.DO_NOTHING, primary_key=True)
    stream = models.ForeignKey('student_results.SubjectStreams', models.DO_NOTHING)
    al_year = models.IntegerField(blank=True, null=True)
    z_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'post_al_students'