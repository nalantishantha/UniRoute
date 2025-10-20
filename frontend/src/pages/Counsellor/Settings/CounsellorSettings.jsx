
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { getCurrentUser } from '../../../utils/auth';
import { counsellorAPI } from '../../../utils/counsellorAPI';

const CounsellorSettings = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data for password change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Delete confirmation data
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    confirmation_text: '',
    understand_consequences: false,
    backup_downloaded: false,
    alternative_admin_assigned: false
  });

  // Initialize user data
  const initializeUserData = async () => {
    try {
      setDataLoading(true);
      const user = getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Error initializing user data:', error);
      setMessage({ type: 'error', text: 'Failed to initialize settings' });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    initializeUserData();
  }, [navigate]);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteConfirmationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDeleteConfirmation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePasswordForm = () => {
    if (!passwordData.current_password) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return false;
    }
    if (!passwordData.new_password) {
      setMessage({ type: 'error', text: 'New password is required' });
      return false;
    }
    if (passwordData.new_password.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
      return false;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return false;
    }
    if (passwordData.current_password === passwordData.new_password) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await counsellorAPI.changePassword(currentUser.user_id, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Password changed successfully!'
        });

        // Clear password form
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setShowPasswordSection(false);
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to change password'
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        type: 'error',
        text: 'Failed to change password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Validate deletion requirements
    if (deleteConfirmation.confirmation_text !== 'DELETE MY ACCOUNT') {
      setMessage({
        type: 'error',
        text: 'Please type "DELETE MY ACCOUNT" to confirm deletion'
      });
      return;
    }

    if (!deleteConfirmation.understand_consequences) {
      setMessage({
        type: 'error',
        text: 'Please confirm that you understand the consequences'
      });
      return;
    }

    if (!deleteConfirmation.backup_downloaded) {
      setMessage({
        type: 'error',
        text: 'Please confirm that you have downloaded a backup'
      });
      return;
    }

    if (!deleteConfirmation.alternative_admin_assigned) {
      setMessage({
        type: 'error',
        text: 'Please confirm that you understand all data will be lost'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await counsellorAPI.deleteAccount(currentUser.user_id, {
        confirmation_text: deleteConfirmation.confirmation_text
      });

      if (response.success) {
        // Clear user data and redirect
        localStorage.removeItem('user');
        navigate('/login', {
          state: { message: 'Counsellor account has been successfully deactivated.' }
        });
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to delete account'
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete account. Please try again.'
      });
      setLoading(false);
    }
  };

  // if (dataLoading) {
  //   return (
  //     <StudentLayout pageTitle="Admin Settings" pageDescription="Manage your account and system preferences">
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="flex items-center space-x-3">
  //           <RefreshCw className="h-6 w-6 animate-spin text-[#1D5D9B]" />
  //           <span className="text-[#717171]">Loading admin details...</span>
  //         </div>
  //       </div>
  //     </StudentLayout>
  //   );
  // }

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-[#1D5D9B]" />
          <span className="text-[#717171]">Loading counsellor settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2 space-x-3">
          <Settings className="h-8 w-8 text-[#1D5D9B]" />
          <h1 className="text-3xl font-bold text-[#263238]">Counsellor Settings</h1>
        </div>
        <p className="text-[#717171]">Manage your account and counselling preferences</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${message.type === 'success'
          ? 'bg-[#81C784]/10 border border-[#81C784]/20'
          : 'bg-[#E57373]/10 border border-[#E57373]/20'
          }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-[#81C784]" />
          ) : (
            <AlertCircle className="h-5 w-5 text-[#E57373]" />
          )}
          <span className={`text-sm font-medium ${message.type === 'success' ? 'text-[#81C784]' : 'text-[#E57373]'
            }`}>
            {message.text}
          </span>
        </div>
      )}

      <div className="space-y-8">
        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6 text-[#1D5D9B]" />
              <h2 className="text-2xl font-bold text-[#263238]">Change Password</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors"
            >
              {showPasswordSection ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordInputChange}
                    className="w-full pl-12 pr-12 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#263238]"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#717171] mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-12 pr-12 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#263238]"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#717171] mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-12 pr-12 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#263238]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-[#E7F3FB]">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E57373] p-8">
          <div className="flex items-center mb-6 space-x-3">
            <AlertTriangle className="h-6 w-6 text-[#E57373]" />
            <h2 className="text-2xl font-bold text-[#E57373]">Danger Zone</h2>
          </div>

          <div className="bg-[#E57373]/5 border border-[#E57373]/20 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#E57373] mb-3">⚠️ Critical Warning</h3>
            <div className="space-y-2 text-sm text-[#717171]">
              <p>• Deleting your counsellor account is <strong>IRREVERSIBLE</strong></p>
              <p>• All your personal data and counselling history will be permanently lost</p>
              <p>• You will lose access to all counselling functionalities</p>
              <p>• All your upcoming sessions will be cancelled</p>
              <p>• Students will no longer be able to book sessions with you</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#717171] mb-2">
                Type "DELETE MY ACCOUNT" to confirm *
              </label>
              <input
                type="text"
                name="confirmation_text"
                value={deleteConfirmation.confirmation_text}
                onChange={handleDeleteConfirmationChange}
                className="w-full px-4 py-3 border border-[#E57373] rounded-lg focus:ring-2 focus:ring-[#E57373] focus:border-transparent"
                placeholder="Type: DELETE MY ACCOUNT"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="understand_consequences"
                  checked={deleteConfirmation.understand_consequences}
                  onChange={handleDeleteConfirmationChange}
                  className="h-4 w-4 text-[#E57373] border-[#E57373] rounded focus:ring-[#E57373] mt-1"
                />
                <div>
                  <span className="text-sm font-medium text-[#263238]">I understand the consequences</span>
                  <p className="text-xs text-[#717171]">I acknowledge that this action cannot be undone</p>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="backup_downloaded"
                  checked={deleteConfirmation.backup_downloaded}
                  onChange={handleDeleteConfirmationChange}
                  className="h-4 w-4 text-[#E57373] border-[#E57373] rounded focus:ring-[#E57373] mt-1"
                />
                <div>
                  <span className="text-sm font-medium text-[#263238]">I have backed up important data</span>
                  <p className="text-xs text-[#717171]">I have saved any important information</p>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="alternative_admin_assigned"
                  checked={deleteConfirmation.alternative_admin_assigned}
                  onChange={handleDeleteConfirmationChange}
                  className="h-4 w-4 text-[#E57373] border-[#E57373] rounded focus:ring-[#E57373] mt-1"
                />
                <div>
                  <span className="text-sm font-medium text-[#263238]">I understand all data will be lost</span>
                  <p className="text-xs text-[#717171]">All counselling sessions, student records, and personal data will be permanently deleted</p>
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-6 border-t border-[#E7F3FB]">
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={
                  deleteConfirmation.confirmation_text !== 'DELETE MY ACCOUNT' ||
                  !deleteConfirmation.understand_consequences ||
                  !deleteConfirmation.backup_downloaded ||
                  !deleteConfirmation.alternative_admin_assigned
                }
                className="flex items-center space-x-2 px-6 py-3 bg-[#E57373] text-white rounded-lg hover:bg-[#C94A4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
            <div className="text-center">
              <div className="bg-[#E57373]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-[#E57373]" />
              </div>
              <h2 className="text-2xl font-bold text-[#263238] mb-4">Final Confirmation</h2>
              <p className="text-[#717171] mb-6">
                This is your last chance to cancel. Once you proceed, your counsellor account will be
                <strong className="text-[#E57373]"> permanently deactivated</strong> and cannot be recovered.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border border-[#C1DBF4] text-[#717171] rounded-lg hover:bg-[#F5F7FA] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#E57373] text-white rounded-lg hover:bg-[#C94A4A] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Deleting...' : 'Delete Forever'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellorSettings;

