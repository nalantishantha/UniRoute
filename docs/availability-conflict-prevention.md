# Availability Conflict Prevention

## Overview
This feature prevents scheduling conflicts when a user is both a **tutor** and a **mentor**. The system ensures that a user cannot have overlapping availability slots for tutoring and mentoring at the same time.

## Problem Statement
- Users can be both tutors (teaching A/L subjects) and mentors (guiding on university programs)
- Each role has separate availability management
- Without conflict detection, a user could accidentally schedule tutoring and mentoring sessions at the same time
- This creates scheduling conflicts and poor user experience

## Solution
Implemented cross-system conflict detection that checks for overlapping availability when creating or updating slots.

## How It Works

### Scenario 1: User has Tutoring Availability, tries to add Mentoring Availability

**Example:**
- User has tutoring slot: **Saturday 1:00 PM - 3:00 PM**
- User tries to add mentoring slot: **Saturday 2:00 PM - 4:00 PM**

**Result:** ❌ **BLOCKED**
```
Error: "Cannot add mentoring availability. You already have a tutoring 
session scheduled on Saturday from 13:00 to 15:00."
```

### Scenario 2: User has Mentoring Availability, tries to add Tutoring Availability

**Example:**
- User has mentoring slot: **Monday 10:00 AM - 12:00 PM**
- User tries to add tutoring slot: **Monday 11:00 AM - 1:00 PM**

**Result:** ❌ **BLOCKED**
```
Error: "Cannot add tutoring availability. You already have a mentoring 
session scheduled on this day from 10:00 to 12:00."
```

### Scenario 3: No Overlap

**Example:**
- User has tutoring slot: **Saturday 1:00 PM - 3:00 PM**
- User tries to add mentoring slot: **Saturday 3:00 PM - 5:00 PM**

**Result:** ✅ **ALLOWED**
```
Success: "Availability added successfully"
```

## Conflict Detection Logic

### Time Overlap Detection
Two time slots overlap if:
```
slot_A.start_time < slot_B.end_time AND slot_A.end_time > slot_B.start_time
```

**Examples:**
- Slot A: 13:00 - 15:00, Slot B: 14:00 - 16:00 → **OVERLAP** ✓
- Slot A: 13:00 - 15:00, Slot B: 15:00 - 17:00 → **NO OVERLAP** (adjacent)
- Slot A: 13:00 - 15:00, Slot B: 16:00 - 18:00 → **NO OVERLAP** (separate)

### Same Day Requirement
Conflicts are only checked for the **same day of the week**:
- Saturday tutoring slot does NOT conflict with Monday mentoring slot
- Only Saturday slots are checked against each other

## Implementation Details

### Modified Endpoints

#### 1. Create Tutoring Availability
**Endpoint:** `POST /api/tutoring/<tutor_id>/availability/`

**Added Logic:**
```python
# Find if user is also a mentor
mentor = Mentors.objects.filter(user=tutor.user).first()

if mentor:
    # Check for overlapping mentoring availability
    overlapping_mentoring = MentorAvailability.objects.filter(
        mentor=mentor,
        day_of_week=data['day_of_week'],
        is_active=True
    ).filter(
        Q(start_time__lt=end_time) & Q(end_time__gt=start_time)
    )
    
    if overlapping_mentoring.exists():
        return error message
```

#### 2. Update Tutoring Availability
**Endpoint:** `PUT /api/tutoring/<tutor_id>/availability/`

**Added Logic:** Same conflict check as create, but applied during updates

#### 3. Create Mentoring Availability
**Endpoint:** `POST /api/students/mentors/<mentor_id>/availability/`

**Added Logic:**
```python
# Find if user is also a tutor
tutor = Tutors.objects.filter(user=mentor.user).first()

if tutor:
    # Check for overlapping tutoring availability
    overlapping_tutoring = TutorAvailability.objects.filter(
        tutor=tutor,
        day_of_week=data['day_of_week'],
        is_active=True
    ).filter(
        Q(start_time__lt=end_time) & Q(end_time__gt=start_time)
    )
    
    if overlapping_tutoring.exists():
        return error message
```

#### 4. Update Mentoring Availability
**Endpoint:** `PUT /api/students/mentors/<mentor_id>/availability/`

**Added Logic:** Same conflict check as create, but applied during updates

### Database Models

