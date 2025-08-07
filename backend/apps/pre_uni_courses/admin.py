from django.contrib import admin
from .models import PreUniCourse, CourseContent, CourseEnrollment


@admin.register(PreUniCourse)
class PreUniCourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'price', 'enrollments', 'rating', 'created_at']
    list_filter = ['category', 'status', 'created_at']
    search_fields = ['title', 'description', 'category']
    readonly_fields = ['created_at', 'updated_at', 'enrollments', 'rating']
    ordering = ['-created_at']


@admin.register(CourseContent)
class CourseContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course_id', 'content_type', 'order', 'duration_minutes']
    list_filter = ['content_type']
    search_fields = ['title']
    ordering = ['course_id', 'order']


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student_id', 'course_id', 'status', 'progress_percentage', 'enrollment_date']
    list_filter = ['status', 'enrollment_date']
    search_fields = ['student_id', 'course_id']
    readonly_fields = ['enrollment_date']
    ordering = ['-enrollment_date']
