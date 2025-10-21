from django.urls import path
from . import views
from . import counselling_session_views

urlpatterns = [
    # Public endpoint for students to view counsellors
    path('', views.list_counsellors, name='list_counsellors'),
    path('<int:counsellor_id>/', views.get_counsellor_details, name='get_counsellor_details'),
    
    # Admin-only counsellor management endpoints
    path('admin/create/', views.admin_create_counsellor, name='admin_create_counsellor'),
    path('admin/list/', views.admin_list_counsellors, name='admin_list_counsellors'),
    path('admin/update/', views.admin_update_counsellor, name='admin_update_counsellor'),
    
    # Counsellor profile endpoints
    path('profile/<int:user_id>/', views.get_counsellor_profile, name='get_counsellor_profile'),
    path('profile/<int:user_id>/update/', views.update_counsellor_profile, name='update_counsellor_profile'),
    
    # Counsellor settings endpoints
    path('settings/<int:user_id>/', views.get_counsellor_settings, name='get_counsellor_settings'),
    path('settings/<int:user_id>/update/', views.update_counsellor_settings, name='update_counsellor_settings'),
    path('settings/<int:user_id>/password/', views.change_counsellor_password, name='change_counsellor_password'),
    path('settings/<int:user_id>/delete/', views.delete_counsellor_account, name='delete_counsellor_account'),
    
    # Counselling session booking endpoints
    path('requests/<int:counsellor_id>/', counselling_session_views.CounsellingRequestsView.as_view(), name='counselling_requests'),
    path('sessions/<int:counsellor_id>/', counselling_session_views.CounsellingSessionsView.as_view(), name='counselling_sessions'),
    path('requests/<int:request_id>/accept/', counselling_session_views.accept_request, name='accept_counselling_request'),
    path('requests/<int:request_id>/decline/', counselling_session_views.decline_request, name='decline_counselling_request'),
    path('sessions/<int:session_id>/cancel/', counselling_session_views.cancel_session, name='cancel_counselling_session'),
    path('sessions/<int:session_id>/complete/', counselling_session_views.complete_session, name='complete_counselling_session'),
    path('stats/<int:counsellor_id>/', counselling_session_views.get_counsellor_stats, name='counsellor_stats'),
    
    # Counsellor availability management
    path('availability/<int:counsellor_id>/', counselling_session_views.CounsellorAvailabilityView.as_view(), name='counsellor_availability'),
    path('available-slots/<int:counsellor_id>/', counselling_session_views.AvailableTimeSlotsView.as_view(), name='counsellor_available_slots'),
]