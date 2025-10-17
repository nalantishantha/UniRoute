from django.urls import path
from . import views

urlpatterns = [
    path('user/<int:user_id>/feedback/', views.get_university_student_feedback, name='university_student_feedback'),
]