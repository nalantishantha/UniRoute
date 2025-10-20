from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib import messages
from .models import (
    Mentors, MentoringRequests, MentoringSessions, SessionDetails, 
    MentoringFeedback, MentoringSessionEnrollments, MentorAvailability, 
    MentorAvailabilityExceptions
)

@admin.register(Mentors)
class MentorsAdmin(admin.ModelAdmin):
    list_display = ['mentor_id', 'user', 'university_student', 'approved_status', 'created_at', 'approve_actions']
    list_filter = ['approved', 'created_at']
    search_fields = ['user__username', 'user__email', 'expertise']
    readonly_fields = ['mentor_id', 'created_at']
    
    def approved_status(self, obj):
        if obj.approved == 1:
            return format_html('<span style="color: green; font-weight: bold;">✓ Approved</span>')
        else:
            return format_html('<span style="color: orange; font-weight: bold;">⏳ Pending</span>')
    approved_status.short_description = 'Status'
    
    def approve_actions(self, obj):
        if obj.approved == 0:
            approve_url = reverse('admin:approve_mentor', args=[obj.mentor_id])
            return format_html(
                '<a class="button" href="{}" style="background-color: #28a745; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px;">Approve Mentor</a>',
                approve_url
            )
        else:
            return format_html('<span style="color: green;">Already Approved</span>')
    approve_actions.short_description = 'Actions'
    approve_actions.allow_tags = True
    
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('approve-mentor/<int:mentor_id>/', self.admin_site.admin_view(self.approve_mentor), name='approve_mentor'),
        ]
        return custom_urls + urls
    
    def approve_mentor(self, request, mentor_id):
        try:
            mentor = Mentors.objects.get(mentor_id=mentor_id)
            if mentor.approved == 0:
                mentor.approved = 1
                mentor.save()
                messages.success(request, f'Mentor {mentor.user.username} has been approved successfully! Pre-mentor data will be automatically removed.')
            else:
                messages.info(request, f'Mentor {mentor.user.username} was already approved.')
        except Mentors.DoesNotExist:
            messages.error(request, 'Mentor not found.')
        
        return HttpResponseRedirect(reverse('admin:mentoring_mentors_changelist'))

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
