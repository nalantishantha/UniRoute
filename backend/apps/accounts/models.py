from django.db import models
from django.contrib.auth.models import AbstractUser

class UserTypes(models.Model):
    type_id = models.AutoField(primary_key=True)
    type_name = models.CharField(unique=True, max_length=30)

    class Meta:
        db_table = 'user_types'
        
    def __str__(self):
        return self.type_name

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_type = models.ForeignKey(UserTypes, models.DO_NOTHING)
    username = models.CharField(unique=True, max_length=50)
    email = models.CharField(unique=True, max_length=100)
    password_hash = models.CharField(max_length=255)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'users'
        
    def __str__(self):
        return self.username

class UserDetails(models.Model):
    detail_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, models.DO_NOTHING)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.IntegerField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'user_details'
        db_table_comment = 'User details table'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"