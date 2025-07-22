import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { cn } from "../../utils/cn";
import Chat from "../UniStudents/CompactCalendar";
import CompactCalendar from "../UniStudents/CompactCalendar";

export default function UniversityNavbar({ sidebarExpanded, onMenuClick }) {
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const location = useLocation();

  // Function to get page name from current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case "/university/dashboard":
        return "Dashboard";
      case "/university/announcement":
        return "Announcements";
      case "/university/academic-content":
        return "Academic Content";
      case "/university/ad-publish":
        return "Advertisement";
      case "/university/manage-portfolio":
        return "Portfolio";
      case "/university/students":
        return "Students";
      case "/university/faculty":
        return "Faculty";
      case "/university/courses":
        return "Courses";
      case "/university/events":
        return "Events";
      case "/university/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  // Function to get page description
  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case "/university/dashboard":
        return "Manage your university operations and analytics";
      case "/university/announcement":
        return "Create and manage university announcements";
      case "/university/academic-content":
        return "Manage academic content and resources";
      case "/university/ad-publish":
        return "Create and publish university advertisements";
      case "/university/manage-portfolio":
        return "Manage university portfolio and achievements";
      case "/university/students":
        return "Manage student records and information";
      case "/university/faculty":
        return "Manage faculty and staff members";
      case "/university/courses":
        return "Manage courses and academic programs";
      case "/university/events":
        return "Organize and manage university events";
      case "/university/settings":
        return "Configure university settings and preferences";
      default:
        return "Manage your university operations and analytics";
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "bg-white border-b-2 border-neutral-silver/50 shadow-md fixed top-0 z-30 backdrop-blur-sm transition-all duration-300",
        sidebarExpanded ? "left-280" : "left-80",
        "right-0"
      )}
      style={{
        left: sidebarExpanded ? '280px' : '80px'
      }}
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
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-200 cursor-pointer group border border-transparent hover:border-primary-200 hover:shadow-sm"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semi-bold text-neutral-black group-hover:text-primary-700">
              Alex Johnson
            </p>
            <p className="text-xs text-neutral-grey font-medium">
              Uni Admin
            </p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}