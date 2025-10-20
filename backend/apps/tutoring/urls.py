from django.urls import path
from . import views
from . import video_call_views

urlpatterns = [
    # Tutoring Sessions (Legacy)
    path('sessions/', views.get_tutoring_sessions, name='get_tutoring_sessions'),
    path('sessions/create/', views.create_tutoring_session, name='create_tutoring_session'),
    path('sessions/<int:session_id>/update/', views.update_tutoring_session, name='update_tutoring_session'),
    path('sessions/<int:session_id>/delete/', views.delete_tutoring_session, name='delete_tutoring_session'),
    
    # Tutors
    path('tutors/', views.get_tutors_list, name='get_tutors_list'),
    path('tutors/available/', views.get_available_tutors, name='get_available_tutors'),
    
    # Subjects
    path('subjects/', views.get_subjects, name='get_subjects'),
    
    # Tutor Availability Management (Recurring Slots)
    path('availability/<int:tutor_id>/', views.manage_tutor_availability, name='manage_tutor_availability'),
    path('available-slots/<int:tutor_id>/', views.get_tutor_available_slots, name='get_tutor_available_slots'),
    
    # Tutoring Bookings (Recurring)
    path('bookings/create/', views.create_tutoring_booking, name='create_tutoring_booking'),
    path('bookings/<int:booking_id>/confirm-payment/', views.confirm_tutoring_booking_payment, name='confirm_tutoring_booking_payment'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_tutoring_booking, name='cancel_tutoring_booking'),
    path('bookings/student/<int:student_id>/', views.get_student_bookings, name='get_student_bookings'),
    path('bookings/tutor/<int:tutor_id>/', views.get_tutor_bookings, name='get_tutor_bookings'),
    path('bookings/<int:booking_id>/mark-completed/', views.mark_session_completed, name='mark_session_completed'),
    path('bookings/<int:booking_id>/complete/', views.complete_tutoring_booking, name='complete_tutoring_booking'),
    
    # Session Rescheduling
    path('bookings/<int:booking_id>/reschedule/', views.reschedule_tutoring_session, name='reschedule_tutoring_session'),
    path('bookings/<int:booking_id>/reschedules/', views.get_booking_reschedules, name='get_booking_reschedules'),
    
    # Tutor Session Management
    path('tutor/<int:tutor_id>/sessions/', views.get_tutor_sessions_detailed, name='get_tutor_sessions_detailed'),
    path('tutor/<int:tutor_id>/stats/', views.get_tutor_stats, name='get_tutor_stats'),
    path('tutor/by-user/<int:user_id>/', views.get_tutor_by_user_id, name='get_tutor_by_user_id'),
    
    # Video Call Endpoints
    path('video-call/create/', video_call_views.create_tutoring_video_room, name='create_tutoring_video_room'),
    path('video-call/<str:room_id>/', video_call_views.get_tutoring_video_room, name='get_tutoring_video_room'),
    path('video-call/<str:room_id>/join/', video_call_views.join_tutoring_video_room, name='join_tutoring_video_room'),
    path('video-call/<str:room_id>/end/', video_call_views.end_tutoring_video_room, name='end_tutoring_video_room'),
    path('video-call/booking/<int:booking_id>/', video_call_views.get_or_create_room_for_booking, name='get_or_create_room_for_tutoring_booking'),
]
