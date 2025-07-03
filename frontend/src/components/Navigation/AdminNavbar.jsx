import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Home, 
  School, 
  Users, 
  User, 
  Settings,
  BarChart3,
  FileText,
  Bell,
  Menu,
  X,
  LogOut,
  Shield,
  Database,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { logout, getCurrentUser } from '../../utils/auth'; // ✅ Import logout function

const AdminNavbar = () => {
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
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/universities', label: 'Universities', icon: School },
    { path: '/admin/students', label: 'Students', icon: Users },
    { path: '/admin/programs', label: 'Programs', icon: BookOpen },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/users', label: 'User Management', icon: UserCheck },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-white" />
              <span className="font-bold text-2xl text-white">UniRoute</span>
            </Link>
            <div className="hidden md:block">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Admin Panel</span>
              </span>
            </div>
          </div>

          {/* System Status */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/80">
              <Database className="h-4 w-4" />
              <span className="text-sm">System Status: </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Online</span>
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
                      ? 'bg-white text-primary-600 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
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
            <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                7
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
                <User className="h-5 w-5" />
                <div className="text-left">
                  <span className="font-medium block text-white">
                    {user ? user.first_name : 'Admin'} {/* ✅ Show actual user name */}
                  </span>
                  <span className="text-xs text-white/60">System Administrator</span>
                </div>
              </button>
            </div>

            {/* Logout Button - Updated */}
            <button 
              onClick={handleLogout} // ✅ Connect to logout function
              className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            {/* Admin Badge Mobile */}
            <div className="flex items-center space-x-2 px-4 py-2 mb-4 bg-red-500 rounded-lg">
              <Shield className="h-4 w-4 text-white" />
              <span className="text-white font-medium">Admin Panel</span>
            </div>

            {/* System Status Mobile */}
            <div className="flex items-center space-x-2 px-4 py-2 mb-4 bg-white/10 rounded-lg">
              <Database className="h-4 w-4 text-white" />
              <span className="text-white text-sm">System: </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Online</span>
            </div>

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
                        ? 'bg-white text-primary-600 shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Profile & Logout */}
              <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 text-white">
                  <User className="h-5 w-5" />
                  <div>
                    <span className="font-medium block">
                      {user ? user.first_name : 'Admin'} {/* ✅ Show actual user name */}
                    </span>
                    <span className="text-xs text-white/60">System Administrator</span>
                  </div>
                  <Bell className="h-5 w-5 ml-auto" />
                </div>
                <button 
                  onClick={handleLogout} // ✅ Connect to logout function
                  className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200 w-full"
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

export default AdminNavbar;