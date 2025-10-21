// filepath: c:\Users\HP\OneDrive\Desktop\GP 3\UniRoute\frontend\src\utils\counsellorAPI.js
// API utility functions for counsellor operations
const API_BASE_URL = 'http://localhost:8000/api';

export const counsellorAPI = {
  // Get counsellor profile by user ID
  getProfile: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/profile/${userId}/`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }
      return data;
    } catch (error) {
      console.error('Error fetching counsellor profile:', error);
      throw error;
    }
  },

  // Update counsellor profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/profile/${userId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      return data;
    } catch (error) {
      console.error('Error updating counsellor profile:', error);
      throw error;
    }
  },

  // Get counsellor statistics (if needed later)
  getStats: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/${counsellorId}/stats/`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }
      return data;
    } catch (error) {
      console.error('Error fetching counsellor stats:', error);
      throw error;
    }
  },

  // Upload profile picture (if needed)
  uploadProfilePicture: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch(`${API_BASE_URL}/counsellors/profile/${userId}/upload-picture/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload picture');
      }
      return data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },

  // Settings API functions
  // Get counsellor settings
  getSettings: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/settings/${userId}/`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch settings');
      }
      return data;
    } catch (error) {
      console.error('Error fetching counsellor settings:', error);
      throw error;
    }
  },

  // Update counsellor settings
  updateSettings: async (userId, settingsData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/settings/${userId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }
      return data;
    } catch (error) {
      console.error('Error updating counsellor settings:', error);
      throw error;
    }
  },

  // Change counsellor password
  changePassword: async (userId, passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/settings/${userId}/password/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      return data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Delete counsellor account
  deleteAccount: async (userId, confirmationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/settings/${userId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmationData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }
      return data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  // Counselling Session Management Functions

  // Get counselling requests for a counsellor
  getRequests: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/requests/${counsellorId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching counselling requests:', error);
      throw error;
    }
  },

  // Get counselling sessions for a counsellor
  getSessions: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${counsellorId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching counselling sessions:', error);
      throw error;
    }
  },

  // Accept a counselling request
  acceptRequest: async (requestId, sessionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/requests/${requestId}/accept/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error accepting counselling request:', error);
      throw error;
    }
  },

  // Decline a counselling request
  declineRequest: async (requestId, declineReason) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/requests/${requestId}/decline/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decline_reason: declineReason }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error declining counselling request:', error);
      throw error;
    }
  },

  // Cancel a counselling session
  cancelSession: async (sessionId, cancellationReason = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${sessionId}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancellation_reason: cancellationReason }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error cancelling counselling session:', error);
      throw error;
    }
  },

  // Complete a counselling session
  completeSession: async (sessionId, completionNotes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${sessionId}/complete/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completion_notes: completionNotes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error completing counselling session:', error);
      throw error;
    }
  },

  // Reschedule a counselling session
  rescheduleSession: async (sessionId, newScheduledAt, meetingLink = '', location = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${sessionId}/reschedule/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduled_at: newScheduledAt,
          meeting_link: meetingLink,
          location: location,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error rescheduling counselling session:', error);
      throw error;
    }
  },

  // Get counselling requests for a counsellor
  getRequests: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/requests/${counsellorId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching counselling requests:', error);
      throw error;
    }
  },

  // Get counselling sessions for a counsellor
  getSessions: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/sessions/${counsellorId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching counselling sessions:', error);
      throw error;
    }
  },

  // Get counselling statistics
  getStats: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/stats/${counsellorId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching counselling stats:', error);
      throw error;
    }
  },

  // Legacy function name for backward compatibility
  getCounsellingStats: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/counsellors/stats/${counsellorId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching counselling stats:', error);
      throw error;
    }
  },
};