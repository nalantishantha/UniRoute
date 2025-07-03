import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Home, 
  School, 
  BookOpen, 
  User, 
  Search,
  Calculator,
  Heart,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { logout, getCurrentUser } from '../../utils/auth'; // ✅ Import logout function

const StudentNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // ✅ Add user state
  const location = useLocation();

  // ✅ Get current user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const isActive = (path) => location.pathname === path;

  // ✅ Handle logout with confirmation
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const navigationItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: Home },
    { path: '/student/universities', label: 'Universities', icon: School },
    { path: '/student/programs', label: 'Programs', icon: BookOpen },
    { path: '/student/calculator', label: 'Z-Score Calculator', icon: Calculator },
    { path: '/student/favorites', label: 'Favorites', icon: Heart },
    { path: '/student/search', label: 'Search', icon: Search },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-primary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link to="/student/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-2xl text-primary-600">UniRoute</span>
            </Link>
            <div className="hidden md:block">
              <span className="bg-accent-200 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                Student Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-primary-400 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Notifications & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                <User className="h-5 w-5" />
                <span className="font-medium">
                  {user ? user.first_name : 'Student'} {/* ✅ Show actual user name */}
                </span>
              </button>
            </div>

            {/* Logout Button - Updated */}
            <button 
              onClick={handleLogout} // ✅ Connect to logout function
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-primary-400 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Profile & Logout */}
              <div className="border-t border-primary-200 pt-4 mt-4 space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 text-primary-600">
                  <User className="h-5 w-5" />
                  <span className="font-medium">
                    {user ? user.first_name : 'Student'} {/* ✅ Show actual user name */}
                  </span>
                  <Bell className="h-5 w-5 ml-auto" />
                </div>
                <button 
                  onClick={handleLogout} // ✅ Connect to logout function
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;