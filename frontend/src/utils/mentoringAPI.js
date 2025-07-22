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
};
