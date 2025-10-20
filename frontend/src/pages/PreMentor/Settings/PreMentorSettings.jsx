import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, DollarSign, Bell, Shield, Save } from "lucide-react";

export default function PreMentorSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || user.user_type !== 'pre_mentor') {
        throw new Error('Invalid user type or user not found');
      }

      const response = await fetch(
        `http://localhost:8000/api/pre-mentors/settings/?user_id=${user.user_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const result = await response.json();

      if (result.success) {
        setSettings(result.settings);
        setFormData(result.settings);
      } else {
        throw new Error(result.message || 'Failed to load settings');
      }
    } catch (err) {
      console.error('Settings error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(
        'http://localhost:8000/api/pre-mentors/settings/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.user_id,
            ...formData
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();

      if (result.success) {
        setSettings(formData);
        alert('Settings updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Update settings error:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium mb-2">Error Loading Settings</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button
          onClick={fetchSettings}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your pre-mentor account preferences and configurations</p>
      </div>

      {/* Tutoring Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <DollarSign className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Tutoring Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.hourly_rate || ''}
              onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your hourly rate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability Status
            </label>
            <select
              value={formData.is_available ? 'true' : 'false'}
              onChange={(e) => handleInputChange('is_available', e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="true">Available for Tutoring</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Specializations
          </label>
          <textarea
            value={formData.specializations || ''}
            onChange={(e) => handleInputChange('specializations', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="List your subject specializations (e.g., Mathematics, Physics, Chemistry, Biology)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple subjects with commas
          </p>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <Bell className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive booking confirmations and updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.email_notifications || false}
                onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-500">Receive text messages for urgent updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sms_notifications || false}
                onChange={(e) => handleInputChange('sms_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto-Accept Bookings</p>
              <p className="text-xs text-gray-500">Automatically accept session booking requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.auto_accept_bookings || false}
                onChange={(e) => handleInputChange('auto_accept_bookings', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
        </div>

        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
              <span className="text-sm text-blue-600">Change</span>
            </div>
          </button>

          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security</p>
              </div>
              <span className="text-sm text-gray-500">Not Enabled</span>
            </div>
          </button>

          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Privacy Settings</p>
                <p className="text-xs text-gray-500">Manage profile visibility and data sharing</p>
              </div>
              <span className="text-sm text-blue-600">Manage</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </motion.div>
    </div>
  );
}