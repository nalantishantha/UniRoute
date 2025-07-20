from django.urls import path
from . import views

urlpatterns = [
    path('', views.mentors_list, name='mentors_list'),
]
