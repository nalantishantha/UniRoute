from django.db import models

class Students(models.Model):
    student_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    school = models.CharField(max_length=100, blank=True, null=True)
    student_stage = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'students'
        
    def __str__(self):
        return f"Student {self.student_id}"

class AlStudents(models.Model):
    al_student_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Students, models.DO_NOTHING)
    stream = models.ForeignKey('student_results.SubjectStreams', models.DO_NOTHING, blank=True, null=True)
    al_year = models.IntegerField(blank=True, null=True)
    al_index_number = models.CharField(max_length=20, blank=True, null=True)
    z_score = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    district_rank = models.IntegerField(blank=True, null=True)
    island_rank = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'al_students'
        
    def __str__(self):
        return f"A/L Student {self.al_student_id}"

class PostAlStudents(models.Model):
    post_al_student_id = models.AutoField(primary_key=True)
    al_student = models.ForeignKey(AlStudents, models.DO_NOTHING)
    current_status = models.CharField(max_length=20, blank=True, null=True)
    gap_year_count = models.IntegerField(blank=True, null=True)
    is_employed = models.IntegerField(blank=True, null=True)
    employment_field = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'post_al_students'
        
    def __str__(self):
        return f"Post A/L Student {self.post_al_student_id}"

class OlStudentResults(models.Model):
    ol_result_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Students, models.DO_NOTHING)
    subject = models.ForeignKey('student_results.OlSubjects', models.DO_NOTHING)
    grade = models.CharField(max_length=2)
    ol_year = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'ol_student_results'
        
    def __str__(self):
        return f"O/L Result {self.ol_result_id}"