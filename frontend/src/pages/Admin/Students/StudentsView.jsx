import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
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
  Award
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const StudentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock student data
  const mockStudent = {
    id: 1,
    first_name: 'Kasun',
    last_name: 'Silva',
    email: 'kasun.silva@gmail.com',
    contact_number: '0771234567',
    student_stage: 'A/L',
    school: 'Royal College, Colombo',
    district: 'Colombo',
    grade: '12',
    stream: 'Physical Science',
    preferred_subjects: ['Physics', 'Chemistry', 'Combined Mathematics'],
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    last_login: '2024-07-01T14:20:00Z',
    activity_log: [
      {
        id: 1,
        action: 'Profile Updated',
        timestamp: '2024-07-01T14:20:00Z',
        details: 'Updated academic information'
      },
      {
        id: 2,
        action: 'Login',
        timestamp: '2024-07-01T14:15:00Z',
        details: 'Logged in from mobile app'
      },
      {
        id: 3,
        action: 'Subject Selection',
        timestamp: '2024-06-28T10:30:00Z',
        details: 'Updated preferred subjects'
      }
    ]
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setStudent(mockStudent);
      setLoading(false);
    }, 1000);
  }, [id, navigate]);

  const handleDeleteStudent = () => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      setMessage({ type: 'success', text: 'Student deleted successfully!' });
      setTimeout(() => {
        navigate('/admin/students');
      }, 1500);
    }
  };

  const handleToggleStatus = () => {
    const action = student.is_active ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this student?`)) {
      setStudent(prev => ({ ...prev, is_active: !prev.is_active }));
      setMessage({ 
        type: 'success', 
        text: `Student ${action}d successfully!` 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // if (loading) {
  //   return (
  //     <AdminLayout pageTitle="Student Details" pageDescription="Loading student information">
  //       <div className="flex items-center justify-center h-64">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
  //           <p className="text-gray-600">Loading student details...</p>
  //         </div>
  //       </div>
  //     </AdminLayout>
  //   );
  // }

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
      pageDescription={`View and manage ${student.first_name} ${student.last_name}'s information`}
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
              to={`/admin/students/${student.id}/edit`}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Student</span>
            </Link>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                student.is_active
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {student.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              <span>{student.is_active ? 'Deactivate' : 'Activate'}</span>
            </button>
            <button
              onClick={handleDeleteStudent}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
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
                  {student.first_name} {student.last_name}
                </h2>
                <p className="text-gray-600 mb-3">{student.email}</p>
                <div className="flex justify-center mb-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {student.student_stage} Student
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
                    <span className="text-sm text-gray-900">{student.contact_number}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Joined {formatDate(student.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Last login {formatDateTime(student.last_login)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Details & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <School className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">School</p>
                    <p className="text-sm text-gray-600">{student.school}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">District</p>
                    <p className="text-sm text-gray-600">{student.district}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stage</p>
                    <p className="text-sm text-gray-600">{student.student_stage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stream</p>
                    <p className="text-sm text-gray-600">{student.stream}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Preferred Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {student.preferred_subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {student.activity_log.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Total Logins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Courses Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">14</div>
                  <div className="text-sm text-gray-600">Days Active</div>
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