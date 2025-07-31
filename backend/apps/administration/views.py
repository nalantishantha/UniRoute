from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from django.utils import timezone
from django.db.models import Q, Count
from django.core.paginator import Paginator
import json

from apps.accounts.models import Users, UserDetails, UserTypes
from apps.students.models import Students
from apps.university_students.models import UniversityStudents
from apps.universities.models import Universities, Faculties, UniversityEvents
from apps.companies.models import Companies, InternshipOpportunities, CompanyEvents
from apps.mentoring.models import Mentors
from apps.tutoring.models import Tutors, TutorSubjects, TutorRatings
from apps.student_results.models import AlSubjects
from apps.advertisements.models import AdBookings, Advertisements, AdSpaces
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
    """Get internship statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get counts by company
            company_counts = InternshipOpportunities.objects.select_related('company').values('company__name').annotate(count=Count('company')).order_by('-count')[:5]
            
            # Get counts by location
            location_counts = InternshipOpportunities.objects.exclude(location__isnull=True).exclude(location__exact='').values('location').annotate(count=Count('location')).order_by('-count')[:5]
            
            # Get active internships (deadline not passed)
            active_internships = InternshipOpportunities.objects.filter(
                application_deadline__gte=timezone.now().date()
            ).count()
            
            # Get expired internships (deadline passed)
            expired_internships = InternshipOpportunities.objects.filter(
                application_deadline__lt=timezone.now().date()
            ).count()
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_internships': InternshipOpportunities.objects.count(),
                    'active_internships': active_internships,
                    'expired_internships': expired_internships,
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

# ...existing code...

@csrf_exempt
def get_all_users(request):
    """Get all users with their details"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            user_type = request.GET.get('user_type', 'all')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query to get users with their details
            # Use left join to get users even if they don't have details
            users = Users.objects.select_related('user_type').all()
            
            # Apply filters
            if search:
                users = users.filter(
                    Q(username__icontains=search) |
                    Q(email__icontains=search)
                )
                # Add search on UserDetails if the relationship exists
                try:
                    users = users.filter(
                        Q(username__icontains=search) |
                        Q(email__icontains=search) |
                        Q(userdetails__full_name__icontains=search)
                    )
                except:
                    # If UserDetails relationship doesn't work, just search users table
                    pass
            
            if user_type != 'all':
                users = users.filter(user_type__type_name=user_type)
            
            # Order by creation date (newest first)
            users = users.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(users, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            users_data = []
            for user in page_obj:
                # Try to get user details using different approaches
                user_details = None
                try:
                    # Method 1: Try direct relationship
                    user_details = UserDetails.objects.filter(user=user).first()
                except:
                    # Method 2: Try with user_id
                    try:
                        user_details = UserDetails.objects.filter(user_id=user.user_id).first()
                    except:
                        user_details = None
                
                user_data = {
                    'user_id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type.type_name if user.user_type else 'unknown',
                    'user_type_id': user.user_type.type_id if user.user_type else None,
                    'is_active': user.is_active,
                    'created_at': user.created_at.isoformat() if user.created_at else None,
                    # 'last_login': user.last_login.isoformat() if user.last_login else None,
                    # User details
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'profile_picture': user_details.profile_picture if user_details else '',
                    'bio': user_details.bio if user_details else '',
                    'is_verified': user_details.is_verified if user_details else False,
                    'location': user_details.location if user_details else '',
                    'gender': user_details.gender if user_details else '',
                }
                users_data.append(user_data)
            
            return JsonResponse({
                'success': True,
                'users': users_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            print(f"Error fetching users: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch users: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_user_types(request):
    """Get all available user types"""
    if request.method == 'GET':
        try:
            user_types = UserTypes.objects.all().order_by('type_name')
            user_types_data = []
            
            for user_type in user_types:
                user_types_data.append({
                    'type_id': user_type.type_id,
                    'type_name': user_type.type_name,
                    'description': getattr(user_type, 'description', ''),
                })
            
            return JsonResponse({
                'success': True,
                'user_types': user_types_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch user types: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def toggle_user_status(request, user_id):
    """Toggle user active status"""
    if request.method == 'PUT':
        try:
            user = Users.objects.get(user_id=user_id)
            user.is_active = not user.is_active
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
                'is_active': user.is_active
            })
            
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update user status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_user(request, user_id):
    """Delete a user"""
    if request.method == 'DELETE':
        try:
            user = Users.objects.get(user_id=user_id)
            
            # Prevent deleting admin users
            if user.user_type and user.user_type.type_name == 'admin':
                return JsonResponse({
                    'success': False,
                    'message': 'Cannot delete admin users'
                }, status=400)
            
            # Delete user (this will cascade to UserDetails)
            username = user.username
            user.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'User {username} deleted successfully'
            })
            
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete user: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_user_statistics(request):
    """Get user statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get total counts by user type
            user_type_counts = Users.objects.select_related('user_type').values('user_type__type_name').annotate(count=Count('user_type')).order_by('-count')
            
            # Get active/inactive counts
            active_users = Users.objects.filter(is_active=True).count()
            inactive_users = Users.objects.filter(is_active=False).count()
            
            # Get recent registrations (last 7 days)
            recent_registrations = Users.objects.filter(
                created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            # Get verified users count - updated to handle relationship properly
            verified_users = 0
            try:
                # Try to count verified users
                verified_users = UserDetails.objects.filter(is_verified=True).count()
            except Exception as e:
                print(f"Error counting verified users: {str(e)}")
                verified_users = 0
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_users': Users.objects.count(),
                    'active_users': active_users,
                    'inactive_users': inactive_users,
                    'verified_users': verified_users,
                    'recent_registrations': recent_registrations,
                    'user_type_breakdown': list(user_type_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_students(request):
    """Get all students with their details"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            stage = request.GET.get('stage', 'all')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query to get students with user and user details
            students = Students.objects.select_related('user', 'user__user_type').all()
            
            # Apply filters
            if search:
                students = students.filter(
                    Q(user__username__icontains=search) |
                    Q(user__email__icontains=search) |
                    Q(school__icontains=search) |
                    Q(district__icontains=search)
                )
                # Add search on UserDetails if possible
                try:
                    students = students.filter(
                        Q(user__username__icontains=search) |
                        Q(user__email__icontains=search) |
                        Q(school__icontains=search) |
                        Q(district__icontains=search) |
                        Q(user__userdetails__full_name__icontains=search)
                    )
                except:
                    pass
            
            # Updated stage filter to match new stages
            if stage != 'all':
                if stage == 'POST_A/L':
                    students = students.filter(current_stage='POST_A/L')
                else:
                    students = students.filter(current_stage=stage)
            
            # Order by creation date (newest first)
            students = students.order_by('-user__created_at')
            
            # Pagination
            paginator = Paginator(students, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            students_data = []
            for student in page_obj:
                # Try to get user details
                user_details = None
                try:
                    user_details = UserDetails.objects.filter(user=student.user).first()
                except:
                    try:
                        user_details = UserDetails.objects.filter(user_id=student.user.user_id).first()
                    except:
                        user_details = None
                
                student_data = {
                    'student_id': student.student_id,
                    'user_id': student.user.user_id,
                    'username': student.user.username,
                    'email': student.user.email,
                    'current_stage': student.current_stage or 'undefined',
                    'district': student.district or 'undefined',
                    'school': student.school or 'undefined',
                    'is_active': student.user.is_active,
                    'created_at': student.user.created_at.isoformat() if student.user.created_at else None,
                    # User details
                    'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                    'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                    'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                    'bio': user_details.bio if user_details and user_details.bio else 'undefined',
                    'is_verified': user_details.is_verified if user_details else False,
                    'location': user_details.location if user_details and user_details.location else 'undefined',
                    'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                }
                students_data.append(student_data)
            
            return JsonResponse({
                'success': True,
                'students': students_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            print(f"Error fetching students: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch students: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)
@csrf_exempt
def get_student_details(request, student_id):
    """Get detailed information about a specific student"""
    if request.method == 'GET':
        try:
            student = Students.objects.select_related('user', 'user__user_type').get(student_id=student_id)
            
            # Try to get user details
            user_details = None
            try:
                user_details = UserDetails.objects.filter(user=student.user).first()
            except:
                try:
                    user_details = UserDetails.objects.filter(user_id=student.user.user_id).first()
                except:
                    user_details = None
            
            student_data = {
                'student_id': student.student_id,
                'user_id': student.user.user_id,
                'username': student.user.username,
                'email': student.user.email,
                'current_stage': student.current_stage or 'undefined',
                'district': student.district or 'undefined',
                'school': student.school or 'undefined',
                'is_active': student.user.is_active,
                'created_at': student.user.created_at.isoformat() if student.user.created_at else None,
                # User details
                'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                'bio': user_details.bio if user_details and user_details.bio else 'undefined',
                'is_verified': user_details.is_verified if user_details else False,
                'location': user_details.location if user_details and user_details.location else 'undefined',
                'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                'updated_at': user_details.updated_at.isoformat() if user_details and user_details.updated_at else None,
            }
            
            return JsonResponse({
                'success': True,
                'student': student_data
            })
            
        except Students.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Student not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch student details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def toggle_student_status(request, student_id):
    """Toggle student active status"""
    if request.method == 'PUT':
        try:
            student = Students.objects.select_related('user').get(student_id=student_id)
            student.user.is_active = not student.user.is_active
            student.user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Student {"activated" if student.user.is_active else "deactivated"} successfully',
                'is_active': student.user.is_active
            })
            
        except Students.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Student not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update student status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_student(request, student_id):
    """Delete a student"""
    if request.method == 'DELETE':
        try:
            student = Students.objects.select_related('user').get(student_id=student_id)
            user = student.user
            username = user.username
            
            # Delete student record and user
            with transaction.atomic():
                student.delete()
                UserDetails.objects.filter(user=user).delete()
                user.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Student {username} deleted successfully'
            })
            
        except Students.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Student not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete student: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_student_statistics(request):
    """Get student statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get total counts by stage
            stage_counts = Students.objects.values('current_stage').annotate(count=Count('current_stage')).order_by('-count')
            
            # Get active/inactive counts
            active_students = Students.objects.filter(user__is_active=True).count()
            inactive_students = Students.objects.filter(user__is_active=False).count()
            
            # Get recent registrations (last 7 days)
            recent_registrations = Students.objects.filter(
                user__created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            # Get verified students count
            verified_students = 0
            try:
                verified_students = Students.objects.filter(user__userdetails__is_verified=True).count()
            except Exception as e:
                print(f"Error counting verified students: {str(e)}")
                verified_students = 0
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_students': Students.objects.count(),
                    'active_students': active_students,
                    'inactive_students': inactive_students,
                    'verified_students': verified_students,
                    'recent_registrations': recent_registrations,
                    'stage_breakdown': list(stage_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_university_students(request):
    """Get all university students with their details"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            university = request.GET.get('university', 'all')
            faculty = request.GET.get('faculty', 'all')
            degree_program = request.GET.get('degree_program', 'all')
            year_of_study = request.GET.get('year_of_study', 'all')
            status = request.GET.get('status', 'all')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query to get university students with related data
            university_students = UniversityStudents.objects.select_related(
                'user', 'user__user_type', 'university', 'faculty', 'degree_program', 'duration'
            ).all()
            
            # Apply filters
            if search:
                university_students = university_students.filter(
                    Q(user__username__icontains=search) |
                    Q(user__email__icontains=search) |
                    Q(registration_number__icontains=search) |
                    Q(university__name__icontains=search) |
                    Q(degree_program__program_name__icontains=search)
                )
                # Add search on UserDetails if possible
                try:
                    university_students = university_students.filter(
                        Q(user__username__icontains=search) |
                        Q(user__email__icontains=search) |
                        Q(registration_number__icontains=search) |
                        Q(university__name__icontains=search) |
                        Q(degree_program__program_name__icontains=search) |
                        Q(user__userdetails__full_name__icontains=search)
                    )
                except:
                    pass
            
            # Apply filters
            if university != 'all':
                university_students = university_students.filter(university_id=university)
            if faculty != 'all':
                university_students = university_students.filter(faculty_id=faculty)
            if degree_program != 'all':
                university_students = university_students.filter(degree_program_id=degree_program)
            if year_of_study != 'all':
                university_students = university_students.filter(year_of_study=year_of_study)
            if status != 'all':
                university_students = university_students.filter(status=status)
            
            # Order by creation date (newest first)
            university_students = university_students.order_by('-user__created_at')
            
            # Pagination
            paginator = Paginator(university_students, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            students_data = []
            for student in page_obj:
                # Try to get user details
                user_details = None
                try:
                    user_details = UserDetails.objects.filter(user=student.user).first()
                except:
                    try:
                        user_details = UserDetails.objects.filter(user_id=student.user.user_id).first()
                    except:
                        user_details = None
                
                student_data = {
                    'university_student_id': student.university_student_id,
                    'user_id': student.user.user_id,
                    'username': student.user.username,
                    'email': student.user.email,
                    'registration_number': student.registration_number or 'undefined',
                    'year_of_study': student.year_of_study or 'undefined',
                    'enrollment_date': student.enrollment_date.isoformat() if student.enrollment_date else 'undefined',
                    'status': student.status or 'undefined',
                    'is_active': student.user.is_active,
                    'created_at': student.user.created_at.isoformat() if student.user.created_at else None,
                    # University details
                    'university': {
                        'id': student.university.university_id if student.university else None,
                        'name': student.university.name if student.university else 'undefined',
                        'district': getattr(student.university, 'district', 'undefined') if student.university else 'undefined',
                    },
                    'faculty': {
                        'id': student.faculty.faculty_id if student.faculty else None,
                        'name': student.faculty.name if student.faculty else 'undefined',
                    } if student.faculty else {'id': None, 'name': 'undefined'},
                    'degree_program': {
                        'id': student.degree_program.degree_program_id if student.degree_program else None,
                        'name': student.degree_program.title if student.degree_program else 'undefined',
                        'degree_type': getattr(student.degree_program, 'degree_type', 'undefined') if student.degree_program else 'undefined',
                    },
                    'duration': {
                        'id': student.duration.duration_id if student.duration else None,
                        'duration_years': student.duration.duration_years if student.duration else 'undefined',
                    } if student.duration else {'id': None, 'duration_years': 'undefined'},
                    # User details
                    'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                    'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                    'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                    'bio': user_details.bio if user_details and user_details.bio else 'undefined',
                    'is_verified': user_details.is_verified if user_details else False,
                    'location': user_details.location if user_details and user_details.location else 'undefined',
                    'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                }
                students_data.append(student_data)
            
            return JsonResponse({
                'success': True,
                'university_students': students_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            print(f"Error fetching university students: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch university students: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_university_student_details(request, university_student_id):
    """Get detailed information about a specific university student"""
    if request.method == 'GET':
        try:
            student = UniversityStudents.objects.select_related(
                'user', 'user__user_type', 'university', 'faculty', 'degree_program', 'duration'
            ).get(university_student_id=university_student_id)
            
            # Try to get user details
            user_details = None
            try:
                user_details = UserDetails.objects.filter(user=student.user).first()
            except:
                try:
                    user_details = UserDetails.objects.filter(user_id=student.user.user_id).first()
                except:
                    user_details = None
            
            student_data = {
                'university_student_id': student.university_student_id,
                'user_id': student.user.user_id,
                'username': student.user.username,
                'email': student.user.email,
                'registration_number': student.registration_number or 'undefined',
                'year_of_study': student.year_of_study or 'undefined',
                'enrollment_date': student.enrollment_date.isoformat() if student.enrollment_date else 'undefined',
                'status': student.status or 'undefined',
                'is_active': student.user.is_active,
                'created_at': student.user.created_at.isoformat() if student.user.created_at else None,
                # University details
                'university': {
                    'id': student.university.university_id if student.university else None,
                    'name': student.university.name if student.university else 'undefined',
                    'district': getattr(student.university, 'district', 'undefined') if student.university else 'undefined',
                },
                'faculty': {
                    'id': student.faculty.faculty_id if student.faculty else None,
                    'name': student.faculty.faculty_name if student.faculty else 'undefined',
                } if student.faculty else {'id': None, 'name': 'undefined'},
                'degree_program': {
                    'id': student.degree_program.program_id if student.degree_program else None,
                    'name': student.degree_program.program_name if student.degree_program else 'undefined',
                    'degree_type': getattr(student.degree_program, 'degree_type', 'undefined') if student.degree_program else 'undefined',
                },
                'duration': {
                    'id': student.duration.duration_id if student.duration else None,
                    'duration_years': student.duration.duration_years if student.duration else 'undefined',
                } if student.duration else {'id': None, 'duration_years': 'undefined'},
                # User details
                'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                'bio': user_details.bio if user_details and user_details.bio else 'undefined',
                'is_verified': user_details.is_verified if user_details else False,
                'location': user_details.location if user_details and user_details.location else 'undefined',
                'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                'updated_at': user_details.updated_at.isoformat() if user_details and user_details.updated_at else None,
            }
            
            return JsonResponse({
                'success': True,
                'university_student': student_data
            })
            
        except UniversityStudents.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University student not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch university student details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def toggle_university_student_status(request, university_student_id):
    """Toggle university student active status"""
    if request.method == 'PUT':
        try:
            student = UniversityStudents.objects.select_related('user').get(university_student_id=university_student_id)
            student.user.is_active = not student.user.is_active
            student.user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'University student {"activated" if student.user.is_active else "deactivated"} successfully',
                'is_active': student.user.is_active
            })
            
        except UniversityStudents.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University student not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update university student status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_university_student(request, university_student_id):
    """Delete a university student"""
    if request.method == 'DELETE':
        try:
            student = UniversityStudents.objects.select_related('user').get(university_student_id=university_student_id)
            user = student.user
            username = user.username
            
            # Delete student record and user
            with transaction.atomic():
                student.delete()
                UserDetails.objects.filter(user=user).delete()
                user.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'University student {username} deleted successfully'
            })
            
        except UniversityStudents.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University student not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete university student: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_university_student_statistics(request):
    """Get university student statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get total counts by university
            university_counts = UniversityStudents.objects.select_related('university').values('university__name').annotate(count=Count('university')).order_by('-count')
            
            # Get counts by year of study
            year_counts = UniversityStudents.objects.values('year_of_study').annotate(count=Count('year_of_study')).order_by('year_of_study')
            
            # Get counts by status
            status_counts = UniversityStudents.objects.values('status').annotate(count=Count('status')).order_by('-count')
            
            # Get active/inactive counts
            active_students = UniversityStudents.objects.filter(user__is_active=True).count()
            inactive_students = UniversityStudents.objects.filter(user__is_active=False).count()
            
            # Get recent registrations (last 7 days)
            recent_registrations = UniversityStudents.objects.filter(
                user__created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            # Get verified students count
            verified_students = 0
            try:
                verified_students = UniversityStudents.objects.filter(user__userdetails__is_verified=True).count()
            except Exception as e:
                print(f"Error counting verified university students: {str(e)}")
                verified_students = 0
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_university_students': UniversityStudents.objects.count(),
                    'active_students': active_students,
                    'inactive_students': inactive_students,
                    'verified_students': verified_students,
                    'recent_registrations': recent_registrations,
                    'university_breakdown': list(university_counts),
                    'year_breakdown': list(year_counts),
                    'status_breakdown': list(status_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

# @csrf_exempt
# def get_university_filter_options(request):
#     """Get filter options for university students"""
#     if request.method == 'GET':
#         try:
#             # Get all universities
#             universities = Universities.objects.all().values('university_id', 'name').order_by('name')
            
#             # Get all faculties
#             faculties = []
#             try:
#                 from apps.universities.models import Faculties
#                 faculties = Faculties.objects.all().values('faculty_id', 'faculty_name').order_by('faculty_name')
#             except:
#                 pass
            
#             # Get all degree programs
#             degree_programs = []
#             try:
#                 from apps.university_programs.models import DegreePrograms
#                 degree_programs = DegreePrograms.objects.all().values('program_id', 'program_name').order_by('program_name')
#             except:
#                 pass
            
#             # Get unique years of study
#             years_of_study = UniversityStudents.objects.values_list('year_of_study', flat=True).distinct().order_by('year_of_study')
#             years_of_study = [year for year in years_of_study if year is not None]
            
#             # Get unique statuses
#             statuses = UniversityStudents.objects.values_list('status', flat=True).distinct()
#             statuses = [status for status in statuses if status is not None and status != '']
            
#             return JsonResponse({
#                 'success': True,
#                 'filter_options': {
#                     'universities': list(universities),
#                     'faculties': list(faculties),
#                     'degree_programs': list(degree_programs),
#                     'years_of_study': years_of_study,
#                     'statuses': statuses
#                 }
#             })
            
#         except Exception as e:
#             return JsonResponse({
#                 'success': False,
#                 'message': f'Failed to fetch filter options: {str(e)}'
#             }, status=500)
    
#     return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_universities(request):
    """Get all universities with their details"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            district = request.GET.get('district', 'all')
            is_active = request.GET.get('is_active', 'all')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query to get universities
            universities = Universities.objects.all()
            
            # Apply filters
            if search:
                universities = universities.filter(
                    Q(name__icontains=search) |
                    Q(location__icontains=search) |
                    Q(district__icontains=search) |
                    Q(contact_email__icontains=search)
                )
            
            if district != 'all':
                universities = universities.filter(district=district)
            
            if is_active != 'all':
                universities = universities.filter(is_active=int(is_active))
            
            # Order by creation date (newest first)
            universities = universities.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(universities, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            universities_data = []
            for university in page_obj:
                # Get faculty count
                faculty_count = Faculties.objects.filter(university=university).count()
                
                university_data = {
                    'university_id': university.university_id,
                    'name': university.name or 'undefined',
                    'location': university.location or 'undefined',
                    'district': university.district or 'undefined',
                    'address': university.address or 'undefined',
                    'description': university.description or 'undefined',
                    'contact_email': university.contact_email or 'undefined',
                    'phone_number': university.phone_number or 'undefined',
                    'website': university.website or 'undefined',
                    'logo': university.logo or 'undefined',
                    'ugc_ranking': university.ugc_ranking or 'undefined',
                    'is_active': university.is_active,
                    'created_at': university.created_at.isoformat() if university.created_at else None,
                    'faculty_count': faculty_count,
                }
                universities_data.append(university_data)
            
            return JsonResponse({
                'success': True,
                'universities': universities_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            print(f"Error fetching universities: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch universities: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_university_details(request, university_id):
    """Get detailed information about a specific university"""
    if request.method == 'GET':
        try:
            university = Universities.objects.get(university_id=university_id)
            
            # Get faculties
            faculties = Faculties.objects.filter(university=university)
            faculties_data = []
            for faculty in faculties:
                faculties_data.append({
                    'faculty_id': faculty.faculty_id,
                    'name': faculty.name,
                    'description': faculty.description or 'undefined',
                    'contact_email': faculty.contact_email or 'undefined',
                    'phone_number': faculty.phone_number or 'undefined',
                    'website': faculty.website or 'undefined',
                    'is_active': faculty.is_active,
                    'created_at': faculty.created_at.isoformat() if faculty.created_at else None,
                })
            
            university_data = {
                'university_id': university.university_id,
                'name': university.name or 'undefined',
                'location': university.location or 'undefined',
                'district': university.district or 'undefined',
                'address': university.address or 'undefined',
                'description': university.description or 'undefined',
                'contact_email': university.contact_email or 'undefined',
                'phone_number': university.phone_number or 'undefined',
                'website': university.website or 'undefined',
                'logo': university.logo or 'undefined',
                'ugc_ranking': university.ugc_ranking or 'undefined',
                'is_active': university.is_active,
                'created_at': university.created_at.isoformat() if university.created_at else None,
                'faculties': faculties_data,
            }
            
            return JsonResponse({
                'success': True,
                'university': university_data
            })
            
        except Universities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch university details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def toggle_university_status(request, university_id):
    """Toggle university active status"""
    if request.method == 'PUT':
        try:
            university = Universities.objects.get(university_id=university_id)
            university.is_active = 1 if not university.is_active else 0
            university.save()
            
            return JsonResponse({
                'success': True,
                'message': f'University {"activated" if university.is_active else "deactivated"} successfully',
                'is_active': university.is_active
            })
            
        except Universities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update university status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_university(request, university_id):
    """Delete a university"""
    if request.method == 'DELETE':
        try:
            university = Universities.objects.get(university_id=university_id)
            university_name = university.name
            
            # Delete university (this will cascade to related records)
            with transaction.atomic():
                # Delete related faculties first
                Faculties.objects.filter(university=university).delete()
                university.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'University {university_name} deleted successfully'
            })
            
        except Universities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete university: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_university_statistics(request):
    """Get university statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get total counts by district
            district_counts = Universities.objects.values('district').annotate(count=Count('district')).order_by('-count')
            
            # Get active/inactive counts
            active_universities = Universities.objects.filter(is_active=1).count()
            inactive_universities = Universities.objects.filter(is_active=0).count()
            
            # Get recent registrations (last 7 days)
            recent_registrations = Universities.objects.filter(
                created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            # Get ranking statistics
            ranked_universities = Universities.objects.filter(ugc_ranking__isnull=False).count()
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_universities': Universities.objects.count(),
                    'active_universities': active_universities,
                    'inactive_universities': inactive_universities,
                    'ranked_universities': ranked_universities,
                    'recent_registrations': recent_registrations,
                    'district_breakdown': list(district_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_university_filter_options(request):
    """Get filter options for universities"""
    if request.method == 'GET':
        try:
            # Get unique districts
            districts = Universities.objects.values_list('district', flat=True).distinct()
            districts = [district for district in districts if district is not None and district != '']
            
            # Get unique locations
            locations = Universities.objects.values_list('location', flat=True).distinct()
            locations = [location for location in locations if location is not None and location != '']
            
            return JsonResponse({
                'success': True,
                'filter_options': {
                    'districts': sorted(districts),
                    'locations': sorted(locations)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch filter options: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_companies(request):
    """Get all companies with their details"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            district = request.GET.get('district', 'all')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query to get companies
            companies = Companies.objects.all()
            
            # Apply filters
            if search:
                companies = companies.filter(
                    Q(name__icontains=search) |
                    Q(address__icontains=search) |
                    Q(district__icontains=search) |
                    Q(contact_email__icontains=search) |
                    Q(website__icontains=search)
                )
            
            if district != 'all':
                companies = companies.filter(district=district)
            
            # Order by creation date (newest first)
            companies = companies.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(companies, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            companies_data = []
            for company in page_obj:
                company_data = {
                    'company_id': company.company_id,
                    'name': company.name or 'undefined',
                    'description': company.description or 'undefined',
                    'address': company.address or 'undefined',
                    'district': company.district or 'undefined',
                    'contact_email': company.contact_email or 'undefined',
                    'contact_phone': company.contact_phone or 'undefined',
                    'website': company.website or 'undefined',
                    'created_at': company.created_at.isoformat() if company.created_at else None,
                }
                companies_data.append(company_data)
            
            return JsonResponse({
                'success': True,
                'companies': companies_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            print(f"Error fetching companies: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch companies: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_company_details(request, company_id):
    """Get detailed information about a specific company"""
    if request.method == 'GET':
        try:
            company = Companies.objects.get(company_id=company_id)
            
            company_data = {
                'company_id': company.company_id,
                'name': company.name or 'undefined',
                'description': company.description or 'undefined',
                'address': company.address or 'undefined',
                'district': company.district or 'undefined',
                'contact_email': company.contact_email or 'undefined',
                'contact_phone': company.contact_phone or 'undefined',
                'website': company.website or 'undefined',
                'created_at': company.created_at.isoformat() if company.created_at else None,
            }
            
            return JsonResponse({
                'success': True,
                'company': company_data
            })
            
        except Companies.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Company not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch company details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def delete_company(request, company_id):
    """Delete a company"""
    if request.method == 'DELETE':
        try:
            company = Companies.objects.get(company_id=company_id)
            company_name = company.name
            
            # Delete company (this will cascade to related records)
            with transaction.atomic():
                company.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Company {company_name} deleted successfully'
            })
            
        except Companies.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Company not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete company: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_company_statistics(request):
    """Get company statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get total counts by district
            district_counts = Companies.objects.values('district').annotate(count=Count('district')).order_by('-count')
            
            # Get recent registrations (last 7 days)
            recent_registrations = Companies.objects.filter(
                created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_companies': Companies.objects.count(),
                    'recent_registrations': recent_registrations,
                    'district_breakdown': list(district_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_company_filter_options(request):
    """Get filter options for companies"""
    if request.method == 'GET':
        try:
            # Get unique districts
            districts = Companies.objects.values_list('district', flat=True).distinct()
            districts = [district for district in districts if district is not None and district != '']
            
            return JsonResponse({
                'success': True,
                'filter_options': {
                    'districts': sorted(districts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch filter options: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_mentors(request):
    """Get all mentors with their details"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            approved = request.GET.get('approved', 'all')
            university = request.GET.get('university', 'all')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query to get mentors with related data
            mentors = Mentors.objects.select_related(
                'user', 
                'user__user_type', 
                'university_student',
                'university_student__university'
            ).all()
            
            # Apply filters
            if search:
                mentors = mentors.filter(
                    Q(user__username__icontains=search) |
                    Q(user__email__icontains=search) |
                    Q(expertise__icontains=search) |
                    Q(university_student__university__name__icontains=search)
                )
                # Add search on UserDetails if possible
                try:
                    mentors = mentors.filter(
                        Q(user__username__icontains=search) |
                        Q(user__email__icontains=search) |
                        Q(expertise__icontains=search) |
                        Q(university_student__university__name__icontains=search) |
                        Q(user__userdetails__full_name__icontains=search)
                    )
                except:
                    pass
            
            if approved != 'all':
                mentors = mentors.filter(approved=int(approved))
                
            if university != 'all':
                mentors = mentors.filter(university_student__university_id=university)
            
            # Order by creation date (newest first)
            mentors = mentors.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(mentors, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            mentors_data = []
            for mentor in page_obj:
                # Try to get user details
                user_details = None
                try:
                    user_details = UserDetails.objects.filter(user=mentor.user).first()
                except:
                    try:
                        user_details = UserDetails.objects.filter(user_id=mentor.user.user_id).first()
                    except:
                        user_details = None
                
                mentor_data = {
                    'mentor_id': mentor.mentor_id,
                    'user_id': mentor.user.user_id,
                    'username': mentor.user.username,
                    'email': mentor.user.email,
                    'expertise': mentor.expertise or 'undefined',
                    'bio': mentor.bio or 'undefined',
                    'approved': mentor.approved,
                    'is_active': mentor.user.is_active,
                    'created_at': mentor.created_at.isoformat() if mentor.created_at else None,
                    # University student details
                    'university_student': {
                        'id': mentor.university_student.university_student_id if mentor.university_student else None,
                        'registration_number': mentor.university_student.registration_number if mentor.university_student else 'undefined',
                        'year_of_study': mentor.university_student.year_of_study if mentor.university_student else 'undefined',
                        'university': {
                            'id': mentor.university_student.university.university_id if mentor.university_student and mentor.university_student.university else None,
                            'name': mentor.university_student.university.name if mentor.university_student and mentor.university_student.university else 'undefined',
                            'district': mentor.university_student.university.district if mentor.university_student and mentor.university_student.university else 'undefined',
                        } if mentor.university_student and mentor.university_student.university else {'id': None, 'name': 'undefined', 'district': 'undefined'}
                    } if mentor.university_student else None,
                    # User details
                    'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                    'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                    'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                    'is_verified': user_details.is_verified if user_details else False,
                    'location': user_details.location if user_details and user_details.location else 'undefined',
                    'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                }
                mentors_data.append(mentor_data)
            
            return JsonResponse({
                'success': True,
                'mentors': mentors_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            print(f"Error fetching mentors: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch mentors: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_mentor_details(request, mentor_id):
    """Get detailed information about a specific mentor"""
    if request.method == 'GET':
        try:
            mentor = Mentors.objects.select_related(
                'user', 
                'user__user_type', 
                'university_student',
                'university_student__university',
                'university_student__faculty',
                'university_student__degree_program'
            ).get(mentor_id=mentor_id)
            
            # Try to get user details
            user_details = None
            try:
                user_details = UserDetails.objects.filter(user=mentor.user).first()
            except:
                try:
                    user_details = UserDetails.objects.filter(user_id=mentor.user.user_id).first()
                except:
                    user_details = None
            
            mentor_data = {
                'mentor_id': mentor.mentor_id,
                'user_id': mentor.user.user_id,
                'username': mentor.user.username,
                'email': mentor.user.email,
                'expertise': mentor.expertise or 'undefined',
                'bio': mentor.bio or 'undefined',
                'approved': mentor.approved,
                'is_active': mentor.user.is_active,
                'created_at': mentor.created_at.isoformat() if mentor.created_at else None,
                # University student details
                'university_student': {
                    'id': mentor.university_student.university_student_id if mentor.university_student else None,
                    'registration_number': mentor.university_student.registration_number if mentor.university_student else 'undefined',
                    'year_of_study': mentor.university_student.year_of_study if mentor.university_student else 'undefined',
                    'enrollment_date': mentor.university_student.enrollment_date.isoformat() if mentor.university_student and mentor.university_student.enrollment_date else 'undefined',
                    'status': mentor.university_student.status if mentor.university_student else 'undefined',
                    'university': {
                        'id': mentor.university_student.university.university_id if mentor.university_student and mentor.university_student.university else None,
                        'name': mentor.university_student.university.name if mentor.university_student and mentor.university_student.university else 'undefined',
                        'district': mentor.university_student.university.district if mentor.university_student and mentor.university_student.university else 'undefined',
                        'address': mentor.university_student.university.address if mentor.university_student and mentor.university_student.university else 'undefined',
                    } if mentor.university_student and mentor.university_student.university else {'id': None, 'name': 'undefined', 'district': 'undefined', 'address': 'undefined'},
                    'faculty': {
                        'id': mentor.university_student.faculty.faculty_id if mentor.university_student and mentor.university_student.faculty else None,
                        'name': mentor.university_student.faculty.name if mentor.university_student and mentor.university_student.faculty else 'undefined',
                    } if mentor.university_student and mentor.university_student.faculty else {'id': None, 'name': 'undefined'},
                    'degree_program': {
                        'id': mentor.university_student.degree_program.degree_program_id if mentor.university_student and mentor.university_student.degree_program else None,
                        'name': mentor.university_student.degree_program.title if mentor.university_student and mentor.university_student.degree_program else 'undefined',
                    } if mentor.university_student and mentor.university_student.degree_program else {'id': None, 'name': 'undefined'},
                } if mentor.university_student else None,
                # User details
                'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                'is_verified': user_details.is_verified if user_details else False,
                'location': user_details.location if user_details and user_details.location else 'undefined',
                'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                'updated_at': user_details.updated_at.isoformat() if user_details and user_details.updated_at else None,
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
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch mentor details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

# @csrf_exempt
# def toggle_mentor_approval(request, mentor_id):
#     """Toggle mentor approval status"""
#     if request.method == 'PUT':
#         try:
#             mentor = Mentors.objects.get(mentor_id=mentor_id)
#             mentor.approved = 1 if not mentor.approved else 0
#             mentor.save()
            
#             return JsonResponse({
#                 'success': True,
#                 'message': f'Mentor {"approved" if mentor.approved else "unapproved"} successfully',
#                 'approved': mentor.approved
#             })
            
#         except Mentors.DoesNotExist:
#             return JsonResponse({
#                 'success': False,
#                 'message': 'Mentor not found'
#             }, status=404)
#         except Exception as e:
#             return JsonResponse({
#                 'success': False,
#                 'message': f'Failed to update mentor approval: {str(e)}'
#             }, status=500)
    
#     return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

# @csrf_exempt
# def toggle_mentor_status(request, mentor_id):
#     """Toggle mentor active status"""
#     if request.method == 'PUT':
#         try:
#             mentor = Mentors.objects.select_related('user').get(mentor_id=mentor_id)
#             mentor.user.is_active = not mentor.user.is_active
#             mentor.user.save()
            
#             return JsonResponse({
#                 'success': True,
#                 'message': f'Mentor {"activated" if mentor.user.is_active else "deactivated"} successfully',
#                 'is_active': mentor.user.is_active
#             })
            
#         except Mentors.DoesNotExist:
#             return JsonResponse({
#                 'success': False,
#                 'message': 'Mentor not found'
#             }, status=404)
#         except Exception as e:
#             return JsonResponse({
#                 'success': False,
#                 'message': f'Failed to update mentor status: {str(e)}'
#             }, status=500)
    
#     return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_mentor(request, mentor_id):
    """Delete a mentor"""
    if request.method == 'DELETE':
        try:
            mentor = Mentors.objects.select_related('user').get(mentor_id=mentor_id)
            user = mentor.user
            username = user.username
            
            # Delete mentor record and user
            with transaction.atomic():
                mentor.delete()
                UserDetails.objects.filter(user=user).delete()
                user.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Mentor {username} deleted successfully'
            })
            
        except Mentors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Mentor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete mentor: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_mentor_statistics(request):
    """Get mentor statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get total counts by university
            university_counts = Mentors.objects.select_related('university_student__university').values('university_student__university__name').annotate(count=Count('university_student__university')).order_by('-count')
            
            # Get approved/unapproved counts
            approved_mentors = Mentors.objects.filter(approved=1).count()
            unapproved_mentors = Mentors.objects.filter(approved=0).count()
            
            # Get active/inactive counts
            active_mentors = Mentors.objects.filter(user__is_active=True).count()
            inactive_mentors = Mentors.objects.filter(user__is_active=False).count()
            
            # Get recent registrations (last 7 days)
            recent_registrations = Mentors.objects.filter(
                created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            # Get verified mentors count
            verified_mentors = 0
            try:
                verified_mentors = Mentors.objects.filter(user__userdetails__is_verified=True).count()
            except Exception as e:
                print(f"Error counting verified mentors: {str(e)}")
                verified_mentors = 0
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_mentors': Mentors.objects.count(),
                    'approved_mentors': approved_mentors,
                    'unapproved_mentors': unapproved_mentors,
                    'active_mentors': active_mentors,
                    'inactive_mentors': inactive_mentors,
                    'verified_mentors': verified_mentors,
                    'recent_registrations': recent_registrations,
                    'university_breakdown': list(university_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_mentor_filter_options(request):
    """Get filter options for mentors"""
    if request.method == 'GET':
        try:
            # Get universities that have mentors
            universities = Universities.objects.filter(
                universitystudents__mentors__isnull=False
            ).distinct().values('university_id', 'name').order_by('name')
            
            return JsonResponse({
                'success': True,
                'filter_options': {
                    'universities': list(universities)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch filter options: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_tutors(request):
    """Get all tutors with their details"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            university = request.GET.get('university', 'all')
            subject = request.GET.get('subject', 'all')
            rating_min = request.GET.get('rating_min', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query to get tutors with related data
            tutors = Tutors.objects.select_related(
                'user', 
                'user__user_type', 
                'university_student',
                'university_student__university'
            ).all()
            
            # Apply filters
            if search:
                tutors = tutors.filter(
                    Q(user__username__icontains=search) |
                    Q(user__email__icontains=search) |
                    Q(expertise__icontains=search) |
                    Q(university_student__university__name__icontains=search)
                )
                # Add search on UserDetails if possible
                try:
                    tutors = tutors.filter(
                        Q(user__username__icontains=search) |
                        Q(user__email__icontains=search) |
                        Q(expertise__icontains=search) |
                        Q(university_student__university__name__icontains=search) |
                        Q(user__userdetails__full_name__icontains=search)
                    )
                except:
                    pass
            
            if university != 'all':
                tutors = tutors.filter(university_student__university_id=university)
                
            if subject != 'all':
                tutors = tutors.filter(tutorsubjects__subject_id=subject).distinct()
                
            if rating_min:
                try:
                    min_rating = float(rating_min)
                    tutors = tutors.filter(rating__gte=min_rating)
                except:
                    pass
            
            # Order by rating (highest first), then by creation date
            tutors = tutors.order_by('-rating', '-created_at')
            
            # Pagination
            paginator = Paginator(tutors, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            tutors_data = []
            for tutor in page_obj:
                # Try to get user details
                user_details = None
                try:
                    user_details = UserDetails.objects.filter(user=tutor.user).first()
                except:
                    try:
                        user_details = UserDetails.objects.filter(user_id=tutor.user.user_id).first()
                    except:
                        user_details = None
                
                # Get tutor subjects
                tutor_subjects = TutorSubjects.objects.filter(tutor=tutor).select_related('subject')
                subjects_data = []
                for ts in tutor_subjects:
                    subjects_data.append({
                        'id': ts.subject.subject_id,
                        'name': ts.subject.subject_name,
                        'level': ts.level or 'All Levels'
                    })
                
                # Get average rating from TutorRatings
                ratings = TutorRatings.objects.filter(tutor=tutor)
                total_ratings = ratings.count()
                avg_rating = 0
                if total_ratings > 0:
                    total_score = 0
                    for rating in ratings:
                        try:
                            # Handle JSON rating field
                            rating_data = rating.rating
                            if isinstance(rating_data, dict):
                                total_score += rating_data.get('rating', 0)
                            elif isinstance(rating_data, (int, float)):
                                total_score += rating_data
                        except:
                            pass
                    avg_rating = round(total_score / total_ratings, 1) if total_ratings > 0 else 0
                
                tutor_data = {
                    'tutor_id': tutor.tutor_id,
                    'user_id': tutor.user.user_id,
                    'username': tutor.user.username,
                    'email': tutor.user.email,
                    'bio': tutor.bio or 'undefined',
                    'expertise': tutor.expertise or 'undefined',
                    'rating': float(tutor.rating) if tutor.rating else avg_rating,
                    'total_ratings': total_ratings,
                    'is_active': tutor.user.is_active,
                    'created_at': tutor.created_at.isoformat() if tutor.created_at else None,
                    # University student details
                    'university_student': {
                        'id': tutor.university_student.university_student_id if tutor.university_student else None,
                        'registration_number': tutor.university_student.registration_number if tutor.university_student else 'undefined',
                        'year_of_study': tutor.university_student.year_of_study if tutor.university_student else 'undefined',
                        'university': {
                            'id': tutor.university_student.university.university_id if tutor.university_student and tutor.university_student.university else None,
                            'name': tutor.university_student.university.name if tutor.university_student and tutor.university_student.university else 'undefined',
                            'district': tutor.university_student.university.district if tutor.university_student and tutor.university_student.university else 'undefined',
                        } if tutor.university_student and tutor.university_student.university else {'id': None, 'name': 'undefined', 'district': 'undefined'}
                    } if tutor.university_student else None,
                    # User details
                    'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                    'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                    'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                    'is_verified': user_details.is_verified if user_details else False,
                    'location': user_details.location if user_details and user_details.location else 'undefined',
                    'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                    # Subjects
                    'subjects': subjects_data,
                }
                tutors_data.append(tutor_data)
            
            return JsonResponse({
                'success': True,
                'tutors': tutors_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            })
            
        except Exception as e:
            print(f"Error fetching tutors: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch tutors: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_tutor_details(request, tutor_id):
    """Get detailed information about a specific tutor"""
    if request.method == 'GET':
        try:
            tutor = Tutors.objects.select_related(
                'user', 
                'user__user_type', 
                'university_student',
                'university_student__university',
                'university_student__faculty',
                'university_student__degree_program'
            ).get(tutor_id=tutor_id)
            
            # Try to get user details
            user_details = None
            try:
                user_details = UserDetails.objects.filter(user=tutor.user).first()
            except:
                try:
                    user_details = UserDetails.objects.filter(user_id=tutor.user.user_id).first()
                except:
                    user_details = None
            
            # Get tutor subjects with details
            tutor_subjects = TutorSubjects.objects.filter(tutor=tutor).select_related('subject')
            subjects_data = []
            for ts in tutor_subjects:
                subjects_data.append({
                    'tutor_subject_id': ts.tutor_subject_id,
                    'subject': {
                        'id': ts.subject.subject_id,
                        'name': ts.subject.subject_name,
                        'code': getattr(ts.subject, 'subject_code', 'undefined')
                    },
                    'level': ts.level or 'All Levels'
                })
            
            # Get detailed ratings
            ratings = TutorRatings.objects.filter(tutor=tutor).select_related('rater_user').order_by('-created_at')
            ratings_data = []
            total_score = 0
            for rating in ratings:
                try:
                    rating_value = 0
                    rating_comment = ''
                    
                    if isinstance(rating.rating, dict):
                        rating_value = rating.rating.get('rating', 0)
                        rating_comment = rating.rating.get('comment', '')
                    elif isinstance(rating.rating, (int, float)):
                        rating_value = rating.rating
                    
                    total_score += rating_value
                    
                    ratings_data.append({
                        'rating_id': rating.rating_id,
                        'rater': {
                            'id': rating.rater_user.user_id,
                            'username': rating.rater_user.username
                        },
                        'rating': rating_value,
                        'comment': rating_comment,
                        'created_at': rating.created_at.isoformat() if rating.created_at else None
                    })
                except:
                    pass
            
            avg_rating = round(total_score / len(ratings_data), 1) if ratings_data else 0
            
            tutor_data = {
                'tutor_id': tutor.tutor_id,
                'user_id': tutor.user.user_id,
                'username': tutor.user.username,
                'email': tutor.user.email,
                'bio': tutor.bio or 'undefined',
                'expertise': tutor.expertise or 'undefined',
                'rating': float(tutor.rating) if tutor.rating else avg_rating,
                'total_ratings': len(ratings_data),
                'is_active': tutor.user.is_active,
                'created_at': tutor.created_at.isoformat() if tutor.created_at else None,
                # University student details
                'university_student': {
                    'id': tutor.university_student.university_student_id if tutor.university_student else None,
                    'registration_number': tutor.university_student.registration_number if tutor.university_student else 'undefined',
                    'year_of_study': tutor.university_student.year_of_study if tutor.university_student else 'undefined',
                    'enrollment_date': tutor.university_student.enrollment_date.isoformat() if tutor.university_student and tutor.university_student.enrollment_date else 'undefined',
                    'status': tutor.university_student.status if tutor.university_student else 'undefined',
                    'university': {
                        'id': tutor.university_student.university.university_id if tutor.university_student and tutor.university_student.university else None,
                        'name': tutor.university_student.university.name if tutor.university_student and tutor.university_student.university else 'undefined',
                        'district': tutor.university_student.university.district if tutor.university_student and tutor.university_student.university else 'undefined',
                        'address': tutor.university_student.university.address if tutor.university_student and tutor.university_student.university else 'undefined',
                    } if tutor.university_student and tutor.university_student.university else {'id': None, 'name': 'undefined', 'district': 'undefined', 'address': 'undefined'},
                    'faculty': {
                        'id': tutor.university_student.faculty.faculty_id if tutor.university_student and tutor.university_student.faculty else None,
                        'name': tutor.university_student.faculty.name if tutor.university_student and tutor.university_student.faculty else 'undefined',
                    } if tutor.university_student and tutor.university_student.faculty else {'id': None, 'name': 'undefined'},
                    'degree_program': {
                        'id': tutor.university_student.degree_program.degree_program_id if tutor.university_student and tutor.university_student.degree_program else None,
                        'name': tutor.university_student.degree_program.title if tutor.university_student and tutor.university_student.degree_program else 'undefined',
                    } if tutor.university_student and tutor.university_student.degree_program else {'id': None, 'name': 'undefined'},
                } if tutor.university_student else None,
                # User details
                'full_name': user_details.full_name if user_details and user_details.full_name else 'undefined',
                'contact_number': user_details.contact_number if user_details and user_details.contact_number else 'undefined',
                'profile_picture': user_details.profile_picture if user_details and user_details.profile_picture else 'undefined',
                'is_verified': user_details.is_verified if user_details else False,
                'location': user_details.location if user_details and user_details.location else 'undefined',
                'gender': user_details.gender if user_details and user_details.gender else 'undefined',
                'updated_at': user_details.updated_at.isoformat() if user_details and user_details.updated_at else None,
                # Subjects and ratings
                'subjects': subjects_data,
                'ratings': ratings_data,
            }
            
            return JsonResponse({
                'success': True,
                'tutor': tutor_data
            })
            
        except Tutors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Tutor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch tutor details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def toggle_tutor_status(request, tutor_id):
    """Toggle tutor active status"""
    if request.method == 'PUT':
        try:
            tutor = Tutors.objects.select_related('user').get(tutor_id=tutor_id)
            tutor.user.is_active = not tutor.user.is_active
            tutor.user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Tutor {"activated" if tutor.user.is_active else "deactivated"} successfully',
                'is_active': tutor.user.is_active
            })
            
        except Tutors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Tutor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update tutor status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_tutor(request, tutor_id):
    """Delete a tutor"""
    if request.method == 'DELETE':
        try:
            tutor = Tutors.objects.select_related('user').get(tutor_id=tutor_id)
            user = tutor.user
            username = user.username
            
            # Delete tutor record and user
            with transaction.atomic():
                # Delete related tutor subjects and ratings
                TutorSubjects.objects.filter(tutor=tutor).delete()
                TutorRatings.objects.filter(tutor=tutor).delete()
                tutor.delete()
                UserDetails.objects.filter(user=user).delete()
                user.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Tutor {username} deleted successfully'
            })
            
        except Tutors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Tutor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete tutor: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_tutor_statistics(request):
    """Get tutor statistics for the dashboard"""
    if request.method == 'GET':
        try:
            # Get total counts by university
            university_counts = Tutors.objects.select_related('university_student__university').values('university_student__university__name').annotate(count=Count('university_student__university')).order_by('-count')
            
            # Get counts by subject
            subject_counts = TutorSubjects.objects.select_related('subject').values('subject__subject_name').annotate(count=Count('subject')).order_by('-count')[:10]
            
            # Get active/inactive counts
            active_tutors = Tutors.objects.filter(user__is_active=True).count()
            inactive_tutors = Tutors.objects.filter(user__is_active=False).count()
            
            # Get recent registrations (last 7 days)
            recent_registrations = Tutors.objects.filter(
                created_at__gte=timezone.now() - timezone.timedelta(days=7)
            ).count()
            
            # Get verified tutors count
            verified_tutors = 0
            try:
                verified_tutors = Tutors.objects.filter(user__userdetails__is_verified=True).count()
            except Exception as e:
                print(f"Error counting verified tutors: {str(e)}")
                verified_tutors = 0
            
            # Get average rating
            tutors_with_ratings = Tutors.objects.filter(rating__isnull=False)
            avg_rating = 0
            if tutors_with_ratings.exists():
                total_rating = sum([float(t.rating) for t in tutors_with_ratings])
                avg_rating = round(total_rating / tutors_with_ratings.count(), 1)
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_tutors': Tutors.objects.count(),
                    'active_tutors': active_tutors,
                    'inactive_tutors': inactive_tutors,
                    'verified_tutors': verified_tutors,
                    'recent_registrations': recent_registrations,
                    'average_rating': avg_rating,
                    'total_ratings': TutorRatings.objects.count(),
                    'university_breakdown': list(university_counts),
                    'subject_breakdown': list(subject_counts)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_tutor_filter_options(request):
    """Get filter options for tutors"""
    if request.method == 'GET':
        try:
            # Get universities that have tutors
            universities = Universities.objects.filter(
                universitystudents__tutors__isnull=False
            ).distinct().values('university_id', 'name').order_by('name')
            
            # Get subjects that have tutors
            subjects = AlSubjects.objects.filter(
                tutorsubjects__isnull=False
            ).distinct().values('subject_id', 'subject_name').order_by('subject_name')
            
            return JsonResponse({
                'success': True,
                'filter_options': {
                    'universities': list(universities),
                    'subjects': list(subjects)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch filter options: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_events(request):
    """Get all events from universities and companies"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            event_type = request.GET.get('event_type', 'all')  # university, company, all
            category = request.GET.get('category', 'all')
            status = request.GET.get('status', 'all')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            events_data = []
            
            # Get University Events
            if event_type == 'all' or event_type == 'university':
                university_events = UniversityEvents.objects.select_related('university').all()
                
                # Apply filters for university events
                if search:
                    university_events = university_events.filter(
                        Q(title__icontains=search) | 
                        Q(description__icontains=search) |
                        Q(university__name__icontains=search)
                    )
                
                if category != 'all':
                    university_events = university_events.filter(event_type=category)
                
                for event in university_events:
                    events_data.append({
                        'event_id': event.event_id,
                        'title': event.title or 'undefined',
                        'description': event.description or 'undefined',
                        'event_type': event.event_type or 'undefined',
                        'event_date': event.event_date.isoformat() if event.event_date else None,
                        'location': event.location or 'undefined',
                        'organizer_type': 'university',
                        'organizer_name': event.university.name if event.university else 'undefined',
                        'organizer_id': event.university.university_id if event.university else None,
                        'created_at': event.created_at.isoformat() if event.created_at else None,
                        'status': 'active',  # University events don't have explicit status
                        'participants': 0,  # University events don't track participants
                        'max_participants': None
                    })
            
            # Get Company Events
            if event_type == 'all' or event_type == 'company':
                company_events = CompanyEvents.objects.select_related('company').all()
                
                # Apply filters for company events
                if search:
                    company_events = company_events.filter(
                        Q(title__icontains=search) | 
                        Q(description__icontains=search) |
                        Q(company__name__icontains=search)
                    )
                
                if category != 'all':
                    company_events = company_events.filter(event_type=category)
                
                if status != 'all':
                    if status == 'active':
                        company_events = company_events.filter(is_active=True)
                    elif status == 'inactive':
                        company_events = company_events.filter(is_active=False)
                
                for event in company_events:
                    # Get participant count
                    participant_count = 0
                    try:
                        from apps.companies.models import CompanyEventRegistrations
                        participant_count = CompanyEventRegistrations.objects.filter(
                            event=event, 
                            status='registered'
                        ).count()
                    except:
                        pass
                    
                    events_data.append({
                        'event_id': event.event_id,
                        'title': event.title or 'undefined',
                        'description': event.description or 'undefined',
                        'event_type': event.event_type or 'undefined',
                        'event_date': event.event_date.isoformat() if event.event_date else None,
                        'end_date': event.end_date.isoformat() if event.end_date else None,
                        'location': event.location or 'undefined',
                        'is_virtual': event.is_virtual,
                        'meeting_link': event.meeting_link or 'undefined',
                        'organizer_type': 'company',
                        'organizer_name': event.company.name if event.company else 'undefined',
                        'organizer_id': event.company.company_id if event.company else None,
                        'created_at': event.created_at.isoformat() if event.created_at else None,
                        'status': 'active' if event.is_active else 'inactive',
                        'participants': participant_count,
                        'max_participants': event.max_participants,
                        'registration_deadline': event.registration_deadline.isoformat() if event.registration_deadline else None,
                        'contact_email': event.contact_email or 'undefined',
                        'contact_phone': event.contact_phone or 'undefined'
                    })
            
            # Sort by creation date (newest first)
            events_data.sort(key=lambda x: x['created_at'] or '', reverse=True)
            
            # Manual pagination since we're combining two querysets
            total_items = len(events_data)
            start_index = (page - 1) * per_page
            end_index = start_index + per_page
            paginated_events = events_data[start_index:end_index]
            
            total_pages = (total_items + per_page - 1) // per_page
            
            return JsonResponse({
                'success': True,
                'events': paginated_events,
                'pagination': {
                    'current_page': page,
                    'total_pages': total_pages,
                    'total_items': total_items,
                    'has_next': page < total_pages,
                    'has_previous': page > 1
                }
            })
            
        except Exception as e:
            print(f"Error fetching events: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch events: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_event_details(request, event_id):
    """Get detailed information about a specific event"""
    if request.method == 'GET':
        try:
            # Try to get from university events first
            try:
                event = UniversityEvents.objects.select_related('university').get(event_id=event_id)
                event_data = {
                    'event_id': event.event_id,
                    'title': event.title or 'undefined',
                    'description': event.description or 'undefined',
                    'event_type': event.event_type or 'undefined',
                    'event_date': event.event_date.isoformat() if event.event_date else None,
                    'location': event.location or 'undefined',
                    'organizer_type': 'university',
                    'organizer': {
                        'id': event.university.university_id if event.university else None,
                        'name': event.university.name if event.university else 'undefined',
                        'contact_email': event.university.contact_email if event.university else 'undefined',
                        'phone_number': event.university.phone_number if event.university else 'undefined',
                        'district': event.university.district if event.university else 'undefined'
                    },
                    'created_at': event.created_at.isoformat() if event.created_at else None,
                    'status': 'active',
                    'participants': 0,
                    'max_participants': None,
                    'is_virtual': False,
                    'meeting_link': None,
                    'registration_deadline': None
                }
                return JsonResponse({'success': True, 'event': event_data})
            except UniversityEvents.DoesNotExist:
                pass
            
            # Try to get from company events
            try:
                event = CompanyEvents.objects.select_related('company').get(event_id=event_id)
                
                # Get participant count and registrations
                participant_count = 0
                registrations = []
                try:
                    from apps.companies.models import CompanyEventRegistrations
                    registrations_qs = CompanyEventRegistrations.objects.filter(
                        event=event
                    ).select_related('user')
                    participant_count = registrations_qs.filter(status='registered').count()
                    
                    for reg in registrations_qs:
                        registrations.append({
                            'registration_id': reg.registration_id,
                            'user_id': reg.user.user_id,
                            'username': reg.user.username,
                            'email': reg.user.email,
                            'registration_date': reg.registration_date.isoformat() if reg.registration_date else None,
                            'status': reg.status,
                            'notes': reg.notes
                        })
                except:
                    pass
                
                event_data = {
                    'event_id': event.event_id,
                    'title': event.title or 'undefined',
                    'description': event.description or 'undefined',
                    'event_type': event.event_type or 'undefined',
                    'event_date': event.event_date.isoformat() if event.event_date else None,
                    'end_date': event.end_date.isoformat() if event.end_date else None,
                    'location': event.location or 'undefined',
                    'is_virtual': event.is_virtual,
                    'meeting_link': event.meeting_link or 'undefined',
                    'max_participants': event.max_participants,
                    'registration_deadline': event.registration_deadline.isoformat() if event.registration_deadline else None,
                    'contact_email': event.contact_email or 'undefined',
                    'contact_phone': event.contact_phone or 'undefined',
                    'organizer_type': 'company',
                    'organizer': {
                        'id': event.company.company_id if event.company else None,
                        'name': event.company.name if event.company else 'undefined',
                        'contact_email': event.company.contact_email if event.company else 'undefined',
                        'contact_phone': event.company.contact_phone if event.company else 'undefined',
                        'district': event.company.district if event.company else 'undefined',
                        'website': event.company.website if event.company else 'undefined'
                    },
                    'created_at': event.created_at.isoformat() if event.created_at else None,
                    'status': 'active' if event.is_active else 'inactive',
                    'participants': participant_count,
                    'registrations': registrations
                }
                return JsonResponse({'success': True, 'event': event_data})
            except CompanyEvents.DoesNotExist:
                pass
            
            return JsonResponse({
                'success': False,
                'message': 'Event not found'
            }, status=404)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch event details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def toggle_event_status(request, event_id):
    """Toggle event active status (only for company events)"""
    if request.method == 'PUT':
        try:
            # Only company events have status toggle functionality
            event = CompanyEvents.objects.get(event_id=event_id)
            event.is_active = not event.is_active
            event.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Event {"activated" if event.is_active else "deactivated"} successfully',
                'is_active': event.is_active
            })
            
        except CompanyEvents.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Company event not found or status toggle not supported for this event type'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update event status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)

@csrf_exempt
def delete_event(request, event_id):
    """Delete an event"""
    if request.method == 'DELETE':
        try:
            # Try to delete from university events first
            try:
                event = UniversityEvents.objects.get(event_id=event_id)
                event_title = event.title
                event.delete()
                return JsonResponse({
                    'success': True,
                    'message': f'University event "{event_title}" deleted successfully'
                })
            except UniversityEvents.DoesNotExist:
                pass
            
            # Try to delete from company events
            try:
                event = CompanyEvents.objects.get(event_id=event_id)
                event_title = event.title
                
                # Delete related registrations first
                with transaction.atomic():
                    try:
                        from apps.companies.models import CompanyEventRegistrations
                        CompanyEventRegistrations.objects.filter(event=event).delete()
                    except:
                        pass
                    event.delete()
                
                return JsonResponse({
                    'success': True,
                    'message': f'Company event "{event_title}" deleted successfully'
                })
            except CompanyEvents.DoesNotExist:
                pass
            
            return JsonResponse({
                'success': False,
                'message': 'Event not found'
            }, status=404)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete event: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)

@csrf_exempt
def get_event_statistics(request):
    """Get event statistics for the dashboard"""
    if request.method == 'GET':
        try:
            from django.utils import timezone
            from datetime import datetime
            
            # Get current datetime
            now = timezone.now()
            
            # Count university events
            university_events_count = UniversityEvents.objects.count()
            
            # Count company events
            company_events_count = CompanyEvents.objects.count()
            
            # Count active company events (events that haven't expired and are active)
            active_company_events = CompanyEvents.objects.filter(
                is_active=True,
                event_date__gte=now.date()
            ).count()
            
            # Count inactive/expired company events
            inactive_company_events = CompanyEvents.objects.filter(
                Q(is_active=False) | Q(event_date__lt=now.date())
            ).count()
            
            # Count active university events (events that haven't expired)
            active_university_events = UniversityEvents.objects.filter(
                event_date__gte=now.date()
            ).count()
            
            # Count expired university events
            expired_university_events = UniversityEvents.objects.filter(
                event_date__lt=now.date()
            ).count()
            
            # Total active and inactive events
            total_active_events = active_company_events + active_university_events
            total_inactive_events = inactive_company_events + expired_university_events
            
            return JsonResponse({
                'success': True,
                'statistics': {
                    'total_events': university_events_count + company_events_count,
                    'university_events': university_events_count,
                    'company_events': company_events_count,
                    'active_events': total_active_events,
                    'inactive_events': total_inactive_events,
                    'active_company_events': active_company_events,
                    'inactive_company_events': inactive_company_events,
                    'active_university_events': active_university_events,
                    'expired_university_events': expired_university_events
                }
            })
            
        except Exception as e:
            print(f"Error fetching event statistics: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_event_filter_options(request):
    """Get filter options for events"""
    if request.method == 'GET':
        try:
            # Get unique event types from both university and company events
            university_event_types = UniversityEvents.objects.exclude(
                event_type__isnull=True
            ).exclude(
                event_type__exact=''
            ).values_list('event_type', flat=True).distinct()
            
            company_event_types = CompanyEvents.objects.exclude(
                event_type__isnull=True
            ).exclude(
                event_type__exact=''
            ).values_list('event_type', flat=True).distinct()
            
            # Combine and remove duplicates
            all_event_types = list(set(list(university_event_types) + list(company_event_types)))
            all_event_types.sort()
            
            # Get universities with events
            universities = Universities.objects.filter(
                universityevents__isnull=False
            ).distinct().values('university_id', 'name').order_by('name')
            
            # Get companies with events
            companies = Companies.objects.filter(
                companyevents__isnull=False
            ).distinct().values('company_id', 'name').order_by('name')
            
            return JsonResponse({
                'success': True,
                'filter_options': {
                    'event_types': all_event_types,
                    'organizer_types': ['university', 'company'],
                    'universities': list(universities),
                    'companies': list(companies)
                }
            })
            
        except Exception as e:
            print(f"Error fetching filter options: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch filter options: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)