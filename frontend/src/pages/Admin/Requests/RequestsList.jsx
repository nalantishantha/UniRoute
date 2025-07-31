import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  FileText,
  Building2,
  School,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ChevronLeft,
  RefreshCw,
  AlertCircle,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const RequestsList = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [advertisementRequests, setAdvertisementRequests] = useState([]);
  const [universityRequests, setUniversityRequests] = useState([]);
  const [companyRequests, setCompanyRequests] = useState([]);
  const [statistics, setStatistics] = useState({
    total_requests: 0,
    pending_requests: 0,
    approved_requests: 0,
    rejected_requests: 0,
    recent_requests: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAdvertisementRequests(),
        fetchUniversityRequests(),
        fetchCompanyRequests()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load requests data' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisementRequests = async () => {
    try {
      const response = await fetch('/api/administration/advertisement-requests/');
      const result = await response.json();
      
      if (result.success) {
        setAdvertisementRequests(result.requests.slice(0, 5)); // Show top 5
      }
    } catch (error) {
      console.error('Error fetching advertisement requests:', error);
    }
  };

  const fetchUniversityRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/universities/requests/?status=all');
      const result = await response.json();
      
      if (result.results) {
        setUniversityRequests(result.results.slice(0, 5)); // Show top 5
      }
    } catch (error) {
      console.error('Error fetching university requests:', error);
    }
  };

  const fetchCompanyRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/companies/requests/');
      const result = await response.json();
      
      if (result.success) {
        setCompanyRequests(result.requests.slice(0, 5)); // Show top 5
      }
    } catch (error) {
      console.error('Error fetching company requests:', error);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayValue = (value) => {
    return (value && value !== 'undefined') ? value : 'N/A';
  };

  const getTotalStats = () => {
    const adStats = {
      total: advertisementRequests.length,
      pending: advertisementRequests.filter(r => r.status === 'Pending' || r.status === 'pending').length,
      approved: advertisementRequests.filter(r => r.status === 'Confirmed' || r.status === 'approved').length,
      rejected: advertisementRequests.filter(r => r.status === 'Rejected' || r.status === 'rejected').length
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

  return (
    <AdminLayout pageTitle="Requests" pageDescription="Manage all platform registration and advertisement requests">
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
                  <FileText className="h-6 w-6 text-purple-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Requests Management</h1>
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
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading requests...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Advertisement Requests Section */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg shadow-sm">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Advertisement Requests</h2>
                        <p className="text-sm text-gray-600">Recent advertisement booking requests from universities</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {advertisementRequests.length} recent
                      </span>
                      <Link
                        to="/admin/requests/advertisements"
                        className="flex items-center space-x-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors text-sm font-medium shadow-sm"
                      >
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
                
                {advertisementRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Request Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Space & Pricing
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {advertisementRequests.map((request, index) => (
                          <tr key={request.booking_id || index} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {getDisplayValue(request.title)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {getDisplayValue(request.university_name)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {getDisplayValue(request.space_name)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${getDisplayValue(request.total_price)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(request.start_date)} - {formatDate(request.end_date)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(request.created_at)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                request.status === 'Pending' || request.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : request.status === 'Confirmed' || request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                to={`/admin/requests/advertisements`}
                                className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                                title="View Advertisement Request Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No advertisement requests found</p>
                  </div>
                )}
              </div>

              {/* University Requests Section */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-3 rounded-lg shadow-sm">
                        <School className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">University Registration Requests</h2>
                        <p className="text-sm text-gray-600">New university registration applications awaiting approval</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-purple-200 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {universityRequests.length} recent
                      </span>
                      <Link
                        to="/admin/requests/universities"
                        className="flex items-center space-x-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors text-sm font-medium shadow-sm"
                      >
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
                
                {universityRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            University Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Information
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {universityRequests.map((request, index) => (
                          <tr key={request.request_id || index} className="hover:bg-purple-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                  <School className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {getDisplayValue(request.university_name)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDate(request.submitted_at)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {getDisplayValue(request.contact_person_name)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {getDisplayValue(request.email)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  {getDisplayValue(request.location)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                request.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                to={`/admin/requests/universities`}
                                className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                                title="View University Registration Request Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No university registration requests found</p>
                  </div>
                )}
              </div>

              {/* Company Requests Section */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-3 rounded-lg shadow-sm">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Company Registration Requests</h2>
                        <p className="text-sm text-gray-600">New company registration applications awaiting approval</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-indigo-200 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {companyRequests.length} recent
                      </span>
                      <Link
                        to="/admin/requests/companies"
                        className="flex items-center space-x-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors text-sm font-medium shadow-sm"
                      >
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
                
                {companyRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Person
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Industry
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {companyRequests.map((request, index) => (
                          <tr key={request.request_id || index} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                  <Building2 className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {getDisplayValue(request.company_name)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {getDisplayValue(request.email)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {getDisplayValue(request.contact_person_name)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {getDisplayValue(request.contact_person_title)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {getDisplayValue(request.industry)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                request.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                to={`/admin/requests/companies`}
                                className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                                title="View Company Registration Request Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No company registration requests found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RequestsList;