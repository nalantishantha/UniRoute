from django.urls import path
from . import views

urlpatterns = [
    # Tutoring Sessions
    path('sessions/', views.get_tutoring_sessions, name='get_tutoring_sessions'),
    path('sessions/create/', views.create_tutoring_session, name='create_tutoring_session'),
    path('sessions/<int:session_id>/update/', views.update_tutoring_session, name='update_tutoring_session'),
    path('sessions/<int:session_id>/delete/', views.delete_tutoring_session, name='delete_tutoring_session'),
    
    # Tutors
    path('tutors/', views.get_tutors, name='get_tutors'),
    
    # Subjects
    path('subjects/', views.get_subjects, name='get_subjects'),
]
