import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import { fetchMentorDetails } from '../../../utils/mentorsAPI';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  Users,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar
} from 'lucide-react';

const MentorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const loadMentor = async () => {
      if (!id) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await fetchMentorDetails(id);
        if (!data.success) {
          throw new Error(data.message || 'Unable to load mentor details');
        }

        setMentor(data.mentor || null);
      } catch (err) {
        setError(err.message || 'Unable to load mentor details');
        setMentor(null);
      } finally {
        setLoading(false);
      }
    };

    loadMentor();
  }, [id]);

  const formatDate = (value) => {
    if (!value) {
      return '-';
    }

    try {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return value;
    }
  };

  const getRequestStatusClasses = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading mentor details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to load mentor</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              to="/admin/mentors"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Back to Mentors
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!mentor) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto py-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mentor not found</h2>
            <p className="text-gray-600 mb-4">The mentor you are looking for does not exist.</p>
            <Link
              to="/admin/mentors"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Back to Mentors
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const expertiseTags = mentor.expertise_tags && mentor.expertise_tags.length
    ? mentor.expertise_tags
    : mentor.expertise
      ? [mentor.expertise]
      : [];

  const stats = mentor.stats || {};
  const statsItems = [
    { label: 'Total Requests', value: stats.total_requests },
    { label: 'Pending Requests', value: stats.pending_requests },
    { label: 'Scheduled Requests', value: stats.scheduled_requests },
    { label: 'Completed Requests', value: stats.completed_requests },
    { label: 'Declined Requests', value: stats.declined_requests },
    { label: 'Total Sessions', value: stats.total_sessions },
    { label: 'Scheduled Sessions', value: stats.scheduled_sessions },
    { label: 'Completed Sessions', value: stats.completed_sessions }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Link to="/admin/mentors" className="text-gray-600 hover:text-gray-900">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mentor Profile</h1>
                <p className="text-sm text-gray-500">Manage mentor information and recent activity</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 h-16 w-16 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{mentor.full_name}</h2>
                    <p className="text-sm text-gray-500">{mentor.degree_program || 'Mentor'}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      mentor.approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {mentor.approved ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {mentor.approved ? 'Approved mentor' : 'Pending approval'}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      mentor.is_active
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {mentor.is_active ? 'Account active' : 'Account inactive'}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{mentor.email}</span>
                  </div>
                  {mentor.contact_number && (
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{mentor.contact_number}</span>
                    </div>
                  )}
                  {mentor.location && (
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{mentor.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Joined {formatDate(mentor.created_at || mentor.user_created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic details</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">University</dt>
                    <dd className="text-gray-900">{mentor.university || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Degree program</dt>
                    <dd className="text-gray-900">{mentor.degree_program || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Duration</dt>
                    <dd className="text-gray-900">{mentor.duration_years ? `${mentor.duration_years} year program` : 'Not specified'}</dd>
                  </div>
                </dl>
              </div>

              {expertiseTags.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {expertiseTags.map((tag, index) => (
                      <span
                        key={`expertise-${index}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              {mentor.bio && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{mentor.bio}</p>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentoring statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsItems.map((item) => (
                    <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">{item.value ?? 0}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent mentoring requests</h3>
                  <span className="text-sm text-gray-500">Latest five requests</span>
                </div>

                {(!mentor.recent_requests || mentor.recent_requests.length === 0) && (
                  <div className="text-sm text-gray-500">No mentoring requests recorded yet.</div>
                )}

                <div className="space-y-3">
                  {mentor.recent_requests && mentor.recent_requests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{request.topic || 'Mentoring request'}</span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRequestStatusClasses(request.status)}`}>
                            {request.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 space-x-3">
                          {request.student_name && <span>Student: {request.student_name}</span>}
                          {request.session_type && <span>Type: {request.session_type}</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(request.requested_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MentorView;
