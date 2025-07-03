import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Building2,
  Edit,
  Trash2,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Users,
  Building,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  UserPlus,
  BookOpen,
  TrendingUp,
  BarChart3,
  Star,
  FileText
} from 'lucide-react';

const UniversityView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock university data
  const mockUniversity = {
    id: 1,
    name: 'University of Colombo',
    short_name: 'UOC',
    type: 'public',
    location: 'Colombo',
    address: 'College House, University of Colombo, Colombo 03',
    contact_number: '0112581835',
    email: 'info@cmb.ac.lk',
    website: 'https://www.cmb.ac.lk',
    established_year: 1921,
    total_students: 12500,
    total_faculties: 8,
    ranking: 1,
    accreditation: 'UGC Approved',
    description: 'The University of Colombo is a leading public university in Sri Lanka, established in 1921. It offers undergraduate and postgraduate programs across various disciplines including Arts, Science, Medicine, Law, Management & Finance, and Education.',
    logo_url: '',
    is_active: true,
    created_at: '2024-01-10T08:30:00Z',
    updated_at: '2024-01-20T14:15:00Z',
    // Additional statistics
    undergraduate_students: 10500,
    postgraduate_students: 2000,
    international_students: 250,
    faculty_staff: 850,
    non_academic_staff: 1200,
    programs_offered: 45,
    research_projects: 120
  };

  const faculties = [
    { name: 'Faculty of Arts', students: 2800, programs: 12 },
    { name: 'Faculty of Science', students: 2200, programs: 8 },
    { name: 'Faculty of Medicine', students: 1500, programs: 3 },
    { name: 'Faculty of Law', students: 800, programs: 2 },
    { name: 'Faculty of Management & Finance', students: 3200, programs: 6 },
    { name: 'Faculty of Education', students: 1200, programs: 4 },
    { name: 'Faculty of Technology', students: 800, programs: 5 },
    { name: 'Faculty of Graduate Studies', students: 200, programs: 5 }
  ];

  const recentUpdates = [
    {
      id: 1,
      type: 'enrollment',
      title: 'New Student Enrollment',
      description: '450 new students enrolled for the 2024 academic year',
      date: '2024-01-18'
    },
    {
      id: 2,
      type: 'program',
      title: 'New Program Launch',
      description: 'Master of Data Science program launched',
      date: '2024-01-15'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Research Grant Received',
      description: 'Rs. 25M research grant awarded for AI research',
      date: '2024-01-12'
    }
  ];

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const fetchUniversity = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUniversity(mockUniversity);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching university:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this university? This action cannot be undone.')) {
      try {
        // Simulate API call
        setMessage({ type: 'success', text: 'University deleted successfully!' });
        setTimeout(() => {
          navigate('/admin/universities');
        }, 1500);
      } catch (error) {
        console.error('Error deleting university:', error);
        setMessage({ type: 'error', text: 'Failed to delete university' });
      }
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus = !university.is_active;
      setUniversity(prev => ({ ...prev, is_active: newStatus }));
      setMessage({ 
        type: 'success', 
        text: `University ${newStatus ? 'activated' : 'deactivated'} successfully!` 
      });
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">University not found</h3>
          <p className="mt-1 text-sm text-gray-500">The university you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              to="/admin/universities"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Universities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/universities"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{university.name}</h1>
            <p className="text-gray-600">University Details</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/admin/universities/${university.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  university.type === 'public' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {university.type === 'public' ? 'Public University' : 'Private University'}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  university.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {university.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">University Name</p>
                  <p className="text-sm text-gray-900">{university.name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Short Name</p>
                  <p className="text-sm text-gray-900">{university.short_name}</p>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location & Address</p>
                    <p className="text-sm text-gray-900">{university.location}</p>
                    <p className="text-sm text-gray-600">{university.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Established</p>
                    <p className="text-sm text-gray-900">{university.established_year}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Number</p>
                    <p className="text-sm text-gray-900">{university.contact_number}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{university.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a 
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {university.website}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ranking & Accreditation</p>
                    <p className="text-sm text-gray-900">Rank #{university.ranking}</p>
                    <p className="text-sm text-gray-600">{university.accreditation}</p>
                  </div>
                </div>
              </div>
            </div>

            {university.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                    <p className="text-sm text-gray-700">{university.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statistics Overview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics Overview</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{university.total_students.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{university.total_faculties}</p>
                <p className="text-sm text-gray-600">Faculties</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{university.programs_offered}</p>
                <p className="text-sm text-gray-600">Programs</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{university.research_projects}</p>
                <p className="text-sm text-gray-600">Research Projects</p>
              </div>
            </div>
          </div>

          {/* Faculties */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculties</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programs
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faculties.map((faculty, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {faculty.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {faculty.students.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {faculty.programs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
            
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    update.type === 'enrollment' ? 'bg-blue-100' :
                    update.type === 'program' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {update.type === 'enrollment' && <Users className="h-4 w-4 text-blue-600" />}
                    {update.type === 'program' && <BookOpen className="h-4 w-4 text-green-600" />}
                    {update.type === 'achievement' && <Award className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{update.title}</h4>
                    <p className="text-sm text-gray-600">{update.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(update.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Detailed Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Undergraduate Students</span>
                <span className="text-sm font-semibold text-gray-900">{university.undergraduate_students.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Postgraduate Students</span>
                <span className="text-sm font-semibold text-gray-900">{university.postgraduate_students.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">International Students</span>
                <span className="text-sm font-semibold text-gray-900">{university.international_students}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Faculty Staff</span>
                <span className="text-sm font-semibold text-gray-900">{university.faculty_staff}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Non-Academic Staff</span>
                <span className="text-sm font-semibold text-gray-900">{university.non_academic_staff}</span>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created Date</p>
                <p className="text-sm text-gray-900">{formatDate(university.created_at)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">{formatDate(university.updated_at)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">University ID</p>
                <p className="text-sm text-gray-900 font-mono">#{university.id}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={toggleStatus}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  university.is_active
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {university.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <span>{university.is_active ? 'Deactivate' : 'Activate'} University</span>
              </button>

              <Link
                to={`/admin/universities/${university.id}/students`}
                className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>View All Students</span>
              </Link>

              <Link
                to={`/admin/universities/${university.id}/programs`}
                className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>View Programs</span>
              </Link>

              <Link
                to={`/admin/universities/${university.id}/analytics`}
                className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>View Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityView;
