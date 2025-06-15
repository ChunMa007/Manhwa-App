from django.urls import path
from manga.views import MangaSearchView, AddFavoriteView, UserFavoritesView, FavoriteDeleteView
from .views import get_popular_mangas, get_manga_chapter, get_manga_page

urlpatterns = [
    path('search/', MangaSearchView.as_view()),
    path('favorites/', AddFavoriteView.as_view()),
    path('favorites/<int:pk>/', FavoriteDeleteView.as_view()),
    path('user-favorites/', UserFavoritesView.as_view()),
    path('popular-mangas/', get_popular_mangas),
    path('manga-chapters/<str:manga_id>/', get_manga_chapter),
    path('manga/<str:manga_id>/', get_manga_page),
]
