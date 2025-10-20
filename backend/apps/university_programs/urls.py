from django.urls import path
from . import views

urlpatterns = [
    # Summary counts
    path('academic/summary/', views.academic_summary, name='academic_summary'),

    # Faculties and programs
    path('academic/faculties/', views.faculties_by_university,
         name='faculties_by_university'),
    path('academic/faculties/<int:faculty_id>/programs/',
         views.programs_by_faculty, name='programs_by_faculty'),
    path('academic/programs/', views.program_create_update_delete,
         name='program_create_update_delete'),

    # Subjects under a program
    path('academic/programs/<int:program_id>/subjects/',
         views.subjects_by_program, name='subjects_by_program'),
    path('academic/programs/<int:program_id>/subjects/manage/',
         views.subject_create_update_delete, name='subject_create_update_delete'),

    # Subject overview and files
    path('academic/subjects/<int:course_id>/overview/',
         views.subject_overview_view, name='subject_overview'),
    path('academic/subjects/<int:course_id>/files/',
         views.subject_files_view, name='subject_files'),
    path('academic/files/<int:file_id>/download/',
         views.download_subject_file, name='download_subject_file'),
    # Z-Score Analysis endpoint
    path('analyze-zscore/', views.analyze_zscore, name='analyze_zscore'),
    # Get all programs for program matching page
    path('programs/', views.get_all_programs, name='get_all_programs'),
]
