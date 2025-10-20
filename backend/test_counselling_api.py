"""
Test script for Career Counseling API endpoints
Run this from the backend directory after starting the Django server
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_list_counsellors():
    """Test listing all counsellors"""
    print("\n" + "="*60)
    print("TEST: List All Counsellors")
    print("="*60)
    
    url = f"{BASE_URL}/api/counsellors/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} counsellor(s)")
            
            for i, counsellor in enumerate(data, 1):
                print(f"\n--- Counsellor {i} ---")
                print(f"ID: {counsellor.get('counsellor_id')}")
                print(f"Name: {counsellor.get('user_details', {}).get('full_name', 'N/A')}")
                print(f"Email: {counsellor.get('user', {}).get('email', 'N/A')}")
                print(f"Experience: {counsellor.get('experience_years', 'N/A')} years")
                print(f"Hourly Rate: Rs. {counsellor.get('hourly_rate', 'N/A')}")
                print(f"Available: {counsellor.get('available_for_sessions', False)}")
                print(f"Specializations: {counsellor.get('specializations', 'N/A')}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to server. Is Django running?")
    except Exception as e:
        print(f"❌ Error: {str(e)}")


def test_get_counsellor_details(counsellor_id):
    """Test getting specific counsellor details"""
    print("\n" + "="*60)
    print(f"TEST: Get Counsellor Details (ID: {counsellor_id})")
    print("="*60)
    
    url = f"{BASE_URL}/api/counsellors/{counsellor_id}/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            counsellor = response.json()
            print("✅ Success!")
            print(f"\nCounsellor Details:")
            print(f"ID: {counsellor.get('counsellor_id')}")
            print(f"Name: {counsellor.get('user_details', {}).get('full_name', 'N/A')}")
            print(f"Email: {counsellor.get('user', {}).get('email', 'N/A')}")
            print(f"Username: {counsellor.get('user', {}).get('username', 'N/A')}")
            print(f"Bio: {counsellor.get('bio', 'N/A')[:100]}...")
            print(f"Experience: {counsellor.get('experience_years', 'N/A')} years")
            print(f"Qualifications: {counsellor.get('qualifications', 'N/A')}")
            print(f"Specializations: {counsellor.get('specializations', 'N/A')}")
            print(f"Expertise: {counsellor.get('expertise', 'N/A')}")
            print(f"Hourly Rate: Rs. {counsellor.get('hourly_rate', 'N/A')}")
            print(f"Available: {counsellor.get('available_for_sessions', False)}")
            print(f"Contact: {counsellor.get('user_details', {}).get('contact_number', 'N/A')}")
            print(f"Location: {counsellor.get('user_details', {}).get('location', 'N/A')}")
            print(f"Verified: {counsellor.get('user_details', {}).get('is_verified', False)}")
        elif response.status_code == 404:
            print(f"❌ Counsellor not found or not available")
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to server. Is Django running?")
    except Exception as e:
        print(f"❌ Error: {str(e)}")


def test_frontend_compatibility():
    """Test if API response matches frontend expectations"""
    print("\n" + "="*60)
    print("TEST: Frontend Compatibility Check")
    print("="*60)
    
    url = f"{BASE_URL}/api/counsellors/"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            
            if not data:
                print("⚠️  Warning: No counsellors found in database")
                return
            
            counsellor = data[0]  # Check first counsellor
            
            # Check required fields for frontend
            required_fields = [
                ('counsellor_id', counsellor.get('counsellor_id')),
                ('user', counsellor.get('user')),
                ('user_details', counsellor.get('user_details')),
            ]
            
            print("\n✅ Checking required fields:")
            all_good = True
            for field_name, field_value in required_fields:
                status = "✅" if field_value is not None else "❌"
                print(f"  {status} {field_name}: {'Present' if field_value else 'Missing'}")
                if not field_value:
                    all_good = False
            
            if counsellor.get('user_details'):
                user_detail_fields = [
                    'full_name',
                    'profile_picture',
                    'bio',
                    'contact_number',
                    'is_verified'
                ]
                print("\n✅ Checking user_details fields:")
                for field in user_detail_fields:
                    value = counsellor['user_details'].get(field)
                    status = "✅" if value is not None else "⚠️ "
                    print(f"  {status} {field}: {value if value else 'Empty'}")
            
            if all_good:
                print("\n✅ All required fields present! Frontend should work correctly.")
            else:
                print("\n⚠️  Some required fields are missing. Check database.")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")


if __name__ == "__main__":
    print("="*60)
    print("CAREER COUNSELLING API TESTS")
    print("="*60)
    
    # Test 1: List all counsellors
    test_list_counsellors()
    
    # Test 2: Get specific counsellor (try ID 1)
    test_get_counsellor_details(1)
    
    # Test 3: Frontend compatibility
    test_frontend_compatibility()
    
    print("\n" + "="*60)
    print("TESTS COMPLETED")
    print("="*60)
    print("\nTo run these tests:")
    print("1. Make sure Django server is running: python manage.py runserver")
    print("2. Install requests if needed: pip install requests")
    print("3. Run this script: python test_counselling_api.py")
    print("\n")
