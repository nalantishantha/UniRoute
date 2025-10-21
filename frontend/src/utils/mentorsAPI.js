const API_BASE_URL = 'http://localhost:8000/api/administration';

export const fetchMentors = async ({ page = 1, perPage = 10, search = '', approved = 'all', status = 'all' } = {}) => {
  const params = new URLSearchParams();

  params.append('page', page);
  params.append('per_page', perPage);

  if (search.trim()) {
    params.append('search', search.trim());
  }

  if (approved && approved !== 'all') {
    params.append('approved', approved);
  }

  if (status && status !== 'all') {
    params.append('status', status);
  }

  const response = await fetch(`${API_BASE_URL}/mentors/?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch mentors');
  }

  return response.json();
};

export const fetchMentorDetails = async (mentorId) => {
  const response = await fetch(`${API_BASE_URL}/mentors/${mentorId}/`);

  if (!response.ok) {
    throw new Error('Failed to fetch mentor');
  }

  return response.json();
};
