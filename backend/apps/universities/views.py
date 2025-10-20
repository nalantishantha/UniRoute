from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
from django.contrib.auth.hashers import make_password
import json
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
