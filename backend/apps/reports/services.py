from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time
from typing import Dict

from django.db import OperationalError
from django.db.models import Count, Q, Sum
from django.utils import timezone

from apps.accounts.models import Users
from apps.mentoring.models import MentoringSessions
from apps.payments.models import TutoringPayments
from apps.pre_university_courses.models import CourseEnrollment, PreUniversityCourse
from apps.tutoring.models import TutoringSessions


@dataclass(frozen=True)
class DateRange:
    start: datetime
    end: datetime


class InvalidDateRange(ValueError):
    """Raised when the provided date range is invalid."""


def _ensure_aware(value: datetime) -> datetime:
    if timezone.is_aware(value):
        return value
    return timezone.make_aware(value, timezone.get_current_timezone())


def build_date_range(start_date: date, end_date: date) -> DateRange:
    if start_date > end_date:
        raise InvalidDateRange('Start date must be before or equal to end date')

    start_dt = datetime.combine(start_date, time.min)
    end_dt = datetime.combine(end_date, time.max)
    return DateRange(start=_ensure_aware(start_dt), end=_ensure_aware(end_dt))


def _tutoring_payments_within(date_range: DateRange):
    return TutoringPayments.objects.filter(
        (
            Q(paid_at__isnull=False)
            & Q(paid_at__gte=date_range.start)
            & Q(paid_at__lte=date_range.end)
        )
        |
        (
            Q(paid_at__isnull=True)
            & Q(created_at__isnull=False)
            & Q(created_at__gte=date_range.start)
            & Q(created_at__lte=date_range.end)
        )
    )


def collect_report_data(date_range: DateRange) -> Dict[str, object]:
    users_qs = Users.objects.filter(
        created_at__isnull=False,
        created_at__gte=date_range.start,
        created_at__lte=date_range.end,
    )

    user_breakdown = (
        users_qs.values('user_type__type_name')
        .annotate(count=Count('user_id'))
        .order_by('-count')
    )

    active_users_total = Users.objects.filter(is_active=1).count()
    inactive_users_total = Users.objects.filter(Q(is_active=0) | Q(is_active__isnull=True)).count()

    courses_created = PreUniversityCourse.objects.filter(
        created_at__gte=date_range.start,
        created_at__lte=date_range.end,
    )

    mentoring_sessions = MentoringSessions.objects.filter(
        created_at__gte=date_range.start,
        created_at__lte=date_range.end,
    )

    tutoring_sessions = TutoringSessions.objects.filter(
        created_at__gte=date_range.start,
        created_at__lte=date_range.end,
    )

    tutoring_payments = _tutoring_payments_within(date_range)

    total_revenue = tutoring_payments.aggregate(total=Sum('amount'))['total'] or 0
    payment_count = tutoring_payments.count()

    try:
        top_tutors_raw = list(
            tutoring_payments.values(
                'session__tutor__tutor_id',
                'session__tutor__user__username',
            )
            .annotate(total_earnings=Sum('amount'), sessions=Count('session', distinct=True))
            .order_by('-total_earnings')[:5]
        )
    except OperationalError:
        top_tutors_raw = []

    try:
        popular_courses = list(
            CourseEnrollment.objects.filter(
                enrolled_at__gte=date_range.start,
                enrolled_at__lte=date_range.end,
            )
            .values('course__title')
            .annotate(enrollments=Count('id'))
            .order_by('-enrollments')[:5]
        )
    except OperationalError:
        popular_courses = []

    return {
        'metadata': {
            'start': date_range.start.isoformat(),
            'end': date_range.end.isoformat(),
            'generated_at': timezone.now().isoformat(),
        },
        'user_management': {
            'total_new_users': users_qs.count(),
            'active_users_total': active_users_total,
            'inactive_users_total': inactive_users_total,
            'breakdown': list(user_breakdown),
        },
        'content': {
            'courses_created': courses_created.count(),
            'courses_published': courses_created.filter(status='published').count(),
            'mentoring_sessions_created': mentoring_sessions.count(),
            'mentoring_sessions_completed': mentoring_sessions.filter(status='completed').count(),
            'tutoring_sessions_created': tutoring_sessions.count(),
            'tutoring_sessions_completed': tutoring_sessions.filter(status='completed').count(),
            'popular_courses': list(popular_courses),
        },
        'tutoring_earnings': {
            'total_revenue': float(total_revenue),
            'payment_count': payment_count,
            'average_payment': float(total_revenue / payment_count) if payment_count else 0.0,
            'top_tutors': [
                {
                    'tutor_id': item['session__tutor__tutor_id'],
                    'tutor_username': item['session__tutor__user__username'],
                    'total_earnings': float(item['total_earnings'] or 0),
                    'sessions': item['sessions'],
                }
                for item in top_tutors_raw
            ],
        },
    }
