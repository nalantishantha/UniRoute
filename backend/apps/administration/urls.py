from django.urls import path
from . import views
from .additional_views import (
    get_all_users, get_all_students, get_all_university_students, get_all_universities,
    update_student_status, delete_student, get_student_details,
    update_university_student_status, delete_university_student, get_university_student_details,
    update_university_student, get_university_details, update_university_status, 
    delete_university, update_university, create_university,
    get_all_companies, get_company_details, update_company, delete_company, create_company
)

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
    path('content/published-courses/', views.get_published_courses_overview, name='get_published_courses_overview'),
    path('content/mentoring-sessions/', views.get_mentoring_sessions_overview, name='get_mentoring_sessions_overview'),
    path('content/tutoring-sessions/', views.get_tutoring_sessions_overview, name='get_tutoring_sessions_overview'),
    path('content/internships/overview/', views.get_internships_overview, name='get_internships_overview'),
    
    # Advertisement requests
    path('advertisement-requests/', views.get_advertisement_requests, name='get_advertisement_requests'),
    path('advertisement-requests/<int:booking_id>/approve/', views.approve_advertisement_request, name='approve_advertisement_request'),
    path('advertisement-requests/<int:booking_id>/reject/', views.reject_advertisement_request, name='reject_advertisement_request'),
    
    # Dashboard statistics
    path('dashboard/statistics/', views.get_dashboard_statistics, name='get_dashboard_statistics'),
    
    # Admin management endpoints
    path('users/', get_all_users, name='get_all_users'),
    path('students/', get_all_students, name='get_all_students'),
    path('students/<int:student_id>/', get_student_details, name='get_student_details'),
    path('students/<int:student_id>/status/', update_student_status, name='update_student_status'),
    path('students/<int:student_id>/delete/', delete_student, name='delete_student'),
    path('university-students/', get_all_university_students, name='get_all_university_students'),
    path('university-students/<int:university_student_id>/', get_university_student_details, name='get_university_student_details'),
    path('university-students/<int:university_student_id>/update/', update_university_student, name='update_university_student'),
    path('university-students/<int:university_student_id>/status/', update_university_student_status, name='update_university_student_status'),
    path('university-students/<int:university_student_id>/delete/', delete_university_student, name='delete_university_student'),
    path('universities/', get_all_universities, name='get_all_universities'),
    path('universities/create/', create_university, name='create_university'),
    path('universities/<int:university_id>/', get_university_details, name='get_university_details'),
    path('universities/<int:university_id>/update/', update_university, name='update_university'),
    path('universities/<int:university_id>/status/', update_university_status, name='update_university_status'),
    path('universities/<int:university_id>/delete/', delete_university, name='delete_university'),
    path('companies/', get_all_companies, name='get_all_companies'),
    path('companies/create/', create_company, name='create_company'),
    path('companies/<int:company_id>/', get_company_details, name='get_company_details'),
    path('companies/<int:company_id>/update/', update_company, name='update_company'),
    path('companies/<int:company_id>/delete/', delete_company, name='delete_company'),
]