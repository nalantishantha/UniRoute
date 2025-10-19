/**
 * Video Call API utilities
 */

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/mentoring`;

export const videoCallAPI = {
    /**
     * Create a new video call room
     */
    createRoom: async (sessionId, mentorId, studentId) => {
        const response = await fetch(`${API_BASE_URL}/video-call/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                mentor_id: mentorId,
                student_id: studentId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create video room');
        }

        return response.json();
    },

    /**
     * Get video room details
     */
    getRoom: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/video-call/${roomId}/`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get video room');
        }

        return response.json();
    },

    /**
     * Join a video call room
     */
    joinRoom: async (roomId, userId, role) => {
        const response = await fetch(
            `${API_BASE_URL}/video-call/${roomId}/join/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    role: role,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to join video room');
        }

        return response.json();
    },

    /**
     * End a video call room
     */
    endRoom: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/video-call/${roomId}/end/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to end video room');
        }

        return response.json();
    },

    /**
     * Get or create room for a session
     */
    getRoomBySession: async (sessionId) => {
        const response = await fetch(
            `${API_BASE_URL}/video-call/session/${sessionId}/`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get room for session');
        }

        return response.json();
    },
};

/**
 * Helper function to join a mentoring video call
 * Opens video call in new window/tab with appropriate parameters
 */
export const joinMentoringVideoCall = async (sessionId, userId, userRole) => {
    try {
        // Get or create room for the session
        const roomData = await videoCallAPI.getRoomBySession(sessionId);

        // Build video call URL with parameters
        const videoCallUrl = `/video-call?session_id=${sessionId}&user_id=${userId}&role=${userRole}`;

        // Open in new window
        window.open(videoCallUrl, '_blank', 'width=1280,height=720');

        return roomData;
    } catch (error) {
        console.error('Error joining video call:', error);
        throw error;
    }
};

export default videoCallAPI;
