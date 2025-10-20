
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Fetch all internship opportunities
 * @param {Object} params - Query parameters for filtering and pagination
 * @param {string} params.company - Company filter (default: 'all')
 * @param {string} params.location - Location filter (default: 'all')
 * @param {string} params.search - Search term
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.per_page - Items per page (default: 20)
 * @returns {Promise<Object>} API response with internships data
 */
export const fetchInternshipOpportunities = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      company: params.company || 'all',
      location: params.location || 'all',
      search: params.search || '',
      page: params.page || 1,
      per_page: params.per_page || 20,
    });

    const response = await fetch(
      `${API_BASE_URL}/companies/internships/?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch internships');
    }
  } catch (error) {
    console.error('Error fetching internship opportunities:', error);
    throw error;
  }
};

/**
 * Fetch detailed information about a specific internship
 * @param {number} internshipId - The ID of the internship
 * @returns {Promise<Object>} API response with internship details
 */
export const fetchInternshipDetails = async (internshipId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/internships/${internshipId}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch internship details');
    }
  } catch (error) {
    console.error('Error fetching internship details:', error);
    throw error;
  }
};

/**
 * Get unique locations from internships for filter dropdown
 * @returns {Promise<Array<string>>} Array of locations
 */
export const fetchInternshipLocations = async () => {
  try {
    // First, fetch a larger set to get all unique locations
    const response = await fetchInternshipOpportunities({ per_page: 1000 });

    const locations = response.internships
      .map(internship => internship.location)
      .filter(location => location && location.trim() !== '')
      .filter((location, index, self) => self.indexOf(location) === index) // Remove duplicates
      .sort();

    return locations;
  } catch (error) {
    console.error('Error fetching internship locations:', error);
    return [];
  }
};

/**
 * Get unique companies from internships for filter dropdown
 * @returns {Promise<Array<Object>>} Array of company objects
 */
export const fetchInternshipCompanies = async () => {
  try {
    // First, fetch a larger set to get all unique companies
    const response = await fetchInternshipOpportunities({ per_page: 1000 });

    const companiesMap = new Map();

    response.internships.forEach(internship => {
      if (internship.company && !companiesMap.has(internship.company.company_id)) {
        companiesMap.set(internship.company.company_id, {
          company_id: internship.company.company_id,
          name: internship.company.name,
          district: internship.company.district
        });
      }
    });

    return Array.from(companiesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching internship companies:', error);
    return [];
  }
};