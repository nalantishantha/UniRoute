import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Mail, Phone, Globe, Calendar,
  Edit, Trash2, Loader2, AlertTriangle 
} from 'lucide-react';
import { companiesAPI } from '../../../utils/companiesAPI';

const CompaniesView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await companiesAPI.getCompanyById(id);
      
      if (response.success) {
        setCompany(response.company);
      } else {
        setError('Failed to fetch company details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/companies/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await companiesAPI.deleteCompany(id);
      navigate('/admin/companies');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWebsiteUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Error</h2>
            </div>
            <p className="text-gray-600 mt-2">{error || 'Company not found'}</p>
            <button
              onClick={() => navigate('/admin/companies')}
              className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Companies</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/companies')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Companies</span>
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Company Details</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Company Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-gray-600">Company ID: #{company.company_id}</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Created {formatDate(company.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
            {company.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Company Description</h3>
                <p className="text-gray-900 leading-relaxed">{company.description}</p>
              </div>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    {company.contact_email ? (
                      <a 
                        href={`mailto:${company.contact_email}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {company.contact_email}
                      </a>
                    ) : (
                      <p className="text-gray-500 italic">No email provided</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg mt-0.5">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    {company.contact_phone ? (
                      <p className="text-gray-900 font-medium">{company.contact_phone}</p>
                    ) : (
                      <p className="text-gray-500 italic">No phone provided</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
                    {company.website ? (
                      <a 
                        href={formatWebsiteUrl(company.website)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium break-all"
                      >
                        {company.website}
                      </a>
                    ) : (
                      <p className="text-gray-500 italic">No website provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">Location Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">District</label>
                    {company.district ? (
                      <p className="text-gray-900 font-medium">{company.district}</p>
                    ) : (
                      <p className="text-gray-500 italic">No district specified</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-50 rounded-lg mt-0.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Address</label>
                    {company.address ? (
                      <p className="text-gray-900 leading-relaxed">{company.address}</p>
                    ) : (
                      <p className="text-gray-500 italic">No address provided</p>
                    )}
                  </div>
                </div>

                {/* Registration Details */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg mt-0.5">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
                    <p className="text-gray-900 font-medium">{formatDate(company.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Company Statistics</h3>
            <p className="text-gray-600">Performance metrics and engagement data</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Job Openings</p>
                  <p className="text-2xl font-bold text-blue-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Internships</p>
                  <p className="text-2xl font-bold text-green-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Applications</p>
                  <p className="text-2xl font-bold text-purple-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Students Hired</p>
                  <p className="text-2xl font-bold text-orange-900">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleEdit}
                className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Edit Company</span>
              </button>
              <button
                onClick={() => window.location.href = `mailto:${company.contact_email}`}
                disabled={!company.contact_email}
                className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Send Email</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center space-x-2 p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete Company</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Company</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{company.name}"? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete Company</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default CompaniesView;