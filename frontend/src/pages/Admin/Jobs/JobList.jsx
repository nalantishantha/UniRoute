import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const JobsList = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [filters, setFilters] = useState({
    company: 'all',
    location: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });

  useEffect(() => {
    fetchInternships();
    fetchCompanies();
    fetchStatistics();
  }, [filters, pagination.current_page]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        company: filters.company,
        location: filters.location,
        search: filters.search,
        page: pagination.current_page,
        per_page: 10
      });

      const response = await fetch(`/api/companies/internships/?${params}`);
      const data = await response.json();

      if (data.success) {
        setInternships(data.internships);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies/internships/companies/');
      const data = await response.json();
      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/companies/internships/statistics/');
      const data = await response.json();
      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const handleDeleteInternship = async () => {
    if (!selectedInternship) return;

    try {
      const response = await fetch(`/api/companies/internships/${selectedInternship.internship_id}/delete/`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        fetchInternships();
        setShowDeleteModal(false);
        setSelectedInternship(null);
      } else {
        alert('Failed to delete internship: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Failed to delete internship');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E7F3FB]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#717171]">{title}</p>
          <p className="text-2xl font-bold text-[#263238]">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout pageTitle="Jobs Management" pageDescription="Manage internship opportunities and job postings">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Internships"
            value={statistics.total_internships || 0}
            icon={Briefcase}
            color="bg-[#1D5D9B]"
          />
          <StatCard
            title="Active Internships"
            value={statistics.active_internships || 0}
            icon={Calendar}
            color="bg-[#75C2F6]"
          />
          <StatCard
            title="Recent Posts"
            value={statistics.recent_internships || 0}
            icon={RefreshCw}
            color="bg-[#F4D160]"
          />
          <StatCard
            title="Partner Companies"
            value={statistics.total_companies || 0}
            icon={Building2}
            color="bg-[#4CAF50]"
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-[#263238]">Internship Opportunities</h2>
            <button
              onClick={() => navigate('/admin/jobs/create')}
              className="flex items-center space-x-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Job</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-[#717171] mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#717171]" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                />
              </div>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-[#717171] mb-2">Company</label>
              <select
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-[#717171] mb-2">Location</label>
              <input
                type="text"
                placeholder="Filter by location..."
                value={filters.location === 'all' ? '' : filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value || 'all')}
                className="w-full px-3 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Internships Table */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E7F3FB]">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#1D5D9B] mx-auto mb-4" />
              <p className="text-[#717171]">Loading internships...</p>
            </div>
          ) : internships.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase className="h-12 w-12 text-[#C1DBF4] mx-auto mb-4" />
              <p className="text-[#717171]">No internships found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                      Location & Stipend
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wider">
                      Timeline
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
                  {internships.map((internship) => (
                    <tr key={internship.internship_id} className="hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-[#263238]">
                            {internship.title}
                          </div>
                          <div className="text-sm text-[#717171] line-clamp-2">
                            {internship.description?.substring(0, 100) || 'No description'}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-[#717171] mr-2" />
                          <div>
                            <div className="text-sm font-medium text-[#263238]">
                              {internship.company.name}
                            </div>
                            <div className="text-sm text-[#717171]">
                              {internship.company.district}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-[#717171]">
                            <MapPin className="h-4 w-4 mr-1" />
                            {internship.location || 'Not specified'}
                          </div>
                          <div className="flex items-center text-sm text-[#717171]">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {internship.stipend || 'Not specified'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-[#717171]">
                            <span className="font-medium">Start:</span> {formatDate(internship.start_date)}
                          </div>
                          <div className="text-sm text-[#717171]">
                            <span className="font-medium">End:</span> {formatDate(internship.end_date)}
                          </div>
                          <div className="text-sm text-[#717171]">
                            <span className="font-medium">Deadline:</span> {formatDate(internship.application_deadline)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isDeadlinePassed(internship.application_deadline) ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#E57373]/10 text-[#E57373]">
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/jobs/${internship.internship_id}/view`)}
                            className="p-2 text-[#1D5D9B] hover:bg-[#1D5D9B]/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/jobs/${internship.internship_id}/edit`)}
                            className="p-2 text-[#F4D160] hover:bg-[#F4D160]/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInternship(internship);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-[#E57373] hover:bg-[#E57373]/10 rounded-lg transition-colors"
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
          )}

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="px-6 py-4 border-t border-[#E7F3FB] flex items-center justify-between">
              <div className="text-sm text-[#717171]">
                Showing {((pagination.current_page - 1) * 10) + 1} to {Math.min(pagination.current_page * 10, pagination.total_items)} of {pagination.total_items} internships
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={!pagination.has_previous}
                  className="px-3 py-1 border border-[#C1DBF4] rounded-md text-sm font-medium text-[#717171] bg-white hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-[#717171]">
                  {pagination.current_page} of {pagination.total_pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={!pagination.has_next}
                  className="px-3 py-1 border border-[#C1DBF4] rounded-md text-sm font-medium text-[#717171] bg-white hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-[#E57373]" />
                <h3 className="text-lg font-semibold text-[#263238]">Delete Internship</h3>
              </div>
              
              <p className="text-[#717171] mb-6">
                Are you sure you want to delete "{selectedInternship?.title}"? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedInternship(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#C1DBF4] text-[#717171] rounded-lg hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInternship}
                  className="flex-1 px-4 py-2 bg-[#E57373] text-white rounded-lg hover:bg-[#D32F2F]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobsList;