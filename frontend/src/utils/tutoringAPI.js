// API utility functions for tutoring (recurring bookings)
const API_BASE_URL = 'http://localhost:8000/api';

export const tutoringAPI = {
    // ============================================================================
    // TUTOR AVAILABILITY MANAGEMENT
    // ============================================================================

    // Get tutor's availability slots
    getAvailability: async (tutorId) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/availability/${tutorId}/`);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch availability');
        }
        return data;
    },

    // Add tutor availability slot
    addAvailability: async (tutorId, availabilityData) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/availability/${tutorId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(availabilityData),
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to add availability');
        }
        return data;
    },

    // Update tutor availability slot
    updateAvailability: async (tutorId, availabilityData) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/availability/${tutorId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(availabilityData),
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to update availability');
        }
        return data;
    },

    // Delete tutor availability slot
    deleteAvailability: async (tutorId, availabilityId) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/availability/${tutorId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availability_id: availabilityId }),
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to delete availability');
        }
        return data;
    },

    // ============================================================================
    // TUTOR DISCOVERY & SLOTS
    // ============================================================================

    // Get available tutors (with recurring slots)
    getAvailableTutors: async (subjectId = null, dayOfWeek = null) => {
        let url = `${API_BASE_URL}/tutoring/tutors/available/`;
        const params = new URLSearchParams();
        
        if (subjectId) {
            params.append('subject_id', subjectId);
        }
        if (dayOfWeek !== null) {
            params.append('day_of_week', dayOfWeek);
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch tutors');
        }
        return data;
    },

    // Get available time slots for a specific tutor
    getAvailableSlots: async (tutorId, subjectId = null) => {
        let url = `${API_BASE_URL}/tutoring/available-slots/${tutorId}/`;
        
        if (subjectId) {
            url += `?subject_id=${subjectId}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch available slots');
        }
        return data;
    },

    // ============================================================================
    // TUTORING BOOKINGS
    // ============================================================================

    // Create a recurring tutoring booking
    createBooking: async (bookingData) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/bookings/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to create booking');
        }
        return data;
    },

    // Confirm payment for a booking
    confirmPayment: async (bookingId, paymentData) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/bookings/${bookingId}/confirm-payment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to confirm payment');
        }
        return data;
    },

    // Cancel a booking
    cancelBooking: async (bookingId, reason = '') => {
        const response = await fetch(`${API_BASE_URL}/tutoring/bookings/${bookingId}/cancel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to cancel booking');
        }
        return data;
    },

    // Get bookings for a student
    getStudentBookings: async (studentId, status = null) => {
        let url = `${API_BASE_URL}/tutoring/bookings/student/${studentId}/`;
        
        if (status) {
            url += `?status=${status}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch bookings');
        }
        return data;
    },

    // Get bookings for a tutor
    getTutorBookings: async (tutorId, status = null) => {
        let url = `${API_BASE_URL}/tutoring/bookings/tutor/${tutorId}/`;
        
        if (status) {
            url += `?status=${status}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch bookings');
        }
        return data;
    },

    // ============================================================================
    // SUBJECTS
    // ============================================================================

    // Get all subjects
    getSubjects: async () => {
        const response = await fetch(`${API_BASE_URL}/tutoring/subjects/`);
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch subjects');
        }
        return data;
    },
};
