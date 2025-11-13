from django.urls import path
from . import views
from .mentor_api_views import MentorByUniversityStudentView
from .user_mentor_status_view import UserMentorStatusView
from . import video_call_views

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
    path('feedback/<int:mentor_id>/', views.get_mentor_feedback, name='mentor_feedback'),
    
    # Feedback submission
    path('sessions/feedback/submit/', views.submit_session_feedback, name='submit_session_feedback'),
    path('sessions/<int:session_id>/feedback/check/', views.check_session_feedback, name='check_session_feedback'),
    
    # Availability management
    path('availability/<int:mentor_id>/', views.MentorAvailabilityView.as_view(), name='mentor_availability'),
    path('available-slots/<int:mentor_id>/', views.AvailableTimeSlotsView.as_view(), name='available_slots'),
    
    # Mentor lookup by university student
    path('by-university-student/<int:university_student_id>/', MentorByUniversityStudentView.as_view(), name='mentor_by_university_student'),
    # Check if a given user (or current user) is a mentor
    path('user-status/', UserMentorStatusView.as_view(), name='user_mentor_status'),
    path('user-status/<int:user_id>/', UserMentorStatusView.as_view(), name='user_mentor_status_by_id'),
    
    # Video call endpoints
    path('video-call/create/', video_call_views.create_video_room, name='create_video_room'),
    path('video-call/<str:room_id>/', video_call_views.get_video_room, name='get_video_room'),
    path('video-call/<str:room_id>/join/', video_call_views.join_video_room, name='join_video_room'),
    path('video-call/<str:room_id>/end/', video_call_views.end_video_room, name='end_video_room'),
    path('video-call/session/<int:session_id>/', video_call_views.get_room_by_session, name='get_room_by_session'),
]
