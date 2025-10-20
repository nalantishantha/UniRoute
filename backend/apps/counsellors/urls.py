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
]