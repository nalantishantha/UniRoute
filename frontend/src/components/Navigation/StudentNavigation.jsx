import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoWhite from "../../assets/logoWhite.png";
import { Bell, User, Settings, LogOut, Clock, ExternalLink, X } from "lucide-react";
import { logout } from "../../utils/auth"; // ✅ Import logout function

const StudentNavigation = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Sample system alerts data
  const systemAlerts = [
    {
      id: 1,
      title: "Profile Update Required",
      summary: "Please update your academic information to get better university recommendations.",
      time: "1 hour ago",
      category: "Profile",
      isRead: false,
      link: "/student/profile"
    },
    {
      id: 2,
      title: "Application Deadline Reminder",
      summary: "University application deadline is approaching in 15 days. Complete your applications now.",
      time: "3 hours ago",
      category: "Deadline",
      isRead: false,
      link: "/student/applications"
    },
    {
      id: 3,
      title: "Z-Score Calculation Updated",
      summary: "Your Z-Score has been recalculated based on latest AL results. Check your new score.",
      time: "1 day ago",
      category: "Academic",
      isRead: true,
      link: "/student/z-score"
    },
    {
      id: 4,
      title: "New Mentor Request",
      summary: "A senior student has accepted your mentorship request. Start your session now.",
      time: "2 days ago",
      category: "Mentorship",
      isRead: true,
      link: "/student/mentors"
    },
    {
      id: 5,
      title: "System Maintenance Notice",
      summary: "Scheduled maintenance on Sunday 2:00 AM - 4:00 AM. Some features may be unavailable.",
      time: "3 days ago",
      category: "System",
      isRead: true,
      link: "/student/dashboard"
    }
  ];

  const unreadCount = systemAlerts.filter(alert => !alert.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case "Profile":
        return "bg-blue-100 text-blue-700";
      case "Deadline":
        return "bg-red-100 text-red-700";
      case "Academic":
        return "bg-green-100 text-green-700";
      case "Mentorship":
        return "bg-purple-100 text-purple-700";
      case "System":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // ✅ Handle logout with confirmation
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const getLinkClass = (path) => {
    if (isActive(path)) {
      return "border-2 border-primary-200 bg-primary-200 text-primary-800 px-6 py-2 rounded-lg font-medium hover:bg-white hover:border-white transition-colors duration-200";
    }
    return "text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium";
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-800 border-b border-primary-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-30">
          <div className="flex items-center">
            <Link to="/student/home" className="flex items-center">
              <img
                src={logoWhite}
                alt="UniRoute Logo"
                className="h-20 w-auto -mr-5"
              />
              <span className="font-display font-bold text-2xl text-white">
                UniRoute
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/student/university-guide"
              className={getLinkClass("/student/university-guide")}
            >
              Universities
            </Link>
            <Link
              to="/student/mentors"
              className={getLinkClass("/student/mentors")}
            >
              Mentors
            </Link>
            <Link
              to="/student/tutors"
              className={getLinkClass("/student/tutors")}
            >
              Tutors
            </Link>
            <Link
              to="/student/pre-uni-courses"
              className={getLinkClass("/student/pre-uni-courses")}
            >
              Pre-Uni Courses
            </Link>
            <Link
              to="/student/career-counseling"
              className={getLinkClass("/student/career-counseling")}
            >
              Counseling
            </Link>
            <Link to="/student/news" className={getLinkClass("/student/news")}>
              News
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white/90 hover:text-primary-100 transition-colors relative"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-blue-200 z-50 max-h-150 overflow-hidden">
                  <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-lg text-blue-900">
                        System Alerts
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      {unreadCount} unread notifications
                    </p>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {systemAlerts.map((alert) => (
                      <Link
                        key={alert.id}
                        to={alert.link}
                        onClick={() => setShowNotifications(false)}
                        className={`block p-4 border-b border-blue-100 hover:bg-blue-50 transition-colors ${
                          !alert.isRead ? 'bg-blue-25' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className={`font-medium text-sm ${
                              !alert.isRead ? 'text-blue-900' : 'text-blue-800'
                            }`}>
                              {alert.title}
                            </h4>
                            <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                              {alert.summary}
                            </p>
                          </div>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1 ml-2"></div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(alert.category)}`}>
                              {alert.category}
                            </span>
                            <div className="flex items-center space-x-1 text-blue-600">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{alert.time}</span>
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 text-blue-600" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-blue-200 bg-blue-50">
                    <Link
                      to="/student/dashboard"
                      onClick={() => setShowNotifications(false)}
                      className="block text-center text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors"
                    >
                      View All Alerts →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/student/profile"
              className={
                isActive("/student/profile")
                  ? "border-2 border-primary-200 bg-primary-200 text-primary-800 px-3 py-2 rounded-lg transition-colors duration-200"
                  : "text-white/90 hover:text-primary-100 transition-colors"
              }
            >
              <User className="h-6 w-6" />
            </Link>
            <Link
              to="/student/settings"
              className={
                isActive("/student/settings")
                  ? "border-2 border-primary-200 bg-primary-200 text-primary-800 px-3 py-2 rounded-lg transition-colors duration-200"
                  : "text-white/90 hover:text-primary-100 transition-colors"
              }
            >
              <Settings className="h-6 w-6" />
            </Link>
            <Link
              to="/student/dashboard"
              className={
                isActive("/student/dashboard")
                  ? "border-2 border-primary-200 bg-primary-200 text-primary-800 px-6 py-2 rounded-lg font-medium hover:bg-white hover:border-white transition-colors duration-200"
                  : "text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              }
            >
              My Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-white/90 hover:text-primary-100 transition-colors"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>

          <div className="md:hidden">
            <div className="flex space-x-2 items-center">
              <Link to="/student/university-guide" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">Universities</Link>
              <Link to="/student/mentors" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">Mentors</Link>
              <Link to="/student/tutors" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">Tutors</Link>
              <Link to="/student/pre-uni-courses" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">Pre-Uni</Link>
              <Link to="/student/career-counseling" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">Counseling</Link>
              <Link to="/student/news" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">News</Link>
              <Link to="/about" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">About</Link>
              <Link to="/contact" className="text-white/90 hover:text-primary-100 px-3 py-2 rounded text-sm transition-colors">Contact</Link>
              <Link to="/student/dashboard" className="bg-primary-200 text-primary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors duration-200">Dashboard</Link>
            </div>
          </div>
          </div>
        </div>
      </nav>
    );
  };

export default StudentNavigation;
