from django.urls import path 
from . import views

urlpatterns = [
    path('', views.students_list, name='students-list'),
    path('mentors/', views.mentors_list, name='mentors_list'),
    path('mentoring/sessions/', views.create_mentoring_session, name='create_mentoring_session'),
]

