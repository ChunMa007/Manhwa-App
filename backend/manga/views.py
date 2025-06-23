import requests
import os
from django.conf import settings
from datetime import datetime, date
from manga.serializers import (
    FavoritesSerializer,
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)
from .models import Favorites, User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, DestroyAPIView, RetrieveUpdateAPIView
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

class MangaSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.get(f"https://api.mangadex.org/manga?title={query}")
        data = response.json()
        return Response(data)

class FavoritesListCreateAPIView(ListCreateAPIView):
    serializer_class = FavoritesSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Favorites.objects.filter(
            user=self.request.user,
        ).order_by('-added_at')

class FavoritesDestroyAPIView(DestroyAPIView):
    queryset = Favorites.objects.all()
    serializer_class = FavoritesSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'id'

class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()
        print(user.password)
        if request.data.get('reset_profile') == 'true':
            if user.profile.name != 'user-profile/default/Default.webp':
                old_path = os.path.join(settings.MEDIA_ROOT, user.profile.name)
                if os.path.exists(old_path):
                    os.remove(old_path)
            user.profile = 'user-profile/default/Default.webp'
            user.save()
            return Response(self.get_serializer(user).data)
        return super().partial_update(request, *args, **kwargs)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_new_password = request.data.get('confirm_new_password')
        
        
        if not user.check_password(old_password):
            return Response({"message": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_new_password:
            return Response({"message": "Passwords do not match. Please try again."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)



# class AddFavoriteView(APIView):
#     # permission_classes = [IsAuthenticated]
    
#     def post(self, request):
#         mangadex_id = request.data.get('id')
#         title = request.data.get('title')
#         cover = request.data.get('cover')
        
#         manga, created = Manga.objects.get_or_create(
#             mangadex_id=mangadex_id,
#             defaults={'title': title, 'cover_url': cover}
#         )
        
#         Favorite.objects.get_or_create(user=request.user, manga=manga)
#         return Response({"message": "Manga added to favorites."})

# class UserFavoritesView(APIView):
#     # permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         favorites = Favorite.objects.filter(user=request.user)
#         serializer = FavoriteSerializer(favorites, many=True)
#         return Response(serializer.data)

# class FavoriteDeleteView(generics.DestroyAPIView):
#     queryset = Favorite.objects.all()
#     serializer_class = FavoriteSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return Favorite.objects.filter(user=self.request.user)
    
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User Registered Successfuly'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_token_for_user(user)
        return Response({
            "message": "Login Successfully", 
            "username": user.username,
            "tokens": tokens,

        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_token_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['GET'])
def search_manga(request, query):
    limit = request.GET.get('limit', 30)
    offset = request.GET.get('offset', 0)
    
    try:
        response = requests.get(
            f'https://api.mangadex.org/manga?title={query}',              
            params={
                'includes[]': ['cover_art'],
                'limit': limit,
                'offset': offset                
            }
        )
        
        response.raise_for_status()
        return Response(transform_popular_mangas_response(response.json()))
    except requests.exceptions.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_popular_mangas(request):
    try:
        limit = request.GET.get('limit', 30)
        offset = request.GET.get('offset', 0)
        
        response = requests.get(
            'http://api.mangadex.org/manga',
            params = {
                'includes[]': ['cover_art'],
                'order[rating]': 'desc',
                'limit': limit,
                'offset': offset,
            }
        )
        response.raise_for_status()
        return Response(transform_popular_mangas_response(response.json()))
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def transform_popular_mangas_response(popular_mangas):
    transformed_data = []
    
    for data in popular_mangas.get('data', {}):
        manga_id = data.get('id')
        manga_title = data.get('attributes').get('title').get('en') or data.get('attributes').get('title').get('ja-ro')
        manga_status = data.get('attributes').get('status')
        
        for relationship in data.get('relationships'):
            if relationship.get('type') == 'cover_art':
                manga_cover_art = relationship.get('attributes', {}).get('fileName')
        
        transformed_data.append({
            'id': manga_id, 
            'title': manga_title,
            'status': manga_status,
            'cover_art': f'https://uploads.mangadex.org/covers/{manga_id}/{manga_cover_art}'
        })
                
                
    return { 'data': transformed_data, 'total': len(transformed_data) }

@api_view(['GET'])
def get_manga_chapter(request, manga_id):
    try:
        response = requests.get(
            f'http://api.mangadex.org/manga/{manga_id}/feed',
            params={
                "order[chapter]": "asc",
                "limit": 100,
                "translatedLanguage[]": ["en", "ja", "es"],
                **request.query_params
            }
        )
        response.raise_for_status()
        return Response(transform_manga_chapter(response.json()))
    except requests.exceptions.RequestException as e:
        return response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def transform_manga_chapter(chapter_response):
    data = []
    
    for chapter in chapter_response.get('data', {}):
        id = chapter.get('id')
        manga_type = chapter.get('type')
        volume = chapter.get('attributes', {}).get('volume')
        manga_chapter = chapter.get('attributes', {}).get('chapter')
        manga_title = chapter.get('attributes', {}).get('title')
        
        date = chapter.get('attributes', {}).get('publishAt')
        dt = datetime.fromisoformat(date)
        publishAt = dt.strftime("%B %d, %Y")
        
        data.append({'id': id, 
                     'type': manga_type, 
                     'volume': volume, 
                     'chapter': manga_chapter, 
                     'chapter_title': manga_title, 
                     'publishAt': publishAt})
    
    return { 'data': data }

@api_view(['GET'])
def get_manga_images(request, chapter_id):
    try:
        response = requests.get(f'http://api.mangadex.org/at-home/server/{chapter_id}')
        response.raise_for_status()
        return Response(transform_response(response.json()))
    except requests.exceptions.RequestException as e:
        return response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
def transform_response(mangadex_data):
    baseUrl = mangadex_data.get('baseUrl')
    hash = mangadex_data.get('chapter', {}).get('hash')

    raw_data = mangadex_data.get('chapter', {}).get('data')
    newdata = [f'{baseUrl}/data/{hash}/{data}' for data in raw_data]
    
    return {
        'baseUrl': baseUrl,
        'hash': hash,
        'data': newdata
    }

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
    except requests.exceptions.RequestException as e:
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