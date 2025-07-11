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

export default function TopNavigation({ onMenuClick }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const location = useLocation();

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

// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   GraduationCap,
//   Home,
//   School2,
//   BookOpen,
//   User,
//   Calendar,
//   FileText,
//   Users,
//   Bell,
//   Menu,
//   X,
//   LogOut,
//   Award,
//   MessageSquare,
// } from "lucide-react";
// import { logout, getCurrentUser } from "../../utils/auth"; // ✅ Import logout function

// const UniversityStudentNavbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [user, setUser] = useState(null); // ✅ Add user state
//   const location = useLocation();

//   // ✅ Get current user on component mount
//   useEffect(() => {
//     const currentUser = getCurrentUser();
//     setUser(currentUser);
//   }, []);

//   const isActive = (path) => location.pathname === path;

//   // ✅ Handle logout with confirmation
//   const handleLogout = async () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       await logout();
//     }
//   };

//   const navigationItems = [
//     { path: "/university-student/dashboard", label: "Dashboard", icon: Home },
//     {
//       path: "/university-student/courses",
//       label: "My Courses",
//       icon: BookOpen,
//     },
//     { path: "/university-student/schedule", label: "Schedule", icon: Calendar },
//     {
//       path: "/university-student/assignments",
//       label: "Assignments",
//       icon: FileText,
//     },
//     { path: "/university-student/grades", label: "Grades", icon: Award },
//     { path: "/university-student/community", label: "Community", icon: Users },
//     {
//       path: "/university-student/messages",
//       label: "Messages",
//       icon: MessageSquare,
//     },
//   ];

//   return (
//     <nav className="bg-white shadow-lg border-b border-primary-200 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo Section */}
//           <div className="flex items-center space-x-3">
//             <Link
//               to="/university-student/dashboard"
//               className="flex items-center space-x-2"
//             >
//               <GraduationCap className="h-8 w-8 text-primary-500" />
//               <span className="font-bold text-2xl text-primary-600">
//                 UniRoute
//               </span>
//             </Link>
//             <div className="hidden md:block">
//               <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
//                 University Student
//               </span>
//             </div>
//           </div>

//           {/* University Info */}
//           <div className="hidden lg:flex items-center space-x-2">
//             <School2 className="h-5 w-5 text-primary-400" />
//             <span className="text-primary-600 font-medium">
//               University of Colombo
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navigationItems.map((item) => {
//               const IconComponent = item.icon;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                     isActive(item.path)
//                       ? "bg-primary-500 text-white shadow-md"
//                       : "text-primary-400 hover:text-primary-600 hover:bg-primary-50"
//                   }`}
//                 >
//                   <IconComponent className="h-4 w-4" />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right Side - Notifications & Profile */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Notifications */}
//             <button className="relative p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
//               <Bell className="h-5 w-5" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                 5
//               </span>
//             </button>

//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button className="flex items-center space-x-2 p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
//                 <User className="h-5 w-5" />
//                 <div className="text-left">
//                   <span className="font-medium block">
//                     {user ? user.first_name : "Sarah"}{" "}
//                     {/* ✅ Show actual user name */}
//                   </span>
//                   <span className="text-xs text-primary-300">
//                     Computer Science
//                   </span>
//                 </div>
//               </button>
//             </div>

//             {/* Logout Button - Updated */}
//             <button
//               onClick={handleLogout} // ✅ Connect to logout function
//               className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
//             >
//               <LogOut className="h-4 w-4" />
//               <span className="font-medium">Logout</span>
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
//             >
//               {isMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t border-primary-200 py-4">
//             {/* University Info Mobile */}
//             <div className="flex items-center space-x-2 px-4 py-2 mb-4 bg-primary-50 rounded-lg">
//               <School2 className="h-5 w-5 text-primary-400" />
//               <span className="text-primary-600 font-medium">
//                 University of Colombo
//               </span>
//             </div>

//             <div className="space-y-2">
//               {navigationItems.map((item) => {
//                 const IconComponent = item.icon;
//                 return (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     onClick={() => setIsMenuOpen(false)}
//                     className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
//                       isActive(item.path)
//                         ? "bg-primary-500 text-white shadow-md"
//                         : "text-primary-400 hover:text-primary-600 hover:bg-primary-50"
//                     }`}
//                   >
//                     <IconComponent className="h-5 w-5" />
//                     <span>{item.label}</span>
//                   </Link>
//                 );
//               })}

//               {/* Mobile Profile & Logout */}
//               <div className="border-t border-primary-200 pt-4 mt-4 space-y-2">
//                 <div className="flex items-center space-x-3 px-4 py-3 text-primary-600">
//                   <User className="h-5 w-5" />
//                   <div>
//                     <span className="font-medium block">
//                       {user ? user.first_name : "Sarah"}{" "}
//                       {/* ✅ Show actual user name */}
//                     </span>
//                     <span className="text-xs text-primary-300">
//                       Computer Science
//                     </span>
//                   </div>
//                   <Bell className="h-5 w-5 ml-auto" />
//                 </div>
//                 <button
//                   onClick={handleLogout} // ✅ Connect to logout function
//                   className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
//                 >
//                   <LogOut className="h-5 w-5" />
//                   <span className="font-medium">Logout</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default UniversityStudentNavbar;
