from django.urls import path
from . import views

urlpatterns = [
	path('chats/', views.chats_list, name='chats_list'),
	path('chats/<int:user_id>/messages/', views.messages_between, name='messages_between'),
	path('chats/<int:user_id>/send/', views.send_message, name='send_message'),
	path('block/', views.block_user, name='block_user'),
	path('unblock/', views.unblock_user, name='unblock_user'),
]
