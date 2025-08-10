from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import Companies, CompanyEvents, CompanyEventRegistrations
from .models import InternshipOpportunities
from .models import Courses
from .models import CompanyAnnouncement
from apps.accounts.models import Users
from .models import CompanyDashboardEdit


@csrf_exempt
def create_company_event(request):
    """Create a new company event"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get required fields
            company_id = data.get('company_id')
            title = data.get('title')
            description = data.get('description', '')
            event_type = data.get('event_type')
            event_date = data.get('event_date')
            end_date = data.get('end_date')
            location = data.get('location', '')
            is_virtual = data.get('is_virtual', False)
            meeting_link = data.get('meeting_link', '')
            max_participants = data.get('max_participants')
            registration_deadline = data.get('registration_deadline')
            contact_email = data.get('contact_email', '')
            contact_phone = data.get('contact_phone', '')
            
            # Validation
            if not all([company_id, title, event_type, event_date]):
                return JsonResponse({
                    'success': False,
                    'message': 'Company ID, title, event type, and event date are required'
                }, status=400)
            
            # Check if company exists
            try:
                company = Companies.objects.get(company_id=company_id)
            except Companies.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Company not found'
                }, status=404)
            
            # Create the event
            with transaction.atomic():
                event = CompanyEvents.objects.create(
                    company=company,
                    title=title,
                    description=description,
                    event_type=event_type,
                    event_date=event_date,
                    end_date=end_date,
                    location=location,
                    is_virtual=is_virtual,
                    meeting_link=meeting_link,
                    max_participants=max_participants,
                    registration_deadline=registration_deadline,
                    contact_email=contact_email,
                    contact_phone=contact_phone,
                    created_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Company event created successfully',
                    'event': {
                        'event_id': event.event_id,
                        'title': event.title,
                        'event_type': event.event_type,
                        'event_date': event.event_date,
                        'company_name': company.name
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
def get_company_events(request):
    """Get all company events or events by company"""
    if request.method == 'GET':
        try:
            company_id = request.GET.get('company_id')
            
            if company_id:
                events = CompanyEvents.objects.filter(company_id=company_id, is_active=True)
            else:
                events = CompanyEvents.objects.filter(is_active=True)
            
            events_data = []
            for event in events:
                events_data.append({
                    'event_id': event.event_id,
                    'company_id': event.company.company_id,
                    'company_name': event.company.name,
                    'title': event.title,
                    'description': event.description,
                    'event_type': event.event_type,
                    'event_date': event.event_date,
                    'end_date': event.end_date,
                    'location': event.location,
                    'is_virtual': event.is_virtual,
                    'meeting_link': event.meeting_link,
                    'max_participants': event.max_participants,
                    'registration_deadline': event.registration_deadline,
                    'contact_email': event.contact_email,
                    'contact_phone': event.contact_phone,
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
def register_for_company_event(request):
    """Register a user for a company event"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            event_id = data.get('event_id')
            user_id = data.get('user_id')
            notes = data.get('notes', '')
            
            if not all([event_id, user_id]):
                return JsonResponse({
                    'success': False,
                    'message': 'Event ID and User ID are required'
                }, status=400)
            
            # Check if event exists
            try:
                event = CompanyEvents.objects.get(event_id=event_id, is_active=True)
            except CompanyEvents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Event not found'
                }, status=404)
            
            # Check if user exists
            try:
                user = Users.objects.get(user_id=user_id)
            except Users.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'User not found'
                }, status=404)
            
            # Check if user is already registered
            if CompanyEventRegistrations.objects.filter(event=event, user=user).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'User is already registered for this event'
                }, status=400)
            
            # Check if event is full
            if event.max_participants:
                current_registrations = CompanyEventRegistrations.objects.filter(
                    event=event, status='registered'
                ).count()
                if current_registrations >= event.max_participants:
                    return JsonResponse({
                        'success': False,
                        'message': 'Event is full'
                    }, status=400)
            
            # Create registration
            with transaction.atomic():
                registration = CompanyEventRegistrations.objects.create(
                    event=event,
                    user=user,
                    registration_date=timezone.now(),
                    notes=notes
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Successfully registered for the event',
                    'registration': {
                        'registration_id': registration.registration_id,
                        'event_title': event.title,
                        'company_name': event.company.name,
                        'registration_date': registration.registration_date
                    }
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error registering for event: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def update_company_event(request, event_id):
    """Update a company event"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            try:
                event = CompanyEvents.objects.get(event_id=event_id)
            except CompanyEvents.DoesNotExist:
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
            if 'end_date' in data:
                event.end_date = data['end_date']
            if 'location' in data:
                event.location = data['location']
            if 'is_virtual' in data:
                event.is_virtual = data['is_virtual']
            if 'meeting_link' in data:
                event.meeting_link = data['meeting_link']
            if 'max_participants' in data:
                event.max_participants = data['max_participants']
            if 'registration_deadline' in data:
                event.registration_deadline = data['registration_deadline']
            if 'contact_email' in data:
                event.contact_email = data['contact_email']
            if 'contact_phone' in data:
                event.contact_phone = data['contact_phone']
            if 'is_active' in data:
                event.is_active = data['is_active']
            
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
def delete_company_event(request, event_id):
    """Delete (deactivate) a company event"""
    if request.method == 'DELETE':
        try:
            try:
                event = CompanyEvents.objects.get(event_id=event_id)
            except CompanyEvents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Event not found'
                }, status=404)
            
            # Soft delete by setting is_active to False
            event.is_active = False
            event.save()
            
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

# internships

@csrf_exempt
def create_internship(request):
    """Create a new internship opportunity for a company"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            company_id = data.get('company_id')
            title = data.get('title')
            description = data.get('description', '')
            location = data.get('location', '')
            stipend = data.get('stipend', '')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            application_deadline = data.get('application_deadline')
            contact_email = data.get('contact_email', '')
            contact_phone = data.get('contact_phone', '')
            image_url = data.get('image_url', '')

            # Validation
            if not all([company_id, title, start_date, end_date, application_deadline]):
                return JsonResponse({
                    'success': False,
                    'message': 'Required fields are missing'
                }, status=400)

            # Check if company exists
            try:
                company = Companies.objects.get(company_id=company_id)
            except Companies.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Company not found'
                }, status=404)

            # Create internship
            with transaction.atomic():
                internship = InternshipOpportunities.objects.create(
                    company=company,
                    title=title,
                    description=description,
                    location=location,
                    stipend=stipend,
                    start_date=start_date,
                    end_date=end_date,
                    application_deadline=application_deadline,
                    contact_email=contact_email,
                    contact_phone=contact_phone,
                    image_url=image_url,
                    created_at=timezone.now()
                )

                return JsonResponse({
                    'success': True,
                    'message': 'Internship created successfully',
                    'internship': {
                        'internship_id': internship.internship_id,
                        'title': internship.title,
                        'company_name': company.name,
                        'location': internship.location,
                        'start_date': internship.start_date,
                        'end_date': internship.end_date
                    }
                })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error creating internship: {str(e)}'
            }, status=500)
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)

