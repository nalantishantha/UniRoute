from django.urls import path
from . import views

app_name = 'pre_university_courses'

urlpatterns = [
    # Course CRUD operations
    path('api/courses/', views.CourseListCreateView.as_view(), name='course-list-create'),
    path('api/courses/<int:course_id>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('api/courses/<int:course_id>/status/', views.update_course_status, name='course-status-update'),
    
    # Course videos
    path('api/courses/<int:course_id>/videos/', views.CourseVideoView.as_view(), name='course-videos'),
    path('api/courses/<int:course_id>/enroll/', views.enroll_course, name='course-enroll'),
    path('api/courses/<int:course_id>/rate/', views.rate_course, name='course-rate'),
    
    # Course resources (PDFs, documents, etc.)
    path('api/courses/<int:course_id>/resources/', views.CourseResourceView.as_view(), name='course-resources'),
    path('api/courses/<int:course_id>/resources/<int:resource_id>/', views.CourseResourceDetailView.as_view(), name='course-resource-detail'),
    path('api/courses/<int:course_id>/resources/reorder/', views.BulkResourceOrderView.as_view(), name='resource-reorder'),
    
    # Utility endpoints
    path('api/course-categories/', views.course_categories, name='course-categories'),
    path('api/course-levels/', views.course_levels, name='course-levels'),
]