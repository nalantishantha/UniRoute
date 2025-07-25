# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AdBookings(models.Model):
    booking_id = models.AutoField(primary_key=True)
    ad = models.ForeignKey('Advertisements', models.DO_NOTHING)
    space = models.ForeignKey('AdSpaces', models.DO_NOTHING)
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=9, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ad_bookings'


class AdSpaces(models.Model):
    space_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    recommended_size = models.CharField(max_length=50, blank=True, null=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ad_spaces'


class Advertisements(models.Model):
    ad_id = models.AutoField(primary_key=True)
    company = models.ForeignKey('Companies', models.DO_NOTHING, blank=True, null=True)
    tutor = models.ForeignKey('Tutors', models.DO_NOTHING, blank=True, null=True)
    title = models.CharField(max_length=255)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    target_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'advertisements'


class AlStudentSubjects(models.Model):
    pk = models.CompositePrimaryKey('student_id', 'subject_id')
    student = models.ForeignKey('AlStudents', models.DO_NOTHING)
    subject = models.ForeignKey('AlSubjects', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'al_student_subjects'


class AlStudents(models.Model):
    student = models.OneToOneField('Students', models.DO_NOTHING, primary_key=True)
    stream = models.ForeignKey('SubjectStreams', models.DO_NOTHING)
    al_year = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'al_students'


class AlSubjectStreams(models.Model):
    pk = models.CompositePrimaryKey('subject_id', 'stream_id')
    subject = models.ForeignKey('AlSubjects', models.DO_NOTHING)
    stream = models.ForeignKey('SubjectStreams', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'al_subject_streams'


class AlSubjects(models.Model):
    subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(unique=True, max_length=100)
    is_general = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'al_subjects'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = True
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Companies(models.Model):
    company_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'companies'


class CompanyEducationalContents(models.Model):
    content_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    content_type = models.CharField(max_length=8, blank=True, null=True)
    file_url = models.CharField(max_length=255, blank=True, null=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'company_educational_contents'


class ContentReports(models.Model):
    report_id = models.AutoField(primary_key=True)
    reported_by_user = models.ForeignKey('Users', models.DO_NOTHING)
    content_type = models.CharField(max_length=7)
    content_id = models.IntegerField()
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)
    moderator = models.ForeignKey('Users', models.DO_NOTHING, related_name='contentreports_moderator_set', blank=True, null=True)
    action_taken = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'content_reports'


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
    pk = models.CompositePrimaryKey('degree_program_id', 'course_id')
    degree_program = models.ForeignKey('DegreePrograms', models.DO_NOTHING)
    course = models.ForeignKey(Courses, models.DO_NOTHING)
    semester = models.IntegerField(blank=True, null=True)
    is_core = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'degree_program_courses'


class DegreeProgramDurations(models.Model):
    duration_id = models.AutoField(primary_key=True)
    degree_program = models.ForeignKey('DegreePrograms', models.DO_NOTHING)
    duration_years = models.IntegerField()
    degree_type = models.CharField(max_length=7)
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'degree_program_durations'


class DegreeProgramZScores(models.Model):
    degree_program = models.ForeignKey('DegreePrograms', models.DO_NOTHING)
    year = models.IntegerField()
    district = models.CharField(max_length=50)
    z_score = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = True
        db_table = 'degree_program_z_scores'


class DegreePrograms(models.Model):
    degree_program_id = models.AutoField(primary_key=True)
    university = models.ForeignKey('Universities', models.DO_NOTHING)
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


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'django_session'


class Faculties(models.Model):
    faculty_id = models.AutoField(primary_key=True)
    university = models.ForeignKey('Universities', models.DO_NOTHING)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'faculties'


class FacultyDegreePrograms(models.Model):
    pk = models.CompositePrimaryKey('faculty_id', 'degree_program_id')
    faculty = models.ForeignKey(Faculties, models.DO_NOTHING)
    degree_program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'faculty_degree_programs'


class InternshipOpportunities(models.Model):
    internship_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    stipend = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    application_deadline = models.DateField(blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'internship_opportunities'


class MentoringFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('MentoringSessions', models.DO_NOTHING)
    student = models.ForeignKey('Students', models.DO_NOTHING)
    rating = models.JSONField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_feedback'


class MentoringPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('Students', models.DO_NOTHING)
    session = models.ForeignKey('MentoringSessions', models.DO_NOTHING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_payments'


class MentoringSessionEnrollments(models.Model):
    session_enrollment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('MentoringSessions', models.DO_NOTHING)
    student = models.ForeignKey('Students', models.DO_NOTHING)
    enrolled_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_session_enrollments'


class MentoringSessions(models.Model):
    session_id = models.AutoField(primary_key=True)
    mentor = models.ForeignKey('Mentors', models.DO_NOTHING)
    topic = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_sessions'


class Mentors(models.Model):
    mentor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    university_student = models.ForeignKey('UniversityStudents', models.DO_NOTHING, blank=True, null=True)
    expertise = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    approved = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentors'


class Messages(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey('Users', models.DO_NOTHING)
    receiver = models.ForeignKey('Users', models.DO_NOTHING, related_name='messages_receiver_set')
    message_text = models.TextField()
    sent_at = models.DateTimeField(blank=True, null=True)
    is_read = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'messages'


class OlStudentResults(models.Model):
    student_result_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('Students', models.DO_NOTHING)
    subject = models.ForeignKey('OlSubjects', models.DO_NOTHING)
    grade = models.CharField(max_length=2)

    class Meta:
        managed = True
        db_table = 'ol_student_results'


class OlSubjects(models.Model):
    subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(unique=True, max_length=100)
    subject_code = models.CharField(max_length=20, blank=True, null=True)
    is_verified = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ol_subjects'


class PortfolioItems(models.Model):
    item_id = models.AutoField(primary_key=True)
    university = models.ForeignKey('Universities', models.DO_NOTHING)
    item_type = models.CharField(max_length=11, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file_url = models.CharField(max_length=255, blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    published_at = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'portfolio_items'


class PostAlStudentResults(models.Model):
    result_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('PostAlStudents', models.DO_NOTHING)
    subject = models.ForeignKey(AlSubjects, models.DO_NOTHING)
    grade = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'post_al_student_results'


class PostAlStudents(models.Model):
    student = models.OneToOneField('Students', models.DO_NOTHING, primary_key=True)
    stream = models.ForeignKey('SubjectStreams', models.DO_NOTHING)
    al_year = models.IntegerField(blank=True, null=True)
    z_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'post_al_students'


class PreUniParticipants(models.Model):
    course = models.ForeignKey('PreUniversityCourses', models.DO_NOTHING)
    student = models.ForeignKey('Students', models.DO_NOTHING)
    registered_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pre_uni_participants'


class PreUniTutors(models.Model):
    course = models.ForeignKey('PreUniversityCourses', models.DO_NOTHING)
    tutor = models.ForeignKey('Tutors', models.DO_NOTHING)
    role = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pre_uni_tutors'


class PreUniversityCourses(models.Model):
    course_id = models.AutoField(primary_key=True)
    university = models.ForeignKey('Universities', models.DO_NOTHING)
    degree_program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pre_university_courses'


class SessionEnrollments(models.Model):
    session_enrollment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('TutoringSessions', models.DO_NOTHING)
    student = models.ForeignKey('Students', models.DO_NOTHING)
    enrolled_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'session_enrollments'


class Students(models.Model):
    student_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    current_stage = models.CharField(max_length=7)
    district = models.CharField(max_length=50, blank=True, null=True)
    school = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'students'


class SubjectStreams(models.Model):
    stream_id = models.AutoField(primary_key=True)
    stream_name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = True
        db_table = 'subject_streams'


class TutorFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('Tutors', models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    feedback = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutor_feedback'


class TutorRatings(models.Model):
    rating_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('Tutors', models.DO_NOTHING)
    rater_user = models.ForeignKey('Users', models.DO_NOTHING)
    rating = models.JSONField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutor_ratings'


class TutorSubjects(models.Model):
    tutor_subject_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('Tutors', models.DO_NOTHING)
    subject = models.ForeignKey(AlSubjects, models.DO_NOTHING)
    level = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutor_subjects'


class TutoringPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Students, models.DO_NOTHING)
    session = models.ForeignKey('TutoringSessions', models.DO_NOTHING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutoring_payments'


class TutoringSessions(models.Model):
    session_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey('Tutors', models.DO_NOTHING)
    subject = models.ForeignKey(AlSubjects, models.DO_NOTHING)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutoring_sessions'


class Tutors(models.Model):
    tutor_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    university_student = models.ForeignKey('UniversityStudents', models.DO_NOTHING, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    expertise = models.CharField(max_length=255, blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutors'


class Universities(models.Model):
    university_id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=100)
    location = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    logo = models.CharField(max_length=255, blank=True, null=True)
    ugc_ranking = models.IntegerField(blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'universities'


class UniversityAnnouncements(models.Model):
    announcement_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    announcement_type = models.CharField(max_length=8, blank=True, null=True)
    valid_from = models.DateField(blank=True, null=True)
    valid_to = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'university_announcements'


class UniversityEvents(models.Model):
    event_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=8, blank=True, null=True)
    event_date = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'university_events'


class UniversityServices(models.Model):
    service_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    service_type = models.CharField(max_length=15, blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    advertised_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'university_services'


class UniversityStudents(models.Model):
    university_student_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    faculty = models.ForeignKey(Faculties, models.DO_NOTHING, blank=True, null=True)
    degree_program = models.ForeignKey(DegreePrograms, models.DO_NOTHING)
    duration = models.ForeignKey(DegreeProgramDurations, models.DO_NOTHING)
    year_of_study = models.IntegerField(blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    enrollment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'university_students'


class UserDetails(models.Model):
    user = models.OneToOneField('Users', models.DO_NOTHING, primary_key=True)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.IntegerField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'user_details'
        db_table_comment = 'User details table'


class UserTypes(models.Model):
    type_id = models.AutoField(primary_key=True)
    type_name = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = True
        db_table = 'user_types'


class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_type = models.ForeignKey(UserTypes, models.DO_NOTHING)
    username = models.CharField(unique=True, max_length=50)
    email = models.CharField(unique=True, max_length=100)
    password_hash = models.CharField(max_length=255)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'users'
