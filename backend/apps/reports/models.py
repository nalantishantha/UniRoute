from django.db import models


class AdminReportRecord(models.Model):
    report_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    requested_by = models.ForeignKey(
        'accounts.Users',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='generated_admin_reports'
    )
    file_path = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0)
    data_snapshot = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'admin_reports'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.title} ({self.start_date} - {self.end_date})"
