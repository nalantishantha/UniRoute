/**
 * VideoCallPage
 * Page wrapper for video calls with routing and API integration
 */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VideoCall from "../../components/VideoCall/VideoCall";

const VideoCallPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [roomId, setRoomId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get parameters from URL
    const roomIdParam = searchParams.get("room_id");
    const sessionIdParam = searchParams.get("session_id");
    const bookingIdParam = searchParams.get("booking_id");
    const userIdParam = searchParams.get("user_id");
    const userRoleParam = searchParams.get("role");
    const callTypeParam = searchParams.get("type"); // 'mentoring' or 'tutoring'

    if (!userIdParam || !userRoleParam) {
      setError("Missing required parameters: user_id and role");
      setLoading(false);
      return;
    }

    setUserId(parseInt(userIdParam));
    setUserRole(userRoleParam);

    if (roomIdParam) {
      // Direct room access
      setRoomId(roomIdParam);
      setLoading(false);
    } else if (sessionIdParam) {
      // Get/create room for mentoring session
      fetchRoomForSession(
        sessionIdParam,
        parseInt(userIdParam),
        userRoleParam,
        "mentoring"
      );
    } else if (bookingIdParam) {
      // Get/create room for tutoring booking
      fetchRoomForSession(
        bookingIdParam,
        parseInt(userIdParam),
        userRoleParam,
        "tutoring"
      );
    } else {
      setError("Missing room_id, session_id, or booking_id parameter");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchRoomForSession = async (id, userId, role, type = "mentoring") => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      // Determine the API endpoint based on type
      const endpoint =
        type === "tutoring"
          ? `${API_URL}/api/tutoring/video-call/booking/${id}/`
          : `${API_URL}/api/mentoring/video-call/session/${id}/`;

      // First, get or create room for session/booking
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to get video room");
      }

      const data = await response.json();

      // Join the room using the appropriate endpoint
      const joinEndpoint =
        type === "tutoring"
          ? `${API_URL}/api/tutoring/video-call/${data.room_id}/join/`
          : `${API_URL}/api/mentoring/video-call/${data.room_id}/join/`;

      const joinResponse = await fetch(joinEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          role: role,
        }),
      });

      if (!joinResponse.ok) {
        throw new Error("Failed to join video room");
      }

      setRoomId(data.room_id);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching room:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    // End the room
    if (roomId) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

        // Try both endpoints (we don't know which type this is)
        // The backend will handle it the same way for both
        await fetch(`${API_URL}/api/mentoring/video-call/${roomId}/end/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Error ending call:", err);
      }
    }

    // Navigate back
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Setting up video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-white text-red-500 rounded hover:bg-gray-100"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roomId || !userId || !userRole) {
    return null;
  }

  return (
    <VideoCall
      roomId={roomId}
      userId={userId}
      userRole={userRole}
      onEndCall={handleEndCall}
    />
  );
};

export default VideoCallPage;
