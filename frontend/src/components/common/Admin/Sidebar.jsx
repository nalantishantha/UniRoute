import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Building2,
  UserCheck,
  UserCog,
  BookOpen,
  BarChart3,
  Settings,
  User,
  X,
  LogOut,
  FileText,
  Briefcase,
  Calendar,
  Inbox,
} from "lucide-react";
import logo from "../../../assets/logo.png";

// UniRoute Logo Component
// const UniRouteLogo = () => (
//   <svg
//     width="28"
//     height="28"
//     viewBox="0 0 40 40"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <rect width="40" height="40" rx="8" fill="#F4D160" />
//     <path d="M8 12h24v16H8z" fill="#1D5D9B" />
//     <path d="M12 8h16v8H12z" fill="#75C2F6" />
//     <circle cx="20" cy="28" r="4" fill="#263238" />
//   </svg>
// );

const AdminSidebar = ({ isSidebarOpen, toggleSidebar, user, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      category: "main",
    },
    { name: "All Users", path: "/admin/users", icon: Users, category: "users" },
    {
      name: "Students",
      path: "/admin/students",
      icon: GraduationCap,
      category: "users",
    },
    {
      name: "University Students",
      path: "/admin/university-students",
      icon: GraduationCap,
      category: "users",
    },
    {
      name: "Universities",
      path: "/admin/universities",
      icon: School,
      category: "users",
    },
    {
      name: "Companies",
      path: "/admin/companies",
      icon: Building2,
      category: "users",
    },
    {
      name: "Mentors",
      path: "/admin/mentors",
      icon: UserCheck,
      category: "users",
    },
    { name: "Tutors", path: "/admin/tutors", icon: UserCog, category: "users" },
    {
      name: "Counsellors",
      path: "/admin/counsellors",
      icon: UserCheck,
      category: "users",
    },
    // {
    //   name: "Courses",
    //   path: "/admin/programs",
    //   icon: BookOpen,
    //   category: "content",
    // },
    { name: "Jobs", path: "/admin/jobs", icon: Briefcase, category: "content" },
    {
      name: "Events",
      path: "/admin/events",
      icon: Calendar,
      category: "content",
    },
    {
      name: "Requests",
      path: "/admin/requests",
      icon: Inbox,
      category: "Requests",
    },
    // {
    //   name: "Reports",
    //   path: "/admin/reports",
    //   icon: FileText,
    //   category: "Requests",
    // },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
      category: "system",
    },
  ];

  const categorizedItems = {
    main: { label: "Main", items: [] },
    users: { label: "User Management", items: [] },
    content: { label: "Content Management", items: [] },
    Requests: { label: "Requests", items: [] },
    system: { label: "System", items: [] },
  };

  menuItems.forEach((item) => {
    categorizedItems[item.category].items.push(item);
  });

  return (
    <div
      className={`fixed scrollable inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-primary-900 to-primary-800  shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-[#4D4D4D]">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-br from-secondary to-warning rounded-xl overflow-hidden">
            <img
              src={logo}
              alt="UniRoutes Logo"
              className="w-full h-full object-cover"
            />
          </div>{" "}
          <div>
            <h1 className="font-bold text-xl text-white">UniRoute</h1>
            <p className="text-sm text-primary-200">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-[#4D4D4D] transition-colors text-[#B0B0B0]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        {Object.entries(categorizedItems).map(
          ([key, category]) =>
            category.items.length > 0 && (
              <div key={key}>
                <h3 className="px-2 text-sm font-bold text-primary-200  uppercase tracking-wider mb-3">
                  {category.label}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const IconComponent = item.icon;

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-lg text-l font-medium transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-secondary to-warning text-neutral-black shadow-lg"
                            : "text-primary-100 hover:bg-primary-700/50 hover:text-white"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 mr-3 ${
                            isActive ? "text-neutral-black" : "text-primary-100"
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )
        )}
      </nav>

      {/* User Profile Footer */}
      <div className="border-t border-[#4D4D4D] p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1D5D9B] p-2 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {user?.first_name || "Admin"} {user?.last_name || "User"}
            </p>
            <p className="text-xs text-[#B0B0B0]">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-[#4D4D4D] transition-colors text-[#B0B0B0] hover:text-white"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
