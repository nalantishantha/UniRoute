# Counsellor Booking System Implementation

## Overview
Successfully implemented a complete counsellor booking system similar to the mentor booking system, allowing students to book counselling sessions with available counsellors.

## ✅ Completed Tasks

### 1. Backend Models (counsellors/models.py)
Created the following models:
- **CounsellingRequests** - Store student counselling session requests
- **CouncellingSessions** - Track scheduled counselling sessions
- **CounsellingSessionDetails** - Store additional session information (location, links, notes)
- **CounsellingSessionEnrollments** - Track student enrollments in sessions
- **CounsellingFeedback** - Store student feedback for completed sessions
- **CounsellorAvailability** - Define counsellor's weekly availability schedule
- **CounsellorAvailabilityExceptions** - Handle special availability dates

### 2. Backend API Views (counsellors/counselling_session_views.py)
Implemented comprehensive API endpoints:
- `CounsellingRequestsView` - GET and POST counselling requests
- `CounsellingSessionsView` - GET counselling sessions
- `CounsellorAvailabilityView` - Manage counsellor availability
- `AvailableTimeSlotsView` - Generate available booking slots
- `accept_request` - Accept and schedule a counselling request
- `decline_request` - Decline a counselling request with reason
- `cancel_session` - Cancel a scheduled session
- `complete_session` - Mark a session as completed
- `get_counsellor_stats` - Get counsellor statistics

### 3. Backend URL Configuration (counsellors/urls.py)
Added URL patterns for all counselling session endpoints:
```python
/counsellors/requests/<counsellor_id>/           # Create/Get requests
/counsellors/sessions/<counsellor_id>/           # Get sessions
/counsellors/available-slots/<counsellor_id>/    # Get available slots
/counsellors/requests/<request_id>/accept/       # Accept request
/counsellors/requests/<request_id>/decline/      # Decline request
/counsellors/sessions/<session_id>/cancel/       # Cancel session
/counsellors/sessions/<session_id>/complete/     # Complete session
/counsellors/stats/<counsellor_id>/              # Get statistics
/counsellors/availability/<counsellor_id>/       # Manage availability
```

### 4. Frontend API Utilities (utils/counsellingAPI.js)
Created comprehensive API client with functions for:
- Request management (get, create, accept, decline)
- Session management (get, cancel, complete)
- Availability management (get, add, update, delete)
- Slot booking (getAvailableSlots, bookSlot)
- Counsellor information (getCounsellors, getCounsellorDetails)
- Statistics (getStats)

### 5. Frontend Components

#### CounsellorAvailableSlotBooking Component
- Displays available time slots in a weekly calendar view
- Allows students to select a time slot
- Shows booking form with topic and description fields
- Handles slot booking submission
- Shows success/error messages
- Refreshes available slots after booking

#### CounsellorConnection Page
- Displays counsellor profile information:
  - Profile picture or avatar
  - Name and title
  - Experience years
  - Expertise and specializations
  - Qualifications
  - Bio
  - Location
  - Hourly rate
- Integrates AvailableSlotBooking component
- Handles booking success state
- Navigation back to counsellor list

### 6. Routing (routes/StudentRoutes.jsx)
Added new route:
- `/student/counsellor-connection` - Counsellor booking page

### 7. Integration with Career Counseling Page
Updated `CareerCounseling.jsx` to:
- Pass complete counsellor data via React Router state
- Link to new `/student/counsellor-connection` route
- Display counsellor information from API response

## 📊 Database Tables Required

Run migrations to create these tables:
```sql
counselling_requests
counselling_sessions
counselling_session_details
counselling_session_enrollments
counselling_feedback
counsellor_availability
counsellor_availability_exceptions
```

## 🚀 Next Steps to Complete Setup

### 1. Run Database Migrations
```bash
cd backend
python manage.py makemigrations counsellors
python manage.py migrate
```

