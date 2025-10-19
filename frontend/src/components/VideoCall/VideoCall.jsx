/**
 * VideoCall Component
 * Full-featured video calling interface with controls
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MonitorOff,
  Maximize,
  Minimize,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useWebRTC from "../../hooks/useWebRTC";
import Button from "../ui/Button";

const VideoCall = ({ roomId, userId, userRole, onEndCall }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const hasConnectedRef = useRef(false);

  // Get WebSocket URL from environment or use default
  const websocketUrl = `ws://localhost:8000/ws/video-call/${roomId}/`;

  const {
    localStream,
    remoteStream,
    isConnected,
    isConnecting,
    error,
    connectionState,
    remoteUser,
    connect,
    disconnect,
  } = useWebRTC(roomId, userId, userRole, websocketUrl);

  // Connect on mount (only once)
  useEffect(() => {
    if (!hasConnectedRef.current) {
      hasConnectedRef.current = true;
      connect();
    }

    return () => {
      // Only disconnect when the component truly unmounts (user closes the window)
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount/unmount

  // Update local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Update remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Auto-hide controls
  useEffect(() => {
    const resetTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      setShowControls(true);

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => resetTimeout();

    if (isConnected) {
      window.addEventListener("mousemove", handleMouseMove);
      resetTimeout();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isConnected]);

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: false,
        });

        screenStreamRef.current = screenStream;

        // Replace video track
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = localStream
          .getSenders?.()
          .find((s) => s.track?.kind === "video");

        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        // Handle screen share stop
        videoTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } else {
        stopScreenShare();
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    // Restore camera video
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const sender = localStream
        .getSenders?.()
        .find((s) => s.track?.kind === "video");

      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
    }

    setIsScreenSharing(false);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle end call
  const handleEndCall = () => {
    disconnect();

    if (onEndCall) {
      onEndCall();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gray-900 overflow-hidden"
    >
      {/* Remote Video (Main) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <User size={64} />
            </div>
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-4"></div>
                <p className="text-xl">Connecting to room...</p>
              </>
            ) : (
              <>
                <p className="text-xl mb-2">
                  {userRole === "student"
                    ? "Waiting for mentor to join..."
                    : "Waiting for student to join..."}
                </p>
                <p className="text-sm text-gray-400 max-w-md text-center">
                  {userRole === "student"
                    ? "Your mentor will join shortly. Please wait while they connect to the session."
                    : "The student will join shortly. Your video will start once they connect."}
                </p>
              </>
            )}
            {connectionState && (
              <p className="text-sm text-gray-400 mt-2">
                Connection: {connectionState}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <motion.div
        className="absolute top-4 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700 bg-gray-800"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isVideoEnabled && localStream ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
            style={{ transform: "scaleX(-1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <div className="text-white text-center">
              <VideoOff size={48} className="mx-auto mb-2" />
              <p className="text-sm">Camera Off</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
          You ({userRole})
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Remote User Info */}
      {remoteUser && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg text-white">
          <p className="text-sm">
            Connected: {remoteUser.role} (ID: {remoteUser.id})
          </p>
        </div>
      )}

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6"
          >
            <div className="flex items-center justify-center gap-4">
              {/* Audio Toggle */}
              <Button
                onClick={toggleAudio}
                className={`w-14 h-14 rounded-full ${
                  isAudioEnabled
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                title={isAudioEnabled ? "Mute" : "Unmute"}
              >
                {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
              </Button>

              {/* Video Toggle */}
              <Button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full ${
                  isVideoEnabled
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
              </Button>

              {/* End Call */}
              <Button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
                title="End call"
              >
                <PhoneOff size={28} />
              </Button>

              {/* Screen Share */}
              <Button
                onClick={toggleScreenShare}
                className={`w-14 h-14 rounded-full ${
                  isScreenSharing
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                title={isScreenSharing ? "Stop sharing" : "Share screen"}
              >
                {isScreenSharing ? (
                  <MonitorOff size={24} />
                ) : (
                  <Monitor size={24} />
                )}
              </Button>

              {/* Fullscreen */}
              <Button
                onClick={toggleFullscreen}
                className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status Indicator */}
      <div className="absolute top-20 left-4">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isConnected
              ? "bg-green-500 text-white"
              : isConnecting
              ? "bg-yellow-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-white" : "bg-gray-300"
            } ${isConnecting ? "animate-pulse" : ""}`}
          />
          {isConnected
            ? "Connected"
            : isConnecting
            ? "Connecting..."
            : "Disconnected"}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
