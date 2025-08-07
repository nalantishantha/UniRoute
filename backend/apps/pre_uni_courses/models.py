from django.db import models
from apps.accounts.models import Users


class PreUniCourse(models.Model):
    CATEGORY_CHOICES = [
        ('Mathematics', 'Mathematics'),
        ('Physics', 'Physics'),
        ('Chemistry', 'Chemistry'),
        ('Biology', 'Biology'),
        ('English', 'English'),
        ('Computer Science', 'Computer Science'),
        ('Economics', 'Economics'),
        ('History', 'History'),
        ('Geography', 'Geography'),
        ('Literature', 'Literature'),
    ]
    
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Published', 'Published'),
        ('Pending', 'Pending'),
        ('Archived', 'Archived'),
    ]

    course_id = models.AutoField(primary_key=True)
    # Existing fields from the current table
    university_id = models.IntegerField(null=True, blank=True)  # Will be handled separately
    degree_program_id = models.IntegerField(null=True, blank=True)  # Will be handled separately
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # New fields for pre-uni courses functionality (will be added via migration)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration = models.CharField(max_length=100, null=True, blank=True)  # e.g., "8 weeks", "3 months"
    thumbnail = models.URLField(blank=True, null=True)
    enrollments = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    created_by_id = models.IntegerField(null=True, blank=True)  # Will reference Users table
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        db_table = 'pre_university_courses'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class CourseContent(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('video', 'Video'),
        ('text', 'Text'),
        ('pdf', 'PDF'),
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
    ]

    id = models.AutoField(primary_key=True)
    course_id = models.IntegerField()  # Reference to PreUniCourse
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    content_url = models.URLField(blank=True, null=True)
    content_text = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    duration_minutes = models.IntegerField(default=0)  # For videos/lessons
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pre_uni_course_contents'
        ordering = ['order']

    def __str__(self):
        return f"Course {self.course_id} - {self.title}"


class CourseEnrollment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
        ('pending', 'Pending'),
    ]

    id = models.AutoField(primary_key=True)
    course_id = models.IntegerField()  # Reference to PreUniCourse
    student_id = models.IntegerField()  # Reference to Users
    enrollment_date = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    review = models.TextField(blank=True)

    class Meta:
        db_table = 'pre_uni_course_enrollments'
        unique_together = ['course_id', 'student_id']

    def __str__(self):
        return f"Student {self.student_id} - Course {self.course_id}"
