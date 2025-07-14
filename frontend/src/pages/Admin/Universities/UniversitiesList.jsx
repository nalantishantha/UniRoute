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
import AdminLayout from '../../../components/common/Admin/AdminLayout';

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
          ? 'bg-[#E7F3FB] text-[#1D5D9B]' 
          : 'bg-[#F4D160] text-[#263238]'
      }`}>
        {type === 'public' ? 'Public' : 'Private'}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive 
          ? 'bg-[#81C784] text-[#263238]' 
          : 'bg-[#E57373] text-white'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Universities" pageDescription="Manage universities and their information">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D5D9B]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Universities" pageDescription="Manage universities and their information">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-[#1D5D9B]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#717171]">Total Universities</p>
              <p className="text-2xl font-semibold text-[#263238]">{universities.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-[#75C2F6]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#717171]">Public Universities</p>
              <p className="text-2xl font-semibold text-[#263238]">
                {universities.filter(u => u.type === 'public').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-[#4C7FB1]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#717171]">Private Universities</p>
              <p className="text-2xl font-semibold text-[#263238]">
                {universities.filter(u => u.type === 'private').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-[#81C784]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#717171]">Total Students</p>
              <p className="text-2xl font-semibold text-[#263238]">
                {universities.reduce((sum, u) => sum + u.total_students, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0] h-5 w-5" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E7F3FB]">
            <thead className="bg-[#F5F7FA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                  Established
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E7F3FB]">
              {filteredUniversities.map((university) => (
                <tr key={university.id} className="hover:bg-[#F5F7FA]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-[#E7F3FB] flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-[#1D5D9B]" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#263238]">
                          {university.name}
                        </div>
                        <div className="text-sm text-[#717171]">
                          {university.short_name}
                        </div>
                        <div className="text-sm text-[#717171] flex items-center mt-1">
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
                    <div className="flex items-center text-sm text-[#263238]">
                      <MapPin className="h-4 w-4 mr-1 text-[#B0B0B0]" />
                      {university.location}
                    </div>
                    <div className="text-sm text-[#717171] flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {university.contact_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#263238]">
                      {university.total_students.toLocaleString()}
                    </div>
                    <div className="text-sm text-[#717171]">
                      {university.total_faculties} faculties
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#263238]">{university.established_year}</div>
                    <div className="text-sm text-[#717171]">Rank #{university.ranking}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(university.is_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/universities/${university.id}`}
                        className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded-full hover:bg-[#E7F3FB]"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/universities/${university.id}/edit`}
                        className="text-[#81C784] hover:text-[#5EA46A] p-1 rounded-full hover:bg-[#E7F3FB]"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(university.id)}
                        className="text-[#E57373] hover:text-[#C94A4A] p-1 rounded-full hover:bg-[#E7F3FB]"
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
            <Building2 className="mx-auto h-12 w-12 text-[#B0B0B0]" />
            <h3 className="mt-2 text-sm font-medium text-[#263238]">No universities found</h3>
            <p className="mt-1 text-sm text-[#717171]">
              {searchTerm || filters.type !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding a new university.'}
            </p>
            {(!searchTerm && filters.type === 'all' && filters.status === 'all') && (
              <div className="mt-6">
                <Link
                  to="/admin/universities/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1D5D9B] hover:bg-[#174A7C]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add University
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UniversitiesList;