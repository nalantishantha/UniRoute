# 🚀 UniRoute Video Call Deployment Guide

## Overview

To make your video calling feature accessible from any laptop through the internet (not just local network), you need to deploy your application to a production server with a public domain.

---

## 🎯 Quick Testing Solution: Using ngrok

### What is ngrok?

ngrok creates a secure tunnel from a public URL to your localhost, allowing you to test your local application from any device on the internet.

### Setup Steps:

1. **Install ngrok**:

   - Download from: https://ngrok.com/download
   - Sign up for free account
   - Install the auth token: `ngrok config add-authtoken YOUR_TOKEN`

2. **Start Your Local Servers**:

   ```bash
   # Terminal 1 - Django Backend
   cd /Applications/XAMPP/xamppfiles/htdocs/UniRoute/backend
   source ../.venv/bin/activate
   python manage.py runserver

   # Terminal 2 - React Frontend
   cd /Applications/XAMPP/xamppfiles/htdocs/UniRoute/frontend
   npm run dev
   ```

3. **Create ngrok Tunnels**:

   ```bash
   # Terminal 3 - Expose Backend
   ngrok http 8000
   # You'll get: https://abc123.ngrok-free.app

   # Terminal 4 - Expose Frontend
   ngrok http 5173
   # You'll get: https://xyz456.ngrok-free.app
   ```

4. **Update Frontend Environment**:
   Create `/frontend/.env`:

   ```env
   VITE_API_URL=https://abc123.ngrok-free.app
   VITE_WS_URL=wss://abc123.ngrok-free.app
   ```

5. **Update Django Settings**:

   ```python
   ALLOWED_HOSTS = ['abc123.ngrok-free.app', 'xyz456.ngrok-free.app']
   CORS_ALLOWED_ORIGINS = ['https://xyz456.ngrok-free.app']
   ```

6. **Access from Any Laptop**:
   - Laptop 1 (Mentor): `https://xyz456.ngrok-free.app/video-call?session_id=116&user_id=19&role=mentor`
   - Laptop 2 (Student): `https://xyz456.ngrok-free.app/video-call?session_id=116&user_id=20&role=student`

**Note**: Free ngrok URLs change every time you restart. Paid plans offer persistent URLs.

---

## 🏭 Production Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Railway** provides free hosting with automatic deployments from GitHub.

#### Steps:

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Add video calling feature"
   git push origin main
   ```

2. **Deploy Backend on Railway**:

   - Go to: https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables:
     ```
     SECRET_KEY=your-secret-key
     DEBUG=False
     ALLOWED_HOSTS=your-app.railway.app
     DATABASE_URL=postgresql://... (Railway provides this)
     ```
   - Railway auto-detects Django and deploys

3. **Deploy Frontend on Vercel**:

   - Go to: https://vercel.com
   - Sign up with GitHub
   - Click "New Project" → Select your repository
   - Configure:
     - Root Directory: `frontend`
     - Framework: Vite
     - Environment Variables:
       ```
       VITE_API_URL=https://your-backend.railway.app
       VITE_WS_URL=wss://your-backend.railway.app
       ```

4. **Update Django CORS**:
   ```python
   CORS_ALLOWED_ORIGINS = [
       'https://your-frontend.vercel.app',
   ]
   ```

**Result**:

- Backend: `https://uniroute-backend.railway.app`
- Frontend: `https://uniroute.vercel.app`
- Accessible from ANYWHERE in the world!

---

### Option 2: Heroku (Popular Choice)

1. **Install Heroku CLI**:

   ```bash
   brew install heroku/brew/heroku
   heroku login
   ```

2. **Create Heroku Apps**:

   ```bash
   # Backend
   heroku create uniroute-backend

   # Add PostgreSQL
   heroku addons:create heroku-postgresql:mini
   ```

3. **Create Procfile** in backend:

   ```
   web: daphne backend_core.asgi:application --port $PORT --bind 0.0.0.0
   release: python manage.py migrate
   ```

4. **Deploy**:

   ```bash
   git push heroku main
   ```

5. **Frontend**: Deploy to Netlify or Vercel (same as Railway option)

---

### Option 3: AWS (Enterprise Solution)

- **EC2**: Virtual server for Django
- **S3 + CloudFront**: Static hosting for React
- **RDS**: Managed database
- **Route 53**: Domain management

**Cost**: ~$20-50/month for basic setup

---

### Option 4: DigitalOcean (Developer-Friendly)

- **App Platform**: Auto-deployment from GitHub
- **Managed Database**: PostgreSQL/MySQL
- **Spaces**: CDN for static files

**Cost**: $5-12/month for basic setup

---

