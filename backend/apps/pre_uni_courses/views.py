import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from .models import PreUniCourse, CourseContent, CourseEnrollment
from apps.accounts.models import Users


@csrf_exempt
def create_course(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            title = data.get('title')
            description = data.get('description')
            category = data.get('category')
            status = data.get('status', 'Draft')
            price = data.get('price')
            duration = data.get('duration')
            thumbnail = data.get('thumbnail', '')
            created_by_id = data.get('created_by_id')

            if not all([title, description, category, created_by_id]):
                return JsonResponse({'success': False, 'message': 'Missing required fields'}, status=400)

            # Validate that the creator exists
            try:
                Users.objects.get(user_id=created_by_id)
            except Users.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Creator not found'}, status=404)

            course = PreUniCourse.objects.create(
                title=title,
                description=description,
                category=category,
                status=status,
                price=price,
                duration=duration,
                thumbnail=thumbnail,
                created_by_id=created_by_id,
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            return JsonResponse({'success': True, 'message': 'Course created successfully', 'id': course.course_id})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)


@csrf_exempt
def get_courses(request):
    if request.method == 'GET':
        try:
            courses = PreUniCourse.objects.all().order_by('-created_at')
            course_list = []
            for course in courses:
                course_list.append({
                    'id': course.course_id,
                    'title': course.title,
                    'description': course.description,
                    'category': course.category,
                    'status': course.status,
                    'price': float(course.price) if course.price else 0,
                    'duration': course.duration,
                    'thumbnail': course.thumbnail,
                    'enrollments': course.enrollments,
                    'rating': float(course.rating),
                    'created_by_id': course.created_by_id,
                    'created_at': course.created_at.strftime('%Y-%m-%d') if course.created_at else '',
                    'updated_at': course.updated_at.strftime('%Y-%m-%d') if course.updated_at else '',
                    'lastUpdated': course.updated_at.strftime('%Y-%m-%d') if course.updated_at else '',
                })
            return JsonResponse({'success': True, 'courses': course_list})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def update_course(request, course_id):
    if request.method == 'PUT':
        try:
            course = PreUniCourse.objects.get(course_id=course_id)
            
            # Parse JSON data from request body
            data = json.loads(request.body)
            
            # Update fields
            course.title = data.get('title', course.title)
            course.description = data.get('description', course.description)
            course.category = data.get('category', course.category)
            course.status = data.get('status', course.status)
            course.price = data.get('price', course.price)
            course.duration = data.get('duration', course.duration)
            course.thumbnail = data.get('thumbnail', course.thumbnail)
            
            course.updated_at = timezone.now()
            course.save()
            
            return JsonResponse({'success': True, 'message': 'Course updated successfully'})
        except PreUniCourse.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def delete_course(request, course_id):
    if request.method == 'DELETE':
        try:
            course = PreUniCourse.objects.get(course_id=course_id)
            course_title = course.title
            course.delete()
            
            return JsonResponse({'success': True, 'message': f'Course "{course_title}" deleted successfully'})
        except PreUniCourse.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)


@csrf_exempt
def get_course_stats(request):
    if request.method == 'GET':
        try:
            total_courses = PreUniCourse.objects.count()
            published_courses = PreUniCourse.objects.filter(status='Published').count()
            draft_courses = PreUniCourse.objects.filter(status='Draft').count()
            pending_courses = PreUniCourse.objects.filter(status='Pending').count()
            
            # Calculate total enrollments
            total_enrollments = CourseEnrollment.objects.count()
            
            return JsonResponse({
                'success': True,
                'stats': {
                    'total_courses': total_courses,
                    'published': published_courses,
                    'draft': draft_courses,
                    'pending': pending_courses,
                    'total_enrollments': total_enrollments
                }
            })
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)
