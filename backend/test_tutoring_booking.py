"""
Test script to verify tutoring booking endpoint
Run from backend directory: python test_tutoring_booking.py
"""

import requests
import json

# Configuration
API_BASE_URL = 'http://localhost:8000/api'

def test_create_booking():
    """Test creating a tutoring booking"""
    
    # Sample data (adjust IDs as needed based on your database)
    booking_data = {
        'student_id': 1,  # Change to a valid student ID
        'tutor_id': 1,    # Change to a valid tutor ID
        'availability_slot_id': 1,  # Change to a valid availability slot ID
        'topic': 'Test Calculus Session',
        'description': 'Testing the booking system',
        'payment_type': 'single',
        'start_date': '2025-10-25',
        'is_recurring': True
    }
    
    url = f'{API_BASE_URL}/tutoring/bookings/create/'
    
    print(f"Testing: POST {url}")
    print(f"Payload: {json.dumps(booking_data, indent=2)}")
    print("-" * 50)
    
    try:
        response = requests.post(
            url,
            json=booking_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print("-" * 50)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"Response: {json.dumps(data, indent=2)}")
            return data
        else:
            print(f"❌ Error!")
            print(f"Response Text: {response.text}")
            try:
                error_data = response.json()
                print(f"Error Data: {json.dumps(error_data, indent=2)}")
            except:
                pass
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Cannot connect to backend server")
        print("Make sure the Django server is running on http://localhost:8000")
        return None
    except Exception as e:
        print(f"❌ Unexpected Error: {type(e).__name__}: {str(e)}")
        return None


def test_get_available_slots():
    """Test getting available slots"""
    tutor_id = 1  # Change to a valid tutor ID
    url = f'{API_BASE_URL}/tutoring/available-slots/{tutor_id}/'
    
    print(f"\nTesting: GET {url}")
    print("-" * 50)
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"Available Slots: {len(data.get('available_slots', []))}")
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Error!")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {type(e).__name__}: {str(e)}")


if __name__ == '__main__':
    print("=" * 50)
    print("TUTORING BOOKING API TEST")
    print("=" * 50)
    
    # Test 1: Get available slots
    print("\n📋 Test 1: Get Available Slots")
    test_get_available_slots()
    
    # Test 2: Create booking
    print("\n📋 Test 2: Create Booking")
    booking_result = test_create_booking()
    
    if booking_result and booking_result.get('status') == 'success':
        booking_id = booking_result['booking']['booking_id']
        print(f"\n✅ Booking created successfully with ID: {booking_id}")
        print(f"Payment Required: Rs. {booking_result['payment_required']['amount']}")
    
    print("\n" + "=" * 50)
    print("Test Complete")
    print("=" * 50)
