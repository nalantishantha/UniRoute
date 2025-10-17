"""
Test script for Z-score analysis endpoint
Run this after starting the Django server with: python manage.py runserver
"""

import requests

# Test parameters
test_cases = [
    {
        "zscore": 1.8,
        "district": "Colombo",
        "stream": "Physical Science",
        "description": "High score - Physical Science in Colombo"
    },
    {
        "zscore": 1.5,
        "district": "Galle",
        "stream": "Biological Science",
        "description": "Medium score - Biological Science in Galle"
    },
    {
        "zscore": 1.2,
        "district": "Kandy",
        "stream": "Commerce",
        "description": "Lower score - Commerce in Kandy"
    }
]

base_url = "http://127.0.0.1:8000/api/university-programs/analyze-zscore/"

print("=" * 80)
print("Z-SCORE ANALYSIS ENDPOINT TEST")
print("=" * 80)
print("\nMake sure Django server is running: python manage.py runserver\n")

for i, test_case in enumerate(test_cases, 1):
    print(f"\n{'-' * 80}")
    print(f"Test Case {i}: {test_case['description']}")
    print(f"{'-' * 80}")
    
    params = {
        "zscore": test_case["zscore"],
        "district": test_case["district"],
        "stream": test_case["stream"]
    }
    
    print(f"Request: {base_url}")
    print(f"Params: {params}")
    
    try:
        response = requests.get(base_url, params=params)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data.get('success')}")
            print(f"Total Programs: {data.get('total_programs', 0)}")
            
            if data.get('eligible_programs'):
                print("\nEligible Programs:")
                for idx, program in enumerate(data['eligible_programs'][:3], 1):  # Show first 3
                    print(f"\n  {idx}. {program.get('title', 'N/A')}")
                    print(f"     University: {program.get('university_name', 'N/A')}")
                    print(f"     Faculty: {program.get('faculty_name', 'N/A')}")
                    print(f"     Required Z-Score: {program.get('required_zscore', 'N/A')} ({program.get('year', 'N/A')})")
                    print(f"     Probability: {program.get('probability', 'N/A')}")
                
                if len(data['eligible_programs']) > 3:
                    print(f"\n  ... and {len(data['eligible_programs']) - 3} more programs")
            else:
                print("No eligible programs found for this criteria")
        else:
            print(f"Error Response: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to server. Make sure Django is running!")
        break
    except Exception as e:
        print(f"ERROR: {str(e)}")

print(f"\n{'=' * 80}")
print("Test completed!")
print("=" * 80)
