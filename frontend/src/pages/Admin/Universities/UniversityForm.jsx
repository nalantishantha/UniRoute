import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import {
  Building2,
  ChevronLeft,
  Save,
  X,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Users,
  Award,
  FileText,
  AlertCircle,
  CheckCircle,
  Upload,
  Image
} from 'lucide-react';

const UniversityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    type: 'public',
    location: '',
    address: '',
    contact_number: '',
    email: '',
    website: '',
    established_year: '',
    total_students: '',
    total_faculties: '',
    ranking: '',
    accreditation: '',
    description: '',
    logo_url: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});

  // Location options for Sri Lankan cities
  const locationOptions = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura', 'Polonnaruwa',
    'Kurunegala', 'Ratnapura', 'Badulla', 'Matara', 'Hambantota', 'Gampaha',
    'Kalutara', 'Kegalle', 'Monaragala', 'Nuwara Eliya', 'Puttalam', 'Trincomalee',
    'Vavuniya', 'Mannar', 'Mullaitivu', 'Kilinochchi', 'Batticaloa', 'Ampara',
    'Malabe', 'Pitipana', 'Homagama'
  ];

  // Mock university data for edit mode
  const mockUniversity = {
    id: 1,
    name: 'University of Colombo',
    short_name: 'UOC',
    type: 'public',
    location: 'Colombo',
    address: 'College House, University of Colombo, Colombo 03',
    contact_number: '0112581835',
    email: 'info@cmb.ac.lk',
    website: 'https://www.cmb.ac.lk',
    established_year: 1921,
    total_students: 12500,
    total_faculties: 8,
    ranking: 1,
    accreditation: 'UGC Approved',
    description: 'The University of Colombo is a leading public university in Sri Lanka, established in 1921. It offers undergraduate and postgraduate programs across various disciplines.',
    logo_url: '',
    is_active: true
  };

  useEffect(() => {
    if (isEditMode) {
      fetchUniversity();
    }
  }, [id, isEditMode]);

  const fetchUniversity = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFormData(mockUniversity);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching university:', error);
      setMessage({ type: 'error', text: 'Failed to load university data' });
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'University name is required';
    if (!formData.short_name.trim()) newErrors.short_name = 'Short name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(formData.contact_number.replace(/\s/g, ''))) {
      newErrors.contact_number = 'Contact number must be 10 digits';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL (include http:// or https://)';
    }
    if (!formData.established_year || formData.established_year < 1800 || formData.established_year > new Date().getFullYear()) {
      newErrors.established_year = 'Please enter a valid establishment year';
    }
    if (!formData.total_students || formData.total_students < 0) {
      newErrors.total_students = 'Total students must be a positive number';
    }
    if (!formData.total_faculties || formData.total_faculties < 0) {
      newErrors.total_faculties = 'Total faculties must be a positive number';
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

    try {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: `University ${isEditMode ? 'updated' : 'created'} successfully!` 
        });
        setLoading(false);
        
        // Redirect to universities list after a short delay
        setTimeout(() => {
          navigate('/admin/universities');
        }, 1500);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving university:', error);
      setMessage({ type: 'error', text: 'Failed to save university' });
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
            to="/admin/universities"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit University' : 'Add New University'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update university information' : 'Create a new university profile'}
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
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter university name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Name/Abbreviation *
                  </label>
                  <input
                    type="text"
                    name="short_name"
                    value={formData.short_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.short_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., UOC, SLIIT"
                  />
                  {errors.short_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.short_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public University</option>
                    <option value="private">Private University</option>
                  </select>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Established Year *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      name="established_year"
                      value={formData.established_year}
                      onChange={handleInputChange}
                      min="1800"
                      max={new Date().getFullYear()}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.established_year ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="1921"
                    />
                  </div>
                  {errors.established_year && (
                    <p className="mt-1 text-sm text-red-600">{errors.established_year}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="0112581835"
                    />
                  </div>
                  {errors.contact_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
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
                      placeholder="info@university.ac.lk"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.website ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://www.university.ac.lk"
                    />
                  </div>
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Statistics & Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Students *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      name="total_students"
                      value={formData.total_students}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.total_students ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="12500"
                    />
                  </div>
                  {errors.total_students && (
                    <p className="mt-1 text-sm text-red-600">{errors.total_students}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Faculties *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      name="total_faculties"
                      value={formData.total_faculties}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.total_faculties ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="8"
                    />
                  </div>
                  {errors.total_faculties && (
                    <p className="mt-1 text-sm text-red-600">{errors.total_faculties}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    National Ranking
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      name="ranking"
                      value={formData.ranking}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accreditation
                  </label>
                  <input
                    type="text"
                    name="accreditation"
                    value={formData.accreditation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="UGC Approved"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description about the university..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">University Logo</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">PNG, JPG up to 2MB</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Logo URL
                  </label>
                  <input
                    type="url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

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
                    <p className="text-xs text-gray-500">University is active and visible to students</p>
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
                      <span>{isEditMode ? 'Update University' : 'Create University'}</span>
                    </>
                  )}
                </button>
                
                <Link
                  to="/admin/universities"
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

export default UniversityForm;
