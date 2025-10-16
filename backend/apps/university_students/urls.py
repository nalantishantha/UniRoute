from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/upload-avatar/', views.upload_avatar, name='upload_avatar'),
]