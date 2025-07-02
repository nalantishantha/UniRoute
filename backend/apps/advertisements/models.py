from django.db import models

class AdSpaces(models.Model):
    space_id = models.AutoField(primary_key=True)
    space_name = models.CharField(max_length=100)
    space_description = models.TextField(blank=True, null=True)
    space_location = models.CharField(max_length=50, blank=True, null=True)
    space_size = models.CharField(max_length=50, blank=True, null=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_available = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'ad_spaces'
        
    def __str__(self):
        return self.space_name

class Advertisements(models.Model):
    ad_id = models.AutoField(primary_key=True)
    company = models.ForeignKey('companies.Companies', models.DO_NOTHING)
    ad_title = models.CharField(max_length=200)
    ad_description = models.TextField(blank=True, null=True)
    ad_content = models.TextField(blank=True, null=True)
    ad_image_url = models.CharField(max_length=500, blank=True, null=True)
    target_audience = models.CharField(max_length=100, blank=True, null=True)
    ad_type = models.CharField(max_length=30, blank=True, null=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'advertisements'
        
    def __str__(self):
        return self.ad_title

class AdBookings(models.Model):
    booking_id = models.AutoField(primary_key=True)
    ad = models.ForeignKey(Advertisements, models.DO_NOTHING)
    space = models.ForeignKey(AdSpaces, models.DO_NOTHING)
    booking_date = models.DateField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    booking_status = models.CharField(max_length=15, blank=True, null=True)
    payment_status = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        db_table = 'ad_bookings'
        
    def __str__(self):
        return f"Booking {self.booking_id}"