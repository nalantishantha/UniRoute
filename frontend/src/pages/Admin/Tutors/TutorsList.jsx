import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Award,
  RefreshCw,
  AlertCircle,
  Building,
  GraduationCap,
  Star,
  BookOpen,
  MapPin
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const TutorsList = () => {
  const [tutors, setTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterRating, setFilterRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });
  const [filterOptions, setFilterOptions] = useState({
    universities: [],
    subjects: []
  });

  const navigate = useNavigate();
  const tutorsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchFilterOptions();
    fetchTutors();
  }, [navigate, currentPage, searchTerm, filterUniversity, filterSubject, filterRating]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/administration/tutors/filter-options/');
      const data = await response.json();
      if (data.success) {
        setFilterOptions(data.filter_options);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: tutorsPerPage,
        search: searchTerm,
        university: filterUniversity,
        subject: filterSubject,
        rating_min: filterRating
      });

      const response = await fetch(`/api/administration/tutors/?${params}`);
      const data = await response.json();

      if (data.success) {
        setTutors(data.tutors);
        setPagination(data.pagination);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch tutors' });
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTutor = async (tutorId, tutorName) => {
    if (window.confirm(`Are you sure you want to delete tutor "${tutorName}"? This action cannot be undone.`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/tutors/${tutorId}/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchTutors(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error deleting tutor:', error);
        setMessage({ type: 'error', text: 'Failed to delete tutor' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggleStatus = async (tutorId, currentStatus, tutorName) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} tutor "${tutorName}"?`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/tutors/${tutorId}/toggle-status/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchTutors(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error toggling tutor status:', error);
        setMessage({ type: 'error', text: 'Failed to update tutor status' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchTutors();
  };

  const getDisplayValue = (value) => {
    return (value && value !== 'undefined') ? value : 'N/A';
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <AdminLayout pageTitle="Tutors" pageDescription="Manage all tutors">
      <div className="min-h-screen bg-gray-50">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-6 w-6 text-blue-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Tutors Management</h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <Link
                  to="/admin/tutors/new"
                  className="bg-[#1D5D9B] text-white px-4 py-2 rounded-lg hover:bg-[#174A7C] transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tutor</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tutors..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterUniversity}
                    onChange={(e) => {
                      setFilterUniversity(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Universities</option>
                    {filterOptions.universities.map(university => (
                      <option key={university.university_id} value={university.university_id}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterSubject}
                    onChange={(e) => {
                      setFilterSubject(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Subjects</option>
                    {filterOptions.subjects.map(subject => (
                      <option key={subject.subject_id} value={subject.subject_id}>
                        {subject.subject_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min Rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filterRating}
                    onChange={(e) => {
                      setFilterRating(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {pagination.total_items} total tutors
                </div>
              </div>
            </div>
          </div>

          {/* Tutors Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading tutors...</p>
                </div>
              </div>
            ) : tutors.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tutors found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          University
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subjects
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tutors.map((tutor) => (
                        <tr key={tutor.tutor_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {getDisplayValue(tutor.full_name)}
                                  </span>
                                  {tutor.is_verified && (
                                    <Award className="h-4 w-4 text-blue-500" title="Verified User" />
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">@{tutor.username}</div>
                                <div className="text-sm text-gray-500">{tutor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">
                                  {tutor.university_student ? getDisplayValue(tutor.university_student.university.name) : 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {tutor.university_student ? getDisplayValue(tutor.university_student.university.district) : ''}
                                </div>
                                {tutor.university_student && (
                                  <div className="text-xs text-gray-400">
                                    Year {getDisplayValue(tutor.university_student.year_of_study)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {tutor.subjects.slice(0, 2).map((subject, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
                                >
                                  {subject.name}
                                </span>
                              ))}
                              {tutor.subjects.length > 2 && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                  +{tutor.subjects.length - 2}
                                </span>
                              )}
                              {tutor.subjects.length === 0 && (
                                <span className="text-sm text-gray-400">No subjects listed</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {getDisplayValue(tutor.expertise)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900 truncate max-w-xs">
                                  {tutor.email}
                                </span>
                              </div>
                              {tutor.contact_number && tutor.contact_number !== 'undefined' ? (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">{tutor.contact_number}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No phone</span>
                              )}
                              {tutor.location && tutor.location !== 'undefined' && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">{tutor.location}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {renderStarRating(tutor.rating)}
                              </div>
                              <span className="text-sm text-gray-900">
                                {tutor.rating ? tutor.rating.toFixed(1) : '0.0'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {tutor.total_ratings} rating{tutor.total_ratings !== 1 ? 's' : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              tutor.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tutor.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {formatDate(tutor.created_at)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/tutors/${tutor.tutor_id}`}
                                className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/tutors/${tutor.tutor_id}/edit`}
                                className="text-[#81C784] hover:text-[#5EA46A] p-1 rounded"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleToggleStatus(tutor.tutor_id, tutor.is_active, getDisplayValue(tutor.full_name))}
                                className={`p-1 rounded ${
                                  tutor.is_active
                                    ? 'text-[#F4D160] hover:text-[#D9B23A]'
                                    : 'text-[#81C784] hover:text-[#5EA46A]'
                                }`}
                                title={tutor.is_active ? 'Deactivate' : 'Activate'}
                                disabled={actionLoading}
                              >
                                {tutor.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteTutor(tutor.tutor_id, getDisplayValue(tutor.full_name))}
                                className="text-[#E57373] hover:text-[#C94A4A] p-1 rounded"
                                title="Delete"
                                disabled={actionLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((pagination.current_page - 1) * tutorsPerPage) + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(pagination.current_page * tutorsPerPage, pagination.total_items)}</span> of{' '}
                          <span className="font-medium">{pagination.total_items}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={!pagination.has_previous}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          
                          {[...Array(pagination.total_pages)].map((_, index) => {
                            const pageNumber = index + 1;
                            const isCurrentPage = pageNumber === pagination.current_page;
                            
                            if (pageNumber === 1 || pageNumber === pagination.total_pages || 
                                (pageNumber >= pagination.current_page - 2 && pageNumber <= pagination.current_page + 2)) {
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    isCurrentPage
                                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            }
                            return null;
                          })}
                          
                          <button
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={!pagination.has_next}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TutorsList;