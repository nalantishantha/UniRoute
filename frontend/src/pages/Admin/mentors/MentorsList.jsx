import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import { fetchMentors } from '../../../utils/mentorsAPI';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

const MENTORS_PER_PAGE = 10;

const MentorsList = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: MENTORS_PER_PAGE,
    has_next: false,
    has_previous: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [approvedFilter, setApprovedFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, approvedFilter, statusFilter]);

  useEffect(() => {
    const loadMentors = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.user_type !== 'admin') {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await fetchMentors({
          page: currentPage,
          perPage: MENTORS_PER_PAGE,
          search: debouncedSearch,
          approved: approvedFilter,
          status: statusFilter
        });

        if (!data.success) {
          throw new Error(data.message || 'Unable to load mentors');
        }

        setMentors(data.mentors || []);
        setSummary(data.summary || null);
        setPagination({
          current_page: data.pagination?.current_page ?? currentPage,
          total_pages: data.pagination?.total_pages ?? 1,
          total_items: data.pagination?.total_items ?? (data.mentors ? data.mentors.length : 0),
          per_page: data.pagination?.per_page ?? MENTORS_PER_PAGE,
          has_next: data.pagination?.has_next ?? false,
          has_previous: data.pagination?.has_previous ?? false
        });
      } catch (err) {
        setError(err.message || 'Unable to load mentors');
        setMentors([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, [currentPage, debouncedSearch, approvedFilter, statusFilter]);

  const { startIndex, endIndex } = useMemo(() => {
    if (!mentors.length) {
      return { startIndex: 0, endIndex: 0 };
    }

    const start = (pagination.current_page - 1) * pagination.per_page + 1;
    return {
      startIndex: start,
      endIndex: start + mentors.length - 1
    };
  }, [mentors.length, pagination.current_page, pagination.per_page]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.total_pages) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const formatDate = (value) => {
    if (!value) {
      return '-';
    }

    try {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return value;
    }
  };

  const renderExpertise = (mentor) => {
    if (mentor.expertise_tags && mentor.expertise_tags.length) {
      return mentor.expertise_tags.slice(0, 3).map((tag, index) => (
        <span
          key={`${mentor.id}-expertise-${index}`}
          className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
        >
          {tag}
        </span>
      ));
    }

    if (mentor.expertise) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
          {mentor.expertise}
        </span>
      );
    }

    return (
      <span className="text-xs text-gray-500">Not specified</span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Mentors Management</h1>
                </div>
              </div>
              <Link
                to="/admin/mentors/new"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Mentor</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <SummaryCard label="Total Mentors" value={summary.total} />
              <SummaryCard label="Approved" value={summary.approved} variant="success" />
              <SummaryCard label="Pending" value={summary.pending} variant="warning" />
              <SummaryCard label="Active Accounts" value={summary.active_accounts} variant="info" />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, email, or university..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={approvedFilter}
                    onChange={(event) => setApprovedFilter(event.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All approvals</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All accounts</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="text-sm text-gray-500 text-right">
                  Showing {mentors.length ? `${startIndex}-${endIndex}` : 0} of {pagination.total_items} mentors
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mentors.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                        No mentors found for the selected filters.
                      </td>
                    </tr>
                  )}

                  {mentors.map((mentor) => (
                    <tr key={mentor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-purple-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{mentor.full_name}</div>
                            <div className="flex items-center text-xs text-gray-500 space-x-2">
                              <Mail className="h-3 w-3" />
                              <span>{mentor.email}</span>
                            </div>
                            {mentor.contact_number && (
                              <div className="flex items-center text-xs text-gray-500 space-x-2">
                                <Phone className="h-3 w-3" />
                                <span>{mentor.contact_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mentor.university || '-'}</div>
                        {mentor.location && (
                          <div className="flex items-center text-xs text-gray-500 space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{mentor.location}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mentor.degree_program || '-'}</div>
                        {mentor.duration_years ? (
                          <div className="flex items-center text-xs text-gray-500 space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{mentor.duration_years} year program</span>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 items-center">
                          {renderExpertise(mentor)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            mentor.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {mentor.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            mentor.is_active
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {mentor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(mentor.created_at || mentor.user_created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/mentors/${mentor.id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.total_pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Page {pagination.current_page} of {pagination.total_pages}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.has_previous}
                    className="inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(pagination.total_pages)].map((_, index) => (
                    <button
                      key={`mentor-page-${index}`}
                      onClick={() => handlePageChange(index + 1)}
                      className={`inline-flex items-center px-3 py-2 border text-sm font-medium ${
                        pagination.current_page === index + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={!pagination.has_next}
                    className="inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const SummaryCard = ({ label, value, variant = 'default' }) => {
  const styles = {
    default: 'bg-gray-50 border-gray-200 text-gray-900',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`rounded-lg border ${styles[variant]} p-4`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-semibold">{value ?? 0}</p>
    </div>
  );
};

export default MentorsList;