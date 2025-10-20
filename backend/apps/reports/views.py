from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Optional

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.http import FileResponse, HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.db import ProgrammingError

from apps.accounts.models import Users

from .models import AdminReportRecord
from .pdf import generate_admin_report_pdf
from .services import InvalidDateRange, build_date_range, collect_report_data


DATE_FORMAT = '%Y-%m-%d'
DEFAULT_HISTORY_LIMIT = 10


def _parse_dates(start_str: str, end_str: str):
    try:
        start = datetime.strptime(start_str, DATE_FORMAT).date()
        end = datetime.strptime(end_str, DATE_FORMAT).date()
        return start, end
    except (TypeError, ValueError) as exc:
        raise InvalidDateRange('Invalid date format. Use YYYY-MM-DD.') from exc


def _serialize_report(record: AdminReportRecord, request: HttpRequest) -> dict:
    relative_path = f"{settings.MEDIA_URL}{record.file_path}".replace('\\', '/')
    download_url = request.build_absolute_uri(relative_path)
    return {
        'report_id': record.report_id,
        'title': record.title,
        'start_date': record.start_date.isoformat(),
        'end_date': record.end_date.isoformat(),
        'requested_by': record.requested_by.user_id if record.requested_by else None,
        'requested_by_username': record.requested_by.username if record.requested_by else None,
        'download_url': download_url,
        'file_size': record.file_size,
        'created_at': record.created_at.isoformat(),
        'data_snapshot': record.data_snapshot,
    }


def _resolve_user(user_id: Optional[int]) -> Optional[Users]:
    if not user_id:
        return None
    try:
        return Users.objects.get(user_id=user_id)
    except Users.DoesNotExist:
        return None


@csrf_exempt
def admin_report_overview(request: HttpRequest) -> HttpResponse:
    if request.method != 'GET':
        return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

    start_raw = request.GET.get('start_date')
    end_raw = request.GET.get('end_date')

    if not start_raw or not end_raw:
        return JsonResponse({'success': False, 'message': 'start_date and end_date are required'}, status=400)

    try:
        start_date, end_date = _parse_dates(start_raw, end_raw)
        date_range = build_date_range(start_date, end_date)
    except InvalidDateRange as exc:
        return JsonResponse({'success': False, 'message': str(exc)}, status=400)

    report_data = collect_report_data(date_range)
    return JsonResponse({'success': True, 'data': report_data})


@csrf_exempt
def generate_admin_report(request: HttpRequest) -> HttpResponse:
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

    try:
        payload = json.loads(request.body.decode('utf-8')) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON payload'}, status=400)

    start_raw = payload.get('start_date')
    end_raw = payload.get('end_date')
    if not start_raw or not end_raw:
        return JsonResponse({'success': False, 'message': 'start_date and end_date are required'}, status=400)

    requested_by = _resolve_user(payload.get('requested_by'))

    try:
        start_date, end_date = _parse_dates(start_raw, end_raw)
        date_range = build_date_range(start_date, end_date)
    except InvalidDateRange as exc:
        return JsonResponse({'success': False, 'message': str(exc)}, status=400)

    report_data = collect_report_data(date_range)
    pdf_bytes = generate_admin_report_pdf(report_data)

    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    filename = f"admin-report-{start_date}-{end_date}-{timestamp}.pdf"
    storage_path = os.path.join('reports', filename)
    saved_path = default_storage.save(storage_path, ContentFile(pdf_bytes))

    download_url = request.build_absolute_uri(f"{settings.MEDIA_URL}{saved_path}".replace('\\', '/'))
    title = f"Platform Performance Report ({start_date} - {end_date})"

    try:
        record = AdminReportRecord.objects.create(
            title=title,
            start_date=start_date,
            end_date=end_date,
            requested_by=requested_by,
            file_path=saved_path,
            file_size=len(pdf_bytes),
            data_snapshot=report_data,
        )
    except ProgrammingError:
        report_payload = {
            'report_id': None,
            'title': title,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'requested_by': requested_by.user_id if requested_by else None,
            'requested_by_username': requested_by.username if requested_by else None,
            'download_url': download_url,
            'file_size': len(pdf_bytes),
            'created_at': timezone.now().isoformat(),
            'data_snapshot': report_data,
            'persisted': False,
        }
    else:
        serialized = _serialize_report(record, request)
        serialized['persisted'] = True
        report_payload = serialized

    response_data = {'success': True, 'report': report_payload}
    return JsonResponse(response_data, status=201)


@csrf_exempt
def list_admin_reports(request: HttpRequest) -> HttpResponse:
    if request.method != 'GET':
        return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

    limit_raw = request.GET.get('limit')
    try:
        limit = int(limit_raw) if limit_raw else DEFAULT_HISTORY_LIMIT
    except ValueError:
        limit = DEFAULT_HISTORY_LIMIT

    try:
        records = AdminReportRecord.objects.all()[: max(limit, 1)]
    except ProgrammingError:
        return JsonResponse({'success': True, 'reports': []})

    reports = []
    for record in records:
        serialized = _serialize_report(record, request)
        serialized['persisted'] = True
        reports.append(serialized)
    return JsonResponse({'success': True, 'reports': reports})


@csrf_exempt
def download_admin_report(request: HttpRequest, report_id: int) -> HttpResponse:
    if request.method != 'GET':
        return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

    try:
        record = get_object_or_404(AdminReportRecord, report_id=report_id)
    except ProgrammingError:
        return JsonResponse({'success': False, 'message': 'Report history is not available yet.'}, status=503)

    file_handle = default_storage.open(record.file_path, 'rb')
    response = FileResponse(file_handle, as_attachment=True, filename=os.path.basename(record.file_path))
    response['Content-Type'] = 'application/pdf'
    return response
