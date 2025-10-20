import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, requireAuth, initializeSessionGuard } from '../../utils/auth';

const ProtectedRoute = ({ children, requiredUserType = null, redirectTo = '/login' }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize session guard on component mount
    initializeSessionGuard();

    const checkAuth = () => {
      try {
        const user = getCurrentUser();

        if (!user) {
          console.log('No user found, redirecting to login');
          navigate(redirectTo, { replace: true });
          return;
        }

        // Check if user type matches requirement
        if (requiredUserType) {
          const allowedTypes = Array.isArray(requiredUserType) ? requiredUserType : [requiredUserType];
          if (!allowedTypes.includes(user.user_type)) {
            console.warn(`Access denied. Required: ${allowedTypes.join(' or ')}, Current: ${user.user_type}`);
            navigate(redirectTo, { replace: true });
            return;
          }
        }

        console.log('User authenticated:', user.email, 'Type:', user.user_type);
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate(redirectTo, { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate, requiredUserType, redirectTo]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? children : null;
};

export default ProtectedRoute;
