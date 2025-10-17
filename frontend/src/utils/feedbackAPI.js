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

  // Export feedback report as PDF
  exportFeedbackReport: async (universityStudentId, filters = {}) => {
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

    const url = `${API_BASE_URL}/university-students/user/${universityStudentId}/feedback/export/${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to export feedback report');
    }

    // Get the blob data for PDF download
    const blob = await response.blob();

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `feedback_report_${timestamp}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true, message: 'Report downloaded successfully' };
  },

  // Reply to feedback (placeholder for future implementation)
  replyToFeedback: async (feedbackId, reply) => {
    // This would be implemented when reply functionality is added
    console.log('Reply to feedback:', feedbackId, reply);
    return { success: true };
  }
};