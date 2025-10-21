"""REST endpoints for chat messaging."""
from __future__ import annotations

import json
from typing import Dict, List

from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from apps.accounts.models import UserDetails, Users
from apps.students.models import Students
from apps.university_students.models import UniversityStudents

from .models import Messages
from .utils import (
	ALLOWED_USER_TYPES,
	are_users_allowed_to_chat,
	fetch_conversation_messages,
	generate_room_id,
	get_user_snapshot,
	mark_messages_as_read,
	serialize_message,
)


def _json_error(message: str, status: int = 400):
	return JsonResponse({"success": False, "message": message}, status=status)


def _parse_int(value, field_name: str):
	try:
		return int(value)
	except (TypeError, ValueError):
		raise ValueError(f"Invalid {field_name}")


@csrf_exempt
def list_conversations(request):
	if request.method != "GET":
		return _json_error("Only GET method allowed", 405)

	user_id_raw = request.GET.get("user_id")
	if user_id_raw is None:
		return _json_error("user_id is required")

	try:
		user_id = _parse_int(user_id_raw, "user_id")
	except ValueError as exc:
		return _json_error(str(exc))

	user = Users.objects.select_related("user_type").filter(pk=user_id).first()
	if not user:
		return _json_error("User not found", 404)

	if user.user_type.type_name not in ALLOWED_USER_TYPES:
		return _json_error("This user type is not allowed to use chat", 403)

	message_queryset = (
		Messages.objects.filter(Q(sender_id=user_id) | Q(receiver_id=user_id))
		.select_related("sender__user_type", "receiver__user_type")
		.order_by("-sent_at", "-message_id")
	)

	partner_ids: List[int] = []
	for msg in message_queryset:
		other_id = msg.receiver_id if msg.sender_id == user_id else msg.sender_id
		partner_ids.append(other_id)

	unique_partner_ids = list({pid for pid in partner_ids if pid != user_id})

	partners = {
		p.user_id: p
		for p in Users.objects.select_related("user_type").filter(
			user_id__in=unique_partner_ids,
			user_type__type_name__in=ALLOWED_USER_TYPES,
		)
	}

	details_map = {
		detail.user_id: detail
		for detail in UserDetails.objects.filter(user_id__in=partners.keys())
	}

	conversations: Dict[int, Dict[str, object]] = {}

	for msg in message_queryset:
		other_id = msg.receiver_id if msg.sender_id == user_id else msg.sender_id
		if other_id == user_id or other_id not in partners:
			continue

		convo = conversations.setdefault(other_id, {
			"room_id": generate_room_id(user_id, other_id),
			"user": {
				"user_id": other_id,
				"full_name": "",
				"username": partners[other_id].username,
				"email": partners[other_id].email,
				"user_type": partners[other_id].user_type.type_name,
				"profile_picture": None,
			},
			"last_message": "",
			"last_message_time": None,
			"unread_count": 0,
		})

		if not convo["last_message"]:
			convo["last_message"] = msg.message_text
			convo["last_message_time"] = (
				msg.sent_at.isoformat() if msg.sent_at else None
			)

		if msg.receiver_id == user_id and (msg.is_read is None or msg.is_read == 0):
			convo["unread_count"] += 1

	# Enrich with user details
	for other_id, convo in conversations.items():
		detail = details_map.get(other_id)
		if detail:
			convo["user"]["full_name"] = detail.full_name or convo["user"]["username"]
			convo["user"]["profile_picture"] = detail.profile_picture
		else:
			snapshot = get_user_snapshot(other_id)
			if snapshot:
				convo["user"]["full_name"] = snapshot.display_name
				convo["user"]["profile_picture"] = snapshot.profile_picture

	convo_list = sorted(
		conversations.values(),
		key=lambda item: item.get("last_message_time") or "",
		reverse=True,
	)

	return JsonResponse({"success": True, "conversations": convo_list})


