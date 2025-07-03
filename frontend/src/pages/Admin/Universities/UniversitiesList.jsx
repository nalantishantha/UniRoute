import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  Award
} from 'lucide-react';

const UniversitiesList = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    location: 'all'
  });

  // Mock data for universities
  const mockUniversities = [
    {
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
      is_active: true,
      logo_url: null,
      created_at: '2024-01-10T08:30:00Z'
    },
    {
      id: 2,
      name: 'University of Peradeniya',
      short_name: 'UOP',
      type: 'public',
      location: 'Kandy',
      address: 'University of Peradeniya, Peradeniya 20400',
      contact_number: '0812389429',
      email: 'info@pdn.ac.lk',
      website: 'https://www.pdn.ac.lk',
      established_year: 1942,
      total_students: 11200,
      total_faculties: 9,
      ranking: 2,
      accreditation: 'UGC Approved',
      is_active: true,
      logo_url: null,
      created_at: '2024-01-12T09:15:00Z'
    },
    {
      id: 3,
      name: 'Sri Lanka Institute of Information Technology',
      short_name: 'SLIIT',
      type: 'private',
      location: 'Colombo',
      address: 'New Kandy Road, Malabe, Sri Lanka',
      contact_number: '0117544801',
      email: 'info@sliit.lk',
      website: 'https://www.sliit.lk',
      established_year: 1999,
      total_students: 8500,
      total_faculties: 4,
      ranking: 5,
      accreditation: 'UGC Approved',
      is_active: true,
      logo_url: null,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 4,
      name: 'NSBM Green University',
      short_name: 'NSBM',
      type: 'private',
      location: 'Pitipana',
      address: 'Mahenwatta, Pitipana, Homagama',
      contact_number: '0117443443',
      email: 'info@nsbm.ac.lk',
      website: 'https://www.nsbm.ac.lk',
      established_year: 2001,
      total_students: 6800,
      total_faculties: 5,
      ranking: 8,
      accreditation: 'UGC Approved',
      is_active: true,
      logo_url: null,
      created_at: '2024-01-18T11:30:00Z'
    }
  ];

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUniversities(mockUniversities);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        // Simulate API call
        setUniversities(universities.filter(university => university.id !== id));
      } catch (error) {
        console.error('Error deleting university:', error);
      }
    }
  };

  const filteredUniversities = universities.filter(university => {
    const matchesSearch = 
      university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.short_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filters.type === 'all' || university.type === filters.type;
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && university.is_active) ||
      (filters.status === 'inactive' && !university.is_active);
    const matchesLocation = filters.location === 'all' || university.location === filters.location;

    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  const getTypeBadge = (type) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        type === 'public' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-purple-100 text-purple-800'
      }`}>
        {type === 'public' ? 'Public' : 'Private'}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Universities Management</h1>
            <p className="text-gray-600">Manage universities and their information</p>
          </div>
        </div>
        <Link
          to="/admin/universities/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add University</span>
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
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Universities</p>
              <p className="text-2xl font-semibold text-gray-900">{universities.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Public Universities</p>
              <p className="text-2xl font-semibold text-gray-900">
                {universities.filter(u => u.type === 'public').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Private Universities</p>
              <p className="text-2xl font-semibold text-gray-900">
                {universities.filter(u => u.type === 'private').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {universities.reduce((sum, u) => sum + u.total_students, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Established
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
              {filteredUniversities.map((university) => (
                <tr key={university.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {university.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {university.short_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {university.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(university.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {university.location}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {university.contact_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {university.total_students.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {university.total_faculties} faculties
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{university.established_year}</div>
                    <div className="text-sm text-gray-500">Rank #{university.ranking}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(university.is_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/universities/${university.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/universities/${university.id}/edit`}
                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(university.id)}
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

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No universities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.type !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding a new university.'}
            </p>
            {(!searchTerm && filters.type === 'all' && filters.status === 'all') && (
              <div className="mt-6">
                <Link
                  to="/admin/universities/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add University
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitiesList;
