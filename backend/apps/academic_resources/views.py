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
                file=file,
                file_type=file.content_type,
                file_size=str(file.size),
                is_public=is_public,
                uploaded_by=uploaded_by,
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            return JsonResponse({'success': True, 'id': resource.id})
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