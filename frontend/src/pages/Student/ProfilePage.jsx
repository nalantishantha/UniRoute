import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import { getCurrentUser } from "../../utils/auth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Edit,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";

const ProfilePage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
    
    // Listen for profile update events
    const handleProfileUpdate = () => {
      console.log('Profile updated, refreshing data...');
      fetchStudentProfile();
    };
    
    // Listen for page visibility changes (when user comes back to tab/page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing data...');
        fetchStudentProfile();
      }
    };
    // Listen for storage events so profile changes in other tabs/components refresh this view
    const handleStorage = (e) => {
      // If relevant profile keys were changed, refresh
      const keysToWatch = ['user', 'student_profile', 'profileUpdated'];
      if (!e.key) return; // ignore clear() events
      if (keysToWatch.includes(e.key)) {
        console.log('Storage change detected for', e.key, 'refreshing profile...');
        fetchStudentProfile();
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorage);

    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.user_id) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      console.log('Fetching profile for user:', currentUser.user_id);

      const response = await fetch(`http://127.0.0.1:8000/api/students/profile/?user_id=${currentUser.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);

      if (data.success) {
        // Process the data for display
        const processedData = {
          ...data.student_data,
          name: data.student_data.full_name || data.student_data.username || 'Student Name',
          profileImage: data.student_data.profile_picture 
            ? (data.student_data.profile_picture.startsWith('http') 
                ? `${data.student_data.profile_picture}?t=${Date.now()}` 
                : `http://127.0.0.1:8000/media/${data.student_data.profile_picture}?t=${Date.now()}`)
            : "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
          phone: data.student_data.contact_number,
          // Add default values for fields that might not exist yet
          subjects: [], // You'll need to fetch this from another table if you have it
          interests: [], // You'll need to fetch this from another table if you have it
          zScore: null, // You'll need to fetch this from AL results if you have it
          alStream: "", // You'll need to fetch this from AL students table
          alYear: "", // You'll need to fetch this from AL students table
        };
        
        setStudentData(processedData);
      } else {
        setError(data.message || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      setError('Failed to connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
        <StudentNavigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-400 mx-auto mb-4" />
              <p className="text-primary-400 text-lg">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
        <StudentNavigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load Profile</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchStudentProfile}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
        <StudentNavigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">No Profile Data Found</h3>
            <p className="text-yellow-600 mb-4">Your profile information is not available.</p>
            <Link 
              to="/student/profile-setup"
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Set Up Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-primary-400 mb-4">
            My Profile
          </h1>
          <p className="text-xl text-primary-300">
            Manage your personal information and academic details
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-primary-500 px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={studentData.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                />
                <Link
                  to="/student/edit-profile"
                  className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors shadow-md border border-white/30"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left text-white">
                <h2 className="font-display font-bold text-3xl mb-2">
                  {studentData.name}
                </h2>
                <p className="text-white/90 text-lg mb-1">
                  {studentData.current_stage || 'Student'}
                </p>
                {(studentData.school || studentData.district) && (
                  <p className="text-white/80 text-sm mb-4">
                    {studentData.school}
                    {studentData.district && ` • ${studentData.district}`}
                  </p>
                )}

                {/* Status Badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30">
                    <span className="font-semibold">
                      Status: {studentData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {/* {studentData.is_verified && (
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30">
                      <Award className="h-4 w-4 mr-2" />
                      <span className="font-semibold">Verified</span>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Edit Button */}
              <div className="lg:self-start">
                <Link
                  to="/student/edit-profile"
                  className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2 font-medium border border-white/30"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8">
            <h3 className="font-semibold text-primary-400 text-lg mb-6">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studentData.email && (
                <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                  <Mail className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-primary-300 text-sm">Email</p>
                    <p className="text-primary-400 font-medium text-sm">
                      {studentData.email}
                    </p>
                  </div>
                </div>
              )}
              
              {(studentData.phone || studentData.contact_number) && (
                <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                  <Phone className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-primary-300 text-sm">Phone</p>
                    <p className="text-primary-400 font-medium text-sm">
                      {studentData.phone || studentData.contact_number}
                    </p>
                  </div>
                </div>
              )}
              
              {(studentData.district || studentData.location) && (
                <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                  <MapPin className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-primary-300 text-sm">Location</p>
                    <p className="text-primary-400 font-medium text-sm">
                      {studentData.location || studentData.district || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
              
              {studentData.created_at && (
                <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                  <Calendar className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-primary-300 text-sm">Joined</p>
                    <p className="text-primary-400 font-medium text-sm">
                      {new Date(studentData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-semibold text-primary-400 text-xl mb-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Academic Information</span>
            </h3>

            <div className="space-y-6">
              {/* Education Stage */}
              {studentData.current_stage && (
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <h4 className="text-primary-400 font-medium mb-2">Education Level</h4>
                  <p className="text-primary-300">{studentData.current_stage}</p>
                </div>
              )}

              {/* School Info */}
              {studentData.school && (
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <h4 className="text-primary-400 font-medium mb-2">School</h4>
                  <p className="text-primary-300">{studentData.school}</p>
                </div>
              )}

              {/* District */}
              {studentData.district && (
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <h4 className="text-primary-400 font-medium mb-2">District</h4>
                  <p className="text-primary-300">{studentData.district}</p>
                </div>
              )}

              {/* A/L Subjects - This would need to be fetched from a separate subjects table */}
              {/* For now, we'll show a placeholder or remove this section since it's not in your current tables */}
              
              {/* Username */}
              {studentData.username && (
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <h4 className="text-primary-400 font-medium mb-2">Username</h4>
                  <p className="text-primary-300">{studentData.username}</p>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-semibold text-primary-400 text-xl mb-6 flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Personal Information</span>
            </h3>

            <div className="space-y-6">
              {/* Bio */}
              {studentData.bio && (
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <h4 className="text-primary-400 font-medium mb-2">Bio</h4>
                  <p className="text-primary-300">{studentData.bio}</p>
                </div>
              )}

              {/* Gender */}
              {studentData.gender && (
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <h4 className="text-primary-400 font-medium mb-2">Gender</h4>
                  <p className="text-primary-300">{studentData.gender}</p>
                </div>
              )}

              {/* User Status */}
              <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                <h4 className="text-primary-400 font-medium mb-2">Account Status</h4>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    studentData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {studentData.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {/* {studentData.is_verified && (
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      ✓ Verified
                    </span>
                  )} */}
                </div>
              </div>

              {/* Last Updated */}
              {studentData.updated_at && (
                <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                  <h4 className="text-primary-400 font-medium mb-2">Profile Last Updated</h4>
                  <p className="text-primary-300">
                    {new Date(studentData.updated_at).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Career Interests - This would need to be in a separate table */}
              {/* Removing hardcoded interests since they're not in your database tables */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
