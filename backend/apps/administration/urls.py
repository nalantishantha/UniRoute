from django.urls import path
from . import views

urlpatterns = [
    path('admin/details/', views.get_admin_details, name='get_admin_details'),
    path('admin/profile/update/', views.update_admin_profile, name='update_admin_profile'),
    path('admin/password/change/', views.change_admin_password, name='change_admin_password'),
    path('admin/account/delete/', views.delete_admin_account, name='delete_admin_account'),

    path('reports/', views.get_reports, name='get_reports'),
    path('reports/<int:report_id>/', views.get_report_details, name='get_report_details'),
    path('reports/<int:report_id>/status/', views.update_report_status, name='update_report_status'),
    path('reports/<int:report_id>/action/', views.take_report_action, name='take_report_action'),
    path('reports/categories/', views.get_report_categories, name='get_report_categories'),
    path('reports/statistics/', views.get_report_statistics, name='get_report_statistics'),

    path('internships/', views.get_internships, name='get_internships'),
    path('internships/<int:internship_id>/', views.get_internship_details, name='get_internship_details'),
    path('internships/create/', views.create_internship, name='create_internship'),
    path('internships/<int:internship_id>/update/', views.update_internship, name='update_internship'),
    path('internships/<int:internship_id>/delete/', views.delete_internship, name='delete_internship'),
    path('internships/companies/', views.get_companies_for_internships, name='get_companies_for_internships'),
    path('internships/statistics/', views.get_internship_statistics, name='get_internship_statistics'),
    
    # Advertisement requests
    path('advertisement-requests/', views.get_advertisement_requests, name='get_advertisement_requests'),
    path('advertisement-requests/<int:booking_id>/approve/', views.approve_advertisement_request, name='approve_advertisement_request'),
    path('advertisement-requests/<int:booking_id>/reject/', views.reject_advertisement_request, name='reject_advertisement_request'),
]