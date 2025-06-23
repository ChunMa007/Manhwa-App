from django.urls import path
from manga.views import (
    FavoritesListCreateAPIView, 
    FavoritesDestroyAPIView,
    UserRetrieveUpdateAPIView,
    ChangePasswordView
)
from .views import (get_popular_mangas, 
                    get_manga_chapter, 
                    get_manga_page, 
                    get_manga_images, 
                    search_manga,
                    register_user,
                    login_user,
    )


urlpatterns = [
    path('search/<str:query>/', search_manga),
    path('user/', UserRetrieveUpdateAPIView.as_view()),
    path('user/change-password/', ChangePasswordView.as_view()),
    path('user-favorites/', FavoritesListCreateAPIView.as_view()),
    path('user-favorites/<str:id>/', FavoritesDestroyAPIView.as_view()),
    path('popular-mangas/', get_popular_mangas), #Get popular mangas 
    path('manga-chapters/<str:manga_id>/', get_manga_chapter),  #Get the manga chapters
    path('manga/<str:manga_id>/', get_manga_page),  #Custom api endpoint for displaying manga
    path('chapter/<str:chapter_id>/', get_manga_images), #Get all the images of a chapter
    path('register/', register_user), #API endpoint for registering user
    path('login/', login_user), #API endpoint for logging in user
]
