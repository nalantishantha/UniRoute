import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  GraduationCap,
  Edit,
  Trash2,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Clock,
  Activity,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Award,
  Star,
  DollarSign,
  Target,
  BookOpen,
  TrendingUp,
  MessageSquare,
  UserPlus,
  Eye,
  BarChart3,
  Book,
  Globe,
  Users
} from 'lucide-react';

const TutorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock tutor data
  const mockTutor = {
    id: 1,
    first_name: 'Priya',
    last_name: 'Fernando',
    email: 'priya.fernando@edutech.lk',
    contact_number: '0771234567',
    subjects: ['Mathematics', 'Physics'],
    qualification: 'B.Sc. in Mathematics',
    experience_years: 5,
    hourly_rate: 2500,
    location: 'Colombo',
    rating: 4.8,
    total_students: 45,
    active_students: 12,
    completed_sessions: 340,
    bio: 'Experienced mathematics and physics tutor with a passion for teaching. I have been helping students achieve their academic goals for over 5 years. My teaching methodology focuses on making complex concepts simple and understandable.',
    availability_hours: 20,
    languages: ['Sinhala', 'English'],
    teaching_mode: 'both',
    max_students: 50,
    is_verified: true,
    is_active: true,
    created_at: '2024-01-15T08:30:00Z',
    last_login: '2024-01-20T10:15:00Z',
    total_earnings: 850000,
    reviews_count: 28,
    completion_rate: 95
  };

  const recentSessions = [
    {
      id: 1,
      student_name: 'Kasun Silva',
      subject: 'Mathematics',
      date: '2024-01-20',
      duration: 60,
      status: 'completed'
    },
    {
      id: 2,
      student_name: 'Nimali Perera',
      subject: 'Physics',
      date: '2024-01-19',
      duration: 90,
      status: 'completed'
    },
    {
      id: 3,
      student_name: 'Dilshan Fernando',
      subject: 'Mathematics',
      date: '2024-01-18',
      duration: 60,
      status: 'cancelled'
    }
  ];

  useEffect(() => {
    fetchTutor();
  }, [id]);

  const fetchTutor = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTutor(mockTutor);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tutor:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tutor? This action cannot be undone.')) {
      try {
        // Simulate API call
        setMessage({ type: 'success', text: 'Tutor deleted successfully!' });
        setTimeout(() => {
          navigate('/admin/tutors');
        }, 1500);
      } catch (error) {
        console.error('Error deleting tutor:', error);
        setMessage({ type: 'error', text: 'Failed to delete tutor' });
      }
    }
  };

  const toggleStatus = async (field) => {
    try {
      const newValue = !tutor[field];
      setTutor(prev => ({ ...prev, [field]: newValue }));
      setMessage({ 
        type: 'success', 
        text: `Tutor ${field === 'is_active' ? 'status' : 'verification'} updated successfully!` 
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setMessage({ type: 'error', text: `Failed to update ${field}` });
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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tutor not found</h3>
          <p className="mt-1 text-sm text-gray-500">The tutor you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              to="/admin/tutors"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Tutors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/tutors"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {tutor.first_name} {tutor.last_name}
            </h1>
            <p className="text-gray-600">Tutor Details</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/admin/tutors/${tutor.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="flex items-center space-x-2">
                {tutor.is_verified ? (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Unverified
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  tutor.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tutor.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-sm text-gray-900">{tutor.first_name} {tutor.last_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{tutor.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Number</p>
                    <p className="text-sm text-gray-900">{tutor.contact_number}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{tutor.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Qualification</p>
                    <p className="text-sm text-gray-900">{tutor.qualification}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Experience</p>
                    <p className="text-sm text-gray-900">{tutor.experience_years} years</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                    <p className="text-sm text-gray-900">Rs. {tutor.hourly_rate.toLocaleString()}/hr</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Languages</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutor.languages.map((language, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">Subjects Taught</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject, index) => (
                      <span key={index} className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {tutor.bio && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Bio</p>
                    <p className="text-sm text-gray-700">{tutor.bio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.student_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.subject}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(session.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.duration} min
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          session.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : session.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{tutor.rating}/5.0</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Total Students</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{tutor.total_students}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Active Students</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{tutor.active_students}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Sessions Completed</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{tutor.completed_sessions}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Completion Rate</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{tutor.completion_rate}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm text-gray-600">Reviews</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{tutor.reviews_count}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Total Earnings</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">Rs. {tutor.total_earnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-sm text-gray-900">{formatDate(tutor.created_at)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Last Login</p>
                <p className="text-sm text-gray-900">{formatDateTime(tutor.last_login)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Teaching Mode</p>
                <p className="text-sm text-gray-900 capitalize">{tutor.teaching_mode.replace('_', ' ')}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Available Hours/Week</p>
                <p className="text-sm text-gray-900">{tutor.availability_hours} hours</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Max Students</p>
                <p className="text-sm text-gray-900">{tutor.max_students}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => toggleStatus('is_active')}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  tutor.is_active
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {tutor.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                <span>{tutor.is_active ? 'Deactivate' : 'Activate'} Tutor</span>
              </button>

              <button
                onClick={() => toggleStatus('is_verified')}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  tutor.is_verified
                    ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {tutor.is_verified ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <span>{tutor.is_verified ? 'Remove Verification' : 'Verify Tutor'}</span>
              </button>

              <Link
                to={`/admin/tutors/${tutor.id}/sessions`}
                className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View All Sessions</span>
              </Link>

              <Link
                to={`/admin/tutors/${tutor.id}/students`}
                className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>View Students</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorView;
