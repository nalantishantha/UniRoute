from django.db import models

class MentoringPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    session = models.ForeignKey('mentoring.MentoringSessions', models.DO_NOTHING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'mentoring_payments'

class TutoringPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    booking = models.ForeignKey('tutoring.TutoringBooking', models.DO_NOTHING, db_column='booking_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    card_type = models.CharField(max_length=20, blank=True, null=True)
    card_holder_name = models.CharField(max_length=100, blank=True, null=True)
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tutoring_payments'