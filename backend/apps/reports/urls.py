from django.urls import path

from . import views

app_name = 'admin_reports'

urlpatterns = [
    path('overview/', views.admin_report_overview, name='overview'),
    path('export/', views.generate_admin_report, name='export'),
    path('history/', views.list_admin_reports, name='history'),
    path('history/<int:report_id>/download/', views.download_admin_report, name='download'),
]
