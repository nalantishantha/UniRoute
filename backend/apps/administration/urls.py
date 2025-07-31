from django.urls import path
from . import views

urlpatterns = [
    # user management
    path('users/', views.get_all_users, name='get_all_users'),
    path('users/types/', views.get_user_types, name='get_user_types'),
    path('users/<int:user_id>/toggle-status/', views.toggle_user_status, name='toggle_user_status'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('users/statistics/', views.get_user_statistics, name='get_user_statistics'),
    
    # student
    path('students/', views.get_all_students, name='get_all_students'),
    path('students/<int:student_id>/', views.get_student_details, name='get_student_details'),
    path('students/<int:student_id>/toggle-status/', views.toggle_student_status, name='toggle_student_status'),
    path('students/<int:student_id>/delete/', views.delete_student, name='delete_student'),
    path('students/statistics/', views.get_student_statistics, name='get_student_statistics'),
    
    # university student
    path('university-students/', views.get_all_university_students, name='get_all_university_students'),
    path('university-students/<int:university_student_id>/', views.get_university_student_details, name='get_university_student_details'),
    path('university-students/<int:university_student_id>/toggle-status/', views.toggle_university_student_status, name='toggle_university_student_status'),
    path('university-students/<int:university_student_id>/delete/', views.delete_university_student, name='delete_university_student'),
    path('university-students/statistics/', views.get_university_student_statistics, name='get_university_student_statistics'),
    path('university-students/filter-options/', views.get_university_filter_options, name='get_university_filter_options'),
    
    # university
    path('universities/', views.get_all_universities, name='get_all_universities'),
    path('universities/<int:university_id>/', views.get_university_details, name='get_university_details'),
    path('universities/<int:university_id>/toggle-status/', views.toggle_university_status, name='toggle_university_status'),
    path('universities/<int:university_id>/delete/', views.delete_university, name='delete_university'),
    path('universities/statistics/', views.get_university_statistics, name='get_university_statistics'),
    path('universities/filter-options/', views.get_university_filter_options, name='get_university_filter_options'),
    
    # company
    path('companies/', views.get_all_companies, name='get_all_companies'),
    path('companies/<int:company_id>/', views.get_company_details, name='get_company_details'),
    path('companies/<int:company_id>/delete/', views.delete_company, name='delete_company'),
    path('companies/statistics/', views.get_company_statistics, name='get_company_statistics'),
    path('companies/filter-options/', views.get_company_filter_options, name='get_company_filter_options'),
    
    # mentor 
    path('mentors/', views.get_all_mentors, name='get_all_mentors'),
    path('mentors/<int:mentor_id>/', views.get_mentor_details, name='get_mentor_details'),
    # path('mentors/<int:mentor_id>/toggle-approval/', views.toggle_mentor_approval, name='toggle_mentor_approval'),
    # path('mentors/<int:mentor_id>/toggle-status/', views.toggle_mentor_status, name='toggle_mentor_status'),
    path('mentors/<int:mentor_id>/delete/', views.delete_mentor, name='delete_mentor'),
    path('mentors/statistics/', views.get_mentor_statistics, name='get_mentor_statistics'),
    path('mentors/filter-options/', views.get_mentor_filter_options, name='get_mentor_filter_options'),
    
    # tutor 
    path('tutors/', views.get_all_tutors, name='get_all_tutors'),
    path('tutors/<int:tutor_id>/', views.get_tutor_details, name='get_tutor_details'),
    path('tutors/<int:tutor_id>/toggle-status/', views.toggle_tutor_status, name='toggle_tutor_status'),
    path('tutors/<int:tutor_id>/delete/', views.delete_tutor, name='delete_tutor'),
    path('tutors/statistics/', views.get_tutor_statistics, name='get_tutor_statistics'),
    path('tutors/filter-options/', views.get_tutor_filter_options, name='get_tutor_filter_options'),
    
    # Events 
    path('events/', views.get_all_events, name='get_all_events'),
    path('events/<int:event_id>/', views.get_event_details, name='get_event_details'),
    path('events/<int:event_id>/toggle-status/', views.toggle_event_status, name='toggle_event_status'),
    path('events/<int:event_id>/delete/', views.delete_event, name='delete_event'),
    path('events/statistics/', views.get_event_statistics, name='get_event_statistics'),
    path('events/filter-options/', views.get_event_filter_options, name='get_event_filter_options'),
    
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