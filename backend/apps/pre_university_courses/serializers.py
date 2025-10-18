# Utility functions to serialize model data to JSON format
import json
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from .models import PreUniversityCourse, CourseVideo, CourseEnrollment, VideoProgress
from apps.accounts.models import Users, UserDetails
from apps.mentoring.models import Mentors


def serialize_mentor(mentor):
    """Serialize mentor data"""
    try:
        # Get the user from the mentor
        user = mentor.user
        user_details = UserDetails.objects.get(user=user)
        
        # Get university info from the mentor's university_student relationship
        university_id = None
        if mentor.university_student:
            university_id = mentor.university_student.university.university_id
            
        return {
            'mentor_id': mentor.mentor_id,
            'user_id': user.user_id,
            'username': user.username,
            'full_name': user_details.full_name,
            'profile_picture': user_details.profile_picture,
            'university_id': university_id,
            'expertise': mentor.expertise,
            'bio': mentor.bio,
            'approved': mentor.approved,
        }
    except UserDetails.DoesNotExist:
        user = mentor.user
        
        # Get university info from the mentor's university_student relationship
        university_id = None
        if mentor.university_student:
            university_id = mentor.university_student.university.university_id
            
        return {
            'mentor_id': mentor.mentor_id,
            'user_id': user.user_id,
            'username': user.username,
            'full_name': None,
            'profile_picture': None,
            'university_id': university_id,
            'expertise': mentor.expertise,
            'bio': mentor.bio,
            'approved': mentor.approved,
        }


def serialize_course_video(video):
    """Serialize course video data"""
    return {
        'id': video.id,
        'course_id': video.course.id,
        'title': video.title,
        'description': video.description,
        'order': video.order,
        'video_url': video.video_url,
        'video_public_id': video.video_public_id,
        'video_provider': video.video_provider,
        'duration_seconds': video.duration_seconds,
        'file_size_bytes': video.file_size_bytes,
        'thumbnail_url': video.thumbnail_url,
        'is_preview': video.is_preview,
        'uploaded_at': video.uploaded_at.isoformat() if video.uploaded_at else None,
    }


def serialize_course(course, include_videos=True):
    """Serialize course data"""
    data = {
        'id': course.id,
        'title': course.title,
        'slug': course.slug,
        'description': course.description,
        'mentor': serialize_mentor(course.mentor),
        'category': course.category,
        'level': course.level,
        'thumbnail_url': course.thumbnail_url,
        'thumbnail_public_id': course.thumbnail_public_id,
        'price': float(course.price),
        'currency': course.currency,
        'is_paid_course': course.is_paid_course,
        'status': course.status,
        'approved_by': serialize_mentor(course.approved_by) if course.approved_by else None,
        'approved_at': course.approved_at.isoformat() if course.approved_at else None,
        'total_duration_minutes': course.total_duration_minutes,
        'enroll_count': course.enroll_count,
        'average_rating': course.average_rating,
        'rating_count': course.rating_count,
        'created_at': course.created_at.isoformat() if course.created_at else None,
        'updated_at': course.updated_at.isoformat() if course.updated_at else None,
    }
    
    if include_videos:
        data['videos'] = [serialize_course_video(video) for video in course.videos.all()]
        data['video_count'] = course.videos.count()
    
    return data


def serialize_enrollment(enrollment):
    """Serialize enrollment data"""
    return {
        'id': enrollment.id,
        'student': serialize_mentor(enrollment.student),
        'course': serialize_course(enrollment.course, include_videos=False),
        'payment_id': enrollment.payment_id,
        'enrolled_at': enrollment.enrolled_at.isoformat() if enrollment.enrolled_at else None,
        'rating': enrollment.rating,
        'review': enrollment.review,
        'progress_percent': enrollment.progress_percent,
        'completed': enrollment.completed,
    }


def validate_course_data(data):
    """Validate course creation/update data"""
    errors = {}
    
    if not data.get('title'):
        errors['title'] = 'Title is required'
    elif len(data.get('title', '')) > 255:
        errors['title'] = 'Title must be less than 255 characters'
    
    if not data.get('description'):
        errors['description'] = 'Description is required'
    
    if not data.get('category'):
        errors['category'] = 'Category is required'
    
    if not data.get('level'):
        errors['level'] = 'Level is required'
    
    try:
        price = float(data.get('price', 0))
        if price < 0:
            errors['price'] = 'Price cannot be negative'
    except (ValueError, TypeError):
        errors['price'] = 'Price must be a valid number'
    
    return errors