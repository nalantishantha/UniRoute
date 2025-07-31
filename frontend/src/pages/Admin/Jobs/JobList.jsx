import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Award,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const JobsList = () => {
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
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
    companies: [],
    locations: []
  });
  const [statistics, setStatistics] = useState({
    total_internships: 0,
    active_internships: 0,
    expired_internships: 0,
    total_companies: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const navigate = useNavigate();
  const internshipsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchFilterOptions();
    fetchStatistics();
    fetchInternships();
  }, [navigate, currentPage, searchTerm, filterCompany, filterLocation, filterStatus]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/administration/internships/companies/');
      const data = await response.json();
      if (data.success) {
        setFilterOptions(data.filter_options || { companies: data.companies || [], locations: [] });
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/administration/internships/statistics/');
      const data = await response.json();
      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: internshipsPerPage,
        search: searchTerm,
        company: filterCompany,
        location: filterLocation,
        status: filterStatus
      });

      const response = await fetch(`/api/administration/internships/?${params}`);
      const data = await response.json();

      if (data.success) {
        setInternships(data.internships);
        setPagination(data.pagination);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch internships' });
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternship = async () => {
    if (!selectedInternship) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/administration/internships/${selectedInternship.internship_id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchInternships();
        fetchStatistics();
        setShowDeleteModal(false);
        setSelectedInternship(null);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error deleting internship:', error);
      setMessage({ type: 'error', text: 'Failed to delete internship' });
    } finally {
      setActionLoading(false);
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
    fetchInternships();
    fetchStatistics();
  };

  const getDisplayValue = (value) => {
    return (value && value !== 'undefined') ? value : 'N/A';
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getInternshipStatus = (internship) => {
    if (isDeadlinePassed(internship.application_deadline)) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    if (new Date(internship.start_date) > new Date()) {
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    }
    if (new Date(internship.end_date) < new Date()) {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <AdminLayout pageTitle="Jobs" pageDescription="Manage internship opportunities and job postings">
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
                  <Briefcase className="h-6 w-6 text-indigo-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
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
                  to="/admin/jobs/new"
                  className="bg-[#1D5D9B] text-white px-4 py-2 rounded-lg hover:bg-[#174A7C] transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Job</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_internships}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.active_internships}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expired Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.expired_internships}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_companies}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterCompany}
                    onChange={(e) => {
                      setFilterCompany(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Companies</option>
                    {filterOptions.companies.map(company => (
                      <option key={company.company_id} value={company.company_id}>
                        {company.name}
                      </option>
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
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {pagination.total_items} total jobs
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading jobs...</p>
                </div>
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No jobs found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location & Stipend
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timeline
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
                      {internships.map((internship) => {
                        const status = getInternshipStatus(internship);
                        return (
                          <tr key={internship.internship_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                  <Briefcase className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {getDisplayValue(internship.title)}
                                  </div>
                                  <div className="text-sm text-gray-500 line-clamp-2">
                                    {internship.description?.substring(0, 100) || 'No description'}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-gray-400" />
                                <div>
                                  <div className="text-sm text-gray-900">
                                    {internship.company ? getDisplayValue(internship.company.name) : 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {internship.company ? getDisplayValue(internship.company.district) : ''}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {getDisplayValue(internship.location)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {getDisplayValue(internship.stipend)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">Start:</span> {formatDate(internship.start_date)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">End:</span> {formatDate(internship.end_date)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">Deadline:</span> {formatDate(internship.application_deadline)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/admin/jobs/${internship.internship_id}`}
                                  className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={`/admin/jobs/${internship.internship_id}/edit`}
                                  className="text-[#81C784] hover:text-[#5EA46A] p-1 rounded"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => {
                                    setSelectedInternship(internship);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-[#E57373] hover:text-[#C94A4A] p-1 rounded"
                                  title="Delete"
                                  disabled={actionLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((pagination.current_page - 1) * internshipsPerPage) + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(pagination.current_page * internshipsPerPage, pagination.total_items)}</span> of{' '}
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
                                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedInternship?.title}"? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedInternship(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInternship}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobsList;