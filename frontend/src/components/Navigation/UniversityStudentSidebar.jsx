import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FolderOpen,
  DollarSign,
  MessageSquare,
  User,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "../../utils/cn";
import logo from "../../assets/logo.png";

const navigation = [
  {
    name: "Dashboard",
    href: "/university-student/dashboard",
    icon: LayoutDashboard,
  },
  { name: "Mentoring", href: "/university-student/mentoring", icon: Users },
  {
    name: "Tutoring",
    href: "/university-student/tutoring",
    icon: GraduationCap,
  },
  {
    name: "Pre-Uni Courses",
    href: "/university-student/courses",
    icon: BookOpen,
  },
  {
    name: "Resources",
    href: "/university-student/resources",
    icon: FolderOpen,
  },
  { name: "Calendar", href: "/university-student/calendar", icon: Calendar },
  { name: "Earnings", href: "/university-student/earnings", icon: DollarSign },
  {
    name: "Feedback",
    href: "/university-student/feedback",
    icon: MessageSquare,
  },
  { name: "Profile", href: "/university-student/profile", icon: User },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.6);
          }
        `}
      </style>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={!isDesktop ? sidebarVariants : {}}
        animate={isOpen ? "open" : "closed"}
        className={cn(
          "h-full w-72 bg-gradient-to-b from-primary-900 to-primary-800 shadow-2xl",
          isDesktop ? "relative" : "fixed top-0 left-0 z-50"
        )}
        style={{
          '--scrollbar-width': '4px',
          '--scrollbar-track': '#1e3a8a',
          '--scrollbar-thumb': '#1e40af',
          '--scrollbar-thumb-hover': '#3b82f6'
        }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary-700/50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-secondary to-warning rounded-xl overflow-hidden">
                <img
                  src={logo}
                  alt="UniRoutes Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">UniRoutes</h1>
                <p className="text-sm text-primary-200">Uni-Student Portal</p>
              </div>
            </motion.div>

            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                "p-2 rounded-lg hover:bg-primary-700 transition-colors",
                isDesktop ? "hidden" : "block"
              )}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-primary-800 scrollbar-thumb-primary-600 hover:scrollbar-thumb-primary-500 custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(59, 130, 246, 0.3) transparent',
            }}
          >
            {navigation.map((item, index) => {
              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.href}
                    onClick={() => !isDesktop && setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-secondary to-warning text-neutral-black shadow-lg"
                          : "text-primary-100 hover:bg-primary-700/50 hover:text-white"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-secondary to-warning rounded-xl"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                        <div className="relative flex items-center w-full">
                          <item.icon
                            className={cn(
                              "w-5 h-5 mr-3 transition-transform group-hover:scale-110",
                              isActive
                                ? "text-neutral-black"
                                : "text-primary-200"
                            )}
                          />
                          <span className="flex-1">{item.name}</span>
                          {isActive && (
                            <ChevronRight className="w-4 h-4 text-neutral-black" />
                          )}
                        </div>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>

          {/* Settings and Logout */}
          <div className="p-4 border-t border-primary-700/50 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-primary-100 hover:bg-primary-700/50 hover:text-white rounded-xl transition-all duration-200 group"
            >
              <Settings className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              Settings
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-primary-100 hover:bg-primary-700/50 hover:text-white rounded-xl transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              Log Out
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
