 Video Meetings Feature for University Students

## Overview
Added a comprehensive video meeting feature for University Students using Jitsi Meet integration.

## Features Added

### 1. New Meeting Page (`/university-student/meetings`)
- **Instant Meetings**: Start a meeting immediately with auto-generated room name
- **Scheduled Meetings**: Schedule meetings for future dates with custom titles and descriptions
- **Meeting Management**: View, join, and delete scheduled meetings
- **Room Link Sharing**: Copy meeting links to share with other participants

### 2. Navigation Integration
- Added "Meetings" button to University Student sidebar with Video icon
- Positioned between Calendar and Earnings for logical flow

### 3. Enhanced Jitsi Component
- **Error Handling**: Graceful handling of connection failures
- **Fallback Support**: Automatically falls back to public Jitsi Meet if local server is unavailable
- **Loading States**: User-friendly loading indicators
- **Connection Troubleshooting**: Helpful error messages with troubleshooting steps

## Files Created/Modified

### New Files:
1. `frontend/src/pages/UniStudents/Meetings/Meetings.jsx` - Main meetings page component
2. `frontend/src/pages/UniStudents/Meetings/index.js` - Export file for meetings

### Modified Files:
1. `frontend/src/pages/UniStudents/index.js` - Added Meetings export
2. `frontend/src/routes/UniStudentRoutes.jsx` - Added meetings route
3. `frontend/src/components/Navigation/UniversityStudentSidebar.jsx` - Added Meetings navigation item
4. `frontend/src/components/JitsiMeeting.jsx` - Enhanced with error handling and fallback
5. `frontend/index.html` - Added fallback script loading for Jitsi API

## How to Use

### For University Students:
1. **Login** as a university student
2. **Navigate** to the sidebar and click "Meetings"
3. **Create Instant Meeting**: Click "Start Now" to immediately join a meeting
4. **Schedule Meeting**: Fill in the form with title, time, and optional description
5. **Join Scheduled Meetings**: Click "Join" button next to any scheduled meeting
6. **Share Meetings**: Use the copy button to share meeting links

### Technical Requirements:
- **Jitsi Meet Server**: Should be running on `localhost:8000` for full features
- **Fallback**: Will automatically use `meet.jit.si` if local server is unavailable
- **Browser Permissions**: Camera and microphone access required for video calls

## UI/UX Features
- **Consistent Theme**: Matches existing UniRoute design system
- **Responsive Design**: Works on desktop and mobile devices
- **Motion Animations**: Smooth transitions using Framer Motion
- **Error Handling**: User-friendly error messages and troubleshooting
- **Loading States**: Clear indicators when connecting to meetings

## Data Storage
- Scheduled meetings are stored in browser's localStorage
- Meeting data includes: title, room name, scheduled time, description, and creation timestamp
- Data persists between browser sessions

## Security Considerations
- Room names include user identifiers and timestamps for uniqueness
- Meetings are accessible only through generated room names
- No sensitive data is stored in localStorage

## Future Enhancements
- Integration with backend database for persistent meeting storage
- Email notifications for scheduled meetings
- Meeting recordings management
- Integration with calendar for automatic scheduling
- User invitation system with email notifications
