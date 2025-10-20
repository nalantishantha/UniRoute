from django.urls import path

from . import views


urlpatterns = [
	path("conversations/", views.list_conversations, name="chat_conversations"),
	path(
		"messages/<int:other_user_id>/",
		views.conversation_messages,
		name="chat_messages",
	),
	path("messages/send/", views.send_message, name="chat_send_message"),
	path("messages/mark-read/", views.mark_read, name="chat_mark_read"),
	path(
		"resolve-participant/",
		views.resolve_participant,
		name="chat_resolve_participant",
	),
]
