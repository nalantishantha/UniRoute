from django.db import models

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

class Faculties(models.Model):
    faculty_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
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