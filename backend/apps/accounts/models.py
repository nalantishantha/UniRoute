from django.db import models
from django.utils import timezone


class UserDailyLogin(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, related_name='daily_logins')
    login_date = models.DateField()
    login_count = models.PositiveIntegerField(default=0)
    last_login_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'user_daily_logins'
        unique_together = ('user', 'login_date')


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

class UserDetails(models.Model):
    user = models.OneToOneField(Users, models.DO_NOTHING, primary_key=True)
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


class EmailVerification(models.Model):
    class Purpose(models.TextChoices):
        UNI_STUDENT_REGISTRATION = 'uni_student_registration', 'University Student Registration'

    verification_id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=100, db_index=True)
    otp = models.CharField(max_length=6)
    purpose = models.CharField(max_length=64, choices=Purpose.choices)
    is_verified = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_sent_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    verified_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'email_verifications'
        indexes = [
            models.Index(fields=['email', 'purpose']),
        ]
        constraints = [
            models.UniqueConstraint(fields=['email', 'purpose'], name='unique_email_purpose'),
        ]

    def __str__(self):
        return f"{self.email} ({self.get_purpose_display()})"