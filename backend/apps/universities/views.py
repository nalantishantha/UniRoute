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
from .models import (
    Universities,
    UniversityEvents,
    UniversityDashboardAdmin,
    UniversityDashboardA,
    UniversityManagePortfolio,
    UniversityAnnouncement,
    UniversityAnnouncements,
)
from apps.accounts.models import Users
from django.utils.timezone import now
from django.db.utils import OperationalError, ProgrammingError


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


# ------------------------- Announcements CRUD -------------------------

def _serialize_announcement(a, source='new'):
    """Serialize both new and legacy announcement models to a unified shape."""
    if source == 'legacy':
        # UniversityAnnouncements (legacy) has: title, message, valid_from, created_at, announcement_type
        date_val = a.valid_from or (
            a.created_at.date() if a.created_at else None)
        return {
            'id': a.announcement_id,
            'title': a.title,
            'description': a.message or '',
            'date': date_val.strftime('%Y-%m-%d') if date_val else None,
            'author': 'System',
            'status': (a.announcement_type or 'published').lower(),
            'university_id': a.university.university_id if a.university else None,
            'source': 'legacy',
        }
    # New model UniversityAnnouncement
    return {
        'id': a.announcement_id,
        'title': a.title,
        'description': a.description,
        'date': a.date.strftime('%Y-%m-%d') if a.date else None,
        'author': a.author,
        'status': a.status,
        'university_id': a.university.university_id if a.university else None,
        'source': 'new',
    }


