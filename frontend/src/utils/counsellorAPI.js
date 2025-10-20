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
};