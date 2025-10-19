import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Search, Eye, Edit, Trash2, AlertTriangle,
  MapPin, Phone, Mail, Globe, Users, Star, CheckCircle,
  ChevronLeft, ChevronRight, Loader2, Calendar, Award,
  UserCheck, UserX, University
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import { 
  getAllUniversities,
  updateUniversityStatus,
  deleteUniversity
} from '../../../utils/universitiesAPI';

const UniversitiesList = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  
  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch universities
  const fetchUniversities = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page,
        per_page: itemsPerPage,
        search: searchTerm
      };

      const response = await getAllUniversities(params);
      
      if (response.success) {
        setUniversities(response.universities || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.message || 'Failed to fetch universities');
      }
    } catch (error) {
      setError('Error loading universities. Please try again.');
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchUniversities(1);
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUniversities(page);
  };

  // Handle status toggle
  const handleStatusToggle = async (university) => {
    setSelectedUniversity(university);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUniversity) return;

    const loadingKey = `status_${selectedUniversity.university_id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await updateUniversityStatus(
        selectedUniversity.university_id, 
        !selectedUniversity.is_active
      );

      if (response.success) {
        await fetchUniversities(currentPage);
        setShowStatusModal(false);
        setSelectedUniversity(null);
      } else {
        setError(response.message || 'Failed to update university status');
      }
    } catch (error) {
      setError('Error updating university status. Please try again.');
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Handle delete
  const handleDelete = (university) => {
    setSelectedUniversity(university);
    setDeleteConfirmText('');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUniversity || deleteConfirmText !== 'DELETE') return;

    const loadingKey = `delete_${selectedUniversity.university_id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await deleteUniversity(selectedUniversity.university_id);

      if (response.success) {
        await fetchUniversities(currentPage);
        setShowDeleteModal(false);
        setSelectedUniversity(null);
        setDeleteConfirmText('');
      } else {
        setError(response.message || 'Failed to delete university');
      }
    } catch (error) {
      setError('Error deleting university. Please try again.');
      console.error('Error deleting university:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Navigation handlers
  const handleView = (universityId) => {
    navigate(`/admin/universities/${universityId}`);
  };

  const handleEdit = (universityId) => {
    navigate(`/admin/universities/${universityId}/edit`);
  };

  const renderPagination = () => {
    if (!pagination.total_pages || pagination.total_pages <= 1) return null;

    const pages = [];
    const totalPages = pagination.total_pages;
    const current = pagination.current_page;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(current - 1)}
        disabled={!pagination.has_previous}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );

    // Page numbers
    for (let i = Math.max(1, current - 2); i <= Math.min(totalPages, current + 2); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === current
              ? 'text-white bg-blue-600 border border-blue-600'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(current + 1)}
        disabled={!pagination.has_next}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((current - 1) * itemsPerPage) + 1} to {Math.min(current * itemsPerPage, pagination.total_items)} of {pagination.total_items} results
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {pages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading universities...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Universities Management</h1>
            <p className="mt-1 text-gray-600">Manage university information and profiles</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{pagination.total_items || 0} Total Universities</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, location, or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Clear Search */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address & Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {universities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">No universities found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  universities.map((university) => (
                    <tr key={university.university_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <University className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {university.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {university.district}
                            </div>
                            {university.website && (
                              <div className="text-xs text-blue-600">
                                <Globe className="w-3 h-3 inline mr-1" />
                                <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {university.location}, {university.district}
                          </div>
                          {university.contact_email && (
                            <div className="flex items-center mb-1">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-xs">{university.contact_email}</span>
                            </div>
                          )}
                          {university.phone_number && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-xs">{university.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {university.location}
                          </div>
                          {university.district && university.district !== university.location && (
                            <div className="text-xs text-gray-500">
                              {university.district}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {university.address && (
                            <div className="text-xs text-gray-600 mb-1">
                              {university.address.length > 50 ? 
                                `${university.address.substring(0, 50)}...` : 
                                university.address
                              }
                            </div>
                          )}
                          {university.logo && (
                            <div className="text-xs text-blue-600">
                              Has Logo
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {university.ugc_ranking ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Award className="w-3 h-3 mr-1" />
                            #{university.ugc_ranking}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Not ranked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          university.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {university.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleView(university.university_id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(university.university_id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                          title="Edit University"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(university)}
                          className={`p-1 rounded-full ${
                            university.is_active 
                              ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          }`}
                          title={university.is_active ? 'Deactivate' : 'Activate'}
                          disabled={actionLoading[`status_${university.university_id}`]}
                        >
                          {actionLoading[`status_${university.university_id}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : university.is_active ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(university)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Delete University"
                          disabled={actionLoading[`delete_${university.university_id}`]}
                        >
                          {actionLoading[`delete_${university.university_id}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>

        {/* Status Change Modal */}
        {showStatusModal && selectedUniversity && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedUniversity.is_active ? 'Deactivate' : 'Activate'} University
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to {selectedUniversity.is_active ? 'deactivate' : 'activate'}{' '}
                  <span className="font-medium">{selectedUniversity.name}</span>?
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    disabled={actionLoading[`status_${selectedUniversity.university_id}`]}
                    className={`px-4 py-2 text-white rounded-md flex items-center ${
                      selectedUniversity.is_active 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    } disabled:opacity-50`}
                  >
                    {actionLoading[`status_${selectedUniversity.university_id}`] && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {selectedUniversity.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUniversity && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Delete University</h3>
                <p className="mt-2 text-sm text-gray-500">
                  This action cannot be undone. This will permanently delete{' '}
                  <span className="font-medium">{selectedUniversity.name}</span> and all associated data.
                </p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type "DELETE" to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="DELETE"
                  />
                </div>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteConfirmText !== 'DELETE' || actionLoading[`delete_${selectedUniversity.university_id}`]}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {actionLoading[`delete_${selectedUniversity.university_id}`] && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    Delete University
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UniversitiesList;