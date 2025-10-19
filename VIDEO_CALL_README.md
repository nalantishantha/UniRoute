# 🎥 Video Conferencing System for UniRoute Mentoring

## 📋 Overview

A fully self-hosted, peer-to-peer WebRTC video conferencing system integrated into the UniRoute mentoring platform. This system enables real-time video calls between mentors (university students) and students without relying on any third-party services like Zoom or Google Meet.

## ✨ Features

### Video Call Features
- 🎥 **HD Video Calling** - 1280x720 resolution
- 🎤 **High-Quality Audio** - Echo cancellation, noise suppression, auto gain control
- 📺 **Screen Sharing** - Share your screen during mentoring sessions
- 🖥️ **Fullscreen Mode** - Immersive video call experience
- 🎛️ **Media Controls** - Toggle audio, video on/off
- 👥 **Picture-in-Picture** - See yourself while talking
- 📊 **Connection Status** - Real-time connection state indicators
- 🚪 **Easy Join/Leave** - One-click to join or end calls

### Technical Features
- ✅ **Peer-to-Peer** - Direct browser-to-browser connection (no server relay)
- ✅ **No Third-Party Dependencies** - Completely self-hosted
- ✅ **Free STUN Servers** - Uses Google's public STUN servers
- ✅ **WebSocket Signaling** - Django Channels for connection setup
- ✅ **Session Management** - Rooms tied to mentoring sessions
- ✅ **Auto-Recovery** - Handles disconnections gracefully

## 🏗️ Architecture

```
┌─────────────┐                                    ┌─────────────┐
│   Mentor    │                                    │   Student   │
│  (Browser)  │                                    │  (Browser)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. Join Room (WebSocket)                       │
       │ ──────────────────────────────────────────────► │
       │                                                  │
       │  2. WebRTC Offer                                │
       │ ──────────────────────────────────────────────► │
       │                                                  │
       │  3. WebRTC Answer                               │
       │ ◄────────────────────────────────────────────── │
       │                                                  │
       │  4. ICE Candidates Exchange                     │
       │ ◄─────────────────────────────────────────────► │
       │                                                  │
       │  5. Direct P2P Audio/Video Stream               │
       │ ═══════════════════════════════════════════════ │
       │         (NOT through server!)                   │
       └─────────────────────────────────────────────────┘

       WebSocket Signaling Server (Django Channels)
                      ↓
            ws://localhost:8000/ws/video-call/{room_id}/
```

## 📂 File Structure

```
backend/
├── apps/mentoring/
│   ├── models.py                  # VideoCallRoom, VideoCallParticipant models
│   ├── consumers.py               # WebSocket consumer for signaling
│   ├── video_call_views.py        # REST API endpoints
│   └── urls.py                    # Updated with video call routes
├── backend_core/
│   ├── asgi.py                    # ASGI configuration with Channels
│   ├── routing.py                 # WebSocket URL routing
│   └── settings.py                # Channels & ASGI configuration
└── requirements.txt               # channels, channels-redis, daphne

frontend/
├── src/
│   ├── components/VideoCall/
│   │   ├── VideoCall.jsx          # Main video call UI component
│   │   └── index.js
│   ├── pages/
│   │   └── VideoCall/
│   │       └── VideoCallPage.jsx  # Page wrapper with routing
│   ├── hooks/
│   │   └── useWebRTC.js           # WebRTC connection logic
│   ├── utils/
│   │   └── videoCallAPI.js        # Video call API utilities
│   └── App.jsx                    # Added video call route
```

## 🚀 Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create Database Migrations**
   ```bash
   python manage.py makemigrations mentoring
   python manage.py migrate
   ```

3. **Run Server**
   ```bash
   # Development (supports ASGI)
   python manage.py runserver

   # Production (use Daphne)
   daphne -b 0.0.0.0 -p 8000 backend_core.asgi:application
   ```

### Frontend Setup

1. **Install Dependencies** (if not already installed)
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🎮 How to Use

