/**
 * Tutoring Video Call API utilities
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = `${API_URL}/api/tutoring`;

export const tutoringVideoCallAPI = {
    /**
     * Create a new video call room for tutoring
     */
    createRoom: async (bookingId, tutorId, studentId) => {
        const response = await fetch(`${API_BASE_URL}/video-call/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                booking_id: bookingId,
                tutor_id: tutorId,
                student_id: studentId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create tutoring video room');
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
     * Join a tutoring video call room
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
                    role: role, // 'tutor' or 'student'
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
     * Get or create room for a tutoring booking
     */
    getRoomByBooking: async (bookingId) => {
        const response = await fetch(
            `${API_BASE_URL}/video-call/booking/${bookingId}/`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get room for booking');
        }

        return response.json();
    },
};

/**
 * Helper function to join tutoring video call
 * Opens video call in new window
 */
export const joinTutoringVideoCall = async (bookingId, userId, role) => {
    try {
        // Get or create room for the booking
        const roomData = await tutoringVideoCallAPI.getRoomByBooking(bookingId);

        // Join the room
        await tutoringVideoCallAPI.joinRoom(roomData.room_id, userId, role);

        // Open video call in new window with booking_id parameter for tutoring
        const videoCallUrl = `/video-call?booking_id=${bookingId}&user_id=${userId}&role=${role}&type=tutoring`;
        window.open(videoCallUrl, '_blank', 'width=1200,height=800');

        return roomData;
    } catch (error) {
        console.error('Error joining tutoring video call:', error);
        throw error;
    }
};
