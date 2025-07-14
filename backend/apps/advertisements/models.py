from django.db import models

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
    company = models.ForeignKey('companies.Companies', models.DO_NOTHING, blank=True, null=True)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING, blank=True, null=True)
    title = models.CharField(max_length=255)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    target_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'advertisements'

class AdBookings(models.Model):
    booking_id = models.AutoField(primary_key=True)
    ad = models.ForeignKey(Advertisements, models.DO_NOTHING)
    space = models.ForeignKey(AdSpaces, models.DO_NOTHING)
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=9, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ad_bookings'