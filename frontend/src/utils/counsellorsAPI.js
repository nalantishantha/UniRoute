const API_BASE_URL = 'http://localhost:8000/api';

export const counsellorsAPI = {
  getAllCounsellors: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams();

      if (params.search) {
        searchParams.append('search', params.search);
      }
      if (params.status && params.status !== 'all') {
        searchParams.append('status', params.status);
      }
      if (params.verification && params.verification !== 'all') {
        searchParams.append('verification', params.verification);
      }
      if (params.page) {
        searchParams.append('page', params.page.toString());
      }
      if (params.per_page) {
        searchParams.append('per_page', params.per_page.toString());
      }

      const url = `${API_BASE_URL}/administration/counsellors/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch counsellors');
      }

      return data;
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      throw error;
    }
  },

  getCounsellorById: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/counsellors/${counsellorId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch counsellor');
      }

      return data;
    } catch (error) {
      console.error('Error fetching counsellor:', error);
      throw error;
    }
  },

  updateCounsellor: async (counsellorId, payload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/counsellors/${counsellorId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update counsellor');
      }

      return data;
    } catch (error) {
      console.error('Error updating counsellor:', error);
      throw error;
    }
  },

  updateCounsellorStatus: async (counsellorId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/counsellors/${counsellorId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update counsellor status');
      }

      return data;
    } catch (error) {
      console.error('Error updating counsellor status:', error);
      throw error;
    }
  },

  deleteCounsellor: async (counsellorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/counsellors/${counsellorId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete counsellor');
      }

      return data;
    } catch (error) {
      console.error('Error deleting counsellor:', error);
      throw error;
    }
  },
};

export default counsellorsAPI;
