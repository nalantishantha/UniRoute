import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  GraduationCap,
  ChevronLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Book,
  Award,
  Clock,
  DollarSign,
  Star,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Globe
} from 'lucide-react';

const TutorForm = () => {
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
    subjects: [],
    qualification: '',
    experience_years: '',
    hourly_rate: '',
    location: '',
    bio: '',
    availability_hours: '',
    languages: [],
    teaching_mode: 'both', // online, offline, both
    max_students: '',
    is_active: true,
    is_verified: false
  });

  const [errors, setErrors] = useState({});

  // Available options
  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Sinhala', 'Tamil',
    'History', 'Geography', 'Economics', 'Accounting', 'Business Studies',
    'Information Technology', 'Science for Technology', 'Engineering Technology',
    'Art', 'Music', 'Dance', 'Drama', 'Literature'
  ];

  const languageOptions = [
    'Sinhala', 'Tamil', 'English'
  ];

  const locationOptions = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura', 'Polonnaruwa',
    'Kurunegala', 'Ratnapura', 'Badulla', 'Matara', 'Hambantota', 'Gampaha',
    'Kalutara', 'Kegalle', 'Monaragala', 'Nuwara Eliya', 'Puttalam', 'Trincomalee',
    'Vavuniya', 'Mannar', 'Mullaitivu', 'Kilinochchi', 'Batticaloa', 'Ampara'
  ];

  // Mock tutor data for edit mode
  const mockTutor = {
    id: 1,
    first_name: 'Priya',
    last_name: 'Fernando',
    email: 'priya.fernando@edutech.lk',
    contact_number: '0771234567',
    subjects: ['Mathematics', 'Physics'],
    qualification: 'B.Sc. in Mathematics',
    experience_years: 5,
    hourly_rate: 2500,
    location: 'Colombo',
    bio: 'Experienced mathematics and physics tutor with a passion for teaching. I have been helping students achieve their academic goals for over 5 years.',
    availability_hours: '20',
    languages: ['Sinhala', 'English'],
    teaching_mode: 'both',
    max_students: 50,
    is_active: true,
    is_verified: true
  };

  useEffect(() => {
    if (isEditMode) {
      fetchTutor();
    }
  }, [id, isEditMode]);

  const fetchTutor = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFormData(mockTutor);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tutor:', error);
      setMessage({ type: 'error', text: 'Failed to load tutor data' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (name, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [name]: isChecked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(formData.contact_number.replace(/\s/g, ''))) {
      newErrors.contact_number = 'Contact number must be 10 digits';
    }
    if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.experience_years || formData.experience_years < 0) {
      newErrors.experience_years = 'Experience years must be a positive number';
    }
    if (!formData.hourly_rate || formData.hourly_rate < 0) {
      newErrors.hourly_rate = 'Hourly rate must be a positive number';
    }
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: `Tutor ${isEditMode ? 'updated' : 'created'} successfully!` 
        });
        setLoading(false);
        
        // Redirect to tutors list after a short delay
        setTimeout(() => {
          navigate('/admin/tutors');
        }, 1500);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving tutor:', error);
      setMessage({ type: 'error', text: 'Failed to save tutor' });
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/tutors"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Tutor' : 'Add New Tutor'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update tutor information' : 'Create a new tutor profile'}
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.contact_number ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0771234567"
                    />
                  </div>
                  {errors.contact_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select location</option>
                      {locationOptions.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Teaching Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Book className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Teaching Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects Taught *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjectOptions.map(subject => (
                      <label key={subject} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={(e) => handleArrayChange('subjects', subject, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                  {errors.subjects && (
                    <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification *
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.qualification ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., B.Sc. in Mathematics"
                      />
                    </div>
                    {errors.qualification && (
                      <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (Years) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        name="experience_years"
                        value={formData.experience_years}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.experience_years ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Years of experience"
                      />
                    </div>
                    {errors.experience_years && (
                      <p className="mt-1 text-sm text-red-600">{errors.experience_years}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (Rs.) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        name="hourly_rate"
                        value={formData.hourly_rate}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.hourly_rate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="2500"
                      />
                    </div>
                    {errors.hourly_rate && (
                      <p className="mt-1 text-sm text-red-600">{errors.hourly_rate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teaching Mode
                    </label>
                    <select
                      name="teaching_mode"
                      value={formData.teaching_mode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="online">Online Only</option>
                      <option value="offline">In-Person Only</option>
                      <option value="both">Both Online & In-Person</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Hours per Week
                    </label>
                    <input
                      type="number"
                      name="availability_hours"
                      value={formData.availability_hours}
                      onChange={handleInputChange}
                      min="0"
                      max="168"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Students
                    </label>
                    <input
                      type="number"
                      name="max_students"
                      value={formData.max_students}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {languageOptions.map(language => (
                      <label key={language} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={(e) => handleArrayChange('languages', language, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                  {errors.languages && (
                    <p className="mt-1 text-sm text-red-600">{errors.languages}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio/Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your teaching experience and approach..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Settings */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Active Status</span>
                    <p className="text-xs text-gray-500">Tutor can receive new student requests</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Verified Tutor</span>
                    <p className="text-xs text-gray-500">Mark as verified after document review</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{isEditMode ? 'Update Tutor' : 'Create Tutor'}</span>
                    </>
                  )}
                </button>
                
                <Link
                  to="/admin/tutors"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TutorForm;
