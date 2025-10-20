# Tutoring Availability System - Troubleshooting Guide

## ✅ System Status

### Database Tables
- ✅ `tutor_availability` table exists with all required columns
- ✅ `tutoring_bookings` table exists with all required columns
- ✅ Both tables tested and working correctly

### Backend API
- ✅ All endpoints functional
- ✅ Create/Read/Update/Delete operations tested
- ✅ Serialization working correctly

### Test Results
```
POST /api/tutoring/availability/1/
Response Status: 200
Response Data: {
  "status": "success",
  "message": "Availability slot created successfully",
  "availability": {
    "availability_id": 2,
    "tutor": 1,
    "day_of_week": 6,
    "day_name": "Saturday",
    ...
  }
}
✅ SUCCESS! Availability slot created
```

## 📋 Available Tutors

| Tutor ID | Username       | User ID | University Student ID | Registration |
|----------|----------------|---------|-----------------------|--------------|
| 1        | nethmi.nimasha | 33      | 5                     | 2022/CS/137  |
| 2        | uni_student1   | 19      | 2                     | 2022/CS/182  |

## 🔧 How to Test

### 1. Login as a Tutor
Use one of these credentials:
- **Username**: `nethmi.nimasha` (Tutor ID: 1)
- **Username**: `uni_student1` (Tutor ID: 2)

### 2. Navigate to Calendar Page
- Go to: `/unistudent/calendar`
- Click on "Availability Management" tab

### 3. Add Tutoring Availability
- You should see "Tutoring Availability (Recurring)" section
- Click "Add Slot" button
- Fill in the form:
  - **Day of Week**: Select any day (e.g., Saturday)
  - **Start Time**: e.g., 09:00 AM
  - **End Time**: e.g., 11:00 PM
  - **Max Students**: e.g., 1
  - **Subject**: Optional
  - **Recurring Weekly**: ✓ Checked
  - **Active**: ✓ Checked
- Click "Add" button

### 4. What Should Happen
- ✅ The slot should be created successfully
- ✅ You should see a success message
- ✅ The slot should appear in the list grouped by day
- ✅ No JSON parse errors

## 🐛 Common Issues & Solutions

### Issue 1: "Unexpected token '<', "<!DOCTYPE"..." Error
**Cause**: tutorId is undefined or null
**Solution**: 
- Check browser console for: `TutoringAvailabilityManager - tutorId: undefined`
- Make sure you're logged in as a user who is a tutor
- The system will now show a helpful error message if tutorId is missing

### Issue 2: "No Tutor ID Found" Message
**Cause**: The logged-in user is not a tutor in the database
**Solution**:
1. Log in as one of the existing tutors (see table above)
2. OR create a new tutor entry for your user:
   ```python
   from apps.tutoring.models import Tutors
   from apps.accounts.models import Users
   
   user = Users.objects.get(username='your_username')
   tutor = Tutors.objects.create(
       user=user,
       university_student_id=your_university_student_id,
       bio='Your bio here',
       expertise='Your expertise here'
   )
   ```

### Issue 3: Loading Spinner Stuck
**Cause**: Frontend is waiting for tutorId to be fetched
**Solution**: 
- Check if `/api/tutoring/tutors/` endpoint is accessible
- Verify the logged-in user has `university_student_id` in localStorage
- Check browser network tab for failed requests

## 🔍 Debug Checklist

If you encounter issues, check these in order:

1. **Backend Server Running**
   ```powershell
   cd d:\Projects\UniRoute\backend
   python manage.py runserver
   ```
   Should show: `Starting development server at http://127.0.0.1:8000/`

2. **User Logged In**
   - Open browser DevTools > Console
   - Type: `localStorage.getItem('user')`
   - Should show user object with `user_id` and `university_student_id`

3. **Tutor ID Retrieved**
   - Check console for: `TutoringAvailabilityManager - tutorId: 1` (or 2)
   - Should NOT be: `undefined`, `null`, `"undefined"`, or `"null"`

4. **API Endpoints Accessible**
   - Test in browser: `http://localhost:8000/api/tutoring/tutors/`
   - Should return JSON with list of tutors
   - Test: `http://localhost:8000/api/tutoring/subjects/`
   - Should return JSON with list of subjects

5. **Network Requests**
   - Open browser DevTools > Network tab
   - Try to add availability
   - Check the POST request to `/api/tutoring/availability/{id}/`
   - Response should be JSON, not HTML

## 📝 Recent Fixes Applied

### Frontend Changes
1. ✅ Fixed tutor ID prop name mismatch in `CalendarPage.jsx`
   - Changed `mentorId` to `tutorId` prop for TutoringAvailabilityManager
   
2. ✅ Added tutor ID fetching logic in `CalendarPage.jsx`
   - Fetches tutor_id by matching university_student_id
   - Shows loading state while fetching
   
3. ✅ Added tutor data normalization in `FindTutors.jsx`
   - Ensures all expected fields are present when navigating to booking page
   
4. ✅ Fixed tutor ID in `TutorBooking.jsx`
   - Uses `tutor.tutor_id` instead of `tutor.id`
   
5. ✅ Added debug logging and error handling in `TutoringAvailabilityManager.jsx`
   - Shows helpful error if tutorId is missing
   - Logs tutorId to console for debugging

## 🎯 Next Steps

If everything is set up correctly:
1. The system should work when logged in as a tutor
2. You can add/edit/delete availability slots
3. Students can view and book these slots
4. The recurring booking system with payment integration is ready

## 📞 Support

If issues persist:
1. Check all items in the Debug Checklist above
2. Look for console errors in browser DevTools
3. Check Django server logs for backend errors
4. Verify database tables exist using `check_tables.py` script
