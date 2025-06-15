from django.db import models
from django.contrib.auth.models import User

class Manga(models.Model):
    mangadex_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    cover_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.title

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    manga = models.ForeignKey(Manga, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'manga')

