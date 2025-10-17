from django.urls import path
from . import views

urlpatterns = [
    path('by-user/<int:user_id>/', views.get_university_student_by_user, name='university_student_by_user'),
]
