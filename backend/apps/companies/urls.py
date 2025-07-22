from django.urls import path
from apps.administration import views as admin_views
from . import views as company_views

urlpatterns = [
    # Company Events
    path('events/', company_views.get_company_events, name='get_company_events'),
    path('events/create/', company_views.create_company_event, name='create_company_event'),
    path('events/<int:event_id>/update/', company_views.update_company_event, name='update_company_event'),
    path('events/<int:event_id>/delete/', company_views.delete_company_event, name='delete_company_event'),
    path('events/register/', company_views.register_for_company_event, name='register_for_company_event'),
    
    # Company Internships (for companies to manage their own internships)
    path('company-internships/', company_views.get_company_internships, name='get_company_internships'),
    path('company-internships/create/', company_views.create_internship, name='create_company_internship'),
    path('company-internships/<int:internship_id>/', company_views.get_internship_details, name='get_company_internship_details'),
    path('company-internships/<int:internship_id>/update/', company_views.update_internship, name='update_company_internship'),
    path('company-internships/<int:internship_id>/delete/', company_views.delete_internship, name='delete_company_internship'),
    
    # Internships (existing from administration views)
    path('internships/', admin_views.get_internships),
    path('internships/<int:internship_id>/', admin_views.get_internship_details),
    path('internships/create/', admin_views.create_internship),
    path('internships/<int:internship_id>/update/', admin_views.update_internship),
    path('internships/<int:internship_id>/delete/', admin_views.delete_internship),
    path('internships/companies/', admin_views.get_companies_for_internships),
    path('internships/statistics/', admin_views.get_internship_statistics),

     path('internships/', company_views.get_company_internships, name='get_company_internships'),
    path('internships/create/', company_views.create_internship, name='create_internship'),
]