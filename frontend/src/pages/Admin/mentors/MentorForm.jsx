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
  Building,
  Briefcase,
  Award,
  Globe,
  Star,
  BookOpen,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';

const MentorForm = () => {
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
    company: '',
    position: '',
    experience_years: '',
    industry: '',
    mentorship_capacity: '',
    expertise_areas: [],
    linkedin_profile: '',
    bio: '',
    is_active: true,
    is_verified: false
  });

  const [errors, setErrors] = useState({});
  const [newExpertise, setNewExpertise] = useState('');

  // Industry options
  const industries = [
    'Technology',
    'Banking & Finance',
    'Healthcare',
    'Marketing & Advertising',
    'Education',
    'Manufacturing',
    'Retail & E-commerce',
    'Consulting',
    'Real Estate',
    'Transportation & Logistics',
    'Energy & Utilities',
    'Government & Public Sector',
    'Non-Profit',
    'Startup & Innovation',
    'Media & Entertainment',
    'Agriculture',
    'Tourism & Hospitality',
    'Construction',
    'Legal Services',
    'Other'
  ];

  // Common expertise areas
  const commonExpertiseAreas = [
    'Software Development',
    'Machine Learning',
    'Data Science',
    'Cloud Computing',
    'Cybersecurity',
    'Product Management',
    'Business Strategy',
    'Marketing Strategy',
    'Digital Marketing',
    'Financial Analysis',
    'Investment Banking',
    'Risk Management',
    'Project Management',
    'Leadership',
    'Entrepreneurship',
    'Innovation',
    'Research & Development',
    'Quality Assurance',
    'Human Resources',
    'Operations Management',
    'Supply Chain',
    'Sales',
    'Customer Success',
    'UI/UX Design',
    'Content Creation',
    'Brand Strategy',
    'Healthcare Technology',
    'Biomedical Engineering',
    'Environmental Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering'
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      // Mock data for editing
      const mockMentor = {
        id: 1,
        first_name: 'Dilshan',
        last_name: 'Rathnayake',
        email: 'dilshan.rathnayake@techcorp.lk',
        contact_number: '0771234567',
        company: 'TechCorp Lanka',
        position: 'Senior Software Engineer',
        experience_years: '8',
        industry: 'Technology',
        mentorship_capacity: '5',
        expertise_areas: ['Software Development', 'Machine Learning', 'Cloud Computing'],
        linkedin_profile: 'https://linkedin.com/in/dilshan-rathnayake',
        bio: 'Experienced software engineer with expertise in full-stack development and machine learning.',
        is_active: true,
        is_verified: true
      };
      setFormData(mockMentor);
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

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !formData.expertise_areas.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise_areas: [...prev.expertise_areas, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (expertiseToRemove) => {
    setFormData(prev => ({
      ...prev,
      expertise_areas: prev.expertise_areas.filter(exp => exp !== expertiseToRemove)
    }));
  };

  const handleExpertiseSelect = (expertise) => {
    if (!formData.expertise_areas.includes(expertise)) {
      setFormData(prev => ({
        ...prev,
        expertise_areas: [...prev.expertise_areas, expertise]
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

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.experience_years) {
      newErrors.experience_years = 'Experience years is required';
    } else if (isNaN(formData.experience_years) || formData.experience_years < 0 || formData.experience_years > 50) {
      newErrors.experience_years = 'Experience years must be a number between 0 and 50';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.mentorship_capacity) {
      newErrors.mentorship_capacity = 'Mentorship capacity is required';
    } else if (isNaN(formData.mentorship_capacity) || formData.mentorship_capacity < 1 || formData.mentorship_capacity > 20) {
      newErrors.mentorship_capacity = 'Mentorship capacity must be a number between 1 and 20';
    }

    if (formData.expertise_areas.length === 0) {
      newErrors.expertise_areas = 'At least one expertise area is required';
    }

    if (formData.linkedin_profile && !formData.linkedin_profile.includes('linkedin.com')) {
      newErrors.linkedin_profile = 'Please enter a valid LinkedIn profile URL';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters long';
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
        text: isEditMode ? 'Mentor updated successfully!' : 'Mentor created successfully!' 
      });
      
      setTimeout(() => {
        navigate('/admin/mentors');
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
                to="/admin/mentors"
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Mentor' : 'Add New Mentor'}
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

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.company ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter company name"
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.position ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter job position"
                  />
                </div>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.experience_years ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter years of experience"
                  />
                </div>
                {errors.experience_years && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience_years}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.industry ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mentorship Capacity *
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="mentorship_capacity"
                    value={formData.mentorship_capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.mentorship_capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Number of mentees you can handle"
                  />
                </div>
                {errors.mentorship_capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.mentorship_capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    name="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.linkedin_profile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
                {errors.linkedin_profile && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedin_profile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Expertise Areas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Expertise Areas *</h2>
            
            {/* Add Custom Expertise */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add custom expertise area"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                />
                <button
                  type="button"
                  onClick={handleAddExpertise}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Common Expertise Areas */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Common Expertise Areas:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {commonExpertiseAreas.map(area => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleExpertiseSelect(area)}
                    disabled={formData.expertise_areas.includes(area)}
                    className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                      formData.expertise_areas.includes(area)
                        ? 'bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Expertise Areas */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Expertise Areas:</p>
              <div className="flex flex-wrap gap-2">
                {formData.expertise_areas.map((area, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {area}
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(area)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              {formData.expertise_areas.length === 0 && (
                <p className="text-sm text-gray-500 italic">No expertise areas selected</p>
              )}
              {errors.expertise_areas && (
                <p className="mt-1 text-sm text-red-600">{errors.expertise_areas}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Bio *</h2>
            <div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write a brief bio about yourself, your experience, and what you can offer as a mentor (minimum 50 characters)"
              />
              <div className="flex justify-between items-center mt-2">
                {errors.bio && (
                  <p className="text-sm text-red-600">{errors.bio}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {formData.bio.length} characters (minimum 50)
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Status</h2>
            <div className="space-y-4">
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
                  Active mentor (can accept new mentees)
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_verified"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_verified" className="text-sm text-gray-700">
                  Verified mentor (has been background checked)
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/admin/mentors"
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
              <span>{loading ? 'Saving...' : (isEditMode ? 'Update Mentor' : 'Create Mentor')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorForm;
