import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  User,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { cn } from "../../utils/cn";
import Chat from "../UniStudents/CompactCalendar";
import CompactCalendar from "../UniStudents/CompactCalendar";

export default function CompanyDashboardNavbar({ onMenuClick, sidebarExpanded }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const location = useLocation();

  // Function to get page name from current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case "/company/dashboard":
        return "Dashboard";
      case "/company/internship":
        return "Internships";
      case "/company/course":
        return "Courses";
      case "/company/announcement":
        return "Announcements";
      default:
        return "Dashboard";
    }
  };

  // Function to get page description
  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case "/company/dashboard":
        return "Track your company progress and manage activities";
      case "/company/internship":
        return "Manage and publish internship opportunities";
      case "/company/course":
        return "Manage company courses";
      case "/company/announcement":
        return "Publish and manage company announcements";
      default:
        return "Track your company progress and manage activities";
    }
  };

  return (
    <header
      className={`company-dashboard-navbar ${
        sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b-2 border-neutral-silver/50 shadow-md sticky top-0 z-30 backdrop-blur-sm"
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
              <h2 className="text-2xl font-bold text-neutral-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {getPageName()}
              </h2>
              <p className="text-sm text-neutral-grey font-medium">
                {getPageDescription()}
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div
              className={cn(
                "relative w-full transition-all duration-300",
                searchFocused && "transform scale-105"
              )}
            >
              {/* Search input can be added here if needed */}
            </div>
          </div>

          <div className="flex items-center space-x-4">



            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-200 cursor-pointer group border border-transparent hover:border-primary-200 hover:shadow-sm"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-neutral-black group-hover:text-primary-700">
                  Alex Johnson
                </p>
                <p className="text-xs text-neutral-grey font-medium">
                  Company Admin
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chat Component */}
        <Chat isOpen={showChat} onClose={() => setShowChat(false)} />

        {/* Compact Calendar Component */}
        <CompactCalendar
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
        />
      </motion.header>
    </header>
  );
}