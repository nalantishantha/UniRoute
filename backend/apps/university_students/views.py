from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import UniversityStudents
from apps.accounts.models import Users


@csrf_exempt
@require_http_methods(["GET"])
def get_university_student_by_user(request, user_id):
    """Get university student information by user ID"""
    try:
        university_student = UniversityStudents.objects.get(user__user_id=user_id)
        
        return JsonResponse({
            'success': True,
            'university_student_id': university_student.university_student_id,
            'user_id': university_student.user.user_id,
            'university_id': university_student.university.university_id,
            'degree_program_id': university_student.degree_program.degree_program_id,
            'year_of_study': university_student.year_of_study,
            'registration_number': university_student.registration_number,
            'status': university_student.status,
        })
    
    except UniversityStudents.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'No university student record found for this user'
        }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, F, Value, CharField
from django.db.models.functions import Concat
from django.utils import timezone
from datetime import datetime
import json

from .models import UniversityStudents
from apps.mentoring.models import MentoringFeedback, MentoringSessions, Mentors
from apps.tutoring.models import TutorFeedback, Tutors
from apps.accounts.models import Users, UserDetails
from apps.students.models import Students


@csrf_exempt
def get_university_student_feedback(request, user_id):
    """
    Get all feedback (mentoring and tutoring) for a specific university student
    with filtering capabilities
    """
    if request.method == 'GET':
        try:
            # Get query parameters for filtering
            service_type = request.GET.get('service_type', 'all')  # 'mentoring', 'tutoring', or 'all'
            sentiment = request.GET.get('sentiment', 'all')  # 'positive', 'neutral', 'negative', or 'all'
            search = request.GET.get('search', '')
            
            # Find university student by user_id
            try:
                university_student = UniversityStudents.objects.get(user_id=user_id)
            except UniversityStudents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University student not found for this user'
                }, status=404)
            
            feedback_list = []
            
            # Get mentoring feedback if requested
            if service_type in ['all', 'mentoring']:
                mentoring_feedback = get_mentoring_feedback(university_student, search, sentiment)
                feedback_list.extend(mentoring_feedback)
            
            # Get tutoring feedback if requested  
            if service_type in ['all', 'tutoring']:
                tutoring_feedback = get_tutoring_feedback(university_student, search, sentiment)
                feedback_list.extend(tutoring_feedback)
            
            # Sort by date (newest first)
            feedback_list.sort(key=lambda x: x['date'], reverse=True)
            
            # Calculate statistics
            stats = calculate_feedback_stats(feedback_list)
            
            return JsonResponse({
                'success': True,
                'feedback': feedback_list,
                'stats': stats,
                'total_count': len(feedback_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching feedback: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


def get_mentoring_feedback(university_student, search_term, sentiment_filter):
    """Get mentoring feedback for the university student"""
    feedback_list = []
    
    try:
        # Find mentoring sessions where this university student was the mentor
        mentor = Mentors.objects.filter(university_student=university_student).first()
        
        if mentor:
            # Use raw SQL to avoid JSON parsing issues
            from django.db import connection
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        mf.feedback_id,
                        mf.rating,
                        mf.feedback,
                        mf.submitted_at,
                        ms.topic,
                        ms.session_id,
                        s.student_id,
                        u.user_id,
                        u.username,
                        u.email,
                        ud.full_name
                    FROM mentoring_feedback mf
                    JOIN mentoring_sessions ms ON mf.session_id = ms.session_id
                    JOIN students s ON mf.student_id = s.student_id
                    JOIN users u ON s.user_id = u.user_id
                    LEFT JOIN user_details ud ON u.user_id = ud.user_id
                    WHERE ms.mentor_id = %s
                """, [mentor.mentor_id])
                
                for row in cursor.fetchall():
                    try:
                        feedback_id, rating_raw, feedback_text, submitted_at, topic, session_id, student_id, user_id, username, email, full_name = row
                        
                        # Get student name
                        student_name = full_name if full_name else username
                        
                        # Handle rating field safely - it might be integer or JSON string
                        rating_value = 0
                        if rating_raw:
                            if isinstance(rating_raw, (int, float)):
                                rating_value = int(rating_raw)
                            elif isinstance(rating_raw, str):
                                try:
                                    import json
                                    rating_data = json.loads(rating_raw)
                                    rating_value = rating_data.get('overall', 0) if isinstance(rating_data, dict) else 0
                                except (json.JSONDecodeError, AttributeError):
                                    # If it's not valid JSON, try to parse as number
                                    try:
                                        rating_value = int(rating_raw)
                                    except (ValueError, TypeError):
                                        rating_value = 0
                        
                        # Determine sentiment based on rating
                        if rating_value >= 4:
                            sentiment = 'positive'
                        elif rating_value >= 3:
                            sentiment = 'neutral'
                        else:
                            sentiment = 'negative'
                        
                        # Apply sentiment filter
                        if sentiment_filter != 'all' and sentiment != sentiment_filter:
                            continue
                        
                        feedback_text = feedback_text or ''
                        
                        # Apply search filter
                        if search_term and not any([
                            search_term.lower() in student_name.lower(),
                            search_term.lower() in (topic or '').lower(),
                            search_term.lower() in feedback_text.lower()
                        ]):
                            continue
                        
                        feedback_item = {
                            'id': f"mentoring_{feedback_id}",
                            'service_type': 'mentoring',
                            'student': student_name,
                            'student_email': email,
                            'course': topic or 'Mentoring Session',
                            'rating': rating_value,
                            'sentiment': sentiment,
                            'comment': feedback_text,
                            'date': submitted_at.strftime('%Y-%m-%d') if submitted_at else timezone.now().strftime('%Y-%m-%d'),
                            'isRead': True,  # You can modify this based on your read status logic
                            'hasReply': False,  # You can modify this based on your reply logic
                            'avatar': None,  # You can add avatar logic here
                            'session_details': {
                                'topic': topic,
                                'session_type': 'mentoring',
                                'duration': 'Variable'
                            }
                        }
                        
                        feedback_list.append(feedback_item)
                        
                    except Exception as e:
                        print(f"Error processing mentoring feedback {feedback_id if 'feedback_id' in locals() else 'unknown'}: {str(e)}")
                        continue
    
    except Exception as e:
        print(f"Error fetching mentoring feedback: {str(e)}")
    
    return feedback_list


def get_tutoring_feedback(university_student, search_term, sentiment_filter):
    """Get tutoring feedback for the university student"""
    feedback_list = []
    
    try:
        # Find tutoring sessions where this university student was the tutor
        tutor = Tutors.objects.filter(university_student=university_student).first()
        
        if tutor:
            tutoring_feedback = TutorFeedback.objects.filter(tutor=tutor).select_related('user')
            
            for feedback in tutoring_feedback:
                try:
                    # Get student details
                    student_user = feedback.user
                    student_details = UserDetails.objects.filter(user=student_user).first()
                    student_name = student_details.full_name if student_details else student_user.username
                    
                    # Extract rating from JSON field (same as mentoring feedback)
                    rating_data = feedback.rating if feedback.rating else {}
                    rating_value = rating_data.get('overall', 0) if isinstance(rating_data, dict) else 0
                    
                    # Determine sentiment based on rating
                    if rating_value >= 4:
                        sentiment = 'positive'
                    elif rating_value >= 3:
                        sentiment = 'neutral'
                    else:
                        sentiment = 'negative'
                    
                    # Apply sentiment filter
                    if sentiment_filter != 'all' and sentiment != sentiment_filter:
                        continue
                    
                    feedback_text = feedback.feedback or ''
                    
                    # Apply search filter
                    if search_term and not any([
                        search_term.lower() in student_name.lower(),
                        search_term.lower() in feedback_text.lower()
                    ]):
                        continue
                    
                    feedback_item = {
                        'id': f"tutoring_{feedback.feedback_id}",
                        'service_type': 'tutoring',
                        'student': student_name,
                        'student_email': student_user.email,
                        'course': 'Tutoring Session',  # You can enhance this to get actual subject/course
                        'rating': rating_value,
                        'sentiment': sentiment,
                        'comment': feedback_text,
                        'date': feedback.created_at.strftime('%Y-%m-%d') if feedback.created_at else timezone.now().strftime('%Y-%m-%d'),
                        'isRead': True,  # You can modify this based on your read status logic
                        'hasReply': False,  # You can modify this based on your reply logic
                        'avatar': None,  # You can add avatar logic here
                        'session_details': {
                            'topic': 'Tutoring',
                            'session_type': 'tutoring',
                            'duration': 'Variable'
                        }
                    }
                    
                    feedback_list.append(feedback_item)
                    
                except Exception as e:
                    print(f"Error processing tutoring feedback {feedback.feedback_id}: {str(e)}")
                    continue
    
    except Exception as e:
        print(f"Error fetching tutoring feedback: {str(e)}")
    
    return feedback_list


def analyze_sentiment_from_text(text):
    """
    Simple sentiment analysis based on keywords
    Returns (sentiment, rating_value)
    """
    if not text:
        return 'neutral', 3
    
    text_lower = text.lower()
    
    # Positive keywords
    positive_keywords = [
        'excellent', 'amazing', 'great', 'fantastic', 'wonderful', 'perfect',
        'outstanding', 'brilliant', 'superb', 'awesome', 'love', 'best',
        'highly recommend', 'very good', 'impressive', 'helpful', 'clear'
    ]
    
    # Negative keywords
    negative_keywords = [
        'terrible', 'awful', 'bad', 'poor', 'disappointing', 'waste',
        'useless', 'confusing', 'unclear', 'difficult', 'struggled',
        'not helpful', 'disappointing', 'boring', 'worst'
    ]
    
    positive_count = sum(1 for keyword in positive_keywords if keyword in text_lower)
    negative_count = sum(1 for keyword in negative_keywords if keyword in text_lower)
    
    if positive_count > negative_count and positive_count > 0:
        return 'positive', 4 + min(positive_count, 1)  # 4-5 rating
    elif negative_count > positive_count and negative_count > 0:
        return 'negative', max(1, 3 - negative_count)  # 1-2 rating
    else:
        return 'neutral', 3  # 3 rating


def calculate_feedback_stats(feedback_list):
    """Calculate statistics for the feedback"""
    if not feedback_list:
        return {
            'total_feedback': 0,
            'average_rating': 0,
            'unread_count': 0,
            'response_rate': 0,
            'positive': 0,
            'neutral': 0,
            'negative': 0,
            'mentoring_count': 0,
            'tutoring_count': 0
        }
    
    total_feedback = len(feedback_list)
    total_rating = sum(item['rating'] for item in feedback_list if item['rating'])
    average_rating = round(total_rating / total_feedback, 1) if total_feedback > 0 else 0
    
    unread_count = len([item for item in feedback_list if not item['isRead']])
    replied_count = len([item for item in feedback_list if item['hasReply']])
    response_rate = round((replied_count / total_feedback) * 100) if total_feedback > 0 else 0
    
    positive = len([item for item in feedback_list if item['sentiment'] == 'positive'])
    neutral = len([item for item in feedback_list if item['sentiment'] == 'neutral'])
    negative = len([item for item in feedback_list if item['sentiment'] == 'negative'])
    
    mentoring_count = len([item for item in feedback_list if item['service_type'] == 'mentoring'])
    tutoring_count = len([item for item in feedback_list if item['service_type'] == 'tutoring'])
    
    return {
        'total_feedback': total_feedback,
        'average_rating': average_rating,
        'unread_count': unread_count,
        'response_rate': response_rate,
        'positive': positive,
        'neutral': neutral,
        'negative': negative,
        'mentoring_count': mentoring_count,
        'tutoring_count': tutoring_count
    }


@csrf_exempt
def export_feedback_report(request, user_id):
    """
    Export feedback report as PDF for a specific university student
    """
    if request.method == 'GET':
        try:
            from django.http import HttpResponse
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import letter, A4
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from io import BytesIO
            import datetime as dt
            
            # Get query parameters for filtering
            service_type = request.GET.get('service_type', 'all')
            sentiment = request.GET.get('sentiment', 'all')
            search = request.GET.get('search', '')
            
            # Find university student by user_id
            try:
                university_student = UniversityStudents.objects.get(user_id=user_id)
            except UniversityStudents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University student not found for this user'
                }, status=404)
            
            feedback_list = []
            
            # Get mentoring feedback if requested
            if service_type in ['all', 'mentoring']:
                mentoring_feedback = get_mentoring_feedback(university_student, search, sentiment)
                feedback_list.extend(mentoring_feedback)
            
            # Get tutoring feedback if requested  
            if service_type in ['all', 'tutoring']:
                tutoring_feedback = get_tutoring_feedback(university_student, search, sentiment)
                feedback_list.extend(tutoring_feedback)
            
            # Sort by date (newest first)
            feedback_list.sort(key=lambda x: x['date'], reverse=True)
            
            # Calculate statistics
            stats = calculate_feedback_stats(feedback_list)
            
            # Create PDF
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4)
            story = []
            
            # Get styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                textColor=colors.HexColor('#2563eb'),
                alignment=1  # Center alignment
            )
            
            # Add title
            story.append(Paragraph("Feedback Report", title_style))
            story.append(Spacer(1, 20))
            
            # Add report info
            report_info = [
                ["Report Generated:", dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")],
                ["University Student ID:", str(university_student.university_student_id)],
                ["Service Type Filter:", service_type.title()],
                ["Total Feedback:", str(stats['total_feedback'])],
                ["Average Rating:", f"{stats['average_rating']}/5"],
            ]
            
            info_table = Table(report_info, colWidths=[2*inch, 3*inch])
            info_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(info_table)
            story.append(Spacer(1, 20))
            
            # Add statistics summary
            stats_data = [
                ["Metric", "Count", "Percentage"],
                ["Positive Feedback", str(stats['positive']), f"{(stats['positive']/stats['total_feedback']*100):.1f}%" if stats['total_feedback'] > 0 else "0%"],
                ["Neutral Feedback", str(stats['neutral']), f"{(stats['neutral']/stats['total_feedback']*100):.1f}%" if stats['total_feedback'] > 0 else "0%"],
                ["Negative Feedback", str(stats['negative']), f"{(stats['negative']/stats['total_feedback']*100):.1f}%" if stats['total_feedback'] > 0 else "0%"],
                ["Mentoring Sessions", str(stats['mentoring_count']), f"{(stats['mentoring_count']/stats['total_feedback']*100):.1f}%" if stats['total_feedback'] > 0 else "0%"],
                ["Tutoring Sessions", str(stats['tutoring_count']), f"{(stats['tutoring_count']/stats['total_feedback']*100):.1f}%" if stats['total_feedback'] > 0 else "0%"],
            ]
            
            stats_table = Table(stats_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
            stats_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
            ]))
            
            story.append(Paragraph("Feedback Statistics", styles['Heading2']))
            story.append(Spacer(1, 10))
            story.append(stats_table)
            story.append(Spacer(1, 30))
            
            # Add detailed feedback
            if feedback_list:
                story.append(Paragraph("Detailed Feedback", styles['Heading2']))
                story.append(Spacer(1, 10))
                
                feedback_data = [["Date", "Student", "Service", "Rating", "Sentiment", "Comment"]]
                
                for feedback in feedback_list:
                    # Truncate long comments for the table
                    comment = feedback['comment'][:100] + "..." if len(feedback['comment']) > 100 else feedback['comment']
                    
                    feedback_data.append([
                        feedback['date'],
                        feedback['student'],
                        feedback['service_type'].title(),
                        f"{feedback['rating']}/5",
                        feedback['sentiment'].title(),
                        comment
                    ])
                
                feedback_table = Table(feedback_data, colWidths=[0.8*inch, 1.2*inch, 0.8*inch, 0.6*inch, 0.8*inch, 2.8*inch])
                feedback_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 8),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                
                story.append(feedback_table)
            else:
                story.append(Paragraph("No feedback found for the selected criteria.", styles['Normal']))
            
            # Build PDF
            doc.build(story)
            
            # Get PDF data
            pdf_data = buffer.getvalue()
            buffer.close()
            
            # Create response
            response = HttpResponse(pdf_data, content_type='application/pdf')
            filename = f"feedback_report_{user_id}_{dt.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error generating PDF report: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)
