// Universities API service functions

const API_BASE_URL = 'http://localhost:8000/api/administration';

// Get all universities with optional search and pagination
export const getAllUniversities = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const response = await fetch(`${API_BASE_URL}/universities/?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch universities'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching universities:', error);
    return {
      success: false,
      message: 'Failed to fetch universities'
    };
  }
};

// Get university by ID
export const getUniversityById = async (universityId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/universities/${universityId}/`);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch university details'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching university details:', error);
    return {
      success: false,
      message: 'Failed to fetch university details'
    };
  }
};

// Update university status (activate/deactivate)
export const updateUniversityStatus = async (universityId, isActive) => {
  try {
    const response = await fetch(`${API_BASE_URL}/universities/${universityId}/status/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update university status'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error updating university status:', error);
    return {
      success: false,
      message: 'Failed to update university status'
    };
  }
};

// Delete university
export const deleteUniversity = async (universityId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/universities/${universityId}/delete/`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete university'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting university:', error);
    return {
      success: false,
      message: 'Failed to delete university'
    };
  }
};

// Update university information
export const updateUniversity = async (universityId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/universities/${universityId}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update university'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error updating university:', error);
    return {
      success: false,
      message: 'Failed to update university'
    };
  }
};

// Create new university
export const createUniversity = async (universityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/universities/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(universityData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to create university'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error creating university:', error);
    return {
      success: false,
      message: 'Failed to create university'
    };
  }
};