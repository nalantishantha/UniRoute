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
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  School,
  MapPin,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });

  const navigate = useNavigate();
  const studentsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchStudents();
  }, [navigate, currentPage, searchTerm, filterStage]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: studentsPerPage,
        search: searchTerm,
        stage: filterStage
      });

      const response = await fetch(`/api/administration/students/?${params}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
        setPagination(data.pagination);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch students' });
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete student "${studentName}"? This action cannot be undone.`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/students/${studentId}/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchStudents(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        setMessage({ type: 'error', text: 'Failed to delete student' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggleStatus = async (studentId, currentStatus, studentName) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} student "${studentName}"?`)) {
      try {
        setActionLoading(true);
        const response = await fetch(`/api/administration/students/${studentId}/toggle-status/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchStudents(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (error) {
        console.error('Error toggling student status:', error);
        setMessage({ type: 'error', text: 'Failed to update student status' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'O/L':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'A/L':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'POST_A/L':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    fetchStudents();
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

  const getStageDisplayText = (stage) => {
    switch (stage) {
      case 'O/L':
        return 'O/L';
      case 'A/L':
        return 'A/L';
      case 'POST_A/L':
        return 'Post A/L';
      default:
        return getDisplayValue(stage);
    }
  };

  return (
    <AdminLayout pageTitle="Students" pageDescription="Manage all students">
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
                  <GraduationCap className="h-6 w-6 text-green-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
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
                  to="/admin/students/new"
                  className="bg-[#1D5D9B] text-white px-4 py-2 rounded-lg hover:bg-[#174A7C] transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Student</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterStage}
                    onChange={(e) => {
                      setFilterStage(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Stages</option>
                    <option value="O/L">O/L</option>
                    <option value="A/L">A/L</option>
                    <option value="POST_A/L">Post A/L</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {pagination.total_items} total students
                </div>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading students...</p>
                </div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No students found</p>
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
                          Stage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          School
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-green-100 p-2 rounded-lg mr-3">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {getDisplayName(student)}
                                </div>
                                <div className="text-sm text-gray-500">{student.email}</div>
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
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(student.current_stage)}`}>
                              {getDisplayValue(student.current_stage)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <School className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{getDisplayValue(student.school)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{getDisplayValue(student.district)}</span>
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
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              student.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/students/${student.student_id}`}
                                className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/students/${student.student_id}/edit`}
                                className="text-[#81C784] hover:text-[#5EA46A] p-1 rounded"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleToggleStatus(student.student_id, student.is_active, getDisplayName(student))}
                                className={`p-1 rounded ${
                                  student.is_active
                                    ? 'text-[#F4D160] hover:text-[#D9B23A]'
                                    : 'text-[#81C784] hover:text-[#5EA46A]'
                                }`}
                                title={student.is_active ? 'Deactivate' : 'Activate'}
                                disabled={actionLoading}
                              >
                                {student.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.student_id, getDisplayName(student))}
                                className="text-[#E57373] hover:text-[#C94A4A] p-1 rounded"
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
                                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
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

export default StudentsList;