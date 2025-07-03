import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Users,
  ChevronLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  School,
  BookOpen,
  GraduationCap,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const StudentForm = () => {
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
    student_stage: '',
    school: '',
    district: '',
    grade: '',
    stream: '',
    preferred_subjects: [],
    is_active: true
  });

  const [errors, setErrors] = useState({});

  // Student stage options
  const studentStages = [
    { value: 'O/L', label: 'O/L (Ordinary Level)' },
    { value: 'A/L', label: 'A/L (Advanced Level)' },
    { value: 'University', label: 'University' }
  ];

  // District options
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  // Subject options
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Combined Mathematics',
    'Economics', 'Business Studies', 'Accounting', 'Geography', 'History',
    'Political Science', 'Logic', 'Buddhist Civilization', 'Hindu Civilization',
    'Christian Civilization', 'Islamic Civilization', 'Art', 'Dancing',
    'Music', 'Drama', 'English', 'Sinhala', 'Tamil', 'French', 'German',
    'Japanese', 'Chinese', 'Hindi', 'Pali', 'Sanskrit', 'Arabic'
  ];

  // Stream options
  const streams = [
    'Physical Science', 'Biological Science', 'Commerce', 'Arts',
    'Technology', 'Mathematics'
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      // Mock data for editing
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
        is_active: true
      };
      setFormData(mockStudent);
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

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      preferred_subjects: prev.preferred_subjects.includes(subject)
        ? prev.preferred_subjects.filter(s => s !== subject)
        : [...prev.preferred_subjects, subject]
    }));
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

    if (!formData.student_stage) {
      newErrors.student_stage = 'Student stage is required';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'School is required';
    }

    if (!formData.district) {
      newErrors.district = 'District is required';
    }

    if (formData.preferred_subjects.length === 0) {
      newErrors.preferred_subjects = 'At least one preferred subject is required';
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
        text: isEditMode ? 'Student updated successfully!' : 'Student created successfully!' 
      });
      
      setTimeout(() => {
        navigate('/admin/students');
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
                to="/admin/students"
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Student' : 'Add New Student'}
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
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Stage *
                </label>
                <select
                  name="student_stage"
                  value={formData.student_stage}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.student_stage ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select student stage</option>
                  {studentStages.map(stage => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
                {errors.student_stage && (
                  <p className="mt-1 text-sm text-red-600">{errors.student_stage}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School *
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.school ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter school name"
                  />
                </div>
                {errors.school && (
                  <p className="mt-1 text-sm text-red-600">{errors.school}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select district</option>
                    {districts.map(district => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter grade (e.g., 12, 13)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stream
                </label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select stream</option>
                  {streams.map(stream => (
                    <option key={stream} value={stream}>
                      {stream}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preferred Subjects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Preferred Subjects *</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subjects.map(subject => (
                <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferred_subjects.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
            {errors.preferred_subjects && (
              <p className="mt-2 text-sm text-red-600">{errors.preferred_subjects}</p>
            )}
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
              to="/admin/students"
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

export default StudentForm;