from django.urls import path
from . import views

urlpatterns = [
    # Video upload and management
    path('upload/', views.upload_video, name='upload_video'),
    path('tutor/<int:tutor_id>/', views.get_tutor_videos, name='get_tutor_videos'),
    path('all/', views.get_all_videos, name='get_all_videos'),
    path('<int:video_id>/', views.get_video_detail, name='get_video_detail'),
    path('<int:video_id>/delete/', views.delete_video, name='delete_video'),
    
    # Supporting endpoints
    path('subjects/', views.get_subjects, name='get_subjects'),
    path('analytics/<int:tutor_id>/', views.get_video_analytics, name='get_video_analytics'),
]
