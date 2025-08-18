from django.urls import path 
from . import views

urlpatterns = [
    path('profile/', views.get_student_profile, name='student-profile'),
    path('profile/update/', views.update_student_profile, name='update-student-profile'),
]

