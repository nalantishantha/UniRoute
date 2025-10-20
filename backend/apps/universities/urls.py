from django.urls import path
from . import views

urlpatterns = [
    # Universities
    path('', views.universities_list, name='universities_list'),

    # Announcements
    path('announcements/', views.announcements_list_create,
         name='announcements_list_create'),
    path('announcements/<int:announcement_id>/',
         views.announcement_update_delete, name='announcement_update_delete'),

    # University Dashboard Admin
    path('dashboard-admin/', views.get_university_dashboard_admin,
         name='get_university_dashboard_admin'),
    path('dashboard-admin/create/', views.create_university_dashboard_admin,
         name='create_university_dashboard_admin'),
    path('dashboard-admin/<int:dashboard_id>/update/',
         views.update_university_dashboard_admin, name='update_university_dashboard_admin'),

    # University Events
    path('events/', views.get_university_events, name='get_university_events'),
    path('events/create/', views.create_university_event,
         name='create_university_event'),
    path('events/<int:event_id>/update/',
         views.update_university_event, name='update_university_event'),
    path('events/<int:event_id>/delete/',
         views.delete_university_event, name='delete_university_event'),

    # Manage Portfolio
    path('manage-portfolio/', views.get_manage_portfolio,
         name='get_manage_portfolio'),
    path('manage-portfolio/create/', views.create_manage_portfolio,
         name='create_manage_portfolio'),
    path('manage-portfolio/<int:portfolio_id>/update/',
         views.update_manage_portfolio, name='update_manage_portfolio'),
]
