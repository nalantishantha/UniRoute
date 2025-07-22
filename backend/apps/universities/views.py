from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import Universities, UniversityEvents
from apps.accounts.models import Users


def universities_list(request):
    universities = Universities.objects.all()[:10]
    data = []
    for uni in universities:
        data.append({
            'id': uni.university_id,
            'name': uni.name,
            'location': uni.location,
            'district': uni.district
        })
    return JsonResponse({'universities': data, 'count': len(data)})


@csrf_exempt
def create_university_event(request):
    """Create a new university event"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get required fields
            university_id = data.get('university_id')
            title = data.get('title')
            description = data.get('description', '')
            event_type = data.get('event_type')
            event_date = data.get('event_date')
            location = data.get('location', '')
            
            # Validation
            if not all([university_id, title, event_type, event_date]):
                return JsonResponse({
                    'success': False,
                    'message': 'University ID, title, event type, and event date are required'
                }, status=400)
            
            # Check if university exists
            try:
                university = Universities.objects.get(university_id=university_id)
            except Universities.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University not found'
                }, status=404)
            
            # Create the event
            with transaction.atomic():
                event = UniversityEvents.objects.create(
                    university=university,
                    title=title,
                    description=description,
                    event_type=event_type,
                    event_date=event_date,
                    location=location,
                    created_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'University event created successfully',
                    'event': {
                        'event_id': event.event_id,
                        'title': event.title,
                        'event_type': event.event_type,
                        'event_date': event.event_date,
                        'university_name': university.name
                    }
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error creating event: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def get_university_events(request):
    """Get all university events or events by university"""
    if request.method == 'GET':
        try:
            university_id = request.GET.get('university_id')
            event_type = request.GET.get('event_type')
            
            filters = {}
            if university_id:
                filters['university_id'] = university_id
            if event_type:
                filters['event_type'] = event_type
            
            events = UniversityEvents.objects.filter(**filters)
            
            events_data = []
            for event in events:
                events_data.append({
                    'event_id': event.event_id,
                    'university_id': event.university.university_id,
                    'university_name': event.university.name,
                    'university_location': event.university.location,
                    'title': event.title,
                    'description': event.description,
                    'event_type': event.event_type,
                    'event_date': event.event_date,
                    'location': event.location,
                    'created_at': event.created_at
                })
            
            return JsonResponse({
                'success': True,
                'events': events_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching events: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def update_university_event(request, event_id):
    """Update a university event"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            try:
                event = UniversityEvents.objects.get(event_id=event_id)
            except UniversityEvents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Event not found'
                }, status=404)
            
            # Update fields if provided
            if 'title' in data:
                event.title = data['title']
            if 'description' in data:
                event.description = data['description']
            if 'event_type' in data:
                event.event_type = data['event_type']
            if 'event_date' in data:
                event.event_date = data['event_date']
            if 'location' in data:
                event.location = data['location']
            
            event.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Event updated successfully',
                'event': {
                    'event_id': event.event_id,
                    'title': event.title,
                    'event_type': event.event_type,
                    'event_date': event.event_date
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error updating event: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)


@csrf_exempt
def delete_university_event(request, event_id):
    """Delete a university event"""
    if request.method == 'DELETE':
        try:
            try:
                event = UniversityEvents.objects.get(event_id=event_id)
            except UniversityEvents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Event not found'
                }, status=404)
            
            # Delete the event
            event.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Event deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error deleting event: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only DELETE method allowed'
    }, status=405)