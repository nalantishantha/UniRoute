from django.urls import path
from . import views

urlpatterns = [
    # Universities
    path('', views.universities_list, name='universities_list'),
    
    # University Events
    path('events/', views.get_university_events, name='get_university_events'),
    path('events/create/', views.create_university_event, name='create_university_event'),
    path('events/<int:event_id>/update/', views.update_university_event, name='update_university_event'),
    path('events/<int:event_id>/delete/', views.delete_university_event, name='delete_university_event'),
]