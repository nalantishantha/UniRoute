import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Messages
from apps.accounts.models import Users
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Expect query string ?user_id=<id>
        self.user_id = None
        qs = self.scope.get('query_string', b'').decode()
        params = dict([p.split('=') for p in qs.split('&') if '=' in p]) if qs else {}
        self.user_id = params.get('user_id')

        if not self.user_id:
            await self.close()
            return

        self.group_name = f'user_{self.user_id}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Broadcast presence (simple online indicator)
        await self.channel_layer.group_send('online_users', {
            'type': 'user.online',
            'user_id': int(self.user_id),
        })

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except Exception:
            return

        action = data.get('action')

        if action == 'send':
            # Expect server-side REST to persist messages. WebSocket send may be used
            # only for real-time forwarding. If the payload contains a 'message' object
            # with an id (meaning it was persisted), forward it. Otherwise ignore to
            # avoid duplicate database writes.
            to = data.get('to')
            message_obj = data.get('message')
            if message_obj and to:
                payload = {'action': 'message', 'message': message_obj}
                await self.channel_layer.group_send(f'user_{to}', {'type': 'chat.message', 'payload': payload})
            # Do not create messages here; the REST endpoint handles persistence

        elif action == 'typing':
            # typing indicator forward to recipient
            to = data.get('to')
            if to:
                await self.channel_layer.group_send(f'user_{to}', {'type': 'chat.typing', 'user_id': int(self.user_id)})

        elif action == 'delivered':
            # Recipient acknowledges they received a message; forward this to the original sender
            # Expect payload: { action: 'delivered', message_id: <id>, to: <original_sender_id> }
            message_id = data.get('message_id')
            to = data.get('to')
            if message_id and to:
                delivered_at = timezone.now().isoformat()
                await self.channel_layer.group_send(f'user_{to}', {
                    'type': 'chat.message_delivered',
                    'message_id': message_id,
                    'delivered_by': int(self.user_id),
                    'delivered_at': delivered_at,
                })

    # Handlers for group_send events
    async def chat_message(self, event):
        payload = event.get('payload')
        await self.send(text_data=json.dumps(payload))

    async def chat_messages_read(self, event):
        # Notify client that their messages have been read by reader_id
        await self.send(text_data=json.dumps({
            'action': 'messages_read',
            'reader_id': event.get('reader_id'),
            'last_read_message_id': event.get('last_read_message_id'),
            'read_at': event.get('read_at'),
        }))

    async def chat_typing(self, event):
        await self.send(text_data=json.dumps({'action': 'typing', 'user_id': event.get('user_id')}))

    async def user_online(self, event):
        await self.send(text_data=json.dumps({'action': 'online', 'user_id': event.get('user_id')}))

    async def chat_message_delivered(self, event):
        # Forward delivered acknowledgement to client
        await self.send(text_data=json.dumps({
            'action': 'message_delivered',
            'message_id': event.get('message_id'),
            'delivered_by': event.get('delivered_by'),
            'delivered_at': event.get('delivered_at'),
        }))

    @database_sync_to_async
    def create_message(self, sender_id, receiver_id, text):
        sender = Users.objects.get(user_id=sender_id)
        receiver = Users.objects.get(user_id=receiver_id)
        m = Messages.objects.create(sender=sender, receiver=receiver, message_text=text, sent_at=timezone.now(), is_read=0)
        return m
