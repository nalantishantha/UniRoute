# Quick API Tests for Tutoring Booking

## Test 1: Check if backend is running
```bash
curl http://localhost:8000/api/tutoring/subjects/
```

Expected: JSON response with subjects list

## Test 2: Get available slots
```bash
curl http://localhost:8000/api/tutoring/available-slots/1/
```

Replace `1` with actual tutor ID.
Expected: JSON with available_slots array

## Test 3: Create a booking (PowerShell)
```powershell
$body = @{
    student_id = 1
    tutor_id = 1
    availability_slot_id = 1
    topic = "Test Session"
    description = "Testing booking system"
    payment_type = "single"
    start_date = "2025-10-25"
    is_recurring = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/tutoring/bookings/create/" -Method Post -Body $body -ContentType "application/json"
```

## Test 3 Alternative: Using curl (Git Bash or WSL)
```bash
curl -X POST http://localhost:8000/api/tutoring/bookings/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "tutor_id": 1,
    "availability_slot_id": 1,
    "topic": "Test Session",
    "description": "Testing booking system",
    "payment_type": "single",
    "start_date": "2025-10-25",
    "is_recurring": true
  }'
```

## Expected Success Response
```json
{
  "status": "success",
  "message": "Booking created successfully. Please complete payment to confirm.",
  "booking": {
    "booking_id": 1,
    "student": 1,
    "tutor": 1,
    "status": "pending",
    ...
  },
  "payment_required": {
    "amount": 2000.0,
    "currency": "LKR",
    "sessions": 1,
    "payment_type": "single"
  }
}
```

## Common Error Responses

### Error: Student not found
```json
{
  "status": "error",
  "message": "Student not found"
}
```
**Fix**: Use a valid student_id from the `students` table

### Error: Tutor not found
```json
{
  "status": "error",
  "message": "Tutor not found"
}
```
**Fix**: Use a valid tutor_id from the `tutors` table

### Error: Availability slot not found
```json
{
  "status": "error",
  "message": "Availability slot not found or inactive"
}
```
**Fix**: Use a valid availability_slot_id from `tutor_availability` table where is_active=true

### Error: Time slot fully booked
```json
{
  "status": "error",
  "message": "This time slot is fully booked"
}
```
**Fix**: Choose a different time slot or increase max_students for that slot

### Error: Already booked
```json
{
  "status": "error",
  "message": "You already have a booking in this time slot"
}
```
**Fix**: Student already has an active booking in this slot

## Check Database for Valid IDs

### Get valid student IDs
```sql
SELECT student_id, user_id FROM students LIMIT 5;
```

### Get valid tutor IDs
```sql
SELECT tutor_id, user_id FROM tutors LIMIT 5;
```

### Get valid availability slot IDs
```sql
SELECT 
  availability_id, 
  tutor_id, 
  day_of_week, 
  start_time, 
  end_time, 
  max_students,
  is_active 
FROM tutor_availability 
WHERE is_active = 1 
LIMIT 5;
```

### Check if slot has capacity
```sql
SELECT 
  ta.availability_id,
  ta.max_students,
  COUNT(tb.booking_id) as current_bookings,
  (ta.max_students - COUNT(tb.booking_id)) as available_spots
FROM tutor_availability ta
LEFT JOIN tutoring_bookings tb ON tb.availability_slot_id = ta.availability_id 
  AND tb.status IN ('confirmed', 'active')
WHERE ta.availability_id = 1
GROUP BY ta.availability_id, ta.max_students;
```

## Frontend Browser Console Test

Open browser console and run:

```javascript
// Test API connection
fetch('http://localhost:8000/api/tutoring/subjects/')
  .then(r => r.json())
  .then(d => console.log('✅ Backend is accessible:', d))
  .catch(e => console.error('❌ Backend error:', e));

// Test booking creation
fetch('http://localhost:8000/api/tutoring/bookings/create/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: 1,
    tutor_id: 1,
    availability_slot_id: 1,
    topic: 'Browser Test',
    description: 'Testing from browser console',
    payment_type: 'single',
    start_date: '2025-10-25',
    is_recurring: true
  })
})
  .then(r => r.json())
  .then(d => console.log('✅ Booking response:', d))
  .catch(e => console.error('❌ Booking error:', e));
```

## Verify CORS

If you see CORS errors in browser console:

1. Check `backend/backend_core/settings.py` has:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

2. Install if missing:
```bash
pip install django-cors-headers
```

3. Restart Django server:
```bash
python manage.py runserver
```
