from django.contrib import admin
from .models import (
    Tutors, TutorSubjects, TutoringSessions, TutorRatings, 
    TutorFeedback, TutorAvailability, TutoringBooking
)


@admin.register(TutorAvailability)
class TutorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['tutor', 'get_day_name', 'start_time', 'end_time', 'subject', 'max_students', 'is_recurring', 'is_active']
    list_filter = ['day_of_week', 'is_recurring', 'is_active', 'subject']
    search_fields = ['tutor__user__username', 'subject__subject_name']
    ordering = ['day_of_week', 'start_time']
    
    def get_day_name(self, obj):
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return days[obj.day_of_week]
    get_day_name.short_description = 'Day'


@admin.register(TutoringBooking)
class TutoringBookingAdmin(admin.ModelAdmin):
    list_display = ['booking_id', 'student', 'tutor', 'subject', 'start_date', 'status', 'payment_type', 'sessions_paid', 'sessions_completed']
    list_filter = ['status', 'payment_type', 'is_recurring', 'start_date']
    search_fields = ['student__user__username', 'tutor__user__username', 'subject__subject_name', 'topic']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Tutors)
class TutorsAdmin(admin.ModelAdmin):
    list_display = ['tutor_id', 'user', 'expertise', 'rating', 'created_at']
    search_fields = ['user__username', 'expertise']
    list_filter = ['rating', 'created_at']


@admin.register(TutorSubjects)
class TutorSubjectsAdmin(admin.ModelAdmin):
    list_display = ['tutor', 'subject', 'level']
    list_filter = ['level']
    search_fields = ['tutor__user__username', 'subject__subject_name']


@admin.register(TutoringSessions)
class TutoringSessionsAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'tutor', 'subject', 'scheduled_at', 'status', 'duration_minutes']
    list_filter = ['status', 'scheduled_at']
    search_fields = ['tutor__user__username', 'subject__subject_name']


@admin.register(TutorRatings)
class TutorRatingsAdmin(admin.ModelAdmin):
    list_display = ['rating_id', 'tutor', 'rater_user', 'created_at']
    search_fields = ['tutor__user__username', 'rater_user__username']


@admin.register(TutorFeedback)
class TutorFeedbackAdmin(admin.ModelAdmin):
    list_display = ['feedback_id', 'tutor', 'user', 'created_at']
    search_fields = ['tutor__user__username', 'user__username', 'feedback']
