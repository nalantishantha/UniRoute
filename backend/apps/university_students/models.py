from django.db import models

class UniversityStudents(models.Model):
    uni_student_id = models.AutoField(primary_key=True)
    post_al_student = models.ForeignKey('students.PostAlStudents', models.DO_NOTHING)
    university = models.ForeignKey('universities.Universities', models.DO_NOTHING)
    degree_program = models.ForeignKey('university_programs.DegreePrograms', models.DO_NOTHING)
    admission_year = models.IntegerField(blank=True, null=True)
    current_year = models.IntegerField(blank=True, null=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    graduation_status = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        db_table = 'university_students'
        
    def __str__(self):
        return f"University Student {self.uni_student_id}"

class PreUniversityCourses(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=100)
    course_description = models.TextField(blank=True, null=True)
    duration_months = models.IntegerField(blank=True, null=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    provider = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'pre_university_courses'
        
    def __str__(self):
        return self.course_name

class PreUniParticipants(models.Model):
    participant_id = models.AutoField(primary_key=True)
    post_al_student = models.ForeignKey('students.PostAlStudents', models.DO_NOTHING)
    course = models.ForeignKey(PreUniversityCourses, models.DO_NOTHING)
    enrollment_date = models.DateField(blank=True, null=True)
    completion_status = models.CharField(max_length=15, blank=True, null=True)
    completion_date = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'pre_uni_participants'
        
    def __str__(self):
        return f"Pre-Uni Participant {self.participant_id}"

class PreUniTutors(models.Model):
    tutor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    course = models.ForeignKey(PreUniversityCourses, models.DO_NOTHING)
    expertise_area = models.CharField(max_length=100, blank=True, null=True)
    experience_years = models.IntegerField(blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'pre_uni_tutors'
        
    def __str__(self):
        return f"Pre-Uni Tutor {self.tutor_id}"