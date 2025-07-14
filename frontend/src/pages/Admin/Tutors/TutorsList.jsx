import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  GraduationCap,
  Book,
  Star,
  Award,
  Clock,
  UserCheck,
  UserX,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const TutorsList = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    experience: 'all'
  });

  // Mock data for tutors
  const mockTutors = [
    {
      id: 1,
      first_name: 'Priya',
      last_name: 'Fernando',
      email: 'priya.fernando@edutech.lk',
      contact_number: '0771234567',
      subjects: ['Mathematics', 'Physics'],
      qualification: 'B.Sc. in Mathematics',
      experience_years: 2,
      hourly_rate: 2500,
      location: 'Colombo',
      rating: 4.8,
      total_students: 45,
      is_verified: true,
      is_active: true,
      created_at: '2024-01-15T08:30:00Z',
      last_login: '2024-01-20T10:15:00Z'
    },
    {
      id: 2,
      first_name: 'Kasun',
      last_name: 'Silva',
      email: 'kasun.silva@tutor.lk',
      contact_number: '0777654321',
      subjects: ['Chemistry', 'Biology'],
      qualification: 'M.Sc. in Chemistry',
      experience_years: 4,
      hourly_rate: 3000,
      location: 'Kandy',
      rating: 4.9,
      total_students: 32,
      is_verified: true,
      is_active: true,
      created_at: '2024-01-10T09:00:00Z',
      last_login: '2024-01-20T14:30:00Z'
    },
    {
      id: 3,
      first_name: 'Nimal',
      last_name: 'Perera',
      email: 'nimal.perera@teach.lk',
      contact_number: '0769876543',
      subjects: ['English', 'Literature'],
      qualification: 'B.A. in English Literature',
      experience_years: 3,
      hourly_rate: 2000,
      location: 'Gampaha',
      rating: 4.6,
      total_students: 28,
      is_verified: false,
      is_active: true,
      created_at: '2024-01-12T11:15:00Z',
      last_login: '2024-01-19T16:45:00Z'
    }
  ];

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTutors(mockTutors);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutor?')) {
      try {
        // Simulate API call
        setTutors(tutors.filter(tutor => tutor.id !== id));
      } catch (error) {
        console.error('Error deleting tutor:', error);
      }
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && tutor.is_active) ||
      (filters.status === 'inactive' && !tutor.is_active) ||
      (filters.status === 'verified' && tutor.is_verified) ||
      (filters.status === 'unverified' && !tutor.is_verified);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (tutor) => {
    if (!tutor.is_active) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>;
    }
    if (!tutor.is_verified) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Unverified</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tutors Management</h1>
              <p className="text-gray-600">Manage tutors and their information</p>
            </div>
          </div>
          <Link
            to="/admin/tutors/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Tutor</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tutors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tutors</p>
                <p className="text-2xl font-semibold text-gray-900">{tutors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tutors.filter(t => t.is_verified).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tutors.length > 0 ? (tutors.reduce((sum, t) => sum + t.rating, 0) / tutors.length).toFixed(1) : '0'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tutors.reduce((sum, t) => sum + t.total_students, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tutors Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate/Hour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTutors.map((tutor) => (
                  <tr key={tutor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {tutor.first_name[0]}{tutor.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tutor.first_name} {tutor.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {tutor.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {tutor.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.map((subject, index) => (
                          <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {subject}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{tutor.qualification}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {tutor.experience_years} years
                      </div>
                      <div className="text-sm text-gray-500">{tutor.total_students} students</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {tutor.hourly_rate.toLocaleString()}/hr
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">{tutor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tutor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/tutors/${tutor.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/tutors/${tutor.id}/edit`}
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tutor.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTutors.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tutors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filters.status !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding a new tutor.'}
              </p>
              {(!searchTerm && filters.status === 'all') && (
                <div className="mt-6">
                  <Link
                    to="/admin/tutors/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tutor
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TutorsList;
