from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_resource, name='upload_resource'),
    path('', views.get_resources, name='get_resources'),
]
