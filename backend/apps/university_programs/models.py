from django.db import models
from django.conf import settings


class DegreePrograms(models.Model):
    degree_program_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(
        'universities.Universities', models.DO_NOTHING)
    # Many DBs already have a faculty_id column; map it explicitly here.
    faculty = models.ForeignKey(
        'universities.Faculties', models.DO_NOTHING, blank=True, null=True, db_column='faculty_id')
    title = models.CharField(max_length=150)
    code = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    subject_stream_required = models.CharField(
        max_length=10, blank=True, null=True)
    career_paths = models.TextField(blank=True, null=True)
    syllabus_url = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'degree_programs'


# Map Degree Programs to Faculties (so we can filter programs by faculty)
class FacultyDegreePrograms(models.Model):
    faculty = models.ForeignKey('universities.Faculties', models.DO_NOTHING)
    degree_program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'faculty_degree_programs'


class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    credits = models.DecimalField(
        max_digits=3, decimal_places=1, blank=True, null=True)
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


# Subject overview (aka syllabus/overview) stored as JSON for flexibility
class SubjectOverview(models.Model):
    """
    Stores rich overview/syllabus for a subject (Courses row).
    Structure is flexible JSON to match frontend: {overview, objectives[], topics[], assessment[], references[]}
    """
    course = models.OneToOneField(
        Courses, on_delete=models.CASCADE, related_name='overview')
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'subject_overviews'


def subject_upload_path(instance, filename: str):
    # MEDIA_ROOT/subject_files/<course_id>/<filename>
    return f"subject_files/{instance.course_id}/{filename}"


class SubjectFile(models.Model):
    """Files associated with a subject (Course)."""
    file_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(
        Courses, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to=subject_upload_path)
    original_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'subject_files'


class AcademicContent(models.Model):
    """Optional cache/summary for counts displayed on Academic Content page."""
    university = models.OneToOneField(
        'universities.Universities', on_delete=models.CASCADE, related_name='academic_summary')
    faculty_count = models.IntegerField(default=0)
    course_count = models.IntegerField(default=0)  # degree programs
    # distinct courses mapped to programs
    subject_count = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'academic_content_summary'
