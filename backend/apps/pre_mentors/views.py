from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from django.core.files.storage import default_storage
from django.conf import settings
from datetime import datetime, timedelta, date
import json
import calendar
import os

from .models import PreMentors, PreMentorAvailability
from apps.accounts.models import Users, UserDetails
from apps.university_students.models import UniversityStudents
from apps.mentoring.models import Mentors

@csrf_exempt
def pre_mentor_dashboard(request):
    """Get simplified pre-mentor dashboard data"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Use the mentor foreign key relationship if available
            mentor_application = pre_mentor.mentor or Mentors.objects.filter(user_id=user_id).first()
            
            mentor_status = {
                'has_applied': pre_mentor.applied == 1,
                'approved': mentor_application.approved if mentor_application else 0,
                'application_date': pre_mentor.application_date
            }
            
            # Generate dynamic notice based on mentor status
            notice = {}
            if pre_mentor.applied == 0:
                notice = {
                    'type': 'info',
                    'title': 'Ready to Become a Mentor?',
                    'message': 'Submit your mentor application to start offering mentoring services to university students. Share your expertise and help others succeed!',
                    'action': 'Apply for Mentor Status',
                    'action_url': '/pre-mentor/apply-mentor'
                }
            elif pre_mentor.applied == 1 and mentor_application and mentor_application.approved == 0:
                notice = {
                    'type': 'warning',
                    'title': 'Mentor Application Under Review',
                    'message': 'Your mentor application has been submitted and is currently being reviewed by your university. We will notify you once a decision is made.',
                    'action': None,
                    'action_url': None
                }
            elif pre_mentor.applied == 1 and mentor_application and mentor_application.approved == 1:
                notice = {
                    'type': 'success',
                    'title': 'Congratulations! You are Now a Mentor!',
                    'message': 'Your mentor application has been approved! Please log out and log back in to access your mentor dashboard and start mentoring students.',
                    'action': 'Logout and Login as Mentor',
                    'action_url': '/logout'
                }
            elif pre_mentor.applied == 1 and mentor_application and mentor_application.approved == -1:
                notice = {
                    'type': 'error',
                    'title': 'Mentor Application Status',
                    'message': 'Unfortunately, your mentor application was not approved at this time. Please review your application and try again.',
                    'action': 'Review Application',
                    'action_url': '/pre-mentor/application'
                }
            
            # Simplified stats (no more earnings/sessions data or other unnecessary fields)
            basic_stats = {
                'status': pre_mentor.status,
                'applied': pre_mentor.applied,
                'application_date': pre_mentor.application_date.strftime('%Y-%m-%d') if pre_mentor.application_date else None
            }
            
            dashboard_data = {
                'success': True,
                'pre_mentor_info': {
                    'id': pre_mentor.pre_mentor_id,
                    'user_id': pre_mentor.user_id,
                    'status': pre_mentor.status,
                    'applied': pre_mentor.applied,
                    'application_date': pre_mentor.application_date.strftime('%Y-%m-%d') if pre_mentor.application_date else None
                },
                'notice': notice,
                'mentor_status': mentor_status,
                'stats': basic_stats
            }
            
            return JsonResponse(dashboard_data, status=200)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching dashboard data: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)

@csrf_exempt
def pre_mentor_profile(request):
    """Get or update pre-mentor profile"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
                user_details = UserDetails.objects.get(user_id=user_id)
                uni_student = pre_mentor.university_student
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            except UserDetails.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'User details not found'
                }, status=404)
            
            return JsonResponse({
                'success': True,
                'profile': {
                    'pre_mentor_id': pre_mentor.pre_mentor_id,
                    'full_name': user_details.full_name,
                    'email': pre_mentor.user.email,
                    'contact_number': user_details.contact_number or '',
                    'bio': user_details.bio or '',
                    'location': user_details.location or '',
                    'profile_picture': user_details.profile_picture or '',
                    'university_info': {
                        'university_id': uni_student.university_id,
                        'faculty_id': uni_student.faculty_id,
                        'degree_program_id': uni_student.degree_program_id,
                        'year_of_study': uni_student.year_of_study,
                        'registration_number': uni_student.registration_number
                    },
                    'is_verified': user_details.is_verified,
                    'status': pre_mentor.status,
                    'applied': pre_mentor.applied
                }
            })
            
        except Exception as e:
            print(f"Get pre-mentor profile error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Profile fetch failed: {str(e)}'
            }, status=500)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
                user_details = UserDetails.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Update user details
            user_details.full_name = data.get('full_name', user_details.full_name)
            user_details.bio = data.get('bio', user_details.bio)
            user_details.contact_number = data.get('contact_number', user_details.contact_number)
            user_details.location = data.get('location', user_details.location)
            user_details.updated_at = timezone.now()
            user_details.save()
            
            # Update pre-mentor specific details (only status if needed)
            if 'status' in data:
                pre_mentor.status = data.get('status', pre_mentor.status)
            pre_mentor.updated_at = timezone.now()
            pre_mentor.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully'
            })
            
        except Exception as e:
            print(f"Update pre-mentor profile error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Profile update failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET and POST methods allowed'
    }, status=405)

