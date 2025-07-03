import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  University,
  Edit,
  Trash2,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  GraduationCap,
  BookOpen,
  Clock,
  Activity,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Award,
  Building,
  Hash,
  Target,
  Users,
  FileText,
  TrendingUp,
  Star
} from 'lucide-react';

const UniversityStudentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock university student data
  const mockUniversityStudent = {
    id: 1,
    first_name: 'Thilina',
    last_name: 'Perera',
    email: 'thilina.perera@gmail.com',
    contact_number: '0771234567',
    student_id: 'CS19001',
    university: 'University of Colombo',
    faculty: 'Faculty of Science',
    degree_program: 'Computer Science',
    year_of_study: '3',
    gpa: '3.75',
    enrollment_date: '2019-01-15',
    graduation_year: '2023',
    specialization: 'Machine Learning',
    thesis_topic: 'Deep Learning Applications in Natural Language Processing',
    supervisor: 'Dr. Kasun Silva',
    is_active: true,
    created_at: '2019-01-15T10:30:00Z',
    last_login: '2024-07-03T14:20:00Z',
    activity_log: [
      {
        id: 1,
        action: 'Profile Updated',
        timestamp: '2024-07-03T14:20:00Z',
        details: 'Updated thesis topic and supervisor information'
      },
      {
        id: 2,
        action: 'GPA Updated',
        timestamp: '2024-07-01T10:15:00Z',
        details: 'Updated GPA from 3.65 to 3.75'
      },
      {
        id: 3,
        action: 'Login',
        timestamp: '2024-06-30T16:45:00Z',
        details: 'Logged in from university computer lab'
      },
      {
        id: 4,
        action: 'Course Enrollment',
        timestamp: '2024-06-28T09:30:00Z',
        details: 'Enrolled in Advanced Machine Learning course'
      }
    ],
    academic_performance: {
      total_credits: 90,
      credits_completed: 78,
      current_semester: 'Semester 6',
      courses_this_semester: 5,
      attendance_rate: 92
    },
    research_activities: [
      {
        id: 1,
        title: 'Machine Learning Research Project',
        status: 'In Progress',
        start_date: '2024-03-01',
        description: 'Working on deep learning applications for NLP'
      },
      {
        id: 2,
        title: 'Data Science Workshop',
        status: 'Completed',
        start_date: '2024-01-15',
        description: 'Participated in advanced data science workshop'
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
      setStudent(mockUniversityStudent);
      setLoading(false);
    }, 1000);
  }, [id, navigate]);

  const handleDeleteStudent = () => {
    if (window.confirm('Are you sure you want to delete this university student? This action cannot be undone.')) {
      setMessage({ type: 'success', text: 'University student deleted successfully!' });
      setTimeout(() => {
        navigate('/admin/university-students');
      }, 1500);
    }
  };

  const handleToggleStatus = () => {
    const action = student.is_active ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this university student?`)) {
      setStudent(prev => ({ ...prev, is_active: !prev.is_active }));
      setMessage({ 
        type: 'success', 
        text: `University student ${action}d successfully!` 
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

  const getGPAColor = (gpa) => {
    const numericGPA = parseFloat(gpa);
    if (numericGPA >= 3.7) return 'text-green-600';
    if (numericGPA >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGPABadgeColor = (gpa) => {
    const numericGPA = parseFloat(gpa);
    if (numericGPA >= 3.7) return 'bg-green-100 text-green-800';
    if (numericGPA >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading university student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-4">The university student you're looking for doesn't exist.</p>
          <Link
            to="/admin/university-students"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to University Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/university-students"
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <University className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">University Student Details</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to={`/admin/university-students/${student.id}/edit`}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <p className="text-gray-600 mb-2">{student.email}</p>
                <p className="text-sm text-gray-500 mb-3">ID: {student.student_id}</p>
                <div className="flex justify-center mb-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    Year {student.year_of_study} Student
                  </span>
                </div>
                <div className="flex justify-center mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getGPABadgeColor(student.gpa)}`}>
                    GPA: {student.gpa}
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
                    <span className="text-sm text-gray-900">Enrolled {formatDate(student.enrollment_date)}</span>
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
            {/* University Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">University Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">University</p>
                    <p className="text-sm text-gray-600">{student.university}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Faculty</p>
                    <p className="text-sm text-gray-600">{student.faculty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Degree Program</p>
                    <p className="text-sm text-gray-600">{student.degree_program}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Specialization</p>
                    <p className="text-sm text-gray-600">{student.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Graduation Year</p>
                    <p className="text-sm text-gray-600">{student.graduation_year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Supervisor</p>
                    <p className="text-sm text-gray-600">{student.supervisor}</p>
                  </div>
                </div>
              </div>
              {student.thesis_topic && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Thesis Topic</p>
                  <p className="text-sm text-gray-600">{student.thesis_topic}</p>
                </div>
              )}
            </div>

            {/* Academic Performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getGPAColor(student.gpa)}`}>{student.gpa}</div>
                  <div className="text-sm text-gray-600">Current GPA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{student.academic_performance.credits_completed}</div>
                  <div className="text-sm text-gray-600">Credits Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{student.academic_performance.attendance_rate}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Semester: {student.academic_performance.current_semester}</span>
                  <span className="text-gray-600">Courses: {student.academic_performance.courses_this_semester}</span>
                </div>
              </div>
            </div>

            {/* Research Activities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Research Activities</h3>
              <div className="space-y-4">
                {student.research_activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activity.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Started: {formatDate(activity.start_date)}</p>
                    </div>
                  </div>
                ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityStudentView;