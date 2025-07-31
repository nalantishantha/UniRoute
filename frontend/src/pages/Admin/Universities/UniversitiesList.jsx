import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  Award,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  School
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const UniversitiesList = () => {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
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
    districts: []
  });

  const navigate = useNavigate();
  const universitiesPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchFilterOptions();
    fetchUniversities();
  }, [navigate, currentPage, searchTerm, filterDistrict, filterStatus]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/administration/universities/filter-options/');
      const data = await response.json();
      if (data.success) {
        setFilterOptions(data.filter_options);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: universitiesPerPage,
        search: searchTerm,
        district: filterDistrict,
        is_active: filterStatus
      });

      const response = await fetch(`/api/administration/universities/?${params}`);
      const data = await response.json();

      if (data.success) {
        setUniversities(data.universities);
        setPagination(data.pagination);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch universities' });
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUniversity = async (universityId, universityName) => {
    if (window.confirm(`Are you sure you want to delete university "${universityName}"? This action cannot be undone.`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/universities/${universityId}/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchUniversities(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error deleting university:', error);
        setMessage({ type: 'error', text: 'Failed to delete university' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggleStatus = async (universityId, currentStatus, universityName) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} university "${universityName}"?`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/universities/${universityId}/toggle-status/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchUniversities(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error toggling university status:', error);
        setMessage({ type: 'error', text: 'Failed to update university status' });
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
    fetchUniversities();
  };

  const getDisplayValue = (value) => {
    return (value && value !== 'undefined') ? value : 'N/A';
  };

  const getRankingColor = (ranking) => {
    if (!ranking || ranking === 'undefined') return 'bg-gray-100 text-gray-600 border border-gray-200';
    if (ranking <= 5) return 'bg-green-100 text-green-800 border border-green-200';
    if (ranking <= 10) return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (ranking <= 20) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-purple-100 text-purple-800 border border-purple-200';
  };

  return (
    <AdminLayout pageTitle="Universities" pageDescription="Manage all universities">
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
                  <Building2 className="h-6 w-6 text-purple-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Universities Management</h1>
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
                  to="/admin/universities/new"
                  className="bg-[#1D5D9B] text-white px-4 py-2 rounded-lg hover:bg-[#174A7C] transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add University</span>
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
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterDistrict}
                    onChange={(e) => {
                      setFilterDistrict(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Districts</option>
                    {filterOptions.districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {pagination.total_items} total universities
                </div>
              </div>
            </div>
          </div>

          {/* Universities Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading universities...</p>
                </div>
              </div>
            ) : universities.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No universities found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          University
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Website
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ranking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Faculties
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {universities.map((university) => (
                        <tr key={university.university_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <Building2 className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {getDisplayValue(university.name)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  District: {getDisplayValue(university.district)}
                                </div>
                                {university.ugc_ranking && university.ugc_ranking !== 'undefined' && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Award className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs text-yellow-600">UGC Ranked #{university.ugc_ranking}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                  {getDisplayValue(university.address)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {university.contact_email && university.contact_email !== 'undefined' ? (
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900 truncate max-w-xs">
                                    {university.contact_email}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No email</span>
                              )}
                              {university.phone_number && university.phone_number !== 'undefined' ? (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">{university.phone_number}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No phone</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {university.website && university.website !== 'undefined' ? (
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-blue-500" />
                                <a 
                                  href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs"
                                >
                                  {university.website}
                                </a>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">No website</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRankingColor(university.ugc_ranking)}`}>
                              {university.ugc_ranking && university.ugc_ranking !== 'undefined' ? `#${university.ugc_ranking}` : 'Unranked'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <School className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{university.faculty_count || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              university.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {university.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/universities/${university.university_id}`}
                                className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/universities/${university.university_id}/edit`}
                                className="text-[#81C784] hover:text-[#5EA46A] p-1 rounded"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleToggleStatus(university.university_id, university.is_active, getDisplayValue(university.name))}
                                className={`p-1 rounded ${
                                  university.is_active
                                    ? 'text-[#F4D160] hover:text-[#D9B23A]'
                                    : 'text-[#81C784] hover:text-[#5EA46A]'
                                }`}
                                title={university.is_active ? 'Deactivate' : 'Activate'}
                                disabled={actionLoading}
                              >
                                {university.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUniversity(university.university_id, getDisplayValue(university.name))}
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
                          Showing <span className="font-medium">{((pagination.current_page - 1) * universitiesPerPage) + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(pagination.current_page * universitiesPerPage, pagination.total_items)}</span> of{' '}
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
                                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
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

export default UniversitiesList;