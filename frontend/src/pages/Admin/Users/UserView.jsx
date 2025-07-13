import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Users,
  Edit,
  Trash2,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  MapPin,
  School,
  Building2,
  Clock,
  Activity,
  Settings,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock user data
  const mockUser = {
    id: 1,
    username: 'john.perera@gmail.com',
    email: 'john.perera@gmail.com',
    first_name: 'John',
    last_name: 'Perera',
    user_type: 'student',
    user_type_id: 1,
    is_active: true,
    contact_number: '0771234567',
    created_at: '2024-01-15T10:30:00Z',
    last_login: '2024-07-01T14:20:00Z',
    // Additional details based on user type
    student_details: {
      student_stage: 'A/L',
      school: 'Royal College, Colombo',
      district: 'Colombo',
      preferred_subjects: ['Physics', 'Chemistry', 'Mathematics'],
      grade: '12',
      stream: 'Physical Science'
    },
    activity_log: [
      {
        id: 1,
        action: 'Profile Updated',
        timestamp: '2024-07-01T14:20:00Z',
        details: 'Updated contact information'
      },
      {
        id: 2,
        action: 'Login',
        timestamp: '2024-07-01T14:15:00Z',
        details: 'Logged in from Chrome browser'
      },
      {
        id: 3,
        action: 'Course Enrolled',
        timestamp: '2024-06-28T10:30:00Z',
        details: 'Enrolled in Physics Advanced Level course'
      }
    ]
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, [id, navigate]);

  const handleDeleteUser = () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // Simulate API call
      setMessage({ type: 'success', text: 'User deleted successfully!' });
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    }
  };

  const handleToggleStatus = () => {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      setUser(prev => ({ ...prev, is_active: !prev.is_active }));
      setMessage({ 
        type: 'success', 
        text: `User ${action}d successfully!` 
      });
    }
  };

  const formatUserType = (userType) => {
    switch (userType) {
      case 'university_student':
        return 'University Student';
      case 'student':
        return 'Student';
      case 'mentor':
        return 'Mentor';
      case 'tutor':
        return 'Tutor';
      case 'admin':
        return 'Admin';
      default:
        return userType;
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'university_student':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'mentor':
        return 'bg-purple-100 text-purple-800';
      case 'tutor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="User Details">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout pageTitle="User Not Found">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
            <Link
              to="/admin/users"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="User Details">
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/users"
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to={`/admin/users/${user.id}/edit`}
                className="bg-[#1D5D9B] text-white px-4 py-2 rounded-lg hover:bg-[#174A7C] transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit User</span>
              </Link>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  user.is_active
                    ? 'bg-[#F4D160] text-[#263238] hover:bg-[#D9B23A]'
                    : 'bg-[#81C784] text-[#263238] hover:bg-[#5EA46A]'
                }`}
              >
                {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                <span>{user.is_active ? 'Deactivate' : 'Activate'}</span>
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-[#E57373] text-white px-4 py-2 rounded-lg hover:bg-[#C94A4A] transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 mb-3">{user.email}</p>
                <div className="flex justify-center mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getUserTypeColor(user.user_type)}`}>
                    {formatUserType(user.user_type)}
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{user.contact_number}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Joined {formatDate(user.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Last login {formatDateTime(user.last_login)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Details & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Type Specific Details */}
            {user.user_type === 'student' && user.student_details && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <School className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">School</p>
                      <p className="text-sm text-gray-600">{user.student_details.school}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">District</p>
                      <p className="text-sm text-gray-600">{user.student_details.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Stage</p>
                      <p className="text-sm text-gray-600">{user.student_details.student_stage}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Stream</p>
                      <p className="text-sm text-gray-600">{user.student_details.stream}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Preferred Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {user.student_details.preferred_subjects.map((subject, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {user.activity_log.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-600">Total Logins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-gray-600">Courses Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-sm text-gray-600">Days Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default UserView;