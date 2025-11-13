from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from django.db.models import Q, Prefetch
from django.core.paginator import Paginator
from django.utils import timezone
import json
from decimal import Decimal, InvalidOperation

from apps.accounts.models import Users, UserDetails, UserTypes
from apps.counsellors.models import (
    Counsellors,
    CounsellingFeedback,
    CounsellingRequests,
    CounsellingSessions,
)
from apps.students.models import Students
from apps.university_students.models import UniversityStudents
from apps.universities.models import Universities
from apps.companies.models import Companies


def _split_csv(value):
    if not value:
        return []
    if isinstance(value, (list, tuple)):
        return [str(item).strip() for item in value if str(item).strip()]
    return [item.strip() for item in str(value).split(',') if item.strip()]


def _parse_qualifications(value):
    items = _split_csv(value)
    if not items:
        return '', []
    return items[0], items[1:]


def _combine_qualifications(education, certifications):
    items = []
    if education:
        items.append(education.strip())
    if certifications:
        items.extend([cert.strip() for cert in certifications if cert.strip()])
    return ', '.join(items)


def _format_datetime(value):
    if not value:
        return ''
    try:
        if timezone.is_naive(value):
            value = timezone.make_aware(value, timezone.get_current_timezone())
        value = timezone.localtime(value)
    except Exception:
        pass
    return value.isoformat()


def _calculate_average_rating(feedback_items):
    scores = []
    for feedback in feedback_items:
        rating = getattr(feedback, 'rating', None)
        if rating is None:
            continue
        if isinstance(rating, (int, float)):
            scores.append(float(rating))
            continue
        if isinstance(rating, dict):
            for value in rating.values():
                try:
                    scores.append(float(value))
                except (TypeError, ValueError):
                    continue
            continue
        if isinstance(rating, (list, tuple)):
            for value in rating:
                try:
                    scores.append(float(value))
                except (TypeError, ValueError):
                    continue
    if not scores:
        return 0.0
    return round(sum(scores) / len(scores), 2)


def _serialize_counsellor(counsellor):
    user = getattr(counsellor, 'user', None)
    details = getattr(user, 'userdetails', None) if user else None
    sessions = getattr(counsellor, 'prefetched_sessions', None)
    feedback_items = getattr(counsellor, 'prefetched_feedback', None)
    requests = getattr(counsellor, 'prefetched_requests', None)

    if sessions is None:
        sessions = counsellor.sessions.all()
    if feedback_items is None:
        feedback_items = counsellor.feedback.all()
    if requests is None:
        requests = counsellor.requests.all()

    completed_sessions = [session for session in sessions if str(getattr(session, 'status', '')).lower() == 'completed']
    students_supported = len({getattr(session, 'student_id', None) for session in completed_sessions if getattr(session, 'student_id', None)})
    last_session_timestamp = None
    for session in sessions:
        candidate = getattr(session, 'updated_at', None) or getattr(session, 'scheduled_at', None)
        if candidate and (last_session_timestamp is None or candidate > last_session_timestamp):
            last_session_timestamp = candidate

    education, certifications = _parse_qualifications(getattr(counsellor, 'qualifications', ''))

    return {
        'id': counsellor.counsellor_id,
        'counsellor_id': counsellor.counsellor_id,
        'user_id': getattr(user, 'user_id', None),
        'username': getattr(user, 'username', ''),
        'fullName': getattr(details, 'full_name', '') or getattr(user, 'username', ''),
        'email': getattr(user, 'email', ''),
        'phone': getattr(details, 'contact_number', ''),
        'location': getattr(details, 'location', ''),
        'status': 'active' if getattr(user, 'is_active', 0) else 'inactive',
        'verified': bool(getattr(details, 'is_verified', 0)) if details else False,
        'availableForSessions': bool(getattr(counsellor, 'available_for_sessions', 0)),
        'experienceYears': getattr(counsellor, 'experience_years', 0) or 0,
        'hourlyRate': float(counsellor.hourly_rate) if getattr(counsellor, 'hourly_rate', None) is not None else None,
        'languages': _split_csv(getattr(counsellor, 'expertise', '')),
        'specializations': _split_csv(getattr(counsellor, 'specializations', '')),
        'education': education,
        'certifications': certifications,
        'bio': getattr(counsellor, 'bio', '') or '',
        'studentsSupported': students_supported,
        'sessionsCompleted': len(completed_sessions),
        'pendingRequests': len([req for req in requests if str(getattr(req, 'status', '')).lower() == 'pending']) if requests else 0,
        'averageRating': _calculate_average_rating(feedback_items),
        'responseTime': 'Not tracked',
        'joinedDate': _format_datetime(getattr(user, 'created_at', None)) if user else '',
        'lastActive': _format_datetime(last_session_timestamp or getattr(details, 'updated_at', None) or getattr(user, 'created_at', None)),
        'createdAt': _format_datetime(getattr(counsellor, 'created_at', None)),
        'updatedAt': _format_datetime(getattr(counsellor, 'updated_at', None)),
    }


