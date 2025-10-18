from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.pre_mentor_dashboard, name='pre_mentor_dashboard'),
    path('profile/', views.pre_mentor_profile, name='pre_mentor_profile'),
    path('sessions/', views.pre_mentor_sessions, name='pre_mentor_sessions'),
    path('earnings/', views.pre_mentor_earnings, name='pre_mentor_earnings'),
    path('availability/', views.pre_mentor_availability, name='pre_mentor_availability'),
    path('settings/', views.pre_mentor_settings, name='pre_mentor_settings'),
    path('request-mentor/', views.request_mentor_status, name='request_mentor_status'),
    path('mentor-status/', views.check_mentor_status, name='check_mentor_status'),
]
