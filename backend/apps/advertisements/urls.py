from django.urls import path
from . import views

urlpatterns = [
    # Advertisement spaces
    path('spaces/', views.get_ad_spaces, name='get_ad_spaces'),
    
    # Availability and booking
    path('check-availability/', views.check_availability, name='check_availability'),
    path('bookings/create/', views.create_booking, name='create_booking'),
    path('bookings/university/<int:university_id>/', views.get_university_bookings, name='get_university_bookings'),
]