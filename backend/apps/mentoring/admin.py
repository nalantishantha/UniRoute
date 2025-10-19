from django.contrib import admin
from .models import (
    Mentors, MentoringRequests, MentoringSessions, SessionDetails, 
    MentoringFeedback, MentoringSessionEnrollments, MentorAvailability, 
    MentorAvailabilityExceptions
)

@admin.register(Mentors)
class MentorsAdmin(admin.ModelAdmin):
    list_display = ['mentor_id', 'user', 'university_student', 'approved', 'created_at']
    list_filter = ['approved', 'created_at']
    search_fields = ['user__username', 'user__email', 'expertise']

@admin.register(MentoringRequests)
class MentoringRequestsAdmin(admin.ModelAdmin):
    list_display = ['request_id', 'mentor', 'student', 'topic', 'status', 'urgency', 'requested_date']
    list_filter = ['status', 'urgency', 'session_type', 'requested_date']
    search_fields = ['topic', 'description', 'mentor__user__username', 'student__user__username']

@admin.register(MentoringSessions)
class MentoringSessionsAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'mentor', 'topic', 'scheduled_at', 'status', 'duration_minutes']
    list_filter = ['status', 'scheduled_at', 'created_at']
    search_fields = ['topic', 'mentor__user__username']

@admin.register(MentorAvailability)
class MentorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['availability_id', 'mentor', 'day_of_week', 'start_time', 'end_time', 'is_active']
    list_filter = ['day_of_week', 'is_active', 'created_at']
    search_fields = ['mentor__user__username']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('mentor__user')

@admin.register(MentorAvailabilityExceptions)
class MentorAvailabilityExceptionsAdmin(admin.ModelAdmin):
    list_display = ['exception_id', 'mentor', 'date', 'start_time', 'end_time', 'exception_type']
    list_filter = ['exception_type', 'date', 'created_at']
    search_fields = ['mentor__user__username', 'reason']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('mentor__user')

@admin.register(SessionDetails)
class SessionDetailsAdmin(admin.ModelAdmin):
    list_display = ['detail_id', 'session', 'location', 'meeting_link']
    search_fields = ['location', 'meeting_link', 'session__topic']

@admin.register(MentoringFeedback)
class MentoringFeedbackAdmin(admin.ModelAdmin):
    list_display = ['feedback_id', 'session', 'student', 'submitted_at']
    list_filter = ['submitted_at']
    search_fields = ['session__topic', 'student__user__username', 'feedback']

@admin.register(MentoringSessionEnrollments)
class MentoringSessionEnrollmentsAdmin(admin.ModelAdmin):
    list_display = ['session_enrollment_id']