@csrf_exempt
def pre_mentor_sessions(request):
    """Get pre-mentor tutoring sessions - Disabled as sessions functionality was removed"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Return empty sessions data since sessions functionality was removed
            return JsonResponse({
                'success': True,
                'sessions': [],
                'stats': {
                    'total_sessions': 0,
                    'completed_sessions': 0,
                    'upcoming_sessions': 0,
                    'cancelled_sessions': 0
                },
                'message': 'Sessions functionality has been disabled'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Sessions fetch failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)

@csrf_exempt
def pre_mentor_earnings(request):
    """Get pre-mentor earnings data - Disabled as earnings functionality was removed"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Return basic earnings data from pre_mentor profile (no detailed tracking)
            return JsonResponse({
                'success': True,
                'earnings': [],
                'totals': {
                    'total_paid': 0.0,
                    'total_pending': 0.0,
                    'total_earnings': 0.0
                },
                'monthly_stats': {},
                'message': 'Detailed earnings tracking has been disabled'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Earnings fetch failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)

@csrf_exempt
def pre_mentor_availability(request):
    """Get or update pre-mentor availability"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Get availability slots
            availability = PreMentorAvailability.objects.filter(
                pre_mentor=pre_mentor, 
                is_active=True
            ).order_by('day_of_week', 'start_time')
            
            availability_data = []
            days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            
            for slot in availability:
                availability_data.append({
                    'availability_id': slot.availability_id,
                    'day_of_week': slot.day_of_week,
                    'day_name': days[slot.day_of_week],
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M')
                })
            
            return JsonResponse({
                'success': True,
                'availability': availability_data,
                'status': pre_mentor.status
            })
            
        except Exception as e:
            print(f"Get pre-mentor availability error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Availability fetch failed: {str(e)}'
            }, status=500)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            availability_slots = data.get('availability_slots', [])
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Update availability status - no longer needed, just save updated_at
            pre_mentor.save()
            
            # Delete existing availability slots
            PreMentorAvailability.objects.filter(pre_mentor=pre_mentor).delete()
            
            # Create new availability slots
            for slot in availability_slots:
                PreMentorAvailability.objects.create(
                    pre_mentor=pre_mentor,
                    day_of_week=slot['day_of_week'],
                    start_time=slot['start_time'],
                    end_time=slot['end_time'],
                    is_active=True
                )
            
            return JsonResponse({
                'success': True,
                'message': 'Availability updated successfully'
            })
            
        except Exception as e:
            print(f"Update pre-mentor availability error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Availability update failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET and POST methods allowed'
    }, status=405)

@csrf_exempt
def pre_mentor_settings(request):
    """Get or update pre-mentor settings"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
                user_details = UserDetails.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            return JsonResponse({
                'success': True,
                'settings': {
                    'status': pre_mentor.status,
                    'email_notifications': True,  # Default setting
                    'sms_notifications': False,   # Default setting
                    'auto_accept_bookings': False # Default setting
                }
            })
            
        except Exception as e:
            print(f"Get pre-mentor settings error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Settings fetch failed: {str(e)}'
            }, status=500)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Update settings (only status is editable now)
            if 'status' in data:
                pre_mentor.status = data.get('status', pre_mentor.status)
            pre_mentor.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Settings updated successfully'
            })
            
        except Exception as e:
            print(f"Update pre-mentor settings error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Settings update failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET and POST methods allowed'
    }, status=405)


