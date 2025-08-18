from django.contrib import admin
from .models import CourseVideo, VideoComment, VideoPlaylist, VideoView, PlaylistVideo


@admin.register(CourseVideo)
class CourseVideoAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'tutor_name', 'subject_name', 'category', 
        'status', 'view_count', 'uploaded_at'
    ]
    list_filter = ['status', 'category', 'is_public', 'is_featured', 'uploaded_at']
    search_fields = ['title', 'description', 'tutor__user__username']
    readonly_fields = ['video_id', 'uploaded_at', 'updated_at', 'view_count', 'file_size']
    
    fieldsets = (
        ('Video Information', {
            'fields': ('title', 'description', 'category', 'subject', 'tags')
        }),
        ('File Information', {
            'fields': ('video_file', 'thumbnail', 'file_size', 'duration')
        }),
        ('Status & Permissions', {
            'fields': ('status', 'is_public', 'is_featured')
        }),
        ('Moderation', {
            'fields': ('reviewed_by', 'review_notes', 'approved_at')
        }),
        ('Statistics', {
            'fields': ('view_count', 'likes')
        }),
        ('Timestamps', {
            'fields': ('uploaded_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def tutor_name(self, obj):
        return obj.tutor.user.username
    tutor_name.short_description = 'Tutor'
    
    def subject_name(self, obj):
        return obj.subject.subject_name
    subject_name.short_description = 'Subject'
    
    actions = ['approve_videos', 'reject_videos', 'feature_videos']
    
    def approve_videos(self, request, queryset):
        count = queryset.update(status='approved')
        self.message_user(request, f'{count} videos approved successfully.')
    approve_videos.short_description = 'Approve selected videos'
    
    def reject_videos(self, request, queryset):
        count = queryset.update(status='rejected')
        self.message_user(request, f'{count} videos rejected.')
    reject_videos.short_description = 'Reject selected videos'
    
    def feature_videos(self, request, queryset):
        count = queryset.update(is_featured=True)
        self.message_user(request, f'{count} videos marked as featured.')
    feature_videos.short_description = 'Mark as featured'


@admin.register(VideoComment)
class VideoCommentAdmin(admin.ModelAdmin):
    list_display = ['video_title', 'user_name', 'comment_preview', 'created_at']
    list_filter = ['created_at', 'is_edited']
    search_fields = ['comment', 'user__username', 'video__title']
    readonly_fields = ['comment_id', 'created_at', 'updated_at']
    
    def video_title(self, obj):
        return obj.video.title
    video_title.short_description = 'Video'
    
    def user_name(self, obj):
        return obj.user.username
    user_name.short_description = 'User'
    
    def comment_preview(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment'


@admin.register(VideoPlaylist)
class VideoPlaylistAdmin(admin.ModelAdmin):
    list_display = ['title', 'tutor_name', 'videos_count', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['title', 'description', 'tutor__user__username']
    readonly_fields = ['playlist_id', 'created_at', 'updated_at']
    
    def tutor_name(self, obj):
        return obj.tutor.user.username
    tutor_name.short_description = 'Tutor'
    
    def videos_count(self, obj):
        return obj.videos.count()
    videos_count.short_description = 'Videos Count'


@admin.register(VideoView)
class VideoViewAdmin(admin.ModelAdmin):
    list_display = ['video_title', 'viewer_name', 'viewed_at', 'watch_duration']
    list_filter = ['viewed_at']
    search_fields = ['video__title', 'viewer__username']
    readonly_fields = ['view_id', 'viewed_at']
    
    def video_title(self, obj):
        return obj.video.title
    video_title.short_description = 'Video'
    
    def viewer_name(self, obj):
        return obj.viewer.username if obj.viewer else 'Anonymous'
    viewer_name.short_description = 'Viewer'


admin.site.register(PlaylistVideo)
