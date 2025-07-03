import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  University,
  ChevronLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Hash,
  Building,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const UniversityStudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    student_id: '',
    university: '',
    faculty: '',
    degree_program: '',
    year_of_study: '',
    gpa: '',
    enrollment_date: '',
    graduation_year: '',
    specialization: '',
    thesis_topic: '',
    supervisor: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});

  // Sri Lankan universities
  const universities = [
    'University of Colombo',
    'University of Peradeniya',
    'University of Moratuwa',
    'University of Kelaniya',
    'University of Sri Jayewardenepura',
    'University of Ruhuna',
    'University of Jaffna',
    'Eastern University',
    'South Eastern University',
    'Wayamba University',
    'Sabaragamuwa University',
    'Rajarata University',
    'Uva Wellassa University',
    'Open University of Sri Lanka',
    'Sri Lanka Institute of Information Technology',
    'NSBM Green University',
    'Informatics Institute of Technology',
    'Sri Lanka Institute of Advanced Technological Education'
  ];

  // Common faculties
  const faculties = [
    'Faculty of Science',
    'Faculty of Engineering',
    'Faculty of Medicine',
    'Faculty of Arts',
    'Faculty of Management',
    'Faculty of Law',
    'Faculty of Education',
    'Faculty of Agriculture',
    'Faculty of Veterinary Medicine',
    'Faculty of Dental Sciences',
    'Faculty of Computing',
    'Faculty of Information Technology',
    'Faculty of Business',
    'Faculty of Social Sciences',
    'Faculty of Applied Sciences',
    'Faculty of Technology',
    'Faculty of Graduate Studies'
  ];

  // Common degree programs
  const degreePrograms = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronic Engineering',
    'Medicine',
    'Dentistry',
    'Pharmacy',
    'Business Administration',
    'Management',
    'Accounting',
    'Finance',
    'Marketing',
    'Economics',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Psychology',
    'Sociology',
    'Political Science',
    'Law',
    'Education',
    'English',
    'Sinhala',
    'Tamil',
    'Agriculture',
    'Veterinary Science'
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      // Mock data for editing
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
        is_active: true
      };
      setFormData(mockUniversityStudent);
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(formData.contact_number.replace(/\s/g, ''))) {
      newErrors.contact_number = 'Contact number must be 10 digits';
    }

    if (!formData.student_id.trim()) {
      newErrors.student_id = 'Student ID is required';
    }

    if (!formData.university) {
      newErrors.university = 'University is required';
    }

    if (!formData.faculty) {
      newErrors.faculty = 'Faculty is required';
    }

    if (!formData.degree_program) {
      newErrors.degree_program = 'Degree program is required';
    }

    if (!formData.year_of_study) {
      newErrors.year_of_study = 'Year of study is required';
    }

    if (formData.gpa && (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4)) {
      newErrors.gpa = 'GPA must be a number between 0 and 4';
    }

    if (!formData.enrollment_date) {
      newErrors.enrollment_date = 'Enrollment date is required';
    }

    if (!formData.graduation_year) {
      newErrors.graduation_year = 'Graduation year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ 
        type: 'success', 
        text: isEditMode ? 'University student updated successfully!' : 'University student created successfully!' 
      });
      
      setTimeout(() => {
        navigate('/admin/university-students');
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit University Student' : 'Add New University Student'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                </div>
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contact_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact number"
                  />
                </div>
                {errors.contact_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.student_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter student ID (e.g., CS19001)"
                  />
                </div>
                {errors.student_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* University Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">University Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.university ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select university</option>
                    {universities.map(university => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.university && (
                  <p className="mt-1 text-sm text-red-600">{errors.university}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty *
                </label>
                <select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.faculty ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select faculty</option>
                  {faculties.map(faculty => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
                {errors.faculty && (
                  <p className="mt-1 text-sm text-red-600">{errors.faculty}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree Program *
                </label>
                <select
                  name="degree_program"
                  value={formData.degree_program}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.degree_program ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select degree program</option>
                  {degreePrograms.map(program => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
                {errors.degree_program && (
                  <p className="mt-1 text-sm text-red-600">{errors.degree_program}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Study *
                </label>
                <select
                  name="year_of_study"
                  value={formData.year_of_study}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.year_of_study ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                  <option value="6">6th Year</option>
                </select>
                {errors.year_of_study && (
                  <p className="mt-1 text-sm text-red-600">{errors.year_of_study}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA
                </label>
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="4"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.gpa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter GPA (0.00 - 4.00)"
                />
                {errors.gpa && (
                  <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter specialization area"
                />
              </div>
            </div>
          </div>

          {/* Academic Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Academic Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="enrollment_date"
                    value={formData.enrollment_date}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.enrollment_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.enrollment_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.enrollment_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year *
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleInputChange}
                    min="2020"
                    max="2030"
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.graduation_year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter graduation year"
                  />
                </div>
                {errors.graduation_year && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduation_year}</p>
                )}
              </div>
            </div>
          </div>

          {/* Research Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Research Information (Optional)</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thesis/Project Topic
                </label>
                <textarea
                  name="thesis_topic"
                  value={formData.thesis_topic}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter thesis or final project topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supervisor
                </label>
                <input
                  type="text"
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter supervisor name"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Status</h2>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Active student
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/admin/university-students"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Saving...' : (isEditMode ? 'Update Student' : 'Create Student')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversityStudentForm;