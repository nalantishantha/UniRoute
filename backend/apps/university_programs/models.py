from django.db import models

class DegreePrograms(models.Model):
    program_id = models.AutoField(primary_key=True)
    program_name = models.CharField(max_length=100)
    program_code = models.CharField(max_length=20, blank=True, null=True)
    faculty = models.ForeignKey('universities.Faculties', models.DO_NOTHING)
    degree_type = models.CharField(max_length=20, blank=True, null=True)
    duration_years = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'degree_programs'
        
    def __str__(self):
        return self.program_name

class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=100)
    course_code = models.CharField(max_length=20, blank=True, null=True)
    credits = models.IntegerField(blank=True, null=True)
    semester = models.IntegerField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'courses'
        
    def __str__(self):
        return self.course_name

class DegreeProgramCourses(models.Model):
    id = models.AutoField(primary_key=True)
    program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    course = models.ForeignKey(Courses, models.DO_NOTHING)
    is_compulsory = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'degree_program_courses'
        
    def __str__(self):
        return f"{self.program.program_name} - {self.course.course_name}"

class DegreeProgramDurations(models.Model):
    id = models.AutoField(primary_key=True)
    program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    duration_type = models.CharField(max_length=20, blank=True, null=True)
    duration_value = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'degree_program_durations'
        
    def __str__(self):
        return f"{self.program.program_name} Duration"

class DegreeProgramZScores(models.Model):
    id = models.AutoField(primary_key=True)
    program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    stream = models.ForeignKey('student_results.SubjectStreams', models.DO_NOTHING)
    year = models.IntegerField(blank=True, null=True)
    z_score_cutoff = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    district_rank_cutoff = models.IntegerField(blank=True, null=True)
    island_rank_cutoff = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'degree_program_z_scores'
        
    def __str__(self):
        return f"{self.program.program_name} Z-Score"

class FacultyDegreePrograms(models.Model):
    id = models.AutoField(primary_key=True)
    faculty = models.ForeignKey('universities.Faculties', models.DO_NOTHING)
    program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)

    class Meta:
        db_table = 'faculty_degree_programs'
        
    def __str__(self):
        return f"{self.faculty} - {self.program.program_name}"