@csrf_exempt
def request_mentor_status(request):
    """Handle pre-mentor request to become mentor"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            # Get pre-mentor
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Check if already applied for mentor status
            from apps.mentoring.models import Mentors
            existing_mentor = Mentors.objects.filter(
                user_id=user_id,
                university_student=pre_mentor.university_student
            ).first()
            
            if existing_mentor:
                status_text = "approved" if existing_mentor.approved == 1 else "pending approval"
                return JsonResponse({
                    'success': False,
                    'message': f'You have already applied for mentor status. Current status: {status_text}'
                }, status=400)
            
            # Create mentor request (with approved=0 for pending)
            new_mentor = Mentors.objects.create(
                user=pre_mentor.user,
                university_student=pre_mentor.university_student,
                expertise="General Mentoring",
                bio=f"Pre-mentor approved to become a mentor. Skills: {pre_mentor.skills or 'General academic support'}.",
                approved=0,  # Pending approval
                created_at=timezone.now()
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Mentor application submitted successfully! Your application is now pending university approval.',
                'mentor_id': new_mentor.mentor_id
            })
            
        except Exception as e:
            print(f"Mentor request error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to submit mentor application: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def check_mentor_status(request):
    """Check pre-mentor application status based on the new system"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            # Get pre-mentor record to check applied status
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Get corresponding mentor record using foreign key relationship
            mentor_record = pre_mentor.mentor
            
            if not mentor_record:
                # Fallback: try to find by user_id if relationship not set
                from apps.mentoring.models import Mentors
                mentor_record = Mentors.objects.filter(user_id=user_id).first()
                
                if mentor_record:
                    # Set the relationship for future use
                    pre_mentor.mentor = mentor_record
                    pre_mentor.save()
                else:
                    return JsonResponse({
                        'success': False,
                        'message': 'Mentor record not found. Please logout and login again.'
                    }, status=404)
            
            # Check status based on applied field in pre_mentor and approved field in mentor
            if pre_mentor.applied == 0:
                # Not applied yet - show apply button
                return JsonResponse({
                    'success': True,
                    'has_applied': False,
                    'can_apply': True,
                    'applied': 0,
                    'approved': mentor_record.approved,
                    'message': 'You can apply to become a mentor'
                })
            elif pre_mentor.applied == 1 and mentor_record.approved == 0:
                # Applied but pending approval
                return JsonResponse({
                    'success': True,
                    'has_applied': True,
                    'can_apply': False,
                    'applied': 1,
                    'approved': 0,
                    'approval_status': 'pending',
                    'applied_at': pre_mentor.application_date,
                    'mentor_id': mentor_record.mentor_id,
                    'message': 'Mentor application status: pending'
                })
            elif pre_mentor.applied == 1 and mentor_record.approved == 1:
                # Applied and approved - now a mentor
                return JsonResponse({
                    'success': True,
                    'has_applied': True,
                    'can_apply': False,
                    'applied': 1,
                    'approved': 1,
                    'approval_status': 'approved',
                    'applied_at': pre_mentor.application_date,
                    'mentor_id': mentor_record.mentor_id,
                    'message': 'Congratulations! You are now an approved mentor'
                })
            else:
                # Applied but rejected
                return JsonResponse({
                    'success': True,
                    'has_applied': True,
                    'can_apply': True,  # Can reapply
                    'applied': 1,
                    'approved': -1,
                    'approval_status': 'rejected',
                    'applied_at': pre_mentor.application_date,
                    'mentor_id': mentor_record.mentor_id,
                    'message': 'Your application was rejected. You can apply again.'
                })
            
        except Exception as e:
            print(f"Check mentor status error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to check mentor status: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)
@csrf_exempt
def get_mentor_application_data(request):
    """Get auto-filled data for mentor application form"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            try:
                # Get pre-mentor and related data
                pre_mentor = PreMentors.objects.get(user_id=user_id)
                user_details = UserDetails.objects.get(user_id=user_id)
                uni_student = pre_mentor.university_student
                user = pre_mentor.user
                
                # Get university and program names
                from apps.universities.models import Universities
                from apps.university_programs.models import DegreePrograms
                
                university = Universities.objects.get(university_id=uni_student.university_id)
                degree_program = DegreePrograms.objects.get(degree_program_id=uni_student.degree_program_id)
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'registration_number': uni_student.registration_number,
                        'academic_year': uni_student.year_of_study,
                        'student_email': user.email,
                        'degree_program': degree_program.title,
                        'university_name': university.name,
                        'full_name': user_details.full_name,
                        'contact_number': user_details.contact_number or '',
                        'skills': pre_mentor.skills or '',
                        'recommendation': pre_mentor.recommendation or '',
                        'status': pre_mentor.status
                    }
                })
                
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'Error fetching data: {str(e)}'
                }, status=500)
                
        except Exception as e:
            print(f"Get mentor application data error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch application data: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def submit_mentor_application(request):
    """Submit mentor application - updates pre_mentor fields and mentor bio"""
    if request.method == 'POST':
        try:
            # Handle FormData (not JSON) when files are involved
            user_id = request.POST.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)

            # Get pre-mentor record
            try:
                pre_mentor = PreMentors.objects.get(user_id=user_id)
            except PreMentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Pre-mentor not found'
                }, status=404)
            
            # Check if already applied
            if pre_mentor.applied == 1:
                return JsonResponse({
                    'success': False,
                    'message': 'You have already submitted a mentor application'
                }, status=400)

            # Get form data from FormData
            recommendation = request.POST.get('recommendation', '')
            skills = request.POST.get('skills', '')
            
            # Get uploaded files
            nic_file = request.FILES.get('nic_file')
            student_id_file = request.FILES.get('student_id_file')
            recommendation_letter_file = request.FILES.get('recommendation_letter_file')

            # Handle file uploads and save paths
            file_paths = {}
            
            if nic_file:
                # Create directory if it doesn't exist
                nic_dir = os.path.join(settings.MEDIA_ROOT, 'mentor_applications', str(user_id), 'documents')
                os.makedirs(nic_dir, exist_ok=True)
                
                # Save NIC file
                nic_filename = f"nic_{user_id}_{int(timezone.now().timestamp())}.{nic_file.name.split('.')[-1]}"
                nic_path = os.path.join(nic_dir, nic_filename)
                
                with open(nic_path, 'wb+') as destination:
                    for chunk in nic_file.chunks():
                        destination.write(chunk)
                
                file_paths['nic_photo'] = os.path.join('mentor_applications', str(user_id), 'documents', nic_filename)
            
            if student_id_file:
                # Create directory if it doesn't exist
                student_id_dir = os.path.join(settings.MEDIA_ROOT, 'mentor_applications', str(user_id), 'documents')
                os.makedirs(student_id_dir, exist_ok=True)
                
                # Save Student ID file
                student_id_filename = f"student_id_{user_id}_{int(timezone.now().timestamp())}.{student_id_file.name.split('.')[-1]}"
                student_id_path = os.path.join(student_id_dir, student_id_filename)
                
                with open(student_id_path, 'wb+') as destination:
                    for chunk in student_id_file.chunks():
                        destination.write(chunk)
                
                file_paths['student_id_photo'] = os.path.join('mentor_applications', str(user_id), 'documents', student_id_filename)
            
            if recommendation_letter_file:
                # Create directory if it doesn't exist
                rec_dir = os.path.join(settings.MEDIA_ROOT, 'mentor_applications', str(user_id), 'documents')
                os.makedirs(rec_dir, exist_ok=True)
                
                # Save Recommendation Letter file
                rec_filename = f"recommendation_{user_id}_{int(timezone.now().timestamp())}.{recommendation_letter_file.name.split('.')[-1]}"
                rec_path = os.path.join(rec_dir, rec_filename)
                
                with open(rec_path, 'wb+') as destination:
                    for chunk in recommendation_letter_file.chunks():
                        destination.write(chunk)
                
                file_paths['recommendation_letter'] = os.path.join('mentor_applications', str(user_id), 'documents', rec_filename)

            # Update pre-mentor record with application data
            pre_mentor.applied = 1
            pre_mentor.recommendation = recommendation
            pre_mentor.skills = skills
            pre_mentor.nic_photo = file_paths.get('nic_photo', '')
            pre_mentor.student_id_photo = file_paths.get('student_id_photo', '')
            pre_mentor.recommendation_letter = file_paths.get('recommendation_letter', '')
            pre_mentor.application_date = timezone.now()
            pre_mentor.updated_at = timezone.now()
            pre_mentor.save()

            # Update mentor record bio with only skills & expertise
            mentor_record = pre_mentor.mentor
            if mentor_record:
                # Only pass skills & expertise to the bio field
                mentor_record.bio = skills or pre_mentor.skills or "General academic support"
                mentor_record.expertise = skills or pre_mentor.skills or "General Mentoring"
                mentor_record.save()

            return JsonResponse({
                'success': True,
                'message': 'Mentor application submitted successfully! Your application is now pending university approval.',
                'mentor_id': mentor_record.mentor_id if mentor_record else None,
                'status': 'pending_approval'
            })
            
        except Exception as e:
            print(f"Submit mentor application error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to submit mentor application: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)