// API utility functions for mentoring
const API_BASE_URL = 'http://localhost:8000/api';

export const mentoringAPI = {
    // Get mentoring requests for a specific mentor
    getRequests: async (mentorId) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/requests/${mentorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch requests');
        }
        return data;
    },

    // Get mentoring sessions for a specific mentor
    getSessions: async (mentorId) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/sessions/${mentorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch sessions');
        }
        return data;
    },

    // Get all sessions (including existing data) for a specific mentor
    getAllSessions: async (mentorId) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/all-sessions/${mentorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch all sessions');
        }
        return data;
    },

    // Accept a mentoring request
    acceptRequest: async (requestId, scheduleData) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/requests/${requestId}/accept/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to accept request');
        }
        return data;
    },

    // Decline a mentoring request
    declineRequest: async (requestId, reason) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/requests/${requestId}/decline/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to decline request');
        }
        return data;
    },

    // Cancel a session
    cancelSession: async (sessionId, reason) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/sessions/${sessionId}/cancel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to cancel session');
        }
        return data;
    },

    // Reschedule a session
    rescheduleSession: async (sessionId, rescheduleData) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/sessions/${sessionId}/reschedule/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rescheduleData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to reschedule session');
        }
        return data;
    },

    // Complete a session
    completeSession: async (sessionId, completionNotes = '') => {
        const response = await fetch(`${API_BASE_URL}/mentoring/sessions/${sessionId}/complete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completion_notes: completionNotes }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to complete session');
        }
        return data;
    },    // Get mentor statistics
    getStats: async (mentorId) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/stats/${mentorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch stats');
        }
        return data;
    },

    // Get mentor availability
    getAvailability: async (mentorId) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/availability/${mentorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch availability');
        }
        return data;
    },

    // Add mentor availability slot
    addAvailability: async (mentorId, availabilityData) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/availability/${mentorId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(availabilityData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add availability');
        }
        return data;
    },

    // Update mentor availability slot
    updateAvailability: async (mentorId, availabilityData) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/availability/${mentorId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(availabilityData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update availability');
        }
        return data;
    },

    // Delete mentor availability slot
    deleteAvailability: async (mentorId, availabilityId) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/availability/${mentorId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availability_id: availabilityId }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete availability');
        }
        return data;
    },

    // Get available time slots for a mentor
    getAvailableSlots: async (mentorId, startDate = null, endDate = null) => {
        let url = `${API_BASE_URL}/mentoring/available-slots/${mentorId}/`;
        const params = new URLSearchParams();
        
        if (startDate) {
            params.append('start_date', startDate);
        }
        if (endDate) {
            params.append('end_date', endDate);
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch available slots');
        }
        return data;
    },

    // Book a session in an available slot
    bookSlot: async (mentorId, bookingData) => {
        const response = await fetch(`${API_BASE_URL}/mentoring/sessions/${mentorId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to book session');
        }
        return data;
    },
};
