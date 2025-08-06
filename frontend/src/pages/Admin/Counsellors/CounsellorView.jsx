import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  Users,
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Calendar,
  Star,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const CounsellorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counsellor, setCounsellor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounsellor();
  }, [id]);

  const fetchCounsellor = async () => {
    try {
      setLoading(true);
      // Simulate API call - in real app, fetch from backend
      setTimeout(() => {
        const mockData = {
          id: 1,
          first_name: 'Dr. Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@uniroute.lk',
          phone: '0771234567',
          location: 'Colombo',
          specialization: 'Career Guidance',
          experience_years: 8,
          qualification: 'PhD in Psychology',
          bio: 'Experienced career counsellor specializing in helping students discover their career paths. With over 8 years of experience in educational psychology and career development, Dr. Johnson has successfully guided hundreds of students in making informed decisions about their academic and professional futures.',
          total_students: 245,
          rating: 4.8,
          sessions_completed: 312,
          is_active: true,
          is_verified: true,
          profile_image: '',
          joined_date: '2020-03-15',
          availability: 'full-time',
          recent_sessions: [
            { date: '2024-01-15', student: 'John Doe', topic: 'Career Planning', duration: '45 min' },
            { date: '2024-01-14', student: 'Jane Smith', topic: 'University Selection', duration: '60 min' },
            { date: '2024-01-13', student: 'Mike Wilson', topic: 'Academic Planning', duration: '30 min' }
          ],
          specializations: ['Career Guidance', 'Academic Planning', 'University Admissions'],
          languages: ['English', 'Sinhala', 'Tamil']
        };
        setCounsellor(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching counsellor:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this counsellor?')) {
      try {
        // Simulate API call
        console.log('Deleting counsellor:', id);
        navigate('/admin/counsellors');
      } catch (error) {
        console.error('Error deleting counsellor:', error);
      }
    }
  };

  const getStatusBadge = (counsellor) => {
    if (!counsellor.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }
    if (!counsellor.is_verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!counsellor) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Counsellor not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The counsellor you're looking for doesn't exist.
            </p>
            <div className="mt-6">
              <Link
                to="/admin/counsellors"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Counsellors
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/counsellors')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Counsellor Details</h1>
              <p className="text-gray-600">View and manage counsellor information</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/admin/counsellors/${counsellor.id}/edit`}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {counsellor.first_name} {counsellor.last_name}
                    </h2>
                    <p className="text-gray-600">{counsellor.specialization}</p>
                    <div className="mt-2">
                      {getStatusBadge(counsellor)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-5 w-5 mr-1" />
                    <span className="text-lg font-semibold text-gray-900">{counsellor.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{counsellor.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{counsellor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{counsellor.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p className="text-gray-900">{counsellor.qualification}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-gray-900">{counsellor.experience_years} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="text-gray-900 capitalize">{counsellor.availability}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined Date</p>
                  <p className="text-gray-900">{new Date(counsellor.joined_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {counsellor.specializations?.map((spec, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {counsellor.languages?.map((lang, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
              <p className="text-gray-700 leading-relaxed">{counsellor.bio}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">Total Students</span>
                  </div>
                  <span className="font-semibold text-gray-900">{counsellor.total_students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span className="text-gray-600">Sessions Completed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{counsellor.sessions_completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-600">Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">{counsellor.rating}/5.0</span>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-3">
                {counsellor.recent_sessions?.map((session, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{session.student}</p>
                      <span className="text-xs text-gray-500">{session.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600">{session.topic}</p>
                    <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CounsellorView;
