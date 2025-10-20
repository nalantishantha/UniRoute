from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from .models import Mentors, MentoringSessions, MentoringSessionEnrollments, MentoringFeedback, PreMentorApplications
from apps.accounts.models import Users, UserDetails
from apps.students.models import Students
from apps.university_students.models import UniversityStudents
from django.views.decorators.http import require_http_methods
from django.db.models import Q


@csrf_exempt
def create_mentoring_session(request):
    """Create a new mentoring session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get required fields
            mentor_id = data.get('mentor_id')
            topic = data.get('topic')
            scheduled_at = data.get('scheduled_at')
            duration_minutes = data.get('duration_minutes', 60)
            status = data.get('status', 'scheduled')
            
            # Validation
            if not all([mentor_id, topic, scheduled_at]):
                return JsonResponse({
                    'success': False,
                    'message': 'Mentor ID, topic, and scheduled time are required'
                }, status=400)
            
            # Check if mentor exists and is approved
            try:
                mentor = Mentors.objects.get(mentor_id=mentor_id, approved=1)
            except Mentors.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Mentor not found or not approved'
                }, status=404)
            
            # Create the session
            with transaction.atomic():
                session = MentoringSessions.objects.create(
                    mentor=mentor,
                    topic=topic,
                    scheduled_at=scheduled_at,
                    duration_minutes=duration_minutes,
                    status=status,
                    created_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Mentoring session created successfully',
                    'session': {
                        'session_id': session.session_id,
                        'topic': session.topic,
                        'scheduled_at': session.scheduled_at,
                        'mentor_id': mentor.mentor_id,
                        'status': session.status
                    }
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error creating session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def get_mentoring_sessions(request):
    """Get all mentoring sessions or sessions by mentor"""
    if request.method == 'GET':
        try:
            mentor_id = request.GET.get('mentor_id')
            status = request.GET.get('status')
            
            filters = {}
            if mentor_id:
                filters['mentor_id'] = mentor_id
            if status:
                filters['status'] = status
            
            sessions = MentoringSessions.objects.filter(**filters)
            
            sessions_data = []
            for session in sessions:
                # Get mentor user details
                mentor_user = session.mentor.user
                try:
                    from apps.accounts.models import UserDetails
                    user_details = UserDetails.objects.get(user=mentor_user)
                    mentor_name = f"{user_details.first_name} {user_details.last_name}"
                except:
                    mentor_name = mentor_user.username
                
                # Count enrollments
                enrollment_count = MentoringSessionEnrollments.objects.filter(session=session).count()
                
                sessions_data.append({
                    'session_id': session.session_id,
                    'mentor_id': session.mentor.mentor_id,
                    'mentor_name': mentor_name,
                    'mentor_expertise': session.mentor.expertise,
                    'topic': session.topic,
                    'scheduled_at': session.scheduled_at,
                    'duration_minutes': session.duration_minutes,
                    'status': session.status,
                    'enrollment_count': enrollment_count,
                    'created_at': session.created_at
                })
            
            return JsonResponse({
                'success': True,
                'sessions': sessions_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching sessions: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def enroll_in_mentoring_session(request):
    """Enroll a student in a mentoring session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            session_id = data.get('session_id')
            user_id = data.get('user_id')
            
            if not all([session_id, user_id]):
                return JsonResponse({
                    'success': False,
                    'message': 'Session ID and User ID are required'
                }, status=400)
            
            # Check if session exists and is scheduled
            try:
                session = MentoringSessions.objects.get(session_id=session_id, status='scheduled')
            except MentoringSessions.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Session not found or not available for enrollment'
                }, status=404)
            
            # Check if user exists and is a student
            try:
                user = Users.objects.get(user_id=user_id)
                student = Students.objects.get(user=user)
            except (Users.DoesNotExist, Students.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            # Check if student is already enrolled
            if MentoringSessionEnrollments.objects.filter(session=session, student=student).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Student is already enrolled in this session'
                }, status=400)
            
            # Create enrollment
            with transaction.atomic():
                enrollment = MentoringSessionEnrollments.objects.create(
                    session=session,
                    student=student,
                    enrolled_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Successfully enrolled in the mentoring session',
                    'enrollment': {
                        'session_enrollment_id': enrollment.session_enrollment_id,
                        'session_topic': session.topic,
                        'scheduled_at': session.scheduled_at,
                        'enrolled_at': enrollment.enrolled_at
                    }
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error enrolling in session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def update_mentoring_session(request, session_id):
    """Update a mentoring session"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            try:
                session = MentoringSessions.objects.get(session_id=session_id)
            except MentoringSessions.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Session not found'
                }, status=404)
            
            # Update fields if provided
            if 'topic' in data:
                session.topic = data['topic']
            if 'scheduled_at' in data:
                session.scheduled_at = data['scheduled_at']
            if 'duration_minutes' in data:
                session.duration_minutes = data['duration_minutes']
            if 'status' in data:
                session.status = data['status']
            
            session.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Session updated successfully',
                'session': {
                    'session_id': session.session_id,
                    'topic': session.topic,
                    'scheduled_at': session.scheduled_at,
                    'status': session.status
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error updating session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)


@csrf_exempt
def delete_mentoring_session(request, session_id):
    """Delete a mentoring session"""
    if request.method == 'DELETE':
        try:
            try:
                session = MentoringSessions.objects.get(session_id=session_id)
            except MentoringSessions.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Session not found'
                }, status=404)
            
            # Check if session can be deleted (only if not completed)
            if session.status == 'completed':
                return JsonResponse({
                    'success': False,
                    'message': 'Cannot delete a completed session'
                }, status=400)
            
            # Delete the session (this will also delete related enrollments due to CASCADE)
            session.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Session deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error deleting session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only DELETE method allowed'
    }, status=405)


@csrf_exempt
def get_mentors(request):
    """Get all approved mentors"""
    if request.method == 'GET':
        try:
            mentors = Mentors.objects.filter(approved=1)
            
            mentors_data = []
            for mentor in mentors:
                # Get mentor user details
                try:
                    from apps.accounts.models import UserDetails
                    user_details = UserDetails.objects.get(user=mentor.user)
                    mentor_name = f"{user_details.first_name} {user_details.last_name}"
                except:
                    mentor_name = mentor.user.username
                
                # Get university info if available
                university_info = None
                if mentor.university_student:
                    university_info = {
                        'university_name': getattr(mentor.university_student, 'university_name', 'N/A'),
                        'program': getattr(mentor.university_student, 'program', 'N/A')
                    }
                
                mentors_data.append({
                    'mentor_id': mentor.mentor_id,
                    'mentor_name': mentor_name,
                    'expertise': mentor.expertise,
                    'bio': mentor.bio,
                    'university_info': university_info,
                    'created_at': mentor.created_at
                })
            
            return JsonResponse({
                'success': True,
                'mentors': mentors_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching mentors: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


# University Mentor Admin APIs

@csrf_exempt
@require_http_methods(["GET"]) 
def university_mentor_requests(request):
    """List mentor requests for a university.

    Show ONLY when: applied=1 (in pre_mentor_applications) AND mentors.approved in (0, NULL).
    If a mentor profile exists but has not applied yet (applied=0 or no row), do NOT include.
    """
    uid = request.GET.get('university_id')
    if not uid:
        return JsonResponse({'success': False, 'message': 'university_id is required'}, status=400)
    try:
        apps_qs = (
            PreMentorApplications.objects
            .select_related('mentor__user', 'mentor__university_student__university', 'mentor__university_student__degree_program')
            .filter(
                applied=1,
                mentor__university_student__university_id=uid,
            )
            .filter(Q(mentor__approved=0) | Q(mentor__approved__isnull=True))
            .order_by('-created_at')
        )

        data = []
        for app in apps_qs:
            mentor = app.mentor
            user = mentor.user

            # Name & contacts
            try:
                ud = UserDetails.objects.get(user=user)
                mentor_name = ud.full_name or getattr(user, 'username', f"mentor_{mentor.mentor_id}")
                contact_number = ud.contact_number or ''
            except UserDetails.DoesNotExist:
                mentor_name = getattr(user, 'username', f"mentor_{mentor.mentor_id}")
                contact_number = ''
            email = getattr(user, 'email', '')

            # Merge form_data with fallbacks from UniversityStudents
            merged_fd = dict(app.form_data or {})
            us = mentor.university_student
            if us:
                merged_fd.setdefault('registration_number', getattr(us, 'registration_number', None))
                merged_fd.setdefault('year_of_study', getattr(us, 'year_of_study', None))
            # phone fallback from user details
            phone = merged_fd.get('phone') or merged_fd.get('contact_number') or contact_number
            # also inject into form_data so UI that reads only form_data sees it
            if 'phone' not in merged_fd and phone:
                merged_fd['phone'] = phone

            # Education summary
            edu = None
            if us:
                uni_name = getattr(us.university, 'name', None)
                degree_title = getattr(us.degree_program, 'title', None)
                if degree_title or uni_name:
                    edu = f"{degree_title or ''}{' - ' if degree_title and uni_name else ''}{uni_name or ''}"

            data.append({
                'pre_mentor_id': app.pre_mentor_id,
                'mentor_id': mentor.mentor_id,
                'mentor_name': mentor_name,
                'email': email,
                'phone': phone or '',
                'education': edu,
                'bio': mentor.bio,
                'expertise': mentor.expertise,
                'form_data': merged_fd,
                'submitted_at': app.created_at,
            })
        return JsonResponse({'success': True, 'requests': data})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def university_active_mentors(request):
    """List active mentors for a university (approved=1 and applied=1)."""
    uid = request.GET.get('university_id')
    if not uid:
        return JsonResponse({'success': False, 'message': 'university_id is required'}, status=400)
    try:
        # mentors with approved=1 and have a pre-mentor application with applied=1
        mentors_qs = Mentors.objects.select_related('user', 'university_student__university').filter(
            approved=1,
            university_student__university_id=uid,
            pre_apps__applied=1  # use related_name defined on PreMentorApplications
        ).distinct()

        items = []
        for m in mentors_qs:
            user = m.user
            try:
                from apps.accounts.models import UserDetails
                ud = UserDetails.objects.get(user=user)
                mentor_name = ud.full_name or f"{ud.first_name} {ud.last_name}".strip()
                email = getattr(ud, 'email', None) or getattr(user, 'email', '')
            except Exception:
                mentor_name = getattr(user, 'username', f"mentor_{m.mentor_id}")
                email = getattr(user, 'email', '')
            items.append({
                'mentor_id': m.mentor_id,
                'mentor_name': mentor_name,
                'email': email,
                'phone': getattr(UserDetails.objects.filter(user=user).first(), 'contact_number', '') or '',
                'expertise': m.expertise,
                'bio': m.bio,
                'approved': m.approved,
                'created_at': m.created_at,
            })
        return JsonResponse({'success': True, 'active_mentors': items})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def accept_pre_mentor(request, pre_mentor_id):
    """Accept a mentor application: set mentor.approved=1.
    Ensure the application is applied=1 before accepting.
    """
    try:
        with transaction.atomic():
            app = PreMentorApplications.objects.select_related('mentor').get(pre_mentor_id=pre_mentor_id)
            if app.applied != 1:
                return JsonResponse({'success': False, 'message': 'Application is not active'}, status=400)
            mentor = app.mentor
            mentor.approved = 1
            mentor.save(update_fields=['approved'])
        return JsonResponse({'success': True, 'mentor_id': mentor.mentor_id})
    except PreMentorApplications.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Application not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def reject_pre_mentor(request, pre_mentor_id):
    """Reject a mentor application: set applied=0 and record reason.
    Later we can trigger a notification to the user.
    """
    try:
        body = json.loads(request.body or '{}')
        reason = body.get('reason', '')
        with transaction.atomic():
            app = PreMentorApplications.objects.select_related('mentor').get(pre_mentor_id=pre_mentor_id)
            app.applied = 0
            app.rejection_reason = reason
            app.save(update_fields=['applied', 'rejection_reason', 'updated_at'])
            # Ensure mentor remains unapproved
            if app.mentor and app.mentor.approved:
                m = app.mentor
                m.approved = 0
                m.save(update_fields=['approved'])
        return JsonResponse({'success': True})
    except PreMentorApplications.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Application not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"]) 
def pre_mentor_status(request):
    """Student-facing: get latest pre-mentor application status and reason.

    Query params: user_id (required)
    Returns: {applied, approved, rejection_reason, pre_mentor_id, form_data, updated_at}
    """
    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'message': 'user_id is required'}, status=400)
    try:
        mentor = Mentors.objects.select_related('user').get(user_id=user_id)
    except Mentors.DoesNotExist:
        return JsonResponse({'success': True, 'status': {'applied': 0, 'approved': 0}})
    app = PreMentorApplications.objects.filter(mentor=mentor).order_by('-updated_at', '-created_at').first()
    status = {
        'applied': int(app.applied) if app else 0,
        'approved': int(mentor.approved or 0),
        'rejection_reason': getattr(app, 'rejection_reason', None) if app else None,
        'pre_mentor_id': getattr(app, 'pre_mentor_id', None) if app else None,
        'form_data': getattr(app, 'form_data', None) if app else None,
        'updated_at': getattr(app, 'updated_at', None) if app else None,
    }
    return JsonResponse({'success': True, 'status': status})
