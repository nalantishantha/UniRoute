from django.db import models
from apps.accounts.models import Users

class ReportCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report_categories'
    
    def __str__(self):
        return self.category_name

class Report(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected')
    ]
    
    report_id = models.AutoField(primary_key=True)
    reporter = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='reports_made')
    reported_user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='reports_received', null=True, blank=True)
    category = models.ForeignKey(ReportCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    admin_action = models.TextField(blank=True, null=True)
    assigned_admin = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_reports')
    evidence_files = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.status}"

class ReportAction(models.Model):
    ACTION_CHOICES = [
        ('warning', 'Warning Issued'),
        ('suspend', 'Account Suspended'),
        ('ban', 'Account Banned'),
        ('content_removed', 'Content Removed'),
        ('no_action', 'No Action Required'),
        ('referred', 'Referred to Higher Authority')
    ]
    
    action_id = models.AutoField(primary_key=True)
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='actions')
    admin = models.ForeignKey(Users, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=20, choices=ACTION_CHOICES)
    action_details = models.TextField()
    duration_days = models.IntegerField(null=True, blank=True)  # For suspensions
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report_actions'
    
    def __str__(self):
        return f"{self.action_type} - {self.report.title}"