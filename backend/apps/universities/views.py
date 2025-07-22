from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import Universities, UniversityEvents, Faculties
from apps.university_programs.models import DegreePrograms, DegreeProgramDurations
from apps.accounts.models import Users


def universities_list(request):
    """Get all universities"""
    if request.method == 'GET':
        try:
            universities = Universities.objects.filter(is_active=1)
            data = []
            for uni in universities:
                data.append({
                    'university_id': uni.university_id,
                    'id': uni.university_id,  # Also include 'id' for compatibility
                    'name': uni.name,
                    'location': uni.location,
                    'district': uni.district,
                    'address': uni.address,
                    'description': uni.description,
                    'contact_email': uni.contact_email,
                    'phone_number': uni.phone_number,
                    'website': uni.website,
                    'ugc_ranking': uni.ugc_ranking
                })
            
            return JsonResponse({
                'results': data,
                'count': len(data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching universities: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


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


def faculties_list(request):
    """Get faculties, optionally filtered by university"""
    if request.method == 'GET':
        try:
            university_id = request.GET.get('university_id')
            
            if university_id:
                # Filter faculties by university
                faculties = Faculties.objects.filter(university_id=university_id, is_active=1)
            else:
                # Get all active faculties
                faculties = Faculties.objects.filter(is_active=1)
            
            data = []
            for faculty in faculties:
                data.append({
                    'faculty_id': faculty.faculty_id,
                    'id': faculty.faculty_id,  # Also include 'id' for compatibility
                    'name': faculty.name,
                    'university_id': faculty.university_id,
                    'university_name': faculty.university.name if faculty.university else None,
                    'description': faculty.description,
                    'contact_email': faculty.contact_email,
                    'phone_number': faculty.phone_number
                })
            
            return JsonResponse({
                'results': data,
                'count': len(data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching faculties: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


def degree_programs_list(request):
    """Get degree programs, optionally filtered by university or faculty"""
    if request.method == 'GET':
        try:
            university_id = request.GET.get('university_id')
            faculty_id = request.GET.get('faculty_id')
            
            filters = {'is_active': 1}
            
            if university_id:
                filters['university_id'] = university_id
            
            # Note: DegreePrograms are linked to university, not faculty directly
            # If faculty filtering is needed, we'd need to add a faculty field to DegreePrograms
            # For now, we'll filter by university
            
            degree_programs = DegreePrograms.objects.filter(**filters)
            
            data = []
            for program in degree_programs:
                data.append({
                    'degree_program_id': program.degree_program_id,
                    'id': program.degree_program_id,  # Also include 'id' for compatibility
                    'name': program.title,
                    'title': program.title,
                    'code': program.code,
                    'university_id': program.university_id,
                    'university_name': program.university.name if program.university else None,
                    'description': program.description,
                    'subject_stream_required': program.subject_stream_required,
                    'career_paths': program.career_paths
                })
            
            return JsonResponse({
                'results': data,
                'count': len(data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching degree programs: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


def degree_program_durations_list(request):
    """Get degree program durations, optionally filtered by degree program"""
    if request.method == 'GET':
        try:
            degree_program_id = request.GET.get('degree_program_id')
            
            if degree_program_id:
                # Filter durations by degree program
                durations = DegreeProgramDurations.objects.filter(degree_program_id=degree_program_id)
            else:
                # Get all durations
                durations = DegreeProgramDurations.objects.all()
            
            data = []
            for duration in durations:
                data.append({
                    'duration_id': duration.duration_id,
                    'id': duration.duration_id,  # Also include 'id' for compatibility
                    'duration': f"{duration.duration_years} Years",
                    'name': f"{duration.duration_years} Years",  # Also include 'name' for compatibility
                    'duration_years': duration.duration_years,
                    'degree_type': duration.degree_type,
                    'degree_program_id': duration.degree_program_id,
                    'degree_program_name': duration.degree_program.title if duration.degree_program else None,
                    'description': duration.description
                })
            
            return JsonResponse({
                'results': data,
                'count': len(data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching durations: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)