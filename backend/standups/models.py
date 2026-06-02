from django.db import models

class StandupPost(models.Model):
    author = models.CharField(max_length=100)
    yesterday = models.TextField()
    today = models.TextField()
    blockers = models.TextField(blank=True)
    has_blocker = models.BooleanField(default=False)
    attachment = models.FileField(upload_to='attachments/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
