import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Book, DollarSign, Save, Edit } from "lucide-react";

export default function PreMentorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || user.user_type !== 'pre_mentor') {
        throw new Error('Invalid user type or user not found');
      }

      const response = await fetch(
        `http://localhost:8000/api/pre-mentors/profile/?user_id=${user.user_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();
      
      if (result.success) {
        setProfile(result.profile);
        setFormData(result.profile);
      } else {
        throw new Error(result.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Profile error:', err);
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
        'http://localhost:8000/api/pre-mentors/profile/',
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
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      
      if (result.success) {
        setProfile(formData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
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
        <div className="text-red-600 text-lg font-medium mb-2">Error Loading Profile</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button
          onClick={fetchProfile}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your pre-mentor profile and settings</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile?.full_name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profile?.email || 'Not provided'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.contact_number || ''}
                    onChange={(e) => handleInputChange('contact_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile?.contact_number || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile?.location || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell students about yourself..."
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                  {profile?.bio || 'No bio provided'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Pre-mentor Specific Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pre-mentor Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate || ''}
                    onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">${(profile?.hourly_rate || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.experience_years || ''}
                    onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center">
                    <Book className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile?.experience_years || 0} years</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              {isEditing ? (
                <textarea
                  value={formData.specializations || ''}
                  onChange={(e) => handleInputChange('specializations', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List your subject specializations (e.g., Mathematics, Physics, Chemistry)"
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {profile?.specializations || 'No specializations listed'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Save Button */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Sessions</span>
                <span className="font-semibold text-gray-900">{profile?.total_sessions || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900">{(profile?.rating || 0).toFixed(1)}</span>
                  <span className="text-yellow-500 ml-1">★</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  profile?.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profile?.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verification</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  profile?.is_verified 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile?.is_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* University Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">University Information</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Registration Number:</span>
                <div className="font-medium text-gray-900 mt-1">
                  {profile?.university_info?.registration_number || 'Not available'}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Year of Study:</span>
                <div className="font-medium text-gray-900 mt-1">
                  Year {profile?.university_info?.year_of_study || 'N/A'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}