from django.db import models

class Universities(models.Model):
    university_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)  # Changed from university_name
    location = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=50, blank=True, null=True)  # Added
    address = models.CharField(max_length=255, blank=True, null=True)  # Added
    description = models.TextField(blank=True, null=True)  # Added
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)  # Changed from contact_phone
    website = models.CharField(max_length=255, blank=True, null=True)  # Changed from website_url
    logo = models.CharField(max_length=255, blank=True, null=True)  # Added
    ugc_ranking = models.IntegerField(blank=True, null=True)  # Added
    is_active = models.BooleanField(default=True)  # Added
    created_at = models.DateTimeField(auto_now_add=True)  # Added

    class Meta:
        db_table = 'universities'
        
    def __str__(self):
        return self.name  # Changed from university_name
    
class Faculties(models.Model):
    faculty_id = models.AutoField(primary_key=True)
    faculty_name = models.CharField(max_length=100)
    faculty_code = models.CharField(max_length=20, blank=True, null=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    established_year = models.IntegerField(blank=True, null=True)
    dean = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'faculties'
        
    def __str__(self):
        return f"{self.faculty_name} - {self.university.university_name}"

class UniversityAnnouncements(models.Model):
    announcement_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    title = models.CharField(max_length=200)
    content = models.TextField()
    announcement_date = models.DateTimeField(blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    target_audience = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'university_announcements'
        
    def __str__(self):
        return self.title

class UniversityEvents(models.Model):
    event_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    event_name = models.CharField(max_length=200)
    event_description = models.TextField(blank=True, null=True)
    event_date = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    organizer = models.CharField(max_length=100, blank=True, null=True)
    registration_required = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'university_events'
        
    def __str__(self):
        return self.event_name

class UniversityServices(models.Model):
    service_id = models.AutoField(primary_key=True)
    university = models.ForeignKey(Universities, models.DO_NOTHING)
    service_name = models.CharField(max_length=100)
    service_description = models.TextField(blank=True, null=True)
    service_type = models.CharField(max_length=50, blank=True, null=True)
    contact_info = models.CharField(max_length=200, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'university_services'
        
    def __str__(self):
        return f"{self.service_name} - {self.university.university_name}"

class PortfolioItems(models.Model):
    portfolio_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    portfolio_type = models.CharField(max_length=50, blank=True, null=True)
    file_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'portfolio_items'
        
    def __str__(self):
        return self.title