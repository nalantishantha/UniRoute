import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Eye, Edit, Trash2, AlertTriangle, 
  UserCheck, UserX, ChevronLeft, ChevronRight, Loader2,
  GraduationCap, University, Calendar, Users
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import { 
  getAllUniversityStudents, 
  updateUniversityStudentStatus, 
  deleteUniversityStudent,
  getAllUniversities 
} from '../../../utils/universityStudentsAPI';

const UniversityStudentsList = () => {
  const navigate = useNavigate();
  const [universityStudents, setUniversityStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  
  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch universities for filter dropdown
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await getAllUniversities();
        if (response.success) {
          setUniversities(response.universities || []);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch university students
  const fetchUniversityStudents = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page,
        per_page: itemsPerPage,
        search: searchTerm,
        university: selectedUniversity,
        year: selectedYear
      };

      const response = await getAllUniversityStudents(params);
      
      if (response.success) {
        setUniversityStudents(response.university_students || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.message || 'Failed to fetch university students');
      }
    } catch (error) {
      setError('Error loading university students. Please try again.');
      console.error('Error fetching university students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchUniversityStudents(1);
    setCurrentPage(1);
  }, [searchTerm, selectedUniversity, selectedYear]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUniversityStudents(page);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUniversity('');
    setSelectedYear('');
  };

  // Handle status toggle
  const handleStatusToggle = async (student) => {
    setSelectedStudent(student);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedStudent) return;

    const loadingKey = `status_${selectedStudent.university_student_id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await updateUniversityStudentStatus(
        selectedStudent.university_student_id, 
        !selectedStudent.is_active
      );

      if (response.success) {
        await fetchUniversityStudents(currentPage);
        setShowStatusModal(false);
        setSelectedStudent(null);
      } else {
        setError(response.message || 'Failed to update student status');
      }
    } catch (error) {
      setError('Error updating student status. Please try again.');
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Handle delete
  const handleDelete = (student) => {
    setSelectedStudent(student);
    setDeleteConfirmText('');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent || deleteConfirmText !== 'DELETE') return;

    const loadingKey = `delete_${selectedStudent.university_student_id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await deleteUniversityStudent(selectedStudent.university_student_id);

      if (response.success) {
        await fetchUniversityStudents(currentPage);
        setShowDeleteModal(false);
        setSelectedStudent(null);
        setDeleteConfirmText('');
      } else {
        setError(response.message || 'Failed to delete student');
      }
    } catch (error) {
      setError('Error deleting student. Please try again.');
      console.error('Error deleting student:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Navigation handlers
  const handleView = (studentId) => {
    navigate(`/admin/university-students/${studentId}`);
  };

  const handleEdit = (studentId) => {
    navigate(`/admin/university-students/${studentId}/edit`);
  };

  const renderPagination = () => {
    if (!pagination.total_pages || pagination.total_pages <= 1) return null;

    const pages = [];
    const totalPages = pagination.total_pages;
    const current = pagination.current_page;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(current - 1)}
        disabled={!pagination.has_previous}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );

    // Page numbers
    for (let i = Math.max(1, current - 2); i <= Math.min(totalPages, current + 2); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === current
              ? 'text-white bg-blue-600 border border-blue-600'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(current + 1)}
        disabled={!pagination.has_next}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((current - 1) * itemsPerPage) + 1} to {Math.min(current * itemsPerPage, pagination.total_items)} of {pagination.total_items} results
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {pages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading university students...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">University Students Management</h1>
            <p className="mt-1 text-gray-600">Manage university student accounts and profiles</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{pagination.total_items || 0} Total Students</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, registration number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* University Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Universities</option>
                  {universities.map((university) => (
                    <option key={university.university_id} value={university.university_id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="w-full sm:w-32">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedUniversity || selectedYear) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University & Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
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
                {universityStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <GraduationCap className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">No university students found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  universityStudents.map((student) => (
                    <tr key={student.university_student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.full_name || 'No name provided'}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                            <div className="text-xs text-gray-400">@{student.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.university}</div>
                        <div className="text-sm text-gray-500">{student.degree_program}</div>
                        <div className="text-xs text-gray-400">{student.faculty}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.registration_number || 'N/A'}</div>
                        <div className="text-xs text-gray-500">
                          {student.enrollment_date && (
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(student.enrollment_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Year {student.year_of_study}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleView(student.university_student_id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(student.university_student_id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(student)}
                          className={`p-1 rounded-full ${
                            student.is_active 
                              ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          }`}
                          title={student.is_active ? 'Deactivate' : 'Activate'}
                          disabled={actionLoading[`status_${student.university_student_id}`]}
                        >
                          {actionLoading[`status_${student.university_student_id}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : student.is_active ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Delete Student"
                          disabled={actionLoading[`delete_${student.university_student_id}`]}
                        >
                          {actionLoading[`delete_${student.university_student_id}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>

        {/* Status Change Modal */}
        {showStatusModal && selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedStudent.is_active ? 'Deactivate' : 'Activate'} University Student
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to {selectedStudent.is_active ? 'deactivate' : 'activate'}{' '}
                  <span className="font-medium">{selectedStudent.full_name || selectedStudent.username}</span>?
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    disabled={actionLoading[`status_${selectedStudent.university_student_id}`]}
                    className={`px-4 py-2 text-white rounded-md flex items-center ${
                      selectedStudent.is_active 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    } disabled:opacity-50`}
                  >
                    {actionLoading[`status_${selectedStudent.university_student_id}`] && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {selectedStudent.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Delete University Student</h3>
                <p className="mt-2 text-sm text-gray-500">
                  This action cannot be undone. This will permanently delete{' '}
                  <span className="font-medium">{selectedStudent.full_name || selectedStudent.username}</span>'s account and all associated data.
                </p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type "DELETE" to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="DELETE"
                  />
                </div>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteConfirmText !== 'DELETE' || actionLoading[`delete_${selectedStudent.university_student_id}`]}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {actionLoading[`delete_${selectedStudent.university_student_id}`] && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    Delete Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UniversityStudentsList;