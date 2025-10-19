import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import { studentsAPI } from '../../../utils/studentsAPI';
import {
  GraduationCap,
  Edit,
  Trash2,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  School,
  BookOpen,
  Clock,
  Activity,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Award,
  Loader2
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const StudentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState({ delete: false, status: false });

  // Fetch student data from API
  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsAPI.getStudentById(id);
      setStudent(response.student);
    } catch (err) {
      setError(err.message || 'Failed to fetch student details');
      console.error('Error fetching student:', err);
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

    if (id) {
      fetchStudent();
    }
  }, [id, navigate]);

  const handleDeleteStudent = async () => {
    const studentName = getDisplayName(student.full_name, student.email);
    
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
      setActionLoading(prev => ({ ...prev, delete: true }));
      setMessage({ type: '', text: '' });
      
      await studentsAPI.deleteStudent(student.student_id);
      
      setMessage({ 
        type: 'success', 
        text: `${studentName} has been permanently deleted. Redirecting...` 
      });
      
      setTimeout(() => {
        navigate('/admin/students');
      }, 2000);
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: `Failed to delete ${studentName}: ${err.message}` 
      });
      console.error('Delete error:', err);
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleToggleStatus = async () => {
    const studentName = getDisplayName(student.full_name, student.email);
    const action = student.is_active ? 'deactivate' : 'activate';
    const actionPast = student.is_active ? 'deactivated' : 'activated';
    
    // Enhanced confirmation for deactivation
    let confirmMessage;
    if (student.is_active) {
      confirmMessage = `Deactivate ${studentName}?\n\nThis will:\n- Prevent student from logging in\n- Hide their profile from searches\n- Suspend their access to the platform\n\nYou can reactivate them later.`;
    } else {
      confirmMessage = `Activate ${studentName}?\n\nThis will:\n- Allow student to log in\n- Make their profile visible\n- Restore their platform access`;
    }
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, status: true }));
      setMessage({ type: '', text: '' });
      
      await studentsAPI.updateStudentStatus(student.student_id, !student.is_active);
      setStudent(prev => ({ ...prev, is_active: !prev.is_active }));
      
      setMessage({ 
        type: 'success', 
        text: `${studentName} has been ${actionPast} successfully.` 
      });
      
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
      setActionLoading(prev => ({ ...prev, status: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get display name from full_name or fallback to email
  const getDisplayName = (fullName, email) => {
    if (fullName && fullName.trim()) {
      return fullName;
    }
    return email ? email.split('@')[0] : 'N/A';
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Student Details" pageDescription="Loading student information">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout pageTitle="Error" pageDescription="Failed to load student information">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Student</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={fetchStudent}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/admin/students"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Students
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout pageTitle="Student Not Found" pageDescription="Student information not available">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Not Found</h2>
            <p className="text-gray-600 mb-4">The student you're looking for doesn't exist.</p>
            <Link
              to="/admin/students"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Students
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      pageTitle="Student Details" 
      pageDescription={`View and manage ${getDisplayName(student.full_name, student.email)}'s information`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/admin/students"
            className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Students</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link
              to={`/admin/students/${student.student_id}/edit`}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Student</span>
            </Link>
            <button
              onClick={handleToggleStatus}
              disabled={actionLoading.status}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                actionLoading.status
                  ? 'bg-gray-400 cursor-not-allowed'
                  : student.is_active
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {actionLoading.status ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : student.is_active ? (
                <UserX className="h-4 w-4" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}
              <span>
                {actionLoading.status 
                  ? 'Processing...' 
                  : student.is_active ? 'Deactivate' : 'Activate'
                }
              </span>
            </button>
            <button
              onClick={handleDeleteStudent}
              disabled={actionLoading.delete}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                actionLoading.delete
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {actionLoading.delete ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>{actionLoading.delete ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {getDisplayName(student.full_name, student.email)}
                </h2>
                <p className="text-gray-600 mb-3">{student.email}</p>
                <div className="flex justify-center mb-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {student.current_stage} Student
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    student.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{student.contact_number || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{student.username}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Joined {formatDate(student.created_at)}</span>
                  </div>
                  {student.updated_at && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">Last updated {formatDateTime(student.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <School className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">School</p>
                    <p className="text-sm text-gray-600">{student.school || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">District</p>
                    <p className="text-sm text-gray-600">{student.district || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Stage</p>
                    <p className="text-sm text-gray-600">{student.current_stage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Gender</p>
                    <p className="text-sm text-gray-600">{student.gender || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              {student.location && (
                <div className="mt-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{student.location}</p>
                    </div>
                  </div>
                </div>
              )}
              {student.bio && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Bio</p>
                  <p className="text-sm text-gray-600">{student.bio}</p>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">User ID</p>
                  <p className="text-sm text-gray-600">{student.user_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Student ID</p>
                  <p className="text-sm text-gray-600">{student.student_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    student.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Verification Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    student.is_verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.is_verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentView;