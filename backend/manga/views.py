import requests
from datetime import datetime
from manga.serializers import MangaSerializer, FavoriteSerializer
from manga.models import Manga, Favorite
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.decorators import api_view

class MangaSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.get(f"https://api.mangadex.org/manga?title={query}")
        data = response.json()
        return Response(data)

class AddFavoriteView(APIView):
    # permission_classes = [IsAuthenticated]
    
    def post(self, request):
        mangadex_id = request.data.get('id')
        title = request.data.get('title')
        cover = request.data.get('cover')
        
        manga, created = Manga.objects.get_or_create(
            mangadex_id=mangadex_id,
            defaults={'title': title, 'cover_url': cover}
        )
        
        Favorite.objects.get_or_create(user=request.user, manga=manga)
        return Response({"message": "Manga added to favorites."})

class UserFavoritesView(APIView):
    # permission_classes = [IsAuthenticated]
    
    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

class FavoriteDeleteView(generics.DestroyAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

@api_view(['GET'])
def get_popular_mangas(request):
    try:
        response = requests.get(
            'http://api.mangadex.org/manga',
            params = {
                'includes[]': ['cover_art'],
                'order[rating]': 'desc',
                'limit': 20,
            }
        )
        response.raise_for_status()
        return Response(response.json())
    except request.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_manga_chapter(request, manga_id):
    try:
        response = requests.get(
            f'http://api.mangadex.org/manga/{manga_id}/feed',
            params={
                "order[chapter]": "asc",
                "limit": 100,
                "translatedLanguage[]": "en",
                **request.query_params
            }
        )
        response.raise_for_status()
        return Response(response.json())
    except request.exceptions.RequestException as e:
        return response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_manga_page(request, manga_id):
    try:
        response = requests.get(
            f'http://api.mangadex.org/manga/{manga_id}',
            params={
                'includes[]': ['author', 'artist', 'cover_art'],
                
            }
        )
        
        response.raise_for_status()
        
        return Response(transform_mangadex_response(response.json()))
    except request.exceptions.RequestException as e:
        return response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def transform_mangadex_response(mangadex_data):
    data = mangadex_data.get('data', {})
    attributes = data.get('attributes', {})

    id = data.get('id')
    description = attributes.get('description', {}).get('en')
    title = attributes.get('title', {}).get('en')
    
    if not title and attributes.get('altTitles'):
        for alt_titles in attributes.get('altTitles', {}):
            if 'en' in alt_titles:
                title = alt_titles['en']
    
    manga_type = data.get('type', "No type Found")
    
    altTitles = []
    for alt_title in attributes.get('altTitles', []):
        for value in alt_title.values():
            altTitles.append(value)
    
    genres = []
    for tag in attributes.get('tags', []):
        genres.append(tag.get('attributes', {}).get('name', {}).get('en'))
    
    status = attributes.get('status')
    
    updated_at = attributes.get('updatedAt')
    dt = datetime.fromisoformat(updated_at)
    formatted_date = dt.strftime("%B %d, %Y")
    
    author = None
    artist = None
    cover_art_file_name = None
    
    for relationship in data.get('relationships', {}):
        if relationship.get('type') == "author":
            author = relationship.get('attributes', {}).get('name')
        elif relationship.get('type') == "artist":
            artist = relationship.get('attributes', {}).get('name')
        elif relationship.get('type') == 'cover_art':
            cover_art_file_name = relationship.get('attributes', {}).get('fileName')
            
    return {
        'id': id,
        'type': manga_type,
        'title': title,
        'altTitles': altTitles,
        'description': description,
        'status': status,
        'genres': genres,
        'updatedAt': formatted_date,
        'author': author,
        'artist': artist,
        'cover_url': f'https://uploads.mangadex.org/covers/{id}/{cover_art_file_name}'
    }