#### TutorAvailability (tutoring app)
```python
class TutorAvailability(models.Model):
    tutor = ForeignKey(Tutors)
    day_of_week = IntegerField(0-6)  # 0=Sunday, 6=Saturday
    start_time = TimeField()
    end_time = TimeField()
    is_active = BooleanField()
```

#### MentorAvailability (mentoring app)
```python
class MentorAvailability(models.Model):
    mentor = ForeignKey(Mentors)
    day_of_week = IntegerField(0-6)  # 0=Sunday, 6=Saturday
    start_time = TimeField()
    end_time = TimeField()
    is_active = BooleanField()
```

#### User Relationship
Both `Tutors` and `Mentors` have:
```python
user = ForeignKey(Users)
```

This common `user` field enables cross-checking.

## Error Messages

### For Tutoring Conflicts
```
"Cannot add tutoring availability. You already have a mentoring session 
scheduled on this day from {start_time} to {end_time}."
```

### For Mentoring Conflicts
```
"Cannot add mentoring availability. You already have a tutoring session 
scheduled on {day_name} from {start_time} to {end_time}."
```

## Testing

### Manual Testing Steps

1. **Setup:**
   - Create a user account
   - Register as both tutor and mentor

2. **Test Create Conflict:**
   ```
   Step 1: Add tutoring availability - Saturday 13:00-15:00
   Step 2: Try to add mentoring availability - Saturday 14:00-16:00
   Expected: Error message about conflict
   ```

3. **Test Update Conflict:**
   ```
   Step 1: Add tutoring availability - Saturday 13:00-15:00
   Step 2: Add mentoring availability - Saturday 16:00-18:00 (no conflict)
   Step 3: Try to update mentoring to Saturday 14:00-16:00
   Expected: Error message about conflict
   ```

4. **Test No Conflict:**
   ```
   Step 1: Add tutoring availability - Saturday 13:00-15:00
   Step 2: Try to add mentoring availability - Saturday 15:00-17:00
   Expected: Success (adjacent times don't conflict)
   ```

### Automated Testing
Run the test script:
```bash
cd backend
python test_availability_conflicts.py
```

## Edge Cases Handled

1. **User is only a tutor:** No mentoring availability exists, no conflicts possible
2. **User is only a mentor:** No tutoring availability exists, no conflicts possible
3. **Inactive slots:** Only `is_active=True` slots are checked for conflicts
4. **Different days:** Slots on different days don't conflict
5. **Adjacent times:** 13:00-15:00 and 15:00-17:00 don't conflict (no overlap)

## User Experience

### Frontend Integration
When the error occurs, the frontend should:
1. Display the error message in a user-friendly format
2. Highlight the conflicting slot in the availability calendar
3. Suggest alternative time slots
4. Allow user to view/edit existing availability

### Example UI Flow
```
User action: Add mentoring slot Saturday 14:00-16:00
↓
Backend validation
↓
Conflict detected with tutoring slot Saturday 13:00-15:00
↓
Error message displayed:
"⚠️ Time Conflict
You already have a tutoring session on Saturday from 1:00 PM to 3:00 PM.
Please choose a different time or edit your existing availability."

[View Existing Availability] [Choose Different Time]
```

## Benefits

1. ✅ **Prevents double-booking**
2. ✅ **Maintains data integrity**
3. ✅ **Improves user experience**
4. ✅ **Clear error messages**
5. ✅ **Works for both create and update operations**
6. ✅ **No performance impact** (efficient database queries)

## Future Enhancements

1. **Visual Calendar View:** Show both tutoring and mentoring availability on a single calendar
2. **Bulk Import Validation:** Check conflicts when importing multiple slots
3. **Suggestion System:** Suggest alternative time slots when conflict detected
4. **Notification System:** Notify user if existing availability creates conflicts with new bookings
5. **Grace Period:** Allow small gaps (e.g., 15 minutes) between sessions for transition time

## Related Files

- `backend/apps/tutoring/views.py` - Tutoring availability endpoints
- `backend/apps/mentoring/views.py` - Mentoring availability endpoints
- `backend/apps/tutoring/models.py` - TutorAvailability model
- `backend/apps/mentoring/models.py` - MentorAvailability model
- `backend/test_availability_conflicts.py` - Test script

## Migration Required?

**No database migration required.** This is purely validation logic using existing database structure.

---
**Last Updated:** October 20, 2025  
**Feature Status:** ✅ Implemented and Ready for Testing
