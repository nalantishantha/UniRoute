const API_BASE_URL = 'http://localhost:8000/api';

// Students API functions
export const studentsAPI = {
  // Get all students with filters and pagination
  getAllStudents: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams();
      
      // Add parameters if they exist
      if (params.stage && params.stage !== 'all') {
        searchParams.append('stage', params.stage);
      }
      if (params.search) {
        searchParams.append('search', params.search);
      }
      if (params.page) {
        searchParams.append('page', params.page.toString());
      }
      if (params.per_page) {
        searchParams.append('per_page', params.per_page.toString());
      }

      const url = `${API_BASE_URL}/administration/students/${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      
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
        throw new Error(data.message || 'Failed to fetch students');
      }

      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/students/${studentId}/`, {
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
        throw new Error(data.message || 'Failed to fetch student');
      }

      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  // Update student status
  updateStudentStatus: async (studentId, isActive) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/students/${studentId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update student status');
      }

      return data;
    } catch (error) {
      console.error('Error updating student status:', error);
      throw error;
    }
  },

  // Delete student
  deleteStudent: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/students/${studentId}/delete/`, {
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
        throw new Error(data.message || 'Failed to delete student');
      }

      return data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  // Update student information
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/students/${studentId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update student');
      }

      return data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administration/students/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create student');
      }

      return data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }
};

export default studentsAPI;