def _get_data_value(payload, *keys):
    for key in keys:
        if key in payload:
            return payload[key]
    return None


COUNSELLOR_PREFETCHES = [
    Prefetch(
        'sessions',
        queryset=CounsellingSessions.objects.select_related('student').order_by('-scheduled_at'),
        to_attr='prefetched_sessions'
    ),
    Prefetch(
        'feedback',
        queryset=CounsellingFeedback.objects.all(),
        to_attr='prefetched_feedback'
    ),
    Prefetch(
        'requests',
        queryset=CounsellingRequests.objects.all(),
        to_attr='prefetched_requests'
    ),
]

@csrf_exempt
def get_all_users(request):
    """Get all users with their details and user types"""
    if request.method == 'GET':
        try:
            # Get query parameters
            user_type = request.GET.get('type', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            users = Users.objects.select_related('user_type').prefetch_related('userdetails')
            
            # Apply filters
            if user_type != 'all':
                users = users.filter(user_type__type_name=user_type)
            if search:
                users = users.filter(
                    Q(username__icontains=search) | 
                    Q(email__icontains=search) |
                    Q(userdetails__full_name__icontains=search)
                )
            
            # Order by creation date
            users = users.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(users, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            users_data = []
            for user in page_obj:
                try:
                    user_details = user.userdetails
                except:
                    user_details = None
                
                users_data.append({
                    'user_id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type.type_name,
                    'is_active': bool(user.is_active),
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'is_verified': bool(user_details.is_verified) if user_details else False,
                    'created_at': user.created_at.isoformat() if user.created_at else '',
                    'last_login': None  # You can implement login tracking
                })
            
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
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch users: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_all_counsellors(request):
    """Get counsellors with filters and statistics for admin panel"""
    if request.method == 'GET':
        try:
            search = request.GET.get('search', '').strip()
            status_filter = request.GET.get('status', 'all').lower()
            verification_filter = request.GET.get('verification', 'all').lower()
            page = int(request.GET.get('page', 1) or 1)
            per_page = int(request.GET.get('per_page', 10) or 10)
            per_page = max(1, min(per_page, 100))

            counsellors_qs = Counsellors.objects.select_related('user', 'user__userdetails').prefetch_related(
                *COUNSELLOR_PREFETCHES
            )

            if status_filter in {'active', 'inactive'}:
                is_active = 1 if status_filter == 'active' else 0
                counsellors_qs = counsellors_qs.filter(user__is_active=is_active)

            if verification_filter in {'verified', 'unverified'}:
                is_verified = 1 if verification_filter == 'verified' else 0
                counsellors_qs = counsellors_qs.filter(user__userdetails__is_verified=is_verified)

            if search:
                counsellors_qs = counsellors_qs.filter(
                    Q(user__username__icontains=search)
                    | Q(user__email__icontains=search)
                    | Q(user__userdetails__full_name__icontains=search)
                    | Q(bio__icontains=search)
                    | Q(specializations__icontains=search)
                    | Q(expertise__icontains=search)
                )

            counsellors_qs = counsellors_qs.order_by('-created_at')

            paginator = Paginator(counsellors_qs, per_page)
            page_obj = paginator.get_page(page)

            counsellor_items = list(page_obj.object_list)
            counsellors_data = [_serialize_counsellor(item) for item in counsellor_items]

            now = timezone.now()
            month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            filtered_ids = counsellors_qs.values_list('counsellor_id', flat=True)

            total_counsellors = counsellors_qs.count()
            active_counsellors = counsellors_qs.filter(user__is_active=1).count()
            students_supported = (
                CounsellingSessions.objects.filter(
                    counsellor_id__in=filtered_ids,
                    status__iexact='completed'
                ).values('student_id').distinct().count()
            )
            sessions_completed = CounsellingSessions.objects.filter(
                counsellor_id__in=filtered_ids,
                status__iexact='completed'
            ).count()
            feedback_qs = CounsellingFeedback.objects.filter(counsellor_id__in=filtered_ids)
            average_rating = _calculate_average_rating(feedback_qs)
            new_this_month = counsellors_qs.filter(created_at__gte=month_start).count()

            verification_counts = {
                'verified': counsellors_qs.filter(user__userdetails__is_verified=1).count(),
                'unverified': counsellors_qs.filter(user__userdetails__is_verified=0).count(),
            }

            status_counts = {
                'active': active_counsellors,
                'inactive': total_counsellors - active_counsellors,
            }

            return JsonResponse({
                'success': True,
                'counsellors': counsellors_data,
                'statistics': {
                    'total': total_counsellors,
                    'active': active_counsellors,
                    'students': students_supported,
                    'sessions': sessions_completed,
                    'avgRating': average_rating,
                    'newThisMonth': new_this_month,
                },
                'filters': {
                    'status': status_filter,
                    'verification': verification_filter,
                    'statusCounts': status_counts,
                    'verificationCounts': verification_counts,
                },
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous(),
                    'per_page': per_page,
                }
            })

        except ValueError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid pagination parameters'
            }, status=400)
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch counsellors: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def get_counsellor_details(request, counsellor_id):
    """Retrieve a single counsellor with associated data"""
    if request.method == 'GET':
        try:
            counsellor = Counsellors.objects.select_related('user', 'user__userdetails').prefetch_related(
                *COUNSELLOR_PREFETCHES
            ).get(counsellor_id=counsellor_id)

            counsellor_data = _serialize_counsellor(counsellor)

            sessions = []
            for session in getattr(counsellor, 'prefetched_sessions', []):
                sessions.append({
                    'sessionId': session.session_id,
                    'topic': session.topic,
                    'status': session.status,
                    'scheduledAt': _format_datetime(getattr(session, 'scheduled_at', None)),
                    'durationMinutes': session.duration_minutes,
                    'sessionType': session.session_type,
                    'studentId': session.student_id,
                    'requestId': getattr(session, 'request_id', None),
                })

            requests_data = []
            for request_obj in getattr(counsellor, 'prefetched_requests', []):
                requests_data.append({
                    'requestId': request_obj.request_id,
                    'topic': request_obj.topic,
                    'status': request_obj.status,
                    'studentId': request_obj.student_id,
                    'preferredTime': request_obj.preferred_time,
                    'sessionType': request_obj.session_type,
                    'urgency': request_obj.urgency,
                    'createdAt': _format_datetime(getattr(request_obj, 'created_at', None)),
                })

            feedback_list = []
            for feedback in getattr(counsellor, 'prefetched_feedback', []):
                feedback_list.append({
                    'feedbackId': feedback.feedback_id,
                    'rating': feedback.rating,
                    'feedback': feedback.feedback_text,
                    'submittedAt': _format_datetime(getattr(feedback, 'submitted_at', None)),
                    'studentId': feedback.student_id,
                })

            return JsonResponse({
                'success': True,
                'counsellor': counsellor_data,
                'sessions': sessions,
                'requests': requests_data,
                'feedback': feedback_list,
            })

        except Counsellors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch counsellor details: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def update_counsellor(request, counsellor_id):
    """Update counsellor profile information"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body or '{}')

            with transaction.atomic():
                counsellor = Counsellors.objects.select_related('user', 'user__userdetails').get(
                    counsellor_id=counsellor_id
                )
                user = counsellor.user
                user_details = getattr(user, 'userdetails', None)
                if user_details is None:
                    user_details = UserDetails.objects.create(user=user)

                full_name = _get_data_value(data, 'fullName', 'full_name')
                if full_name is not None:
                    user_details.full_name = full_name.strip()

                email = data.get('email')
                if email:
                    user.email = email.strip()

                username = data.get('username')
                if username:
                    user.username = username.strip()

                phone = _get_data_value(data, 'phone', 'contact_number', 'contactNumber')
                if phone is not None:
                    user_details.contact_number = phone.strip()

                location = data.get('location')
                if location is not None:
                    user_details.location = location.strip()

                verified_value = _get_data_value(data, 'verified', 'is_verified')
                if verified_value is not None:
                    user_details.is_verified = 1 if bool(verified_value) else 0

                status_value = data.get('status')
                if status_value is not None:
                    user.is_active = 1 if str(status_value).lower() in {'active', 'true', '1'} else 0

                available = _get_data_value(data, 'availableForSessions', 'available_for_sessions')
                if available is not None:
                    counsellor.available_for_sessions = 1 if bool(available) else 0

                experience_years = _get_data_value(data, 'experienceYears', 'experience_years')
                if experience_years is not None:
                    try:
                        counsellor.experience_years = int(experience_years)
                    except (TypeError, ValueError):
                        pass

                languages = _get_data_value(data, 'languages', 'language')
                if languages is not None:
                    if isinstance(languages, str):
                        counsellor.expertise = languages
                    else:
                        counsellor.expertise = ', '.join([str(item).strip() for item in languages])

                specializations = _get_data_value(data, 'specializations', 'specialization')
                if specializations is not None:
                    if isinstance(specializations, str):
                        counsellor.specializations = specializations
                    else:
                        counsellor.specializations = ', '.join([str(item).strip() for item in specializations])

                bio = data.get('bio')
                if bio is not None:
                    counsellor.bio = bio

                education = data.get('education')
                certifications = data.get('certifications')
                if education is not None or certifications is not None:
                    if isinstance(certifications, str):
                        certifications_list = _split_csv(certifications)
                    else:
                        certifications_list = certifications or []
                    counsellor.qualifications = _combine_qualifications(education, certifications_list)

                hourly_rate = data.get('hourlyRate')
                if hourly_rate is not None:
                    try:
                        counsellor.hourly_rate = Decimal(str(hourly_rate))
                    except (InvalidOperation, TypeError, ValueError):
                        pass

                counsellor.updated_at = timezone.now()
                user_details.updated_at = timezone.now()

                user.save()
                user_details.save()
                counsellor.save()

            refreshed = Counsellors.objects.select_related('user', 'user__userdetails').prefetch_related(
                *COUNSELLOR_PREFETCHES
            ).get(counsellor_id=counsellor_id)

            return JsonResponse({
                'success': True,
                'message': 'Counsellor updated successfully',
                'counsellor': _serialize_counsellor(refreshed)
            })

        except Counsellors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Counsellor not found'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON payload'
            }, status=400)
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update counsellor: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def update_counsellor_status(request, counsellor_id):
    """Toggle counsellor active status"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body or '{}')
            status_value = _get_data_value(data, 'status', 'is_active', 'active')
            if status_value is None:
                return JsonResponse({
                    'success': False,
                    'message': 'Status value is required'
                }, status=400)

            counsellor = Counsellors.objects.select_related('user').get(counsellor_id=counsellor_id)
            is_active = 1 if str(status_value).lower() in {'active', 'true', '1'} else 0
            counsellor.user.is_active = is_active
            counsellor.user.save(update_fields=['is_active'])

            return JsonResponse({
                'success': True,
                'message': f'Counsellor marked as {"active" if is_active else "inactive"}',
                'status': 'active' if is_active else 'inactive'
            })

        except Counsellors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Counsellor not found'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON payload'
            }, status=400)
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update counsellor status: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def delete_counsellor(request, counsellor_id):
    """Delete a counsellor and associated user"""
    if request.method == 'DELETE':
        try:
            with transaction.atomic():
                counsellor = Counsellors.objects.select_related('user').get(counsellor_id=counsellor_id)
                user = counsellor.user
                name = getattr(user, 'username', str(counsellor_id))
                counsellor.delete()
                if user:
                    user.delete()

            return JsonResponse({
                'success': True,
                'message': f'Counsellor "{name}" deleted successfully'
            })

        except Counsellors.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as exc:
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete counsellor: {str(exc)}'
            }, status=500)

    return JsonResponse({'success': False, 'message': 'Only DELETE method allowed'}, status=405)


