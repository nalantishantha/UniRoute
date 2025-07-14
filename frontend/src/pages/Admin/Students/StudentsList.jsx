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
  BookOpen
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data for students
  const mockStudents = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Perera',
      email: 'john.perera@gmail.com',
      contact_number: '0771234567',
      student_stage: 'A/L',
      school: 'Royal College, Colombo',
      district: 'Colombo',
      preferred_subjects: ['Physics', 'Chemistry', 'Mathematics'],
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
      last_login: '2024-07-01T14:20:00Z'
    },
    {
      id: 2,
      first_name: 'Priya',
      last_name: 'Fernando',
      email: 'priya.fernando@gmail.com',
      contact_number: '0772345678',
      student_stage: 'O/L',
      school: 'Visakha Vidyalaya, Colombo',
      district: 'Colombo',
      preferred_subjects: ['Biology', 'Chemistry', 'Physics'],
      is_active: true,
      created_at: '2024-02-20T09:15:00Z',
      last_login: '2024-07-02T11:45:00Z'
    },
    {
      id: 3,
      first_name: 'Kasun',
      last_name: 'Silva',
      email: 'kasun.silva@gmail.com',
      contact_number: '0773456789',
      student_stage: 'A/L',
      school: 'Ananda College, Colombo',
      district: 'Gampaha',
      preferred_subjects: ['Mathematics', 'Physics', 'Chemistry'],
      is_active: false,
      created_at: '2024-03-10T16:45:00Z',
      last_login: '2024-06-15T12:30:00Z'
    },
    {
      id: 4,
      first_name: 'Nimali',
      last_name: 'Wickramasinghe',
      email: 'nimali.wickramasinghe@gmail.com',
      contact_number: '0774567890',
      student_stage: 'Grade 11',
      school: 'Methodist College, Colombo',
      district: 'Kalutara',
      preferred_subjects: ['Commerce', 'Accounting', 'Economics'],
      is_active: true,
      created_at: '2024-04-05T14:20:00Z',
      last_login: '2024-07-03T10:15:00Z'
    },
    {
      id: 5,
      first_name: 'Amal',
      last_name: 'Jayasuriya',
      email: 'amal.jayasuriya@gmail.com',
      contact_number: '0775678901',
      student_stage: 'O/L',
      school: 'Thurstan College, Colombo',
      district: 'Colombo',
      preferred_subjects: ['Science', 'Mathematics', 'English'],
      is_active: true,
      created_at: '2024-05-12T11:30:00Z',
      last_login: '2024-07-03T16:45:00Z'
    }
  ];

  const studentsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  useEffect(() => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.school.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by student stage
    if (filterStage !== 'all') {
      filtered = filtered.filter(student => student.student_stage === filterStage);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStage, students]);

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  const handleToggleStatus = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, is_active: !student.is_active } : student
    ));
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'A/L':
        return 'bg-red-100 text-red-800';
      case 'O/L':
        return 'bg-blue-100 text-blue-800';
      case 'Grade 11':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  if (loading) {
    return (
      <AdminLayout pageTitle="Students" pageDescription="Manage all students">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
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
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredStudents.length} of {students.length} students
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                    Subjects
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
                {currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(student.student_stage)}`}>
                        {student.student_stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <School className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{student.school}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{student.district}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {student.preferred_subjects.slice(0, 2).join(', ')}
                          {student.preferred_subjects.length > 2 && '...'}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="text-[#1D5D9B] hover:text-[#174A7C] p-1 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/students/${student.id}/edit`}
                          className="text-[#81C784] hover:text-[#5EA46A] p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(student.id)}
                          className={`p-1 rounded ${
                            student.is_active
                              ? 'text-[#F4D160] hover:text-[#D9B23A]'
                              : 'text-[#81C784] hover:text-[#5EA46A]'
                          }`}
                          title={student.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {student.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-[#E57373] hover:text-[#C94A4A] p-1 rounded"
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
        </div>
      </div>
    </div>
     </AdminLayout>
  );
};

export default StudentsList;