@csrf_exempt
def announcements_list_create(request):
    """GET: list announcements (optionally filtered by university_id)
    POST: create announcement. Auto-seed defaults if none exist and seed=true
    is passed or database empty.
    """
    if request.method == 'GET':
        try:
            university_id = request.GET.get('university_id')
            try:
                # Try new table first
                qs = UniversityAnnouncement.objects.all().order_by('-date', '-created_at')
                if university_id:
                    qs = qs.filter(university_id=university_id)

                # Auto-seed only if new table exists and is empty
                if not qs.exists() and request.GET.get('seed', 'true') == 'true':
                    uni = None
                    if university_id:
                        uni = Universities.objects.filter(
                            university_id=university_id).first()
                    defaults = [
                        {
                            'title': 'Semester Registration Open',
                            'description': 'Registration for the new semester is now open. Please complete your registration before the deadline.',
                            'date': '2025-07-01',
                            'author': 'Registrar',
                            'status': 'published'
                        },
                        {
                            'title': 'Library Closed for Renovation',
                            'description': 'The main library will be closed from July 15 to July 30 for renovation.',
                            'date': '2025-07-10',
                            'author': 'Library Admin',
                            'status': 'draft'
                        },
                        {
                            'title': 'New Cafeteria Menu',
                            'description': 'The university cafeteria has introduced a new menu starting this week. Check it out for healthy and affordable meals.',
                            'date': '2025-07-12',
                            'author': 'Cafeteria Manager',
                            'status': 'published'
                        },
                        {
                            'title': 'Guest Lecture: AI in Education',
                            'description': 'Join us for a guest lecture on Artificial Intelligence in Education by Dr. Jane Smith on July 18th at the Main Auditorium.',
                            'date': '2025-07-18',
                            'author': 'Academic Affairs',
                            'status': 'published'
                        },
                        {
                            'title': 'Sports Meet Registration',
                            'description': 'Registrations for the annual sports meet are now open. Interested students can sign up at the Sports Office.',
                            'date': '2025-07-20',
                            'author': 'Sports Coordinator',
                            'status': 'draft'
                        }
                    ]
                    for d in defaults:
                        UniversityAnnouncement.objects.create(
                            university=uni,
                            title=d['title'],
                            description=d['description'],
                            date=d['date'],
                            author=d['author'],
                            status=d['status'],
                        )
                    qs = UniversityAnnouncement.objects.all().order_by('-date', '-created_at')
                    if university_id:
                        qs = qs.filter(university_id=university_id)

                results = [_serialize_announcement(a, 'new') for a in qs]
            except (OperationalError, ProgrammingError):
                # New table not present — use legacy instead
                legacy_qs = UniversityAnnouncements.objects.all().order_by(
                    '-valid_from', '-created_at')
                if university_id:
                    legacy_qs = legacy_qs.filter(university_id=university_id)
                results = [_serialize_announcement(
                    a, 'legacy') for a in legacy_qs]

            return JsonResponse({'success': True, 'announcements': results})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    if request.method == 'POST':
        try:
            data = json.loads(request.body or '{}')
            university = None
            uid = data.get('university_id')
            if uid:
                university = Universities.objects.filter(
                    university_id=uid).first()
            try:
                a = UniversityAnnouncement.objects.create(
                    university=university,
                    title=data['title'],
                    description=data.get('description', ''),
                    date=data['date'],
                    author=data.get('author', ''),
                    status=data.get('status', 'draft'),
                )
                return JsonResponse({'success': True, 'announcement': _serialize_announcement(a, 'new')}, status=201)
            except (OperationalError, ProgrammingError):
                # Fallback: create in legacy table
                a = UniversityAnnouncements.objects.create(
                    university=university,
                    title=data['title'],
                    message=data.get('description', ''),
                    announcement_type=data.get('status', 'published'),
                    valid_from=data.get('date') or None,
                    created_at=timezone.now(),
                )
                return JsonResponse({'success': True, 'announcement': _serialize_announcement(a, 'legacy')}, status=201)
        except KeyError as e:
            return JsonResponse({'success': False, 'message': f'Missing field: {e}'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def announcement_update_delete(request, announcement_id):
    try:
        # Decide target model based on ?legacy=true
        is_legacy = str(request.GET.get('legacy', 'false')).lower() == 'true'
        if is_legacy:
            a = UniversityAnnouncements.objects.get(
                announcement_id=announcement_id)
        else:
            a = UniversityAnnouncement.objects.get(
                announcement_id=announcement_id)
    except UniversityAnnouncement.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Announcement not found'}, status=404)
    except UniversityAnnouncements.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Announcement not found'}, status=404)

    if request.method == 'PUT':
        try:
            data = json.loads(request.body or '{}')
            if isinstance(a, UniversityAnnouncement):
                for field in ['title', 'description', 'date', 'author', 'status']:
                    if field in data:
                        setattr(a, field, data[field])
                a.save()
                return JsonResponse({'success': True, 'announcement': _serialize_announcement(a, 'new')})
            else:  # legacy
                if 'title' in data:
                    a.title = data['title']
                if 'description' in data:
                    a.message = data['description']
                if 'date' in data and data['date']:
                    a.valid_from = data['date']
                if 'status' in data:
                    a.announcement_type = data['status']
                a.save()
                return JsonResponse({'success': True, 'announcement': _serialize_announcement(a, 'legacy')})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    if request.method == 'DELETE':
        a.delete()
        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


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
                university = Universities.objects.get(
                    university_id=university_id)
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
            
            # Initialize filters dictionary
            filters = {}
            
            # If a university_id is provided, return all degree programs for that university
            # (don't restrict by is_active). When listing without a university filter, default
            # to only active programs.
            if university_id:
                filters['university_id'] = university_id
            # If faculty filter provided, include it
            if faculty_id:
                filters['faculty_id'] = faculty_id
            # Allow filtering by subject stream (frontend may pass 'subject_stream')
            subject_stream = request.GET.get('subject_stream')
            if subject_stream:
                # field is subject_stream_required on the model
                filters['subject_stream_required'] = subject_stream
                
            # Default to active programs if no university filter
            if not university_id:
                filters['is_active'] = 1
                
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
                    'faculty_id': program.faculty_id if hasattr(program, 'faculty_id') else None,
                    'faculty_name': program.faculty.name if getattr(program, 'faculty', None) else None,
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


def quick_stats(request):
    """Get quick statistics for the university guide dashboard"""
    if request.method == 'GET':
        try:
            from apps.university_students.models import UniversityStudents
            
            # Count universities
            universities_count = Universities.objects.filter(is_active=1).count()
            
            # Count faculties
            faculties_count = Faculties.objects.count()
            
            # Count university students
            students_count = UniversityStudents.objects.count()
            
            # Count degree programs
            degree_programs_count = DegreePrograms.objects.count()
            
            return JsonResponse({
                'success': True,
                'stats': {
                    'universities_count': universities_count,
                    'faculties_count': faculties_count,
                    'students_count': students_count,
                    'degree_programs_count': degree_programs_count
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching statistics: {str(e)}',
                'stats': {
                    'universities_count': 0,
                    'faculties_count': 0,
                    'students_count': 0,
                    'degree_programs_count': 0
                }
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)
# University Dashboard Admin APIs

@csrf_exempt
def get_university_dashboard_admin(request):
    """Fetch dashboard admin content for a university.

    Query params:
    - university_id: required, the target university id
    """
    if request.method == 'GET':
        university_id = request.GET.get('university_id')
        if not university_id:
            return JsonResponse({'success': False, 'message': 'university_id is required'}, status=400)
        try:
            # Prefer the new A table; fall back to old if needed
            try:
                dashboard = UniversityDashboardA.objects.get(
                    university_id=university_id)
            except UniversityDashboardA.DoesNotExist:
                # Auto-seed from simple defaults the first time if nothing exists
                legacy = UniversityDashboardAdmin.objects.filter(
                    university_id=university_id).first()
                if legacy:
                    dashboard = UniversityDashboardA.objects.create(
                        university=legacy.university,
                        hero_title=legacy.hero_title,
                        hero_subtitle=legacy.hero_subtitle,
                        stats=legacy.stats,
                        quick_actions=legacy.quick_actions,
                        recent_activities=legacy.recent_activities,
                        metrics=legacy.metrics,
                        statuses=legacy.statuses,
                    )
                else:
                    # Seed with generic defaults similar to frontend fallbacks
                    try:
                        uni = Universities.objects.get(
                            university_id=university_id)
                    except Universities.DoesNotExist:
                        return JsonResponse({'success': False, 'message': 'University not found for seeding'}, status=404)
                    dashboard = UniversityDashboardA.objects.create(
                        university=uni,
                        hero_title='University Overview',
                        hero_subtitle='Real-time insights and key metrics',
                        stats=[
                            {"id": 1, "label": "Total Students", "value": 4200,
                                "iconKey": "user-graduate", "trend": "+12%"},
                            {"id": 2, "label": "Faculties", "value": 10,
                                "iconKey": "university", "trend": "+2"},
                            {"id": 3, "label": "Active Courses", "value": 120,
                                "iconKey": "book", "trend": "+8%"},
                            {"id": 4, "label": "Upcoming Events", "value": 5,
                                "iconKey": "calendar", "trend": "+3"},
                        ],
                        quick_actions=[
                            {"id": 1, "title": "📢 Publish Announcements", "description": "Share important news and updates with all students and staff members across the university.",
                                "link": "/university/announcement", "color": "blue", "stats": "25 active announcements"},
                            {"id": 2, "title": "📅 Manage Events", "description": "Organize and promote university events with the integrated calendar system and event management This updated by weekly.",
                                "link": "/university/announcement", "color": "purple", "stats": "8 upcoming events"},
                            {"id": 3, "title": "📖 Academic Content", "description": "Upload, update, and manage course materials, syllabi and academic resources for all faculties ",
                                "link": "/university/academic-content", "color": "green", "stats": "340 content files"},
                            {"id": 4, "title": "🎯 Advertise University", "description": "Create and publish promotional advertisements to attract new students and showcase programs.",
                                "link": "/university/ad-publish", "color": "orange", "stats": "12 active ads"},
                            {"id": 5, "title": "💼 Manage Portfolio", "description": "Manage university portfolio, achievements, certifications and institutional credentials with others.",
                                "link": "/university/manage-portfolio", "color": "purple", "stats": "18 portfolio items"},
                        ],
                        recent_activities=[
                            {"id": 1, "type": "announcement", "title": "New Academic Year Registration",
                                "time": "2 hours ago", "priority": "high"},
                            {"id": 2, "type": "event", "title": "Science Fair 2025",
                                "time": "5 hours ago", "priority": "medium"},
                            {"id": 3, "type": "course", "title": "Data Science Course Updated",
                                "time": "1 day ago", "priority": "low"},
                            {"id": 4, "type": "student", "title": "50 New Student Applications",
                                "time": "2 days ago", "priority": "medium"},
                        ],
                        metrics=[
                            {"id": 1, "label": "Student Satisfaction", "value": 94.5},
                            {"id": 2, "label": "Course Completion", "value": 87.2},
                            {"id": 3, "label": "Graduate Employment", "value": 91.8},
                        ],
                        statuses=[
                            {"id": 1, "name": "Academic Portal",
                                "status": "online", "uptime": "99.9% uptime"},
                            {"id": 2, "name": "Student Management",
                                "status": "online", "uptime": "99.7% uptime"},
                            {"id": 3, "name": "Payment Gateway",
                                "status": "warning", "uptime": "Maintenance"},
                            {"id": 4, "name": "Content Delivery",
                                "status": "online", "uptime": "100% uptime"},
                        ],
                    )
            return JsonResponse({
                'success': True,
                'dashboard': {
                    'dashboard_id': dashboard.dashboard_id,
                    'university_id': dashboard.university.university_id,
                    'hero_title': dashboard.hero_title,
                    'hero_subtitle': dashboard.hero_subtitle,
                    'stats': dashboard.stats,
                    'quick_actions': dashboard.quick_actions,
                    'recent_activities': dashboard.recent_activities,
                    'metrics': dashboard.metrics,
                    'statuses': dashboard.statuses,
                    'created_at': str(dashboard.created_at),
                    'updated_at': str(dashboard.updated_at),
                }
            })
        except UniversityDashboardAdmin.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Dashboard not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def create_university_dashboard_admin(request):
    """Create initial dashboard admin content for a university."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body or '{}')
            university_id = data.get('university_id')
            if not university_id:
                return JsonResponse({'success': False, 'message': 'university_id is required'}, status=400)

            try:
                university = Universities.objects.get(
                    university_id=university_id)
            except Universities.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'University not found'}, status=404)

            # If already exists, return existing id
            # If already exists in the new A table, return it; else check legacy admin table
            existing = UniversityDashboardA.objects.filter(
                university=university).first()
            if existing:
                return JsonResponse({'success': True, 'dashboard_id': existing.dashboard_id, 'message': 'Dashboard already exists'})

            dashboard = UniversityDashboardA.objects.create(
                university=university,
                hero_title=data.get('hero_title', ''),
                hero_subtitle=data.get('hero_subtitle', ''),
                stats=data.get('stats', []),
                quick_actions=data.get('quick_actions', []),
                recent_activities=data.get('recent_activities', []),
                metrics=data.get('metrics', []),
                statuses=data.get('statuses', []),
            )
            return JsonResponse({'success': True, 'dashboard_id': dashboard.dashboard_id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)


@csrf_exempt
def update_university_dashboard_admin(request, dashboard_id):
    """Update dashboard admin content for a university; accepts partial updates.

    Body may contain any of: hero_title, hero_subtitle, stats, quick_actions,
    recent_activities, metrics, statuses.
    """
    if request.method == 'PUT':
        try:
            data = json.loads(request.body or '{}')
            try:
                dashboard = UniversityDashboardA.objects.get(
                    dashboard_id=dashboard_id)
            except UniversityDashboardA.DoesNotExist:
                dashboard = UniversityDashboardAdmin.objects.get(
                    dashboard_id=dashboard_id)
            # Only allow known fields
            allowed = {'hero_title', 'hero_subtitle', 'stats',
                       'quick_actions', 'recent_activities', 'metrics', 'statuses'}
            for field, value in data.items():
                if field in allowed:
                    setattr(dashboard, field, value)
            dashboard.save()
            return JsonResponse({'success': True})
        except (UniversityDashboardA.DoesNotExist, UniversityDashboardAdmin.DoesNotExist):
            return JsonResponse({'success': False, 'message': 'Dashboard not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


# University Manage Portfolio APIs

@csrf_exempt
def get_manage_portfolio(request):
    """Fetch portfolio content for a university; auto-seed on first request."""
    if request.method == 'GET':
        university_id = request.GET.get('university_id')
        if not university_id:
            return JsonResponse({'success': False, 'message': 'university_id is required'}, status=400)
        try:
            try:
                portfolio = UniversityManagePortfolio.objects.get(
                    university_id=university_id)
            except UniversityManagePortfolio.DoesNotExist:
                # Seed from UI defaults
                try:
                    uni = Universities.objects.get(university_id=university_id)
                except Universities.DoesNotExist:
                    return JsonResponse({'success': False, 'message': 'University not found for seeding'}, status=404)

                portfolio = UniversityManagePortfolio.objects.create(
                    university=uni,
                    university_info={
                        "name": "University of Colombo",
                        "established": "1921",
                        "motto": "Excellence Through Knowledge",
                        "location": "Colombo, Sri Lanka",
                        "type": "Public Research University",
                        "chancellor": "Prof. Lakshman Dissanayake",
                        "vicechancellor": "Prof. H.D. Karunaratne",
                        "students": "12,000+",
                        "faculty": "800+",
                        "campuses": "3",
                    },
                    achievements=[
                        {"year": "2024", "title": "QS World University Rankings", "rank": "#801-850",
                            "description": "Maintained position in top global universities"},
                        {"year": "2023", "title": "Best University in Sri Lanka", "rank": "#1",
                            "description": "Ranked as the leading university in the country"},
                        {"year": "2023", "title": "Research Excellence Award", "rank": "Gold",
                            "description": "Outstanding research contributions in multiple fields"},
                        {"year": "2022", "title": "Green Campus Initiative", "rank": "Platinum",
                            "description": "Awarded for sustainable campus practices"},
                    ],
                    ranking_history=[
                        {"year": "2024", "worldRank": "801-850",
                            "localRank": "1", "score": "85.2"},
                        {"year": "2023", "worldRank": "851-900",
                            "localRank": "1", "score": "84.8"},
                        {"year": "2022", "worldRank": "901-950",
                            "localRank": "2", "score": "83.5"},
                        {"year": "2021", "worldRank": "951-1000",
                            "localRank": "2", "score": "82.1"},
                        {"year": "2020", "worldRank": "1001+",
                            "localRank": "3", "score": "80.9"},
                    ],
                    faculties=[
                        {"name": "Faculty of Medicine", "established": "1870", "departments": [
                            "Anatomy", "Physiology", "Pharmacology", "Pathology", "Surgery"], "students": "1,200", "programs": ["MBBS", "MD", "MS", "PhD"]},
                        {"name": "Faculty of Science", "established": "1942", "departments": [
                            "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"], "students": "2,500", "programs": ["BSc", "MSc", "PhD", "Diploma"]},
                        {"name": "Faculty of Arts", "established": "1921", "departments": [
                            "English", "Sinhala", "Tamil", "History", "Geography"], "students": "3,000", "programs": ["BA", "MA", "PhD", "Diploma"]},
                        {"name": "Faculty of Law", "established": "1875", "departments": [
                            "Public Law", "Private Law", "Commercial Law", "International Law"], "students": "800", "programs": ["LLB", "LLM", "PhD"]},
                        {"name": "Faculty of Education", "established": "1980", "departments": [
                            "Educational Psychology", "Curriculum Studies", "Educational Management"], "students": "1,500", "programs": ["BEd", "MEd", "PhD", "Diploma"]},
                        {"name": "Faculty of Management & Finance", "established": "1992", "departments": [
                            "Management Studies", "Finance", "Marketing", "Human Resources"], "students": "2,000", "programs": ["BBA", "MBA", "PhD", "Professional Diploma"]},
                    ],
                    degree_programs=[
                        {"level": "Undergraduate", "count": "45",
                            "duration": "3-6 years"},
                        {"level": "Postgraduate", "count": "78",
                            "duration": "1-3 years"},
                        {"level": "Doctoral", "count": "25",
                            "duration": "3-7 years"},
                        {"level": "Professional", "count": "12",
                            "duration": "6 months-2 years"},
                    ],
                    recent_events=[
                        {"id": 1, "title": "Annual Research Conference 2024", "date": "March 15-17, 2024", "type": "Conference",
                            "description": "Three-day international research conference featuring latest academic discoveries", "image": "🔬"},
                        {"id": 2, "title": "Graduation Ceremony", "date": "December 20, 2023", "type": "Ceremony",
                            "description": "Annual graduation ceremony for over 3,000 students", "image": "🎓"},
                        {"id": 3, "title": "International Student Exchange Program", "date": "September 2023", "type": "Program",
                            "description": "Launch of new exchange program with 15 international universities", "image": "🌍"},
                        {"id": 4, "title": "Centenary Celebration", "date": "July 2021", "type": "Celebration",
                            "description": "100 years of excellence in higher education milestone celebration", "image": "🎉"},
                    ],
                    facilities=[
                        {"name": "Central Library",
                            "description": "Over 500,000 books and digital resources", "icon": "📚"},
                        {"name": "Research Laboratories",
                            "description": "State-of-the-art research facilities", "icon": "🔬"},
                        {"name": "Sports Complex",
                            "description": "Olympic-size pool and multi-sport facilities", "icon": "🏊‍♂️"},
                        {"name": "Medical Center",
                            "description": "Full-service healthcare for students and staff", "icon": "🏥"},
                        {"name": "Student Hostels",
                            "description": "Modern accommodation for 3,000+ students", "icon": "🏠"},
                        {"name": "Computer Centers",
                            "description": "24/7 access to computing resources", "icon": "💻"},
                    ],
                )

            return JsonResponse({
                'success': True,
                'portfolio': {
                    'portfolio_id': portfolio.portfolio_id,
                    'university_id': portfolio.university.university_id,
                    'university_info': portfolio.university_info,
                    'achievements': portfolio.achievements,
                    'ranking_history': portfolio.ranking_history,
                    'faculties': portfolio.faculties,
                    'degree_programs': portfolio.degree_programs,
                    'recent_events': portfolio.recent_events,
                    'facilities': portfolio.facilities,
                    'created_at': str(portfolio.created_at),
                    'updated_at': str(portfolio.updated_at),
                }
            })
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def create_manage_portfolio(request):
    """Create initial manage portfolio row for a university (idempotent)."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body or '{}')
            uid = data.get('university_id')
            if not uid:
                return JsonResponse({'success': False, 'message': 'university_id is required'}, status=400)
            try:
                uni = Universities.objects.get(university_id=uid)
            except Universities.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'University not found'}, status=404)
            existing = UniversityManagePortfolio.objects.filter(
                university=uni).first()
            if existing:
                return JsonResponse({'success': True, 'portfolio_id': existing.portfolio_id, 'message': 'Portfolio already exists'})
            portfolio = UniversityManagePortfolio.objects.create(
                university=uni,
                university_info=data.get('university_info', {}),
                achievements=data.get('achievements', []),
                ranking_history=data.get('ranking_history', []),
                faculties=data.get('faculties', []),
                degree_programs=data.get('degree_programs', []),
                recent_events=data.get('recent_events', []),
                facilities=data.get('facilities', []),
            )
            return JsonResponse({'success': True, 'portfolio_id': portfolio.portfolio_id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)


@csrf_exempt
def update_manage_portfolio(request, portfolio_id):
    """Partial update for any portfolio sections."""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body or '{}')
            portfolio = UniversityManagePortfolio.objects.get(
                portfolio_id=portfolio_id)
            allowed = {
                'university_info', 'achievements', 'ranking_history', 'faculties',
                'degree_programs', 'recent_events', 'facilities'
            }
            for field, value in data.items():
                if field in allowed:
                    setattr(portfolio, field, value)
            portfolio.save()
            return JsonResponse({'success': True})
        except UniversityManagePortfolio.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Portfolio not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)
