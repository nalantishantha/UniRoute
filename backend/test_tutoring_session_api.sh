#!/bin/bash

# Test script for tutoring session management endpoints
# Run this after starting the Django server: python manage.py runserver

BASE_URL="http://localhost:8000/api/tutoring"

echo "========================================="
echo "Testing Tutoring Session Management APIs"
echo "========================================="
echo ""

# Test 1: Get tutor stats
echo "1. Testing GET /tutor/1/stats/"
curl -X GET "${BASE_URL}/tutor/1/stats/" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Get upcoming sessions
echo "2. Testing GET /tutor/1/sessions/?status=upcoming"
curl -X GET "${BASE_URL}/tutor/1/sessions/?status=upcoming" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Get completed sessions
echo "3. Testing GET /tutor/1/sessions/?status=completed"
curl -X GET "${BASE_URL}/tutor/1/sessions/?status=completed" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Get reschedules for a booking (assuming booking_id=1 exists)
echo "4. Testing GET /bookings/1/reschedules/"
curl -X GET "${BASE_URL}/bookings/1/reschedules/" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 5: Try to reschedule a session (will fail if no valid booking exists)
echo "5. Testing POST /bookings/1/reschedule/"
echo "Note: This will fail if booking_id 1 doesn't exist or date is invalid"
curl -X POST "${BASE_URL}/bookings/1/reschedule/" \
  -H "Content-Type: application/json" \
  -d '{
    "original_date": "2025-10-25",
    "new_date": "2025-10-27",
    "new_start_time": "14:00",
    "new_end_time": "15:00",
    "reason": "Testing reschedule functionality",
    "requested_by": "tutor"
  }' \
  -w "\nStatus: %{http_code}\n\n"

echo "========================================="
echo "Testing Complete!"
echo "========================================="