### For Mentors (University Students):

1. Navigate to **Mentoring** section
2. Accept a mentoring request to create a session
3. In **Upcoming Sessions**, find your scheduled session
4. Click **"Join Video Meeting"** button
5. Allow camera/microphone permissions when prompted
6. Wait for student to join
7. Start mentoring session!

### For Students:

1. Request mentoring from a mentor
2. Wait for mentor to accept
3. When session time arrives, find your session
4. Click **"Join Video Meeting"** button
5. Allow camera/microphone permissions when prompted
6. Connect with your mentor!

### During Call:

- 🎤 **Mute/Unmute**: Click microphone icon
- 📹 **Camera On/Off**: Click video icon
- 📺 **Share Screen**: Click monitor icon
- 🖥️ **Fullscreen**: Click maximize icon
- 📞 **End Call**: Click red phone icon

## 🔧 API Reference

### REST Endpoints

#### Create Video Room
```http
POST /api/mentoring/video-call/create/
Content-Type: application/json

{
  "session_id": 1,
  "mentor_id": 1,
  "student_id": 1
}

Response:
{
  "success": true,
  "room_id": "room_abc123",
  "websocket_url": "ws://localhost:8000/ws/video-call/room_abc123/"
}
```

#### Get Room Info
```http
GET /api/mentoring/video-call/{room_id}/

Response:
{
  "room_id": "room_abc123",
  "session_id": 1,
  "mentor_id": 1,
  "student_id": 1,
  "status": "active",
  "participants": [...]
}
```

#### Join Room
```http
POST /api/mentoring/video-call/{room_id}/join/
Content-Type: application/json

{
  "user_id": 1,
  "role": "mentor" | "student"
}
```

#### End Room
```http
POST /api/mentoring/video-call/{room_id}/end/
```

#### Get Room by Session
```http
GET /api/mentoring/video-call/session/{session_id}/

Response:
{
  "room_id": "room_abc123",
  "status": "waiting",
  "exists": true
}
```

### WebSocket Messages

#### Client → Server

**Join Room:**
```json
{
  "type": "join",
  "user_id": 1,
  "role": "mentor"
}
```

**WebRTC Offer:**
```json
{
  "type": "offer",
  "offer": { /* RTCSessionDescription */ },
  "sender_id": 1,
  "sender_role": "mentor"
}
```

**WebRTC Answer:**
```json
{
  "type": "answer",
  "answer": { /* RTCSessionDescription */ },
  "sender_id": 2,
  "sender_role": "student"
}
```

**ICE Candidate:**
```json
{
  "type": "ice-candidate",
  "candidate": { /* RTCIceCandidate */ },
  "sender_id": 1,
  "sender_role": "mentor"
}
```

**Leave Room:**
```json
{
  "type": "leave",
  "user_id": 1,
  "role": "mentor"
}
```

#### Server → Client

**User Joined:**
```json
{
  "type": "user_joined",
  "user_id": 2,
  "role": "student",
  "participant_count": 2
}
```

**Offer Received:**
```json
{
  "type": "offer",
  "offer": { /* RTCSessionDescription */ },
  "sender_id": 1,
  "sender_role": "mentor"
}
```

**Answer Received:**
```json
{
  "type": "answer",
  "answer": { /* RTCSessionDescription */ },
  "sender_id": 2,
  "sender_role": "student"
}
```

**ICE Candidate Received:**
```json
{
  "type": "ice-candidate",
  "candidate": { /* RTCIceCandidate */ },
  "sender_id": 1,
  "sender_role": "mentor"
}
```

## 🧪 Testing

### Test Locally:

1. **Start Backend**: `python manage.py runserver`
2. **Start Frontend**: `npm run dev`
3. **Open Two Browsers**: Chrome and Firefox (or incognito)
4. **Login as Mentor** in Browser 1
5. **Login as Student** in Browser 2
6. **Create Session** and both join
7. **Test Video Call** - you should see yourself in both!

