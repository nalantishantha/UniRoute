from django.urls import path
from . import views

urlpatterns = [
    # Mentoring Sessions
    path('sessions/', views.get_mentoring_sessions, name='get_mentoring_sessions'),
    path('sessions/create/', views.create_mentoring_session, name='create_mentoring_session'),
    path('sessions/<int:session_id>/update/', views.update_mentoring_session, name='update_mentoring_session'),
    path('sessions/<int:session_id>/delete/', views.delete_mentoring_session, name='delete_mentoring_session'),
    path('sessions/enroll/', views.enroll_in_mentoring_session, name='enroll_in_mentoring_session'),
    
    # Mentors
    path('mentors/', views.get_mentors, name='get_mentors'),
]
