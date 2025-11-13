import json
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from collections import defaultdict

from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Q, Count, Sum, Avg
from django.db.models.functions import TruncDate, Coalesce
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from apps.accounts.models import Users, UserDetails, UserTypes, UserDailyLogin
from apps.companies.models import Companies, InternshipOpportunities
from apps.advertisements.models import AdBookings, Advertisements, AdSpaces
from apps.universities.models import Universities
from apps.students.models import Students
from apps.university_students.models import UniversityStudents
from apps.tutoring.models import Tutors, TutoringSessions
from apps.mentoring.models import Mentors, MentoringRequests, MentoringSessions
from apps.university_programs.models import DegreePrograms
from apps.payments.models import TutoringPayments, MentoringPayments
from apps.pre_university_courses.models import PreUniversityCourse
from .models import Report, ReportCategory, ReportAction
from django.contrib.auth.hashers import check_password, make_password

logger = logging.getLogger(__name__)

def _get_user_display_name(user):
    if not user:
        return ''
    details = getattr(user, 'userdetails', None)
    if details and getattr(details, 'full_name', None):
        return details.full_name
    return getattr(user, 'username', '')

# # Create your views here.

@csrf_exempt
def get_admin_details(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        try:
            user = Users.objects.get(user_id=user_id, user_type__type_name='admin')
            user_details = UserDetails.objects.get(user=user)
            return JsonResponse({
                'success': True,
                'user': {
                    'user_id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user_details.full_name,
                    'profile_picture': user_details.profile_picture,
                    'bio': user_details.bio,
                    'contact_number': user_details.contact_number,
                    'location': user_details.location,
                    'gender': user_details.gender,
                    'is_verified': user_details.is_verified,
                }
            })
        except Users.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Admin not found'}, status=404)
        except UserDetails.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Admin details not found'}, status=404)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_admin_profile(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            
            # Validate admin user
            user = Users.objects.get(user_id=user_id)
            if user.user_type.type_name != 'admin':
                return JsonResponse({
                    'success': False,
                    'message': 'Unauthorized access'
                }, status=403)
            
            # Update user details
            with transaction.atomic():
                # Update Users table
                if 'email' in data:
                    # Check if email already exists for other users
                    if Users.objects.filter(email=data['email']).exclude(user_id=user_id).exists():
                        return JsonResponse({
                            'success': False,
                            'message': 'Email already exists'
                        }, status=400)
                    user.email = data['email']
                
                if 'username' in data:
                    # Check if username already exists for other users
                    if Users.objects.filter(username=data['username']).exclude(user_id=user_id).exists():
                        return JsonResponse({
                            'success': False,
                            'message': 'Username already exists'
                        }, status=400)
                    user.username = data['username']
                
                user.save()
                
                # Update UserDetails table
                user_details, created = UserDetails.objects.get_or_create(user=user)
                # if 'profile_picture' in data:
                #     user_details.profile_picture = data['profile_picture']
                if 'full_name' in data:
                    user_details.full_name = data['full_name']
                if 'user_name' in data:
                    user_details.user_name = data['user_name']
                if 'phone_number' in data:
                    user_details.contact_number = data['phone_number']
                if 'gender' in data:
                    user_details.gender = data['gender']
                if 'location' in data:
                    user_details.location = data['location']
                if 'bio' in data:
                    user_details.bio = data['bio']
                
                user_details.updated_at = timezone.now()
                user_details.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'user': {
                        'user_id': user.user_id,
                        'username': user.username,
                        'email': user.email,
                        'full_name': user_details.full_name,
                        'profile_picture': user_details.profile_picture,
                        'bio': user_details.bio,
                        'contact_number': user_details.contact_number,
                        'location': user_details.location,
                        'gender': user_details.gender,
                    }
                })
                
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print(f"Profile update error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Profile update failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)

@csrf_exempt
def change_admin_password(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            
            # Validate required fields
            if not all([user_id, current_password, new_password]):
                return JsonResponse({
                    'success': False,
                    'message': 'User ID, current password, and new password are required'
                }, status=400)
            
            # Get user and validate
            user = Users.objects.get(user_id=user_id)
            if user.user_type.type_name != 'admin':
                return JsonResponse({
                    'success': False,
                    'message': 'Unauthorized access'
                }, status=403)
            
            # Verify current password
            if not check_password(current_password, user.password_hash):
                return JsonResponse({
                    'success': False,
                    'message': 'Current password is incorrect'
                }, status=400)
            
            # Validate new password
            if len(new_password) < 8:
                return JsonResponse({
                    'success': False,
                    'message': 'New password must be at least 8 characters long'
                }, status=400)
            
            # Update password
            user.password_hash = make_password(new_password)
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Password changed successfully'
            })
            
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print(f"Password change error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Password change failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)

@csrf_exempt
def delete_admin_account(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            confirmation_text = data.get('confirmation_text')
            
            # Validate confirmation
            if confirmation_text != 'DELETE MY ACCOUNT':
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid confirmation text'
                }, status=400)
            
            # Get user and validate
            user = Users.objects.get(user_id=user_id)
            if user.user_type.type_name != 'admin':
                return JsonResponse({
                    'success': False,
                    'message': 'Unauthorized access'
                }, status=403)
            
            # Check if this is the last admin
            admin_count = Users.objects.filter(user_type__type_name='admin', is_active=1).count()
            if admin_count <= 1:
                return JsonResponse({
                    'success': False,
                    'message': 'Cannot delete the last admin account. Please assign another admin first.'
                }, status=400)
            
            # Delete user account and related data
            with transaction.atomic():
                # Delete user details
                UserDetails.objects.filter(user=user).delete()
                
                # Delete user
                user.delete()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Admin account deleted successfully'
                })
                
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print(f"Account deletion error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Account deletion failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only DELETE method allowed'
    }, status=405)

