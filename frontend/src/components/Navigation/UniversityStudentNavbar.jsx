import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useChatContext } from "../../context/ChatContext";

import {
  Menu,
  Bell,
  Search,
  User,
  MessageCircle,
  Calendar,
  LogOut,
  ChevronDown,
  Settings,
  UserCircle,
} from "lucide-react";
import { logout, getCurrentUser } from "../../utils/auth"; // ✅ Import logout function
import { cn } from "../../utils/cn";
import Chat from "../UniStudents/Chat";
import CompactCalendar from "../UniStudents/CompactCalendar";

export default function TopNavigation({ onMenuClick }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null); // ✅ Add user state
  const location = useLocation();

  // ✅ Get current user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // ✅ Handle logout with confirmation
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  // Function to get page name from current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case "/university-student/dashboard":
        return "Dashboard";
      case "/university-student/mentoring":
        return "Mentoring";
      case "/university-student/tutoring":
        return "Tutoring";
      case "/university-student/courses":
        return "Pre-Uni Courses";
      case "/university-student/resources":
        return "Resources";
      case "/university-student/calendar":
        return "Calendar";
      case "/university-student/earnings":
        return "Earnings";
      case "/university-student/feedback":
        return "Feedback";
      case "/university-student/profile":
        return "Profile";
      case "/university-student/settings":
        return "Settings";
      default:
        return "university-student/Dashboard";
    }
  };

  // Function to get page description
  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case "/university-student/dashboard":
        return "Track your progress and manage activities";
      case "/university-student/mentoring":
        return "Guide students towards their goals";
      case "/university-student/tutoring":
        return "Help students with academic subjects";
      case "/university-student/courses":
        return "Manage pre-university course offerings";
      case "/university-student/resources":
        return "Access and share educational materials";
      case "/university-student/calendar":
        return "Manage your schedule and appointments";
      case "/university-student/earnings":
        return "View your earnings and payments";
      case "/university-student/feedback":
        return "Review student feedback and ratings";
      case "/university-student/profile":
        return "Manage your account and preferences";
      case "/university-student/settings":
        return "Manage your account and preferences";
      default:
        return "Track your progress and manage activities";
    }
  };

  const { toggleChat } = useChatContext();

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
          <div
            className={cn(
              "relative w-full transition-all duration-300",
              searchFocused && "transform scale-105"
            )}
          >
            {/* Search functionality can be added here if needed */}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCalendar(true)}
            className="p-3 transition-all duration-200 rounded-xl hover:bg-neutral-silver/70 group hover:shadow-sm"
          >
            <Calendar className="w-5 h-5 text-neutral-dark-grey group-hover:text-primary-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="relative p-2 transition-colors duration-200 rounded-lg text-primary-400 hover:text-primary-600 hover:bg-primary-50"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-green-500 rounded-full -top-1 -right-1">
              2
            </span>
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
                  {user
                    ? `${user.first_name} ${user.last_name || ""}`.trim()
                    : "University Student"}
                </p>
                <p className="text-xs font-medium text-neutral-grey">
                  {user?.university || "Student Mentor"}
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
                          {user
                            ? `${user.first_name} ${user.last_name || ""
                              }`.trim()
                            : "University Student"}
                        </h3>
                        <p className="text-sm text-neutral-grey">
                          {user?.email || "student@university.edu"}
                        </p>
                        <p className="text-xs text-neutral-grey">
                          {user?.university || "University Student"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="px-4 py-3 border-b border-neutral-silver">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-grey">Student ID:</span>
                        <span className="font-medium text-neutral-black">
                          {user?.student_id || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-grey">Program:</span>
                        <span className="font-medium text-neutral-black">
                          {user?.program || "Computer Science"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-grey">Year:</span>
                        <span className="font-medium text-neutral-black">
                          {user?.year || "3rd Year"}
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-neutral-grey">Status:</span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Active
                        </span>
                      </div> */}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        // Navigate to profile page
                        window.location.href = "/university-student/profile";
                      }}
                      className="flex items-center w-full px-4 py-2 space-x-3 text-sm transition-colors duration-200 text-neutral-black hover:bg-neutral-silver/50"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        // Navigate to settings page
                        window.location.href = "/university-student/settings";
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

      {/* Chat Component */}
      <Chat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Compact Calendar Component */}
      <CompactCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

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
