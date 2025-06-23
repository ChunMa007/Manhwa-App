from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    profile = models.ImageField(null=True, blank=True, upload_to='user-profile/', default='user-profile/default/Default.webp')

# class Manga(models.Model):
#     mangadex_id = models.CharField(max_length=100, unique=True)
#     title = models.CharField(max_length=255)
#     cover_url = models.URLField(blank=True, null=True)
    
#     def __str__(self):
#         return self.title

class Favorites(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id = models.CharField(primary_key=True)
    title = models.CharField()
    status = models.CharField()
    cover_art = models.CharField()
    added_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} {self.id}"
    
    class Meta:
        verbose_name_plural = "Favorites"
