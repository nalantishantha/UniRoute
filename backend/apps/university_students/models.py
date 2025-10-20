from django.db import models

class UniversityStudents(models.Model):
    university_student_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    university = models.ForeignKey('universities.Universities', models.DO_NOTHING)
    faculty = models.ForeignKey('universities.Faculties', models.DO_NOTHING, blank=True, null=True)
    degree_program = models.ForeignKey('university_programs.DegreePrograms', models.DO_NOTHING)
    duration = models.ForeignKey('university_programs.DegreeProgramDurations', models.DO_NOTHING)
    year_of_study = models.IntegerField(blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    enrollment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'university_students'


class UniversityStudentEducation(models.Model):
    education_id = models.AutoField(primary_key=True)
    university_student = models.ForeignKey(UniversityStudents, on_delete=models.CASCADE, related_name='education_history')
    degree = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    year = models.CharField(max_length=20)
    gpa = models.CharField(max_length=10, blank=True, null=True)
   

    class Meta:
        db_table = 'university_student_education'


class UniversityStudentExperience(models.Model):
    experience_id = models.AutoField(primary_key=True)
    university_student = models.ForeignKey(UniversityStudents, on_delete=models.CASCADE, related_name='work_experience')
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    period = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'university_student_experience'

class UniversityStudentSocialLinks(models.Model):
    social_links_id = models.AutoField(primary_key=True)
    university_student = models.OneToOneField(UniversityStudents, on_delete=models.CASCADE, related_name='social_links')
    github = models.CharField(max_length=100, blank=True, null=True)
    x = models.CharField(max_length=100, blank=True, null=True)
    linkedin = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)


    class Meta:
        db_table = 'university_student_social_links'