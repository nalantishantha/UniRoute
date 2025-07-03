
export const logout = async () => {
  try {
    // Get current user for logout API call
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      // Call Django logout API
      const response = await fetch('http://127.0.0.1:8000/api/accounts/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id
        })
      });
      
      const data = await response.json();
      console.log('Logout API Response:', data);
    }
    
    // Clear local storage regardless of API response
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to login page
    window.location.href = '/login';
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if API fails, clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Still redirect to login
    window.location.href = '/login';
  }
};

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user !== null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const clearAuth = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};