@csrf_exempt
def get_company_internships(request):
    """Get internships for a specific company"""
    if request.method == 'GET':
        try:
            company_id = request.GET.get('company_id')
            
            if not company_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Company ID is required'
                }, status=400)
            
            internships = InternshipOpportunities.objects.filter(company_id=company_id)
            
            internships_data = []
            for internship in internships:
                internships_data.append({
                    'internship_id': internship.internship_id,
                    'company_id': internship.company.company_id,
                    'company_name': internship.company.name,
                    'title': internship.title,
                    'description': internship.description,
                    'location': internship.location,
                    'stipend': internship.stipend,
                    'start_date': internship.start_date,
                    'end_date': internship.end_date,
                    'application_deadline': internship.application_deadline,
                    'contact_email': internship.contact_email,
                    'contact_phone': internship.contact_phone,
                    'image_url': internship.image_url,
                    'created_at': internship.created_at
                })
            
            return JsonResponse({
                'success': True,
                'internships': internships_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching internships: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def update_internship(request, internship_id):
    """Update an internship opportunity"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            try:
                internship = InternshipOpportunities.objects.get(internship_id=internship_id)
            except InternshipOpportunities.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Internship not found'
                }, status=404)
            
            # Update fields if provided
            if 'title' in data:
                internship.title = data['title']
            if 'description' in data:
                internship.description = data['description']
            if 'location' in data:
                internship.location = data['location']
            if 'stipend' in data:
                internship.stipend = data['stipend']
            if 'start_date' in data:
                internship.start_date = data['start_date']
            if 'end_date' in data:
                internship.end_date = data['end_date']
            if 'application_deadline' in data:
                internship.application_deadline = data['application_deadline']
            if 'contact_email' in data:
                internship.contact_email = data['contact_email']
            if 'contact_phone' in data:
                internship.contact_phone = data['contact_phone']
            if 'image_url' in data:
                internship.image_url = data['image_url']
            
            internship.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Internship updated successfully',
                'internship': {
                    'internship_id': internship.internship_id,
                    'title': internship.title,
                    'location': internship.location,
                    'start_date': internship.start_date,
                    'end_date': internship.end_date
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error updating internship: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)


@csrf_exempt
def delete_internship(request, internship_id):
    """Delete an internship opportunity"""
    if request.method == 'DELETE':
        try:
            try:
                internship = InternshipOpportunities.objects.get(internship_id=internship_id)
            except InternshipOpportunities.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Internship not found'
                }, status=404)
            
            # Delete the internship
            internship.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Internship deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error deleting internship: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only DELETE method allowed'
    }, status=405)


@csrf_exempt
def get_internship_details(request, internship_id):
    """Get details of a specific internship"""
    if request.method == 'GET':
        try:
            try:
                internship = InternshipOpportunities.objects.get(internship_id=internship_id)
            except InternshipOpportunities.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Internship not found'
                }, status=404)
            
            internship_data = {
                'internship_id': internship.internship_id,
                'company_id': internship.company.company_id,
                'company_name': internship.company.name,
                'title': internship.title,
                'description': internship.description,
                'location': internship.location,
                'stipend': internship.stipend,
                'start_date': internship.start_date,
                'end_date': internship.end_date,
                'application_deadline': internship.application_deadline,
                'contact_email': internship.contact_email,
                'contact_phone': internship.contact_phone,
                'image_url': internship.image_url,
                'created_at': internship.created_at
            }
            
            return JsonResponse({
                'success': True,
                'internship': internship_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching internship details: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)

# courses

@csrf_exempt
def create_course(request):
    """Create a new course"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Get fields from data
            course = Courses.objects.create(
                company_id=data.get('company_id'),
                title=data.get('title'),
                description=data.get('description'),
                category=data.get('category'),
                level=data.get('level'),
                duration=data.get('duration'),
                price=data.get('price'),
                instructor=data.get('instructor'),
                prerequisites=data.get('prerequisites'),
                status=data.get('status'),
                enrollments=data.get('enrollments', 0),
                rating=data.get('rating', 0),
                image=data.get('image'),
                skills=data.get('skills'),
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
            )
            return JsonResponse({'success': True, 'course_id': course.course_id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error creating course: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def get_courses(request):
    """Get all courses for a company"""
    if request.method == 'GET':
        try:
            company_id = request.GET.get('company_id')
            courses = Courses.objects.filter(company_id=company_id)
            data = []
            for c in courses:
                data.append({
                    'course_id': c.course_id,
                    'title': c.title,
                    'description': c.description,
                    'category': c.category,
                    'level': c.level,
                    'duration': c.duration,
                    'price': float(c.price) if c.price else 0,
                    'instructor': c.instructor,
                    'prerequisites': c.prerequisites,
                    'status': c.status,
                    'enrollments': c.enrollments,
                    'rating': c.rating,
                    'image': c.image,
                    'skills': c.skills.split(',') if c.skills else [],
                    'start_date': str(c.start_date) if c.start_date else '',
                    'end_date': str(c.end_date) if c.end_date else '',
                })
            return JsonResponse({'success': True, 'courses': data})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error fetching courses: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_course(request, course_id):
    """Update a course"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            course = Courses.objects.get(course_id=course_id)
            for field, value in data.items():
                setattr(course, field, value)
            course.save()
            return JsonResponse({'success': True})
        except Courses.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_course(request, course_id):
    """Delete a course"""
    if request.method == 'DELETE':
        try:
            course = Courses.objects.get(course_id=course_id)
            course.delete()
            return JsonResponse({'success': True})
        except Courses.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

# announcements

@csrf_exempt
def create_announcement(request):
    """Create a new company announcement"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            company = Companies.objects.get(company_id=data.get('company_id', 1))  # Use actual company_id
            announcement = CompanyAnnouncement.objects.create(
                company=company,
                title=data.get('title'),
                category=data.get('category'),
                priority=data.get('priority'),
                date=data.get('date'),
                status=data.get('status'),
                author=data.get('author'),
                description=data.get('description'),
                tags=data.get('tags'),
                image_url=data.get('image'),
            )
            return JsonResponse({'success': True, 'announcement_id': announcement.announcement_id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def get_announcements(request):
    """Get all company announcements"""
    if request.method == 'GET':
        company_id = request.GET.get('company_id', 1)
        announcements = CompanyAnnouncement.objects.filter(company_id=company_id)
        data = []
        for a in announcements:
            data.append({
                'announcement_id': a.announcement_id,
                'title': a.title,
                'category': a.category,
                'priority': a.priority,
                'date': str(a.date),
                'status': a.status,
                'author': a.author,
                'description': a.description,
                'tags': a.tags.split(',') if a.tags else [],
                'image': a.image_url,
                'created_at': str(a.created_at),
            })
        return JsonResponse({'success': True, 'announcements': data})
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_announcement(request, announcement_id):
    """Update a company announcement"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            announcement = CompanyAnnouncement.objects.get(announcement_id=announcement_id)
            for field, value in data.items():
                if field == 'tags':
                    value = ','.join(value) if isinstance(value, list) else value
                if field == 'image':
                    field = 'image_url'
                setattr(announcement, field, value)
            announcement.save()
            return JsonResponse({'success': True})
        except CompanyAnnouncement.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Announcement not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_announcement(request, announcement_id):
    """Delete a company announcement"""
    if request.method == 'DELETE':
        try:
            announcement = CompanyAnnouncement.objects.get(announcement_id=announcement_id)
            announcement.delete()
            return JsonResponse({'success': True})
        except CompanyAnnouncement.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Announcement not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

# dashboard edits

@csrf_exempt
def get_dashboard_edit(request):
    """Get dashboard edit data for a company"""
    if request.method == 'GET':
        company_id = request.GET.get('company_id', 1)
        try:
            dashboard = CompanyDashboardEdit.objects.get(company_id=company_id)
            data = {
                'dashboard_id': dashboard.dashboard_id,
                'company_id': dashboard.company.company_id,
                'story_title': dashboard.story_title,
                'story_subtitle': dashboard.story_subtitle,
                'story_section_title': dashboard.story_section_title,
                'story_description': dashboard.story_description,
                'story_second_description': dashboard.story_second_description,
                'story_image': dashboard.story_image,
                'offers': dashboard.offers,
                'team': dashboard.team,
                'testimonials': dashboard.testimonials,
                'contact_email': dashboard.contact_email,
                'contact_phone': dashboard.contact_phone,
                'contact_address': dashboard.contact_address,
                'updated_at': str(dashboard.updated_at),
            }
            return JsonResponse({'success': True, 'dashboard': data})
        except CompanyDashboardEdit.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Dashboard not found'}, status=404)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_dashboard_edit(request, dashboard_id):
    """Update dashboard edit data for a company"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            dashboard = CompanyDashboardEdit.objects.get(dashboard_id=dashboard_id)
            for field, value in data.items():
                setattr(dashboard, field, value)
            dashboard.save()
            return JsonResponse({'success': True})
        except CompanyDashboardEdit.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Dashboard not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def create_dashboard_edit(request):
    """Create dashboard edit data for a company (first time)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            company = Companies.objects.get(company_id=data.get('company_id', 1))
            dashboard = CompanyDashboardEdit.objects.create(
                company=company,
                story_title=data.get('story_title', ''),
                story_subtitle=data.get('story_subtitle', ''),
                story_section_title=data.get('story_section_title', ''),
                story_description=data.get('story_description', ''),
                story_second_description=data.get('story_second_description', ''),
                story_image=data.get('story_image', ''),
                offers=data.get('offers', []),
                team=data.get('team', []),
                testimonials=data.get('testimonials', []),
                contact_email=data.get('contact_email', ''),
                contact_phone=data.get('contact_phone', ''),
                contact_address=data.get('contact_address', ''),
            )
            return JsonResponse({'success': True, 'dashboard_id': dashboard.dashboard_id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)