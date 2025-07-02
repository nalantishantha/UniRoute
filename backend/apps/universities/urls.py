from django.urls import path
from . import views

urlpatterns = [
    path('', views.universities_list, name='universities_list'),
]