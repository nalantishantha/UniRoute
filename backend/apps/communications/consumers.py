"""WebSocket consumer for student <-> university student chat."""
from __future__ import annotations

import json
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from .models import Messages
from .utils import (
    are_users_allowed_to_chat,
    generate_room_id,
    get_user_snapshot,
    serialize_message,
)


class ChatConsumer(AsyncWebsocketConsumer):
    """Handle real-time chat between students and university students."""

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"].get("room_id")
        query_string = self.scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)

        user_param = query_params.get("user_id", [None])[0]
        peer_param = query_params.get("peer_id", [None])[0]

        if not self.room_id or user_param is None or peer_param is None:
            await self.close(code=4001)
            return

        try:
            self.user_id = int(user_param)
            self.peer_id = int(peer_param)
        except ValueError:
            await self.close(code=4002)
            return

        expected_room = generate_room_id(self.user_id, self.peer_id)
        if expected_room != self.room_id:
            await self.close(code=4003)
            return

        allowed = await self._are_users_allowed(self.user_id, self.peer_id)
        if not allowed:
            await self.close(code=4004)
            return

        self.room_group_name = f"chat_{self.room_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

        # Send initial payload (peer info)
        peer_snapshot = await self._get_user_snapshot(self.peer_id)
        await self.send_json(
            {
                "type": "connection_established",
                "room_id": self.room_id,
                "peer": {
                    "user_id": peer_snapshot.user_id if peer_snapshot else None,
                    "full_name": peer_snapshot.display_name if peer_snapshot else None,
                    "user_type": peer_snapshot.user_type if peer_snapshot else None,
                    "profile_picture": peer_snapshot.profile_picture if peer_snapshot else None,
                },
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
            )

    async def receive(self, text_data: str | bytes, **kwargs):
        try:
            payload = json.loads(text_data)
        except (TypeError, json.JSONDecodeError):
            await self.send_json(
                {"type": "error", "message": "Invalid message payload"}
            )
            return

        event_type = payload.get("type")

        if event_type == "message":
            await self._handle_new_message(payload)
        elif event_type == "read":
            await self._handle_read_receipt(payload)
        else:
            await self.send_json(
                {"type": "error", "message": "Unsupported event type"}
            )

    async def _handle_new_message(self, payload: dict):
        message_text = (payload.get("message") or "").strip()
        receiver_id = payload.get("receiver_id", self.peer_id)

        if not message_text:
            await self.send_json(
                {"type": "error", "message": "Message text is required"}
            )
            return

        if int(receiver_id) not in (self.peer_id, self.user_id):
            await self.send_json(
                {"type": "error", "message": "Invalid receiver"}
            )
            return

        # Persist message
        saved = await self._persist_message(
            sender_id=self.user_id,
            receiver_id=int(receiver_id),
            message_text=message_text,
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": saved,
            },
        )

    async def _handle_read_receipt(self, payload: dict):
        message_ids = payload.get("message_ids")
        if not isinstance(message_ids, list):
            return
        await self._mark_messages_read(message_ids)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "messages_read",
                "message_ids": message_ids,
                "reader_id": self.user_id,
            },
        )

    async def chat_message(self, event: dict):
        await self.send_json({"type": "chat_message", **event})

    async def messages_read(self, event: dict):
        await self.send_json({"type": "messages_read", **event})

    async def _persist_message(self, sender_id: int, receiver_id: int, message_text: str):
        return await database_sync_to_async(self._save_message)(
            sender_id, receiver_id, message_text
        )

    def _save_message(self, sender_id: int, receiver_id: int, message_text: str):
        message = Messages.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message_text=message_text,
            sent_at=timezone.now(),
            is_read=0,
        )
        data = serialize_message(message)
        data["room_id"] = self.room_id
        return data

    async def _mark_messages_read(self, message_ids):
        await database_sync_to_async(self._update_messages_read)(message_ids)

    def _update_messages_read(self, message_ids):
        Messages.objects.filter(
            message_id__in=message_ids,
            receiver_id=self.user_id,
        ).exclude(is_read=1).update(is_read=1)

    async def _are_users_allowed(self, user_a_id: int, user_b_id: int) -> bool:
        return await database_sync_to_async(are_users_allowed_to_chat)(
            user_a_id, user_b_id
        )

    async def _get_user_snapshot(self, user_id: int):
        return await database_sync_to_async(get_user_snapshot)(user_id)

    async def send_json(self, content: dict):
        await self.send(text_data=json.dumps(content))
