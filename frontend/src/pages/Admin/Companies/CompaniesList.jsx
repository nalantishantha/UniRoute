import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  Building,
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
  Globe,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
  Briefcase,
  TrendingUp
} from 'lucide-react';

const CompaniesList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: 'all',
    size: 'all',
    status: 'all',
    partnership_type: 'all'
  });

  // Mock data for companies
  const mockCompanies = [
    {
      id: 1,
      name: 'TechCorp Lanka',
      industry: 'Technology',
      size: 'large',
      location: 'Colombo',
      address: '123 Tech Tower, Colombo 03',
      contact_number: '0112345678',
      email: 'hr@techcorp.lk',
      website: 'https://www.techcorp.lk',
      founded_year: 2010,
      employee_count: 500,
      partnership_type: 'premium',
      partnership_since: '2023-01-15',
      job_openings: 12,
      internship_positions: 8,
      hired_students: 45,
      rating: 4.7,
      description: 'Leading technology company specializing in software development and digital solutions.',
      logo_url: '',
      is_active: true,
      is_verified: true,
      created_at: '2023-01-15T08:30:00Z'
    },
    {
      id: 2,
      name: 'Green Energy Solutions',
      industry: 'Energy',
      size: 'medium',
      location: 'Kandy',
      address: '456 Eco Park, Kandy',
      contact_number: '0814567890',
      email: 'careers@greenenergy.lk',
      website: 'https://www.greenenergy.lk',
      founded_year: 2015,
      employee_count: 150,
      partnership_type: 'standard',
      partnership_since: '2023-03-20',
      job_openings: 5,
      internship_positions: 3,
      hired_students: 12,
      rating: 4.5,
      description: 'Renewable energy company focused on sustainable solutions for Sri Lanka.',
      logo_url: '',
      is_active: true,
      is_verified: true,
      created_at: '2023-03-20T10:15:00Z'
    },
    {
      id: 3,
      name: 'Lanka Finance Group',
      industry: 'Finance',
      size: 'large',
      location: 'Colombo',
      address: '789 Finance Plaza, Fort, Colombo 01',
      contact_number: '0117890123',
      email: 'recruitment@lankafinance.lk',
      website: 'https://www.lankafinance.lk',
      founded_year: 2005,
      employee_count: 800,
      partnership_type: 'premium',
      partnership_since: '2022-11-10',
      job_openings: 18,
      internship_positions: 15,
      hired_students: 78,
      rating: 4.8,
      description: 'Leading financial services provider offering banking, insurance, and investment solutions.',
      logo_url: '',
      is_active: true,
      is_verified: true,
      created_at: '2022-11-10T14:30:00Z'
    },
    {
      id: 4,
      name: 'StartupLK',
      industry: 'Technology',
      size: 'small',
      location: 'Gampaha',
      address: '321 Innovation Hub, Gampaha',
      contact_number: '0333456789',
      email: 'team@startuplk.com',
      website: 'https://www.startuplk.com',
      founded_year: 2020,
      employee_count: 25,
      partnership_type: 'basic',
      partnership_since: '2024-01-05',
      job_openings: 3,
      internship_positions: 5,
      hired_students: 8,
      rating: 4.3,
      description: 'Innovative startup developing mobile applications and web solutions.',
      logo_url: '',
      is_active: true,
      is_verified: false,
      created_at: '2024-01-05T09:00:00Z'
    }
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCompanies(mockCompanies);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        // Simulate API call
        setCompanies(companies.filter(company => company.id !== id));
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = filters.industry === 'all' || company.industry === filters.industry;
    const matchesSize = filters.size === 'all' || company.size === filters.size;
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && company.is_active) ||
      (filters.status === 'inactive' && !company.is_active) ||
      (filters.status === 'verified' && company.is_verified) ||
      (filters.status === 'unverified' && !company.is_verified);
    const matchesPartnership = filters.partnership_type === 'all' || company.partnership_type === filters.partnership_type;

    return matchesSearch && matchesIndustry && matchesSize && matchesStatus && matchesPartnership;
  });

  const getSizeBadge = (size) => {
    const badges = {
      small: { color: 'bg-blue-100 text-blue-800', text: 'Small (1-50)' },
      medium: { color: 'bg-green-100 text-green-800', text: 'Medium (51-250)' },
      large: { color: 'bg-purple-100 text-purple-800', text: 'Large (250+)' }
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[size].color}`}>
        {badges[size].text}
      </span>
    );
  };

  const getPartnershipBadge = (type) => {
    const badges = {
      basic: { color: 'bg-gray-100 text-gray-800', text: 'Basic' },
      standard: { color: 'bg-blue-100 text-blue-800', text: 'Standard' },
      premium: { color: 'bg-gold-100 text-gold-800', text: 'Premium' }
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[type].color}`}>
        {badges[type].text}
      </span>
    );
  };

  const getStatusBadge = (company) => {
    if (!company.is_active) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>;
    }
    if (!company.is_verified) {
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
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
              <p className="text-gray-600">Manage partner companies and recruitment relationships</p>
            </div>
          </div>
          <Link
            to="/admin/companies/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Company</span>
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
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Energy">Energy</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (1-50)</option>
                <option value="medium">Medium (51-250)</option>
                <option value="large">Large (250+)</option>
              </select>

              <select
                value={filters.partnership_type}
                onChange={(e) => setFilters({ ...filters, partnership_type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Partnerships</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>

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
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-semibold text-gray-900">{companies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Partners</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companies.filter(c => c.is_active && c.is_verified).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Job Openings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companies.reduce((sum, c) => sum + c.job_openings, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students Hired</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companies.reduce((sum, c) => sum + c.hired_students, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry & Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partnership
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
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
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {company.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {company.location}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {company.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.industry}</div>
                      {getSizeBadge(company.size)}
                      <div className="text-sm text-gray-500 mt-1">{company.employee_count} employees</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPartnershipBadge(company.partnership_type)}
                      <div className="text-sm text-gray-500 mt-1">
                        Since {new Date(company.partnership_since).getFullYear()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.job_openings} jobs
                      </div>
                      <div className="text-sm text-gray-500">
                        {company.internship_positions} internships
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">{company.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">{company.hired_students} hired</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(company)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/companies/${company.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/companies/${company.id}/edit`}
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(company.id)}
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

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || Object.values(filters).some(f => f !== 'all')
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding a new company.'}
              </p>
              {(!searchTerm && Object.values(filters).every(f => f === 'all')) && (
                <div className="mt-6">
                  <Link
                    to="/admin/companies/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
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

export default CompaniesList;
