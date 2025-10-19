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


def serialize_user(user):
    """Serialize a Users instance (student or generic user)"""
    if not user:
        return None

    try:
        details = UserDetails.objects.get(user=user)
        full_name = details.full_name
        profile_picture = details.profile_picture
    except UserDetails.DoesNotExist:
        full_name = None
        profile_picture = None

    return {
        'user_id': getattr(user, 'user_id', None),
        'username': getattr(user, 'username', None),
        'email': getattr(user, 'email', None),
        'full_name': full_name,
        'profile_picture': profile_picture,
    }


def serialize_course_resource(resource):
    """Serialize course resource data"""
    return {
        'id': resource.id,
        'title': resource.title,
        'description': resource.description,
        'resource_type': resource.resource_type,
        'file_url': resource.file_url,
        'file_public_id': resource.file_public_id,
        'file_size_bytes': resource.file_size_bytes,
        'download_count': resource.download_count,
        'is_free': resource.is_free,
        'order': resource.order,
        'uploaded_at': resource.uploaded_at.isoformat() if resource.uploaded_at else None,
    }


def serialize_course(course, include_videos=True, include_resources=False):
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

        # detect important providers from videos
        try:
            providers = set([v.video_provider.lower() for v in course.videos.all() if v.video_provider])
            data['providers'] = list(providers)
            data['has_youtube'] = any('youtube' in p for p in providers)
            data['has_udemy'] = any('udemy' in p for p in providers)
        except Exception:
            data['providers'] = []
            data['has_youtube'] = False
            data['has_udemy'] = False

    if include_resources:
        # Import here to avoid circular imports in some contexts
        try:
            resources_qs = course.resources.all()
            data['resources'] = [serialize_course_resource(r) for r in resources_qs]
            data['resource_count'] = resources_qs.count()
        except Exception:
            data['resources'] = []
            data['resource_count'] = 0
            data['has_youtube'] = data.get('has_youtube', False)
            data['has_udemy'] = data.get('has_udemy', False)
    
    return data


def serialize_enrollment(enrollment):
    """Serialize enrollment data"""
    return {
        'id': enrollment.id,
        'student': serialize_user(enrollment.student) if 'serialize_user' in globals() else None,
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