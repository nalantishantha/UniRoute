from django.db import models

class Companies(models.Model):
    company_id = models.AutoField(primary_key=True)
    company_name = models.CharField(unique=True, max_length=100)
    industry = models.CharField(max_length=50, blank=True, null=True)
    company_size = models.CharField(max_length=20, blank=True, null=True)
    headquarters_location = models.CharField(max_length=100, blank=True, null=True)
    website_url = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    established_year = models.IntegerField(blank=True, null=True)
    is_verified = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'companies'
        
    def __str__(self):
        return self.company_name

class CompanyEducationalContents(models.Model):
    content_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    content_title = models.CharField(max_length=200)
    content_description = models.TextField(blank=True, null=True)
    content_type = models.CharField(max_length=50, blank=True, null=True)
    content_url = models.CharField(max_length=500, blank=True, null=True)
    target_audience = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'company_educational_contents'
        
    def __str__(self):
        return self.content_title

class InternshipOpportunities(models.Model):
    internship_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING)
    position_title = models.CharField(max_length=100)
    position_description = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    duration_months = models.IntegerField(blank=True, null=True)
    stipend_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    application_deadline = models.DateField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    is_remote = models.IntegerField(blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    posted_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'internship_opportunities'
        
    def __str__(self):
        return f"{self.position_title} at {self.company.company_name}"