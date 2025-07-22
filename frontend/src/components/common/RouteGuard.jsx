import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, clearAuth } from '../../utils/auth';

const RouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkRouteAccess = () => {
      const currentPath = location.pathname;
      
      // Define protected routes and their required user types
      const protectedRoutes = {
        '/admin': 'admin',
        '/university-student': 'uni_student',
        '/student': 'student',
        '/university': 'institution',
        '/company': 'company'
      };

      // Check if current route is protected
      const protectedRoute = Object.keys(protectedRoutes).find(route => 
        currentPath.startsWith(route)
      );

      if (protectedRoute) {
        const requiredUserType = protectedRoutes[protectedRoute];
        const user = getCurrentUser();
        const logoutTimestamp = localStorage.getItem('logout_timestamp');

        // Check for recent logout
        if (logoutTimestamp) {
          const logoutTime = parseInt(logoutTimestamp);
          const currentTime = Date.now();
          
          if (currentTime - logoutTime < 3600000) { // Within 1 hour
            console.log('Recent logout detected, blocking access to:', currentPath);
            clearAuth();
            navigate('/login', { replace: true });
            return;
          }
        }

        // Check authentication
        if (!user) {
          console.log('No authenticated user, blocking access to:', currentPath);
          navigate('/login', { replace: true });
          return;
        }

        // Check user type authorization
        if (user.user_type !== requiredUserType) {
          console.log(`Unauthorized access attempt. Required: ${requiredUserType}, Current: ${user.user_type}`);
          navigate('/login', { replace: true });
          return;
        }

        console.log(`Access granted to ${currentPath} for user type: ${user.user_type}`);
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    // Check on every route change
    checkRouteAccess();
  }, [location.pathname, navigate]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

export default RouteGuard;
