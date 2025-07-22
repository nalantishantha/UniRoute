import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  School, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import AdvertisementRequestsTable from "../../../components/Admin/AdvertisementRequestTable";
import UniversityRequestsTable from '../../../components/Admin/UniversityRequestsTable';
import CompanyRequestsTable from "../../../components/Admin/CompanyRequestTable";

const RequestsList = () => {
  const [loading, setLoading] = useState(true);
  const [advertisementRequests, setAdvertisementRequests] = useState([]);
  const [universityRequests, setUniversityRequests] = useState([]);
  const [companyRequests, setCompanyRequests] = useState([]);
  const navigate = useNavigate();

  // Fetch advertisement requests from database
  const fetchAdvertisementRequests = async () => {
    try {
      const response = await fetch('/api/administration/advertisement-requests/');
      const result = await response.json();
      
      if (result.success) {
        // Show only first 3 requests for summary
        setAdvertisementRequests(result.requests.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching advertisement requests:', error);
    }
  };

  // Fetch university requests from database
  const fetchUniversityRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/universities/requests/?status=all');
      const result = await response.json();
      
      if (result.results) {
        // Show only first 3 requests for summary
        setUniversityRequests(result.results.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching university requests:', error);
    }
  };

  // Fetch company requests from database
  const fetchCompanyRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/companies/requests/');
      const result = await response.json();
      
      if (result.success) {
        // Show only first 3 requests for summary
        setCompanyRequests(result.requests.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching company requests:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAdvertisementRequests(),
        fetchUniversityRequests(),
        fetchCompanyRequests()
      ]);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Mock user data
  const user = {
    first_name: 'John',
    last_name: 'Admin',
    email: 'admin@uniroute.com'
  };

  const handleViewAllAds = () => {
    navigate('/admin/requests/advertisements');
  };

  const handleViewAllUniversities = () => {
    navigate('/admin/requests/universities');
  };

  const handleViewAllCompanies = () => {
    navigate('/admin/requests/companies');
  };

  const getTotalStats = () => {
    const adStats = {
      total: advertisementRequests.length,
      pending: advertisementRequests.filter(r => r.status === 'Pending').length,
      approved: advertisementRequests.filter(r => r.status === 'Confirmed').length,
      rejected: advertisementRequests.filter(r => r.status === 'Rejected').length
    };

    const uniStats = {
      total: universityRequests.length,
      pending: universityRequests.filter(r => r.status === 'pending').length,
      approved: universityRequests.filter(r => r.status === 'approved').length,
      rejected: universityRequests.filter(r => r.status === 'rejected').length
    };

    const companyStats = {
      total: companyRequests.length,
      pending: companyRequests.filter(r => r.status === 'pending').length,
      approved: companyRequests.filter(r => r.status === 'approved').length,
      rejected: companyRequests.filter(r => r.status === 'rejected').length
    };

    return {
      total: adStats.total + uniStats.total + companyStats.total,
      pending: adStats.pending + uniStats.pending + companyStats.pending,
      approved: adStats.approved + uniStats.approved + companyStats.approved,
      rejected: adStats.rejected + uniStats.rejected + companyStats.rejected
    };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <AdminLayout pageTitle="Requests" pageDescription="Loading requests...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Requests Management" pageDescription="View and manage all platform requests">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Advertisement Requests */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Advertisement Requests</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {advertisementRequests.length}
                  </span>
                </div>
                <button 
                  onClick={handleViewAllAds}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              {loading ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading advertisement requests...</span>
                  </div>
                </div>
              ) : advertisementRequests.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {advertisementRequests.map((request, index) => (
                          <tr key={request.booking_id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{request.university_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.space_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${request.total_price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No advertisement requests found</p>
                </div>
              )}
            </div>

            {/* University Requests */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <School className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">University Registration Requests</h2>
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {universityRequests.length}
                  </span>
                </div>
                <button 
                  onClick={handleViewAllUniversities}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              {loading ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Loading university requests...</span>
                  </div>
                </div>
              ) : universityRequests.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {universityRequests.map((request, index) => (
                          <tr key={request.request_id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{request.university_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.contact_person_name}</div>
                              <div className="text-sm text-gray-500">{request.contact_person_title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.submitted_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                  <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No university registration requests found</p>
                </div>
              )}
            </div>

            {/* Company Requests */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Company Registration Requests</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {companyRequests.length}
                  </span>
                </div>
                <button 
                  onClick={handleViewAllCompanies}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              {loading ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading company requests...</span>
                  </div>
                </div>
              ) : companyRequests.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {companyRequests.map((request) => (
                          <tr key={request.request_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{request.company_name}</div>
                                  <div className="text-sm text-gray-500">{request.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.contact_person_name}</div>
                              <div className="text-sm text-gray-500">{request.contact_person_title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.industry || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.request_date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No company registration requests found</p>
                </div>
              )}
            </div>
    </AdminLayout>
  );
};

export default RequestsList;