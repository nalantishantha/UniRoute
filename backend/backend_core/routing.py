"""WebSocket URL routing configuration."""
from django.urls import re_path

from apps.communications.consumers import ChatConsumer
from apps.mentoring import consumers as mentoring_consumers


websocket_urlpatterns = [
    re_path(
        r"ws/video-call/(?P<room_id>\w+)/$",
        mentoring_consumers.VideoCallConsumer.as_asgi(),
    ),
    re_path(r"ws/chat/(?P<room_id>\w+)/$", ChatConsumer.as_asgi()),
]
