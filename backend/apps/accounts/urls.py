from django.urls import path
from . import views

urlpatterns = [
    path('register/student/', views.register_student, name='register_student'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout_user'),  
]