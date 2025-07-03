import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CompanyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock company data
  const mockCompanies = [
    {
      id: 1,
      name: 'Tech Solutions Inc',
      description: 'Leading technology solutions provider specializing in innovative software development and digital transformation services for businesses worldwide.',
      industry: 'Technology',
      website: 'https://techsolutions.com',
      email: 'contact@techsolutions.com',
      phone: '+1-555-0123',
      address: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA',
      establishedYear: '2010',
      employeeCount: '500-1000',
      isPartner: true,
      logoUrl: 'https://via.placeholder.com/100',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z'
    },
    {
      id: 2,
      name: 'Global Consulting Group',
      description: 'International business consulting firm providing strategic advice and implementation services to Fortune 500 companies across multiple industries.',
      industry: 'Consulting',
      website: 'https://globalconsulting.com',
      email: 'info@globalconsulting.com',
      phone: '+1-555-0124',
      address: '456 Business Ave',
      city: 'New York',
      country: 'USA',
      establishedYear: '2005',
      employeeCount: '1000+',
      isPartner: false,
      logoUrl: 'https://via.placeholder.com/100',
      status: 'active',
      createdAt: '2024-01-10T08:15:00Z',
      updatedAt: '2024-01-18T16:20:00Z'
    }
  ];

  useEffect(() => {
    // Mock API call
    const fetchCompany = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundCompany = mockCompanies.find(c => c.id === parseInt(id));
        setCompany(foundCompany);
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <p className="text-gray-600 mb-6">The company you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/companies')}
            className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {company.logoUrl && (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(company.status)}
                {company.isPartner && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Partner
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/admin/companies/edit/${company.id}`)}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            >
              Edit
            </button>
            <button
              onClick={() => navigate('/admin/companies')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <p className="mt-1 text-sm text-gray-900">{company.industry || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Established Year</label>
              <p className="mt-1 text-sm text-gray-900">{company.establishedYear || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Count</label>
              <p className="mt-1 text-sm text-gray-900">{company.employeeCount || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-sky-600 hover:text-sky-800"
                >
                  {company.website}
                </a>
              ) : (
                <p className="mt-1 text-sm text-gray-900">N/A</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <a
                href={`mailto:${company.email}`}
                className="mt-1 text-sm text-sky-600 hover:text-sky-800"
              >
                {company.email}
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{company.phone || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">
                {[company.address, company.city, company.country].filter(Boolean).join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{company.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-medium text-gray-700">Created At</label>
              <p className="text-gray-600">{formatDate(company.createdAt)}</p>
            </div>
            <div>
              <label className="block font-medium text-gray-700">Last Updated</label>
              <p className="text-gray-600">{formatDate(company.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => navigate('/admin/companies')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/admin/companies/edit/${company.id}`)}
            className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
          >
            Edit Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyView;
