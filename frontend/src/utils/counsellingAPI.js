// API utility functions for counselling sessions
const API_BASE_URL = 'http://localhost:8000/api';

export const counsellingAPI = {
    // Get counselling requests for a specific counsellor
    getRequests: async (counsellorId) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/requests/${counsellorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch requests');
        }
        return data;
    },

    // Get counselling sessions for a specific counsellor
    getSessions: async (counsellorId) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${counsellorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch sessions');
        }
        return data;
    },

    // Accept a counselling request
    acceptRequest: async (requestId, scheduleData) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/requests/${requestId}/accept/`, {
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

    // Decline a counselling request
    declineRequest: async (requestId, reason) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/requests/${requestId}/decline/`, {
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
        const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${sessionId}/cancel/`, {
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

    // Complete a session
    completeSession: async (sessionId, completionNotes = '') => {
        const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${sessionId}/complete/`, {
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
    },

    // Get counsellor statistics
    getStats: async (counsellorId) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/stats/${counsellorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch stats');
        }
        return data;
    },

    // Get counsellor availability
    getAvailability: async (counsellorId) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/availability/${counsellorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch availability');
        }
        return data;
    },

    // Add counsellor availability slot
    addAvailability: async (counsellorId, availabilityData) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/availability/${counsellorId}/`, {
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

    // Get available time slots for a counsellor
    getAvailableSlots: async (counsellorId, startDate = null, endDate = null) => {
        let url = `${API_BASE_URL}/counsellors/available-slots/${counsellorId}/`;
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

    // Book a counselling session in an available slot
    bookSlot: async (counsellorId, bookingData) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/requests/${counsellorId}/`, {
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

    // Get list of all counsellors (public)
    getCounsellors: async () => {
        const response = await fetch(`${API_BASE_URL}/counsellors/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch counsellors');
        }
        return data;
    },

    // Get counsellor details by ID (public)
    getCounsellorDetails: async (counsellorId) => {
        const response = await fetch(`${API_BASE_URL}/counsellors/${counsellorId}/`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch counsellor details');
        }
        return data;
    },
};

export default counsellingAPI;
