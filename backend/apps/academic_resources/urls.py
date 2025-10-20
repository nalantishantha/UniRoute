from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_resource, name='upload_resource'),
    path('download/<int:resource_id>/', views.download_resource, name='download_resource'),
    path('', views.get_resources, name='get_resources'),
]
