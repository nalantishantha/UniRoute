from django.db import models
from django.utils.text import slugify
from apps.accounts.models import Users
from apps.university_students.models import UniversityStudents
from apps.mentoring.models import Mentors


class PreUniversityCourse(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('published', 'Published'),
    ]
    
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    CATEGORY_CHOICES = [
        ('mathematics', 'Mathematics'),
        ('physics', 'Physics'),
        ('chemistry', 'Chemistry'),
        ('biology', 'Biology'),
        ('english', 'English'),
        ('engineering', 'Engineering'),
        ('programming', 'Programming'),
        ('business', 'Business'),
        ('other', 'Other'),
    ]

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    mentor = models.ForeignKey(Mentors, on_delete=models.CASCADE, related_name='created_courses')
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    thumbnail_url = models.URLField(blank=True, null=True)
    thumbnail_public_id = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='LKR')
    is_paid_course = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    approved_by = models.ForeignKey(Mentors, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_courses')
    approved_at = models.DateTimeField(null=True, blank=True)
    total_duration_minutes = models.IntegerField(null=True, blank=True)
    enroll_count = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    rating_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pre_university_courses'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Auto-determine if course is paid based on price
        self.is_paid_course = self.price > 0
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CourseVideo(models.Model):
    VIDEO_PROVIDER_CHOICES = [
        ('cloudinary', 'Cloudinary'),
        ('youtube', 'YouTube'),
        ('vimeo', 'Vimeo'),
    ]

    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(PreUniversityCourse, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField()
    video_url = models.URLField()
    video_public_id = models.CharField(max_length=255, blank=True, null=True)
    video_provider = models.CharField(max_length=50, choices=VIDEO_PROVIDER_CHOICES, default='cloudinary')
    duration_seconds = models.IntegerField(null=True, blank=True)
    file_size_bytes = models.BigIntegerField(null=True, blank=True)
    thumbnail_url = models.URLField(blank=True, null=True)
    is_preview = models.BooleanField(default=False)
    average_rating = models.FloatField(default=0.0)  # Average rating for this video
    rating_count = models.IntegerField(default=0)  # Number of ratings for this video
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'course_videos'
        ordering = ['course', 'order']
        unique_together = ['course', 'order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class CourseEnrollment(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(PreUniversityCourse, on_delete=models.CASCADE, related_name='enrollments')
    payment_id = models.IntegerField(null=True, blank=True)  # FK to payments table when implemented
    enrolled_at = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(null=True, blank=True, choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(null=True, blank=True)
    progress_percent = models.FloatField(default=0.0)
    completed = models.BooleanField(default=False)

    class Meta:
        db_table = 'course_enrollments'
        unique_together = ['student', 'course']
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"


class CourseResource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('pdf', 'PDF Document'),
        ('doc', 'Word Document'), 
        ('ppt', 'Presentation'),
        ('excel', 'Spreadsheet'),
        ('image', 'Image'),
        ('zip', 'Archive'),
        ('link', 'External Link'),
    ]

    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(PreUniversityCourse, on_delete=models.CASCADE, related_name='resources')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    file_url = models.URLField()  # Cloudinary URL or external link
    file_public_id = models.CharField(max_length=255, blank=True, null=True)  # Cloudinary public_id
    file_size_bytes = models.BigIntegerField(null=True, blank=True)
    download_count = models.IntegerField(default=0)
    is_free = models.BooleanField(default=False)  # Free preview resources
    order = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'course_resources'
        ordering = ['course', 'order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class VideoProgress(models.Model):
    id = models.AutoField(primary_key=True)
    enrollment = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE, related_name='video_progress')
    video = models.ForeignKey(CourseVideo, on_delete=models.CASCADE)
    watched_seconds = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    last_watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'video_progress'
        unique_together = ['enrollment', 'video']

    def __str__(self):
        return f"{self.enrollment.student.username} - {self.video.title} progress"


class VideoRating(models.Model):
    """Individual video ratings by students"""
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='video_ratings')
    video = models.ForeignKey(CourseVideo, on_delete=models.CASCADE, related_name='ratings')
    enrollment = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE, related_name='video_ratings')
    rating = models.FloatField()  # 1.0 to 5.0, supports half stars (e.g., 4.5)
    review = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'video_ratings'
        unique_together = ['student', 'video']  # One rating per student per video
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.username} rated {self.video.title}: {self.rating}/5"