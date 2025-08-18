from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django.core.paginator import Paginator
import json
import os

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import CourseVideo, VideoComment, VideoPlaylist, VideoView
from .serializers import (
    CourseVideoSerializer, VideoUploadSerializer, 
    VideoCommentSerializer, VideoPlaylistSerializer, SubjectSerializer
)
from apps.tutoring.models import Tutors
from apps.student_results.models import AlSubjects
from apps.accounts.models import Users
from apps.university_students.models import UniversityStudents


@csrf_exempt
@api_view(['POST'])
def upload_video(request):
    """
    Upload a new course video
    Only authenticated university students (tutors) can upload videos
    """
    try:
        # Get user from request data (since we're using custom auth)
        user_id = request.data.get('user_id')
        if not user_id:
            return JsonResponse({
                'success': False,
                'message': 'User ID is required'
            }, status=400)
        
        try:
            user = Users.objects.get(user_id=user_id)
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Check if user is a university student (tutor)
        try:
            university_student = UniversityStudents.objects.get(user=user)
            tutor = Tutors.objects.get(university_student=university_student)
        except (UniversityStudents.DoesNotExist, Tutors.DoesNotExist):
            return JsonResponse({
                'success': False,
                'message': 'Only university students registered as tutors can upload videos'
            }, status=403)
        
        # Parse tags if provided
        tags_data = request.data.get('tags', '[]')
        if isinstance(tags_data, str):
            try:
                tags = json.loads(tags_data)
            except json.JSONDecodeError:
                tags = []
        else:
            tags = tags_data
        
        # Prepare data for serializer
        video_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description', ''),
            'category': request.data.get('category', 'lecture'),
            'subject': request.data.get('subject'),
            'video_file': request.FILES.get('video_file'),
            'tags': tags,
            'is_public': request.data.get('is_public', 'true').lower() == 'true'
        }
        
        # Validate required fields
        if not video_data['title']:
            return JsonResponse({
                'success': False,
                'message': 'Title is required'
            }, status=400)
        
        if not video_data['video_file']:
            return JsonResponse({
                'success': False,
                'message': 'Video file is required'
            }, status=400)
        
        if not video_data['subject']:
            return JsonResponse({
                'success': False,
                'message': 'Subject is required'
            }, status=400)
        
        # Validate subject exists
        try:
            AlSubjects.objects.get(subject_id=video_data['subject'])
        except AlSubjects.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Invalid subject'
            }, status=400)
        
        # Create serializer and validate
        serializer = VideoUploadSerializer(data=video_data)
        if serializer.is_valid():
            # Save video with tutor info
            video = serializer.save(tutor=tutor)
            
            # Calculate file size
            if video.video_file:
                video.file_size = video.video_file.size
                video.save(update_fields=['file_size'])
            
            return JsonResponse({
                'success': True,
                'message': 'Video uploaded successfully',
                'video_id': video.video_id,
                'data': {
                    'video_id': video.video_id,
                    'title': video.title,
                    'category': video.category,
                    'status': video.status,
                    'file_size_mb': video.get_file_size_mb(),
                    'uploaded_at': video.uploaded_at.isoformat()
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=400)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@api_view(['GET'])
def get_tutor_videos(request, tutor_id):
    """Get all videos uploaded by a specific tutor"""
    try:
        tutor = Tutors.objects.get(tutor_id=tutor_id)
        videos = CourseVideo.objects.filter(tutor=tutor).order_by('-uploaded_at')
        
        # Apply filters
        status_filter = request.GET.get('status')
        if status_filter:
            videos = videos.filter(status=status_filter)
        
        category_filter = request.GET.get('category')
        if category_filter:
            videos = videos.filter(category=category_filter)
        
        # Pagination
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 10))
        paginator = Paginator(videos, per_page)
        
        if page > paginator.num_pages:
            page = paginator.num_pages
        
        videos_page = paginator.get_page(page)
        
        # Serialize data
        serializer = CourseVideoSerializer(videos_page, many=True, context={'request': request})
        
        return JsonResponse({
            'success': True,
            'data': {
                'videos': serializer.data,
                'pagination': {
                    'current_page': page,
                    'total_pages': paginator.num_pages,
                    'total_videos': paginator.count,
                    'has_next': videos_page.has_next(),
                    'has_previous': videos_page.has_previous()
                }
            }
        })
        
    except Tutors.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Tutor not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@api_view(['GET'])
