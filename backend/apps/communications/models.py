from django.db import models

class Messages(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey('accounts.Users', models.DO_NOTHING)
    receiver = models.ForeignKey('accounts.Users', models.DO_NOTHING, related_name='messages_receiver_set')
    message_text = models.TextField()
    sent_at = models.DateTimeField(blank=True, null=True)
    is_read = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'messages'
