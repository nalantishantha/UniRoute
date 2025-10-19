"""
WebSocket consumer for WebRTC signaling
Handles peer-to-peer video call signaling between mentor and student
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import VideoCallRoom, VideoCallParticipant


class VideoCallConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling WebRTC signaling
    Supports: offer, answer, ice-candidate, join, leave
    """
    
    async def connect(self):
        """Handle WebSocket connection"""
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'video_call_{self.room_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Notify that someone is connecting
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_connected',
                'message': 'A user is connecting...'
            }
        )
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Update participant status
        if hasattr(self, 'user_id') and hasattr(self, 'role'):
            await self.update_participant_status(
                self.room_id, 
                self.user_id, 
                self.role, 
                is_online=False
            )
        
        # Notify others that user left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_disconnected',
                'user_id': getattr(self, 'user_id', None),
                'role': getattr(self, 'role', None)
            }
        )
    
    async def receive(self, text_data):
        """
        Receive message from WebSocket
        Handle different message types: join, offer, answer, ice-candidate, leave
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'join':
                await self.handle_join(data)
            elif message_type == 'offer':
                await self.handle_offer(data)
            elif message_type == 'answer':
                await self.handle_answer(data)
            elif message_type == 'ice-candidate':
                await self.handle_ice_candidate(data)
            elif message_type == 'leave':
                await self.handle_leave(data)
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': f'Unknown message type: {message_type}'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def handle_join(self, data):
        """Handle user joining the room"""
        self.user_id = data.get('user_id')
        self.role = data.get('role')  # 'mentor' or 'student'
        
        print(f"🔵 User joining: {self.role} (ID: {self.user_id}) in room {self.room_id}")
        
        # Add participant to database
        await self.add_participant(self.room_id, self.user_id, self.role)
        
        # Update room status if needed - use ONLINE participant count
        participant_count = await self.get_online_participant_count(self.room_id)
        print(f"📊 Online participant count after join: {participant_count}")
        
        if participant_count >= 2:
            await self.update_room_status(self.room_id, 'active')
            print(f"✅ Room {self.room_id} is now active")
        
        # Notify all users in the room
        print(f"📢 Broadcasting user_joined to group {self.room_group_name}")
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'user_id': self.user_id,
                'role': self.role,
                'participant_count': participant_count
            }
        )
    
    async def handle_offer(self, data):
        """Forward WebRTC offer to other peer"""
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_offer',
                'offer': data.get('offer'),
                'sender_id': data.get('sender_id'),
                'sender_role': data.get('sender_role')
            }
        )
    
    async def handle_answer(self, data):
        """Forward WebRTC answer to other peer"""
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_answer',
                'answer': data.get('answer'),
                'sender_id': data.get('sender_id'),
                'sender_role': data.get('sender_role')
            }
        )
    
    async def handle_ice_candidate(self, data):
        """Forward ICE candidate to other peer"""
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_ice_candidate',
                'candidate': data.get('candidate'),
                'sender_id': data.get('sender_id'),
                'sender_role': data.get('sender_role')
            }
        )
    
    async def handle_leave(self, data):
        """Handle user leaving the room"""
        user_id = data.get('user_id')
        role = data.get('role')
        
        # Update participant status
        await self.update_participant_status(self.room_id, user_id, role, is_online=False)
        
        # Check if room should be ended
        online_count = await self.get_online_participant_count(self.room_id)
        if online_count == 0:
            await self.update_room_status(self.room_id, 'ended')
        
        # Notify others
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_left',
                'user_id': user_id,
                'role': role
            }
        )
    
    # Group message handlers (called by group_send)
    
    async def user_connected(self, event):
        """Send user connected notification"""
        await self.send(text_data=json.dumps({
            'type': 'user_connected',
            'message': event['message']
        }))
    
    async def user_joined(self, event):
        """Send user joined notification"""
        print(f"📨 user_joined handler: event user_id={event['user_id']}, self.user_id={getattr(self, 'user_id', None)}")
        # Don't send to self
        if event['user_id'] != getattr(self, 'user_id', None):
            print(f"✉️ Sending user_joined to this connection (different user)")
            await self.send(text_data=json.dumps({
                'type': 'user_joined',
                'user_id': event['user_id'],
                'role': event['role'],
                'participant_count': event['participant_count']
            }))
        else:
            print(f"🚫 Skipping user_joined for self (same user_id)")
    
    async def user_disconnected(self, event):
        """Send user disconnected notification"""
        await self.send(text_data=json.dumps({
            'type': 'user_disconnected',
            'user_id': event['user_id'],
            'role': event['role']
        }))
    
    async def user_left(self, event):
        """Send user left notification"""
        await self.send(text_data=json.dumps({
            'type': 'user_left',
            'user_id': event['user_id'],
            'role': event['role']
        }))
    
    async def webrtc_offer(self, event):
        """Forward WebRTC offer to client"""
        # Don't send to self
        if event['sender_id'] != getattr(self, 'user_id', None):
            await self.send(text_data=json.dumps({
                'type': 'offer',
                'offer': event['offer'],
                'sender_id': event['sender_id'],
                'sender_role': event['sender_role']
            }))
    
    async def webrtc_answer(self, event):
        """Forward WebRTC answer to client"""
        # Don't send to self
        if event['sender_id'] != getattr(self, 'user_id', None):
            await self.send(text_data=json.dumps({
                'type': 'answer',
                'answer': event['answer'],
                'sender_id': event['sender_id'],
                'sender_role': event['sender_role']
            }))
    
    async def webrtc_ice_candidate(self, event):
        """Forward ICE candidate to client"""
        # Don't send to self
        if event['sender_id'] != getattr(self, 'user_id', None):
            await self.send(text_data=json.dumps({
                'type': 'ice-candidate',
                'candidate': event['candidate'],
                'sender_id': event['sender_id'],
                'sender_role': event['sender_role']
            }))
    
    # Database operations
    
    @database_sync_to_async
    def add_participant(self, room_id, user_id, role):
        """Add participant to the room"""
        try:
            room = VideoCallRoom.objects.get(room_id=room_id)
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
            return participant
        except VideoCallRoom.DoesNotExist:
            raise Exception(f'Room {room_id} does not exist')
    
    @database_sync_to_async
    def update_participant_status(self, room_id, user_id, role, is_online):
        """Update participant online status"""
        try:
            room = VideoCallRoom.objects.get(room_id=room_id)
            participant = VideoCallParticipant.objects.get(
                room=room,
                user_id=user_id,
                role=role
            )
            participant.is_online = is_online
            if not is_online:
                participant.left_at = timezone.now()
            participant.save()
        except (VideoCallRoom.DoesNotExist, VideoCallParticipant.DoesNotExist):
            pass
    
    @database_sync_to_async
    def get_participant_count(self, room_id):
        """Get total participant count for room"""
        try:
            room = VideoCallRoom.objects.get(room_id=room_id)
            return VideoCallParticipant.objects.filter(room=room).count()
        except VideoCallRoom.DoesNotExist:
            return 0
    
    @database_sync_to_async
    def get_online_participant_count(self, room_id):
        """Get online participant count for room"""
        try:
            room = VideoCallRoom.objects.get(room_id=room_id)
            return VideoCallParticipant.objects.filter(
                room=room,
                is_online=True
            ).count()
        except VideoCallRoom.DoesNotExist:
            return 0
    
    @database_sync_to_async
    def update_room_status(self, room_id, status):
        """Update room status"""
        try:
            room = VideoCallRoom.objects.get(room_id=room_id)
            room.status = status
            if status == 'active' and not room.started_at:
                room.started_at = timezone.now()
            elif status == 'ended' and not room.ended_at:
                room.ended_at = timezone.now()
            room.save()
        except VideoCallRoom.DoesNotExist:
            pass
