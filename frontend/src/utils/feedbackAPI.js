// API utility functions for feedback
const API_BASE_URL = 'http://localhost:8000/api';

export const feedbackAPI = {
  // Get feedback for a specific university student
  getFeedback: async (universityStudentId, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.service_type && filters.service_type !== 'all') {
      params.append('service_type', filters.service_type);
    }
    if (filters.sentiment && filters.sentiment !== 'all') {
      params.append('sentiment', filters.sentiment);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const url = `${API_BASE_URL}/university-students/user/${universityStudentId}/feedback/${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch feedback');
    }

    return data;
  },

  // Reply to feedback (placeholder for future implementation)
  replyToFeedback: async (feedbackId, reply) => {
    // This would be implemented when reply functionality is added
    console.log('Reply to feedback:', feedbackId, reply);
    return { success: true };
  }
};