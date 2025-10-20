# Troubleshooting: "Failed to Fetch" Error on Tutoring Booking

## Issue Description
When clicking "Proceed to Payment" button:
- Booking data is inserted into `tutoring_bookings` table
- Payment modal does NOT appear
- Error message displays: "Failed to fetch"

## Root Cause Analysis

The "Failed to fetch" error typically occurs due to:
1. **Backend server not running**
2. **CORS (Cross-Origin Resource Sharing) issues**
3. **Network/connection problems**
4. **Incorrect API endpoint**
5. **Invalid response format from backend**

## Diagnostic Steps

### Step 1: Check if Backend Server is Running

```bash
# In terminal, navigate to backend directory
cd D:\Projects\UniRoute\backend

# Check if server is running
# You should see output like: "Starting development server at http://127.0.0.1:8000/"
```

If not running, start it:
```bash
python manage.py runserver
```

### Step 2: Test the API Endpoint Directly

Run the test script:
```bash
cd D:\Projects\UniRoute\backend
python test_tutoring_booking.py
```

This will show:
- ✅ If the endpoint is accessible
- ✅ If it returns proper JSON
- ❌ Any errors from the backend

### Step 3: Check Browser Console

Open your browser's Developer Tools (F12):

1. **Console Tab**: Look for errors like:
   ```
   Failed to fetch
   CORS policy error
   net::ERR_CONNECTION_REFUSED
   ```

2. **Network Tab**: 
   - Find the request to `/api/tutoring/bookings/create/`
   - Check:
     - Status Code (should be 200)
     - Response body
     - Request payload
     - Response headers

### Step 4: Verify CORS Settings

Check `backend/backend_core/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

### Step 5: Test with Browser Network Tools

1. Open DevTools → Network tab
2. Click "Proceed to Payment"
3. Look for the POST request to `/api/tutoring/bookings/create/`
4. Check:
   - Request URL
   - Request Method (should be POST)
   - Status Code
   - Response

## Common Solutions

### Solution 1: Backend Not Running

```bash
cd backend
python manage.py runserver
```

### Solution 2: CORS Not Configured

Add to `backend/backend_core/settings.py`:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

Install corsheaders if not installed:
```bash
pip install django-cors-headers
```

### Solution 3: Wrong API Base URL

Check `frontend/src/utils/tutoringAPI.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';  // Verify this matches your backend
```

### Solution 4: Frontend Port Mismatch

Check which port Vite is running on:
```bash
cd frontend
npm run dev
```

Look for output like:
```
Local:   http://localhost:5173/
```

Make sure CORS settings include this port.

## Enhanced Error Logging

The code has been updated with enhanced logging. Check browser console for:

```javascript
Creating booking with data: {...}  // Request payload
Booking created successfully: {...}  // Successful response
Booking creation error: {...}  // Error details
```

## Debugging Checklist

- [ ] Backend server is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] CORS is properly configured
- [ ] Student ID exists in database
- [ ] Tutor ID exists in database
- [ ] Availability slot ID exists and is active
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows 200 status code
- [ ] Response contains valid JSON with `status: 'success'`

## Quick Test

1. **Open browser console** (F12)
2. **Click "Proceed to Payment"**
3. **Check console output**:
   ```
   Creating booking with data: {...}
   ```
4. **Check Network tab**:
   - Look for request to `/api/tutoring/bookings/create/`
   - Status should be **200 OK**
   - Response should contain:
     ```json
     {
       "status": "success",
       "booking": {...},
       "payment_required": {...}
     }
     ```

## If Booking is Created but Modal Doesn't Open

If the booking appears in the database but the modal doesn't open, the issue is likely:

1. **Response parsing error**: Check browser console for JSON errors
2. **State update issue**: Check React DevTools for state changes
3. **Missing response fields**: Verify response has `payment_required.amount` and `payment_required.sessions`

Add this to browser console to debug:
```javascript
// Check if pendingBooking state is being set
// Open React DevTools → Components → TutoringSlotBooking → hooks
```

## Expected Flow

1. User fills form and clicks "Proceed to Payment"
2. Frontend sends POST to `/api/tutoring/bookings/create/`
3. Backend creates booking with status='pending'
4. Backend returns:
   ```json
   {
     "status": "success",
     "booking": {...},
     "payment_required": {
       "amount": 2000.0,
       "sessions": 1
     }
   }
   ```
5. Frontend sets `pendingBooking` state
6. Frontend sets `showPaymentModal` to true
7. PaymentModal component renders

## Contact Points

If issue persists, check:
1. `backend/apps/tutoring/views.py` - `create_tutoring_booking` function
2. `frontend/src/utils/tutoringAPI.js` - `createBooking` function
3. `frontend/src/components/TutoringAvailability/TutoringSlotBooking.jsx` - `handleBookingSubmit` function

---

**Last Updated**: October 20, 2025
