const BASE_URL = 'http://localhost:8000/api/administration';

export const companiesAPI = {
  // Get all companies with pagination and filters
  getAllCompanies: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      per_page: params.per_page || 10,
      ...(params.search && { search: params.search }),
      ...(params.district && params.district !== 'all' && { district: params.district }),
    });

    const response = await fetch(`${BASE_URL}/companies/?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    return response.json();
  },

  // Get company by ID
  getCompanyById: async (companyId) => {
    const response = await fetch(`${BASE_URL}/companies/${companyId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch company details');
    }
    return response.json();
  },

  // Create new company
  createCompany: async (companyData) => {
    const response = await fetch(`${BASE_URL}/companies/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create company');
    }
    return response.json();
  },

  // Update company
  updateCompany: async (companyId, companyData) => {
    const response = await fetch(`${BASE_URL}/companies/${companyId}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update company');
    }
    return response.json();
  },

  // Delete company
  deleteCompany: async (companyId) => {
    const response = await fetch(`${BASE_URL}/companies/${companyId}/delete/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete company');
    }
    return response.json();
  },
};