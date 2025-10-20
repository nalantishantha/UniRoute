import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Edit3,
  Save,
  X,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Star,
  Users,
  BookOpen,
  Award,
  Camera,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { counsellorAPI } from "../../../utils/counsellorAPI";
import { getCurrentUser } from "../../../utils/auth";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError('User not authenticated');
          return;
        }

        setUser(currentUser);
        const response = await counsellorAPI.getProfile(currentUser.user_id);

        if (response.success) {
          setFormData(response.profile);
        } else {
          setError(response.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "professional", label: "Professional", icon: Award },
    // { id: "preferences", label: "Counselling", icon: Users },
    // { id: "availability", label: "Availability", icon: Clock },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await counsellorAPI.updateProfile(user.user_id, formData);

      if (response.success) {
        setIsEditing(false);
        // Update formData with response data if needed
        if (response.profile) {
          setFormData(prevData => ({ ...prevData, ...response.profile }));
        }
        alert('Profile updated successfully!');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data if needed - for now we'll just exit edit mode
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          <p className="text-neutral-grey">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.user_id) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-black">My Profile</h1>
          <p className="text-neutral-grey">Manage your counsellor profile and preferences</p>
        </div>
        <div className="flex items-center mt-4 space-x-3 lg:mt-0">
          {error && (
            <div className="p-2 text-sm text-red-600 rounded-lg bg-red-50">
              {error}
            </div>
          )}
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 overflow-hidden rounded-xl bg-neutral-silver">
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    alt={formData.full_name || 'Counsellor'}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-16 h-16 text-neutral-grey" />
                )}
              </div>
              {isEditing && (
                <button className="absolute flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full bottom-2 right-2 bg-primary-600 hover:bg-primary-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-black">
                    {formData.full_name || 'Counsellor Name'}
                  </h2>
                  <p className="mt-1 text-neutral-grey">
                    {formData.bio || 'Professional counsellor dedicated to student success'}
                  </p>
                  <div className="flex items-center mt-4 space-x-4 text-sm text-neutral-grey">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location || 'Location not set'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined {formData.created_at ?
                          new Date(formData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
                          'Recently'
                        }
                      </span>
                    </div>
                    {formData.experience_years && (
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{formData.experience_years} years experience</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-grey">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${formData.available_for_sessions ?
                      'text-green-800 bg-green-100' :
                      'text-red-800 bg-red-100'
                      }`}>
                      {formData.available_for_sessions ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex -mb-4 space-x-1 border-b border-neutral-silver">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-grey hover:text-neutral-black"
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Personal Information */}
          {activeTab === "personal" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    disabled={true} // Email should not be editable
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_number || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('contact_number', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Gender
                  </label>
                  <select
                    value={formData.gender || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    disabled={true} // Username should not be editable
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-neutral-black">
                  Bio
                </label>
                <textarea
                  rows="4"
                  value={formData.bio || ''}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell students about yourself, your background, and your counselling approach..."
                  className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                />
              </div>
            </motion.div>
          )}

          {/* Professional Information */}
          {activeTab === "professional" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience_years || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || null)}
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Hourly Rate (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourly_rate || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || null)}
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-neutral-black">
                  Qualifications
                </label>
                <textarea
                  rows="3"
                  value={formData.qualifications || ''}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  placeholder="List your educational qualifications, certifications, and degrees..."
                  className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-neutral-black">
                  Expertise Areas
                </label>
                <textarea
                  rows="3"
                  value={formData.expertise || ''}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('expertise', e.target.value)}
                  placeholder="Describe your areas of expertise and specialized knowledge..."
                  className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-neutral-black">
                  Specializations
                </label>
                <textarea
                  rows="3"
                  value={formData.specializations || ''}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('specializations', e.target.value)}
                  placeholder="Specify your counselling specializations (e.g., Career guidance, Academic planning, University admissions)..."
                  className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:bg-neutral-silver disabled:text-neutral-grey"
                />
              </div>
            </motion.div>
          )}

          {/* Counselling Preferences */}
          {/* {activeTab === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-neutral-black">
                    Available for New Sessions
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.available_for_sessions || false}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('available_for_sessions', e.target.checked)}
                      className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-grey">
                      {formData.available_for_sessions ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-grey">
                  Toggle this setting to control whether students can book new counselling sessions with you.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg border-neutral-light-grey bg-neutral-silver/20">
                <h4 className="mb-2 font-medium text-neutral-black">Session Information</h4>
                <div className="space-y-2 text-sm text-neutral-grey">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-medium text-neutral-black">
                      {formData.experience_years ? `${formData.experience_years} years` : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span className="font-medium text-neutral-black">
                      {formData.hourly_rate ? `$${formData.hourly_rate}` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      formData.is_verified ? 
                        'text-green-800 bg-green-100' : 
                        'text-yellow-800 bg-yellow-100'
                    }`}>
                      {formData.is_verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )} */}

          {/* Availability */}
          {/* {activeTab === "availability" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="mb-4 font-medium text-neutral-black">Weekly Availability</h4>
                {formData.availability && formData.availability.length > 0 ? (
                  <div className="space-y-3">
                    {formData.availability.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-neutral-light-grey">
                        <div>
                          <span className="font-medium text-neutral-black">{slot.day_name}</span>
                          <span className="ml-2 text-sm text-neutral-grey">
                            {slot.start_time} - {slot.end_time}
                          </span>
                        </div>
                        <Clock className="w-4 h-4 text-neutral-grey" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border rounded-lg border-neutral-light-grey bg-neutral-silver/20">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-neutral-grey" />
                    <p className="text-neutral-grey">No availability schedule set</p>
                    <p className="text-sm text-neutral-grey">
                      Set your weekly availability to help students book sessions with you.
                    </p>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div className="text-sm text-neutral-grey">
                  <p>💡 To manage your detailed availability schedule, please use the Calendar page.</p>
                </div>
              )}
            </motion.div>
          )} */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
