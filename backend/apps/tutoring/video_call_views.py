"""
REST API views for tutoring video call management
"""
import uuid
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import TutoringBooking, Tutors
from apps.students.models import Students
from apps.mentoring.models import VideoCallRoom, VideoCallParticipant


@csrf_exempt
@require_http_methods(["POST"])
def create_tutoring_video_room(request):
    """
    Create a new video call room for a tutoring session
    
    POST /api/tutoring/video-call/create/
    Body: {
        "booking_id": 1,
        "tutor_id": 1,
        "student_id": 1
    }
    """
    try:
        data = json.loads(request.body)
        booking_id = data.get('booking_id')
        tutor_id = data.get('tutor_id')
        student_id = data.get('student_id')
        
        if not all([tutor_id, student_id]):
            return JsonResponse({
                'error': 'tutor_id and student_id are required'
            }, status=400)
        
        # Verify tutor and student exist
        try:
            tutor = Tutors.objects.get(tutor_id=tutor_id)
            student = Students.objects.get(student_id=student_id)
        except (Tutors.DoesNotExist, Students.DoesNotExist):
            return JsonResponse({
                'error': 'Invalid tutor_id or student_id'
            }, status=404)
        
        # Get booking if provided
        booking = None
        if booking_id:
            try:
                booking = TutoringBooking.objects.get(booking_id=booking_id)
            except TutoringBooking.DoesNotExist:
                pass
        
        # Generate unique room ID
        room_id = f"tutoring_room_{uuid.uuid4().hex[:12]}"
        
        # Create video call room (reusing mentoring VideoCallRoom model)
        # We'll use mentor field for tutor (both are mentors conceptually)
        room = VideoCallRoom.objects.create(
            room_id=room_id,
            session=None,  # No direct session for tutoring
            mentor_id=tutor.tutor_id,  # Store tutor_id in mentor_id field
            student=student,
            status='waiting'
        )
        
        return JsonResponse({
            'success': True,
            'room_id': room.room_id,
            'websocket_url': f'ws://localhost:8000/ws/video-call/{room.room_id}/',
            'message': 'Tutoring video call room created successfully'
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_tutoring_video_room(request, room_id):
    """
    Get video call room details
    
    GET /api/tutoring/video-call/<room_id>/
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
            'tutor_id': room.mentor_id,  # mentor_id is actually tutor_id for tutoring
            'student_id': room.student.student_id if room.student else None,
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
def join_tutoring_video_room(request, room_id):
    """
    Join a tutoring video call room
    
    POST /api/tutoring/video-call/<room_id>/join/
    Body: {
        "user_id": 1,
        "role": "tutor" | "student"
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
        
        if role not in ['tutor', 'student']:
            return JsonResponse({
                'error': 'role must be either "tutor" or "student"'
            }, status=400)
        
        # Verify user is authorized for this room
        # For tutoring, mentor_id field stores tutor_id
        if role == 'tutor' and room.mentor_id != user_id:
            return JsonResponse({'error': 'Unauthorized tutor'}, status=403)
        if role == 'student' and room.student and room.student.student_id != user_id:
            return JsonResponse({'error': 'Unauthorized student'}, status=403)
        
        # Check if participant already exists
        participant, created = VideoCallParticipant.objects.get_or_create(
            room=room,
            user_id=user_id,
            role=role,
            defaults={'is_online': True, 'joined_at': timezone.now()}
        )
        
        if not created:
            # Update existing participant
            participant.is_online = True
            participant.joined_at = timezone.now()
            participant.save()
        
        # Update room status
        if room.status == 'waiting':
            room.status = 'active'
            room.started_at = timezone.now()
            room.save()
        
        return JsonResponse({
            'success': True,
            'room_id': room.room_id,
            'participant_id': participant.participant_id,
            'message': 'Joined video call successfully'
        })
        
    except VideoCallRoom.DoesNotExist:
        return JsonResponse({'error': 'Room not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def end_tutoring_video_room(request, room_id):
    """
    End a tutoring video call room
    
    POST /api/tutoring/video-call/<room_id>/end/
    """
    try:
        room = VideoCallRoom.objects.get(room_id=room_id)
        
        # Update room status
        room.status = 'ended'
        room.ended_at = timezone.now()
        room.save()
        
        # Mark all participants as offline
        VideoCallParticipant.objects.filter(room=room).update(
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
@require_http_methods(["GET", "POST"])
def get_or_create_room_for_booking(request, booking_id):
    """
    Get existing room or create new one for a tutoring booking
    
    GET/POST /api/tutoring/video-call/booking/<booking_id>/
    """
    try:
        # Get the booking
        try:
            booking = TutoringBooking.objects.get(booking_id=booking_id)
        except TutoringBooking.DoesNotExist:
            return JsonResponse({'error': 'Booking not found'}, status=404)
        
        # Check for existing active room for this booking
        # Since we don't have direct booking reference, we match by tutor and student
        existing_room = VideoCallRoom.objects.filter(
            mentor_id=booking.tutor.tutor_id,
            student=booking.student,
            status__in=['waiting', 'active']
        ).first()
        
        if existing_room:
            # Return existing room
            participants = VideoCallParticipant.objects.filter(room=existing_room)
            participants_data = [{
                'user_id': p.user_id,
                'role': p.role,
                'joined_at': p.joined_at.isoformat() if p.joined_at else None,
                'is_online': p.is_online
            } for p in participants]
            
            return JsonResponse({
                'room_id': existing_room.room_id,
                'tutor_id': existing_room.mentor_id,
                'student_id': existing_room.student.student_id if existing_room.student else None,
                'status': existing_room.status,
                'started_at': existing_room.started_at.isoformat() if existing_room.started_at else None,
                'participants': participants_data,
                'websocket_url': f'ws://localhost:8000/ws/video-call/{existing_room.room_id}/',
                'existing': True
            })
        
        # Create new room
        room_id = f"tutoring_room_{uuid.uuid4().hex[:12]}"
        room = VideoCallRoom.objects.create(
            room_id=room_id,
            session=None,
            mentor_id=booking.tutor.tutor_id,
            student=booking.student,
            status='waiting'
        )
        
        return JsonResponse({
            'room_id': room.room_id,
            'tutor_id': room.mentor_id,
            'student_id': room.student.student_id if room.student else None,
            'status': room.status,
            'websocket_url': f'ws://localhost:8000/ws/video-call/{room.room_id}/',
            'existing': False
        }, status=201)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
