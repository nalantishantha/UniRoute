// University Students API service functions

const API_BASE_URL = 'http://localhost:8000/api/administration';

// Get all university students with optional search and pagination
export const getAllUniversityStudents = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.university) queryParams.append('university', params.university);
    if (params.degree) queryParams.append('degree', params.degree);
    if (params.year) queryParams.append('year', params.year);

    const response = await fetch(`${API_BASE_URL}/university-students/?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch university students');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching university students:', error);
    throw error;
  }
};

// Get university student by ID
export const getUniversityStudentById = async (universityStudentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/university-students/${universityStudentId}/`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch university student details');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching university student details:', error);
    throw error;
  }
};

// Update university student status (activate/deactivate)
export const updateUniversityStudentStatus = async (universityStudentId, isActive) => {
  try {
    const response = await fetch(`${API_BASE_URL}/university-students/${universityStudentId}/status/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update university student status');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating university student status:', error);
    throw error;
  }
};

// Update university student information
export const updateUniversityStudent = async (universityStudentId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/university-students/${universityStudentId}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update university student');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating university student:', error);
    throw error;
  }
};

// Delete university student
export const deleteUniversityStudent = async (universityStudentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/university-students/${universityStudentId}/delete/`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete university student');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting university student:', error);
    throw error;
  }
};

// Get all universities for filtering
export const getAllUniversities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/universities/`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch universities');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw error;
  }
};