from django.db import models

class DegreePrograms(models.Model):
    degree_program_id = models.AutoField(primary_key=True)
    university = models.ForeignKey('universities.Universities', models.DO_NOTHING)
    title = models.CharField(max_length=150)
    code = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    subject_stream_required = models.CharField(max_length=10, blank=True, null=True)
    career_paths = models.TextField(blank=True, null=True)
    syllabus_url = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'degree_programs'

class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    credits = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'courses'

class DegreeProgramCourses(models.Model):
    degree_program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    course = models.ForeignKey(Courses, models.DO_NOTHING)
    semester = models.IntegerField(blank=True, null=True)
    is_core = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'degree_program_courses'

class DegreeProgramDurations(models.Model):
    duration_id = models.AutoField(primary_key=True)
    degree_program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    duration_years = models.IntegerField()
    degree_type = models.CharField(max_length=7)
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'degree_program_durations'

class DegreeProgramZScores(models.Model):
    degree_program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    year = models.IntegerField()
    district = models.CharField(max_length=50)
    z_score = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = True
        db_table = 'degree_program_z_scores'