# Career Counseling API Integration

## Summary
Updated the Career Counseling page to fetch counselor data from the backend database instead of using hardcoded data.

## Changes Made

### Backend Changes

#### 1. New API Endpoints (`backend/apps/counsellors/urls.py`)
Added two new public endpoints:
- `GET /api/counsellors/` - List all available counselors
- `GET /api/counsellors/<counsellor_id>/` - Get specific counselor details

#### 2. New View Functions (`backend/apps/counsellors/views.py`)
Added two public view functions:

**`list_counsellors()`**
- Returns all active counselors available for sessions
- Includes user details and counselor information
- No authentication required (public endpoint)

**`get_counsellor_details(counsellor_id)`**
- Returns detailed information for a specific counselor
- Validates counselor is active and available
- No authentication required (public endpoint)

### Frontend Changes (`frontend/src/pages/Student/CareerCounseling.jsx`)

#### 1. State Management
- Added `useState` for counselors, loading, and error states
- Added `useEffect` to fetch counselors on component mount

#### 2. Data Fetching
- Implemented `fetchCounselors()` function to call API
- Handles loading and error states

#### 3. UI Updates
- Added loading spinner during data fetch
- Added error message display
- Updated counselor cards to use database fields

## Database Schema Integration

### Tables Used
1. **counsellors**
   - `counsellor_id` (Primary Key)
   - `user_id` (Foreign Key to users)
   - `expertise` (JSON/Text)
   - `bio` (Text)
   - `experience_years` (Integer)
   - `qualifications` (Text)
   - `specializations` (JSON/Text)
   - `available_for_sessions` (Boolean)
   - `hourly_rate` (Decimal)
   - `created_at`, `updated_at`

2. **users**
   - `user_id` (Primary Key)
   - `user_type_id` (Foreign Key)
   - `username`
   - `email`
   - `password_hash`
   - `is_active`
   - `created_at`

3. **user_details**
   - `user_id` (Foreign Key to users)
   - `full_name`
   - `profile_picture`
   - `bio`
   - `contact_number`
   - `location`
   - `gender`
   - `is_verified`
   - `updated_at`

4. **user_types**
   - `type_id`
   - `type_name` (e.g., 'counsellor', 'student', 'admin')

## API Response Format

### List Counselors Response
```json
[
  {
    "counsellor_id": 1,
    "user_id": 10,
    "expertise": "[\"Career Planning\", \"University Selection\"]",
    "bio": "Experienced career counselor...",
    "experience_years": 15,
    "qualifications": "PhD in Education",
    "specializations": "[\"Engineering\", \"Technology\"]",
    "available_for_sessions": true,
    "hourly_rate": 2500.00,
    "created_at": "2024-01-01T00:00:00",
    "user": {
      "user_id": 10,
      "username": "dr.samanthi",
      "email": "samanthi@uniroute.lk",
      "is_active": 1
    },
    "user_details": {
      "full_name": "Dr. Samanthi Perera",
      "profile_picture": "/media/profiles/samanthi.jpg",
      "bio": "Career counselor specializing in...",
      "contact_number": "+94771234567",
      "location": "Colombo, Sri Lanka",
      "gender": "Female",
      "is_verified": true
    }
  }
]
```

## Counselor Card Features

### Displayed Information
- **Profile Picture**: From `user_details.profile_picture` or default icon
- **Full Name**: From `user_details.full_name`
- **Verification Badge**: Shows if `user_details.is_verified` is true
- **Experience**: From `experience_years`
- **Availability**: Shows "Available" badge if `available_for_sessions` is true
- **Specialization**: First item from `specializations` array
- **Bio**: From `bio` field (truncated to 120 characters)
- **Qualifications**: From `qualifications` field (truncated to 80 characters)
- **Expertise Tags**: Up to 3 items from `expertise` array
- **Hourly Rate**: From `hourly_rate` field
- **Contact Number**: From `user_details.contact_number`

### Features Handling
- JSON parsing for `expertise` and `specializations` fields
- Graceful fallbacks for missing data
- Only shows "Book Session" button if counselor is available

## Testing

### 1. Test Backend Endpoints

**List all counselors:**
```bash
curl http://localhost:8000/api/counsellors/
```

**Get specific counselor:**
```bash
curl http://localhost:8000/api/counsellors/1/
```

### 2. Test Frontend

1. Start backend server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Start frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to: `http://localhost:5173/student/counseling`

4. Verify:
   - Loading spinner appears initially
   - Counselors load from database
   - All counselor information displays correctly
   - Profile pictures load (if available)
   - "Book Session" button only shows for available counselors
   - Clicking "Book Session" navigates to booking page

### 3. Test Error Handling

**Test with backend offline:**
- Stop backend server
- Reload frontend page
- Should show error message

**Test with no counselors:**
- Clear counselors from database
- Reload page
- Should show empty state

## Creating Test Data

### Option 1: Using Django Admin
1. Create a user with `user_type` = 'counsellor'
2. Create `UserDetails` for the user
3. Create `Counsellors` record linked to the user

### Option 2: Using Admin API
```bash
curl -X POST http://localhost:8000/api/counsellors/admin/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "admin_user_id": 1,
    "firstName": "Samanthi",
    "lastName": "Perera",
    "email": "samanthi@uniroute.lk",
    "password": "SecurePass123",
    "phoneNumber": "+94771234567",
    "experienceYears": 15,
    "qualifications": "PhD in Education, University of Moratuwa",
    "specializations": "[\"Engineering\", \"Technology Careers\"]",
    "bio": "Specialized in guiding students towards engineering careers.",
    "expertise": "[\"Career Planning\", \"Industry Trends\", \"Interview Prep\"]",
    "hourlyRate": 2500
  }'
```

## Next Steps

1. **Add Pagination**: For many counselors, add pagination to the list
2. **Add Filtering**: Filter by specialization, hourly rate, etc.
3. **Add Search**: Search by name, expertise, or specialization
4. **Add Sorting**: Sort by experience, rating, hourly rate
5. **Implement Booking**: Complete the booking functionality
6. **Add Reviews/Ratings**: Add student reviews and ratings for counselors

## Notes

- The counseling services section has been removed as requested
- Only counselors are displayed on the page
- The "Why Choose Our Counseling" section is commented out but can be re-enabled
- Profile pictures should be stored in the media folder and accessible via URL
- JSON fields (expertise, specializations) are parsed on the frontend
