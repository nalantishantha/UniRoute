import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.utils.text import slugify
from django.db import models
from .models import PreUniversityCourse, CourseVideo, CourseEnrollment, VideoProgress
from .serializers import (
    serialize_course, serialize_course_video, serialize_enrollment, 
    validate_course_data
)
from apps.accounts.models import Users
from apps.mentoring.models import Mentors


@method_decorator(csrf_exempt, name='dispatch')
class CourseListCreateView(View):
    def get(self, request):
        """Get courses list with optional filtering"""
        try:
            # Get query parameters
            mentor_id = request.GET.get('mentor_id')
            status = request.GET.get('status')
            category = request.GET.get('category')
            search = request.GET.get('search')
            
            # Start with all courses
            courses = PreUniversityCourse.objects.all()
            
            # Apply filters
            if mentor_id:
                courses = courses.filter(mentor_id=mentor_id)
            
            if status and status != 'All':
                courses = courses.filter(status=status.lower())
            
            if category:
                courses = courses.filter(category=category)
            
            if search:
                courses = courses.filter(title__icontains=search)
            
            # Determine whether to include related content (videos, resources)
            include_related = request.GET.get('include_related', 'false').lower() in ['1', 'true', 'yes']

            # Serialize courses
            courses_data = [serialize_course(course, include_videos=include_related, include_resources=include_related) for course in courses]

            # If a student_id is provided, mark which courses are already enrolled by that student
            student_id = request.GET.get('student_id')
            if student_id:
                try:
                    enrolled_course_ids = list(CourseEnrollment.objects.filter(student__user_id=student_id, course__in=courses).values_list('course_id', flat=True))
                    for cd in courses_data:
                        cd['enrolled_by_current_user'] = cd.get('id') in enrolled_course_ids
                except Exception:
                    # If anything goes wrong checking enrollments, default to False
                    for cd in courses_data:
                        cd['enrolled_by_current_user'] = False
            else:
                for cd in courses_data:
                    # ensure the flag is present for frontend convenience
                    cd['enrolled_by_current_user'] = False
            
            return JsonResponse({
                'success': True,
                'courses': courses_data,
                'count': len(courses_data)
            })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def post(self, request):
        """Create a new course"""
        try:
            data = json.loads(request.body)
            
            # Validate data
            errors = validate_course_data(data)
            if errors:
                return JsonResponse({
                    'success': False,
                    'errors': errors
                }, status=400)
            
            # Get mentor (assuming mentor_id is passed in data or from authentication)
            mentor_id = data.get('mentor_id')
            if not mentor_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Mentor ID is required'
                }, status=400)
            
            try:
                mentor = Mentors.objects.get(mentor_id=mentor_id)
            except Mentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Mentor not found'
                }, status=404)
            
            # Create course
            course = PreUniversityCourse.objects.create(
                title=data['title'],
                description=data['description'],
                mentor=mentor,
                category=data['category'],
                level=data['level'],
                price=float(data.get('price', 0)),
                thumbnail_url=data.get('thumbnail_url', ''),
                thumbnail_public_id=data.get('thumbnail_public_id', ''),
                status='draft'  # Always start as draft
            )
            
            return JsonResponse({
                'success': True,
                'course': serialize_course(course),
                'message': 'Course created successfully'
            }, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class CourseDetailView(View):
    def get(self, request, course_id):
        """Get course details"""
        try:
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            
            return JsonResponse({
                'success': True,
                'course': serialize_course(course)
            })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def put(self, request, course_id):
        """Update course"""
        try:
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            data = json.loads(request.body)
            
            # Validate data
            errors = validate_course_data(data)
            if errors:
                return JsonResponse({
                    'success': False,
                    'errors': errors
                }, status=400)
            
            # Update course fields
            course.title = data.get('title', course.title)
            course.description = data.get('description', course.description)
            course.category = data.get('category', course.category)
            course.level = data.get('level', course.level)
            course.price = float(data.get('price', course.price))
            course.thumbnail_url = data.get('thumbnail_url', course.thumbnail_url)
            course.thumbnail_public_id = data.get('thumbnail_public_id', course.thumbnail_public_id)
            
            # Regenerate slug if title changed
            if 'title' in data:
                course.slug = slugify(data['title'])
            
            course.save()
            
            return JsonResponse({
                'success': True,
                'course': serialize_course(course),
                'message': 'Course updated successfully'
            })
        
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def delete(self, request, course_id):
        """Delete course"""
        try:
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            course_title = course.title
            course.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Course "{course_title}" deleted successfully'
            })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class CourseVideoView(View):
    def get(self, request, course_id):
        """Get videos for a course"""
        try:
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            videos = CourseVideo.objects.filter(course=course).order_by('order')
            
            videos_data = [serialize_course_video(video) for video in videos]
            
            return JsonResponse({
                'success': True,
                'videos': videos_data,
                'count': len(videos_data)
            })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def post(self, request, course_id):
        """Add video to course"""
        try:
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            data = json.loads(request.body)
            
            # Validate required fields
            if not data.get('title'):
                return JsonResponse({
                    'success': False,
                    'error': 'Video title is required'
                }, status=400)
            
            if not data.get('video_url'):
                return JsonResponse({
                    'success': False,
                    'error': 'Video URL is required'
                }, status=400)
            
            # Get next order number
            last_video = CourseVideo.objects.filter(course=course).order_by('-order').first()
            next_order = (last_video.order + 1) if last_video else 1
            
            # Create video
            video = CourseVideo.objects.create(
                course=course,
                title=data['title'],
                description=data.get('description', ''),
                order=data.get('order', next_order),
                video_url=data['video_url'],
                video_public_id=data.get('video_public_id', ''),
                video_provider=data.get('video_provider', 'cloudinary'),
                duration_seconds=data.get('duration_seconds'),
                file_size_bytes=data.get('file_size_bytes'),
                thumbnail_url=data.get('thumbnail_url', ''),
                is_preview=data.get('is_preview', False)
            )
            
            return JsonResponse({
                'success': True,
                'video': serialize_course_video(video),
                'message': 'Video added successfully'
            }, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@csrf_exempt
@require_http_methods(["PATCH"])
def update_course_status(request, course_id):
    """Update course status (for admins)"""
    try:
        course = get_object_or_404(PreUniversityCourse, id=course_id)
        data = json.loads(request.body)
        
        new_status = data.get('status')
        valid_statuses = ['draft', 'pending', 'approved', 'rejected', 'published']
        
        if new_status not in valid_statuses:
            return JsonResponse({
                'success': False,
                'error': 'Invalid status'
            }, status=400)
        
        course.status = new_status
        
        # If approving, set approval fields
        if new_status == 'approved':
            # In a real app, get this from authentication
            admin_id = data.get('admin_id')
            if admin_id:
                try:
                    admin = Users.objects.get(user_id=admin_id)
                    course.approved_by = admin
                    from django.utils import timezone
                    course.approved_at = timezone.now()
                except Users.DoesNotExist:
                    pass
        
        course.save()
        
        return JsonResponse({
            'success': True,
            'course': serialize_course(course),
            'message': f'Course status updated to {new_status}'
        })
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def course_categories(request):
    """Get available course categories"""
    categories = [
        {'value': 'mathematics', 'label': 'Mathematics'},
        {'value': 'physics', 'label': 'Physics'},
        {'value': 'chemistry', 'label': 'Chemistry'},
        {'value': 'biology', 'label': 'Biology'},
        {'value': 'english', 'label': 'English'},
        {'value': 'engineering', 'label': 'Engineering'},
        {'value': 'programming', 'label': 'Programming'},
        {'value': 'business', 'label': 'Business'},
        {'value': 'other', 'label': 'Other'},
    ]
    
    return JsonResponse({
        'success': True,
        'categories': categories
    })


@require_http_methods(["GET"])
def course_levels(request):
    """Get available course levels"""
    levels = [
        {'value': 'beginner', 'label': 'Beginner'},
        {'value': 'intermediate', 'label': 'Intermediate'},
        {'value': 'advanced', 'label': 'Advanced'},
    ]
    
    return JsonResponse({
        'success': True,
        'levels': levels
    })



@csrf_exempt
@require_http_methods(["POST"])
def video_progress(request, course_id, video_id):
    """Record video progress for an enrollment. Expects student_id, watched_seconds, completed (bool)."""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        watched_seconds = data.get('watched_seconds', 0)
        completed = data.get('completed', False)

        if not student_id:
            return JsonResponse({'success': False, 'error': 'student_id is required'}, status=400)

        course = get_object_or_404(PreUniversityCourse, id=course_id)
        video = get_object_or_404(CourseVideo, id=video_id, course=course)

        try:
            student = Users.objects.get(user_id=student_id)
        except Users.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Student not found'}, status=404)

        # Ensure enrollment exists
        enrollment, created = CourseEnrollment.objects.get_or_create(student=student, course=course)

        # Upsert VideoProgress
        vp, vp_created = VideoProgress.objects.get_or_create(enrollment=enrollment, video=video, defaults={'watched_seconds': watched_seconds, 'completed': completed})
        if not vp_created:
            vp.watched_seconds = max(vp.watched_seconds or 0, int(watched_seconds or 0))
            # once completed, keep completed True
            if completed:
                vp.completed = True
            vp.save()

        # If completed, optionally mark enrollment.completed True and update progress_percent
        if completed:
            try:
                enrollment.completed = True
                # compute progress percent as fraction of videos completed
                total_videos = CourseVideo.objects.filter(course=course).count() or 1
                completed_count = VideoProgress.objects.filter(enrollment=enrollment, completed=True, video__course=course).count()
                enrollment.progress_percent = min(100.0, (completed_count / total_videos) * 100.0)
                enrollment.save()
            except Exception:
                pass

        return JsonResponse({'success': True, 'video_progress': {'id': vp.id, 'watched_seconds': vp.watched_seconds, 'completed': vp.completed}})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def enroll_course(request, course_id):
    """Enroll a student in a course. Expects JSON body with student_id and optional payment_id."""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        payment_id = data.get('payment_id')

        if not student_id:
            return JsonResponse({'success': False, 'error': 'student_id is required'}, status=400)

        course = get_object_or_404(PreUniversityCourse, id=course_id)

        # Ensure student exists
        try:
            student = Users.objects.get(user_id=student_id)
        except Users.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Student not found'}, status=404)

        # Prevent duplicate enrollments
        existing = CourseEnrollment.objects.filter(student=student, course=course).first()
        if existing:
            return JsonResponse({'success': True, 'message': 'Already enrolled', 'enrollment': serialize_enrollment(existing)})

        enrollment = CourseEnrollment.objects.create(
            student=student,
            course=course,
            payment_id=payment_id
        )

        # Update course enroll_count
        try:
            course.enroll_count = CourseEnrollment.objects.filter(course=course).count()
            course.save()
        except Exception:
            pass

        return JsonResponse({'success': True, 'enrollment': serialize_enrollment(enrollment)}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def rate_course(request, course_id):
    """Record a student's rating and optional review for a course and update course aggregates."""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        rating = data.get('rating')
        review = data.get('review')

        if not student_id:
            return JsonResponse({'success': False, 'error': 'student_id is required'}, status=400)

        if rating is None:
            return JsonResponse({'success': False, 'error': 'rating is required'}, status=400)

        try:
            rating = float(rating)
        except Exception:
            return JsonResponse({'success': False, 'error': 'rating must be a number'}, status=400)

        if rating < 0 or rating > 5:
            return JsonResponse({'success': False, 'error': 'rating must be between 0 and 5'}, status=400)

        course = get_object_or_404(PreUniversityCourse, id=course_id)

        try:
            student = Users.objects.get(user_id=student_id)
        except Users.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Student not found'}, status=404)

        # Ensure there's an enrollment record — create if missing
        enrollment, created = CourseEnrollment.objects.get_or_create(student=student, course=course)

        # Try to verify student progress (completed videos or enrollment.completed).
        # If progress verification fails or shows no completed videos, we will still accept the rating
        # but mark the enrollment as completed (progress_percent=100) to reflect the user's rating action.
        try:
            progress_completed = CourseEnrollment.objects.filter(id=enrollment.id, completed=True).exists() or \
                VideoProgress.objects.filter(enrollment=enrollment, completed=True, video__course=course).exists()
        except Exception:
            # If we can't verify progress due to an unexpected error, log and proceed to accept rating
            progress_completed = False

        if not progress_completed:
            try:
                enrollment.completed = True
                enrollment.progress_percent = 100.0
                enrollment.save()
            except Exception:
                # ignore failures updating enrollment; we'll still attempt to save rating
                pass

        # Update enrollment rating/review
        enrollment.rating = int(round(rating)) if rating is not None else None
        if review is not None:
            enrollment.review = review
        enrollment.save()

        # Recalculate course aggregates: rating_count and average_rating
        try:
            agg = CourseEnrollment.objects.filter(course=course, rating__isnull=False).aggregate(
                count=models.Count('id'), avg=models.Avg('rating')
            )
            course.rating_count = agg['count'] or 0
            course.average_rating = float(agg['avg'] or 0)
            course.save()
        except Exception:
            pass

        return JsonResponse({'success': True, 'enrollment': serialize_enrollment(enrollment), 'course': serialize_course(course)})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


# =================== COURSE CONTENT UPLOAD API ===================

@method_decorator(csrf_exempt, name='dispatch')
class CourseResourceView(View):
    """API for managing course resources (PDFs, documents, etc.)"""
    
    def get(self, request, course_id):
        """Get all resources for a course"""
        try:
            from .models import CourseResource
            
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            resources = CourseResource.objects.filter(course=course).order_by('order')
            
            resources_data = []
            for resource in resources:
                resources_data.append({
                    'id': resource.id,
                    'title': resource.title,
                    'description': resource.description,
                    'resource_type': resource.resource_type,
                    'file_url': resource.file_url,
                    'file_size_bytes': resource.file_size_bytes,
                    'download_count': resource.download_count,
                    'is_free': resource.is_free,
                    'order': resource.order,
                    'uploaded_at': resource.uploaded_at.isoformat(),
                })
            
            return JsonResponse({
                'success': True,
                'resources': resources_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def post(self, request, course_id):
        """Create new course resource"""
        try:
            from .models import CourseResource
            
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['title', 'resource_type', 'file_url']
            errors = {}
            
            for field in required_fields:
                if not data.get(field):
                    errors[field] = f'{field} is required'
            
            # Validate resource type
            valid_types = ['pdf', 'doc', 'ppt', 'excel', 'image', 'zip', 'link']
            if data.get('resource_type') not in valid_types:
                errors['resource_type'] = f'Invalid resource type. Must be one of: {", ".join(valid_types)}'
            
            if errors:
                return JsonResponse({
                    'success': False,
                    'errors': errors
                }, status=400)
            
            # Get next order number
            max_order = CourseResource.objects.filter(course=course).aggregate(
                max_order=models.Max('order')
            )['max_order'] or 0
            
            # Create resource
            resource = CourseResource.objects.create(
                course=course,
                title=data['title'],
                description=data.get('description', ''),
                resource_type=data['resource_type'],
                file_url=data['file_url'],
                file_public_id=data.get('file_public_id', ''),
                file_size_bytes=data.get('file_size_bytes'),
                is_free=data.get('is_free', False),
                order=max_order + 1
            )
            
            return JsonResponse({
                'success': True,
                'resource': {
                    'id': resource.id,
                    'title': resource.title,
                    'description': resource.description,
                    'resource_type': resource.resource_type,
                    'file_url': resource.file_url,
                    'file_size_bytes': resource.file_size_bytes,
                    'download_count': resource.download_count,
                    'is_free': resource.is_free,
                    'order': resource.order,
                    'uploaded_at': resource.uploaded_at.isoformat(),
                },
                'message': 'Resource uploaded successfully'
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class CourseResourceDetailView(View):
    """API for managing individual course resources"""
    
    def put(self, request, course_id, resource_id):
        """Update course resource"""
        try:
            from .models import CourseResource
            
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            resource = get_object_or_404(CourseResource, id=resource_id, course=course)
            data = json.loads(request.body)
            
            # Update fields
            if 'title' in data:
                resource.title = data['title']
            if 'description' in data:
                resource.description = data['description']
            if 'is_free' in data:
                resource.is_free = data['is_free']
            if 'order' in data:
                resource.order = data['order']
            
            resource.save()
            
            return JsonResponse({
                'success': True,
                'resource': {
                    'id': resource.id,
                    'title': resource.title,
                    'description': resource.description,
                    'resource_type': resource.resource_type,
                    'file_url': resource.file_url,
                    'file_size_bytes': resource.file_size_bytes,
                    'download_count': resource.download_count,
                    'is_free': resource.is_free,
                    'order': resource.order,
                    'uploaded_at': resource.uploaded_at.isoformat(),
                },
                'message': 'Resource updated successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def delete(self, request, course_id, resource_id):
        """Delete course resource"""
        try:
            from .models import CourseResource
            
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            resource = get_object_or_404(CourseResource, id=resource_id, course=course)
            
            resource.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Resource deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch') 
class BulkResourceOrderView(View):
    """API for reordering multiple resources at once"""
    
    def put(self, request, course_id):
        """Update order of multiple resources"""
        try:
            from .models import CourseResource
            
            course = get_object_or_404(PreUniversityCourse, id=course_id)
            data = json.loads(request.body)
            
            resource_orders = data.get('resource_orders', [])
            
            # Update orders in bulk
            for item in resource_orders:
                resource_id = item.get('id')
                new_order = item.get('order')
                
                if resource_id and new_order is not None:
                    CourseResource.objects.filter(
                        id=resource_id, 
                        course=course
                    ).update(order=new_order)
            
            return JsonResponse({
                'success': True,
                'message': 'Resource order updated successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)