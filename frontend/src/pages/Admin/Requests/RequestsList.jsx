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
import AdminSidebar from '../../../components/common/Admin/Sidebar';
import AdminHeader from '../../../components/common/Admin/AdminHeader';
import AdvertisementRequestsTable from "../../../components/Admin/AdvertisementRequestTable";
import UniversityRequestsTable from '../../../components/Admin/UniversityRequestsTable';
import CompanyRequestsTable from "../../../components/Admin/CompanyRequestTable";

const RequestsList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [advertisementRequests, setAdvertisementRequests] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Fetch advertisement requests from database
  const fetchAdvertisementRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/administration/advertisement-requests/');
      const result = await response.json();
      
      if (result.success) {
        // Show only first 3 requests for summary
        setAdvertisementRequests(result.requests.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching advertisement requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisementRequests();
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

  const getTotalStats = () => {
    return {
      total: advertisementRequests.length,
      pending: advertisementRequests.filter(r => r.status === 'Pending').length,
      approved: advertisementRequests.filter(r => r.status === 'Confirmed').length,
      rejected: advertisementRequests.filter(r => r.status === 'Rejected').length
    };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          handleLogout={handleLogout}
        />
        
        <div className="lg:ml-72">
          <AdminHeader 
            toggleSidebar={toggleSidebar}
            user={user}
            handleLogout={handleLogout}
          />
          
          <main className="pt-16">
            <div className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        handleLogout={handleLogout}
      />
      
      <div className="lg:ml-72">
        <AdminHeader 
          toggleSidebar={toggleSidebar}
          user={user}
          handleLogout={handleLogout}
        />
        
        <main className="pt-16">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Requests Management</h1>
                  <p className="text-gray-600">Manage advertisement, university, and company registration requests</p>
                </div>
              </div>
            </div>

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

            {/* University Requests - Placeholder */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <School className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">University Registration Requests</h2>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  0
                </span>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">University registration requests will appear here</p>
              </div>
            </div>

            {/* Company Requests - Placeholder */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">Company Registration Requests</h2>
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  0
                </span>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Company registration requests will appear here</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsList;