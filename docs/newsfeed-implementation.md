# News Feed Implementation

## Overview
The News Feed feature displays published university announcements in a Facebook-style feed format without social interaction features.

## Backend Implementation

### API Endpoint
**URL:** `GET /api/students/announcements/`

**Location:** `backend/apps/students/views.py`

**Function:** `get_published_announcements(request)`

### Query Logic
- Filters `university_announcements` table for `announcement_type = 'published'`
- Orders results by `created_at` (newest first)
- Uses `select_related('university')` for optimized database queries
- Returns announcement details with associated university information

### Response Format
```json
{
  "success": true,
  "announcements": [
    {
      "announcement_id": 1,
      "title": "Announcement Title",
      "message": "Full announcement message",
      "university_name": "University of Colombo",
      "university_id": 1,
      "created_at": "2024-12-15T10:30:00Z",
      "valid_from": "2024-12-15",
      "valid_to": "2024-12-31"
    }
  ],
  "count": 10
}
```

## Frontend Implementation

### Component
**Location:** `frontend/src/pages/Student/NewsFeed.jsx`

### Features
1. **Data Fetching**
   - Uses `useEffect` hook to fetch announcements on component mount
   - Implements loading and error states
   - Fetches from `/api/students/announcements/` endpoint

2. **UI Structure** (Facebook-style)
   - University name as post author with graduation cap icon
   - Relative timestamp (e.g., "2 hours ago", "3 days ago")
   - Announcement title as heading
   - Full message content with preserved formatting (`whitespace-pre-wrap`)
   - Clean card design with hover effects
   - No social features (likes, comments, shares)

3. **Date Formatting**
   - Less than 1 hour: "X minutes ago"
   - Less than 24 hours: "X hours ago"
   - Less than 7 days: "X days ago"
   - More than 7 days: Full date (e.g., "December 15, 2024")

4. **States**
   - **Loading:** Shows spinner animation
   - **Error:** Displays error message in red banner
   - **Empty:** Shows friendly "no announcements" message
   - **Success:** Displays list of announcement cards

### Removed Features
From the original design, the following were removed per requirements:
- ✅ Category badges
- ✅ Read time
- ✅ Likes counter and button
- ✅ Comments counter and button
- ✅ Share button
- ✅ "Read More" button
- ✅ "Load More" pagination button

## Database Schema

### Table: `university_announcements`
Relevant columns:
- `announcement_id` (Primary Key)
- `university_id` (Foreign Key to universities)
- `title` (VARCHAR)
- `message` (TEXT)
- `announcement_type` (VARCHAR - filtered for 'published')
- `created_at` (DATETIME)
- `valid_from` (DATE)
- `valid_to` (DATE)

## Testing

### Backend Testing
```bash
# Test the API endpoint
curl http://localhost:8000/api/students/announcements/
```

### Frontend Testing
1. Navigate to `/student/news-feed`
2. Verify announcements load correctly
3. Check date formatting for various time ranges
4. Test empty state (if no announcements)
5. Test error handling (stop backend server)

## Sample Data Requirements

To see announcements in the feed, ensure the database has:
- Active universities in `universities` table
- Announcements in `university_announcements` with `announcement_type = 'published'`

Example SQL:
```sql
INSERT INTO university_announcements (
  university_id, 
  title, 
  message, 
  announcement_type, 
  created_at
) VALUES (
  1,
  'New Engineering Faculty Opening',
  'We are excited to announce the opening of our new state-of-the-art Engineering Faculty.',
  'published',
  NOW()
);
```

## Future Enhancements (Optional)
- Pagination for large number of announcements
- Filter by university
- Search functionality
- Date range filtering
- Archive old announcements
