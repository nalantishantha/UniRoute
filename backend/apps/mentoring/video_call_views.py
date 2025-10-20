"""
REST API views for video call management
"""
import uuid
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import VideoCallRoom, VideoCallParticipant, MentoringSessions, Mentors
from apps.students.models import Students


@csrf_exempt
@require_http_methods(["POST"])
def create_video_room(request):
    """
    Create a new video call room for a mentoring session
    
    POST /api/mentoring/video-call/create/
    Body: {
        "session_id": 1,
        "mentor_id": 1,
        "student_id": 1
    }
    """
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        mentor_id = data.get('mentor_id')
        student_id = data.get('student_id')
        
        if not all([mentor_id, student_id]):
            return JsonResponse({
                'error': 'mentor_id and student_id are required'
            }, status=400)
        
        # Verify mentor and student exist
        try:
            mentor = Mentors.objects.get(mentor_id=mentor_id)
            student = Students.objects.get(student_id=student_id)
        except (Mentors.DoesNotExist, Students.DoesNotExist):
            return JsonResponse({
                'error': 'Invalid mentor_id or student_id'
            }, status=404)
        
        # Get session if provided
        session = None
        if session_id:
            try:
                session = MentoringSessions.objects.get(session_id=session_id)
            except MentoringSessions.DoesNotExist:
                pass
        
        # Generate unique room ID
        room_id = f"room_{uuid.uuid4().hex[:12]}"
        
        # Create video call room
        room = VideoCallRoom.objects.create(
            room_id=room_id,
            session=session,
            mentor=mentor,
            student=student,
            status='waiting'
        )
        
        return JsonResponse({
            'success': True,
            'room_id': room.room_id,
            'websocket_url': f'ws://localhost:8000/ws/video-call/{room.room_id}/',
            'message': 'Video call room created successfully'
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_video_room(request, room_id):
    """
    Get video call room details
    
    GET /api/mentoring/video-call/<room_id>/
    """
    try:
        room = VideoCallRoom.objects.get(room_id=room_id)
        
        # Get participants
        participants = VideoCallParticipant.objects.filter(room=room)
        participants_data = [{
            'user_id': p.user_id,
            'role': p.role,
            'joined_at': p.joined_at.isoformat() if p.joined_at else None,
            'is_online': p.is_online
        } for p in participants]
        
        return JsonResponse({
            'room_id': room.room_id,
            'session_id': room.session.session_id if room.session else None,
            'mentor_id': room.mentor.mentor_id,
            'student_id': room.student.student_id,
            'status': room.status,
            'started_at': room.started_at.isoformat() if room.started_at else None,
            'ended_at': room.ended_at.isoformat() if room.ended_at else None,
            'participants': participants_data,
            'websocket_url': f'ws://localhost:8000/ws/video-call/{room.room_id}/'
        })
        
    except VideoCallRoom.DoesNotExist:
        return JsonResponse({'error': 'Room not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def join_video_room(request, room_id):
    """
    Join a video call room
    
    POST /api/mentoring/video-call/<room_id>/join/
    Body: {
        "user_id": 1,
        "role": "mentor" | "student"
    }
    """
    try:
        room = VideoCallRoom.objects.get(room_id=room_id)
        
        data = json.loads(request.body)
        user_id = data.get('user_id')
        role = data.get('role')
        
        if not all([user_id, role]):
            return JsonResponse({
                'error': 'user_id and role are required'
            }, status=400)
        
        if role not in ['mentor', 'student']:
            return JsonResponse({
                'error': 'role must be either "mentor" or "student"'
            }, status=400)
        
        # Verify user is authorized for this room
        # Note: user_id is Users.user_id, need to compare with mentor/student user_id
        if role == 'mentor':
            if not room.mentor or room.mentor.user.user_id != user_id:
                return JsonResponse({'error': 'Unauthorized mentor'}, status=403)
        
        if role == 'student':
            # If student is not set yet in room, allow any student to join
            # Otherwise verify the student matches
            if room.student and room.student.user.user_id != user_id:
                return JsonResponse({'error': 'Unauthorized student'}, status=403)
            
            # If student is None, set it now
            if not room.student:
                try:
                    from apps.students.models import Students
                    student = Students.objects.get(user__user_id=user_id)
                    room.student = student
                    room.save()
                except Students.DoesNotExist:
                    return JsonResponse({'error': 'Student not found'}, status=404)
        
        # Add or update participant
        participant, created = VideoCallParticipant.objects.get_or_create(
            room=room,
            user_id=user_id,
            role=role,
            defaults={'is_online': True}
        )
        
        if not created:
            participant.is_online = True
            participant.left_at = None
            participant.save()
        
        return JsonResponse({
            'success': True,
            'room_id': room.room_id,
            'websocket_url': f'ws://localhost:8000/ws/video-call/{room.room_id}/',
            'message': 'Joined room successfully'
        })
        
    except VideoCallRoom.DoesNotExist:
        return JsonResponse({'error': 'Room not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        import traceback
        print(f"Error in join_video_room: {e}")
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def end_video_room(request, room_id):
    """
    End a video call room
    
    POST /api/mentoring/video-call/<room_id>/end/
    """
    try:
        room = VideoCallRoom.objects.get(room_id=room_id)
        
        # Update room status
        room.status = 'ended'
        if not room.ended_at:
            room.ended_at = timezone.now()
        room.save()
        
        # Mark all participants as offline
        VideoCallParticipant.objects.filter(room=room, is_online=True).update(
            is_online=False,
            left_at=timezone.now()
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Video call ended successfully'
        })
        
    except VideoCallRoom.DoesNotExist:
        return JsonResponse({'error': 'Room not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_room_by_session(request, session_id):
    """
    Get or create video room for a session
    
    GET /api/mentoring/video-call/session/<session_id>/
    """
    try:
        session = MentoringSessions.objects.get(session_id=session_id)
        
        # Try to find existing active room
        room = VideoCallRoom.objects.filter(
            session=session,
            status__in=['waiting', 'active']
        ).first()
        
        if room:
            return JsonResponse({
                'room_id': room.room_id,
                'status': room.status,
                'websocket_url': f'ws://localhost:8000/ws/video-call/{room.room_id}/',
                'exists': True
            })
        else:
            # Get student from session details or enrollment
            student = None
            
            # Try to get from session details -> request
            try:
                if hasattr(session, 'details') and session.details.request:
                    student = session.details.request.student
            except:
                pass
            
            # If not found, try to get from enrollments
            if not student:
                try:
                    from .models import MentoringSessionEnrollments
                    enrollment = MentoringSessionEnrollments.objects.filter(session=session).first()
                    if enrollment:
                        student = enrollment.student
                except:
                    pass
            
            # Create new room
            room_id = f"room_{uuid.uuid4().hex[:12]}"
            room = VideoCallRoom.objects.create(
                room_id=room_id,
                session=session,
                mentor=session.mentor,
                student=student,  # Can be None, will be set when student joins
                status='waiting'
            )
            
            return JsonResponse({
                'room_id': room.room_id,
                'status': room.status,
                'websocket_url': f'ws://localhost:8000/ws/video-call/{room.room_id}/',
                'exists': False
            })
        
    except MentoringSessions.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
