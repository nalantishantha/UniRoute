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


class BlockedUser(models.Model):
    """Represents that blocker has blocked blocked_user."""
    id = models.AutoField(primary_key=True)
    blocker = models.ForeignKey('accounts.Users', on_delete=models.CASCADE, related_name='blocker_set')
    blocked_user = models.ForeignKey('accounts.Users', on_delete=models.CASCADE, related_name='blocked_set')
    blocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'blocked_users'
        unique_together = (('blocker', 'blocked_user'),)
