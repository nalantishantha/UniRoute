from django.urls import path
from . import views

urlpatterns = [
    path('requests/<int:mentor_id>/', views.MentoringRequestsView.as_view(), name='mentoring_requests'),
    path('sessions/<int:mentor_id>/', views.MentoringSessionsView.as_view(), name='mentoring_sessions'),
    path('all-sessions/<int:mentor_id>/', views.get_all_sessions, name='all_sessions'),
    path('requests/<int:request_id>/accept/', views.accept_request, name='accept_request'),
    path('requests/<int:request_id>/decline/', views.decline_request, name='decline_request'),
    path('sessions/<int:session_id>/cancel/', views.cancel_session, name='cancel_session'),
    path('sessions/<int:session_id>/reschedule/', views.reschedule_session, name='reschedule_session'),
    path('sessions/<int:session_id>/complete/', views.complete_session, name='complete_session'),
    path('stats/<int:mentor_id>/', views.get_mentor_stats, name='mentor_stats'),
]
