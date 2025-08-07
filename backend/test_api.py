#!/usr/bin/env python
import requests
import json

BASE_URL = 'http://localhost:8000/api/pre-uni-courses'

def test_get_courses():
    """Test getting all courses"""
    try:
        response = requests.get(f'{BASE_URL}/')
        data = response.json()
        print("GET Courses:", data)
        return response.status_code == 200 and data.get('success', False)
    except Exception as e:
        print(f"Error testing GET courses: {e}")
        return False

def test_create_course():
    """Test creating a new course"""
    try:
        course_data = {
            'title': 'Test Mathematics Course',
            'description': 'A test course for mathematics',
            'category': 'Mathematics',
            'price': 100.00,
            'duration': '8 weeks',
            'status': 'Draft',
            'created_by_id': 1,
            'thumbnail': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
        }
        
        response = requests.post(f'{BASE_URL}/create/', 
                               headers={'Content-Type': 'application/json'},
                               data=json.dumps(course_data))
        data = response.json()
        print("CREATE Course:", data)
        return response.status_code == 200 and data.get('success', False)
    except Exception as e:
        print(f"Error testing CREATE course: {e}")
        return False

def test_get_stats():
    """Test getting course statistics"""
    try:
        response = requests.get(f'{BASE_URL}/stats/')
        data = response.json()
        print("GET Stats:", data)
        return response.status_code == 200 and data.get('success', False)
    except Exception as e:
        print(f"Error testing GET stats: {e}")
        return False

if __name__ == '__main__':
    print("Testing Pre-Uni Courses API...")
    print("=" * 50)
    
    # Test endpoints
    tests = [
        ("Get Courses", test_get_courses),
        ("Create Course", test_create_course),
        ("Get Stats", test_get_stats),
        ("Get Courses (after create)", test_get_courses),
    ]
    
    for test_name, test_func in tests:
        print(f"\n🧪 Testing {test_name}...")
        success = test_func()
        print(f"✅ {test_name}: {'PASSED' if success else 'FAILED'}")
    
    print("\n" + "=" * 50)
    print("API Testing Complete!")
