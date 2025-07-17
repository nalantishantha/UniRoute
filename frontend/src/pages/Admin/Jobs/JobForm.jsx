import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const JobForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(jobId);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    company_id: '',
    title: '',
    description: '',
    location: '',
    stipend: '',
    start_date: '',
    end_date: '',
    application_deadline: '',
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    fetchCompanies();
    if (isEdit) {
      fetchInternshipDetails();
    }
  }, [isEdit, jobId]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies/internships/companies/');
      const data = await response.json();
      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchInternshipDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/companies/internships/${jobId}/`);
      const data = await response.json();

      if (data.success) {
        const internship = data.internship;
        setFormData({
          company_id: internship.company.company_id,
          title: internship.title,
          description: internship.description || '',
          location: internship.location || '',
          stipend: internship.stipend || '',
          start_date: internship.start_date || '',
          end_date: internship.end_date || '',
          application_deadline: internship.application_deadline || '',
          contact_email: internship.contact_email || '',
          contact_phone: internship.contact_phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching internship details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.company_id) {
      setMessage({ type: 'error', text: 'Company is required' });
      return false;
    }
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Job title is required' });
      return false;
    }
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      setMessage({ type: 'error', text: 'Start date cannot be after end date' });
      return false;
    }
    if (formData.application_deadline && formData.start_date && formData.application_deadline > formData.start_date) {
      setMessage({ type: 'error', text: 'Application deadline cannot be after start date' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const url = isEdit 
        ? `/api/companies/internships/${jobId}/update/`
        : '/api/companies/internships/create/';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({
          type: 'success',
          text: isEdit ? 'Internship updated successfully!' : 'Internship created successfully!'
        });
        
        setTimeout(() => {
          navigate('/admin/jobs');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Operation failed'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save internship. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isEdit ? 'Edit Job' : 'Create New Job';
  const pageDescription = isEdit ? 'Update internship opportunity details' : 'Add a new internship opportunity';

  return (
    <AdminLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center space-x-2 text-[#717171] hover:text-[#263238]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Jobs</span>
          </button>
          
          <h1 className="text-2xl font-bold text-[#263238]">{pageTitle}</h1>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-[#4CAF50]/10 border border-[#4CAF50]/20' 
              : 'bg-[#E57373]/10 border border-[#E57373]/20'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
            ) : (
              <AlertCircle className="h-5 w-5 text-[#E57373]" />
            )}
            <span className={`text-sm font-medium ${
              message.type === 'success' ? 'text-[#4CAF50]' : 'text-[#E57373]'
            }`}>
              {message.text}
            </span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium text-[#717171] mb-2">
                Company *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                <select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.name} - {company.district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-[#717171] mb-2">
                Job Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  placeholder="Enter job title"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#717171] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                placeholder="Enter job description..."
              />
            </div>

            {/* Location and Stipend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  Stipend
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="text"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="Enter stipend amount"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  Application Deadline
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="date"
                    name="application_deadline"
                    value={formData.application_deadline}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="Enter contact email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#717171] mb-2">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#1D5D9B]/90 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{isEdit ? 'Update Job' : 'Create Job'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default JobForm;