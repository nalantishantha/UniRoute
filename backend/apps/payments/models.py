from django.db import models

class TutoringPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('tutoring.TutoringSessions', models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    tutor = models.ForeignKey('tutoring.Tutors', models.DO_NOTHING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, blank=True, null=True)
    payment_status = models.CharField(max_length=15, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    transaction_reference = models.CharField(max_length=100, blank=True, null=True)
    processing_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'tutoring_payments'
        
    def __str__(self):
        return f"Tutoring Payment {self.payment_id}"

class MentoringPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    session = models.ForeignKey('mentoring.MentoringSessions', models.DO_NOTHING)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    mentor = models.ForeignKey('mentoring.Mentors', models.DO_NOTHING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, blank=True, null=True)
    payment_status = models.CharField(max_length=15, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    transaction_reference = models.CharField(max_length=100, blank=True, null=True)
    processing_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'mentoring_payments'
        
    def __str__(self):
        return f"Mentoring Payment {self.payment_id}"