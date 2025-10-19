from django.urls import path 
from . import views

urlpatterns = [
    path('profile/', views.get_student_profile, name='student-profile'),
    path('profile/update/', views.update_student_profile, name='update-student-profile'),
    path('', views.students_list, name='students-list'),
    path('mentors/', views.mentors_list, name='mentors_list'),
    path('mentoring/sessions/', views.create_mentoring_session, name='create_mentoring_session'),
    path('mentoring/requests-grouped/', views.get_student_mentoring_requests_grouped, name='get_student_mentoring_requests_grouped'),
    path('announcements/', views.get_published_announcements, name='get_published_announcements'),
]

