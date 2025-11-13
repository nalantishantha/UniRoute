

from django.urls import path
from . import views

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
    
    # Counsellor availability endpoints
    path('availability/<int:user_id>/', views.manage_counsellor_availability, name='manage_counsellor_availability'),
    
    # Counselling request and session endpoints
    path('requests/<int:counsellor_id>/', views.get_counselling_requests, name='get_counselling_requests'),
    path('sessions/<int:counsellor_id>/', views.get_counselling_sessions, name='get_counselling_sessions'),
    path('requests/<int:request_id>/accept/', views.accept_counselling_request, name='accept_counselling_request'),
    path('requests/<int:request_id>/decline/', views.decline_counselling_request, name='decline_counselling_request'),
    path('sessions/<int:session_id>/cancel/', views.cancel_counselling_session, name='cancel_counselling_session'),
    path('sessions/<int:session_id>/reschedule/', views.reschedule_counselling_session, name='reschedule_counselling_session'),
    path('sessions/<int:session_id>/complete/', views.complete_counselling_session, name='complete_counselling_session'),
    path('stats/<int:counsellor_id>/', views.get_counselling_stats, name='get_counselling_stats'),
]