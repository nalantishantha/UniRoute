import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  Globe,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchInternshipDetails();
  }, [jobId]);

  const fetchInternshipDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/companies/internships/${jobId}/`);
      const data = await response.json();

      if (data.success) {
        setInternship(data.internship);
      } else {
        console.error('Failed to fetch internship details');
      }
    } catch (error) {
      console.error('Error fetching internship details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternship = async () => {
    try {
      const response = await fetch(`/api/companies/internships/${jobId}/delete/`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/admin/jobs');
      } else {
        alert('Failed to delete internship: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Failed to delete internship');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Job Details" pageDescription="View internship opportunity details">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-[#1D5D9B]" />
            <span className="text-[#717171]">Loading internship details...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!internship) {
    return (
      <AdminLayout pageTitle="Job Details" pageDescription="View internship opportunity details">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-[#E57373] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#263238] mb-2">Internship Not Found</h3>
          <p className="text-[#717171]">The internship you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/admin/jobs')}
            className="mt-4 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C]"
          >
            Back to Jobs
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Job Details" pageDescription="View internship opportunity details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center space-x-2 text-[#717171] hover:text-[#263238]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Jobs</span>
          </button>
          
          <div className="flex items-center space-x-4">
            {isDeadlinePassed(internship.application_deadline) ? (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-[#E57373]/10 text-[#E57373]">
                Expired
              </span>
            ) : (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-[#4CAF50]/10 text-[#4CAF50]">
                Active
              </span>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/admin/jobs/${internship.internship_id}/edit`)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#F4D160] text-[#263238] rounded-lg hover:bg-[#E6C547] transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#E57373] text-white rounded-lg hover:bg-[#D32F2F] transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <h1 className="text-2xl font-bold text-[#263238] mb-4">{internship.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-[#1D5D9B]" />
                  <span className="text-[#263238] font-medium">{internship.company.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-[#717171]" />
                  <span className="text-[#717171]">{internship.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-[#4CAF50]" />
                  <span className="text-[#717171]">{internship.stipend || 'Not specified'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-[#717171] mb-2">Description</h3>
                  <p className="text-[#263238] whitespace-pre-wrap">{internship.description || 'No description available'}</p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <h2 className="text-xl font-semibold text-[#263238] mb-4">Company Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#717171] mb-2">Company Name</h3>
                  <p className="text-[#263238]">{internship.company.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#717171] mb-2">District</h3>
                  <p className="text-[#263238]">{internship.company.district || 'Not specified'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#717171] mb-2">Address</h3>
                  <p className="text-[#263238]">{internship.company.address || 'Not specified'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#717171] mb-2">Website</h3>
                  {internship.company.website ? (
                    <a 
                      href={internship.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#1D5D9B] hover:text-[#174A7C] flex items-center space-x-1"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-[#263238]">Not specified</p>
                  )}
                </div>

                {internship.company.description && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-[#717171] mb-2">About Company</h3>
                    <p className="text-[#263238]">{internship.company.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <h3 className="text-lg font-semibold text-[#263238] mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#1D5D9B]" />
                  <div>
                    <p className="text-sm font-medium text-[#717171]">Start Date</p>
                    <p className="text-[#263238]">{formatDate(internship.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#F4D160]" />
                  <div>
                    <p className="text-sm font-medium text-[#717171]">End Date</p>
                    <p className="text-[#263238]">{formatDate(internship.end_date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#E57373]" />
                  <div>
                    <p className="text-sm font-medium text-[#717171]">Application Deadline</p>
                    <p className={`${isDeadlinePassed(internship.application_deadline) ? 'text-[#E57373]' : 'text-[#263238]'}`}>
                      {formatDate(internship.application_deadline)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <h3 className="text-lg font-semibold text-[#263238] mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#1D5D9B]" />
                  <div>
                    <p className="text-sm font-medium text-[#717171]">Email</p>
                    <p className="text-[#263238]">{internship.contact_email || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#1D5D9B]" />
                  <div>
                    <p className="text-sm font-medium text-[#717171]">Phone</p>
                    <p className="text-[#263238]">{internship.contact_phone || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#717171]" />
                  <div>
                    <p className="text-sm font-medium text-[#717171]">Company Email</p>
                    <p className="text-[#263238]">{internship.company.contact_email || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#717171]" />
                  <div>
                    <p className="text-sm font-medium text-[#717171]">Company Phone</p>
                    <p className="text-[#263238]">{internship.company.contact_phone || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Internship Info */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
              <h3 className="text-lg font-semibold text-[#263238] mb-4">Internship Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#717171]">Internship ID:</span>
                  <span className="text-sm text-[#263238]">{internship.internship_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#717171]">Created:</span>
                  <span className="text-sm text-[#263238]">{formatDate(internship.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#717171]">Company ID:</span>
                  <span className="text-sm text-[#263238]">{internship.company.company_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-[#E57373]" />
                <h3 className="text-lg font-semibold text-[#263238]">Delete Internship</h3>
              </div>
              
              <p className="text-[#717171] mb-6">
                Are you sure you want to delete "{internship.title}"? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-[#C1DBF4] text-[#717171] rounded-lg hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInternship}
                  className="flex-1 px-4 py-2 bg-[#E57373] text-white rounded-lg hover:bg-[#D32F2F]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobDetails;