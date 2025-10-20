# Timezone Fix for Mentoring Request Expiry Dates

## Problem

When creating a mentoring request with preferred time **2025-10-26 16:00**, the system was showing:
- ✅ Preferred time: `2025-10-26 16:00:00+05:30` (correct)
- ❌ Expiry date: `2025-10-26 07:30:00.000000` (wrong - showing UTC time)

## Root Cause

Django stores all datetimes in **UTC** in the database. When you select:
- **Local time (Sri Lanka)**: 2025-10-26 16:00 (UTC+05:30)
- **Converts to UTC**: 2025-10-26 10:30
- **Subtracts 3 hours**: 2025-10-26 07:30 (UTC)

The problem was that when viewing the expiry date directly from the database, it showed the UTC time (07:30) instead of converting it back to local time (13:00).

## Solution

The fix ensures:
1. ✅ Input datetime is parsed with timezone information
2. ✅ Expiry is calculated correctly (3 hours before)
3. ✅ Both preferred_time and expiry_date are returned with timezone info in API responses
4. ✅ Frontend receives timezone-aware dates that display correctly

## How It Works Now

### Input
```
Selected time: 2025-10-26 16:00 (local Sri Lanka time)
```

### Processing
```python
# 1. Parse with timezone
preferred_datetime = datetime.fromisoformat("2025-10-26T16:00:00+05:30")
# Result: 2025-10-26 16:00:00+05:30

# 2. Calculate expiry (3 hours before)
expiry_datetime = preferred_datetime - timedelta(hours=3)
# Result: 2025-10-26 13:00:00+05:30
```

### Database Storage (UTC)
```
preferred_time: "2025-10-26T16:00:00+05:30"
expiry_date: 2025-10-26 07:30:00 UTC (stored in database)
```

### API Response
```json
{
  "preferred_time": "2025-10-26T16:00:00+05:30",
  "expiry_date": "2025-10-26T13:00:00+05:30"
}
```

## Verification

When you select **16:00** local time:
- **Preferred time**: 2025-10-26 16:00:00+05:30 ✓
- **Expiry date**: 2025-10-26 13:00:00+05:30 ✓
- **Time difference**: 3 hours ✓

The expiry date is now correctly shown as **13:00** (1 PM) local time, which is 3 hours before 16:00 (4 PM).

## Files Changed

1. **`backend/apps/students/views.py`**
   - Updated `create_mentoring_session()` to use `datetime.fromisoformat()` for better timezone handling
   - Store `preferred_time` as ISO string with timezone
   - Return both times with timezone info in API response

2. **`backend/apps/mentoring/views.py`**
   - Updated `MentoringRequestsView.post()` with same timezone handling

## Testing

To test:
```python
# Input datetime with timezone
input_time = "2025-10-26T16:00:00+05:30"

# After processing:
preferred_time: 2025-10-26T16:00:00+05:30
expiry_date: 2025-10-26T13:00:00+05:30

# Difference: 3 hours ✓
```

## Summary

The database correctly stores times in UTC, but the API now properly returns timezone-aware ISO strings so the frontend can display them in the user's local timezone. When you see **07:30** in the raw database, that's UTC. When converted to Sri Lanka time (+05:30), it correctly shows as **13:00**.