@csrf_exempt
def conversation_messages(request, other_user_id):
	if request.method != "GET":
		return _json_error("Only GET method allowed", 405)

	user_id_raw = request.GET.get("user_id")
	if user_id_raw is None:
		return _json_error("user_id is required")

	try:
		user_id = _parse_int(user_id_raw, "user_id")
		other_id = _parse_int(other_user_id, "other_user_id")
	except ValueError as exc:
		return _json_error(str(exc))

	if not are_users_allowed_to_chat(user_id, other_id):
		return _json_error("Chat between these users is not allowed", 403)

	limit_raw = request.GET.get("limit")
	limit = None
	if limit_raw:
		try:
			limit = max(1, int(limit_raw))
		except ValueError:
			return _json_error("Invalid limit")

	messages = fetch_conversation_messages(user_id, other_id, limit or 100)
	serialized = [serialize_message(msg) for msg in messages]

	# Mark messages addressed to user as read
	mark_messages_as_read(user_id, other_id)

	return JsonResponse(
		{
			"success": True,
			"room_id": generate_room_id(user_id, other_id),
			"messages": serialized,
		}
	)


@csrf_exempt
def send_message(request):
	if request.method != "POST":
		return _json_error("Only POST method allowed", 405)

	try:
		data = json.loads(request.body.decode("utf-8"))
	except (TypeError, json.JSONDecodeError):
		return _json_error("Invalid JSON payload")

	sender_id = data.get("sender_id")
	receiver_id = data.get("receiver_id")
	message_text = (data.get("message_text") or "").strip()

	if not sender_id or not receiver_id:
		return _json_error("sender_id and receiver_id are required")

	try:
		sender_id = _parse_int(sender_id, "sender_id")
		receiver_id = _parse_int(receiver_id, "receiver_id")
	except ValueError as exc:
		return _json_error(str(exc))

	if not message_text:
		return _json_error("message_text is required")

	if not are_users_allowed_to_chat(sender_id, receiver_id):
		return _json_error("Chat between these users is not allowed", 403)

	message = Messages.objects.create(
		sender_id=sender_id,
		receiver_id=receiver_id,
		message_text=message_text,
		sent_at=timezone.now(),
		is_read=0,
	)

	return JsonResponse(
		{
			"success": True,
			"room_id": generate_room_id(sender_id, receiver_id),
			"message": serialize_message(message),
		},
		status=201,
	)


@csrf_exempt
def mark_read(request):
	if request.method != "POST":
		return _json_error("Only POST method allowed", 405)

	try:
		data = json.loads(request.body.decode("utf-8"))
	except (TypeError, json.JSONDecodeError):
		return _json_error("Invalid JSON payload")

	user_id = data.get("user_id")
	peer_id = data.get("peer_id")

	if user_id is None or peer_id is None:
		return _json_error("user_id and peer_id are required")

	try:
		user_id = _parse_int(user_id, "user_id")
		peer_id = _parse_int(peer_id, "peer_id")
	except ValueError as exc:
		return _json_error(str(exc))

	mark_messages_as_read(user_id, peer_id)

	return JsonResponse({"success": True})


@csrf_exempt
def resolve_participant(request):
	if request.method != "GET":
		return _json_error("Only GET method allowed", 405)

	student_id_raw = request.GET.get("student_id")
	uni_student_id_raw = request.GET.get("university_student_id")

	if not student_id_raw and not uni_student_id_raw:
		return _json_error("student_id or university_student_id is required")

	try:
		if student_id_raw:
			student_id = _parse_int(student_id_raw, "student_id")
			student = Students.objects.select_related("user__user_type").get(
				pk=student_id
			)
			user = student.user
		else:
			uni_student_id = _parse_int(uni_student_id_raw, "university_student_id")
			uni_student = UniversityStudents.objects.select_related(
				"user__user_type"
			).get(pk=uni_student_id)
			user = uni_student.user
	except (Students.DoesNotExist, UniversityStudents.DoesNotExist, ValueError):
		return _json_error("Participant not found", 404)

	if user.user_type.type_name not in ALLOWED_USER_TYPES:
		return _json_error("This user type is not allowed to use chat", 403)

	details = UserDetails.objects.filter(user=user).first()

	payload = {
		"user_id": user.user_id,
		"full_name": details.full_name if details else user.username,
		"username": user.username,
		"email": user.email,
		"user_type": user.user_type.type_name,
		"profile_picture": details.profile_picture if details else None,
	}

	return JsonResponse({"success": True, "user": payload})