def get_all_videos(request):
    """Get all approved public videos"""
    try:
        videos = CourseVideo.objects.filter(
            status='approved',
            is_public=True
        ).order_by('-uploaded_at')
        
        # Apply filters
        search = request.GET.get('search')
        if search:
            videos = videos.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(tags__icontains=search)
            )
        
        category_filter = request.GET.get('category')
        if category_filter:
            videos = videos.filter(category=category_filter)
        
        subject_filter = request.GET.get('subject')
        if subject_filter:
            videos = videos.filter(subject_id=subject_filter)
        
        # Pagination
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 12))
        paginator = Paginator(videos, per_page)
        
        videos_page = paginator.get_page(page)
        
        # Serialize data
        serializer = CourseVideoSerializer(videos_page, many=True, context={'request': request})
        
        return JsonResponse({
            'success': True,
            'data': {
                'videos': serializer.data,
                'pagination': {
                    'current_page': page,
                    'total_pages': paginator.num_pages,
                    'total_videos': paginator.count,
                    'has_next': videos_page.has_next(),
                    'has_previous': videos_page.has_previous()
                }
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@api_view(['GET'])
def get_video_detail(request, video_id):
    """Get detailed information about a specific video"""
    try:
        video = CourseVideo.objects.get(video_id=video_id)
        
        # Check if video is accessible
        if not video.is_public and video.status != 'approved':
            # Check if requesting user is the owner
            user_id = request.GET.get('user_id')
            if user_id:
                try:
                    user = Users.objects.get(user_id=user_id)
                    if video.tutor.user != user:
                        return JsonResponse({
                            'success': False,
                            'message': 'Video not accessible'
                        }, status=403)
                except Users.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Video not accessible'
                    }, status=403)
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Video not accessible'
                }, status=403)
        
        # Increment view count
        video.increment_view_count()
        
        # Serialize video data
        serializer = CourseVideoSerializer(video, context={'request': request})
        
        return JsonResponse({
            'success': True,
            'data': serializer.data
        })
        
    except CourseVideo.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Video not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@api_view(['DELETE'])
def delete_video(request, video_id):
    """Delete a video (only by owner or admin)"""
    try:
        video = CourseVideo.objects.get(video_id=video_id)
        
        # Get user from request
        user_id = request.data.get('user_id') or request.GET.get('user_id')
        if not user_id:
            return JsonResponse({
                'success': False,
                'message': 'User ID is required'
            }, status=400)
        
        try:
            user = Users.objects.get(user_id=user_id)
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Check permissions
        if video.tutor.user != user and user.user_type.type_name != 'admin':
            return JsonResponse({
                'success': False,
                'message': 'Permission denied'
            }, status=403)
        
        # Delete video file from storage
        if video.video_file:
            try:
                if os.path.exists(video.video_file.path):
                    os.remove(video.video_file.path)
            except Exception:
                pass  # Continue even if file deletion fails
        
        # Delete thumbnail if exists
        if video.thumbnail:
            try:
                if os.path.exists(video.thumbnail.path):
                    os.remove(video.thumbnail.path)
            except Exception:
                pass
        
        # Delete video record
        video.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Video deleted successfully'
        })
        
    except CourseVideo.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Video not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@api_view(['GET'])
def get_subjects(request):
    """Get all available subjects for video categorization"""
    try:
        subjects = AlSubjects.objects.all().order_by('subject_name')
        serializer = SubjectSerializer(subjects, many=True)
        
        return JsonResponse({
            'success': True,
            'data': serializer.data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@api_view(['GET'])
def get_video_analytics(request, tutor_id):
    """Get video analytics for a tutor"""
    try:
        tutor = Tutors.objects.get(tutor_id=tutor_id)
        
        # Get user from request to verify ownership
        user_id = request.GET.get('user_id')
        if not user_id:
            return JsonResponse({
                'success': False,
                'message': 'User ID is required'
            }, status=400)
        
        try:
            user = Users.objects.get(user_id=user_id)
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Check if user owns this tutor profile
        if tutor.user != user:
            return JsonResponse({
                'success': False,
                'message': 'Permission denied'
            }, status=403)
        
        # Calculate analytics
        videos = CourseVideo.objects.filter(tutor=tutor)
        
        analytics = {
            'total_videos': videos.count(),
            'approved_videos': videos.filter(status='approved').count(),
            'pending_videos': videos.filter(status='pending').count(),
            'total_views': sum(video.view_count for video in videos),
            'total_likes': sum(video.likes for video in videos),
            'videos_by_category': {},
            'videos_by_month': {},
            'top_videos': []
        }
        
        # Videos by category
        categories = videos.values('category').annotate(count=Count('category'))
        for cat in categories:
            analytics['videos_by_category'][cat['category']] = cat['count']
        
        # Top performing videos
        top_videos = videos.order_by('-view_count')[:5]
        top_videos_serializer = CourseVideoSerializer(top_videos, many=True, context={'request': request})
        analytics['top_videos'] = top_videos_serializer.data
        
        return JsonResponse({
            'success': True,
            'data': analytics
        })
        
    except Tutors.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Tutor not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)
