from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
from django.contrib.auth.hashers import make_password
import json
import string
from .models import Universities, UniversityEvents, Faculties, UniversityRequests
from apps.university_programs.models import DegreePrograms, DegreeProgramDurations
from apps.accounts.models import Users, UserDetails, UserTypes


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
            # If a university_id is provided, return all degree programs for that university
            # (don't restrict by is_active). When listing without a university filter, default
            # to only active programs.
            if university_id:
                filters = {'university_id': university_id}
            else:
                filters = {'is_active': 1}
            
            # Note: DegreePrograms are linked to university, not faculty directly
            # If faculty filtering is needed, we'd need to add a faculty field to DegreePrograms
            # For now, we'll filter by university
            
            # join university using select_related for efficiency
            degree_programs = DegreePrograms.objects.filter(**filters).select_related('university')
            
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


def universities_detailed_list(request):
    """Get universities with extra details: logo, ugc_ranking, faculties count, degree programs list/count"""
    if request.method == 'GET':
        try:
            universities = Universities.objects.filter(is_active=1)
            data = []
            # normalization helpers
            def normalize_title(s):
                if not s:
                    return s
                try:
                    return string.capwords(s.strip().lower())
                except Exception:
                    return s

            def sentence_case(s):
                if not s:
                    return s
                s = s.strip()
                if len(s) == 0:
                    return s
                return s[0].upper() + s[1:].lower()

            # Pre-fetch related info for efficiency
            from django.db.models import Count

            # Count faculties per university
            faculty_counts = Faculties.objects.filter(is_active=1).values('university_id').annotate(count=Count('faculty_id'))
            faculty_map = {f['university_id']: f['count'] for f in faculty_counts}

            # Degree programs grouped per university
            degree_programs = DegreePrograms.objects.filter(is_active=1).select_related('university')
            prog_map = {}
            for prog in degree_programs:
                u_id = prog.university_id
                if u_id not in prog_map:
                    prog_map[u_id] = []
                prog_map[u_id].append({
                    'degree_program_id': prog.degree_program_id,
                    'id': prog.degree_program_id,
                    'title': normalize_title(prog.title),
                    'code': prog.code,
                    'description': sentence_case(prog.description),
                })

            for uni in universities:
                uprogs = prog_map.get(uni.university_id, [])
                data.append({
                    'university_id': uni.university_id,
                    'id': uni.university_id,
                    'name': normalize_title(uni.name),
                    'location': normalize_title(uni.location) if uni.location else uni.location,
                    'district': normalize_title(uni.district) if uni.district else uni.district,
                    'address': uni.address,
                    'description': sentence_case(uni.description),
                    'contact_email': uni.contact_email,
                    'phone_number': uni.phone_number,
                    'website': uni.website,
                    'logo': uni.logo,  # frontend will use this as background/logo
                    'ugc_ranking': uni.ugc_ranking,
                    'faculties_count': faculty_map.get(uni.university_id, 0),
                    'degree_programs_count': len(uprogs),
                    'degree_programs': uprogs,
                })

            return JsonResponse({
                'results': data,
                'count': len(data)
            })

        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching detailed universities: {str(e)}'
            }, status=500)

    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


# Admin Functions for University Request Management

