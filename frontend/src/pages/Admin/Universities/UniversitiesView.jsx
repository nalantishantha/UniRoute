import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, Trash2, AlertTriangle, UserX, UserCheck,
  MapPin, Phone, Mail, Globe, Users, Star, CheckCircle,
  Calendar, Award, University, Building2, Loader2,
  ExternalLink, Contact, Info, BarChart3, Trophy
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import { 
  getUniversityById,
  updateUniversityStatus,
  deleteUniversity
} from '../../../utils/universitiesAPI';

const UniversitiesView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch university details
  const fetchUniversity = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getUniversityById(id);
      
      if (response.success) {
        setUniversity(response.university);
      } else {
        setError(response.message || 'University not found');
      }
    } catch (error) {
      setError('Error loading university details. Please try again.');
      console.error('Error fetching university:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUniversity();
    }
  }, [id]);

  // Handle status toggle
  const handleStatusToggle = () => {
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!university) return;

    setActionLoading(prev => ({ ...prev, status: true }));

    try {
      const response = await updateUniversityStatus(
        university.university_id, 
        !university.is_active
      );

      if (response.success) {
        setUniversity(prev => ({ ...prev, is_active: !prev.is_active }));
        setShowStatusModal(false);
      } else {
        setError(response.message || 'Failed to update university status');
      }
    } catch (error) {
      setError('Error updating university status. Please try again.');
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, status: false }));
    }
  };

  // Handle delete
  const handleDelete = () => {
    setDeleteConfirmText('');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!university || deleteConfirmText !== 'DELETE') return;

    setActionLoading(prev => ({ ...prev, delete: true }));

    try {
      const response = await deleteUniversity(university.university_id);

      if (response.success) {
        navigate('/admin/universities');
      } else {
        setError(response.message || 'Failed to delete university');
      }
    } catch (error) {
      setError('Error deleting university. Please try again.');
      console.error('Error deleting university:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleEdit = () => {
    navigate(`/admin/universities/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/admin/universities');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading university details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !university) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">University Not Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Universities
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!university) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{university.name}</h1>
              <p className="text-gray-600">University Details and Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              university.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {university.is_active ? 'Active' : 'Inactive'}
            </span>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              <button
                onClick={handleStatusToggle}
                disabled={actionLoading.status}
                className={`px-4 py-2 text-white rounded-md flex items-center text-sm ${
                  university.is_active 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {actionLoading.status ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : university.is_active ? (
                  <UserX className="w-4 h-4 mr-2" />
                ) : (
                  <UserCheck className="w-4 h-4 mr-2" />
                )}
                {university.is_active ? 'Deactivate' : 'Activate'}
              </button>
              
              <button
                onClick={handleDelete}
                disabled={actionLoading.delete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center text-sm disabled:opacity-50"
              >
                {actionLoading.delete ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </button>
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

        {/* University Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <University className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                  <p className="text-sm text-gray-900">{university.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <p className="text-sm text-gray-900">{university.district}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UGC Ranking</label>
                  <p className="text-sm text-gray-900">
                    {university.ugc_ranking ? (
                      <span className="inline-flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-600 mr-1" />
                        #{university.ugc_ranking}
                      </span>
                    ) : (
                      'Not ranked'
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      university.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {university.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>

              {university.description && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-900 leading-relaxed">{university.description}</p>
                </div>
              )}
            </div>

            {/* Contact Information Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Contact className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location & Address</label>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900">{university.location}</p>
                      <p className="text-sm text-gray-600">{university.district}</p>
                      {university.address && (
                        <p className="text-sm text-gray-600 mt-1">{university.address}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {university.contact_email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`mailto:${university.contact_email}`} className="text-sm text-blue-600 hover:underline">
                        {university.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                
                {university.phone_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`tel:${university.phone_number}`} className="text-sm text-blue-600 hover:underline">
                        {university.phone_number}
                      </a>
                    </div>
                  </div>
                )}
                
                {university.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <a 
                        href={university.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Quick Info</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">University ID:</span>
                  <span className="font-medium text-gray-900">{university.university_id}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    university.is_active ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {university.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {university.ugc_ranking && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">UGC Ranking:</span>
                    <span className="font-medium text-yellow-600">#{university.ugc_ranking}</span>
                  </div>
                )}
                
                {university.created_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Added:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(university.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Change Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {university.is_active ? 'Deactivate' : 'Activate'} University
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to {university.is_active ? 'deactivate' : 'activate'}{' '}
                  <span className="font-medium">{university.name}</span>?
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
                    disabled={actionLoading.status}
                    className={`px-4 py-2 text-white rounded-md flex items-center ${
                      university.is_active 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    } disabled:opacity-50`}
                  >
                    {actionLoading.status && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {university.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Delete University</h3>
                <p className="mt-2 text-sm text-gray-500">
                  This action cannot be undone. This will permanently delete{' '}
                  <span className="font-medium">{university.name}</span> and all associated data.
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
                    disabled={deleteConfirmText !== 'DELETE' || actionLoading.delete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {actionLoading.delete && (
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

export default UniversitiesView;