### Test Features:
- ✅ Audio mute/unmute
- ✅ Video on/off
- ✅ Screen sharing
- ✅ Fullscreen mode
- ✅ Connection recovery
- ✅ End call

## 🐛 Troubleshooting

### Camera/Microphone Access Denied
**Problem**: Browser blocks camera/mic access
**Solution**: 
- Check browser permissions (camera icon in address bar)
- Use HTTPS in production (required for getUserMedia)
- Grant permissions when prompted

### WebSocket Connection Failed
**Problem**: Cannot connect to signaling server
**Solution**:
- Verify Django server is running
- Check CORS settings in `settings.py`
- Ensure WebSocket URL is correct

### Cannot See Remote Video
**Problem**: Local video works but no remote video
**Solution**:
- Check if both users joined the room
- Verify peer connection state in browser console
- Check STUN servers are reachable
- Try refreshing both browsers

### Connection State Stuck at "Connecting"
**Problem**: Stays in connecting state
**Solution**:
- Check network firewalls
- Verify ICE candidates are exchanging
- May need TURN server for restrictive NATs

## 🚀 Production Deployment

### 1. Use Redis for Channel Layers

```python
# settings.py
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],
        },
    },
}
```

### 2. Set Up TURN Server (Optional)

For users behind restrictive NATs:
```bash
# Install coturn
sudo apt-get install coturn

# Configure /etc/turnserver.conf
listening-port=3478
realm=yourdomain.com
server-name=yourdomain.com
```

Update `useWebRTC.js`:
```javascript
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:yourdomain.com:3478',
      username: 'turnuser',
      credential: 'turnpassword'
    }
  ]
};
```

### 3. Use Secure WebSocket (WSS)

Update all WebSocket URLs from `ws://` to `wss://`

### 4. Update Environment Variables

```bash
# Backend .env
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Frontend .env
VITE_API_BASE_URL=https://yourdomain.com
VITE_WS_BASE_URL=wss://yourdomain.com
```

## 📊 Database Schema

### VideoCallRoom
```
room_id (PK)          VARCHAR(100)
session_id (FK)       INT (nullable)
mentor_id (FK)        INT
student_id (FK)       INT
status                VARCHAR(10)  [waiting|active|ended]
started_at            DATETIME (nullable)
ended_at              DATETIME (nullable)
created_at            DATETIME
```

### VideoCallParticipant
```
participant_id (PK)   INT
room_id (FK)          VARCHAR(100)
user_id               INT
role                  VARCHAR(10)  [mentor|student]
joined_at             DATETIME
left_at               DATETIME (nullable)
is_online             BOOLEAN
```

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Best performance |
| Firefox 88+ | ✅ Full | Excellent |
| Safari 14+ | ✅ Full | iOS 11+ required |
| Edge 90+ | ✅ Full | Chromium-based |
| Opera 76+ | ✅ Full | - |

## 🔒 Security Considerations

- ✅ Video/audio streams are peer-to-peer (encrypted)
- ✅ Signaling server only exchanges connection info
- ✅ No media data passes through server
- ✅ Room access validated (must be session participant)
- ⚠️ Use HTTPS in production for getUserMedia
- ⚠️ Use WSS (secure WebSocket) in production

## 📝 Notes

- This is a **1-to-1 video call system** (one mentor with one student)
- **No recording feature** (can be added if needed)
- **No chat during call** (but chat system exists separately)
- For group calls, architecture would need modification
- WebRTC works best on modern browsers
- Mobile browsers supported with limitations

## 🆘 Support

For issues or questions:
1. Check browser console for errors
2. Check Django server logs
3. Verify WebSocket connection in Network tab
4. Test with different browsers
5. Check firewall/NAT settings

## 📚 Resources

- [WebRTC Documentation](https://webrtc.org/)
- [Django Channels Documentation](https://channels.readthedocs.io/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [STUN/TURN Servers](https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b)

---

**Built with ❤️ for UniRoute by the development team**
