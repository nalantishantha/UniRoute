from django.db import models
from apps.accounts.models import Users

class AcademicResource(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    tags = models.JSONField(default=list, blank=True)
    file = models.FileField(upload_to='resources/')
    file_type = models.CharField(max_length=50)
    file_size = models.CharField(max_length=20)
    is_public = models.BooleanField(default=True)
    downloads = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='Available')
    author = models.CharField(max_length=255, blank=True, null=True)
    related_course = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(Users, on_delete=models.CASCADE)

    class Meta:
        db_table = 'academic_resources'

    def __str__(self):
        return self.title