def university_requests_list(request):
    """Get university registration requests (for admin)"""
    if request.method == 'GET':
        try:
            status_filter = request.GET.get('status', 'pending')  # Default to pending
            
            if status_filter == 'all':
                requests = UniversityRequests.objects.all()
            else:
                requests = UniversityRequests.objects.filter(status=status_filter)
            
            data = []
            for req in requests:
                data.append({
                    'request_id': req.request_id,
                    'university_name': req.university_name,
                    'contact_person_name': req.contact_person_name,
                    'contact_person_title': req.contact_person_title,
                    'email': req.email,
                    'phone_number': req.phone_number,
                    'location': req.location,
                    'district': req.district,
                    'address': req.address,
                    'description': req.description,
                    'website': req.website,
                    'established_year': req.established_year,
                    'status': req.status,
                    'submitted_at': req.submitted_at,
                    'reviewed_at': req.reviewed_at,
                    'reviewed_by': req.reviewed_by.username if req.reviewed_by else None,
                    'rejection_reason': req.rejection_reason
                })
            
            return JsonResponse({
                'results': data,
                'count': len(data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching university requests: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def approve_university_request(request, request_id):
    """Approve a university registration request (for admin)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            admin_user_id = data.get('admin_user_id')  # Should be passed from frontend
            ugc_ranking = data.get('ugc_ranking')  # Optional ranking assigned by admin
            
            # Get the request
            try:
                university_request = UniversityRequests.objects.get(request_id=request_id, status='pending')
            except UniversityRequests.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University request not found or already processed'
                }, status=404)
            
            # Get admin user (optional validation)
            admin_user = None
            if admin_user_id:
                try:
                    admin_user = Users.objects.get(user_id=admin_user_id)
                except Users.DoesNotExist:
                    pass
            
            with transaction.atomic():
                # Create username from university name
                username = university_request.university_name.lower().replace(' ', '.').replace('-', '.')
                original_username = username
                counter = 1
                while Users.objects.filter(username=username).exists():
                    username = f"{original_username}{counter}"
                    counter += 1
                
                # Get university user type (institution)
                university_user_type = UserTypes.objects.get(type_id=11)  # Institution type
                
                # Create user account
                user = Users.objects.create(
                    username=username,
                    email=university_request.email,
                    password_hash=university_request.password_hash,  # Already hashed
                    user_type=university_user_type,
                    is_active=1,  # Activate the account
                    created_at=timezone.now()
                )
                
                # Create user details
                name_parts = university_request.contact_person_name.split()
                first_name = name_parts[0] if name_parts else ''
                last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
                
                user_details = UserDetails.objects.create(
                    user=user,
                    full_name=university_request.contact_person_name,
                    contact_number=university_request.phone_number or '',
                    is_verified=1,  # Auto-verify approved universities
                    updated_at=timezone.now()
                )
                
                # Create university record
                university = Universities.objects.create(
                    name=university_request.university_name,
                    location=university_request.location,
                    district=university_request.district or university_request.location,
                    address=university_request.address,
                    description=university_request.description,
                    contact_email=university_request.email,
                    phone_number=university_request.phone_number,
                    website=university_request.website,
                    ugc_ranking=ugc_ranking,
                    is_active=1,
                    created_at=timezone.now()
                )
                
                # Update the request status
                university_request.status = 'approved'
                university_request.reviewed_at = timezone.now()
                university_request.reviewed_by = admin_user
                university_request.created_user = user
                university_request.created_university = university
                university_request.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'University request approved successfully',
                    'university': {
                        'university_id': university.university_id,
                        'name': university.name,
                        'user_id': user.user_id,
                        'username': user.username,
                        'email': user.email
                    }
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error approving request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def reject_university_request(request, request_id):
    """Reject a university registration request (for admin)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            admin_user_id = data.get('admin_user_id')
            rejection_reason = data.get('rejection_reason', 'Request rejected by admin')
            
            # Get the request
            try:
                university_request = UniversityRequests.objects.get(request_id=request_id, status='pending')
            except UniversityRequests.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University request not found or already processed'
                }, status=404)
            
            # Get admin user (optional validation)
            admin_user = None
            if admin_user_id:
                try:
                    admin_user = Users.objects.get(user_id=admin_user_id)
                except Users.DoesNotExist:
                    pass
            
            # Update the request status
            university_request.status = 'rejected'
            university_request.reviewed_at = timezone.now()
            university_request.reviewed_by = admin_user
            university_request.rejection_reason = rejection_reason
            university_request.save()
            
            return JsonResponse({
                'success': True,
                'message': 'University request rejected',
                'request_id': request_id,
                'rejection_reason': rejection_reason
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error rejecting request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)