import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Edit,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  TrendingUp,
  Users,
  UserCheck,
  UserCircle,
  UserX
} from 'lucide-react';
import { counsellorsAPI } from '../../../utils/counsellorsAPI';

const formatDate = (isoDate) => {
  if (!isoDate) return 'Not available';

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return 'Not available';

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const StatusBadge = ({ status }) => {
  const isActive = status === 'active';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
        isActive ? 'bg-[#E6F4EA] text-[#1B7A3D]' : 'bg-[#FCE8E6] text-[#B3261E]'
      }`}
    >
      <span className={`h-2 w-2 rounded-full mr-2 ${isActive ? 'bg-[#1B7A3D]' : 'bg-[#B3261E]'}`} />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

const StatCard = ({ title, value, description, icon: Icon, accent }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-[#6B7A8C]">{title}</p>
        <p className="mt-2 text-3xl font-bold text-[#0F172A]">{value}</p>
        {description && (
          <p className="mt-3 text-sm text-[#6B7A8C] flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-[#1D5D9B]" />
            {description}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${accent}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const CounsellorsList = () => {
  const navigate = useNavigate();
  const [counsellors, setCounsellors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    students: 0,
    sessions: 0,
    avgRating: 0,
    newThisMonth: 0
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
    has_next: false,
    has_previous: false
  });
  const [statusCounts, setStatusCounts] = useState({ active: 0, inactive: 0 });
  const [verificationCounts, setVerificationCounts] = useState({ verified: 0, unverified: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!message) return undefined;
    const timeoutId = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timeoutId);
  }, [message]);

  const fetchCounsellors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await counsellorsAPI.getAllCounsellors({
        search: searchTerm,
        status: statusFilter,
        verification: verificationFilter,
        page,
        per_page: perPage
      });

      setCounsellors(data.counsellors || []);
      setStatistics({
        total: data.statistics?.total || 0,
        active: data.statistics?.active || 0,
        students: data.statistics?.students || 0,
        sessions: data.statistics?.sessions || 0,
        avgRating: data.statistics?.avgRating || 0,
        newThisMonth: data.statistics?.newThisMonth || 0
      });
      setStatusCounts(data.filters?.statusCounts || { active: 0, inactive: 0 });
      setVerificationCounts(data.filters?.verificationCounts || { verified: 0, unverified: 0 });
      setPagination(data.pagination || {
        current_page: 1,
        total_pages: 1,
        total_items: data.counsellors?.length || 0,
        per_page: perPage,
        has_next: false,
        has_previous: false
      });
    } catch (fetchError) {
      console.error(fetchError);
      setCounsellors([]);
      setError(fetchError.message || 'Failed to load counsellors');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, verificationFilter, page, perPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCounsellors();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchCounsellors]);

  const handleToggleStatus = async (counsellor) => {
    const newStatus = counsellor.status === 'active' ? 'inactive' : 'active';
    try {
      const counsellorId = counsellor.id ?? counsellor.counsellor_id;
      await counsellorsAPI.updateCounsellorStatus(counsellorId, newStatus);
      setMessage({ type: 'success', text: `Counsellor status updated to ${newStatus}.` });
      await fetchCounsellors();
    } catch (statusError) {
      setMessage({ type: 'error', text: statusError.message || 'Failed to update status.' });
    }
  };

  const handleDelete = async () => {
    if (!selectedCounsellor) return;

    try {
      const counsellorId = selectedCounsellor.id ?? selectedCounsellor.counsellor_id;
      await counsellorsAPI.deleteCounsellor(counsellorId);
      setMessage({
        type: 'success',
        text: `Counsellor "${selectedCounsellor.fullName || selectedCounsellor.username || 'Profile'}" deleted.`
      });
      setShowDeleteModal(false);
      setSelectedCounsellor(null);
      await fetchCounsellors();
    } catch (deleteError) {
      setMessage({ type: 'error', text: deleteError.message || 'Failed to delete counsellor.' });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleVerificationFilterChange = (event) => {
    setVerificationFilter(event.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (pagination.has_previous) {
      setPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  const handleNextPage = () => {
    if (pagination.has_next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <AdminLayout
      pageTitle="Counsellors Management"
      pageDescription="Manage UniRoute counsellors, performance metrics, and platform readiness."
    >
      <div className="space-y-6">
        {message && (
          <div
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-[#C4EED0] bg-[#F0FFF4] text-[#1B7A3D]'
                : 'border-[#FBD5D5] bg-[#FFF5F5] text-[#B3261E]'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Counsellors"
            value={statistics.total}
            description={`${statistics.newThisMonth} new this month`}
            icon={Users}
            accent="bg-[#1D5D9B]"
          />
          <StatCard
            title="Active Counsellors"
            value={statistics.active}
            description={`${Number(statistics.avgRating || 0).toFixed(1)}/5 average rating`}
            icon={CheckCircle2}
            accent="bg-[#4CAF50]"
          />
          <StatCard
            title="Students Supported"
            value={Number(statistics.students || 0).toLocaleString()}
            description="Lifetime impact"
            icon={UserCircle}
            accent="bg-[#F4D160]"
          />
          <StatCard
            title="Sessions Delivered"
            value={Number(statistics.sessions || 0).toLocaleString()}
            description="Across UniRoute"
            icon={CalendarDays}
            accent="bg-[#75C2F6]"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">Counsellor Directory</h2>
              <p className="text-sm text-[#6B7A8C]">
                Search and manage counsellors across all regions and specialization tracks.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/counsellors/new')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Counsellor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7A8C] mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or specialization"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7A8C] mb-2">
                Status
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent appearance-none"
                >
                  <option value="all">All statuses ({statistics.total})</option>
                  <option value="active">Active ({statusCounts.active})</option>
                  <option value="inactive">Inactive ({statusCounts.inactive})</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7A8C] mb-2">
                Verification
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <select
                  value={verificationFilter}
                  onChange={handleVerificationFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-[#C1DBF4] rounded-lg focus:ring-2 focus:ring-[#1D5D9B] focus:border-transparent appearance-none"
                >
                  <option value="all">All counsellors ({statistics.total})</option>
                  <option value="verified">Verified ({verificationCounts.verified})</option>
                  <option value="unverified">Not verified ({verificationCounts.unverified})</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E7F3FB]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7A8C] uppercase tracking-wider">
                    Counsellor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7A8C] uppercase tracking-wider">
                    Specializations
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7A8C] uppercase tracking-wider">
                    Impact & Performance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7A8C] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7A8C] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E7F3FB]">
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-[#6B7A8C] gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-[#1D5D9B]" />
                        <p className="text-sm font-medium">Loading counsellors...</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-[#B3261E] gap-2">
                        <AlertTriangle className="h-8 w-8" />
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !error && counsellors.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-[#6B7A8C]">
                        <Users className="h-10 w-10 mb-4 text-[#C1DBF4]" />
                        <p className="text-sm font-medium">No counsellors match the selected filters</p>
                        <p className="text-xs">Try adjusting the filters or clearing the search term.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !error &&
                  counsellors.map((counsellor) => {
                    const counsellorId = counsellor.id ?? counsellor.counsellor_id;
                    const languages = Array.isArray(counsellor.languages)
                      ? counsellor.languages
                      : counsellor.languages
                      ? counsellor.languages.split(',').map((item) => item.trim()).filter(Boolean)
                      : [];
                    const specializations = Array.isArray(counsellor.specializations)
                      ? counsellor.specializations
                      : counsellor.specializations
                      ? counsellor.specializations.split(',').map((item) => item.trim()).filter(Boolean)
                      : [];

                    return (
                      <tr key={counsellorId} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-5 align-top">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 bg-[#E8F1FF] text-[#1D5D9B] flex items-center justify-center rounded-xl">
                              <UserCircle className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-[#0F172A]">
                                  {counsellor.fullName || counsellor.username || 'Counsellor'}
                                </p>
                                {counsellor.verified ? (
                                  <ShieldCheck className="h-4 w-4 text-[#1B7A3D]" title="Verified counsellor" />
                                ) : (
                                  <ShieldOff className="h-4 w-4 text-[#B3261E]" title="Awaiting verification" />
                                )}
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6B7A8C]">
                                <span className="inline-flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5" />
                                  {counsellor.email || 'Not provided'}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5" />
                                  {counsellor.phone || 'Not provided'}
                                </span>
                              </div>
                              <div className="mt-2 inline-flex items-center gap-2 text-xs text-[#6B7A8C]">
                                <MapPin className="h-3.5 w-3.5" />
                                {counsellor.location || 'Not specified'}
                              </div>
                              <p className="mt-3 text-xs text-[#94A3B8]">
                                Joined {formatDate(counsellor.joinedDate)} • {counsellor.experienceYears || 0}+ years
                                experience
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-wrap gap-2">
                            {specializations.length ? (
                              specializations.map((specialization) => (
                                <span
                                  key={specialization}
                                  className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-[#E8F1FF] text-[#1D5D9B]"
                                >
                                  {specialization}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-[#6B7A8C]">No specializations listed.</span>
                            )}
                          </div>
                          <div className="mt-3 text-xs text-[#6B7A8C]">
                            Languages: {languages.length ? languages.join(', ') : 'Not specified'}
                          </div>
                          <div className="mt-1 text-xs text-[#6B7A8C]">
                            Last active {formatDate(counsellor.lastActive)}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="text-sm text-[#0F172A] font-semibold">
                            {Number(counsellor.studentsSupported || 0).toLocaleString()} students
                          </div>
                          <p className="text-xs text-[#6B7A8C] mt-1">
                            {Number(counsellor.sessionsCompleted || 0).toLocaleString()} sessions completed
                          </p>
                          <div className="mt-2 inline-flex items-center text-xs font-medium text-[#1B7A3D] bg-[#E6F4EA] px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            {Number(counsellor.averageRating || 0).toFixed(1)}/5 rating
                          </div>
                          <div className="mt-2 text-xs text-[#6B7A8C]">
                            Typical response time: {counsellor.responseTime || 'Not tracked'}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <StatusBadge status={counsellor.status} />
                          <p className="mt-3 text-xs text-[#6B7A8C]">
                            Verification: {counsellor.verified ? 'Completed' : 'Pending'}
                          </p>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/counsellors/${counsellorId}`)}
                              className="p-2 text-[#1D5D9B] hover:bg-[#E8F1FF] rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/counsellors/${counsellorId}/edit`)}
                              className="p-2 text-[#F4D160] hover:bg-[#FFF4D6] rounded-lg transition-colors"
                              title="Edit counsellor"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(counsellor)}
                              className={`p-2 rounded-lg transition-colors ${
                                counsellor.status === 'active'
                                  ? 'text-[#B3261E] hover:bg-[#FCE8E6]'
                                  : 'text-[#1B7A3D] hover:bg-[#E6F4EA]'
                              }`}
                              title={counsellor.status === 'active' ? 'Mark as inactive' : 'Activate counsellor'}
                            >
                              {counsellor.status === 'active' ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCounsellor(counsellor);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-[#B3261E] hover:bg-[#FCE8E6] rounded-lg transition-colors"
                              title="Delete counsellor"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedCounsellor && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-[#B3261E]" />
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  Delete Counsellor
                </h3>
              </div>
              <p className="text-sm text-[#6B7A8C] mb-6">
                Are you sure you want to remove {selectedCounsellor.fullName || selectedCounsellor.username || 'this counsellor'} from UniRoute? This action will remove their access and cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCounsellor(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#C1DBF4] text-[#0F172A] rounded-lg hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-[#B3261E] text-white rounded-lg hover:bg-[#8C1E18]"
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

export default CounsellorsList;
