from django.urls import path
from apps.administration import views

urlpatterns = [
    path('internships/', views.get_internships),
    path('internships/<int:internship_id>/', views.get_internship_details),
    path('internships/create/', views.create_internship),
    path('internships/<int:internship_id>/update/', views.update_internship),
    path('internships/<int:internship_id>/delete/', views.delete_internship),
    path('internships/companies/', views.get_companies_for_internships),
    path('internships/statistics/', views.get_internship_statistics),
]