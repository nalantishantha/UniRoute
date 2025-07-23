import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  Users,
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Calendar,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';

const CounsellorsList = () => {
  const navigate = useNavigate();
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: 'all',
    experience: 'all',
    status: 'all',
    location: 'all'
  });

  // Mock data for counsellors
  const mockCounsellors = [
    {
      id: 1,
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@uniroute.lk',
      phone: '0771234567',
      location: 'Colombo',
      specialization: 'Career Guidance',
      experience_years: 8,
      qualification: 'PhD in Psychology',
      bio: 'Experienced career counsellor specializing in helping students discover their career paths.',
      total_students: 245,
      rating: 4.8,
      sessions_completed: 312,
      is_active: true,
      is_verified: true,
      profile_image: '',
      joined_date: '2020-03-15',
      availability: 'full-time'
    },
    {
      id: 2,
      first_name: 'Prof. Michael',
      last_name: 'Silva',
      email: 'michael.silva@uniroute.lk',
      phone: '0712345678',
      location: 'Kandy',
      specialization: 'Academic Planning',
      experience_years: 12,
      qualification: 'Master in Education',
      bio: 'Academic counsellor helping students plan their educational journey.',
      total_students: 189,
      rating: 4.9,
      sessions_completed: 278,
      is_active: true,
      is_verified: true,
      profile_image: '',
      joined_date: '2018-07-20',
      availability: 'full-time'
    },
    {
      id: 3,
      first_name: 'Ms. Priya',
      last_name: 'Perera',
      email: 'priya.perera@uniroute.lk',
      phone: '0763456789',
      location: 'Galle',
      specialization: 'Mental Health',
      experience_years: 6,
      qualification: 'Master in Clinical Psychology',
      bio: 'Mental health counsellor providing support for student wellbeing.',
      total_students: 156,
      rating: 4.7,
      sessions_completed: 203,
      is_active: true,
      is_verified: true,
      profile_image: '',
      joined_date: '2021-01-10',
      availability: 'part-time'
    },
    {
      id: 4,
      first_name: 'Mr. Rohan',
      last_name: 'Fernando',
      email: 'rohan.fernando@uniroute.lk',
      phone: '0754567890',
      location: 'Negombo',
      specialization: 'University Admissions',
      experience_years: 5,
      qualification: 'Bachelor in Education',
      bio: 'Specialist in university admission processes and entrance exam preparation.',
      total_students: 98,
      rating: 4.6,
      sessions_completed: 134,
      is_active: false,
      is_verified: true,
      profile_image: '',
      joined_date: '2022-05-08',
      availability: 'part-time'
    }
  ];

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCounsellors(mockCounsellors);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this counsellor?')) {
      try {
        // Simulate API call
        setCounsellors(counsellors.filter(counsellor => counsellor.id !== id));
      } catch (error) {
        console.error('Error deleting counsellor:', error);
      }
    }
  };

  const filteredCounsellors = counsellors.filter(counsellor => {
    const matchesSearch = 
      counsellor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counsellor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counsellor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counsellor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization = filters.specialization === 'all' || counsellor.specialization === filters.specialization;
    const matchesExperience = filters.experience === 'all' || 
      (filters.experience === 'junior' && counsellor.experience_years < 5) ||
      (filters.experience === 'mid' && counsellor.experience_years >= 5 && counsellor.experience_years < 10) ||
      (filters.experience === 'senior' && counsellor.experience_years >= 10);
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && counsellor.is_active) ||
      (filters.status === 'inactive' && !counsellor.is_active);
    const matchesLocation = filters.location === 'all' || counsellor.location === filters.location;

    return matchesSearch && matchesSpecialization && matchesExperience && matchesStatus && matchesLocation;
  });

  const getSpecializationBadge = (specialization) => {
    const badges = {
      'Career Guidance': { color: 'bg-blue-100 text-blue-800', icon: '🎯' },
      'Academic Planning': { color: 'bg-green-100 text-green-800', icon: '📚' },
      'Mental Health': { color: 'bg-purple-100 text-purple-800', icon: '🧠' },
      'University Admissions': { color: 'bg-orange-100 text-orange-800', icon: '🎓' }
    };
    const badge = badges[specialization] || { color: 'bg-gray-100 text-gray-800', icon: '📋' };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.icon} {specialization}
      </span>
    );
  };

  const getStatusBadge = (counsellor) => {
    if (!counsellor.is_active) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>;
    }
    if (!counsellor.is_verified) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
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
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Counsellors Management</h1>
              <p className="text-gray-600">Manage counsellors and student support services</p>
            </div>
          </div>
          <Link
            to="/admin/counsellors/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Invite Counsellor</span>
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
                  placeholder="Search counsellors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filters.specialization}
                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Specializations</option>
                <option value="Career Guidance">Career Guidance</option>
                <option value="Academic Planning">Academic Planning</option>
                <option value="Mental Health">Mental Health</option>
                <option value="University Admissions">University Admissions</option>
              </select>

              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Experience</option>
                <option value="junior">Junior (&lt; 5 years)</option>
                <option value="mid">Mid (5-10 years)</option>
                <option value="senior">Senior (10+ years)</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Negombo">Negombo</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Counsellors</p>
                <p className="text-2xl font-semibold text-gray-900">{counsellors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Counsellors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {counsellors.filter(c => c.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {counsellors.reduce((sum, c) => sum + c.sessions_completed, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students Helped</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {counsellors.reduce((sum, c) => sum + c.total_students, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Counsellors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#C1DBF4]">
              <thead className="bg-[#E7F3FB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                    Counsellor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#C1DBF4]">
                {filteredCounsellors.map((counsellor) => (
                  <tr key={counsellor.id} className="hover:bg-[#E7F3FB]/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#263238]">
                            {counsellor.first_name} {counsellor.last_name}
                          </div>
                          <div className="text-sm text-[#717171] flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {counsellor.email}
                          </div>
                          <div className="text-sm text-[#717171] flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {counsellor.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSpecializationBadge(counsellor.specialization)}
                      <div className="text-sm text-[#717171] mt-1">{counsellor.qualification}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#263238]">
                        {counsellor.experience_years} years
                      </div>
                      <div className="text-sm text-[#717171]">
                        {counsellor.availability}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-[#263238]">{counsellor.rating}</span>
                      </div>
                      <div className="text-sm text-[#717171]">
                        {counsellor.total_students} students
                      </div>
                      <div className="text-sm text-[#717171]">
                        {counsellor.sessions_completed} sessions
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(counsellor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/counsellors/${counsellor.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/counsellors/${counsellor.id}/edit`}
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(counsellor.id)}
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

          {filteredCounsellors.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No counsellors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || Object.values(filters).some(f => f !== 'all')
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by inviting a new counsellor.'}
              </p>
              {(!searchTerm && Object.values(filters).every(f => f === 'all')) && (
                <div className="mt-6">
                  <Link
                    to="/admin/counsellors/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Counsellor
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

export default CounsellorsList;
