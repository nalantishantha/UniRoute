import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  BookOpen,
  LogOut,
  X,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "../../utils/cn";
import logo from "../../assets/logo.png";


// CHANGED: Navigation for UNIVERSITY USERS - Updated paths to match routes
const navigation = [
  {
    name: "Dashboard",
    href: "/university/dashboarduser", // ✅ This matches the route
    icon: LayoutDashboard,
  },
  {
    name: "Manage Portfolio",
    href: "/university/manage-portfolio-user", // CHANGED: Added hyphens to match route
    icon: FolderOpen,
  },
  {
    name: "Announcement",
    href: "/university/announcement-user", // CHANGED: Added hyphens to match route
    icon: MessageSquare,
  },
  {
    name: "Academic Content",
    href: "/university/academic-content-user", // CHANGED: Added hyphens to match route
    icon: BookOpen,
  },
  // NOTE: NO "Publish Ad" menu item for university users
];

export default function UniversityUserSidebar({ isOpen, setIsOpen }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

   const handleLogout = async () => {
   localStorage.removeItem("token");
   navigate("/login"); // Redirect to university login
  };

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
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
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
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-primary-900 to-primary-800 shadow-2xl z-50"
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
                <p className="text-sm text-primary-200">University Student</p> {/* CHANGED: Different subtitle */}
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
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-secondary to-warning text-primary-900 shadow-lg"
                          : "text-primary-100 hover:bg-primary-700/50 hover:text-white"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={cn(
                          "w-5 h-5 mr-3 transition-transform duration-200",
                          isActive ? "scale-110" : "group-hover:scale-110"
                        )} />
                        {item.name}
                        {isActive && (
                          <motion.div
                            className="absolute right-3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        )}
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
              onClick={handleLogout}
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