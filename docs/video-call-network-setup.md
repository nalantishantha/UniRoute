# 🎥 Video Call Network Setup Guide

## Understanding the Architecture

### Current Problem
When you use `localhost:5173` or `localhost:8000`, these URLs only work on the **same computer** that's running the servers. Other laptops on your network cannot access "localhost" because it refers to their own local machine, not your server.

### The Solution
Use your **main laptop's local network IP address** instead of "localhost" so other devices can connect.

---

## 📡 How It Works

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL NETWORK (WiFi/Router)             │
│                                                                 │
│  ┌─────────────────┐         ┌──────────────────────────┐     │
│  │   Laptop 1      │         │   YOUR MAIN LAPTOP       │     │
│  │   (Mentor)      │         │   IP: 192.168.1.100      │     │
│  │                 │         │                          │     │
│  │  Browser        │◄────────┤  Django Backend          │     │
│  │  192.168.1.100: │  HTTP   │  Port 8000               │     │
│  │  5173           │         │                          │     │
│  │                 │◄────────┤  React Frontend          │     │
│  │                 │ WebRTC  │  Port 5173               │     │
│  └─────────────────┘ Signals │                          │     │
│         ▲                     │  Database (MySQL)        │     │
│         │                     └──────────┬───────────────┘     │
│         │                                │                     │
│         │  WebRTC Peer-to-Peer Video/Audio (Direct!)          │
│         │                                │                     │
│         └────────────────────────────────┼─────────────────┐   │
│                                          │                 │   │
│                                          ▼                 │   │
│                              ┌─────────────────┐          │   │
│                              │   Laptop 2      │          │   │
│                              │   (Student)     │          │   │
│                              │                 │          │   │
│                              │  Browser        │──────────┘   │
│                              │  192.168.1.100: │              │
│                              │  5173           │              │
│                              └─────────────────┘              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Key Components:

1. **Django Backend (Port 8000)**: 
   - REST API for room management
   - WebSocket server for signaling (offer/answer/ICE candidates)
   - Database for storing room and participant info

2. **React Frontend (Port 5173)**:
   - User interface for video calls
   - WebRTC peer connection management
   - Camera/microphone access

3. **WebRTC (Browser-to-Browser)**:
   - **Video and audio streams flow DIRECTLY between browsers**
   - Does NOT go through the server
   - Server only used for "signaling" (coordinating the connection)

---

## 🚀 Step-by-Step Setup

### Step 1: Find Your Main Laptop's IP Address

On your **main laptop** (the one running Django and React servers):

```bash
# macOS:
ifconfig | grep "inet " | grep -v 127.0.0.1
# Look for something like: inet 192.168.1.100

# Or simpler:
ipconfig getifaddr en0
```

**Example output**: `192.168.1.100` (your IP will be different)

### Step 2: Update Django Settings

Edit `/backend/backend_core/settings.py`:

```python
# Allow connections from any device on your local network
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '192.168.1.100',  # Your actual IP address
    '*',  # For development only - allows all hosts
]

# Allow CORS from your IP address
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.100:5173",  # Your actual IP address
]
```

### Step 3: Start Django Server on All Network Interfaces

Instead of just `python manage.py runserver`, use:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UniRoute/backend
source /Applications/XAMPP/xamppfiles/htdocs/UniRoute/.venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

**`0.0.0.0:8000`** means "listen on ALL network interfaces" (not just localhost).

### Step 4: Start Vite Dev Server on All Network Interfaces

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UniRoute/frontend
npm run dev -- --host 0.0.0.0
```

Or update `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Listen on all interfaces
    port: 5173,
  },
  // ... rest of config
})
```

### Step 5: Update Frontend API URLs

Edit `/frontend/src/utils/videoCallAPI.js` or wherever you define the WebSocket URL:

```javascript
// BEFORE:
const websocketUrl = `ws://localhost:8000/ws/video-call/${roomId}/`;

