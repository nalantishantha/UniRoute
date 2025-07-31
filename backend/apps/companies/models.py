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


# class CompanyEvents(models.Model):
#     event_id = models.AutoField(primary_key=True)
#     company = models.ForeignKey(Companies, models.DO_NOTHING)
#     title = models.CharField(max_length=255)
#     description = models.TextField(blank=True, null=True)
#     event_type = models.CharField(max_length=50, blank=True, null=True)  # workshop, seminar, job_fair, etc.
#     event_date = models.DateTimeField(blank=True, null=True)
#     end_date = models.DateTimeField(blank=True, null=True)
#     location = models.CharField(max_length=255, blank=True, null=True)
#     is_virtual = models.BooleanField(default=False)
#     meeting_link = models.URLField(blank=True, null=True)
#     max_participants = models.IntegerField(blank=True, null=True)
#     registration_deadline = models.DateTimeField(blank=True, null=True)
#     contact_email = models.CharField(max_length=100, blank=True, null=True)
#     contact_phone = models.CharField(max_length=50, blank=True, null=True)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(blank=True, null=True)

#     class Meta:
#         managed = True
#         db_table = 'company_events'

class CompanyEvents(models.Model):
    event_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=8, blank=True, null=True)
    event_date = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
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
        



class CompanyRequests(models.Model):
    request_id = models.AutoField(primary_key=True)
    company_name = models.CharField(max_length=255)
    contact_person_name = models.CharField(max_length=255)
    contact_person_title = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=100)
    phone_number = models.CharField(max_length=50)
    password_hash = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    company_size = models.CharField(max_length=50, blank=True, null=True)  # e.g., "1-10", "11-50", "51-200", etc.
    established_year = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    request_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')  # pending, approved, rejected
    
    class Meta:
        managed = True
        db_table = 'company_requests'

