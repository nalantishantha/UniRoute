from django.db import models
from django.utils import timezone
import os


def video_upload_path(instance, filename):
    """Generate upload path for video files"""
    # Get file extension
    ext = filename.split('.')[-1]
    # Create new filename with tutor info
    filename = f"tutor_{instance.tutor.tutor_id}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.{ext}"
    return os.path.join('videos', 'courses', filename)


class CourseVideo(models.Model):
    """Model for course videos uploaded by university students (tutors)"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('archived', 'Archived'),
    ]
    
    CATEGORY_CHOICES = [
        ('lecture', 'Lecture'),
        ('tutorial', 'Tutorial'),
        ('assignment_help', 'Assignment Help'),
        ('exam_prep', 'Exam Preparation'),
        ('lab_demo', 'Lab Demonstration'),
        ('project_guide', 'Project Guide'),
        ('other', 'Other'),
    ]
    
    video_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey(
        'tutoring.Tutors', 
        on_delete=models.CASCADE,
        related_name='course_videos'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        default='lecture'
    )
    
    # Video file storage
    video_file = models.FileField(
        upload_to=video_upload_path,
        help_text="Upload video file (MP4, AVI, MOV, WMV)"
    )
    
    # Video metadata
    file_size = models.BigIntegerField(null=True, blank=True)  # in bytes
    duration = models.DurationField(null=True, blank=True)  # video duration
    thumbnail = models.ImageField(
        upload_to='videos/thumbnails/',
        blank=True,
        null=True,
        help_text="Video thumbnail image"
    )
    
    # Related course/subject info
    subject = models.ForeignKey(
        'student_results.AlSubjects',
        on_delete=models.CASCADE,
        help_text="Subject this video belongs to"
    )
    
    # Video status and moderation
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Views and engagement
    view_count = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    
    # Timestamps
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    
    # Moderation info
    reviewed_by = models.ForeignKey(
        'accounts.Users',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_videos'
    )
    review_notes = models.TextField(blank=True, null=True)
    
    # SEO and discoverability
    tags = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'course_videos'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['tutor', 'status']),
            models.Index(fields=['subject', 'category']),
            models.Index(fields=['status', 'is_public']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.tutor.user.username}"
    
    def get_file_size_mb(self):
        """Return file size in MB"""
        if self.file_size:
            return round(self.file_size / (1024 * 1024), 2)
        return 0
    
    def increment_view_count(self):
        """Increment view count"""
        self.view_count += 1
        self.save(update_fields=['view_count'])


class VideoComment(models.Model):
    """Comments on course videos"""
    
    comment_id = models.AutoField(primary_key=True)
    video = models.ForeignKey(
        CourseVideo,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        'accounts.Users',
        on_delete=models.CASCADE
    )
    comment = models.TextField()
    parent_comment = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_edited = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'video_comments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.video.title}"


class VideoView(models.Model):
    """Track video views for analytics"""
    
    view_id = models.AutoField(primary_key=True)
    video = models.ForeignKey(
        CourseVideo,
        on_delete=models.CASCADE,
        related_name='video_views'
    )
    viewer = models.ForeignKey(
        'accounts.Users',
        on_delete=models.CASCADE,
        null=True,
        blank=True  # Allow anonymous views
    )
    
    # Analytics data
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    watch_duration = models.DurationField(null=True, blank=True)
    
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'video_views'
        unique_together = ['video', 'viewer', 'viewed_at']  # Prevent duplicate views per day
    
    def __str__(self):
        return f"View of {self.video.title} by {self.viewer.username if self.viewer else 'Anonymous'}"


class VideoPlaylist(models.Model):
    """Playlists created by tutors for organizing videos"""
    
    playlist_id = models.AutoField(primary_key=True)
    tutor = models.ForeignKey(
        'tutoring.Tutors',
        on_delete=models.CASCADE,
        related_name='playlists'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    videos = models.ManyToManyField(
        CourseVideo,
        through='PlaylistVideo',
        related_name='playlists'
    )
    
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'video_playlists'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.tutor.user.username}"


class PlaylistVideo(models.Model):
    """Through model for playlist-video relationship with ordering"""
    
    playlist = models.ForeignKey(VideoPlaylist, on_delete=models.CASCADE)
    video = models.ForeignKey(CourseVideo, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'playlist_videos'
        unique_together = ['playlist', 'video']
        ordering = ['order']
