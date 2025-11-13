from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional

from django.db.models import Q

from apps.accounts.models import Users, UserDetails
from .models import Messages

ALLOWED_USER_TYPES = {"student", "uni_student"}


def generate_room_id(user_id_a: int, user_id_b: int) -> str:
    """Return a deterministic room identifier for a pair of users."""
    u1, u2 = sorted([int(user_id_a), int(user_id_b)])
    return f"room_{u1}_{u2}"


@dataclass
class UserSnapshot:
    user_id: int
    user_type: str
    full_name: str
    username: str
    email: str
    profile_picture: Optional[str]

    @property
    def display_name(self) -> str:
        return self.full_name or self.username or f"User {self.user_id}"


def get_user_snapshot(user_id: int) -> Optional[UserSnapshot]:
    """Return a lightweight snapshot of the user with detail info."""
    try:
        user = Users.objects.select_related("user_type").get(pk=user_id)
    except Users.DoesNotExist:
        return None

    details = UserDetails.objects.filter(user=user).first()
    return UserSnapshot(
        user_id=user.user_id,
        user_type=user.user_type.type_name if user.user_type else "",
        full_name=details.full_name if details else "",
        username=user.username,
        email=user.email,
        profile_picture=details.profile_picture if details else None,
    )


def are_users_allowed_to_chat(user_a_id: int, user_b_id: int) -> bool:
    """Validate that both users exist and belong to allowed user types."""
    snap_a = get_user_snapshot(user_a_id)
    snap_b = get_user_snapshot(user_b_id)
    if not snap_a or not snap_b:
        return False
    return (
        snap_a.user_type in ALLOWED_USER_TYPES
        and snap_b.user_type in ALLOWED_USER_TYPES
    )


def serialize_message(message: Messages) -> Dict[str, object]:
    """Serialize a message instance into a JSON-serializable dict."""
    return {
        "message_id": message.message_id,
        "sender_id": message.sender_id,
        "receiver_id": message.receiver_id,
        "message_text": message.message_text,
        "sent_at": message.sent_at.isoformat() if message.sent_at else None,
        "is_read": bool(message.is_read),
    }


def fetch_conversation_messages(user_id: int, peer_id: int, limit: int = 50):
    """Retrieve ordered messages between two users."""
    queryset = (
        Messages.objects.filter(
            Q(sender_id=user_id, receiver_id=peer_id)
            | Q(sender_id=peer_id, receiver_id=user_id)
        )
        .order_by("-sent_at", "-message_id")
    )
    if limit:
        queryset = queryset[:limit]
    messages = list(queryset)
    return list(reversed(messages))  # chronological order


def mark_messages_as_read(user_id: int, peer_id: int):
    """Mark all messages from peer to user as read."""
    Messages.objects.filter(
        sender_id=peer_id,
        receiver_id=user_id,
    ).exclude(is_read=1).update(is_read=1)
