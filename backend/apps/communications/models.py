from django.db import models

class Messages(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey('accounts.Users', models.DO_NOTHING, related_name='sent_messages')
    receiver = models.ForeignKey('accounts.Users', models.DO_NOTHING, related_name='received_messages')
    message_subject = models.CharField(max_length=200, blank=True, null=True)
    message_content = models.TextField()
    sent_date = models.DateTimeField(blank=True, null=True)
    is_read = models.IntegerField(blank=True, null=True)
    message_type = models.CharField(max_length=20, blank=True, null=True)
    parent_message = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'messages'
        
    def __str__(self):
        return f"Message {self.message_id} - {self.message_subject}"