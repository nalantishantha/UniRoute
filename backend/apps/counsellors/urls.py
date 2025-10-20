from django.urls import path
from . import views

urlpatterns = [
    # Admin-only counsellor management endpoints
    path('admin/create/', views.admin_create_counsellor, name='admin_create_counsellor'),
    path('admin/list/', views.admin_list_counsellors, name='admin_list_counsellors'),
    path('admin/update/', views.admin_update_counsellor, name='admin_update_counsellor'),
    
    # Counsellor profile endpoints
    path('profile/<int:user_id>/', views.get_counsellor_profile, name='get_counsellor_profile'),
    path('profile/<int:user_id>/update/', views.update_counsellor_profile, name='update_counsellor_profile'),
]