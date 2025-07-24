from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import Companies, CompanyEvents, CompanyEventRegistrations
from .models import InternshipOpportunities
from apps.accounts.models import Users


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


# Company Request Management Functions
@csrf_exempt
def company_requests_list(request):
    """Get all company registration requests"""
    if request.method == 'GET':
        try:
            from .models import CompanyRequests
            
            # Get all pending company requests
            requests = CompanyRequests.objects.all().order_by('-request_date')
            
            requests_data = []
            for req in requests:
                requests_data.append({
                    'request_id': req.request_id,
                    'company_name': req.company_name,
                    'contact_person_name': req.contact_person_name,
                    'contact_person_title': req.contact_person_title,
                    'email': req.email,
                    'phone_number': req.phone_number,
                    'address': req.address,
                    'city': req.city,
                    'website': req.website,
                    'industry': req.industry,
                    'company_size': req.company_size,
                    'established_year': req.established_year,
                    'description': req.description,
                    'request_date': req.request_date.isoformat() if req.request_date else None,
                    'status': req.status
                })
            
            return JsonResponse({
                'success': True,
                'requests': requests_data,
                'total_count': len(requests_data)
            })
            
        except Exception as e:
            print(f"Error fetching company requests: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Error fetching company requests: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def approve_company_request(request, request_id):
    """Approve a company registration request"""
    if request.method == 'POST':
        try:
            from .models import CompanyRequests
            from apps.accounts.models import Users, UserDetails, UserTypes
            from django.contrib.auth.hashers import make_password
            
            # Get the company request
            try:
                company_request = CompanyRequests.objects.get(request_id=request_id)
            except CompanyRequests.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Company request not found'
                }, status=404)
            
            if company_request.status != 'pending':
                return JsonResponse({
                    'success': False,
                    'message': f'Company request is already {company_request.status}'
                }, status=400)
            
            with transaction.atomic():
                # Create username from company name
                username = company_request.company_name.lower().replace(' ', '.').replace('-', '.')
                original_username = username
                counter = 1
                while Users.objects.filter(username=username).exists():
                    username = f"{original_username}{counter}"
                    counter += 1
                
                # Get company user type (using ID 4 - company)
                company_user_type = UserTypes.objects.get(type_id=4)
                
                # Create user account
                user = Users.objects.create(
                    username=username,
                    email=company_request.email,
                    password_hash=company_request.password_hash,  # Already hashed
                    user_type=company_user_type,
                    is_active=1,  # Activate the account
                    created_at=timezone.now()
                )
                
                # Create user details
                UserDetails.objects.create(
                    user=user,
                    full_name=company_request.contact_person_name,
                    contact_number=company_request.phone_number or '',
                    bio=f"Contact Person: {company_request.contact_person_title or 'N/A'}, Industry: {company_request.industry or 'N/A'}, Company Size: {company_request.company_size or 'N/A'}",
                    is_verified=1,
                    updated_at=timezone.now()
                )
                
                # Create company record
                company = Companies.objects.create(
                    name=company_request.company_name,
                    description=company_request.description,
                    address=company_request.address,
                    district=company_request.city,
                    contact_email=company_request.email,
                    contact_phone=company_request.phone_number,
                    website=company_request.website,
                    created_at=timezone.now()
                )
                
                # Update request status
                company_request.status = 'approved'
                company_request.save()
                
                print(f"✅ Company request {request_id} approved successfully")
                print(f"✅ Created user: {user.username} (ID: {user.user_id})")
                print(f"✅ Created company: {company.name} (ID: {company.company_id})")
                
                return JsonResponse({
                    'success': True,
                    'message': 'Company request approved successfully!',
                    'user_id': user.user_id,
                    'company_id': company.company_id,
                    'username': user.username
                })
                
        except Exception as e:
            print(f"Error approving company request: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Error approving company request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def reject_company_request(request, request_id):
    """Reject a company registration request"""
    if request.method == 'POST':
        try:
            from .models import CompanyRequests
            
            # Get the company request
            try:
                company_request = CompanyRequests.objects.get(request_id=request_id)
            except CompanyRequests.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Company request not found'
                }, status=404)
            
            if company_request.status != 'pending':
                return JsonResponse({
                    'success': False,
                    'message': f'Company request is already {company_request.status}'
                }, status=400)
            
            # Get rejection reason from request body
            data = json.loads(request.body) if request.body else {}
            rejection_reason = data.get('reason', 'Request rejected by administrator')
            
            # Update request status
            company_request.status = 'rejected'
            company_request.save()
            
            print(f"✅ Company request {request_id} rejected")
            
            return JsonResponse({
                'success': True,
                'message': 'Company request rejected successfully',
                'reason': rejection_reason
            })
            
        except Exception as e:
            print(f"Error rejecting company request: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Error rejecting company request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)