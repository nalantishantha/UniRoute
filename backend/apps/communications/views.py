from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import BlockedUser
from django.utils import timezone
import json

# models
from .models import Messages
from apps.accounts.models import Users, UserDetails


def _user_info(user: Users):
	try:
		details = UserDetails.objects.get(user=user)
		return {
			'user_id': user.user_id,
			'username': user.username,
			'full_name': details.full_name,
			'profile_picture': details.profile_picture,
		}
	except UserDetails.DoesNotExist:
		return {
			'user_id': user.user_id,
			'username': user.username,
			'full_name': '',
			'profile_picture': None,
		}


def chats_list(request):
	"""Return a list of users the current user has chatted with or all users when searching.

	Query params:
	  - user_id: current user id (required)
	  - q: optional search term
	"""
	user_id = request.GET.get('user_id')
	q = request.GET.get('q', '').strip()

	if not user_id:
		return JsonResponse({'success': False, 'message': 'user_id required'}, status=400)

	try:
		current_user = Users.objects.get(user_id=user_id)
	except Users.DoesNotExist:
		return JsonResponse({'success': False, 'message': 'invalid user_id'}, status=400)

	# If a search query is provided, search across all users (excluding current)
	if q:
		# Search by username or full_name in related UserDetails
		users_qs = Users.objects.filter(
			(Q(username__icontains=q) | Q(userdetails__full_name__icontains=q))
		).exclude(user_id=current_user.user_id).distinct()
	else:
		# Users who have exchanged messages with current_user
		sent = Messages.objects.filter(sender=current_user).values_list('receiver', flat=True)
		received = Messages.objects.filter(receiver=current_user).values_list('sender', flat=True)
		user_ids = set(list(sent) + list(received))
		users_qs = Users.objects.filter(user_id__in=user_ids)

	users = []
	for u in users_qs:
		# last message between users
		last_msg_qs = Messages.objects.filter(
			(Q(sender=current_user, receiver=u) | Q(sender=u, receiver=current_user))
		).order_by('-sent_at')
		if last_msg_qs.exists():
			last_message = last_msg_qs.first().message_text
			last_timestamp = last_msg_qs.first().sent_at.isoformat() if last_msg_qs.first().sent_at else None
		else:
			last_message = ''
			last_timestamp = None

		users.append({
			**_user_info(u),
			'online': False,
			'unread': Messages.objects.filter(sender=u, receiver=current_user, is_read__in=[0, None]).count(),
			'last_message': last_message,
			'last_timestamp': last_timestamp,
		})

	return JsonResponse({'success': True, 'users': users})


from django.db.models import Q


def messages_between(request, user_id):
	"""Return messages between current user and user_id

	Query params:
	  - user_id: selected user id in URL
	  - me: current user id (required)
	"""
	me = request.GET.get('me')
	if not me:
		return JsonResponse({'success': False, 'message': 'me (current user id) required'}, status=400)

	try:
		me_user = Users.objects.get(user_id=me)
		other = Users.objects.get(user_id=user_id)
	except Users.DoesNotExist:
		return JsonResponse({'success': False, 'message': 'invalid user id(s)'}, status=400)

	msgs = Messages.objects.filter((Q(sender=me_user, receiver=other) | Q(sender=other, receiver=me_user))).order_by('sent_at')

	data = [
		{
			'id': m.message_id,
			'sender_id': m.sender.user_id,
			'receiver_id': m.receiver.user_id,
			'text': m.message_text,
			'sent_at': m.sent_at.isoformat() if m.sent_at else None,
			'is_read': bool(m.is_read),
		}
		for m in msgs
	]

	# mark messages sent to me as read
	updated = Messages.objects.filter(sender=other, receiver=me_user, is_read__in=[0, None]).update(is_read=1)

	# Notify the sender (other) that messages were read by me
	if updated:
		try:
			from asgiref.sync import async_to_sync
			from channels.layers import get_channel_layer
			from django.utils import timezone

			# Determine the last message id that was read (from this sender -> me)
			last_read = Messages.objects.filter(sender=other, receiver=me_user, is_read=1).order_by('-sent_at').first()
			last_read_id = last_read.message_id if last_read else None
			read_at = timezone.now().isoformat()

			channel_layer = get_channel_layer()
			async_to_sync(channel_layer.group_send)(f'user_{other.user_id}', {
				'type': 'chat.messages_read',
				'reader_id': me_user.user_id,
				'last_read_message_id': last_read_id,
				'read_at': read_at,
			})
		except Exception:
			# Non-fatal if channel layer unavailable
			pass

	return JsonResponse({'success': True, 'messages': data})


