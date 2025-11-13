from __future__ import annotations

from io import BytesIO
from typing import Dict, List

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def _title_case(value: str) -> str:
    if not value:
        return 'Unknown'
    return value.replace('_', ' ').replace('-', ' ').title()


def _build_section_title(text: str) -> Paragraph:
    styles = getSampleStyleSheet()
    return Paragraph(text, styles['Heading2'])


def _build_key_value_table(data: List[List[str]]) -> Table:
    table = Table(data, hAlign='LEFT', colWidths=[2.8 * inch, 2.0 * inch])
    table.setStyle(
        TableStyle(
            [
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F3F4F6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1F2937')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
            ]
        )
    )
    return table


def _build_table(title: str, headers: List[str], rows: List[List[str]]) -> List:
    story: List = []
    story.append(Paragraph(title, ParagraphStyle(name='SectionTitle', fontSize=12, leading=15, spaceAfter=6, fontName='Helvetica-Bold')))
    table_data = [headers] + rows if rows else [headers, ['No data available'] + [''] * (len(headers) - 1)]
    table = Table(table_data, hAlign='LEFT')
    table.setStyle(
        TableStyle(
            [
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1D4ED8')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')]),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 12))
    return story


def generate_admin_report_pdf(report_data: Dict[str, object]) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=48,
        bottomMargin=48,
    )

    styles = getSampleStyleSheet()
    story: List = []

    metadata = report_data.get('metadata', {})
    title = Paragraph('UniRoute Platform Performance Report', styles['Title'])
    period = Paragraph(
        f"Reporting Period: <b>{metadata.get('start', '')[:10]}</b> to <b>{metadata.get('end', '')[:10]}</b>",
        styles['Normal'],
    )

    story.extend([title, Spacer(1, 6), period, Spacer(1, 18)])

    # User management overview
    user_data = report_data.get('user_management', {})
    user_table_rows = [
        ['Total New Users', f"{user_data.get('total_new_users', 0):,}"],
        ['Active Users (All-time)', f"{user_data.get('active_users_total', 0):,}"],
        ['Inactive Users (All-time)', f"{user_data.get('inactive_users_total', 0):,}"],
    ]
    story.append(_build_section_title('User Management Highlights'))
    story.append(_build_key_value_table([['Metric', 'Value']] + user_table_rows))
    story.append(Spacer(1, 18))

    breakdown_rows = [
        [_title_case(item['user_type__type_name']), f"{item['count']:,}"]
        for item in user_data.get('breakdown', [])
    ]
    story.extend(
        _build_table('User Registrations by Type', ['User Type', 'New Registrations'], breakdown_rows)
    )

    # Content overview
    content_data = report_data.get('content', {})
    content_rows = [
        ['Courses Created', f"{content_data.get('courses_created', 0):,}"],
        ['Courses Published', f"{content_data.get('courses_published', 0):,}"],
        ['Mentoring Sessions Created', f"{content_data.get('mentoring_sessions_created', 0):,}"],
        ['Mentoring Sessions Completed', f"{content_data.get('mentoring_sessions_completed', 0):,}"],
        ['Tutoring Sessions Created', f"{content_data.get('tutoring_sessions_created', 0):,}"],
        ['Tutoring Sessions Completed', f"{content_data.get('tutoring_sessions_completed', 0):,}"],
    ]
    story.append(_build_section_title('Content Performance'))
    story.append(_build_key_value_table([['Metric', 'Value']] + content_rows))
    story.append(Spacer(1, 18))

    popular_courses = content_data.get('popular_courses', [])
    popular_rows = [
        [course['course__title'], f"{course['enrollments']:,}"]
        for course in popular_courses
    ]
    story.extend(
        _build_table('Top Enrolled Courses', ['Course', 'Enrollments'], popular_rows)
    )

    # Earnings
    earnings_data = report_data.get('tutoring_earnings', {})
    earnings_rows = [
        ['Total Revenue', f"LKR {earnings_data.get('total_revenue', 0):,.2f}"],
        ['Payments Count', f"{earnings_data.get('payment_count', 0):,}"],
        ['Average Payment', f"LKR {earnings_data.get('average_payment', 0.0):,.2f}"],
    ]
    story.append(_build_section_title('Tutoring Earnings'))
    story.append(_build_key_value_table([['Metric', 'Value']] + earnings_rows))
    story.append(Spacer(1, 18))

    top_tutors = earnings_data.get('top_tutors', [])
    tutor_rows = [
        [
            item['tutor_username'] or f"Tutor #{item['tutor_id']}",
            f"{item['sessions']:,}",
            f"LKR {item['total_earnings']:,.2f}",
        ]
        for item in top_tutors
    ]
    story.extend(
        _build_table('Top Performing Tutors', ['Tutor', 'Sessions', 'Earnings'], tutor_rows)
    )

    doc.build(story)
    pdf_content = buffer.getvalue()
    buffer.close()
    return pdf_content
