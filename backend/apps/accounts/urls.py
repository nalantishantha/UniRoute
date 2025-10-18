from django.urls import path
from . import views

urlpatterns = [
    path('register/student/', views.register_student, name='register_student'),
    path('register/university-student/', views.register_university_student, name='register_university_student'),
    path('register/university/', views.register_university, name='register_university'),
    path('register/company/', views.register_company, name='register_company'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout_user'),
    path('upgrade-to-pre-mentor/', views.upgrade_to_pre_mentor, name='upgrade_to_pre_mentor'),
    path('user-state/', views.get_user_state, name='get_user_state'),
]