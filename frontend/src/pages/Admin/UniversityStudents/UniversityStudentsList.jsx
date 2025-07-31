import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  University,
  BookOpen,
  MapPin,
  Award,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Building
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const UniversityStudentsList = () => {
  const [universityStudents, setUniversityStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterDegree, setFilterDegree] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });
  const [filterOptions, setFilterOptions] = useState({
    universities: [],
    faculties: [],
    degree_programs: [],
    years_of_study: [],
    statuses: []
  });

  const navigate = useNavigate();
  const studentsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchFilterOptions();
    fetchUniversityStudents();
  }, [navigate, currentPage, searchTerm, filterUniversity, filterFaculty, filterDegree, filterYear, filterStatus]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/administration/university-students/filter-options/');
      const data = await response.json();
      if (data.success) {
        setFilterOptions(data.filter_options);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchUniversityStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: studentsPerPage,
        search: searchTerm,
        university: filterUniversity,
        faculty: filterFaculty,
        degree_program: filterDegree,
        year_of_study: filterYear,
        status: filterStatus
      });

      const response = await fetch(`/api/administration/university-students/?${params}`);
      const data = await response.json();

      if (data.success) {
        setUniversityStudents(data.university_students);
        setPagination(data.pagination);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch university students' });
      }
    } catch (error) {
      console.error('Error fetching university students:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete university student "${studentName}"? This action cannot be undone.`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/university-students/${studentId}/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchUniversityStudents(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error deleting university student:', error);
        setMessage({ type: 'error', text: 'Failed to delete university student' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggleStatus = async (studentId, currentStatus, studentName) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} university student "${studentName}"?`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/university-students/${studentId}/toggle-status/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchUniversityStudents(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error toggling university student status:', error);
        setMessage({ type: 'error', text: 'Failed to update university student status' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const getYearColor = (year) => {
    const colors = {
      '1': 'bg-blue-100 text-blue-800 border border-blue-200',
      '2': 'bg-green-100 text-green-800 border border-green-200',
      '3': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      '4': 'bg-orange-100 text-orange-800 border border-orange-200',
      '5': 'bg-purple-100 text-purple-800 border border-purple-200',
      '6': 'bg-red-100 text-red-800 border border-red-200'
    };
    return colors[year] || 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'graduated':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'undefined') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchUniversityStudents();
  };

  const getDisplayName = (student) => {
    if (student.full_name && student.full_name !== 'undefined') {
      return student.full_name;
    }
    return student.username;
  };

  const getDisplayValue = (value) => {
    return (value && value !== 'undefined') ? value : 'N/A';
  };

  return (
    <AdminLayout pageTitle="University Students" pageDescription="Manage all university students">
      <div className="min-h-screen bg-gray-50">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Header */}
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
                  <University className="h-6 w-6 text-blue-500" />
                  <h1 className="text-2xl font-bold text-gray-900">University Students Management</h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <Link
                  to="/admin/university-students/new"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add University Student</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative col-span-full md:col-span-1 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search university students..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* University Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterUniversity}
                  onChange={(e) => {
                    setFilterUniversity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                  <option value="all">All Universities</option>
                  {filterOptions.universities.map(university => (
                    <option key={university.university_id} value={university.university_id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faculty Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={filterFaculty}
                  onChange={(e) => {
                    setFilterFaculty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                  <option value="all">All Faculties</option>
                  {filterOptions.faculties.map(faculty => (
                    <option key={faculty.faculty_id} value={faculty.faculty_id}>
                      {faculty.faculty_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Degree Program Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={filterDegree}
                  onChange={(e) => {
                    setFilterDegree(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                  <option value="all">All Degree Programs</option>
                  {filterOptions.degree_programs.map(program => (
                    <option key={program.program_id} value={program.program_id}>
                      {program.program_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={filterYear}
                  onChange={(e) => {
                    setFilterYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                  <option value="all">All Years</option>
                  {filterOptions.years_of_study.map(year => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                  <option value="all">All Statuses</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Total Count */}
              <div className="flex items-center justify-end text-sm text-gray-500">
                {pagination.total_items} total students
              </div>
            </div>
          </div>

          {/* University Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading university students...</p>
                </div>
              </div>
            ) : universityStudents.length === 0 ? (
              <div className="text-center py-12">
                <University className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No university students found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          University
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Degree Program
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year/Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollment
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {universityStudents.map((student) => (
                        <tr key={student.university_student_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {getDisplayName(student)}
                                </div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                                <div className="text-sm text-gray-500">
                                  Reg: {getDisplayValue(student.registration_number)}
                                </div>
                                {student.is_verified && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">Verified</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">{getDisplayValue(student.university.name)}</div>
                                <div className="text-sm text-gray-500">{getDisplayValue(student.faculty.name)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">{getDisplayValue(student.degree_program.name)}</div>
                                <div className="text-sm text-gray-500">
                                  Duration: {getDisplayValue(student.duration.duration_years)} years
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getYearColor(student.year_of_study)}`}>
                                Year {getDisplayValue(student.year_of_study)}
                              </span>
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                                {getDisplayValue(student.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.contact_number && student.contact_number !== 'undefined' ? (
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{student.contact_number}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">No phone</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">{formatDate(student.enrollment_date)}</div>
                                <div className="text-sm text-gray-500">
                                  {student.is_active ? (
                                    <span className="text-green-600">Active</span>
                                  ) : (
                                    <span className="text-red-600">Inactive</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/university-students/${student.university_student_id}`}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/university-students/${student.university_student_id}/edit`}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleToggleStatus(student.university_student_id, student.is_active, getDisplayName(student))}
                                className={`p-1 rounded ${
                                  student.is_active
                                    ? 'text-orange-600 hover:text-orange-900'
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                                title={student.is_active ? 'Deactivate' : 'Activate'}
                                disabled={actionLoading}
                              >
                                {student.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.university_student_id, getDisplayName(student))}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="Delete"
                                disabled={actionLoading}
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

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((pagination.current_page - 1) * studentsPerPage) + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(pagination.current_page * studentsPerPage, pagination.total_items)}</span> of{' '}
                          <span className="font-medium">{pagination.total_items}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={!pagination.has_previous}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          
                          {[...Array(pagination.total_pages)].map((_, index) => {
                            const pageNumber = index + 1;
                            const isCurrentPage = pageNumber === pagination.current_page;
                            
                            if (pageNumber === 1 || pageNumber === pagination.total_pages || 
                                (pageNumber >= pagination.current_page - 2 && pageNumber <= pagination.current_page + 2)) {
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    isCurrentPage
                                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            }
                            return null;
                          })}
                          
                          <button
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={!pagination.has_next}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UniversityStudentsList;