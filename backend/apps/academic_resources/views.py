import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from .models import AcademicResource
from apps.accounts.models import Users

@csrf_exempt
def upload_resource(request):
    if request.method == 'POST':
        try:
            title = request.POST.get('title')
            description = request.POST.get('description')
            category = request.POST.get('category')
            tags = request.POST.get('tags', '[]')
            status = request.POST.get('status', 'Available')
            author = request.POST.get('author', '')
            related_course = request.POST.get('related_course', '')
            is_public = request.POST.get('is_public', 'true') == 'true'
            uploaded_by_id = request.POST.get('uploaded_by_id')
            file = request.FILES.get('file')

            if not all([title, description, category, uploaded_by_id, file]):
                return JsonResponse({'success': False, 'message': 'Missing required fields'}, status=400)

            uploaded_by = Users.objects.get(user_id=uploaded_by_id)
            resource = AcademicResource.objects.create(
                title=title,
                description=description,
                category=category,
                tags=json.loads(tags),
                status=status,
                author=author,
                related_course=related_course,
                file=file,
                file_type=file.content_type,
                file_size=str(file.size),
                is_public=is_public,
                uploaded_by=uploaded_by,
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            return JsonResponse({'success': True, 'message': 'Resource uploaded successfully', 'id': resource.id})
        except Users.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Uploader not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def get_resources(request):
    if request.method == 'GET':
        try:
            resources = AcademicResource.objects.all().order_by('-created_at')
            resource_list = []
            for resource in resources:
                resource_list.append({
                    'id': resource.id,
                    'title': resource.title,
                    'description': resource.description,
                    'category': resource.category,
                    'tags': resource.tags,
                    'status': resource.status,
                    'author': resource.author,
                    'related_course': resource.related_course,
                    'file_type': resource.file_type,
                    'file_size': resource.file_size,
                    'is_public': resource.is_public,
                    'downloads': resource.downloads,
                    'views': resource.views,
                    'created_at': resource.created_at.strftime('%Y-%m-%d'),
                    'updated_at': resource.updated_at.strftime('%Y-%m-%d'),
                    'uploaded_by_id': resource.uploaded_by.user_id,
                    'size': resource.file_size,  # For compatibility with frontend
                    'uploadDate': resource.created_at.strftime('%Y-%m-%d'),  # For compatibility
                    'type': resource.file_type.lower() if resource.file_type else 'document',
                })
            return JsonResponse({'success': True, 'resources': resource_list})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_resource(request, resource_id):
    if request.method == 'PUT':
        try:
            resource = AcademicResource.objects.get(id=resource_id)
            
            # Parse JSON data from request body
            data = json.loads(request.body)
            
            # Update fields
            resource.title = data.get('title', resource.title)
            resource.description = data.get('description', resource.description)
            resource.category = data.get('category', resource.category)
            resource.status = data.get('status', resource.status)
            resource.author = data.get('author', resource.author)
            resource.related_course = data.get('related_course', resource.related_course)
            resource.file_type = data.get('file_type', resource.file_type)
            resource.file_size = data.get('file_size', resource.file_size)
            
            # Handle tags
            tags_str = data.get('tags', '[]')
            if isinstance(tags_str, str):
                resource.tags = json.loads(tags_str)
            else:
                resource.tags = tags_str
            
            resource.updated_at = timezone.now()
            resource.save()
            
            return JsonResponse({'success': True, 'message': 'Resource updated successfully'})
        except AcademicResource.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Resource not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def delete_resource(request, resource_id):
    if request.method == 'DELETE':
        try:
            resource = AcademicResource.objects.get(id=resource_id)
            
            # Optional: Delete the actual file from storage
            if resource.file:
                try:
                    resource.file.delete()
                except Exception as e:
                    print(f"Error deleting file: {e}")
            
            # Delete the database record
            resource.delete()
            
            return JsonResponse({'success': True, 'message': 'Resource deleted successfully'})
        except AcademicResource.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Resource not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)