@csrf_exempt
def send_message(request, user_id):
	"""POST endpoint to send a message to user_id

	Body JSON: { 'me': <current_user_id>, 'text': '...' }
	"""
	if request.method != 'POST':
		return JsonResponse({'success': False, 'message': 'POST required'}, status=405)

	try:
		payload = json.loads(request.body)
	except json.JSONDecodeError:
		return JsonResponse({'success': False, 'message': 'invalid json'}, status=400)

	me = payload.get('me')
	text = payload.get('text', '').strip()
	if not me or not text:
		return JsonResponse({'success': False, 'message': 'me and text required'}, status=400)

	try:
		sender = Users.objects.get(user_id=me)
		receiver = Users.objects.get(user_id=user_id)
	except Users.DoesNotExist:
		return JsonResponse({'success': False, 'message': 'invalid user id(s)'}, status=400)

	# Check if receiver has blocked the sender
	if BlockedUser.objects.filter(blocker=receiver, blocked_user=sender).exists():
		return JsonResponse({'success': False, 'message': 'you are blocked by this user'}, status=403)

	msg = Messages.objects.create(sender=sender, receiver=receiver, message_text=text, sent_at=timezone.now(), is_read=0)

	# For real-time, send to channel layer group named by receiver id
	try:
		from asgiref.sync import async_to_sync
		from channels.layers import get_channel_layer

		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(f'user_{receiver.user_id}', {
			'type': 'chat.message',
			'message': {
				'id': msg.message_id,
				'sender_id': sender.user_id,
				'receiver_id': receiver.user_id,
				'text': msg.message_text,
				'sent_at': msg.sent_at.isoformat(),
			}
		})
	except Exception:
		# non-fatal: channel layer might not be configured
		pass

	return JsonResponse({'success': True, 'message': 'sent', 'data': {
		'id': msg.message_id,
		'sender_id': sender.user_id,
		'receiver_id': receiver.user_id,
		'text': msg.message_text,
		'sent_at': msg.sent_at.isoformat(),
	}})

@csrf_exempt
@require_POST
def block_user(request):
	try:
		payload = json.loads(request.body)
	except json.JSONDecodeError:
		return JsonResponse({'success': False, 'message': 'invalid json'}, status=400)

	me = payload.get('me')
	target = payload.get('target')
	if not me or not target:
		return JsonResponse({'success': False, 'message': 'me and target required'}, status=400)

	try:
		blocker = Users.objects.get(user_id=me)
		blocked = Users.objects.get(user_id=target)
	except Users.DoesNotExist:
		return JsonResponse({'success': False, 'message': 'invalid user id(s)'}, status=400)

	obj, created = BlockedUser.objects.get_or_create(blocker=blocker, blocked_user=blocked)
	return JsonResponse({'success': True, 'blocked': True})


@csrf_exempt
@require_POST
def unblock_user(request):
	try:
		payload = json.loads(request.body)
	except json.JSONDecodeError:
		return JsonResponse({'success': False, 'message': 'invalid json'}, status=400)

	me = payload.get('me')
	target = payload.get('target')
	if not me or not target:
		return JsonResponse({'success': False, 'message': 'me and target required'}, status=400)

	try:
		blocker = Users.objects.get(user_id=me)
		blocked = Users.objects.get(user_id=target)
	except Users.DoesNotExist:
		return JsonResponse({'success': False, 'message': 'invalid user id(s)'}, status=400)

	BlockedUser.objects.filter(blocker=blocker, blocked_user=blocked).delete()
	return JsonResponse({'success': True, 'blocked': False})
# Create your views here.
