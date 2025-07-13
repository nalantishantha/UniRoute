import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  GraduationCap,
  University,
  BookOpen,
  MapPin,
  Award
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const UniversityStudentsList = () => {
  const navigate = useNavigate();
  const [universityStudents, setUniversityStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterDegree, setFilterDegree] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  // Mock data for university students
  const mockUniversityStudents = [
    {
      id: 1,
      first_name: 'Thilina',
      last_name: 'Perera',
      email: 'thilina.perera@gmail.com',
      contact_number: '0771234567',
      university: 'University of Colombo',
      faculty: 'Faculty of Science',
      degree_program: 'Computer Science',
      year_of_study: '3',
      gpa: '3.75',
      student_id: 'CS19001',
      enrollment_date: '2019-01-15',
      graduation_year: '2023',
      is_active: true,
      created_at: '2019-01-15T10:30:00Z',
      last_login: '2024-07-03T14:20:00Z'
    },
    {
      id: 2,
      first_name: 'Dilini',
      last_name: 'Fernando',
      email: 'dilini.fernando@gmail.com',
      contact_number: '0772345678',
      university: 'University of Peradeniya',
      faculty: 'Faculty of Engineering',
      degree_program: 'Civil Engineering',
      year_of_study: '4',
      gpa: '3.85',
      student_id: 'EN18042',
      enrollment_date: '2018-02-01',
      graduation_year: '2022',
      is_active: true,
      created_at: '2018-02-01T10:30:00Z',
      last_login: '2024-07-02T16:45:00Z'
    },
    {
      id: 3,
      first_name: 'Kamal',
      last_name: 'Wickramasinghe',
      email: 'kamal.wickrama@gmail.com',
      contact_number: '0773456789',
      university: 'University of Moratuwa',
      faculty: 'Faculty of Information Technology',
      degree_program: 'Information Technology',
      year_of_study: '2',
      gpa: '3.65',
      student_id: 'IT20123',
      enrollment_date: '2020-03-10',
      graduation_year: '2024',
      is_active: false,
      created_at: '2020-03-10T10:30:00Z',
      last_login: '2024-06-28T09:15:00Z'
    },
    {
      id: 4,
      first_name: 'Hasini',
      last_name: 'Rajapaksha',
      email: 'hasini.rajapaksha@gmail.com',
      contact_number: '0774567890',
      university: 'University of Kelaniya',
      faculty: 'Faculty of Medicine',
      degree_program: 'Medicine',
      year_of_study: '5',
      gpa: '3.92',
      student_id: 'MD17089',
      enrollment_date: '2017-08-15',
      graduation_year: '2023',
      is_active: true,
      created_at: '2017-08-15T10:30:00Z',
      last_login: '2024-07-03T11:30:00Z'
    },
    {
      id: 5,
      first_name: 'Nuwan',
      last_name: 'Jayasinghe',
      email: 'nuwan.jayasinghe@gmail.com',
      contact_number: '0775678901',
      university: 'Sri Lanka Institute of Information Technology',
      faculty: 'Faculty of Computing',
      degree_program: 'Software Engineering',
      year_of_study: '1',
      gpa: '3.45',
      student_id: 'SE23156',
      enrollment_date: '2023-01-20',
      graduation_year: '2027',
      is_active: true,
      created_at: '2023-01-20T10:30:00Z',
      last_login: '2024-07-03T13:10:00Z'
    }
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setUniversityStudents(mockUniversityStudents);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  // Filter university students
  const filteredStudents = universityStudents.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUniversity = filterUniversity === 'all' || student.university === filterUniversity;
    const matchesDegree = filterDegree === 'all' || student.degree_program === filterDegree;

    return matchesSearch && matchesUniversity && matchesDegree;
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Get unique universities and degrees for filter
  const universities = [...new Set(universityStudents.map(s => s.university))];
  const degrees = [...new Set(universityStudents.map(s => s.degree_program))];

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this university student?')) {
      setUniversityStudents(prev => prev.filter(student => student.id !== studentId));
    }
  };

  const handleToggleStatus = (studentId) => {
    setUniversityStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, is_active: !student.is_active }
          : student
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGPAColor = (gpa) => {
    const numericGPA = parseFloat(gpa);
    if (numericGPA >= 3.7) return 'bg-green-100 text-green-800';
    if (numericGPA >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getYearColor = (year) => {
    const colors = {
      '1': 'bg-blue-100 text-blue-800',
      '2': 'bg-green-100 text-green-800',
      '3': 'bg-yellow-100 text-yellow-800',
      '4': 'bg-orange-100 text-orange-800',
      '5': 'bg-purple-100 text-purple-800'
    };
    return colors[year] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="University Students" pageDescription="Manage all university students">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading university students...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="University Students" pageDescription="Manage all university students">
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
                <University className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">University Students Management</h1>
              </div>
            </div>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search university students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterUniversity}
                  onChange={(e) => setFilterUniversity(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Universities</option>
                  {universities.map(university => (
                    <option key={university} value={university}>{university}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filterDegree}
                  onChange={(e) => setFilterDegree(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Degrees</option>
                  {degrees.map(degree => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredStudents.length} of {universityStudents.length} students
              </div>
            </div>
          </div>
        </div>

        {/* University Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                    Year/GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{student.student_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.university}</div>
                      <div className="text-sm text-gray-500">{student.faculty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.degree_program}</div>
                      <div className="text-sm text-gray-500">Graduation: {student.graduation_year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getYearColor(student.year_of_study)}`}>
                          Year {student.year_of_study}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getGPAColor(student.gpa)}`}>
                          GPA: {student.gpa}
                        </span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{student.contact_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(student.last_login)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/university-students/${student.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/university-students/${student.id}/edit`}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(student.id)}
                          className={`p-1 rounded ${
                            student.is_active
                              ? 'text-orange-600 hover:text-orange-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={student.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {student.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> of{' '}
                    <span className="font-medium">{filteredStudents.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default UniversityStudentsList;