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
  Building,
  Briefcase,
  Clock,
  Activity,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Award,
  Star,
  Globe,
  Target,
  BookOpen,
  TrendingUp,
  MessageSquare,
  UserPlus,
  Eye,
  BarChart3
} from 'lucide-react';

const MentorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock mentor data
  const mockMentor = {
    id: 1,
    first_name: 'Dilshan',
    last_name: 'Rathnayake',
    email: 'dilshan.rathnayake@techcorp.lk',
    contact_number: '0771234567',
    company: 'TechCorp Lanka',
    position: 'Senior Software Engineer',
    experience_years: 8,
    industry: 'Technology',
    mentorship_capacity: 5,
    current_mentees: 3,
    expertise_areas: ['Software Development', 'Machine Learning', 'Cloud Computing', 'DevOps'],
    linkedin_profile: 'https://linkedin.com/in/dilshan-rathnayake',
    rating: 4.8,
    total_reviews: 24,
    bio: 'Experienced software engineer with expertise in full-stack development and machine learning. Passionate about mentoring young developers and helping them navigate their career paths in technology. I have successfully guided numerous students and junior developers in landing their dream jobs at top tech companies.',
    is_active: true,
    is_verified: true,
    joined_date: '2023-03-15',
    last_login: '2024-07-03T14:20:00Z',
    mentees: [
      {
        id: 1,
        name: 'Kasun Silva',
        program: 'Computer Science - University of Colombo',
        start_date: '2023-06-01',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Priya Fernando',
        program: 'Software Engineering - SLIIT',
        start_date: '2023-08-15',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Roshan Perera',
        program: 'Information Technology - University of Moratuwa',
        start_date: '2023-10-01',
        status: 'Active'
      }
    ],
    activity_log: [
      {
        id: 1,
        action: 'Mentorship Session',
        timestamp: '2024-07-03T14:20:00Z',
        details: 'Conducted one-on-one session with Kasun Silva on React development'
      },
      {
        id: 2,
        action: 'Profile Updated',
        timestamp: '2024-07-02T10:15:00Z',
        details: 'Updated bio and expertise areas'
      },
      {
        id: 3,
        action: 'New Mentee',
        timestamp: '2024-06-30T16:45:00Z',
        details: 'Started mentoring Roshan Perera'
      },
      {
        id: 4,
        action: 'Review Received',
        timestamp: '2024-06-28T09:30:00Z',
        details: 'Received 5-star review from Priya Fernando'
      }
    ],
    statistics: {
      total_sessions_conducted: 47,
      average_session_rating: 4.8,
      successful_placements: 8,
      years_mentoring: 2
    },
    recent_reviews: [
      {
        id: 1,
        reviewer: 'Priya Fernando',
        rating: 5,
        comment: 'Excellent mentor! Dilshan helped me understand complex algorithms and guided me through my job interview preparation.',
        date: '2024-06-28'
      },
      {
        id: 2,
        reviewer: 'Kasun Silva',
        rating: 5,
        comment: 'Very knowledgeable and patient. His guidance on React and Node.js projects was invaluable.',
        date: '2024-06-15'
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
      setMentor(mockMentor);
      setLoading(false);
    }, 1000);
  }, [id, navigate]);

  const handleDeleteMentor = () => {
    if (window.confirm('Are you sure you want to delete this mentor? This action cannot be undone.')) {
      setMessage({ type: 'success', text: 'Mentor deleted successfully!' });
      setTimeout(() => {
        navigate('/admin/mentors');
      }, 1500);
    }
  };

  const handleToggleStatus = () => {
    const action = mentor.is_active ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this mentor?`)) {
      setMentor(prev => ({ ...prev, is_active: !prev.is_active }));
      setMessage({ 
        type: 'success', 
        text: `Mentor ${action}d successfully!` 
      });
    }
  };

  const handleToggleVerification = () => {
    const action = mentor.is_verified ? 'unverify' : 'verify';
    if (window.confirm(`Are you sure you want to ${action} this mentor?`)) {
      setMentor(prev => ({ ...prev, is_verified: !prev.is_verified }));
      setMessage({ 
        type: 'success', 
        text: `Mentor ${action}ied successfully!` 
      });
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

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCapacityColor = (current, total) => {
    const percentage = (current / total) * 100;
    if (percentage >= 80) return 'text-red-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor details...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Mentor Not Found</h2>
          <p className="text-gray-600 mb-4">The mentor you're looking for doesn't exist.</p>
          <Link
            to="/admin/mentors"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Mentors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/mentors"
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">Mentor Details</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to={`/admin/mentors/${mentor.id}/edit`}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Mentor</span>
              </Link>
              <button
                onClick={handleToggleVerification}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  mentor.is_verified
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>{mentor.is_verified ? 'Unverify' : 'Verify'}</span>
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  mentor.is_active
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {mentor.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                <span>{mentor.is_active ? 'Deactivate' : 'Activate'}</span>
              </button>
              <button
                onClick={handleDeleteMentor}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
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
          {/* Mentor Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {mentor.first_name} {mentor.last_name}
                </h2>
                <p className="text-gray-600 mb-2">{mentor.position}</p>
                <p className="text-sm text-gray-500 mb-3">{mentor.company}</p>
                
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                    {mentor.experience_years} years exp
                  </span>
                  {mentor.is_verified && (
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex justify-center mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    mentor.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mentor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <Star className={`h-5 w-5 ${getRatingColor(mentor.rating)}`} />
                  <span className={`text-lg font-semibold ${getRatingColor(mentor.rating)}`}>
                    {mentor.rating}
                  </span>
                  <span className="text-sm text-gray-500">({mentor.total_reviews} reviews)</span>
                </div>

                {/* LinkedIn */}
                {mentor.linkedin_profile && (
                  <a
                    href={mentor.linkedin_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">LinkedIn Profile</span>
                  </a>
                )}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{mentor.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{mentor.contact_number}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Joined {formatDate(mentor.joined_date)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Last login {formatDateTime(mentor.last_login)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Details & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Company</p>
                    <p className="text-sm text-gray-600">{mentor.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Position</p>
                    <p className="text-sm text-gray-600">{mentor.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Industry</p>
                    <p className="text-sm text-gray-600">{mentor.industry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mentorship Capacity</p>
                    <p className={`text-sm font-medium ${getCapacityColor(mentor.current_mentees, mentor.mentorship_capacity)}`}>
                      {mentor.current_mentees}/{mentor.mentorship_capacity} mentees
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Expertise Areas</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise_areas.map((area, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Bio</p>
                <p className="text-sm text-gray-600">{mentor.bio}</p>
              </div>
            </div>

            {/* Mentorship Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mentorship Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mentor.statistics.total_sessions_conducted}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mentor.statistics.average_session_rating}</div>
                  <div className="text-sm text-gray-600">Avg Session Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{mentor.statistics.successful_placements}</div>
                  <div className="text-sm text-gray-600">Successful Placements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{mentor.statistics.years_mentoring}</div>
                  <div className="text-sm text-gray-600">Years Mentoring</div>
                </div>
              </div>
            </div>

            {/* Current Mentees */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Mentees</h3>
              <div className="space-y-3">
                {mentor.mentees.map((mentee) => (
                  <div key={mentee.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <UserPlus className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{mentee.name}</p>
                        <p className="text-sm text-gray-600">{mentee.program}</p>
                        <p className="text-xs text-gray-500">Started: {formatDate(mentee.start_date)}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {mentee.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {mentor.recent_reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{review.reviewer}</p>
                        <div className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, index) => (
                            <Star key={index} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mentor.activity_log.map((activity) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorView;
