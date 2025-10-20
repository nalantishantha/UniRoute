# Mentoring Request Expiry Date Implementation

## Overview
This document describes the implementation of automatic expiry date calculation for mentoring booking requests. The expiry date is set to **3 hours before the preferred/scheduled session time**.

## Changes Made

### 1. Main Views - `backend/apps/mentoring/views.py`

#### MentoringRequestsView.post() (Line ~177)
**Updated:** The expiry date calculation when creating a new mentoring request.

**Before:**
```python
expiry_date=timezone.now() + timedelta(days=7)  # Expires in 7 days
```

**After:**
```python
# Calculate expiry date (3 hours before the preferred time)
expiry_datetime = scheduled_at - timedelta(hours=3)
# ...
expiry_date=expiry_datetime  # 3 hours before the preferred time
```

### 2. Student Views - `backend/apps/students/views.py`

#### create_mentoring_session() (Line ~623)
**Already Implemented:** This view was already correctly calculating the expiry date as 3 hours before the preferred time.

```python
# Calculate expiry date (3 hours before the preferred time)
expiry_datetime = preferred_datetime - timedelta(hours=3)
# ...
expiry_date=expiry_datetime,  # 3 hours before the preferred time
```

### 3. Management Commands

#### add_pending_requests.py
**Updated:** Sample data creation now uses actual datetime values and calculates expiry dates correctly.

**Changes:**
- Preferred time is now a datetime object (5-10 days in the future)
- Expiry date is calculated as 3 hours before the preferred time
- Preferred time is stored as ISO format string

**Before:**
```python
preferred_time=request_data['preferred_time'],  # String like "Weekdays 1-3 PM"
expiry_date=timezone.now() + timedelta(days=7)
```

**After:**
```python
preferred_datetime = timezone.now() + timedelta(days=days_ahead, hours=hours_ahead)
expiry_datetime = preferred_datetime - timedelta(hours=3)
preferred_time=preferred_datetime.isoformat(),  # ISO format datetime string
expiry_date=expiry_datetime  # 3 hours before preferred time
```

#### add_sample_mentoring_data.py
**Updated:** Sample mentoring data now uses actual datetime values for preferred time.

**Changes:**
- Preferred time is now calculated as a future datetime
- Expiry date is 3 hours before the preferred time
- Preferred time stored as ISO format string

#### create_sample_data.py
**Updated:** All sample requests now have proper datetime-based preferred times.

**Changes:**
- Each request has a specific future datetime for preferred_time
- Expiry date calculated as 3 hours before each preferred time
- Maintains realistic test data with various future dates

## Logic Explanation

### How It Works

1. **When a student creates a mentoring request:**
   - They specify a `scheduled_at` or `preferred_time` (the desired session datetime)
   - The system parses this datetime
   - Calculates: `expiry_date = preferred_time - 3 hours`
   - Stores both values in the database

2. **Example:**
   - Student requests a session for: **January 25, 2024 at 2:00 PM**
   - System sets expiry date to: **January 25, 2024 at 11:00 AM**
   - Mentor must accept/decline before 11:00 AM on January 25
   - If no response by 11:00 AM, the request automatically expires

3. **Automatic Expiry:**
   - The `MentoringRequestsView.get()` method includes `update_expired_requests()`
   - This method checks for pending requests past their expiry date
   - Automatically updates their status to 'expired'

### Database Schema

The `mentoring_requests` table includes:
- `preferred_time` (VARCHAR): Stores the preferred session datetime as ISO format string
- `requested_date` (DATETIME): When the request was created
- `expiry_date` (DATETIME): When the request expires (3 hours before preferred_time)
- `status` (VARCHAR): Current status (pending, scheduled, completed, declined, expired)

## Testing

### Manual Testing
To test this feature:

1. Create a mentoring request with a preferred time 5 hours from now
2. Verify the expiry_date is set to 2 hours from now (3 hours before preferred time)
3. Wait for the expiry time to pass
4. Fetch the request - it should automatically be marked as 'expired'

### Using Management Commands
```bash
# Create sample pending requests with proper expiry dates
python manage.py add_pending_requests --count 5

# Create comprehensive sample data
python manage.py create_sample_data
```

## Benefits

1. **Automatic Time Management:** Requests expire automatically without manual intervention
2. **Mentor Response Urgency:** Mentors have a clear deadline to respond
3. **Student Planning:** Students know their request will expire 3 hours before the session
4. **System Efficiency:** Expired requests don't clutter the pending list
5. **Fair Allocation:** Prevents last-minute scheduling conflicts

## Future Enhancements

Potential improvements:
1. Email notifications when request is about to expire (1 hour before)
2. Configurable expiry window (admin setting instead of hardcoded 3 hours)
3. Automatic extension if mentor is viewing the request near expiry
4. Statistics on average response time vs expiry deadline

## Related Files

- `backend/apps/mentoring/models.py` - MentoringRequests model
- `backend/apps/mentoring/views.py` - Request creation and management
- `backend/apps/students/views.py` - Student-side request creation
- Management commands for sample data generation
