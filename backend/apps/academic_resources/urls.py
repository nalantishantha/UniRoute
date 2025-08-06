from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_resource, name='upload_resource'),
    path('', views.get_resources, name='get_resources'),
    path('<int:resource_id>/update/', views.update_resource, name='update_resource'),
    path('<int:resource_id>/delete/', views.delete_resource, name='delete_resource'),
]