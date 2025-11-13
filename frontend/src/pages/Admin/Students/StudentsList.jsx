import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import { studentsAPI } from '../../../utils/studentsAPI';
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
  BookOpen,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState({}); // Track loading state for individual actions
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_previous: false
  });
  const navigate = useNavigate();

  const studentsPerPage = 10;

  // Fetch students data from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        per_page: studentsPerPage,
        stage: filterStage,
        search: searchTerm
      };

      const response = await studentsAPI.getAllStudents(params);
      setStudents(response.students);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchStudents();
  }, [currentPage, filterStage, navigate]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchStudents();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleDeleteStudent = async (studentId, studentName) => {
    // Enhanced confirmation dialog
    const confirmMessage = `Are you sure you want to permanently delete ${studentName}?\n\nThis action will:\n- Remove the student's account\n- Delete all associated data\n- Cannot be undone\n\nType "DELETE" to confirm:`;
    
    const confirmation = window.prompt(confirmMessage);
    
    if (confirmation !== 'DELETE') {
      if (confirmation !== null) { // User didn't cancel
        setMessage({ 
          type: 'error', 
          text: 'Delete operation cancelled. You must type "DELETE" to confirm.' 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${studentId}`]: true }));
      setMessage({ type: '', text: '' });
      
      await studentsAPI.deleteStudent(studentId);
      
      setMessage({ 
        type: 'success', 
        text: `${studentName} has been permanently deleted.` 
      });
      
      // Refresh the data
      fetchStudents();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: `Failed to delete ${studentName}: ${err.message}` 
      });
      console.error('Delete error:', err);
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${studentId}`]: false }));
    }
  };

  const handleToggleStatus = async (studentId, currentStatus, studentName) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    const actionPast = currentStatus ? 'deactivated' : 'activated';
    
    // Enhanced confirmation for deactivation
    let confirmMessage;
    if (currentStatus) {
      confirmMessage = `Deactivate ${studentName}?\n\nThis will:\n- Prevent student from logging in\n- Hide their profile from searches\n- Suspend their access to the platform\n\nYou can reactivate them later.`;
    } else {
      confirmMessage = `Activate ${studentName}?\n\nThis will:\n- Allow student to log in\n- Make their profile visible\n- Restore their platform access`;
    }
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`status_${studentId}`]: true }));
      setMessage({ type: '', text: '' });
      
      await studentsAPI.updateStudentStatus(studentId, !currentStatus);
      
      setMessage({ 
        type: 'success', 
        text: `${studentName} has been ${actionPast} successfully.` 
      });
      
      // Refresh the data
      fetchStudents();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: `Failed to ${action} ${studentName}: ${err.message}` 
      });
      console.error(`${action} error:`, err);
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setActionLoading(prev => ({ ...prev, [`status_${studentId}`]: false }));
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'A/L':
        return 'bg-red-100 text-red-800';
      case 'O/L':
        return 'bg-blue-100 text-blue-800';
      case 'Grade 11':
        return 'bg-green-100 text-green-800';
      case 'Grade 10':
        return 'bg-yellow-100 text-yellow-800';
      case 'Grade 9':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Extract first and last name from full_name
  const getDisplayName = (fullName, email) => {
    if (fullName && fullName.trim()) {
      return fullName;
    }
    // Fallback to email username if no full name
    return email.split('@')[0];
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // if (loading) {
  //   return (
  //     <AdminLayout pageTitle="Students" pageDescription="Manage all students">
  //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
  //           <p className="text-gray-600">Loading students...</p>
  //         </div>
  //       </div>
  //     </AdminLayout>
  //   );
  // }

  if (error) {
    return (
      <AdminLayout pageTitle="Students" pageDescription="Manage all students">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Students</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchStudents}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Students" pageDescription="Manage all students">
    <div className="min-h-screen bg-gray-50">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </span>
          </div>
        )}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Stages</option>
                  <option value="A/L">A/L</option>
                  <option value="O/L">O/L</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {pagination.total_items} students
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading students...</p>
              </div>
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStage !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No students have been added yet.'
                  }
                </p>
              </div>
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
                                {getDisplayName(student.full_name, student.email)}
                              </div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(student.current_stage)}`}>
                            {student.current_stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <School className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{student.school || 'Not specified'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{student.district || 'Not specified'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{student.contact_number || 'Not provided'}</span>
                          </div>
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
                              onClick={() => handleToggleStatus(
                                student.student_id, 
                                student.is_active, 
                                getDisplayName(student.full_name, student.email)
                              )}
                              disabled={actionLoading[`status_${student.student_id}`]}
                              className={`p-1 rounded transition-all duration-200 ${
                                actionLoading[`status_${student.student_id}`]
                                  ? 'opacity-50 cursor-not-allowed'
                                  : student.is_active
                                    ? 'text-[#F4D160] hover:text-[#D9B23A]'
                                    : 'text-[#81C784] hover:text-[#5EA46A]'
                              }`}
                              title={
                                actionLoading[`status_${student.student_id}`]
                                  ? 'Processing...'
                                  : student.is_active ? 'Deactivate' : 'Activate'
                              }
                            >
                              {actionLoading[`status_${student.student_id}`] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : student.is_active ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(
                                student.student_id,
                                getDisplayName(student.full_name, student.email)
                              )}
                              disabled={actionLoading[`delete_${student.student_id}`]}
                              className={`p-1 rounded transition-all duration-200 ${
                                actionLoading[`delete_${student.student_id}`]
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'text-[#E57373] hover:text-[#C94A4A]'
                              }`}
                              title={
                                actionLoading[`delete_${student.student_id}`]
                                  ? 'Deleting...'
                                  : 'Delete Student'
                              }
                            >
                              {actionLoading[`delete_${student.student_id}`] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.has_previous}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.has_next}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {(currentPage - 1) * studentsPerPage + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * studentsPerPage, pagination.total_items)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{pagination.total_items}</span>{' '}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.has_previous}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                          .filter(page => {
                            const current = currentPage;
                            return page === 1 || 
                                   page === pagination.total_pages || 
                                   (page >= current - 1 && page <= current + 1);
                          })
                          .map((page, index, array) => {
                            const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                            return (
                              <React.Fragment key={page}>
                                {showEllipsis && (
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => handlePageChange(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === currentPage
                                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          })}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
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