@csrf_exempt
def get_reports(request):
    if request.method == 'GET':
        try:
            # Get query parameters
            status = request.GET.get('status', 'all')
            category = request.GET.get('category', 'all')
            priority = request.GET.get('priority', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            reports = Report.objects.select_related('reporter', 'reported_user', 'category', 'assigned_admin')
            
            # Apply filters
            if status != 'all':
                reports = reports.filter(status=status)
            if category != 'all':
                reports = reports.filter(category_id=category)
            if priority != 'all':
                reports = reports.filter(priority=priority)
            if search:
                reports = reports.filter(
                    Q(title__icontains=search) | 
                    Q(description__icontains=search) |
                    Q(reporter__username__icontains=search)
                )
            
            # Pagination
            paginator = Paginator(reports, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            reports_data = []
            for report in page_obj:
                reports_data.append({
                    'report_id': report.report_id,
                    'title': report.title,
                    'description': report.description,
                    'priority': report.priority,
                    'status': report.status,
                    'category': {
                        'id': report.category.category_id,
                        'name': report.category.category_name
                    },
                    'reporter': {
                        'id': report.reporter.user_id,
                        'username': report.reporter.username,
                        'email': report.reporter.email
                    },
                    'reported_user': {
                        'id': report.reported_user.user_id,
                        'username': report.reported_user.username,
                        'email': report.reported_user.email
                    } if report.reported_user else None,
                    'assigned_admin': {
                        'id': report.assigned_admin.user_id,
                        'username': report.assigned_admin.username
                    } if report.assigned_admin else None,
                    'admin_notes': report.admin_notes,
                    'admin_action': report.admin_action,
                    'evidence_files': report.evidence_files,
                    'created_at': report.created_at.isoformat(),
                    'updated_at': report.updated_at.isoformat(),
                    'resolved_at': report.resolved_at.isoformat() if report.resolved_at else None
                })
            
            return JsonResponse({
                'success': True,
                'reports': reports_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch reports: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_report_details(request, report_id):
    if request.method == 'GET':
        try:
            report = Report.objects.select_related('reporter', 'reported_user', 'category', 'assigned_admin').get(report_id=report_id)
            
            # Get report actions
            actions = ReportAction.objects.filter(report=report).select_related('admin').order_by('-created_at')
            actions_data = []
            for action in actions:
                actions_data.append({
                    'action_id': action.action_id,
                    'action_type': action.action_type,
                    'action_details': action.action_details,
                    'duration_days': action.duration_days,
                    'admin': {
                        'id': action.admin.user_id,
                        'username': action.admin.username
                    },
                    'created_at': action.created_at.isoformat()
                })
            
            report_data = {
                'report_id': report.report_id,
                'title': report.title,
                'description': report.description,
                'priority': report.priority,
                'status': report.status,
                'category': {
                    'id': report.category.category_id,
                    'name': report.category.category_name
                },
                'reporter': {
                    'id': report.reporter.user_id,
                    'username': report.reporter.username,
                    'email': report.reporter.email
                },
                'reported_user': {
                    'id': report.reported_user.user_id,
                    'username': report.reported_user.username,
                    'email': report.reported_user.email
                } if report.reported_user else None,
                'assigned_admin': {
                    'id': report.assigned_admin.user_id,
                    'username': report.assigned_admin.username
                } if report.assigned_admin else None,
                'admin_notes': report.admin_notes,
                'admin_action': report.admin_action,
                'evidence_files': report.evidence_files,
                'actions': actions_data,
                'created_at': report.created_at.isoformat(),
                'updated_at': report.updated_at.isoformat(),
                'resolved_at': report.resolved_at.isoformat() if report.resolved_at else None
            }
            
            return JsonResponse({
                'success': True,
                'report': report_data
            })
            
        except Report.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Report not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch report details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_report_status(request, report_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            admin_id = data.get('admin_id')
            new_status = data.get('status')
            admin_notes = data.get('admin_notes', '')
            
            # Validate admin
            admin = Users.objects.get(user_id=admin_id, user_type__type_name='admin')
            report = Report.objects.get(report_id=report_id)
            
            with transaction.atomic():
                # Update report
                report.status = new_status
                report.admin_notes = admin_notes
                report.assigned_admin = admin
                report.updated_at = timezone.now()
                
                if new_status == 'completed':
                    report.resolved_at = timezone.now()
                
                report.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Report status updated successfully'
                })
                
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Admin not found'
            }, status=404)
        except Report.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Report not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update report status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def take_report_action(request, report_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            admin_id = data.get('admin_id')
            action_type = data.get('action_type')
            action_details = data.get('action_details')
            duration_days = data.get('duration_days')
            
            # Validate admin
            admin = Users.objects.get(user_id=admin_id, user_type__type_name='admin')
            report = Report.objects.get(report_id=report_id)
            
            with transaction.atomic():
                # Create report action
                action = ReportAction.objects.create(
                    report=report,
                    admin=admin,
                    action_type=action_type,
                    action_details=action_details,
                    duration_days=duration_days
                )
                
                # Update report status
                report.status = 'in_progress'
                report.admin_action = action_details
                report.assigned_admin = admin
                report.updated_at = timezone.now()
                report.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Action taken successfully',
                    'action_id': action.action_id
                })
                
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Admin not found'
            }, status=404)
        except Report.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Report not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to take action: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def get_report_categories(request):
    if request.method == 'GET':
        try:
            categories = ReportCategory.objects.filter(is_active=True)
            categories_data = []
            
            for category in categories:
                categories_data.append({
                    'category_id': category.category_id,
                    'category_name': category.category_name,
                    'description': category.description
                })
            
            return JsonResponse({
                'success': True,
                'categories': categories_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch categories: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_report_statistics(request):
    if request.method == 'GET':
        try:
            # Get counts by status
            status_counts = Report.objects.values('status').annotate(count=Count('status'))
            
            # Get counts by priority
            priority_counts = Report.objects.values('priority').annotate(count=Count('priority'))
            
            # Get counts by category
            category_counts = Report.objects.select_related('category').values('category__category_name').annotate(count=Count('category'))
            
            # Get recent reports count (last 7 days)
            recent_reports = Report.objects.filter(
                created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_reports': Report.objects.count(),
                    'pending_reports': Report.objects.filter(status='pending').count(),
                    'in_progress_reports': Report.objects.filter(status='in_progress').count(),
                    'completed_reports': Report.objects.filter(status='completed').count(),
                    'recent_reports': recent_reports,
                    'status_breakdown': list(status_counts),
                    'priority_breakdown': list(priority_counts),
                    'category_breakdown': list(category_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_internships(request):
    if request.method == 'GET':
        try:
            # Get query parameters
            company = request.GET.get('company', 'all')
            location = request.GET.get('location', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            internships = InternshipOpportunities.objects.select_related('company')
            
            # Apply filters
            if company != 'all':
                internships = internships.filter(company_id=company)
            if location != 'all':
                internships = internships.filter(location__icontains=location)
            if search:
                internships = internships.filter(
                    Q(title__icontains=search) | 
                    Q(description__icontains=search) |
                    Q(company__name__icontains=search)
                )
            
            # Pagination
            paginator = Paginator(internships, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            internships_data = []
            for internship in page_obj:
                internships_data.append({
                    'internship_id': internship.internship_id,
                    'title': internship.title,
                    'description': internship.description,
                    'location': internship.location,
                    'stipend': internship.stipend,
                    'start_date': internship.start_date.isoformat() if internship.start_date else None,
                    'end_date': internship.end_date.isoformat() if internship.end_date else None,
                    'application_deadline': internship.application_deadline.isoformat() if internship.application_deadline else None,
                    'contact_email': internship.contact_email,
                    'contact_phone': internship.contact_phone,
                    'image_url': internship.image_url,
                    'company': {
                        'company_id': internship.company.company_id,
                        'name': internship.company.name,
                        'district': internship.company.district,
                        'website': internship.company.website
                    },
                    'created_at': internship.created_at.isoformat() if internship.created_at else None
                })
            
            return JsonResponse({
                'success': True,
                'internships': internships_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch internships: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_internship_details(request, internship_id):
    if request.method == 'GET':
        try:
            internship = InternshipOpportunities.objects.select_related('company').get(internship_id=internship_id)
            
            internship_data = {
                'internship_id': internship.internship_id,
                'title': internship.title,
                'description': internship.description,
                'location': internship.location,
                'stipend': internship.stipend,
                'start_date': internship.start_date.isoformat() if internship.start_date else None,
                'end_date': internship.end_date.isoformat() if internship.end_date else None,
                'application_deadline': internship.application_deadline.isoformat() if internship.application_deadline else None,
                'contact_email': internship.contact_email,
                'contact_phone': internship.contact_phone,
                'image_url': internship.image_url,
                'company': {
                    'company_id': internship.company.company_id,
                    'name': internship.company.name,
                    'description': internship.company.description,
                    'address': internship.company.address,
                    'district': internship.company.district,
                    'contact_email': internship.company.contact_email,
                    'contact_phone': internship.company.contact_phone,
                    'website': internship.company.website
                },
                'created_at': internship.created_at.isoformat() if internship.created_at else None
            }
            
            return JsonResponse({
                'success': True,
                'internship': internship_data
            })
            
        except InternshipOpportunities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Internship not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch internship details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def create_internship(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['company_id', 'title']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({
                        'success': False,
                        'message': f'{field} is required'
                    }, status=400)
            
            # Get company
            company = Companies.objects.get(company_id=data['company_id'])
            
            with transaction.atomic():
                # Create internship
                internship = InternshipOpportunities.objects.create(
                    company=company,
                    title=data['title'],
                    description=data.get('description', ''),
                    location=data.get('location', ''),
                    stipend=data.get('stipend', ''),
                    start_date=data.get('start_date') if data.get('start_date') else None,
                    end_date=data.get('end_date') if data.get('end_date') else None,
                    application_deadline=data.get('application_deadline') if data.get('application_deadline') else None,
                    contact_email=data.get('contact_email', ''),
                    contact_phone=data.get('contact_phone', ''),
                    created_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Internship created successfully',
                    'internship_id': internship.internship_id
                })
                
        except Companies.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Company not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to create internship: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def update_internship(request, internship_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get internship
            internship = InternshipOpportunities.objects.get(internship_id=internship_id)
            
            with transaction.atomic():
                # Update internship fields
                if 'title' in data:
                    internship.title = data['title']
                if 'description' in data:
                    internship.description = data['description']
                if 'location' in data:
                    internship.location = data['location']
                if 'stipend' in data:
                    internship.stipend = data['stipend']
                if 'start_date' in data:
                    internship.start_date = data['start_date'] if data['start_date'] else None
                if 'end_date' in data:
                    internship.end_date = data['end_date'] if data['end_date'] else None
                if 'application_deadline' in data:
                    internship.application_deadline = data['application_deadline'] if data['application_deadline'] else None
                if 'contact_email' in data:
                    internship.contact_email = data['contact_email']
                if 'contact_phone' in data:
                    internship.contact_phone = data['contact_phone']
                
                internship.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Internship updated successfully'
                })
                
        except InternshipOpportunities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Internship not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update internship: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_internship(request, internship_id):
    if request.method == 'DELETE':
        try:
            internship = InternshipOpportunities.objects.get(internship_id=internship_id)
            internship.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Internship deleted successfully'
            })
            
        except InternshipOpportunities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Internship not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete internship: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_companies_for_internships(request):
    if request.method == 'GET':
        try:
            companies = Companies.objects.all().order_by('name')
            companies_data = []
            
            for company in companies:
                companies_data.append({
                    'company_id': company.company_id,
                    'name': company.name,
                    'district': company.district,
                    'website': company.website
                })
            
            return JsonResponse({
                'success': True,
                'companies': companies_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch companies: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_internship_statistics(request):
    if request.method == 'GET':
        try:
            # Get counts by company
            company_counts = InternshipOpportunities.objects.select_related('company').values('company__name').annotate(count=Count('company')).order_by('-count')[:5]
            
            # Get counts by location
            location_counts = InternshipOpportunities.objects.exclude(location__isnull=True).exclude(location__exact='').values('location').annotate(count=Count('location')).order_by('-count')[:5]
            
            # Get recent internships count (last 30 days)
            recent_internships = InternshipOpportunities.objects.filter(
                created_at__gte=timezone.now() - timezone.timedelta(days=30)
            ).count()
            
            # Get active internships (deadline not passed)
            active_internships = InternshipOpportunities.objects.filter(
                application_deadline__gte=timezone.now().date()
            ).count()
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_internships': InternshipOpportunities.objects.count(),
                    'active_internships': active_internships,
                    'recent_internships': recent_internships,
                    'total_companies': Companies.objects.count(),
                    'company_breakdown': list(company_counts),
                    'location_breakdown': list(location_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_advertisement_requests(request):
    """Get all advertisement booking requests"""
    if request.method == 'GET':
        try:
            # Get all advertisement bookings with related data
            bookings = AdBookings.objects.select_related(
                'ad__university',
                'ad__company',
                'ad__tutor',
                'space'
            ).all().order_by('-created_at')
            
            requests_data = []
            for booking in bookings:
                # Determine the requester type and name
                university_name = ""
                if booking.ad.university:
                    university_name = booking.ad.university.name
                elif booking.ad.company:
                    university_name = booking.ad.company.name  # Company name
                elif booking.ad.tutor:
                    university_name = f"Tutor: {booking.ad.tutor.name}"  # Tutor name
                
                request_data = {
                    'booking_id': booking.booking_id,
                    'title': booking.ad.title,
                    'university_name': university_name,
                    'space_name': booking.space.name,
                    'start_date': booking.start_date.strftime('%Y-%m-%d') if booking.start_date else '',
                    'end_date': booking.end_date.strftime('%Y-%m-%d') if booking.end_date else '',
                    'total_price': str(booking.total_price),
                    'status': booking.status or 'pending',
                    'image_url': booking.ad.image_url or '',
                    'target_url': booking.ad.target_url or '',
                    'created_at': booking.created_at.isoformat() if booking.created_at else ''
                }
                requests_data.append(request_data)
            
            return JsonResponse({
                'success': True,
                'requests': requests_data,
                'total_count': len(requests_data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch advertisement requests: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def approve_advertisement_request(request, booking_id):
    """Approve an advertisement booking request"""
    if request.method == 'POST':
        try:
            with transaction.atomic():
                # Get the booking
                booking = AdBookings.objects.get(booking_id=booking_id)
                
                # Update status to approved
                booking.status = 'Confirmed'
                booking.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Advertisement request approved successfully',
                    'booking_id': booking_id,
                    'new_status': 'Confirmed'
                })
                
        except AdBookings.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Advertisement request not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to approve request: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def reject_advertisement_request(request, booking_id):
    """Reject an advertisement booking request"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else {}
            reason = data.get('reason', '')
            
            with transaction.atomic():
                # Get the booking
                booking = AdBookings.objects.get(booking_id=booking_id)
                
                # Update status to rejected
                booking.status = 'Rejected'
                booking.save()
                
                # You could also save the rejection reason if you have a field for it
                # For now, we'll just return success
                
                return JsonResponse({
                    'success': True,
                    'message': 'Advertisement request rejected successfully',
                    'booking_id': booking_id,
                    'new_status': 'Rejected',
                    'reason': reason
                })
                
        except AdBookings.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Advertisement request not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to reject request: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)


@csrf_exempt
def get_dashboard_statistics(request):
    """Get comprehensive dashboard statistics for admin panel"""
    if request.method == 'GET':
        try:
            # Get current date for time-based calculations
            now = timezone.now()
            thirty_days_ago = now - timedelta(days=30)
            current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
            
            # User Management Statistics
            total_users = Users.objects.count()
            last_month_users = Users.objects.filter(created_at__lt=current_month_start).count()
            users_growth = ((total_users - last_month_users) / last_month_users * 100) if last_month_users > 0 else 0
            
            # Students (high school)
            total_students = Students.objects.count()
            last_month_students = Students.objects.filter(user__created_at__lt=current_month_start).count()
            students_growth = ((total_students - last_month_students) / last_month_students * 100) if last_month_students > 0 else 0
            
            # University Students
            total_university_students = UniversityStudents.objects.count()
            last_month_uni_students = UniversityStudents.objects.filter(user__created_at__lt=current_month_start).count()
            uni_students_growth = ((total_university_students - last_month_uni_students) / last_month_uni_students * 100) if last_month_uni_students > 0 else 0
            
            # Mentors
            total_mentors = Mentors.objects.count()
            last_month_mentors = Mentors.objects.filter(user__created_at__lt=current_month_start).count()
            mentors_growth = ((total_mentors - last_month_mentors) / last_month_mentors * 100) if last_month_mentors > 0 else 0

            counselor_type_filter = Q(user_type__type_name__iexact='counselor') | Q(user_type__type_name__iexact='counsellor')
            total_counsellors = Users.objects.filter(counselor_type_filter).count()
            last_month_counsellors = Users.objects.filter(
                counselor_type_filter,
                created_at__lt=current_month_start
            ).count()
            counsellors_growth = (
                (total_counsellors - last_month_counsellors) / last_month_counsellors * 100
            ) if last_month_counsellors > 0 else 0
            
            # Institution Management Statistics
            # Tutors
            total_tutors = Tutors.objects.count()
            last_month_tutors = Tutors.objects.filter(user__created_at__lt=current_month_start).count()
            tutors_growth = ((total_tutors - last_month_tutors) / last_month_tutors * 100) if last_month_tutors > 0 else 0
            
            # Universities
            total_universities = Universities.objects.count()
            last_month_universities = Universities.objects.filter(created_at__lt=current_month_start).count()
            universities_growth = total_universities - last_month_universities
            
            # Companies
            total_companies = Companies.objects.count()
            last_month_companies = Companies.objects.filter(created_at__lt=current_month_start).count()
            companies_growth = total_companies - last_month_companies
            
            # Active Programs
            total_programs = DegreePrograms.objects.filter(is_active=1).count()
            last_month_programs = DegreePrograms.objects.filter(
                is_active=1,
                created_at__lt=current_month_start
            ).count()
            programs_growth = total_programs - last_month_programs

            published_courses_qs = PreUniversityCourse.objects.filter(status='published')
            total_published_courses = published_courses_qs.count()
            last_month_published_courses = published_courses_qs.filter(
                updated_at__isnull=False,
                updated_at__lt=current_month_start
            ).count()
            published_courses_growth = total_published_courses - last_month_published_courses

            mentoring_requests_total = MentoringRequests.objects.count()
            mentoring_pending = MentoringRequests.objects.filter(status__iexact='pending').count()
            mentoring_scheduled = MentoringRequests.objects.filter(status__iexact='scheduled').count()
            mentoring_completed = MentoringRequests.objects.filter(status__iexact='completed').count()
            mentoring_declined = MentoringRequests.objects.filter(status__iexact='declined').count()

            tutoring_sessions_total = TutoringSessions.objects.count()
            tutoring_pending = TutoringSessions.objects.filter(status__iexact='pending').count()
            tutoring_scheduled = TutoringSessions.objects.filter(status__iexact='scheduled').count()
            tutoring_completed = TutoringSessions.objects.filter(status__iexact='completed').count()
            tutoring_cancelled = TutoringSessions.objects.filter(status__iexact='cancelled').count()

            internship_total = InternshipOpportunities.objects.count()
            internship_open = InternshipOpportunities.objects.filter(
                Q(application_deadline__isnull=True) |
                Q(application_deadline__gte=timezone.localdate(now))
            ).count()
            
            # User Growth Data for Charts (last 6 months)
            user_growth_data = []
            for i in range(6):
                month_start = (now.replace(day=1) - timedelta(days=30*i)).replace(day=1)
                month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                
                users_count = Users.objects.filter(created_at__lte=month_end).count()
                students_count = Students.objects.filter(user__created_at__lte=month_end).count()
                uni_students_count = UniversityStudents.objects.filter(user__created_at__lte=month_end).count()
                
                user_growth_data.insert(0, {
                    'month': month_start.strftime('%b'),
                    'users': users_count,
                    'students': students_count,
                    'universityStudents': uni_students_count
                })
            
            # User Distribution for Pie Chart
            user_distribution = [
                {'name': 'Students', 'value': total_students, 'color': '#81C784'},
                {'name': 'University Students', 'value': total_university_students, 'color': '#75C2F6'},
                {'name': 'Mentors', 'value': total_mentors, 'color': '#F4D160'},
                {'name': 'Tutors', 'value': total_tutors, 'color': '#4C7FB1'},
                {'name': 'Counsellors', 'value': total_counsellors, 'color': '#B39DDB'},
                {'name': 'Universities', 'value': total_universities, 'color': '#1D5D9B'},
                {'name': 'Companies', 'value': total_companies, 'color': '#E57373'}
            ]

            # Monthly transaction trends (last 6 months)
            monthly_transaction_data = []
            for offset in range(5, -1, -1):
                year = current_month_start.year
                month = current_month_start.month - offset
                while month <= 0:
                    month += 12
                    year -= 1

                period_start = current_month_start.replace(year=year, month=month)
                if period_start.month == 12:
                    next_month_start = period_start.replace(year=period_start.year + 1, month=1)
                else:
                    next_month_start = period_start.replace(month=period_start.month + 1)

                month_filter = (
                    Q(paid_at__isnull=False, paid_at__gte=period_start, paid_at__lt=next_month_start)
                    | Q(
                        paid_at__isnull=True,
                        created_at__isnull=False,
                        created_at__gte=period_start,
                        created_at__lt=next_month_start,
                    )
                )
                tutoring_month_qs = TutoringPayments.objects.filter(month_filter)

                month_total_amount = tutoring_month_qs.aggregate(total=Sum('amount'))['total'] or Decimal('0')
                month_transaction_count = tutoring_month_qs.count()

                monthly_transaction_data.append({
                    'month': period_start.strftime('%b'),
                    'label': period_start.strftime('%b %Y'),
                    'transaction_count': month_transaction_count,
                    'total_amount': float(month_total_amount),
                })
            
            # Daily Activity for last 7 days
            daily_activity = []
            today_date = timezone.localdate(now)
            seven_days_ago_date = today_date - timedelta(days=6)

            login_totals = {
                record['login_date']: record['total_logins']
                for record in UserDailyLogin.objects.filter(
                    login_date__gte=seven_days_ago_date,
                    login_date__lte=today_date
                ).values('login_date').annotate(total_logins=Sum('login_count'))
            }

            for offset in range(6, -1, -1):
                day = now - timedelta(days=offset)
                day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
                day_end = day_start + timedelta(days=1)

                registrations = Users.objects.filter(
                    created_at__gte=day_start,
                    created_at__lt=day_end
                ).count()

                logins = int(login_totals.get(day_start.date(), 0) or 0)

                daily_activity.append({
                    'date': day_start.strftime('%b %d'),
                    'registrations': registrations,
                    'logins': logins
                })

            # Activity timeline for calendar (last 60 days)
            timeline_range_days = 60
            timeline_start_date = today_date - timedelta(days=timeline_range_days)
            timeline_end_date = today_date

            login_totals_timeline = {
                record['login_date']: record['total_logins']
                for record in UserDailyLogin.objects.filter(
                    login_date__gte=timeline_start_date,
                    login_date__lte=timeline_end_date,
                ).values('login_date').annotate(total_logins=Sum('login_count'))
            }

            registrations_by_day = {
                entry['activity_date']: entry['total']
                for entry in Users.objects.filter(
                    created_at__isnull=False,
                    created_at__date__gte=timeline_start_date,
                    created_at__date__lte=timeline_end_date,
                ).annotate(activity_date=TruncDate('created_at')).values('activity_date').annotate(total=Count('user_id'))
            }

            mentoring_requests_by_day = {
                entry['activity_date']: entry['total']
                for entry in MentoringRequests.objects.filter(
                    created_at__date__gte=timeline_start_date,
                    created_at__date__lte=timeline_end_date,
                ).annotate(activity_date=TruncDate('created_at')).values('activity_date').annotate(total=Count('request_id'))
            }

            tutoring_bookings_by_day = {
                entry['activity_date']: entry['total']
                for entry in TutoringPayments.objects.annotate(
                    activity_date=TruncDate(Coalesce('paid_at', 'created_at'))
                ).filter(
                    activity_date__isnull=False,
                    activity_date__gte=timeline_start_date,
                    activity_date__lte=timeline_end_date,
                ).values('activity_date').annotate(total=Count('payment_id'))
            }

            courses_published_by_day = {
                entry['activity_date']: entry['total']
                for entry in PreUniversityCourse.objects.filter(
                    status='published',
                    updated_at__date__gte=timeline_start_date,
                    updated_at__date__lte=timeline_end_date,
                ).annotate(activity_date=TruncDate('updated_at')).values('activity_date').annotate(total=Count('id'))
            }

            mentor_applications_by_day = {
                entry['activity_date']: entry['total']
                for entry in Mentors.objects.filter(
                    created_at__isnull=False,
                    created_at__date__gte=timeline_start_date,
                    created_at__date__lte=timeline_end_date,
                ).annotate(activity_date=TruncDate('created_at')).values('activity_date').annotate(total=Count('mentor_id'))
            }

            events_by_day = defaultdict(list)

            try:
                USER_TYPE_LABELS = {
                    'student': 'Student',
                    'uni_student': 'University Student',
                    'mentor': 'Mentor',
                    'tutor': 'Tutor',
                    'university': 'University',
                    'company': 'Company',
                    'admin': 'Administrator',
                }

                def safe_get_related(instance, attribute):
                    if not instance:
                        return None
                    try:
                        return getattr(instance, attribute)
                    except Exception:
                        return None

                def get_user_display_name(user):
                    if not user:
                        return 'Unknown user'
                    details = safe_get_related(user, 'userdetails')
                    if details and getattr(details, 'full_name', None):
                        return details.full_name
                    return getattr(user, 'username', 'User')

                def normalize_datetime(value):
                    if not value:
                        return None
                    try:
                        if timezone.is_naive(value):
                            value = timezone.make_aware(value, timezone.get_current_timezone())
                        return timezone.localtime(value)
                    except Exception:
                        return value if isinstance(value, datetime) else None

                def append_event(date_obj, payload):
                    if not date_obj:
                        return
                    events_by_day[date_obj].append(payload)

                login_activity_records = (
                    UserDailyLogin.objects.filter(
                        login_date__gte=timeline_start_date,
                        login_date__lte=timeline_end_date,
                    ).select_related('user__userdetails', 'user__user_type')
                )

                for login_record in login_activity_records:
                    user = safe_get_related(login_record, 'user')
                    display_name = get_user_display_name(user) if user else 'User'
                    login_count = int(getattr(login_record, 'login_count', 0) or 0)
                    subtitle = 'Login recorded today' if login_count <= 1 else f"{login_count} logins recorded today"
                    last_login_at = getattr(login_record, 'last_login_at', None)
                    normalized_last_login = normalize_datetime(last_login_at)
                    append_event(
                        getattr(login_record, 'login_date', None),
                        {
                            'id': f'login-{login_record.pk}',
                            'type': 'login',
                            'title': f'{display_name} logged in',
                            'subtitle': subtitle,
                            'timestamp': normalized_last_login.isoformat() if normalized_last_login else None,
                        },
                    )

                registrations = (
                    Users.objects.filter(
                        created_at__isnull=False,
                        created_at__date__gte=timeline_start_date,
                        created_at__date__lte=timeline_end_date,
                    ).select_related('user_type', 'userdetails')
                )

                for user in registrations:
                    created_at = normalize_datetime(getattr(user, 'created_at', None))
                    date_key = created_at.date() if created_at else None
                    type_name = getattr(getattr(user, 'user_type', None), 'type_name', 'user')
                    type_label = USER_TYPE_LABELS.get(type_name, type_name.replace('_', ' ').title())
                    display_name = get_user_display_name(user)
                    append_event(
                        date_key,
                        {
                            'id': f'registration-{user.user_id}',
                            'type': 'registration',
                            'title': f'{display_name} registered as {type_label}',
                            'subtitle': 'New account created',
                            'timestamp': created_at.isoformat() if created_at else None,
                        },
                    )

                mentoring_requests = (
                    MentoringRequests.objects.filter(
                        created_at__date__gte=timeline_start_date,
                        created_at__date__lte=timeline_end_date,
                    ).select_related(
                        'student__user__userdetails',
                        'mentor__user__userdetails',
                    )
                )

                for request in mentoring_requests:
                    created_at = normalize_datetime(getattr(request, 'created_at', None))
                    date_key = created_at.date() if created_at else None
                    student_user = safe_get_related(safe_get_related(request, 'student'), 'user')
                    mentor_user = safe_get_related(safe_get_related(request, 'mentor'), 'user')
                    student_name = get_user_display_name(student_user) if student_user else 'A student'
                    mentor_name = get_user_display_name(mentor_user) if mentor_user else 'a mentor'
                    subtitle_parts = []
                    topic = getattr(request, 'topic', None)
                    if topic:
                        subtitle_parts.append(f'Topic: {topic}')
                    try:
                        session_type_label = request.get_session_type_display()
                    except Exception:
                        session_type_label = None
                    if session_type_label:
                        subtitle_parts.append(session_type_label)
                    subtitle_text = ' • '.join(subtitle_parts) if subtitle_parts else 'Mentoring request submitted'
                    append_event(
                        date_key,
                        {
                            'id': f'mentoring-request-{request.request_id}',
                            'type': 'mentoring_request',
                            'title': f'{student_name} requested mentoring with {mentor_name}',
                            'subtitle': subtitle_text,
                            'timestamp': created_at.isoformat() if created_at else None,
                        },
                    )

                tutoring_payments = (
                    TutoringPayments.objects.annotate(
                        activity_datetime=Coalesce('paid_at', 'created_at')
                    ).filter(
                        activity_datetime__isnull=False,
                        activity_datetime__date__gte=timeline_start_date,
                        activity_datetime__date__lte=timeline_end_date,
                    ).select_related(
                        'student__user__userdetails',
                        'session__tutor__user__userdetails',
                        'session__subject',
                    )
                )

                for payment in tutoring_payments:
                    activity_at = normalize_datetime(getattr(payment, 'activity_datetime', None))
                    date_key = activity_at.date() if activity_at else None
                    student_user = safe_get_related(safe_get_related(payment, 'student'), 'user')
                    tutor = safe_get_related(payment, 'session')
                    tutor_user = safe_get_related(safe_get_related(tutor, 'tutor'), 'user') if tutor else None
                    student_name = get_user_display_name(student_user) if student_user else 'A student'
                    tutor_name = get_user_display_name(tutor_user) if tutor_user else 'a tutor'
                    subject = safe_get_related(tutor, 'subject') if tutor else None
                    subject_name = getattr(subject, 'subject_name', None)
                    subtitle_parts = []
                    if subject_name:
                        subtitle_parts.append(f'Subject: {subject_name}')
                    amount = getattr(payment, 'amount', None)
                    if amount is not None:
                        subtitle_parts.append(f'Amount: LKR {amount}')
                    subtitle_text = ' • '.join(subtitle_parts) if subtitle_parts else 'Tutoring session booked'
                    append_event(
                        date_key,
                        {
                            'id': f'tutoring-booking-{payment.payment_id}',
                            'type': 'tutoring_booking',
                            'title': f'{student_name} booked a tutoring session with {tutor_name}',
                            'subtitle': subtitle_text,
                            'timestamp': activity_at.isoformat() if activity_at else None,
                        },
                    )

                published_courses = (
                    PreUniversityCourse.objects.filter(
                        status='published',
                        updated_at__date__gte=timeline_start_date,
                        updated_at__date__lte=timeline_end_date,
                    ).select_related('mentor__user__userdetails')
                )

                for course in published_courses:
                    updated_at = normalize_datetime(getattr(course, 'updated_at', None))
                    date_key = updated_at.date() if updated_at else None
                    mentor_user = safe_get_related(safe_get_related(course, 'mentor'), 'user')
                    mentor_name = get_user_display_name(mentor_user) if mentor_user else 'Mentor'
                    append_event(
                        date_key,
                        {
                            'id': f'course-published-{course.id}',
                            'type': 'course_published',
                            'title': f'Course "{course.title}" published',
                            'subtitle': f'Published by {mentor_name}',
                            'timestamp': updated_at.isoformat() if updated_at else None,
                        },
                    )

                mentor_applications = (
                    Mentors.objects.filter(
                        created_at__isnull=False,
                        created_at__date__gte=timeline_start_date,
                        created_at__date__lte=timeline_end_date,
                    ).select_related('user__userdetails')
                )

                for mentor in mentor_applications:
                    created_at = normalize_datetime(getattr(mentor, 'created_at', None))
                    date_key = created_at.date() if created_at else None
                    mentor_user = safe_get_related(mentor, 'user')
                    mentor_name = get_user_display_name(mentor_user) if mentor_user else 'User'
                    status_text = 'Application approved' if getattr(mentor, 'approved', None) else 'Application submitted'
                    append_event(
                        date_key,
                        {
                            'id': f'mentor-application-{mentor.mentor_id}',
                            'type': 'mentor_application',
                            'title': f'{mentor_name} applied to become a mentor',
                            'subtitle': status_text,
                            'timestamp': created_at.isoformat() if created_at else None,
                        },
                    )

                for date_key in events_by_day:
                    events_by_day[date_key].sort(
                        key=lambda event: event.get('timestamp') or '',
                        reverse=True,
                    )

            except Exception as timeline_error:
                logger.exception('Failed to build activity events timeline: %s', timeline_error)
                events_by_day = defaultdict(list)

            activity_timeline = {}
            event_labels = {
                'logins': 'User logins',
                'registrations': 'New registrations',
                'mentoring_requests': 'Mentoring session requests',
                'tutoring_bookings': 'Tutoring sessions booked',
                'courses_published': 'Pre-university courses published',
                'mentor_applications': 'Mentor applications submitted',
            }

            for day_offset in range(timeline_range_days + 1):
                date_value = timeline_start_date + timedelta(days=day_offset)
                counts = {
                    'logins': int(login_totals_timeline.get(date_value, 0) or 0),
                    'registrations': int(registrations_by_day.get(date_value, 0) or 0),
                    'mentoring_requests': int(mentoring_requests_by_day.get(date_value, 0) or 0),
                    'tutoring_bookings': int(tutoring_bookings_by_day.get(date_value, 0) or 0),
                    'courses_published': int(courses_published_by_day.get(date_value, 0) or 0),
                    'mentor_applications': int(mentor_applications_by_day.get(date_value, 0) or 0),
                }

                highlights = [
                    {
                        'type': event_key,
                        'label': event_labels[event_key],
                        'count': value,
                    }
                    for event_key, value in counts.items() if value
                ]

                events = events_by_day.get(date_value, [])

                activity_timeline[date_value.isoformat()] = {
                    **counts,
                    'total_events': len(events),
                    'highlights': highlights,
                    'events': events,
                }
            
            # Recent Activities
            recent_users = Users.objects.select_related('user_type').order_by('-created_at')[:5]
            recent_activities = []
            
            for user in recent_users:
                time_diff = now - user.created_at
                if time_diff.total_seconds() < 3600:  # Less than 1 hour
                    time_ago = f"{int(time_diff.total_seconds() // 60)} minutes ago"
                elif time_diff.total_seconds() < 86400:  # Less than 1 day
                    time_ago = f"{int(time_diff.total_seconds() // 3600)} hours ago"
                else:
                    time_ago = f"{time_diff.days} days ago"
                
                activity_text = "registered as User"
                if user.user_type.type_name == 'student':
                    activity_text = "registered as Student"
                elif user.user_type.type_name == 'uni_student':
                    activity_text = "registered as University Student"
                elif user.user_type.type_name == 'mentor':
                    activity_text = "registered as Mentor"
                elif user.user_type.type_name == 'tutor':
                    activity_text = "registered as Tutor"
                elif user.user_type.type_name == 'university':
                    activity_text = "registered as University"
                elif user.user_type.type_name == 'company':
                    activity_text = "registered as Company"
                
                recent_activities.append({
                    'id': user.user_id,
                    'user': user.username,
                    'action': activity_text,
                    'time': time_ago,
                    'date': user.created_at.strftime('%Y-%m-%d'),
                    'performedBy': 'user'
                })
            
            # Today's stats
            today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            today_end = today_start + timedelta(days=1)
            today_registrations = Users.objects.filter(created_at__gte=today_start, created_at__lt=today_end).count()
            today_logins = int(
                UserDailyLogin.objects.filter(login_date=today_date)
                .aggregate(total=Sum('login_count'))
                .get('total')
                or 0
            )
            payments_date_filter = (
                Q(paid_at__isnull=False, paid_at__gte=today_start, paid_at__lt=today_end)
                | Q(
                    paid_at__isnull=True,
                    created_at__isnull=False,
                    created_at__gte=today_start,
                    created_at__lt=today_end,
                )
            )

            tutoring_payments_today = TutoringPayments.objects.filter(payments_date_filter)
            mentoring_payments_today = MentoringPayments.objects.filter(payments_date_filter)

            tutoring_total = tutoring_payments_today.aggregate(total=Sum('amount'))['total'] or Decimal('0')
            mentoring_total = mentoring_payments_today.aggregate(total=Sum('amount'))['total'] or Decimal('0')

            today_transactions = tutoring_payments_today.count() + mentoring_payments_today.count()
            today_transaction_total = tutoring_total + mentoring_total
            today_revenue = float(today_transaction_total)

            mentoring_summary = {
                'total': mentoring_requests_total,
                'total_requests': mentoring_requests_total,
                'pending_requests': mentoring_pending,
                'scheduled_sessions': mentoring_scheduled,
                'completed_sessions': mentoring_completed,
                'declined_requests': mentoring_declined,
            }

            tutoring_summary = {
                'total': tutoring_sessions_total,
                'pending_sessions': tutoring_pending,
                'scheduled_sessions': tutoring_scheduled,
                'completed_sessions': tutoring_completed,
                'cancelled_sessions': tutoring_cancelled,
            }

            internships_summary = {
                'total': internship_total,
                'currently_open': internship_open,
            }

            content_management = {
                'published_courses': {
                    'total': total_published_courses,
                    'growth': published_courses_growth,
                },
                'mentoring_sessions': mentoring_summary,
                'tutoring_sessions': tutoring_summary,
                'internships': internships_summary,
            }
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    # User Management Stats
                    'total_users': total_users,
                    'users_growth': round(users_growth, 1),
                    'total_students': total_students,
                    'students_growth': round(students_growth, 1),
                    'total_university_students': total_university_students,
                    'university_students_growth': round(uni_students_growth, 1),
                    'total_mentors': total_mentors,
                    'mentors_growth': round(mentors_growth, 1),
                    'total_counsellors': total_counsellors,
                    'counsellors_growth': round(counsellors_growth, 1),
                    
                    # Institution Management Stats
                    'total_tutors': total_tutors,
                    'tutors_growth': round(tutors_growth, 1),
                    'total_universities': total_universities,
                    'universities_growth': universities_growth,
                    'total_companies': total_companies,
                    'companies_growth': companies_growth,
                    'total_programs': total_programs,
                    'programs_growth': programs_growth,
                    'total_published_courses': total_published_courses,
                    'published_courses_growth': published_courses_growth,
                    'mentoring_summary': mentoring_summary,
                    'tutoring_summary': tutoring_summary,
                    'internships_summary': internships_summary,
                    'content_management': content_management,
                    
                    # Chart Data
                    'user_growth_data': user_growth_data,
                    'user_distribution': user_distribution,
                    'daily_activity': daily_activity,
                    'recent_activities': recent_activities,
                    'monthly_transaction_data': monthly_transaction_data,
                    'activity_timeline': activity_timeline,
                    
                    # Today's Stats
                    'today_revenue': today_revenue,
                    'today_registrations': today_registrations,
                    'today_logins': today_logins,
                    'today_transactions': today_transactions,
                    'today_transaction_total': float(today_transaction_total)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch dashboard statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_published_courses_overview(request):
    if request.method == 'GET':
        try:
            search = request.GET.get('search', '').strip()
            category = request.GET.get('category', 'all').strip()
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))

            base_qs = PreUniversityCourse.objects.filter(status='published')
            published_total = base_qs.count()
            paid_courses = base_qs.filter(price__gt=0).count()
            avg_price_data = base_qs.filter(price__gt=0).aggregate(avg_price=Avg('price'))
            avg_price = float(avg_price_data['avg_price']) if avg_price_data['avg_price'] is not None else 0.0

            courses_qs = base_qs.select_related('mentor__user__userdetails')
            if category != 'all':
                courses_qs = courses_qs.filter(category=category)
            if search:
                courses_qs = courses_qs.filter(
                    Q(title__icontains=search) |
                    Q(mentor__user__username__icontains=search) |
                    Q(mentor__user__userdetails__full_name__icontains=search)
                )

            courses_qs = courses_qs.order_by('-updated_at', '-created_at')
            paginator = Paginator(courses_qs, per_page)
            page_obj = paginator.get_page(page)

            courses_data = []
            for course in page_obj.object_list:
                mentor_user = getattr(course.mentor, 'user', None)
                courses_data.append({
                    'id': course.id,
                    'title': course.title,
                    'mentor': _get_user_display_name(mentor_user),
                    'category': course.get_category_display() if hasattr(course, 'get_category_display') else course.category,
                    'level': course.get_level_display() if hasattr(course, 'get_level_display') else course.level,
                    'price': float(course.price) if course.price is not None else 0.0,
                    'currency': course.currency,
                    'is_paid_course': bool(course.is_paid_course),
                    'enroll_count': course.enroll_count,
                    'updated_at': course.updated_at.isoformat() if course.updated_at else None,
                    'created_at': course.created_at.isoformat() if course.created_at else None,
                })

            summary = {
                'total': published_total,
                'paid_courses': paid_courses,
                'free_courses': published_total - paid_courses,
                'average_price': avg_price,
            }

            return JsonResponse({
                'success': True,
                'summary': summary,
                'courses': courses_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous(),
                }
            })
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch published courses: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_mentors_overview(request):
    if request.method == 'GET':
        try:
            search = request.GET.get('search', '').strip()
            approved_filter = request.GET.get('approved', 'all').strip().lower()
            status_filter = request.GET.get('status', 'all').strip().lower()
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))

            mentors_qs = Mentors.objects.select_related(
                'user__userdetails',
                'user__user_type',
                'university_student__university',
                'university_student__degree_program',
                'university_student__duration'
            )

            if approved_filter in ('approved', 'pending'):
                if approved_filter == 'approved':
                    mentors_qs = mentors_qs.filter(approved=1)
                else:
                    mentors_qs = mentors_qs.filter(Q(approved=0) | Q(approved__isnull=True))

            if status_filter in ('active', 'inactive'):
                expected_value = 1 if status_filter == 'active' else 0
                mentors_qs = mentors_qs.filter(user__is_active=expected_value)

            if search:
                mentors_qs = mentors_qs.filter(
                    Q(user__username__icontains=search) |
                    Q(user__email__icontains=search) |
                    Q(user__userdetails__full_name__icontains=search) |
                    Q(university_student__university__name__icontains=search) |
                    Q(university_student__degree_program__title__icontains=search)
                )

            mentors_qs = mentors_qs.order_by('-created_at', '-mentor_id')

            paginator = Paginator(mentors_qs, per_page)
            page_obj = paginator.get_page(page)

            mentors_data = []
            for mentor in page_obj.object_list:
                user = mentor.user
                user_details = getattr(user, 'userdetails', None)
                uni_student = mentor.university_student
                expertise = mentor.expertise or ''
                expertise_tags = [item.strip() for item in expertise.split(',') if item.strip()]

                mentors_data.append({
                    'id': mentor.mentor_id,
                    'full_name': user_details.full_name if user_details and user_details.full_name else user.username,
                    'email': user.email,
                    'contact_number': user_details.contact_number if user_details else '',
                    'location': user_details.location if user_details else '',
                    'profile_picture': user_details.profile_picture if user_details else '',
                    'expertise': expertise,
                    'expertise_tags': expertise_tags,
                    'bio': mentor.bio or (user_details.bio if user_details else ''),
                    'approved': bool(mentor.approved),
                    'approved_raw': mentor.approved,
                    'is_active': bool(user.is_active),
                    'university': uni_student.university.name if uni_student and uni_student.university else '',
                    'degree_program': uni_student.degree_program.title if uni_student and uni_student.degree_program else '',
                    'duration_years': uni_student.duration.duration_years if uni_student and uni_student.duration else None,
                    'created_at': mentor.created_at.isoformat() if mentor.created_at else None,
                    'user_created_at': user.created_at.isoformat() if user.created_at else None,
                })

            summary = {
                'total': Mentors.objects.count(),
                'approved': Mentors.objects.filter(approved=1).count(),
                'pending': Mentors.objects.filter(Q(approved=0) | Q(approved__isnull=True)).count(),
                'active_accounts': Mentors.objects.filter(user__is_active=1).count(),
            }

            return JsonResponse({
                'success': True,
                'mentors': mentors_data,
                'summary': summary,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous(),
                    'per_page': per_page,
                }
            })
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch mentors: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_mentor_details_admin(request, mentor_id):
    if request.method == 'GET':
        try:
            mentor = Mentors.objects.select_related(
                'user__userdetails',
                'user__user_type',
                'university_student__university',
                'university_student__degree_program',
                'university_student__duration'
            ).get(mentor_id=mentor_id)

            user = mentor.user
            user_details = getattr(user, 'userdetails', None)
            uni_student = mentor.university_student

            expertise = mentor.expertise or ''
            expertise_tags = [item.strip() for item in expertise.split(',') if item.strip()]

            mentor_requests = MentoringRequests.objects.filter(mentor=mentor)
            sessions_qs = MentoringSessions.objects.filter(mentor=mentor)

            stats = {
                'total_requests': mentor_requests.count(),
                'pending_requests': mentor_requests.filter(status__iexact='pending').count(),
                'scheduled_requests': mentor_requests.filter(status__iexact='scheduled').count(),
                'completed_requests': mentor_requests.filter(status__iexact='completed').count(),
                'declined_requests': mentor_requests.filter(status__iexact='declined').count(),
                'expired_requests': mentor_requests.filter(status__iexact='expired').count(),
                'total_sessions': sessions_qs.count(),
                'scheduled_sessions': sessions_qs.filter(status__iexact='scheduled').count(),
                'completed_sessions': sessions_qs.filter(status__iexact='completed').count(),
            }

            recent_requests = []
            for request_obj in mentor_requests.select_related('student__user__userdetails').order_by('-created_at')[:5]:
                student_user = getattr(request_obj.student, 'user', None) if request_obj.student else None
                student_details = getattr(student_user, 'userdetails', None) if student_user else None
                recent_requests.append({
                    'id': request_obj.request_id,
                    'topic': request_obj.topic,
                    'status': request_obj.status,
                    'session_type': request_obj.session_type,
                    'requested_at': request_obj.created_at.isoformat() if request_obj.created_at else None,
                    'student_name': student_details.full_name if student_details and student_details.full_name else getattr(student_user, 'username', None),
                })

            mentor_data = {
                'id': mentor.mentor_id,
                'full_name': user_details.full_name if user_details and user_details.full_name else user.username,
                'email': user.email,
                'contact_number': user_details.contact_number if user_details else '',
                'location': user_details.location if user_details else '',
                'profile_picture': user_details.profile_picture if user_details else '',
                'bio': mentor.bio or (user_details.bio if user_details else ''),
                'expertise': expertise,
                'expertise_tags': expertise_tags,
                'approved': bool(mentor.approved),
                'approved_raw': mentor.approved,
                'is_active': bool(user.is_active),
                'user_type': getattr(getattr(user, 'user_type', None), 'type_name', ''),
                'created_at': mentor.created_at.isoformat() if mentor.created_at else None,
                'user_created_at': user.created_at.isoformat() if user.created_at else None,
                'university': uni_student.university.name if uni_student and uni_student.university else '',
                'degree_program': uni_student.degree_program.title if uni_student and uni_student.degree_program else '',
                'duration_years': uni_student.duration.duration_years if uni_student and uni_student.duration else None,
                'stats': stats,
                'recent_requests': recent_requests,
            }

            return JsonResponse({
                'success': True,
                'mentor': mentor_data
            })
        except Mentors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Mentor not found'
            }, status=404)
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch mentor details: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_mentoring_sessions_overview(request):
    if request.method == 'GET':
        try:
            status_filter = request.GET.get('status', 'all').strip()
            search = request.GET.get('search', '').strip()
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))

            base_query = MentoringRequests.objects.select_related(
                'mentor__user__userdetails',
                'student__user__userdetails',
            ).order_by('-created_at')

            if status_filter and status_filter != 'all':
                base_query = base_query.filter(status__iexact=status_filter)

            if search:
                base_query = base_query.filter(
                    Q(topic__icontains=search) |
                    Q(mentor__user__username__icontains=search) |
                    Q(mentor__user__userdetails__full_name__icontains=search) |
                    Q(student__user__username__icontains=search) |
                    Q(student__user__userdetails__full_name__icontains=search)
                )

            paginator = Paginator(base_query, per_page)
            page_obj = paginator.get_page(page)

            requests_data = []
            for request_obj in page_obj.object_list:
                mentor_user = getattr(getattr(request_obj, 'mentor', None), 'user', None)
                student_user = getattr(getattr(request_obj, 'student', None), 'user', None)
                requests_data.append({
                    'id': request_obj.request_id,
                    'topic': request_obj.topic,
                    'status': request_obj.status,
                    'session_type': request_obj.session_type,
                    'urgency': request_obj.urgency,
                    'preferred_time': request_obj.preferred_time,
                    'requested_at': request_obj.created_at.isoformat() if request_obj.created_at else None,
                    'student': _get_user_display_name(student_user),
                    'mentor': _get_user_display_name(mentor_user),
                })

            summary = {
                'total': MentoringRequests.objects.count(),
                'pending_requests': MentoringRequests.objects.filter(status__iexact='pending').count(),
                'scheduled_sessions': MentoringRequests.objects.filter(status__iexact='scheduled').count(),
                'completed_sessions': MentoringRequests.objects.filter(status__iexact='completed').count(),
                'declined_requests': MentoringRequests.objects.filter(status__iexact='declined').count(),
            }

            return JsonResponse({
                'success': True,
                'summary': summary,
                'requests': requests_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous(),
                }
            })
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch mentoring sessions: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_tutoring_sessions_overview(request):
    if request.method == 'GET':
        try:
            status_filter = request.GET.get('status', 'all').strip()
            search = request.GET.get('search', '').strip()
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))

            base_query = TutoringSessions.objects.select_related(
                'tutor__user__userdetails',
                'subject'
            ).order_by('-scheduled_at', '-created_at')

            if status_filter and status_filter != 'all':
                base_query = base_query.filter(status__iexact=status_filter)

            if search:
                base_query = base_query.filter(
                    Q(subject__subject_name__icontains=search) |
                    Q(tutor__user__username__icontains=search) |
                    Q(tutor__user__userdetails__full_name__icontains=search) |
                    Q(description__icontains=search)
                )

            paginator = Paginator(base_query, per_page)
            page_obj = paginator.get_page(page)

            sessions_data = []
            for session in page_obj.object_list:
                tutor_user = getattr(getattr(session, 'tutor', None), 'user', None)
                subject = getattr(session, 'subject', None)
                sessions_data.append({
                    'id': session.session_id,
                    'tutor': _get_user_display_name(tutor_user),
                    'subject': getattr(subject, 'subject_name', ''),
                    'status': session.status,
                    'scheduled_at': session.scheduled_at.isoformat() if session.scheduled_at else None,
                    'duration_minutes': session.duration_minutes,
                    'created_at': session.created_at.isoformat() if session.created_at else None,
                    'description': session.description or '',
                })

            summary = {
                'total': TutoringSessions.objects.count(),
                'pending_sessions': TutoringSessions.objects.filter(status__iexact='pending').count(),
                'scheduled_sessions': TutoringSessions.objects.filter(status__iexact='scheduled').count(),
                'completed_sessions': TutoringSessions.objects.filter(status__iexact='completed').count(),
                'cancelled_sessions': TutoringSessions.objects.filter(status__iexact='cancelled').count(),
            }

            return JsonResponse({
                'success': True,
                'summary': summary,
                'sessions': sessions_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous(),
                }
            })
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch tutoring sessions: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_internships_overview(request):
    if request.method == 'GET':
        try:
            search = request.GET.get('search', '').strip()
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))

            base_query = InternshipOpportunities.objects.select_related('company').order_by('-created_at')

            if search:
                base_query = base_query.filter(
                    Q(title__icontains=search) |
                    Q(company__name__icontains=search) |
                    Q(location__icontains=search)
                )

            paginator = Paginator(base_query, per_page)
            page_obj = paginator.get_page(page)

            internships_data = []
            for internship in page_obj.object_list:
                internships_data.append({
                    'id': internship.internship_id,
                    'title': internship.title,
                    'company': getattr(internship.company, 'name', ''),
                    'location': internship.location or '',
                    'stipend': internship.stipend or '',
                    'application_deadline': internship.application_deadline.isoformat() if internship.application_deadline else None,
                    'start_date': internship.start_date.isoformat() if internship.start_date else None,
                    'end_date': internship.end_date.isoformat() if internship.end_date else None,
                    'created_at': internship.created_at.isoformat() if internship.created_at else None,
                })

            today = timezone.localdate()
            summary = {
                'total': InternshipOpportunities.objects.count(),
                'currently_open': InternshipOpportunities.objects.filter(
                    Q(application_deadline__isnull=True) |
                    Q(application_deadline__gte=today)
                ).count(),
            }

            return JsonResponse({
                'success': True,
                'summary': summary,
                'internships': internships_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous(),
                }
            })
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch internships: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)