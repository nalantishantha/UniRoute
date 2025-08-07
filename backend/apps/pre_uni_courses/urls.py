from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_course, name='create_course'),
    path('', views.get_courses, name='get_courses'),
    path('<int:course_id>/update/', views.update_course, name='update_course'),
    path('<int:course_id>/delete/', views.delete_course, name='delete_course'),
    path('stats/', views.get_course_stats, name='get_course_stats'),
]
