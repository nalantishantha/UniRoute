import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  School, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import AdminSidebar from '../../../components/common/Admin/sidebar';
import AdminHeader from '../../../components/common/Admin/AdminHeader';
import AdvertisementRequestsTable from "../../../components/Admin/AdvertisementRequestTable";
import UniversityRequestsTable from '../../../components/Admin/UniversityRequestsTable';
import CompanyRequestsTable from "../../../components/Admin/CompanyRequestTable";

const RequestsList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({
    advertisements: [],
    universities: [],
    companies: []
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Mock user data
  const user = {
    first_name: 'John',
    last_name: 'Admin',
    email: 'admin@uniroute.com'
  };

  // Mock data
  const mockData = {
    advertisements: [
      {
        id: 1,
        title: 'Mathematics Tutoring Services',
        applicant: 'Dr. Kamal Perera',
        email: 'kamal.perera@email.com',
        phone: '+94 77 123 4567',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
        category: 'Education',
        targetAudience: 'A/L Students',
        duration: '30 days',
        budget: '$200',
        qualifications: ['BSc Mathematics', 'MSc Applied Mathematics', '10+ years experience'],
        description: 'Experienced mathematics tutor offering A/L and university level tutoring'
      },
      {
        id: 2,
        title: 'Private University Degree Programs',
        applicant: 'ABC International University',
        email: 'marketing@abc.edu',
        phone: '+94 11 234 5678',
        status: 'approved',
        submittedAt: '2024-01-10T16:45:00Z',
        category: 'Education',
        targetAudience: 'Undergraduate Students',
        duration: '60 days',
        budget: '$500',
        qualifications: ['UGC Approved', 'International Accreditation'],
        description: 'Promoting undergraduate and postgraduate degree programs'
      },
      {
        id: 3,
        title: 'English Language Classes',
        applicant: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+94 77 987 6543',
        status: 'rejected',
        submittedAt: '2024-01-08T11:20:00Z',
        category: 'Language',
        targetAudience: 'All Students',
        duration: '45 days',
        budget: '$300',
        qualifications: ['TESOL Certified', 'Native English Speaker'],
        description: 'Professional English language tutoring for all levels'
      }
    ],
    universities: [
      {
        id: 1,
        name: 'NSBM Green University',
        email: 'admin@nsbm.ac.lk',
        phone: '+94 11 544 5000',
        status: 'pending',
        submittedAt: '2024-01-14T14:20:00Z',
        establishedYear: '2001',
        location: 'Pitipana, Homagama',
        studentCount: '6800+',
        accreditation: 'UGC Approved',
        website: 'https://nsbm.ac.lk',
        description: 'Leading private university in Sri Lanka offering diverse programs',
        faculties: ['Computing', 'Business', 'Engineering', 'Medicine'],
        facilities: ['Library', 'Labs', 'Sports Complex', 'Hostels']
      },
      {
        id: 2,
        name: 'Sri Lanka Institute of Information Technology',
        email: 'info@sliit.lk',
        phone: '+94 11 754 4801',
        status: 'approved',
        submittedAt: '2024-01-12T09:15:00Z',
        establishedYear: '1999',
        location: 'Malabe',
        studentCount: '8000+',
        accreditation: 'UGC Approved',
        website: 'https://sliit.lk',
        description: 'Premier IT education institute in Sri Lanka',
        faculties: ['Computing', 'Engineering', 'Business', 'Humanities'],
        facilities: ['Modern Labs', 'Library', 'Cafeteria', 'Parking']
      }
    ],
    companies: [
      {
        id: 1,
        name: 'TechCorp Solutions',
        email: 'hr@techcorp.com',
        phone: '+94 11 123 4567',
        status: 'pending',
        submittedAt: '2024-01-13T11:30:00Z',
        industry: 'Technology',
        employeeCount: '250+',
        establishedYear: '2015',
        location: 'Colombo 03',
        website: 'https://techcorp.com',
        description: 'IT company specializing in software development and consulting',
        services: ['Software Development', 'Consulting', 'Cloud Services', 'Mobile Apps'],
        benefits: ['Health Insurance', 'Flexible Hours', 'Training Programs', 'Career Growth']
      },
      {
        id: 2,
        name: 'Creative Marketing Agency',
        email: 'info@creative.lk',
        phone: '+94 11 987 6543',
        status: 'approved',
        submittedAt: '2024-01-11T15:45:00Z',
        industry: 'Marketing',
        employeeCount: '50+',
        establishedYear: '2018',
        location: 'Colombo 07',
        website: 'https://creative.lk',
        description: 'Full-service marketing agency specializing in digital marketing',
        services: ['Digital Marketing', 'Brand Design', 'Social Media', 'Content Creation'],
        benefits: ['Competitive Salary', 'Creative Environment', 'Flexible Work', 'Team Events']
      },
      {
        id: 3,
        name: 'Green Energy Solutions',
        email: 'contact@greenenergy.lk',
        phone: '+94 11 456 7890',
        status: 'rejected',
        submittedAt: '2024-01-09T10:20:00Z',
        industry: 'Energy',
        employeeCount: '100+',
        establishedYear: '2020',
        location: 'Colombo 05',
        website: 'https://greenenergy.lk',
        description: 'Renewable energy solutions provider',
        services: ['Solar Solutions', 'Wind Energy', 'Energy Consulting', 'Installation'],
        benefits: ['Environmental Impact', 'Innovation Focus', 'Growth Opportunities', 'Team Building']
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRequestAction = (type, requestId, action) => {
    setRequests(prev => ({
      ...prev,
      [type]: prev[type].map(request =>
        request.id === requestId
          ? { ...request, status: action }
          : request
      )
    }));
  };

  const getTotalStats = () => {
    const allRequests = [
      ...requests.advertisements,
      ...requests.universities,
      ...requests.companies
    ];
    
    return {
      total: allRequests.length,
      pending: allRequests.filter(r => r.status === 'pending').length,
      approved: allRequests.filter(r => r.status === 'approved').length,
      rejected: allRequests.filter(r => r.status === 'rejected').length
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
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Advertisement Requests</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {requests.advertisements.length}
                </span>
              </div>
              <AdvertisementRequestsTable 
                requests={requests.advertisements}
                onAction={(id, action) => handleRequestAction('advertisements', id, action)}
              />
            </div>

            {/* University Requests */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <School className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">University Registration Requests</h2>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {requests.universities.length}
                </span>
              </div>
              <UniversityRequestsTable 
                requests={requests.universities}
                onAction={(id, action) => handleRequestAction('universities', id, action)}
              />
            </div>

            {/* Company Requests */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">Company Registration Requests</h2>
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {requests.companies.length}
                </span>
              </div>
              <CompanyRequestsTable 
                requests={requests.companies}
                onAction={(id, action) => handleRequestAction('companies', id, action)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsList;