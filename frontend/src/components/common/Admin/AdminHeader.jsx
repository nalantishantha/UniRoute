import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  User,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';

const AdminHeader = ({ toggleSidebar, user, handleLogout, pageTitle, pageDescription }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-[#E7F3FB]">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F5F7FA] transition-colors"
          >
            <Menu className="h-6 w-6 text-[#263238]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#263238]">{pageTitle}</h1>
            {pageDescription && (
              <p className="text-sm text-[#717171]">{pageDescription}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#717171]" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
            />
          </div>

          {/* Notification Button */}
          <button
            onClick={() => setShowNotificationModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Notify</span>
          </button>

          {/* Bell Icon */}
          <button className="relative p-2 text-[#717171] hover:text-[#263238] hover:bg-[#F5F7FA] rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-[#E57373] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#F5F7FA] transition-colors"
            >
              <div className="bg-[#E7F3FB] p-2 rounded-lg">
                <User className="h-4 w-4 text-[#1D5D9B]" />
              </div>
              <ChevronDown className="h-4 w-4 text-[#717171]" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#C1DBF4] py-2">
                <div className="px-4 py-2 border-b border-[#E7F3FB]">
                  <p className="text-sm font-medium text-[#263238]">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-[#717171]">{user?.email}</p>
                </div>
                <Link
                  to="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-[#717171] hover:bg-[#F5F7FA]"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-[#717171] hover:bg-[#F5F7FA]"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-[#E57373] hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;