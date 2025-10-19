from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import (
    Universities,
    UniversityEvents,
    UniversityDashboardAdmin,
    UniversityDashboardA,
    UniversityManagePortfolio,
)
from apps.accounts.models import Users
from django.utils.timezone import now


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
