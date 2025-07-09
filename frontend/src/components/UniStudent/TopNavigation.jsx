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
import { Chat, CompactCalendar } from "../../components/UniStudent";


export default function TopNavigation({ onMenuClick }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const location = useLocation();

  // Function to get page name from current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return "Dashboard";
      case "/mentoring":
        return "Mentoring";
      case "/tutoring":
        return "Tutoring";
      case "/courses":
        return "Pre-Uni Courses";
      case "/resources":
        return "Resources";
      case "/calendar":
        return "Calendar";
      case "/earnings":
        return "Earnings";
      case "/feedback":
        return "Feedback";
      case "/profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  // Function to get page description
  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return "Track your progress and manage activities";
      case "/mentoring":
        return "Guide students towards their goals";
      case "/tutoring":
        return "Help students with academic subjects";
      case "/courses":
        return "Manage pre-university course offerings";
      case "/resources":
        return "Access and share educational materials";
      case "/calendar":
        return "Manage your schedule and appointments";
      case "/earnings":
        return "View your earnings and payments";
      case "/feedback":
        return "Review student feedback and ratings";
      case "/profile":
        return "Manage your account and preferences";
      default:
        return "Track your progress and manage activities";
    }
  };

  return (
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
            {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-grey" />
            <input
              type="text"
              placeholder="Search students, courses, resources..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "w-full pl-12 pr-4 py-3 bg-neutral-silver/50 rounded-xl border-2 border-transparent",
                "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white focus:border-primary-300",
                "placeholder:text-neutral-grey text-neutral-black transition-all duration-300 font-medium",
                "hover:bg-neutral-silver/70 hover:shadow-sm"
              )}
            /> */}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCalendar(true)}
            className="p-3 rounded-xl hover:bg-neutral-silver/70 transition-all duration-200 group hover:shadow-sm"
          >
            <Calendar className="w-5 h-5 text-neutral-dark-grey group-hover:text-primary-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(true)}
            className="relative p-3 rounded-xl hover:bg-neutral-silver/70 transition-all duration-200 group hover:shadow-sm"
          >
            <MessageCircle className="w-5 h-5 text-neutral-dark-grey group-hover:text-primary-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xs text-white font-bold">3</span>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 rounded-xl hover:bg-neutral-silver/70 transition-all duration-200 group hover:shadow-sm"
          >
            <Bell className="w-5 h-5 text-neutral-dark-grey group-hover:text-primary-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full flex items-center justify-center shadow-sm">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>
          </motion.button>

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
                Student Mentor
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
  );
}
