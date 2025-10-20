from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from django.utils import timezone
from django.db.models import Q, Count, Sum
from django.core.paginator import Paginator
import json
from datetime import datetime, timedelta
from decimal import Decimal

from apps.accounts.models import Users, UserDetails, UserTypes, UserDailyLogin
from apps.companies.models import Companies, InternshipOpportunities
from apps.advertisements.models import AdBookings, Advertisements, AdSpaces
from apps.universities.models import Universities
from apps.students.models import Students
from apps.university_students.models import UniversityStudents
from apps.tutoring.models import Tutors
from apps.mentoring.models import Mentors
from apps.university_programs.models import DegreePrograms
from apps.payments.models import TutoringPayments, MentoringPayments
from .models import Report, ReportCategory, ReportAction
from django.contrib.auth.hashers import check_password, make_password

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
                    
                    # Institution Management Stats
                    'total_tutors': total_tutors,
                    'tutors_growth': round(tutors_growth, 1),
                    'total_universities': total_universities,
                    'universities_growth': universities_growth,
                    'total_companies': total_companies,
                    'companies_growth': companies_growth,
                    'total_programs': total_programs,
                    'programs_growth': programs_growth,
                    
                    # Chart Data
                    'user_growth_data': user_growth_data,
                    'user_distribution': user_distribution,
                    'daily_activity': daily_activity,
                    'recent_activities': recent_activities,
                    'monthly_transaction_data': monthly_transaction_data,
                    
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