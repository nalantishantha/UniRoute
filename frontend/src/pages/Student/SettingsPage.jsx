import React from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Eye,
  Globe,
  Mail,
  Lock,
  User,
  LogOut,
} from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-primary-400 mb-4">
            Settings
          </h1>
          <p className="text-xl text-primary-300">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-6 flex items-center space-x-2">
              <Bell className="h-6 w-6" />
              <span>Notification Settings</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary-400">
                    Email Notifications
                  </h4>
                  <p className="text-primary-300 text-sm">
                    Receive updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary-400">
                    Mentor Messages
                  </h4>
                  <p className="text-primary-300 text-sm">
                    Get notified when mentors send messages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary-400">
                    University News
                  </h4>
                  <p className="text-primary-300 text-sm">
                    Stay updated with university announcements
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-6 flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>Privacy Settings</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary-400">
                    Profile Visibility
                  </h4>
                  <p className="text-primary-300 text-sm">
                    Control who can see your profile
                  </p>
                </div>
                <select className="border border-accent-100 rounded-lg px-3 py-2 text-primary-400">
                  <option>Public</option>
                  <option>Mentors Only</option>
                  <option>Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary-400">
                    Contact Information
                  </h4>
                  <p className="text-primary-300 text-sm">
                    Show email and phone to mentors
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-6 flex items-center space-x-2">
              <Settings className="h-6 w-6" />
              <span>Account Settings</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary-300" />
                  <div>
                    <h4 className="font-medium text-primary-400">
                      Change Email
                    </h4>
                    <p className="text-primary-300 text-sm">
                      kasun.perera@example.com
                    </p>
                  </div>
                </div>
                <button className="bg-accent-200 text-primary-600 px-4 py-2 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-primary-300" />
                  <div>
                    <h4 className="font-medium text-primary-400">
                      Change Password
                    </h4>
                    <p className="text-primary-300 text-sm">
                      Last changed 3 months ago
                    </p>
                  </div>
                </div>
                <button className="bg-accent-200 text-primary-600 px-4 py-2 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-primary-300" />
                  <div>
                    <h4 className="font-medium text-primary-400">Language</h4>
                    <p className="text-primary-300 text-sm">English</p>
                  </div>
                </div>
                <select className="border border-accent-100 rounded-lg px-3 py-2 text-primary-400">
                  <option>English</option>
                  <option>Sinhala</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
            <h3 className="font-display font-semibold text-2xl text-red-600 mb-6">
              Danger Zone
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-600">Delete Account</h4>
                  <p className="text-red-400 text-sm">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end mt-8">
          <button className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
