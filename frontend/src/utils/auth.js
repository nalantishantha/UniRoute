
export const logout = async () => {
  try {
    // Get current user for logout API call
    const currentUser = getCurrentUser();
    console.log('Starting logout for user:', currentUser);

    if (currentUser) {
      // Call Django logout API
      const response = await fetch('http://127.0.0.1:8000/api/accounts/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.user_id
        })
      });

      const data = await response.json();
      console.log('Logout API Response:', data);
    }

    // Clear all authentication data
    console.log('Clearing authentication data...');
    clearAuth();

    // Add a logout timestamp to prevent back button access
    localStorage.setItem('logout_timestamp', Date.now().toString());
    console.log('Logout timestamp set:', Date.now());

    // Clear ALL localStorage except logout_timestamp
    const logoutTime = localStorage.getItem('logout_timestamp');
    localStorage.clear();
    localStorage.setItem('logout_timestamp', logoutTime);

    // Clear ALL sessionStorage
    sessionStorage.clear();

    // Clear browser history to prevent back navigation
    if (window.history.length > 1) {
      window.history.pushState(null, null, '/login');
      window.history.pushState(null, null, '/login');
    }

    // Add popup state manipulation to prevent back navigation
    window.addEventListener('popstate', function (event) {
      console.log('Back button detected after logout, redirecting...');
      window.location.replace('/login');
    });

    console.log('Redirecting to login page...');
    // Force a hard redirect to prevent back button issues
    window.location.replace('/login');

  } catch (error) {
    console.error('Logout error:', error);

    // Even if API fails, clear all authentication data
    console.log('Error occurred, forcing authentication clear...');
    clearAuth();

    // Add logout timestamp
    localStorage.setItem('logout_timestamp', Date.now().toString());

    // Clear ALL localStorage except logout_timestamp
    const logoutTime = localStorage.getItem('logout_timestamp');
    localStorage.clear();
    localStorage.setItem('logout_timestamp', logoutTime);

    // Clear ALL sessionStorage
    sessionStorage.clear();

    // Clear browser history
    if (window.history.length > 1) {
      window.history.pushState(null, null, '/login');
      window.history.pushState(null, null, '/login');
    }

    // Still redirect to login
    console.log('Redirecting to login after error...');
    window.location.replace('/login');
  }
};

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  const logoutTimestamp = localStorage.getItem('logout_timestamp');

  // If there's a recent logout timestamp, user is not authenticated
  if (logoutTimestamp) {
    const logoutTime = parseInt(logoutTimestamp);
    const currentTime = Date.now();

    // Clear logout timestamp after 1 hour to allow fresh logins
    if (currentTime - logoutTime > 3600000) {
      localStorage.removeItem('logout_timestamp');
    } else if (user) {
      // User data exists but there's a recent logout, clear it
      clearAuth();
      return false;
    }
  }

  return user !== null;
};

