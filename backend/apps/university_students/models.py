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