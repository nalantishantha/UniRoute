from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from datetime import datetime, timedelta, date
import json
import calendar

from .models import PreMentors, PreMentorAvailability, PreMentorSessions, PreMentorEarnings
from apps.accounts.models import Users, UserDetails
from apps.university_students.models import UniversityStudents

@csrf_exempt
def pre_mentor_dashboard(request):
    """Get pre-mentor dashboard data"""
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
            
            # Get current month stats
            current_month = datetime.now().month
            current_year = datetime.now().year
            
            # Calculate earnings for current month
            current_month_earnings = PreMentorEarnings.objects.filter(
                pre_mentor=pre_mentor,
                earning_date__month=current_month,
                earning_date__year=current_year,
                payment_status='paid'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Calculate sessions for current month
            current_month_sessions = PreMentorSessions.objects.filter(
                pre_mentor=pre_mentor,
                session_date__month=current_month,
                session_date__year=current_year,
                status='completed'
            ).count()
            
            # Get total sessions completed
            total_sessions = PreMentorSessions.objects.filter(
                pre_mentor=pre_mentor,
                status='completed'
            ).count()
            
            # Get average rating
            avg_rating = PreMentorSessions.objects.filter(
                pre_mentor=pre_mentor,
                status='completed',
                rating_by_student__isnull=False
            ).aggregate(avg=Avg('rating_by_student'))['avg'] or 0
            
            # Get upcoming sessions (next 7 days)
            upcoming_sessions = PreMentorSessions.objects.filter(
                pre_mentor=pre_mentor,
                status='scheduled',
                session_date__gte=date.today(),
                session_date__lte=date.today() + timedelta(days=7)
            ).order_by('session_date', 'start_time')[:5]
            
            upcoming_sessions_data = []
            for session in upcoming_sessions:
                student_details = UserDetails.objects.get(user_id=session.student_id)
                upcoming_sessions_data.append({
                    'session_id': session.session_id,
                    'student_name': student_details.full_name,
                    'subject': session.subject,
                    'session_date': session.session_date.strftime('%Y-%m-%d'),
                    'start_time': session.start_time.strftime('%H:%M'),
                    'end_time': session.end_time.strftime('%H:%M'),
                    'session_fee': float(session.session_fee)
                })
            
            # Get recent earnings (last 5)
            recent_earnings = PreMentorEarnings.objects.filter(
                pre_mentor=pre_mentor
            ).order_by('-earning_date')[:5]
            
            recent_earnings_data = []
            for earning in recent_earnings:
                recent_earnings_data.append({
                    'earning_id': earning.earning_id,
                    'amount': float(earning.amount),
                    'earning_date': earning.earning_date.strftime('%Y-%m-%d'),
                    'payment_status': earning.payment_status,
                    'description': earning.description or 'Session payment'
                })
            
            return JsonResponse({
                'success': True,
                'data': {
                    'pre_mentor_info': {
                        'pre_mentor_id': pre_mentor.pre_mentor_id,
                        'hourly_rate': float(pre_mentor.hourly_rate) if pre_mentor.hourly_rate else 0,
                        'total_earnings': float(pre_mentor.total_earnings),
                        'rating': float(pre_mentor.rating) if pre_mentor.rating else 0,
                        'total_sessions': pre_mentor.total_sessions,
                        'is_available': pre_mentor.is_available,
                        'status': pre_mentor.status
                    },
                    'current_month_stats': {
                        'earnings': float(current_month_earnings),
                        'sessions': current_month_sessions,
                        'month_name': calendar.month_name[current_month],
                        'year': current_year
                    },
                    'overall_stats': {
                        'total_sessions': total_sessions,
                        'average_rating': float(avg_rating) if avg_rating else 0,
                        'total_earnings': float(pre_mentor.total_earnings)
                    },
                    'upcoming_sessions': upcoming_sessions_data,
                    'recent_earnings': recent_earnings_data
                }
            })
            
        except Exception as e:
            print(f"Pre-mentor dashboard error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Dashboard data failed: {str(e)}'
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
                    'hourly_rate': float(pre_mentor.hourly_rate) if pre_mentor.hourly_rate else 0,
                    'specializations': pre_mentor.specializations or '',
                    'experience_years': pre_mentor.experience_years or 0,
                    'university_info': {
                        'university_id': uni_student.university_id,
                        'faculty_id': uni_student.faculty_id,
                        'degree_program_id': uni_student.degree_program_id,
                        'year_of_study': uni_student.year_of_study,
                        'registration_number': uni_student.registration_number
                    },
                    'rating': float(pre_mentor.rating) if pre_mentor.rating else 0,
                    'total_sessions': pre_mentor.total_sessions,
                    'is_available': pre_mentor.is_available,
                    'is_verified': user_details.is_verified
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
            
            # Update pre-mentor specific details
            pre_mentor.hourly_rate = data.get('hourly_rate', pre_mentor.hourly_rate)
            pre_mentor.specializations = data.get('specializations', pre_mentor.specializations)
            pre_mentor.experience_years = data.get('experience_years', pre_mentor.experience_years)
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
    """Get pre-mentor tutoring sessions"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            status_filter = request.GET.get('status', 'all')  # all, scheduled, completed, cancelled
            
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
            
            # Build query based on status filter
            query = Q(pre_mentor=pre_mentor)
            if status_filter != 'all':
                query &= Q(status=status_filter)
            
            sessions = PreMentorSessions.objects.filter(query).order_by('-session_date', '-start_time')
            
            sessions_data = []
            for session in sessions:
                try:
                    student_details = UserDetails.objects.get(user_id=session.student_id)
                    student_name = student_details.full_name
                except UserDetails.DoesNotExist:
                    student_name = 'Unknown Student'
                
                sessions_data.append({
                    'session_id': session.session_id,
                    'student_name': student_name,
                    'subject': session.subject,
                    'session_date': session.session_date.strftime('%Y-%m-%d'),
                    'start_time': session.start_time.strftime('%H:%M'),
                    'end_time': session.end_time.strftime('%H:%M'),
                    'duration_minutes': session.duration_minutes,
                    'session_fee': float(session.session_fee),
                    'status': session.status,
                    'rating_by_student': session.rating_by_student,
                    'feedback_by_student': session.feedback_by_student or '',
                    'notes': session.notes or ''
                })
            
            return JsonResponse({
                'success': True,
                'sessions': sessions_data
            })
            
        except Exception as e:
            print(f"Get pre-mentor sessions error: {str(e)}")
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
    """Get pre-mentor earnings data"""
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
            
            # Get all earnings
            earnings = PreMentorEarnings.objects.filter(pre_mentor=pre_mentor).order_by('-earning_date')
            
            # Calculate totals by status
            total_paid = earnings.filter(payment_status='paid').aggregate(total=Sum('amount'))['total'] or 0
            total_pending = earnings.filter(payment_status='pending').aggregate(total=Sum('amount'))['total'] or 0
            
            # Get earnings by month for current year
            current_year = datetime.now().year
            monthly_earnings = {}
            
            for month in range(1, 13):
                month_total = earnings.filter(
                    earning_date__year=current_year,
                    earning_date__month=month,
                    payment_status='paid'
                ).aggregate(total=Sum('amount'))['total'] or 0
                monthly_earnings[calendar.month_name[month]] = float(month_total)
            
            # Prepare earnings list
            earnings_list = []
            for earning in earnings[:50]:  # Limit to recent 50
                session_info = ''
                if earning.session:
                    try:
                        student_details = UserDetails.objects.get(user_id=earning.session.student_id)
                        session_info = f"Session with {student_details.full_name}"
                    except UserDetails.DoesNotExist:
                        session_info = "Tutoring session"
                
                earnings_list.append({
                    'earning_id': earning.earning_id,
                    'amount': float(earning.amount),
                    'earning_date': earning.earning_date.strftime('%Y-%m-%d'),
                    'payment_status': earning.payment_status,
                    'payment_date': earning.payment_date.strftime('%Y-%m-%d') if earning.payment_date else None,
                    'description': earning.description or session_info
                })
            
            return JsonResponse({
                'success': True,
                'data': {
                    'total_earnings': float(pre_mentor.total_earnings),
                    'total_paid': float(total_paid),
                    'total_pending': float(total_pending),
                    'monthly_earnings': monthly_earnings,
                    'earnings_list': earnings_list
                }
            })
            
        except Exception as e:
            print(f"Get pre-mentor earnings error: {str(e)}")
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
                'is_available': pre_mentor.is_available
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
            is_available = data.get('is_available', True)
            
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
            
            # Update availability status
            pre_mentor.is_available = is_available
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
                    'hourly_rate': float(pre_mentor.hourly_rate) if pre_mentor.hourly_rate else 0,
                    'is_available': pre_mentor.is_available,
                    'specializations': pre_mentor.specializations or '',
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
            
            # Update settings
            pre_mentor.hourly_rate = data.get('hourly_rate', pre_mentor.hourly_rate)
            pre_mentor.is_available = data.get('is_available', pre_mentor.is_available)
            pre_mentor.specializations = data.get('specializations', pre_mentor.specializations)
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
                expertise=pre_mentor.specializations or "General Mentoring",
                bio=f"Experienced pre-mentor with {pre_mentor.experience_years or 1} years of experience. "
                    f"Has completed {pre_mentor.total_sessions} tutoring sessions with an average rating of "
                    f"{pre_mentor.rating or 'N/A'}. Specializes in: {pre_mentor.specializations or 'General subjects'}.",
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
    """Check if pre-mentor has applied for mentor status and current approval status"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            
            if not user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID is required'
                }, status=400)
            
            # Check if user has mentor application
            from apps.mentoring.models import Mentors
            mentor_application = Mentors.objects.filter(user_id=user_id).first()
            
            if not mentor_application:
                return JsonResponse({
                    'success': True,
                    'has_applied': False,
                    'can_apply': True,
                    'message': 'You can apply to become a mentor'
                })
            
            # Return application status
            approval_status = "approved" if mentor_application.approved == 1 else "pending"
            
            return JsonResponse({
                'success': True,
                'has_applied': True,
                'can_apply': False,
                'approval_status': approval_status,
                'approved': mentor_application.approved == 1,
                'applied_at': mentor_application.created_at,
                'mentor_id': mentor_application.mentor_id,
                'message': f'Mentor application status: {approval_status}'
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
