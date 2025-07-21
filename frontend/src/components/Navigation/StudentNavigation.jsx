import React from "react";
import { Link, useLocation } from "react-router-dom";
import logoWhite from "../../assets/logoWhite.png";
import { Bell, User, Settings, LogOut } from "lucide-react";

const StudentNavigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
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
            <Link to="/student/news" className={getLinkClass("/student/news")}>
              News
            </Link>
            <Link
              to="/student/career-counseling"
              className={getLinkClass("/student/career-counseling")}
            >
              Counseling
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white/90 hover:text-primary-100 transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
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
            <Link
              to="/"
              className="text-white/90 hover:text-primary-100 transition-colors"
            >
              <LogOut className="h-6 w-6" />
            </Link>
          </div>

          <div className="md:hidden">
            <Link
              to="/student/dashboard"
              className="bg-primary-200 text-primary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors duration-200"
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
