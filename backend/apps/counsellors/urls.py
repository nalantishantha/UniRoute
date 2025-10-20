from django.urls import path
from . import views

urlpatterns = [
    # Admin-only counsellor management endpoints
    path('admin/create/', views.admin_create_counsellor, name='admin_create_counsellor'),
    path('admin/list/', views.admin_list_counsellors, name='admin_list_counsellors'),
    path('admin/update/', views.admin_update_counsellor, name='admin_update_counsellor'),
]