export const getCurrentUser = () => {
  // Check if user is authenticated first
  if (!isAuthenticated()) {
    return null;
  }

  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

export const removeCurrentUser = () => {
  try {
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Error removing current user:', error);
  }
};


export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const clearAuth = () => {
  // Remove all possible authentication tokens and user data
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
  localStorage.removeItem('login_timestamp');

  // Also clear any session storage
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('login_timestamp');

  // Clear any additional session data that might persist
  sessionStorage.clear();

  // Force clear browser cache for this origin
  if ('caches' in window) {
    caches.keys().then(function (names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
};

// Enhanced authentication check with session validation
export const requireAuth = (userType = null) => {
  const user = getCurrentUser();

  if (!user) {
    window.location.replace('/login');
    return false;
  }

  // Check if user type matches requirement
  if (userType) {
    const allowedTypes = Array.isArray(userType) ? userType : [userType];
    if (!allowedTypes.includes(user.user_type)) {
      console.warn(`Access denied. Required: ${allowedTypes.join(' or ')}, Current: ${user.user_type}`);
      window.location.replace('/login');
      return false;
    }
  }

  return true;
};

// Session management for preventing back button access and direct URL access
export const initializeSessionGuard = () => {
  // Check authentication on every page load/refresh
  const checkAuthOnLoad = () => {
    const currentPath = window.location.pathname;
    console.log('Session guard checking path:', currentPath);

    const isProtectedRoute = currentPath.startsWith('/admin') ||
      currentPath.startsWith('/university-student') ||
<<<<<<< HEAD
      currentPath.startsWith('/pre-mentor') ||
=======
>>>>>>> origin/UR-4
      currentPath.startsWith('/student') ||
      currentPath.startsWith('/university') ||
      currentPath.startsWith('/company');

    if (isProtectedRoute) {
      const user = getCurrentUser();
      const logoutTimestamp = localStorage.getItem('logout_timestamp');

      console.log('Protected route detected. User:', user, 'Logout timestamp:', logoutTimestamp);

      // If user was recently logged out, prevent access
      if (logoutTimestamp) {
        const logoutTime = parseInt(logoutTimestamp);
        const currentTime = Date.now();

        if (currentTime - logoutTime < 3600000) { // Within 1 hour of logout
          console.log('Recent logout detected, redirecting to login');
          clearAuth();
          window.location.replace('/login');
          return;
        }
      }

      // If no user or invalid user type for the route
      if (!user) {
        console.log('No authenticated user, redirecting to login');
        clearAuth();
        window.location.replace('/login');
        return;
      }

<<<<<<< HEAD
      // Define route access rules
      const routeAccess = {
        '/admin': ['admin'],
        '/university-student': ['uni_student', 'mentor'],
        '/unistudent': ['uni_student', 'mentor'], // Alternative route
        '/pre-mentor': ['pre_mentor'],
        '/student': ['student'],
        '/university': ['institution'],
        '/company': ['company']
      };

      // Check route-specific access
      for (const [route, allowedTypes] of Object.entries(routeAccess)) {
        if (currentPath.startsWith(route) && !allowedTypes.includes(user.user_type)) {
          console.log(`Unauthorized access to ${route}. Required: ${allowedTypes.join(' or ')}, Current: ${user.user_type}`);
          if (route === '/student') {
            clearAuth(); // Clear auth for student routes as per original logic
          }
          window.location.replace('/login');
          return;
        }
=======
      // Check route-specific access
      if (currentPath.startsWith('/admin') && user.user_type !== 'admin') {
        console.log('Non-admin trying to access admin route, redirecting');
        window.location.replace('/login');
        return;
      }

      if (currentPath.startsWith('/university-student') && user.user_type !== 'uni_student') {
        console.log('Non-university-student trying to access university student route, redirecting');
        window.location.replace('/login');
        return;
      }

      if (currentPath.startsWith('/student') && user.user_type !== 'student') {
        console.log('Non-student trying to access student route, redirecting. User type:', user.user_type, 'Path:', currentPath);
        clearAuth();
        window.location.replace('/login');
        return;
      }

      if (currentPath.startsWith('/university') && user.user_type !== 'institution') {
        console.log('Non-institution trying to access university route, redirecting');
        window.location.replace('/login');
        return;
      }

      if (currentPath.startsWith('/company') && user.user_type !== 'company') {
        console.log('Non-company trying to access company route, redirecting');
        window.location.replace('/login');
        return;
>>>>>>> origin/UR-4
      }
    }
  };

  // Run auth check immediately
  checkAuthOnLoad();

  // Prevent back button from accessing cached pages after logout
  window.addEventListener('pageshow', function (event) {
    if (event.persisted || window.performance && window.performance.navigation.type === 2) {
      // Page was loaded from cache (back button)
      checkAuthOnLoad(); // Use the same auth check
    }
  });

  // Handle browser navigation (back/forward buttons)
  window.addEventListener('popstate', function (event) {
    checkAuthOnLoad(); // Check auth on navigation
  });

  // Monitor for hash changes and URL changes
  window.addEventListener('hashchange', function (event) {
    checkAuthOnLoad();
  });

  // Clear browser history on logout to prevent back button access
  window.addEventListener('beforeunload', function (event) {
    const logoutTimestamp = localStorage.getItem('logout_timestamp');
    if (logoutTimestamp) {
      // Clear any sensitive data that might be cached
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
    }
  });
};