## 🔧 Required Configuration Changes

### 1. Frontend Environment Variables

Create `/frontend/.env.production`:

```env
VITE_API_URL=https://api.uniroute.com
VITE_WS_URL=wss://api.uniroute.com
```

### 2. Update API Calls

In `/frontend/src/hooks/useWebRTC.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const WS_PROTOCOL = import.meta.env.VITE_API_URL?.startsWith("https")
  ? "wss"
  : "ws";
const WS_HOST =
  import.meta.env.VITE_API_URL?.replace("https://", "").replace(
    "http://",
    ""
  ) || "localhost:8000";

const websocketUrl = `${WS_PROTOCOL}://${WS_HOST}/ws/video-call/${roomId}/`;
```

### 3. Django Production Settings

Create `/backend/backend_core/settings_prod.py`:

```python
from .settings import *

DEBUG = False

ALLOWED_HOSTS = [
    'api.uniroute.com',
    'uniroute-backend.railway.app',
]

CORS_ALLOWED_ORIGINS = [
    'https://uniroute.com',
    'https://www.uniroute.com',
    'https://uniroute.vercel.app',
]

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Database (use environment variable)
import dj_database_url
DATABASES['default'] = dj_database_url.config(
    conn_max_age=600,
    ssl_require=True
)

# Channel Layer (use Redis in production)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [os.environ.get('REDIS_URL', 'redis://localhost:6379')],
        },
    },
}
```

### 4. WebRTC Configuration

For production, update STUN/TURN servers in `/frontend/src/hooks/useWebRTC.js`:

```javascript
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // Add TURN server for better connectivity
    {
      urls: "turn:turnserver.example.com:3478",
      username: "username",
      credential: "password",
    },
  ],
};
```

**Note**: TURN servers are needed when users are behind strict firewalls/NAT. Free options:

- https://www.metered.ca/tools/openrelay/ (Free TURN server)
- https://xirsys.com/ (Free tier available)

---

## 📋 Deployment Checklist

### Pre-Deployment:

- [ ] All features tested locally
- [ ] Database migrations created
- [ ] Static files collected (`python manage.py collectstatic`)
- [ ] Environment variables documented
- [ ] Security settings configured
- [ ] HTTPS enforced

### Backend Deployment:

- [ ] Django SECRET_KEY set (never commit to Git!)
- [ ] DEBUG = False in production
- [ ] ALLOWED_HOSTS configured
- [ ] CORS origins configured
- [ ] Database configured (PostgreSQL recommended)
- [ ] Redis for Django Channels
- [ ] Static files served via CDN/S3

### Frontend Deployment:

- [ ] Environment variables set
- [ ] API URLs point to production backend
- [ ] WebSocket URLs use WSS (not WS)
- [ ] Build optimized (`npm run build`)
- [ ] HTTPS enabled

### Post-Deployment:

- [ ] Test video call from different networks
- [ ] Monitor Django logs for errors
- [ ] Check WebSocket connections
- [ ] Verify camera/microphone permissions work
- [ ] Test on mobile devices

---

## 🧪 Testing Your Deployment

### Test from Different Laptops:

1. **Laptop 1** (anywhere in the world):

   ```
   https://uniroute.com/video-call?session_id=116&user_id=19&role=mentor
   ```

2. **Laptop 2** (anywhere in the world):
   ```
   https://uniroute.com/video-call?session_id=116&user_id=20&role=student
   ```

Both should be able to join and see each other via video!

---

## 💡 Recommendation for You

### For Immediate Testing (Today):

**Use ngrok** - Takes 5 minutes to set up, works immediately

### For Long-Term (Production):

**Use Railway (backend) + Vercel (frontend)** - Both have generous free tiers and auto-deploy from GitHub

---

## 🆘 Common Issues

### Issue: WebRTC doesn't work in production

**Solution**: Must use HTTPS. Browsers block camera/mic access on HTTP.

### Issue: WebSocket connection fails

**Solution**:

- Use `wss://` (not `ws://`) for HTTPS sites
- Check CORS and ALLOWED_HOSTS settings
- Verify WebSocket support on hosting platform

### Issue: Video doesn't connect

**Solution**:

- Add TURN server for NAT traversal
- Check firewall rules
- Verify both users are on the same session_id

---

## 📞 Next Steps

1. **Choose deployment option** (I recommend Railway + Vercel for ease)
2. **Set up accounts** on chosen platforms
3. **Configure environment variables**
4. **Deploy backend first**, then frontend
5. **Test with two different devices** on different networks
6. **Monitor and debug** using platform logs

Would you like me to help you set up ngrok for immediate testing, or would you prefer to go straight to Railway/Vercel deployment?
