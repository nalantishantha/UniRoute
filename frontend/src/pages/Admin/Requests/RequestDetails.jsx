import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  X, 
  FileText, 
  Building2, 
  School, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Target,
  Tag,
  Download,
  Eye,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';
import AdminSidebar from '../../../components/common/Admin/Sidebar';
import AdminHeader from '../../../components/common/Admin/AdminHeader';
import RequestStatusBadge from "../../../components/Admin/RequestStatusBadge";

const RequestDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Mock data based on type
  const mockRequests = {
    advertisement: {
      id: 1,
      type: 'advertisement',
      title: 'Mathematics Tutoring Services',
      applicant: 'Dr. Kamal Perera',
      email: 'kamal.perera@email.com',
      phone: '+94 77 123 4567',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      description: 'Experienced mathematics tutor offering A/L and university level tutoring services. Specialized in Pure Mathematics, Applied Mathematics, and Statistics with over 10 years of teaching experience.',
      category: 'Education',
      targetAudience: 'A/L Students',
      duration: '30 days',
      budget: '$200',
      documents: [
        { name: 'Teaching_Certificate.pdf', size: '2.3 MB', type: 'pdf' },
        { name: 'Degree_Certificate.pdf', size: '1.8 MB', type: 'pdf' },
        { name: 'Experience_Letter.pdf', size: '1.2 MB', type: 'pdf' }
      ],
      qualifications: [
        'BSc Mathematics (University of Colombo)',
        'MSc Applied Mathematics (University of Peradeniya)',
        'Teaching Diploma (NIE)',
        '10+ years tutoring experience'
      ],
      adContent: {
        title: 'Expert Mathematics Tutoring',
        description: 'Get personalized mathematics tutoring from an experienced educator. Individual and group sessions available.',
        images: ['tutor_profile.jpg', 'certificates.jpg'],
        contactInfo: {
          email: 'kamal.perera@email.com',
          phone: '+94 77 123 4567',
          location: 'Colombo 07'
        }
      }
    },
    university: {
      id: 1,
      type: 'university',
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
      description: 'Leading private university in Sri Lanka offering diverse programs in computing, business, engineering, and medicine with state-of-the-art facilities.',
      faculties: ['Computing', 'Business', 'Engineering', 'Medicine', 'Law'],
      facilities: ['Library', 'Computer Labs', 'Sports Complex', 'Student Hostels', 'Medical Center'],
      programs: [
        { name: 'Computer Science', duration: '4 years', type: 'Undergraduate' },
        { name: 'Software Engineering', duration: '4 years', type: 'Undergraduate' },
        { name: 'Business Administration', duration: '4 years', type: 'Undergraduate' },
        { name: 'Civil Engineering', duration: '4 years', type: 'Undergraduate' }
      ],
      documents: [
        { name: 'University_License.pdf', size: '3.2 MB', type: 'pdf' },
        { name: 'Accreditation_Certificate.pdf', size: '2.8 MB', type: 'pdf' },
        { name: 'Faculty_Details.pdf', size: '4.1 MB', type: 'pdf' }
      ]
    },
    company: {
      id: 1,
      type: 'company',
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
      description: 'Leading IT company specializing in software development, consulting, and digital transformation solutions. We work with clients across various industries to deliver innovative technology solutions.',
      services: ['Software Development', 'Consulting', 'Cloud Services', 'Mobile Apps', 'Digital Transformation'],
      benefits: ['Health Insurance', 'Flexible Hours', 'Training Programs', 'Career Growth', 'Remote Work Options'],
      jobRoles: [
        { title: 'Software Engineer', level: 'Entry to Senior', department: 'Development' },
        { title: 'Business Analyst', level: 'Mid to Senior', department: 'Consulting' },
        { title: 'DevOps Engineer', level: 'Mid to Senior', department: 'Infrastructure' },
        { title: 'UI/UX Designer', level: 'Entry to Mid', department: 'Design' }
      ],
      documents: [
        { name: 'Company_Registration.pdf', size: '2.1 MB', type: 'pdf' },
        { name: 'Tax_Certificate.pdf', size: '1.5 MB', type: 'pdf' },
        { name: 'Company_Profile.pdf', size: '3.8 MB', type: 'pdf' }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequest(mockRequests[type]);
      setLoading(false);
    }, 1000);
  }, [type, id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequest(prev => ({ ...prev, status: 'approved' }));
      alert('Request approved successfully!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequest(prev => ({ ...prev, status: 'rejected', rejectionReason }));
      setShowRejectionModal(false);
      setRejectionReason('');
      alert('Request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'advertisement':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'university':
        return <School className="h-6 w-6 text-purple-500" />;
      case 'company':
        return <Building2 className="h-6 w-6 text-orange-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'advertisement':
        return 'text-blue-600';
      case 'university':
        return 'text-purple-600';
      case 'company':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

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

  if (!request) {
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
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Request not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The request you're looking for doesn't exist or has been removed.
                </p>
                <button
                  onClick={() => navigate('/admin/requests')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Back to Requests
                </button>
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin/requests')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  {getTypeIcon(request.type)}
                  <div>
                    <h1 className={`text-2xl font-bold ${getTypeColor(request.type)}`}>
                      {request.title || request.name}
                    </h1>
                    <p className="text-gray-600">
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request #{request.id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RequestStatusBadge status={request.status} size="md" />
                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => setShowRejectionModal(true)}
                      disabled={actionLoading}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {request.type === 'advertisement' ? 'Applicant Name' : 'Name'}
                      </label>
                      <p className="text-sm text-gray-900">{request.applicant || request.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">{request.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <p className="text-sm text-gray-900">{request.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Submitted Date
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {request.website && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <a 
                          href={request.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {request.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{request.description}</p>
                </div>

                {/* Type-specific Details */}
                {request.type === 'advertisement' && (
                  <>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Advertisement Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <p className="text-sm text-gray-900">{request.category}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Audience
                          </label>
                          <p className="text-sm text-gray-900">{request.targetAudience}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration
                          </label>
                          <p className="text-sm text-gray-900">{request.duration}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Budget
                          </label>
                          <p className="text-sm text-gray-900">{request.budget}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Qualifications
                        </label>
                        <ul className="space-y-1">
                          {request.qualifications.map((qual, index) => (
                            <li key={index} className="text-sm text-gray-900 flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              {qual}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {request.type === 'university' && (
                  <>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">University Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Established Year
                          </label>
                          <p className="text-sm text-gray-900">{request.establishedYear}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <p className="text-sm text-gray-900">{request.location}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student Count
                          </label>
                          <p className="text-sm text-gray-900">{request.studentCount}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Accreditation
                          </label>
                          <p className="text-sm text-gray-900">{request.accreditation}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Faculties
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {request.faculties.map((faculty, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                              {faculty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facilities
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {request.facilities.map((facility, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {request.type === 'company' && (
                  <>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Industry
                          </label>
                          <p className="text-sm text-gray-900">{request.industry}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employee Count
                          </label>
                          <p className="text-sm text-gray-900">{request.employeeCount}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Established Year
                          </label>
                          <p className="text-sm text-gray-900">{request.establishedYear}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <p className="text-sm text-gray-900">{request.location}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Services
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {request.services.map((service, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee Benefits
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {request.benefits.map((benefit, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Documents */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  <div className="space-y-3">
                    {request.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {request.status === 'approved' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Request Approved</p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                      </div>
                    )}
                    {request.status === 'rejected' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Request Rejected</p>
                          <p className="text-xs text-gray-500">Today</p>
                          {request.rejectionReason && (
                            <p className="text-xs text-gray-600 mt-1">
                              Reason: {request.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{request.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{request.phone}</p>
                      </div>
                    </div>
                    {request.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Website</p>
                          <a 
                            href={request.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {request.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Modal */}
            {showRejectionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Request</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please provide a reason for rejecting this request. This will be sent to the applicant.
                  </p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    placeholder="Enter rejection reason..."
                  />
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setShowRejectionModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading ? 'Rejecting...' : 'Reject Request'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestDetails;