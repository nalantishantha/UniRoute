import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import { getCurrentUser } from "../../utils/auth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Loader2,
  Upload,
  X
} from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    bio: '',
    contact_number: '',
    location: '',
    gender: '',
    current_stage: '',
    district: '',
    school: '',
    profile_picture: ''
  });

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = getCurrentUser();
      
      console.log('Current user:', currentUser);
      
      if (!currentUser || !currentUser.user_id) {
        setError('User not authenticated');
        return;
      }

      console.log('Fetching profile for user:', currentUser.user_id);
      const response = await fetch(`http://127.0.0.1:8000/api/students/profile/?user_id=${currentUser.user_id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Profile data received:', data);

      if (data.success) {
        setFormData({
          username: data.student_data.username || '',
          email: data.student_data.email || '',
          full_name: data.student_data.full_name || '',
          bio: data.student_data.bio || '',
          contact_number: data.student_data.contact_number || '',
          location: data.student_data.location || '',
          gender: data.student_data.gender || '',
          current_stage: data.student_data.current_stage || '',
          district: data.student_data.district || '',
          school: data.student_data.school || '',
          profile_picture: data.student_data.profile_picture || ''
        });
        
        // Set profile image preview
        if (data.student_data.profile_picture) {
          const imageUrl = data.student_data.profile_picture.startsWith('http') 
            ? data.student_data.profile_picture 
            : `http://127.0.0.1:8000${data.student_data.profile_picture}`;
          setProfileImagePreview(imageUrl);
        }
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload JPEG, PNG, or GIF images only.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Please upload images smaller than 5MB.');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setProfileImagePreview(formData.profile_picture ? 
      `http://127.0.0.1:8000/media/${formData.profile_picture}` : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const currentUser = getCurrentUser();
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('user_id', currentUser.user_id);
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] && key !== 'profile_picture') {
          submitData.append(key, formData[key]);
        }
      });

      // Add profile picture if selected
      if (selectedFile) {
        submitData.append('profile_picture', selectedFile);
      }

      const response = await fetch('http://127.0.0.1:8000/api/students/profile/update/', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        
        // Dispatch event to notify ProfilePage to refresh
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        
        setTimeout(() => {
          navigate('/student/profile');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
        <StudentNavigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400 mx-auto mb-4" />
            <p className="text-primary-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
        <StudentNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-600 font-semibold mb-2">Error loading profile</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchCurrentProfile}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      <StudentNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/profile')}
            className="flex items-center space-x-2 text-primary-400 hover:text-primary-500 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Profile</span>
          </button>
          
          <div className="text-center">
            <h1 className="font-display font-bold text-4xl text-primary-400 mb-4">
              Edit Profile
            </h1>
            <p className="text-xl text-primary-300">
              Update your personal information and academic details
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">✓ Profile updated successfully! Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
          {/* Profile Picture Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-primary-400 mb-4 flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <span>Profile Picture</span>
            </h3>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Profile Image Preview */}
              <div className="relative">
                <img
                  src={profileImagePreview || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Upload Button */}
              <label className="cursor-pointer bg-primary-400 text-white px-6 py-3 rounded-lg hover:bg-primary-500 transition-colors inline-flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Choose Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500">JPEG, PNG, or GIF. Max size: 5MB</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-primary-400 mb-4 flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-primary-400 mb-4 flex items-center space-x-2">
              <MapPin className="h-6 w-6" />
              <span>Academic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  Current Stage
                </label>
                <select
                  name="current_stage"
                  value={formData.current_stage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select Stage</option>
                  <option value="O/L">O/L</option>
                  <option value="A/L">A/L</option>
                  <option value="PostA/L">Post A/L</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter district"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-400 mb-2">
                  School
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter school name"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/student/profile')}
              className="px-6 py-3 border border-accent-200 text-primary-400 rounded-lg hover:bg-accent-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-400 text-white px-8 py-3 rounded-lg hover:bg-primary-500 transition-colors inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
