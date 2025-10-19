import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  Calendar,
  LogOut,
  ChevronDown,
  Settings,
  UserCircle,
} from "lucide-react";
import { logout, getCurrentUser } from "../../utils/auth";
import { cn } from "../../utils/cn";

export default function PreMentorNavbar({ onMenuClick }) {

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Get current user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Handle logout with confirmation
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  // Function to get page name from current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case "/pre-mentor/dashboard":
        return "Dashboard";
      case "/pre-mentor/tutoring":
        return "Tutoring";
      case "/pre-mentor/internships":
        return "Internships";
      case "/pre-mentor/earnings":
        return "Earnings";
      case "/pre-mentor/profile":
        return "Profile";
      case "/pre-mentor/calendar":
        return "Calendar";
      case "/pre-mentor/settings":
        return "Settings";
      default:
        return "Pre-Mentor Dashboard";
    }
  };



  // Function to get page description
  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case "/pre-mentor/dashboard":
        return "Track your tutoring progress and manage activities";
      case "/pre-mentor/tutoring":
        return "Manage your tutoring sessions and students";
      case "/pre-mentor/internships":
        return "Explore new internship opportunities";
      case "/pre-mentor/earnings":
        return "View your earnings and payment history";
      case "/pre-mentor/profile":
        return "Manage your profile and preferences";
      case "/pre-mentor/calendar":
        return "Manage your schedule and availability";
      case "/pre-mentor/settings":
        return "Manage your account and preferences";
      default:
        return "Track your tutoring progress and manage activities";
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white border-b-2 shadow-md border-neutral-silver/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl hover:bg-neutral-silver/70 transition-all duration-200 hover:shadow-sm"
          >
            <Menu className="w-5 h-5 text-neutral-dark-grey" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-transparent text-neutral-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text">
              {getPageName()}
            </h2>
            <p className="text-sm font-medium text-neutral-grey">
              {getPageDescription()}
            </p>
          </div>
        </div>

        <div className="flex-1 hidden max-w-lg mx-8 md:flex">
          <div className="relative w-full transition-all duration-300">
            {/* Search functionality can be added here if needed */}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 transition-all duration-200 rounded-xl hover:bg-neutral-silver/70 group hover:shadow-sm"
          >
            <Calendar className="w-5 h-5 text-neutral-dark-grey group-hover:text-primary-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 transition-all duration-200 rounded-xl hover:bg-neutral-silver/70 group hover:shadow-sm"
          >
            <Bell className="w-5 h-5 text-neutral-dark-grey group-hover:text-primary-600" />
            <span className="absolute flex items-center justify-center w-4 h-4 rounded-full shadow-sm -top-1 -right-1 bg-error">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>
          </motion.button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center p-3 space-x-3 transition-all duration-200 border border-transparent cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 group hover:border-primary-200 hover:shadow-sm"
            >
              <div className="flex items-center justify-center rounded-full shadow-sm w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-neutral-black group-hover:text-primary-700">
                  {user?.full_name || "Pre-Mentor"}
                </p>
                <p className="text-xs font-medium text-neutral-grey">
                  Pre-Mentor
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-neutral-grey transition-transform duration-200",
                  showUserDropdown && "rotate-180"
                )}
              />
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-50 py-2 mt-2 bg-white border shadow-lg w-80 rounded-xl border-neutral-silver-900"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-neutral-silver/30">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-gradient-to-br from-primary-400 to-primary-600">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-black">
                          {user?.full_name || "Pre-Mentor"}
                        </h3>
                        <p className="text-sm text-neutral-grey">
                          {user?.email || "prementor@university.edu"}
                        </p>
                        <p className="text-xs text-neutral-grey">
                          Pre-Mentor
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="px-4 py-3 border-b border-neutral-silver">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-grey">Mentor ID:</span>
                        <span className="font-medium text-neutral-black">
                          {user?.id || "PM001"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-grey">Specialization:</span>
                        <span className="font-medium text-neutral-black">
                          General Tutoring
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-grey">Status:</span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = "/pre-mentor/profile";
                      }}
                      className="flex items-center w-full px-4 py-2 space-x-3 text-sm transition-colors duration-200 text-neutral-black hover:bg-neutral-silver/50"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = "/pre-mentor/settings";
                      }}
                      className="flex items-center w-full px-4 py-2 space-x-3 text-sm transition-colors duration-200 text-neutral-black hover:bg-neutral-silver/50"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-neutral-silver/30">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 space-x-3 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </motion.header>
  );
}