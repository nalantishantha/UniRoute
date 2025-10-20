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
        try {
            const response = await fetch(`${API_BASE_URL}/tutoring/bookings/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                // Try to get error message from response
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Server error: ${response.status}`);
                } catch {
                    throw new Error(`Server error: ${response.status} - ${response.statusText}`);
                }
            }

            const data = await response.json();
            if (data.status !== 'success') {
                throw new Error(data.message || 'Failed to create booking');
            }
            return data;
        } catch (error) {
            // More specific error messages
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Please check if the backend is running.');
            }
            throw error;
        }
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

    // Mark an individual session as completed
    markSessionCompleted: async (bookingId) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/bookings/${bookingId}/mark-completed/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to mark session as completed');
        }
        return data;
    },

    // Complete a tutoring booking (all sessions done)
    completeBooking: async (bookingId) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/bookings/${bookingId}/complete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to complete booking');
        }
        return data;
    },

    // ============================================================================
    // SESSION RESCHEDULING
    // ============================================================================

    // Reschedule a specific session within a booking
    rescheduleSession: async (bookingId, rescheduleData) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/bookings/${bookingId}/reschedule/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rescheduleData),
        });
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to reschedule session');
        }
        return data;
    },

    // Get all reschedules for a booking
    getBookingReschedules: async (bookingId) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/bookings/${bookingId}/reschedules/`);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch reschedules');
        }
        return data;
    },

    // ============================================================================
    // TUTOR SESSION MANAGEMENT
    // ============================================================================

    // Get detailed session information for a tutor
    getTutorSessions: async (tutorId, status = 'upcoming') => {
        let url = `${API_BASE_URL}/tutoring/tutor/${tutorId}/sessions/`;

        if (status) {
            url += `?status=${status}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch tutor sessions');
        }
        return data;
    },

    // Get tutor statistics
    getTutorStats: async (tutorId) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/tutor/${tutorId}/stats/`);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch tutor stats');
        }
        return data;
    },

    // Get tutor info by user ID
    getTutorByUserId: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/tutoring/tutor/by-user/${userId}/`);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch tutor info');
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
