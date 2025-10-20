from django.urls import path
from . import views as company_views

urlpatterns = [
    # Company Registration Requests
    path('requests/', company_views.company_requests_list, name='company_requests_list'),
    path('requests/<int:request_id>/approve/', company_views.approve_company_request, name='approve_company_request'),
    path('requests/<int:request_id>/reject/', company_views.reject_company_request, name='reject_company_request'),
    
    # Company Events
    path('events/', company_views.get_company_events, name='get_company_events'),
    path('events/create/', company_views.create_company_event,
         name='create_company_event'),
    path('events/<int:event_id>/update/',
         company_views.update_company_event, name='update_company_event'),
    path('events/<int:event_id>/delete/',
         company_views.delete_company_event, name='delete_company_event'),
    path('events/register/', company_views.register_for_company_event,
         name='register_for_company_event'),

    # Company Internships (company-managed)
    path('company-internships/', company_views.get_company_internships,
         name='get_company_internships'),
    path('company-internships/create/', company_views.create_internship,
         name='create_company_internship'),
    path('company-internships/<int:internship_id>/',
         company_views.get_internship_details, name='get_company_internship_details'),
    path('company-internships/<int:internship_id>/update/',
         company_views.update_internship, name='update_company_internship'),
    path('company-internships/<int:internship_id>/delete/',
         company_views.delete_internship, name='delete_company_internship'),

    # Optional aliases under /internships/
    path('internships/', company_views.get_company_internships,
         name='get_company_internships_alias'),
    path('internships/create/', company_views.create_internship,
         name='create_internship_alias'),

    # Company Courses
    path('company-courses/', company_views.get_courses,
         name='get_company_courses'),
    path('company-courses/create/', company_views.create_course,
         name='create_company_course'),
    path('company-courses/<int:course_id>/update/',
         company_views.update_course, name='update_course'),
    path('company-courses/<int:course_id>/delete/',
         company_views.delete_course, name='delete_course'),

    # Company Announcements
    path('company-announcements/', company_views.get_announcements,
         name='get_company_announcements'),
    path('company-announcements/create/', company_views.create_announcement,
         name='create_company_announcement'),
    path('company-announcements/<int:announcement_id>/update/',
         company_views.update_announcement, name='update_company_announcement'),
    path('company-announcements/<int:announcement_id>/delete/',
         company_views.delete_announcement, name='delete_company_announcement'),

    # Company Dashboard Edits
    path('company-dashboard-edit/', company_views.get_dashboard_edit,
         name='get_company_dashboard_edit'),
    path('company-dashboard-edit/create/', company_views.create_dashboard_edit,
         name='create_company_dashboard_edit'),
    path('company-dashboard-edit/<int:dashboard_id>/update/',
         company_views.update_dashboard_edit, name='update_company_dashboard_edit'),

    # Company Ads (AdPublish page backend)
    path('company-ads/', company_views.get_company_ads, name='get_company_ads'),
    path('company-ads/create/', company_views.create_company_ad,
         name='create_company_ad'),
    path('company-ads/<int:ad_id>/update/',
         company_views.update_company_ad, name='update_company_ad'),
    path('company-ads/<int:ad_id>/delete/',
         company_views.delete_company_ad, name='delete_company_ad'),

    # Temporary media upload for ad assets (dev/demo)
    path('company-ads/upload/', company_views.upload_ad_media,
         name='upload_ad_media'),
]
