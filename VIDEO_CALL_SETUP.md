# Video Conferencing System Setup Instructions

## Overview
This system implements peer-to-peer WebRTC video conferencing for mentoring sessions without any third-party services.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Create Database Migrations
```bash
python manage.py makemigrations mentoring
python manage.py migrate
```

### 3. Run the Server with Daphne (ASGI)
Instead of `python manage.py runserver`, use:
```bash
daphne -b 0.0.0.0 -p 8000 backend_core.asgi:application
```

Or for development with auto-reload:
```bash
python manage.py runserver
```
Note: Django 5.2+ supports ASGI natively with runserver.

## Frontend Setup

### 1. No additional dependencies needed
All required packages (framer-motion, lucide-react) should already be in package.json.

### 2. Verify the route is accessible
The video call page is available at: `/video-call`

## How It Works

### Architecture:
1. **WebRTC**: Browser-to-browser peer connection for audio/video
2. **Django Channels**: WebSocket signaling server for connection setup
3. **STUN Servers**: Public Google STUN servers for NAT traversal (free)

### Flow:
1. Mentor/Student clicks "Join Video Meeting" button
2. System creates/gets a video room for the session
3. Opens video call in new window with room_id, user_id, and role parameters
4. WebSocket connects to signaling server
5. WebRTC establishes peer-to-peer connection
6. Audio/video streams directly between browsers

### Database Tables:
- `video_call_rooms`: Tracks active/ended video rooms
- `video_call_participants`: Tracks who joined each room

## Features Implemented:

✅ **Video Call Controls:**
- Toggle audio (mute/unmute)
- Toggle video (camera on/off)
- Screen sharing
- Fullscreen mode
- End call

✅ **Connection States:**
- Waiting for participant
- Connecting
- Connected
- Disconnected

✅ **UI Features:**
- Picture-in-picture local video
- Full-screen remote video
- Auto-hiding controls
- Connection status indicator
- User role labels

## Testing the System

### 1. Start Backend:
```bash
cd backend
python manage.py runserver
# or
daphne -b 0.0.0.0 -p 8000 backend_core.asgi:application
```

### 2. Start Frontend:
```bash
cd frontend
npm run dev
```

### 3. Test Video Call:
1. Login as a mentor (university student)
2. Go to Mentoring section
3. Accept a mentoring request to create a session
4. Click "Join Video Meeting" button
5. Open another browser/incognito window
6. Login as the student
7. Find the session and click "Join Video Meeting"
8. Both should see each other's video!

## API Endpoints

### Video Call REST APIs:
- `POST /api/mentoring/video-call/create/` - Create new room
- `GET /api/mentoring/video-call/<room_id>/` - Get room details
- `POST /api/mentoring/video-call/<room_id>/join/` - Join room
- `POST /api/mentoring/video-call/<room_id>/end/` - End room
- `GET /api/mentoring/video-call/session/<session_id>/` - Get room for session

### WebSocket:
- `ws://localhost:8000/ws/video-call/<room_id>/` - Signaling server

## Production Considerations

### For Production Deployment:

1. **Use Redis for Channel Layers** (better than in-memory):
   ```python
   # settings.py
   CHANNEL_LAYERS = {
       'default': {
           'BACKEND': 'channels_redis.core.RedisChannelLayer',
           'CONFIG': {
               "hosts": [('127.0.0.1', 6379)],
           },
       },
   }
   ```

2. **Set up TURN Server** (for restrictive NATs):
   - Install coturn: `sudo apt-get install coturn`
   - Configure coturn for relay if P2P fails
   - Update ICE_SERVERS in `useWebRTC.js`

3. **Use WSS (Secure WebSocket)**:
   - Update WebSocket URLs to `wss://`
   - Configure SSL certificates

4. **Update CORS Settings**:
   - Add your production domain to `CORS_ALLOWED_ORIGINS`

5. **Update API Base URL**:
   - Change `localhost:8000` to your production domain in:
     - `videoCallAPI.js`
     - `useWebRTC.js`
     - `video_call_views.py`

## Troubleshooting

### Camera/Microphone not working:
- Check browser permissions
- Use HTTPS (required for getUserMedia on non-localhost)
- Check if another app is using the camera

### Connection fails:
- Check if both users joined the room
- Check WebSocket connection in browser DevTools
- Check Django logs for errors
- Verify STUN servers are reachable

### No video/audio:
- Check browser console for errors
- Verify both users have camera/mic enabled
- Check if tracks are being added to peer connection

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support (iOS 11+)
- Opera: ✅ Full support

## Notes
- This is a 1-to-1 video call system (mentor ↔ student)
- Completely self-hosted, no external dependencies
- Uses public STUN servers (free)
- For production, consider self-hosting TURN server
- WebSocket connection required for signaling
- Actual video/audio goes peer-to-peer (not through server)
