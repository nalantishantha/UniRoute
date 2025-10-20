from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, F, Value, CharField, Count, Sum, Avg
from django.db.models.functions import Concat
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import UniversityStudents
from apps.mentoring.models import (
    MentoringSessions, MentoringFeedback, MentoringSessionEnrollments, 
    MentoringRequests, Mentors
)
from apps.tutoring.models import TutoringSessions, TutorFeedback, Tutors
from apps.payments.models import MentoringPayments, TutoringPayments
from apps.academic_resources.models import AcademicResource
from apps.accounts.models import Users, UserDetails
from apps.students.models import Students


@csrf_exempt
def get_recent_activities(request, user_id):
    """
    Get recent activities for a university student including:
    - Recent enrollments in mentoring sessions
    - Completed mentoring/tutoring sessions
    - Recent feedback received
    - Recent payments received
    - Recent resource uploads
    """
    if request.method == 'GET':
        try:
            # Find university student by user_id
            try:
                university_student = UniversityStudents.objects.get(user_id=user_id)
            except UniversityStudents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University student not found for this user'
                }, status=404)
            
            activities = []
            
            # Get recent activities from the last 30 days
            cutoff_date = timezone.now() - timedelta(days=30)
            
            # 1. Recent enrollments in mentoring sessions
            activities.extend(get_recent_enrollments(university_student, cutoff_date))
            
            # 2. Recent completed sessions (both mentoring and tutoring)
            activities.extend(get_recent_completed_sessions(university_student, cutoff_date))
            
            # 3. Recent feedback received
            activities.extend(get_recent_feedback(university_student, cutoff_date))
            
            # 4. Recent payments received
            activities.extend(get_recent_payments(university_student, cutoff_date))
            
            # 5. Recent resource uploads
            activities.extend(get_recent_resource_uploads(university_student, cutoff_date))
            
            # Sort activities by time (newest first) and limit to 10
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            recent_activities = activities[:10]
            
            return JsonResponse({
                'success': True,
                'activities': recent_activities,
                'total_count': len(recent_activities)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching recent activities: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def get_dashboard_stats(request, user_id):
    """
    Get dashboard statistics for a university student including:
    - Total resources uploaded
    - Active mentoring sessions
    - Active enrollments 
    - Monthly revenue
    """
    if request.method == 'GET':
        try:
            # Find university student by user_id
            try:
                university_student = UniversityStudents.objects.get(user_id=user_id)
            except UniversityStudents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University student not found for this user'
                }, status=404)
            
            stats = {}
            
            # Calculate total resources uploaded
            user = university_student.user
            total_resources = AcademicResource.objects.filter(uploaded_by=user).count()
            last_month_resources = AcademicResource.objects.filter(
                uploaded_by=user,
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count()
            
            stats['total_resources'] = {
                'value': total_resources,
                'change': f"+{last_month_resources}",
                'change_type': 'positive' if last_month_resources > 0 else 'neutral'
            }
            
            # Calculate mentoring sessions
            mentor = Mentors.objects.filter(university_student=university_student).first()
            total_mentoring_sessions = 0
            active_mentoring_sessions = 0
            if mentor:
                total_mentoring_sessions = MentoringSessions.objects.filter(mentor=mentor).count()
                active_mentoring_sessions = MentoringSessions.objects.filter(
                    mentor=mentor,
                    status__in=['scheduled', 'pending'],
                    scheduled_at__gte=timezone.now()
                ).count()
            
            stats['mentoring_sessions'] = {
                'value': total_mentoring_sessions,
                'change': f"{active_mentoring_sessions} active",
                'change_type': 'positive' if active_mentoring_sessions > 0 else 'neutral'
            }
            
            # Calculate active enrollments (students enrolled in mentor's sessions)
            total_enrollments = 0
            recent_enrollments = 0
            if mentor:
                total_enrollments = MentoringSessionEnrollments.objects.filter(
                    session__mentor=mentor
                ).count()
                recent_enrollments = MentoringSessionEnrollments.objects.filter(
                    session__mentor=mentor,
                    enrolled_at__gte=timezone.now() - timedelta(days=30)
                ).count()
            
            stats['active_enrollments'] = {
                'value': total_enrollments,
                'change': f"+{recent_enrollments}",
                'change_type': 'positive' if recent_enrollments > 0 else 'neutral'
            }
            
            # Calculate monthly revenue
            current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
            
            current_month_revenue = 0
            last_month_revenue = 0
            
            if mentor:
                # Mentoring payments
                current_mentoring = MentoringPayments.objects.filter(
                    session__mentor=mentor,
                    paid_at__gte=current_month_start
                ).aggregate(total=Sum('amount'))['total'] or 0
                
                last_mentoring = MentoringPayments.objects.filter(
                    session__mentor=mentor,
                    paid_at__gte=last_month_start,
                    paid_at__lt=current_month_start
                ).aggregate(total=Sum('amount'))['total'] or 0
                
                current_month_revenue += float(current_mentoring)
                last_month_revenue += float(last_mentoring)
            
            # Tutoring payments
            tutor = Tutors.objects.filter(university_student=university_student).first()
            if tutor:
                current_tutoring = TutoringPayments.objects.filter(
                    booking__tutor=tutor,
                    paid_at__gte=current_month_start
                ).aggregate(total=Sum('amount'))['total'] or 0
                
                last_tutoring = TutoringPayments.objects.filter(
                    booking__tutor=tutor,
                    paid_at__gte=last_month_start,
                    paid_at__lt=current_month_start
                ).aggregate(total=Sum('amount'))['total'] or 0
                
                current_month_revenue += float(current_tutoring)
                last_month_revenue += float(last_tutoring)
            
            # Calculate percentage change
            if last_month_revenue > 0:
                revenue_change = ((current_month_revenue - last_month_revenue) / last_month_revenue) * 100
                change_text = f"{revenue_change:+.1f}%"
                change_type = 'positive' if revenue_change > 0 else 'negative' if revenue_change < 0 else 'neutral'
            else:
                change_text = f"+${current_month_revenue:.0f}" if current_month_revenue > 0 else "$0"
                change_type = 'positive' if current_month_revenue > 0 else 'neutral'
            
            stats['monthly_revenue'] = {
                'value': f"LKR{current_month_revenue:.0f}",
                'change': change_text,
                'change_type': change_type
            }
            
            return JsonResponse({
                'success': True,
                'stats': stats
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching dashboard stats: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


def get_recent_enrollments(university_student, cutoff_date):
    """Get recent enrollments in mentoring sessions"""
    activities = []
    
    try:
        # Find mentor record for this university student
        mentor = Mentors.objects.filter(university_student=university_student).first()
        
        if mentor:
            # Get recent enrollments in mentor's sessions
            enrollments = MentoringSessionEnrollments.objects.filter(
                session__mentor=mentor,
                enrolled_at__gte=cutoff_date
            ).select_related('student__user', 'session').order_by('-enrolled_at')
            
            for enrollment in enrollments:
                try:
                    student_user = enrollment.student.user
                    student_details = UserDetails.objects.filter(user=student_user).first()
                    student_name = student_details.full_name if student_details else student_user.username
                    
                    activity = {
                        'id': f"enrollment_{enrollment.session_enrollment_id}",
                        'type': 'enrollment',
                        'title': f"New enrollment in '{enrollment.session.topic}'",
                        'student': student_name,
                        'time': get_time_ago(enrollment.enrolled_at),
                        'timestamp': enrollment.enrolled_at.isoformat(),
                        'details': {
                            'session_topic': enrollment.session.topic,
                            'session_date': enrollment.session.scheduled_at.strftime('%Y-%m-%d %H:%M') if enrollment.session.scheduled_at else None
                        }
                    }
                    activities.append(activity)
                except Exception as e:
                    print(f"Error processing enrollment {enrollment.session_enrollment_id}: {str(e)}")
                    continue
    
    except Exception as e:
        print(f"Error fetching enrollments: {str(e)}")
    
    return activities


def get_recent_completed_sessions(university_student, cutoff_date):
    """Get recent completed sessions (both mentoring and tutoring)"""
    activities = []
    
    try:
        # Get mentoring sessions
        mentor = Mentors.objects.filter(university_student=university_student).first()
        if mentor:
            mentoring_sessions = MentoringSessions.objects.filter(
                mentor=mentor,
                status='completed',
                created_at__gte=cutoff_date
            ).order_by('-created_at')
            
            for session in mentoring_sessions:
                try:
                    # Get the student who was mentored (from enrollments)
                    enrollment = MentoringSessionEnrollments.objects.filter(session=session).first()
                    if enrollment:
                        student_user = enrollment.student.user
                        student_details = UserDetails.objects.filter(user=student_user).first()
                        student_name = student_details.full_name if student_details else student_user.username
                    else:
                        student_name = "Unknown Student"
                    
                    activity = {
                        'id': f"mentoring_session_{session.session_id}",
                        'type': 'session',
                        'title': f"Session completed with {student_name}",
                        'subject': f"Mentoring: {session.topic}",
                        'time': get_time_ago(session.created_at or timezone.now()),
                        'timestamp': (session.created_at or timezone.now()).isoformat(),
                        'details': {
                            'session_type': 'mentoring',
                            'topic': session.topic,
                            'duration': session.duration_minutes
                        }
                    }
                    activities.append(activity)
                except Exception as e:
                    print(f"Error processing mentoring session {session.session_id}: {str(e)}")
                    continue
        
        # Get tutoring sessions
        tutor = Tutors.objects.filter(university_student=university_student).first()
        if tutor:
            tutoring_sessions = TutoringSessions.objects.filter(
                tutor=tutor,
                status='completed',
                created_at__gte=cutoff_date
            ).select_related('subject').order_by('-created_at')
            
            for session in tutoring_sessions:
                try:
                    activity = {
                        'id': f"tutoring_session_{session.session_id}",
                        'type': 'session',
                        'title': f"Tutoring session completed",
                        'subject': f"Tutoring: {session.subject.subject_name if session.subject else 'Unknown Subject'}",
                        'time': get_time_ago(session.created_at or timezone.now()),
                        'timestamp': (session.created_at or timezone.now()).isoformat(),
                        'details': {
                            'session_type': 'tutoring',
                            'subject': session.subject.subject_name if session.subject else 'Unknown',
                            'duration': session.duration_minutes,
                            'description': session.description
                        }
                    }
                    activities.append(activity)
                except Exception as e:
                    print(f"Error processing tutoring session {session.session_id}: {str(e)}")
                    continue
    
    except Exception as e:
        print(f"Error fetching completed sessions: {str(e)}")
    
    return activities


def get_recent_feedback(university_student, cutoff_date):
    """Get recent feedback received"""
    activities = []
    
    try:
        # Get mentoring feedback
        mentor = Mentors.objects.filter(university_student=university_student).first()
        if mentor:
            mentoring_feedback = MentoringFeedback.objects.filter(
                session__mentor=mentor,
                submitted_at__gte=cutoff_date
            ).select_related('student__user', 'session').order_by('-submitted_at')
            
            for feedback in mentoring_feedback:
                try:
                    student_user = feedback.student.user
                    student_details = UserDetails.objects.filter(user=student_user).first()
                    student_name = student_details.full_name if student_details else student_user.username
                    
                    # Extract rating from JSON
                    rating_value = 0
                    if feedback.rating:
                        if isinstance(feedback.rating, dict):
                            rating_value = feedback.rating.get('overall', 0)
                        elif isinstance(feedback.rating, (int, float)):
                            rating_value = int(feedback.rating)
                    
                    activity = {
                        'id': f"mentoring_feedback_{feedback.feedback_id}",
                        'type': 'feedback',
                        'title': f"New feedback received ({rating_value} stars)",
                        'course': f"Mentoring: {feedback.session.topic}",
                        'time': get_time_ago(feedback.submitted_at),
                        'timestamp': feedback.submitted_at.isoformat(),
                        'details': {
                            'rating': rating_value,
                            'comment': feedback.feedback,
                            'session_topic': feedback.session.topic,
                            'student_name': student_name
                        }
                    }
                    activities.append(activity)
                except Exception as e:
                    print(f"Error processing mentoring feedback {feedback.feedback_id}: {str(e)}")
                    continue
        
        # Get tutoring feedback
        tutor = Tutors.objects.filter(university_student=university_student).first()
        if tutor:
            tutoring_feedback = TutorFeedback.objects.filter(
                tutor=tutor,
                created_at__gte=cutoff_date
            ).select_related('user').order_by('-created_at')
            
            for feedback in tutoring_feedback:
                try:
                    student_user = feedback.user
                    student_details = UserDetails.objects.filter(user=student_user).first()
                    student_name = student_details.full_name if student_details else student_user.username
                    
                    # Extract rating from JSON
                    rating_value = 0
                    if feedback.rating:
                        if isinstance(feedback.rating, dict):
                            rating_value = feedback.rating.get('overall', 0)
                        elif isinstance(feedback.rating, (int, float)):
                            rating_value = int(feedback.rating)
                    
                    activity = {
                        'id': f"tutoring_feedback_{feedback.feedback_id}",
                        'type': 'feedback',
                        'title': f"New feedback received ({rating_value} stars)",
                        'course': "Tutoring Session",
                        'time': get_time_ago(feedback.created_at),
                        'timestamp': feedback.created_at.isoformat(),
                        'details': {
                            'rating': rating_value,
                            'comment': feedback.feedback,
                            'student_name': student_name
                        }
                    }
                    activities.append(activity)
                except Exception as e:
                    print(f"Error processing tutoring feedback {feedback.feedback_id}: {str(e)}")
                    continue
    
    except Exception as e:
        print(f"Error fetching feedback: {str(e)}")
    
    return activities


def get_recent_payments(university_student, cutoff_date):
    """Get recent payments received"""
    activities = []
    
    try:
        # Get mentoring payments
        mentor = Mentors.objects.filter(university_student=university_student).first()
        if mentor:
            mentoring_payments = MentoringPayments.objects.filter(
                session__mentor=mentor,
                paid_at__gte=cutoff_date
            ).select_related('session', 'student__user').order_by('-paid_at')
            
            for payment in mentoring_payments:
                try:
                    student_user = payment.student.user
                    student_details = UserDetails.objects.filter(user=student_user).first()
                    student_name = student_details.full_name if student_details else student_user.username
                    
                    activity = {
                        'id': f"mentoring_payment_{payment.payment_id}",
                        'type': 'payment',
                        'title': "Payment received",
                        'amount': f"${payment.amount}",
                        'time': get_time_ago(payment.paid_at),
                        'timestamp': payment.paid_at.isoformat(),
                        'details': {
                            'amount': float(payment.amount),
                            'payment_method': payment.payment_method,
                            'session_topic': payment.session.topic,
                            'student_name': student_name,
                            'service_type': 'mentoring'
                        }
                    }
                    activities.append(activity)
                except Exception as e:
                    print(f"Error processing mentoring payment {payment.payment_id}: {str(e)}")
                    continue
        
        # Get tutoring payments
        tutor = Tutors.objects.filter(university_student=university_student).first()
        if tutor:
            tutoring_payments = TutoringPayments.objects.filter(
                booking__tutor=tutor,
                paid_at__gte=cutoff_date
            ).select_related('booking', 'student__user').order_by('-paid_at')
            
            for payment in tutoring_payments:
                try:
                    student_user = payment.student.user
                    student_details = UserDetails.objects.filter(user=student_user).first()
                    student_name = student_details.full_name if student_details else student_user.username
                    
                    activity = {
                        'id': f"tutoring_payment_{payment.payment_id}",
                        'type': 'payment',
                        'title': "Payment received",
                        'amount': f"${payment.amount}",
                        'time': get_time_ago(payment.paid_at),
                        'timestamp': payment.paid_at.isoformat(),
                        'details': {
                            'amount': float(payment.amount),
                            'payment_method': payment.payment_method,
                            'student_name': student_name,
                            'service_type': 'tutoring',
                            'booking_topic': payment.booking.topic if payment.booking else 'N/A'
                        }
                    }
                    activities.append(activity)
                except Exception as e:
                    print(f"Error processing tutoring payment {payment.payment_id}: {str(e)}")
                    continue
    
    except Exception as e:
        print(f"Error fetching payments: {str(e)}")
    
    return activities


def get_recent_resource_uploads(university_student, cutoff_date):
    """Get recent academic resource uploads"""
    activities = []
    
    try:
        # Get user from university student
        user = university_student.user
        
        # Get recent resource uploads
        resources = AcademicResource.objects.filter(
            uploaded_by=user,
            created_at__gte=cutoff_date
        ).order_by('-created_at')
        
        for resource in resources:
            try:
                activity = {
                    'id': f"resource_upload_{resource.id}",
                    'type': 'resource',
                    'title': f"Uploaded new resource: '{resource.title}'",
                    'category': resource.category,
                    'time': get_time_ago(resource.created_at),
                    'timestamp': resource.created_at.isoformat(),
                    'details': {
                        'resource_title': resource.title,
                        'category': resource.category,
                        'file_type': resource.file_type,
                        'tags': resource.tags,
                        'downloads': resource.downloads
                    }
                }
                activities.append(activity)
            except Exception as e:
                print(f"Error processing resource upload {resource.id}: {str(e)}")
                continue
    
    except Exception as e:
        print(f"Error fetching resource uploads: {str(e)}")
    
    return activities


def get_time_ago(timestamp):
    """Convert timestamp to human-readable time ago format"""
    if not timestamp:
        return "Unknown time"
    
    now = timezone.now()
    if timestamp.tzinfo is None:
        timestamp = timezone.make_aware(timestamp)
    
    diff = now - timestamp
    
    if diff.days > 7:
        return timestamp.strftime('%b %d, %Y')
    elif diff.days > 0:
        return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    else:
        return "Just now"