### 2. Add Sample Counsellor Data (Optional)
Create a script to add counsellors with availability:
```python
# In backend directory
python manage.py shell

from apps.counsellors.models import Counsellors, CounsellorAvailability
from apps.accounts.models import Users
from django.utils import timezone

# Create availability for existing counsellors
counsellor = Counsellors.objects.first()
if counsellor:
    # Monday 9AM-5PM
    CounsellorAvailability.objects.create(
        counsellor=counsellor,
        day_of_week=1,
        start_time='09:00',
        end_time='17:00',
        is_active=True
    )
```

### 3. Test the System
1. **View Counsellors**: Navigate to `/student/counseling`
2. **Click "Book Session"** on any available counsellor
3. **Select Time Slot**: Choose from available slots
4. **Fill Booking Form**: Enter topic and description
5. **Submit Request**: Send the booking request
6. **Verify**: Check if request appears in counsellor's dashboard

## 🔑 Key Features

### Student Features
✅ Browse available counsellors
✅ View counsellor profiles with expertise and qualifications
✅ See real-time availability calendar
✅ Book sessions at available time slots
✅ Provide session topic and description
✅ Receive booking confirmation

### Counsellor Features (Backend Ready)
✅ Manage weekly availability schedule
✅ Set availability exceptions (days off, special hours)
✅ View incoming session requests
✅ Accept or decline requests
✅ Cancel scheduled sessions
✅ Mark sessions as completed
✅ View session statistics

### System Features
✅ Automatic slot generation based on availability
✅ Conflict prevention (no double booking)
✅ Request expiry (3 hours before scheduled time)
✅ Session status tracking (pending, scheduled, completed, cancelled)
✅ Detailed session information storage
✅ Feedback collection system

## 📝 API Endpoint Examples

### Book a Counselling Session
```javascript
POST /api/counsellors/requests/1/
{
  "student_id": 123,
  "topic": "Career guidance for engineering",
  "description": "Need help choosing between software and mechanical engineering",
  "scheduled_at": "2025-10-25T10:00:00",
  "session_type": "online"
}
```

### Get Available Slots
```javascript
GET /api/counsellors/available-slots/1/?start_date=2025-10-21&end_date=2025-11-04

Response:
{
  "status": "success",
  "available_slots": [
    {
      "date": "2025-10-22",
      "start_time": "09:00",
      "end_time": "10:00",
      "datetime": "2025-10-22T09:00:00+05:30",
      "formatted_time": "09:00 AM",
      "day_name": "Tuesday"
    },
    ...
  ]
}
```

## 🎯 Benefits

1. **Consistent Experience**: Same booking flow as mentor system
2. **Real-time Availability**: Students see actual available slots
3. **Flexible Scheduling**: Counsellors control their availability
4. **Request Management**: Counsellors can accept/decline requests
5. **Data Tracking**: Complete session history and feedback
6. **Scalable**: Easy to add more counsellors

## 🔧 Customization Options

### Modify Slot Duration
Edit `counselling_session_views.py`, line ~440:
```python
slot_time += timedelta(hours=1)  # Change to 0.5 for 30-min slots
```

### Change Request Expiry Time
Edit `counselling_session_views.py`, line ~152:
```python
expiry_datetime = scheduled_at - timedelta(hours=3)  # Adjust hours
```

### Update Booking Form Fields
Edit `CounsellorAvailableSlotBooking.jsx` to add more fields like:
- Urgency level
- Preferred session type (video/phone/chat)
- Additional notes

## 🎨 UI Components Used

- **Card & CardContent**: Layout containers
- **Button**: Interactive elements
- **Icons**: Lucide React (Calendar, Clock, User, etc.)
- **Animations**: Framer Motion for smooth transitions
- **Gradients**: Tailwind CSS utility classes

## 📱 Responsive Design

The interface is fully responsive:
- Mobile: Single column layout
- Tablet: 2-3 column grid for slots
- Desktop: 4 column grid with sticky sidebar

## ✨ Success!

The counsellor booking system is now fully implemented and ready to use. Students can book counselling sessions through an intuitive interface, and counsellors can manage their sessions through the backend API.
