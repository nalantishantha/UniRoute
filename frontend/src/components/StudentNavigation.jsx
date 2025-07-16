import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Bell, User, Settings, LogOut } from "lucide-react";

const StudentNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    { path: "/student/mentors", label: "Mentors" },
    { path: "/student/tutors", label: "Tutors" },
    { path: "/student/news", label: "News" },
    { path: "/student/career-counseling", label: "Counseling" },
  ];

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-accent-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/student/home" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary-400" />
            <span className="font-display font-bold text-2xl text-primary-400">
              UniRoute
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors duration-200 ${
                  isActivePage(item.path)
                    ? "text-primary-400 font-medium"
                    : "text-primary-300 hover:text-primary-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-primary-300 hover:text-primary-400 transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            <Link
              to="/student/profile"
              className="text-primary-300 hover:text-primary-400 transition-colors"
            >
              <User className="h-6 w-6" />
            </Link>
            <Link
              to="/student/settings"
              className="text-primary-300 hover:text-primary-400 transition-colors"
            >
              <Settings className="h-6 w-6" />
            </Link>
            <Link
              to="/student/dashboard"
              className="bg-accent-200 text-primary-400 px-6 py-2 rounded-full font-medium hover:bg-accent-300 transition-all duration-200 hover:shadow-lg"
            >
              My Dashboard
            </Link>
            <Link
              to="/"
              className="text-primary-300 hover:text-primary-400 transition-colors"
            >
              <LogOut className="h-6 w-6" />
            </Link>
          </div>

          <div className="md:hidden">
            <Link
              to="/student/dashboard"
              className="bg-accent-200 text-primary-400 px-4 py-2 rounded-full text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavigation;
