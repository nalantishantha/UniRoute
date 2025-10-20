"""
WebSocket URL routing configuration
"""
from django.urls import re_path
from apps.mentoring import consumers

websocket_urlpatterns = [
    re_path(r'ws/video-call/(?P<room_id>\w+)/$', consumers.VideoCallConsumer.as_asgi()),
]
