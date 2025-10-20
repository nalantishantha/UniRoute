from django.urls import path
from . import views
from . import recent_activities_views

urlpatterns = [
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/upload-avatar/', views.upload_avatar, name='upload_avatar'),
    path('user/<int:user_id>/feedback/', views.get_university_student_feedback, name='university_student_feedback'),
    path('user/<int:user_id>/feedback/export/', views.export_feedback_report, name='export_feedback_report'),
    path('user/<int:user_id>/recent-activities/', recent_activities_views.get_recent_activities, name='recent_activities'),
    path('user/<int:user_id>/dashboard-stats/', recent_activities_views.get_dashboard_stats, name='dashboard_stats'),
    path('user/<int:user_id>/earnings/', views.get_university_student_earnings, name='university_student_earnings'),
    path('by-user/<int:user_id>/', views.get_university_student_by_user, name='university_student_by_user'),
]
