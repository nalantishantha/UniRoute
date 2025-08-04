import React, { useEffect, useRef, useState } from "react";

const JitsiMeeting = ({ roomName, displayName }) => {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cleanup any existing Jitsi instance before creating a new one
    if (apiRef.current) {
      try {
        apiRef.current.dispose();
        apiRef.current = null;
      } catch (e) {
        console.log('Error disposing previous Jitsi instance:', e);
      }
    }

    // Suppress Jitsi console warnings
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('speaker-selection') || 
          message.includes('Unrecognized feature') ||
          message.includes('videobackgroundblur') ||
          message.includes('fodeviceselection')) {
        return; // Suppress these specific warnings
      }
      originalConsoleWarn.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('speaker-selection') || 
          message.includes('Unrecognized feature')) {
        return; // Suppress these specific errors
      }
      originalConsoleError.apply(console, args);
    };

    const initJitsi = () => {
      if (!window.JitsiMeetExternalAPI) {
        setError("Jitsi Meet API not loaded. Please check your internet connection.");
        setIsLoading(false);
        return;
      }

      if (!containerRef.current) return;

      // Clear the container before creating new instance
      containerRef.current.innerHTML = '';

      try {
        // Use 8x8.vc which has better anonymous support
        const domain = "8x8.vc";
        
        // Generate a completely anonymous room name
        const anonymousRoomName = `UniRoute_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        const options = {
          roomName: anonymousRoomName,
          width: "100%",
          height: 600,
          parentNode: containerRef.current,
          userInfo: { 
            displayName: displayName || 'UniRoute Student'
            // No email to avoid authentication prompts
          },
          configOverwrite: {
            // Core meeting settings - start with audio muted to avoid issues
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            
            // Completely disable authentication and lobby features
            enableUserRolesBasedOnToken: false,
            enableFeaturesBasedOnToken: false,
            requireDisplayName: false,
            prejoinPageEnabled: false,
            enableLobbyChat: false,
            enableLobby: false,
            lobbyEnabled: false,
            enableModerationRequired: false,
            
            // Disable all authentication checks
            enableAuthenticationCheck: false,
            enableGuestDomain: false,
            
            // Disable welcome and authentication pages
            enableWelcomePage: false,
            enableClosePage: false,
            disableDeepLinking: true,
            
            // Meeting quality settings
            resolution: 720,
            constraints: {
              video: {
                height: { ideal: 720, max: 720, min: 240 },
                width: { ideal: 1280, max: 1280, min: 320 }
              }
            },
            
            // Privacy and security settings
            disableProfile: true,
            hideDisplayName: false,
            doNotStoreRoom: true,
            enableDisplayNameInStats: false,
            enableEmailInStats: false,
            disableThirdPartyRequests: true,
            enableInsecureRoomNameWarning: false,
            
            // Meeting behavior
            startSilent: false,
            subject: `UniRoute Meeting`,
            
            // Audio/Video technical settings
            enableNoAudioDetection: false,
            enableNoisyMicDetection: false,
            disableInitialGUM: false,
            disableJoinLeaveSounds: false,
            disableAGC: false,
            disableAP: false,
            disableAEC: false,
            disableNS: false,
            disableHPF: false,
            stereo: false,
            forceJVB121Ratio: -1,
            
            // Additional settings to prevent auth prompts
            disableInviteFunctions: false,
            enableRejectSlur: false,
            disableRemoteMute: false,
            enableLipSync: false
          },
          interfaceConfigOverwrite: {
            // Minimal toolbar to avoid features that might require auth
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'hangup', 'chat', 'desktop',
              'fullscreen', 'settings', 'videoquality', 'filmstrip'
            ],
            
            // Simplified settings
            SETTINGS_SECTIONS: ['devices', 'language'],
            
            // Remove all branding and external links
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: "",
            SHOW_POWERED_BY: false,
            APP_NAME: "UniRoute Meetings",
            NATIVE_APP_NAME: "UniRoute Meetings",
            PROVIDER_NAME: "UniRoute",
            
            // Disable authentication interface elements
            AUTHENTICATION_ENABLE: false,
            ENABLE_PREJOIN_PAGE: false,
            ENABLE_LOBBY_CHAT: false,
            HIDE_DEEP_LINKING_LOGO: true,
            HIDE_INVITE_MORE_HEADER: true,
            
            // Visual and behavior settings
            CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
            CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,
            VIDEO_LAYOUT_FIT: 'both',
            FILM_STRIP_MAX_HEIGHT: 120,
            LOCAL_THUMBNAIL_RATIO: 16 / 9,
            REMOTE_THUMBNAIL_RATIO: 1,
            INITIAL_TOOLBAR_TIMEOUT: 20000,
            TOOLBAR_TIMEOUT: 4000,
            TOOLBAR_ALWAYS_VISIBLE: false,
            DEFAULT_BACKGROUND: '#040404',
            
            // Disable promotional and external features
            CLOSE_PAGE_GUEST_HINT: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            MOBILE_APP_PROMO: false,
            RECENT_LIST_ENABLED: false,
            ENABLE_DIAL_OUT: false,
            
            // Remove external links that might require authentication
            LIVE_STREAMING_HELP_LINK: '',
            MOBILE_DOWNLOAD_LINK_ANDROID: '',
            MOBILE_DOWNLOAD_LINK_IOS: '',
            
            // Advanced settings
            LANG_DETECTION: true,
            MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
            INDICATOR_FONT_SIZES: 13,
            POLICY_LOGO: null,
            
            // Audio visual settings
            AUDIO_LEVEL_PRIMARY_COLOR: "rgba(255,255,255,0.4)",
            AUDIO_LEVEL_SECONDARY_COLOR: "rgba(255,255,255,0.2)",
            
            // Technical settings
            ENABLE_REMB: true,
            ENABLE_SIMULCAST: true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            DISABLE_PRESENCE_STATUS: false,
            DISABLE_TRANSCRIPTION_SUBTITLES: true,
            DISABLE_RINGING: false,
            ENABLE_FEEDBACK_ANIMATION: false,
            DISABLE_FOCUS_INDICATOR: false,
            DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
            
            // Remove mobile app integration to prevent auth prompts
            MOBILE_DYNAMIC_LINK: null
          }
        };

        const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
        apiRef.current = jitsiApi;
        
        jitsiApi.addEventListener('videoConferenceJoined', () => {
          setIsLoading(false);
          setError(null);
          console.log('Successfully joined meeting');
        });

        jitsiApi.addEventListener('videoConferenceLeft', () => {
          console.log('Left the meeting');
        });

        jitsiApi.addEventListener('readyToClose', () => {
          console.log('Meeting ended');
          if (apiRef.current) {
            apiRef.current.dispose();
            apiRef.current = null;
          }
        });

        // Handle connection and participant events
        jitsiApi.addEventListener('participantJoined', () => {
          setIsLoading(false);
        });

        // Set a timeout to handle loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);

      } catch (err) {
        console.error('Jitsi initialization error:', err);
        setError("Failed to initialize video meeting. Please try again.");
        setIsLoading(false);
      }
    };

    // Delay initialization slightly to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      // Check if Jitsi API is already loaded
      if (window.JitsiMeetExternalAPI) {
        initJitsi();
      } else {
        // Wait for script to load
        const checkJitsi = setInterval(() => {
          if (window.JitsiMeetExternalAPI) {
            clearInterval(checkJitsi);
            initJitsi();
          }
        }, 100);

        // Timeout after 30 seconds
        setTimeout(() => {
          if (!window.JitsiMeetExternalAPI) {
            clearInterval(checkJitsi);
            setError("Failed to load Jitsi Meet. Please check your connection.");
            setIsLoading(false);
          }
        }, 30000);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      
      // Restore original console methods
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      
      // Cleanup Jitsi API
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
          apiRef.current = null;
        } catch (e) {
          console.log('Error disposing Jitsi instance:', e);
        }
      }
      
      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [roomName, displayName]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold">Connection Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="space-y-2 text-sm text-red-600">
          <p>Troubleshooting steps:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check your internet connection</li>
            <li>Allow camera and microphone permissions</li>
            <li>Try refreshing the page</li>
            <li>Contact system administrator if the problem persists</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-blue-700 font-medium">Connecting to meeting...</p>
            <p className="text-blue-600 text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="rounded-lg overflow-hidden border border-gray-200"
        style={{ minHeight: '600px' }}
        id={`jitsi-container-${roomName}`}
      />
    </div>
  );
};

export default JitsiMeeting;