// AFTER (use your actual IP):
const websocketUrl = `ws://192.168.1.100:8000/ws/video-call/${roomId}/`;
```

Or better, use environment variables:

```javascript
const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const websocketUrl = `ws://${API_HOST}:8000/ws/video-call/${roomId}/`;
```

### Step 6: Connect from Other Laptops

Now on **Laptop 1** (Mentor) and **Laptop 2** (Student), use your main laptop's IP:

**Mentor (Laptop 1)**:
```
http://192.168.1.100:5173/video-call?session_id=116&user_id=19&role=mentor
```

**Student (Laptop 2)**:
```
http://192.168.1.100:5173/video-call?session_id=116&user_id=20&role=student
```

---

## 🔐 Important Notes

### Security

⚠️ **Development Only**: Using `ALLOWED_HOSTS = ['*']` is **ONLY** safe for development on your local network. **NEVER** do this in production!

### Firewall

Make sure your firewall allows incoming connections on ports 8000 and 5173:

```bash
# macOS: Check System Settings > Network > Firewall
# Or temporarily disable for testing (not recommended for production)
```

### Same WiFi Network

All laptops must be connected to the **same WiFi network** (or connected via Ethernet to the same router).

---

## 🎬 How WebRTC Works

### 1. Signaling Phase (Using WebSocket)

```
Mentor                    Server                    Student
  │                         │                         │
  │────Join message────────>│                         │
  │                         │<────Join message────────│
  │                         │                         │
  │<──user_joined (count:2)─│───user_joined────────>│
  │                         │                         │
  │──Offer (SDP)──────────>│───Offer (SDP)────────>│
  │                         │                         │
  │<─Answer (SDP)──────────│<──Answer (SDP)─────────│
  │                         │                         │
  │──ICE candidates───────>│───ICE candidates──────>│
  │<─ICE candidates────────│<──ICE candidates───────│
```

### 2. Peer-to-Peer Connection (Direct)

Once signaling is complete, video/audio flows **DIRECTLY** between browsers:

```
Mentor Browser <══════ Video/Audio Stream ══════> Student Browser
     (Laptop 1)          (Peer-to-Peer)            (Laptop 2)
```

The server is **NO LONGER INVOLVED** - it only helped set up the connection.

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to http://192.168.1.100:5173"

**Solutions**:
1. Verify your IP address hasn't changed: `ipconfig getifaddr en0`
2. Check that Vite is running with `--host 0.0.0.0`
3. Check firewall settings
4. Verify all devices are on the same WiFi network

### Problem: "WebSocket connection failed"

**Solutions**:
1. Check Django is running with `0.0.0.0:8000`
2. Verify CORS settings include your IP address
3. Check WebSocket URL uses correct IP address
4. Look for errors in Django terminal

### Problem: "Video doesn't show up"

**Solutions**:
1. Grant camera/microphone permissions in browser
2. Check browser console for WebRTC errors
3. Verify both users are connected (check Django logs)
4. Ensure NAT traversal is working (STUN servers accessible)

---

## 📝 Quick Checklist

- [ ] Find main laptop's IP address
- [ ] Update `ALLOWED_HOSTS` in Django settings
- [ ] Update `CORS_ALLOWED_ORIGINS` in Django settings  
- [ ] Start Django with `python manage.py runserver 0.0.0.0:8000`
- [ ] Start Vite with `npm run dev -- --host 0.0.0.0`
- [ ] Update WebSocket URLs to use IP address
- [ ] Connect from other laptops using IP address URLs
- [ ] Verify both users can join and see each other

---

## 🎓 Summary

**Why localhost doesn't work**:
- `localhost` = "this computer only"
- Each laptop has its own "localhost"
- Can't reach servers on another computer

**Why IP address works**:
- `192.168.1.100` = specific computer on the network
- All devices on same WiFi can reach it
- Acts as a "shared server" for all laptops

**How video call works**:
1. Both browsers connect to YOUR main laptop's servers (via IP)
2. Server coordinates WebRTC connection setup (signaling)
3. Browsers establish DIRECT peer-to-peer connection
4. Video/audio flows directly between laptops (bypassing server)

This is why WebRTC is efficient - the server only helps with coordination, not streaming!
