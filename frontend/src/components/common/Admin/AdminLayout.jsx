import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, requireAuth, logout } from "../../../utils/auth";
import AdminSidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({
  children,
  pageTitle = "Dashboard",
  pageDescription = "",
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and user type
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        console.log('No authenticated user found, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }
      
      if (currentUser.user_type !== 'admin') {
        console.warn('Access denied: User is not an admin');
        navigate('/login', { replace: true });
        return;
      }
      
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <AdminHeader
          toggleSidebar={toggleSidebar}
          user={user}
          handleLogout={handleLogout}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
        />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
