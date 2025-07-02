from django.db import models

class ContentReports(models.Model):
    report_id = models.AutoField(primary_key=True)
    reporter = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    reported_content_type = models.CharField(max_length=50, blank=True, null=True)
    reported_content_id = models.IntegerField(blank=True, null=True)
    report_reason = models.CharField(max_length=100, blank=True, null=True)
    report_description = models.TextField(blank=True, null=True)
    report_date = models.DateTimeField(blank=True, null=True)
    report_status = models.CharField(max_length=20, blank=True, null=True)
    admin_action = models.CharField(max_length=50, blank=True, null=True)
    admin_notes = models.TextField(blank=True, null=True)
    resolved_date = models.DateTimeField(blank=True, null=True)
    resolved_by = models.ForeignKey('accounts.Users', models.DO_NOTHING, related_name='resolved_reports', blank=True, null=True)

    class Meta:
        db_table = 'content_reports'
        
    def __str__(self):
        return f"Report {self.report_id} - {self.report_reason}"