@csrf_exempt
def get_all_students(request):
    """Get all high school students"""
    if request.method == 'GET':
        try:
            # Get query parameters
            stage = request.GET.get('stage', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            students = Students.objects.select_related('user', 'user__userdetails')
            
            # Apply filters
            if stage != 'all':
                students = students.filter(current_stage=stage)
            if search:
                students = students.filter(
                    Q(user__username__icontains=search) | 
                    Q(user__email__icontains=search) |
                    Q(user__userdetails__full_name__icontains=search) |
                    Q(school__icontains=search) |
                    Q(district__icontains=search)
                )
            
            # Order by creation date
            students = students.order_by('-user__created_at')
            
            # Pagination
            paginator = Paginator(students, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            students_data = []
            for student in page_obj:
                try:
                    user_details = student.user.userdetails
                except:
                    user_details = None
                
                students_data.append({
                    'student_id': student.student_id,
                    'user_id': student.user.user_id,
                    'username': student.user.username,
                    'email': student.user.email,
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'current_stage': student.current_stage,
                    'district': student.district or '',
                    'school': student.school or '',
                    'is_active': bool(student.user.is_active),
                    'created_at': student.user.created_at.isoformat() if student.user.created_at else ''
                })
            
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
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch students: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_university_students(request):
    """Get all university students"""
    if request.method == 'GET':
        try:
            # Get query parameters
            university = request.GET.get('university', 'all')
            degree = request.GET.get('degree', 'all')
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            university_students = UniversityStudents.objects.select_related(
                'user', 'user__userdetails', 'university', 'degree_program'
            )
            
            # Apply filters
            if university != 'all':
                university_students = university_students.filter(university_id=university)
            if degree != 'all':
                university_students = university_students.filter(degree_program_id=degree)
            if search:
                university_students = university_students.filter(
                    Q(user__username__icontains=search) | 
                    Q(user__email__icontains=search) |
                    Q(user__userdetails__full_name__icontains=search) |
                    Q(registration_number__icontains=search) |
                    Q(university__name__icontains=search) |
                    Q(degree_program__title__icontains=search)
                )
            
            # Order by creation date
            university_students = university_students.order_by('-user__created_at')
            
            # Pagination
            paginator = Paginator(university_students, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            students_data = []
            for student in page_obj:
                try:
                    user_details = student.user.userdetails
                except:
                    user_details = None
                
                # Calculate graduation year
                graduation_year = ''
                if student.enrollment_date and hasattr(student, 'duration'):
                    try:
                        graduation_year = student.enrollment_date.year + student.duration.duration_years
                    except:
                        graduation_year = ''
                
                students_data.append({
                    'university_student_id': student.university_student_id,
                    'user_id': student.user.user_id,
                    'username': student.user.username,
                    'email': student.user.email,
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'university': student.university.name,
                    'faculty': student.faculty.name if student.faculty else '',
                    'degree_program': student.degree_program.title,
                    'year_of_study': student.year_of_study or '',
                    'registration_number': student.registration_number or '',
                    'enrollment_date': student.enrollment_date.isoformat() if student.enrollment_date else '',
                    'graduation_year': str(graduation_year) if graduation_year else '',
                    'status': student.status or 'active',
                    'is_active': bool(student.user.is_active),
                    'created_at': student.user.created_at.isoformat() if student.user.created_at else ''
                })
            
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
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch university students: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def get_all_universities(request):
    """Get all universities"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build query
            universities = Universities.objects.all()
            
            # Apply filters
            if search:
                universities = universities.filter(
                    Q(name__icontains=search) | 
                    Q(location__icontains=search) |
                    Q(district__icontains=search)
                )
            
            # Order by creation date
            universities = universities.order_by('-created_at')
            
            # Pagination
            paginator = Paginator(universities, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            universities_data = []
            for university in page_obj:
                # Count students
                student_count = UniversityStudents.objects.filter(university=university).count()
                
                # Count faculties
                faculty_count = 0
                try:
                    from apps.universities.models import Faculties
                    faculty_count = Faculties.objects.filter(university=university).count()
                except:
                    faculty_count = 0
                
                universities_data.append({
                    'university_id': university.university_id,
                    'name': university.name,
                    'location': university.location or '',
                    'district': university.district or '',
                    'address': university.address or '',
                    'description': university.description or '',
                    'contact_email': university.contact_email or '',
                    'phone_number': university.phone_number or '',
                    'website': university.website or '',
                    'ugc_ranking': university.ugc_ranking or '',
                    'student_count': student_count,
                    'faculty_count': faculty_count,
                    'established': university.created_at.year if university.created_at else '',
                    'is_active': bool(university.is_active),
                    'created_at': university.created_at.isoformat() if university.created_at else ''
                })
            
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
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch universities: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_student_status(request, student_id):
    """Update student status (active/inactive)"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            is_active = data.get('is_active')
            
            if is_active is None:
                return JsonResponse({
                    'success': False,
                    'message': 'is_active field is required'
                }, status=400)
            
            # Get the student
            student = Students.objects.select_related('user').get(student_id=student_id)
            
            # Update user status
            student.user.is_active = 1 if is_active else 0
            student.user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Student status updated to {"active" if is_active else "inactive"}',
                'student': {
                    'student_id': student.student_id,
                    'is_active': bool(student.user.is_active)
                }
            })
            
        except Students.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Student not found'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
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
            # Get the student
            student = Students.objects.select_related('user').get(student_id=student_id)
            user = student.user
            
            # Delete student record first
            student.delete()
            
            # Delete user record
            user.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Student deleted successfully'
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
def get_student_details(request, student_id):
    """Get detailed information about a specific student"""
    if request.method == 'GET':
        try:
            student = Students.objects.select_related('user', 'user__userdetails').get(student_id=student_id)
            
            try:
                user_details = student.user.userdetails
            except:
                user_details = None
            
            student_data = {
                'student_id': student.student_id,
                'user_id': student.user.user_id,
                'username': student.user.username,
                'email': student.user.email,
                'full_name': user_details.full_name if user_details else '',
                'contact_number': user_details.contact_number if user_details else '',
                'profile_picture': user_details.profile_picture if user_details else '',
                'bio': user_details.bio if user_details else '',
                'location': user_details.location if user_details else '',
                'gender': user_details.gender if user_details else '',
                'is_verified': bool(user_details.is_verified) if user_details else False,
                'current_stage': student.current_stage,
                'district': student.district or '',
                'school': student.school or '',
                'is_active': bool(student.user.is_active),
                'created_at': student.user.created_at.isoformat() if student.user.created_at else '',
                'updated_at': user_details.updated_at.isoformat() if user_details and user_details.updated_at else ''
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
def update_university_student_status(request, university_student_id):
    """Update university student status (active/inactive)"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            is_active = data.get('is_active')
            
            if is_active is None:
                return JsonResponse({
                    'success': False,
                    'message': 'is_active field is required'
                }, status=400)
            
            # Get the university student
            university_student = UniversityStudents.objects.select_related('user').get(university_student_id=university_student_id)
            
            # Update user status
            university_student.user.is_active = 1 if is_active else 0
            university_student.user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'University student status updated to {"active" if is_active else "inactive"}',
                'university_student': {
                    'university_student_id': university_student.university_student_id,
                    'is_active': bool(university_student.user.is_active)
                }
            })
            
        except UniversityStudents.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University student not found'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
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
            # Get the university student
            university_student = UniversityStudents.objects.select_related('user').get(university_student_id=university_student_id)
            user = university_student.user
            
            # Delete university student record first
            university_student.delete()
            
            # Delete user record
            user.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'University student deleted successfully'
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
def get_university_student_details(request, university_student_id):
    """Get detailed information about a specific university student"""
    if request.method == 'GET':
        try:
            university_student = UniversityStudents.objects.select_related(
                'user', 'user__userdetails', 'university', 'degree_program', 'faculty'
            ).get(university_student_id=university_student_id)
            
            try:
                user_details = university_student.user.userdetails
            except:
                user_details = None
            
            university_student_data = {
                'university_student_id': university_student.university_student_id,
                'user_id': university_student.user.user_id,
                'username': university_student.user.username,
                'email': university_student.user.email,
                'full_name': user_details.full_name if user_details else '',
                'contact_number': user_details.contact_number if user_details else '',
                'profile_picture': user_details.profile_picture if user_details else '',
                'bio': user_details.bio if user_details else '',
                'location': user_details.location if user_details else '',
                'gender': user_details.gender if user_details else '',
                'is_verified': bool(user_details.is_verified) if user_details else False,
                'university': university_student.university.name if university_student.university else '',
                'university_id': university_student.university.university_id if university_student.university else None,
                'faculty': university_student.faculty.name if university_student.faculty else '',
                'faculty_id': university_student.faculty.faculty_id if university_student.faculty else None,
                'degree_program': university_student.degree_program.title if university_student.degree_program else '',
                'degree_program_id': university_student.degree_program.degree_program_id if university_student.degree_program else None,
                'year_of_study': university_student.year_of_study or 1,
                'registration_number': university_student.registration_number or '',
                'enrollment_date': university_student.enrollment_date.isoformat() if university_student.enrollment_date else '',
                'status': university_student.status or 'active',
                'is_active': bool(university_student.user.is_active),
                'created_at': university_student.user.created_at.isoformat() if university_student.user.created_at else '',
                'updated_at': user_details.updated_at.isoformat() if user_details and user_details.updated_at else ''
            }
            
            return JsonResponse({
                'success': True,
                'university_student': university_student_data
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
def update_university_student(request, university_student_id):
    """Update university student information"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get the university student
            university_student = UniversityStudents.objects.select_related('user', 'user__userdetails').get(
                university_student_id=university_student_id
            )
            
            user = university_student.user
            
            try:
                user_details = user.userdetails
            except:
                from apps.accounts.models import UserDetails
                user_details = UserDetails.objects.create(user=user)
            
            # Update user information
            if 'email' in data:
                user.email = data['email']
            if 'username' in data:
                user.username = data['username']
            
            # Update user details
            if 'full_name' in data:
                user_details.full_name = data['full_name']
            if 'contact_number' in data:
                user_details.contact_number = data['contact_number']
            if 'location' in data:
                user_details.location = data['location']
            if 'gender' in data:
                user_details.gender = data['gender']
            if 'bio' in data:
                user_details.bio = data['bio']
            
            # Update university student specific information
            if 'year_of_study' in data:
                university_student.year_of_study = data['year_of_study']
            if 'registration_number' in data:
                university_student.registration_number = data['registration_number']
            if 'enrollment_date' in data and data['enrollment_date']:
                from datetime import datetime
                university_student.enrollment_date = datetime.strptime(data['enrollment_date'], '%Y-%m-%d').date()
            if 'status' in data:
                university_student.status = data['status']
            
            # Handle university, faculty, and degree program updates
            if 'university_id' in data and data['university_id']:
                from apps.universities.models import Universities
                university_student.university = Universities.objects.get(university_id=data['university_id'])
            
            if 'faculty_id' in data and data['faculty_id']:
                from apps.universities.models import Faculties
                university_student.faculty = Faculties.objects.get(faculty_id=data['faculty_id'])
            
            if 'degree_program_id' in data and data['degree_program_id']:
                from apps.university_programs.models import DegreePrograms
                university_student.degree_program = DegreePrograms.objects.get(degree_program_id=data['degree_program_id'])
            
            # Save all changes
            user.save()
            user_details.save()
            university_student.save()
            
            return JsonResponse({
                'success': True,
                'message': 'University student updated successfully',
                'university_student': {
                    'university_student_id': university_student.university_student_id,
                    'full_name': user_details.full_name,
                    'email': user.email,
                    'contact_number': user_details.contact_number,
                    'year_of_study': university_student.year_of_study,
                    'registration_number': university_student.registration_number,
                    'is_active': bool(user.is_active)
                }
            })
            
        except UniversityStudents.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University student not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update university student: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def get_university_details(request, university_id):
    """Get detailed university information"""
    if request.method == 'GET':
        try:
            university = Universities.objects.get(university_id=university_id)
            
            university_data = {
                'university_id': university.university_id,
                'name': university.name,
                'location': university.location,
                'district': university.district,
                'address': university.address,
                'contact_email': university.contact_email,
                'phone_number': university.phone_number,
                'website': university.website,
                'description': university.description,
                'logo': university.logo,
                'ugc_ranking': university.ugc_ranking,
                'is_active': university.is_active,
                'created_at': university.created_at.isoformat() if university.created_at else None
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
                'message': f'Failed to get university details: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)


@csrf_exempt
def update_university_status(request, university_id):
    """Update university active status"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            is_active = data.get('is_active')
            
            if is_active is None:
                return JsonResponse({
                    'success': False,
                    'message': 'is_active field is required'
                }, status=400)
            
            university = Universities.objects.get(university_id=university_id)
            university.is_active = bool(is_active)
            university.updated_at = timezone.now()
            university.save()
            
            return JsonResponse({
                'success': True,
                'message': f'University {"activated" if is_active else "deactivated"} successfully',
                'university': {
                    'university_id': university.university_id,
                    'name': university.name,
                    'is_active': university.is_active
                }
            })
            
        except Universities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University not found'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update university status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def delete_university(request, university_id):
    """Delete university"""
    if request.method == 'DELETE':
        try:
            university = Universities.objects.get(university_id=university_id)
            university_name = university.name
            university.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'University "{university_name}" deleted successfully'
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
def update_university(request, university_id):
    """Update university information"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            university = Universities.objects.get(university_id=university_id)
            
            # Update fields if provided
            if 'name' in data:
                university.name = data['name']
            if 'location' in data:
                university.location = data['location']
            if 'district' in data:
                university.district = data['district']
            if 'address' in data:
                university.address = data['address']
            if 'contact_email' in data:
                university.contact_email = data['contact_email']
            if 'phone_number' in data:
                university.phone_number = data['phone_number']
            if 'website' in data:
                university.website = data['website']
            if 'description' in data:
                university.description = data['description']
            if 'logo' in data:
                university.logo = data['logo']
            if 'ugc_ranking' in data:
                university.ugc_ranking = data['ugc_ranking']
            if 'is_active' in data:
                university.is_active = bool(data['is_active'])
            
            university.save()
            
            university_data = {
                'university_id': university.university_id,
                'name': university.name,
                'location': university.location,
                'district': university.district,
                'address': university.address,
                'contact_email': university.contact_email,
                'phone_number': university.phone_number,
                'website': university.website,
                'description': university.description,
                'logo': university.logo,
                'ugc_ranking': university.ugc_ranking,
                'is_active': university.is_active
            }
            
            return JsonResponse({
                'success': True,
                'message': 'University updated successfully',
                'university': university_data
            })
            
        except Universities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'University not found'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update university: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def create_university(request):
    """Create new university"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Required fields validation
            required_fields = ['name', 'location', 'district']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({
                        'success': False,
                        'message': f'{field} is required'
                    }, status=400)
            
            # Create university
            university = Universities.objects.create(
                name=data['name'],
                location=data['location'],
                district=data['district'],
                address=data.get('address', ''),
                contact_email=data.get('contact_email', ''),
                phone_number=data.get('phone_number', ''),
                website=data.get('website', ''),
                description=data.get('description', ''),
                logo=data.get('logo', ''),
                ugc_ranking=data.get('ugc_ranking', None),
                is_active=data.get('is_active', True),
                created_at=timezone.now()
            )
            
            university_data = {
                'university_id': university.university_id,
                'name': university.name,
                'location': university.location,
                'district': university.district,
                'address': university.address,
                'contact_email': university.contact_email,
                'phone_number': university.phone_number,
                'website': university.website,
                'description': university.description,
                'logo': university.logo,
                'ugc_ranking': university.ugc_ranking,
                'is_active': university.is_active,
                'created_at': university.created_at.isoformat() if university.created_at else None
            }
            
            return JsonResponse({
                'success': True,
                'message': 'University created successfully',
                'university': university_data
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to create university: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)


# Company Management Views
@csrf_exempt
def get_all_companies(request):
    """Get all companies with pagination and search"""
    if request.method == 'GET':
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            district = request.GET.get('district', 'all')
            
            # Build query
            companies = Companies.objects.all()
            
            # Apply filters
            if search:
                companies = companies.filter(
                    Q(name__icontains=search) |
                    Q(description__icontains=search) |
                    Q(address__icontains=search) |
                    Q(contact_email__icontains=search)
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
                companies_data.append({
                    'company_id': company.company_id,
                    'name': company.name,
                    'description': company.description,
                    'address': company.address,
                    'district': company.district,
                    'contact_email': company.contact_email,
                    'contact_phone': company.contact_phone,
                    'website': company.website,
                    'created_at': company.created_at.isoformat() if company.created_at else None,
                })
            
            return JsonResponse({
                'success': True,
                'companies': companies_data,
                'pagination': {
                    'current_page': page_obj.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'per_page': per_page,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous(),
                }
            })
            
        except Exception as e:
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
                'name': company.name,
                'description': company.description,
                'address': company.address,
                'district': company.district,
                'contact_email': company.contact_email,
                'contact_phone': company.contact_phone,
                'website': company.website,
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
def update_company(request, company_id):
    """Update company information"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            company = Companies.objects.get(company_id=company_id)
            
            # Update fields
            company.name = data.get('name', company.name)
            company.description = data.get('description', company.description)
            company.address = data.get('address', company.address)
            company.district = data.get('district', company.district)
            company.contact_email = data.get('contact_email', company.contact_email)
            company.contact_phone = data.get('contact_phone', company.contact_phone)
            company.website = data.get('website', company.website)
            
            company.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Company updated successfully',
                'company': {
                    'company_id': company.company_id,
                    'name': company.name,
                    'description': company.description,
                    'address': company.address,
                    'district': company.district,
                    'contact_email': company.contact_email,
                    'contact_phone': company.contact_phone,
                    'website': company.website,
                    'created_at': company.created_at.isoformat() if company.created_at else None,
                }
            })
            
        except Companies.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Company not found'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to update company: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only PUT method allowed'}, status=405)


@csrf_exempt
def delete_company(request, company_id):
    """Delete a company"""
    if request.method == 'DELETE':
        try:
            company = Companies.objects.get(company_id=company_id)
            company_name = company.name
            company.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Company "{company_name}" deleted successfully'
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
def create_company(request):
    """Create a new company"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['name', 'contact_email']
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({
                        'success': False,
                        'message': f'{field} is required'
                    }, status=400)
            
            # Create company
            company = Companies.objects.create(
                name=data['name'],
                description=data.get('description', ''),
                address=data.get('address', ''),
                district=data.get('district', ''),
                contact_email=data['contact_email'],
                contact_phone=data.get('contact_phone', ''),
                website=data.get('website', ''),
                created_at=timezone.now()
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Company created successfully',
                'company': {
                    'company_id': company.company_id,
                    'name': company.name,
                    'description': company.description,
                    'address': company.address,
                    'district': company.district,
                    'contact_email': company.contact_email,
                    'contact_phone': company.contact_phone,
                    'website': company.website,
                    'created_at': company.created_at.isoformat() if company.created_at else None,
                }
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to create company: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)