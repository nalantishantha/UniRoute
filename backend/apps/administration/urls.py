from django.urls import path
from . import views

urlpatterns = [
    path('admin/details/', views.get_admin_details, name='get_admin_details'),
    path('admin/profile/update/', views.update_admin_profile, name='update_admin_profile'),
    path('admin/password/change/', views.change_admin_password, name='change_admin_password'),
    path('admin/account/delete/', views.delete_admin_account, name='delete_admin_account'),
]