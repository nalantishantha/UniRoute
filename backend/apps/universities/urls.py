from django.urls import path
from . import views

urlpatterns = [
    # Universities
    path('', views.universities_list, name='universities_list'),
    
    # Faculties
    path('faculties/', views.faculties_list, name='faculties_list'),
    
    # Degree Programs
    path('degree-programs/', views.degree_programs_list, name='degree_programs_list'),
    
    # Degree Program Durations
    path('degree-program-durations/', views.degree_program_durations_list, name='degree_program_durations_list'),
    # Detailed universities endpoint (includes faculties count and degree programs)
    path('detailed/', views.universities_detailed_list, name='universities_detailed_list'),
    path('quick-stats/', views.universities_quick_stats, name='universities_quick_stats'),
    
    # University Events
    path('events/', views.get_university_events, name='get_university_events'),
    path('events/create/', views.create_university_event, name='create_university_event'),
    path('events/<int:event_id>/update/', views.update_university_event, name='update_university_event'),
    path('events/<int:event_id>/delete/', views.delete_university_event, name='delete_university_event'),
    
    # Admin functions for university request management
    path('requests/', views.university_requests_list, name='university_requests_list'),
    path('requests/<int:request_id>/approve/', views.approve_university_request, name='approve_university_request'),
    path('requests/<int:request_id>/reject/', views.reject_university_request, name='reject_university_request'),
]