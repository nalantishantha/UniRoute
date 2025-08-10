from django.db import models

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
    image_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'internship_opportunities'


class CompanyEvents(models.Model):
    event_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=50, blank=True, null=True)  # workshop, seminar, job_fair, etc.
    event_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    is_virtual = models.BooleanField(default=False)
    meeting_link = models.URLField(blank=True, null=True)
    max_participants = models.IntegerField(blank=True, null=True)
    registration_deadline = models.DateTimeField(blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'company_events'


class CompanyEventRegistrations(models.Model):
    registration_id = models.AutoField(primary_key=True)
    event = models.ForeignKey(CompanyEvents, models.DO_NOTHING)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    registration_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, default='registered')  # registered, attended, cancelled
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'company_event_registrations'


class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    level = models.CharField(max_length=50, blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    instructor = models.CharField(max_length=255, blank=True, null=True)
    prerequisites = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, blank=True, null=True)
    enrollments = models.IntegerField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    skills = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'company_courses'


class CompanyAnnouncement(models.Model):
    announcement_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    priority = models.CharField(max_length=20)
    date = models.DateField()
    status = models.CharField(max_length=20)
    author = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True)  # comma-separated
    image_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'company_announcement'


class CompanyDashboardEdit(models.Model):
    dashboard_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    story_title = models.CharField(max_length=255)
    story_subtitle = models.TextField(blank=True, null=True)
    story_section_title = models.CharField(max_length=255, blank=True, null=True)
    story_description = models.TextField(blank=True, null=True)
    story_second_description = models.TextField(blank=True, null=True)
    story_image = models.CharField(max_length=255, blank=True, null=True)
    offers = models.JSONField(default=list)  # List of offer dicts
    team = models.JSONField(default=list)    # List of team member dicts
    testimonials = models.JSONField(default=list)  # List of testimonial dicts
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    contact_address = models.CharField(max_length=255, blank=True, null=True)
    announcements = models.JSONField(default=list)  # Add this line
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'company_dashboard_edit'

