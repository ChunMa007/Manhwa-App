from rest_framework import serializers
from manga.models import Manga, Favorite

class MangaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manga
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    manga = MangaSerializer()
    
    class Meta:
        model = Favorite
        fields = ['id', 'manga', 'added_at']