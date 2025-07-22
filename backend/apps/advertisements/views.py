from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from django.utils import timezone
import json

from .models import AdSpaces, Advertisements, AdBookings
from apps.universities.models import Universities

@csrf_exempt
def get_ad_spaces(request):
    """Get all available advertisement spaces"""
    if request.method == 'GET':
        try:
            spaces = AdSpaces.objects.filter(is_active=1).all()
            spaces_data = []
            
            for space in spaces:
                space_data = {
                    'space_id': space.space_id,
                    'name': space.name,
                    'description': space.description or '',
                    'recommended_size': space.recommended_size or '',
                    'price_per_day': str(space.price_per_day),
                    'is_active': space.is_active
                }
                spaces_data.append(space_data)
            
            return JsonResponse({
                'success': True,
                'spaces': spaces_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch advertisement spaces: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def check_availability(request):
    """Check if an advertisement space is available for given dates"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            space_id = data.get('space_id')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            
            if not all([space_id, start_date, end_date]):
                return JsonResponse({
                    'success': False,
                    'message': 'space_id, start_date, and end_date are required'
                }, status=400)
            
            # Check for conflicting bookings
            conflicting_bookings = AdBookings.objects.filter(
                space_id=space_id,
                status__in=['Pending', 'Confirmed'],
                start_date__lte=end_date,
                end_date__gte=start_date
            ).count()
            
            is_available = conflicting_bookings == 0
            
            # Get space details
            try:
                space = AdSpaces.objects.get(space_id=space_id)
                space_info = {
                    'name': space.name,
                    'price_per_day': str(space.price_per_day)
                }
            except AdSpaces.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Advertisement space not found'
                }, status=404)
            
            return JsonResponse({
                'success': True,
                'available': is_available,
                'space': space_info,
                'message': 'Available for booking' if is_available else 'Space is already booked for these dates'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to check availability: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def create_booking(request):
    """Create a new advertisement booking"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract required fields
            university_id = data.get('university_id')
            title = data.get('title')
            image_url = data.get('image_url')
            target_url = data.get('target_url', '')
            space_id = data.get('space_id')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            
            if not all([university_id, title, image_url, space_id, start_date, end_date]):
                return JsonResponse({
                    'success': False,
                    'message': 'university_id, title, image_url, space_id, start_date, and end_date are required'
                }, status=400)
            
            # Check if university exists
            try:
                university = Universities.objects.get(university_id=university_id)
            except Universities.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University not found'
                }, status=404)
            
            # Check if space exists
            try:
                space = AdSpaces.objects.get(space_id=space_id)
            except AdSpaces.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Advertisement space not found'
                }, status=404)
            
            # Check availability again
            conflicting_bookings = AdBookings.objects.filter(
                space_id=space_id,
                status__in=['Pending', 'Confirmed'],
                start_date__lte=end_date,
                end_date__gte=start_date
            ).count()
            
            if conflicting_bookings > 0:
                return JsonResponse({
                    'success': False,
                    'message': 'Space is no longer available for these dates'
                }, status=409)
            
            # Calculate total price
            from datetime import datetime
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
            days = (end - start).days + 1
            total_price = space.price_per_day * days
            
            with transaction.atomic():
                # Create advertisement
                advertisement = Advertisements.objects.create(
                    university=university,
                    title=title,
                    image_url=image_url,
                    target_url=target_url,
                    created_at=timezone.now()
                )
                
                # Create booking
                booking = AdBookings.objects.create(
                    ad=advertisement,
                    space=space,
                    start_date=start_date,
                    end_date=end_date,
                    total_price=total_price,
                    status='Pending',
                    created_at=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Advertisement booking created successfully',
                    'booking_id': booking.booking_id,
                    'ad_id': advertisement.ad_id,
                    'total_price': str(total_price),
                    'status': 'Pending'
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to create booking: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
def get_university_bookings(request, university_id):
    """Get all advertisement bookings for a specific university"""
    if request.method == 'GET':
        try:
            # Get all bookings for this university
            bookings = AdBookings.objects.select_related(
                'ad',
                'space'
            ).filter(
                ad__university_id=university_id
            ).order_by('-created_at')
            
            bookings_data = []
            for booking in bookings:
                booking_data = {
                    'booking_id': booking.booking_id,
                    'ad_id': booking.ad.ad_id,
                    'title': booking.ad.title,
                    'space_name': booking.space.name,
                    'start_date': booking.start_date.strftime('%Y-%m-%d') if booking.start_date else '',
                    'end_date': booking.end_date.strftime('%Y-%m-%d') if booking.end_date else '',
                    'total_price': str(booking.total_price),
                    'status': booking.status or 'Pending',
                    'image_url': booking.ad.image_url or '',
                    'target_url': booking.ad.target_url or '',
                    'created_at': booking.created_at.isoformat() if booking.created_at else ''
                }
                bookings_data.append(booking_data)
            
            return JsonResponse({
                'success': True,
                'bookings': bookings_data,
                'total_count': len(bookings_data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to fetch bookings: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)
