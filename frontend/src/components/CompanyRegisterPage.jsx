import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, CheckCircle, AlertCircle, MapPin, FileText, Globe, Users, Briefcase } from 'lucide-react';

const CompanyRegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    contactPersonTitle: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    website: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    description: '',
    agreeToTerms: false,
    receiveUpdates: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      if (!formData.agreeToTerms) {
        setMessage({ type: 'error', text: 'Please accept the terms and conditions' });
        setIsLoading(false);
        return;
      }

      const registrationData = {
        companyName: formData.companyName,
        contactPersonName: formData.contactPersonName,
        contactPersonTitle: formData.contactPersonTitle,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: formData.address,
        city: formData.city,
        website: formData.website,
        industry: formData.industry,
        companySize: formData.companySize,
        foundedYear: formData.foundedYear,
        description: formData.description
      };

      console.log('Sending company registration data:', registrationData);

      // Note: You'll need to create this endpoint in your backend
      const response = await fetch('http://127.0.0.1:8000/api/accounts/register/company/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Registration request submitted successfully! We will review your application and contact you within 24-48 hours.' 
        });
        
        // Don't navigate immediately for company registration as it needs approval
        setTimeout(() => {
          navigate('/');
        }, 4000);
        
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Registration failed. Please try again.' 
        });
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const industrySectors = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Real Estate', 'Agriculture', 'Tourism', 'Construction',
    'Transportation', 'Energy', 'Media', 'Government', 'Non-profit', 'Other'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#FFE0B2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/register" className="flex items-center space-x-2 text-[#F57C00] hover:text-[#E65100] transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Role Selection</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-[#F57C00]" />
              <span className="font-bold text-2xl text-[#F57C00]">UniRoute</span>
            </div>
            
            <div className="text-sm text-[#717171]">
              <span>Already have an account? </span>
              <Link to="/login" className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#FFE0B2]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-[#FFF3E0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-[#F57C00]" />
              </div>
              <h1 className="font-bold text-3xl text-[#263238] mb-2">
                Company Registration
              </h1>
              <p className="text-[#717171]">
                Partner with us to offer internships and recruit talent
              </p>
            </div>

            {/* Success/Error Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                message.type === 'success' 
                  ? 'bg-[#81C784]/10 border border-[#81C784]/20' 
                  : 'bg-[#E57373]/10 border border-[#E57373]/20'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-[#81C784]" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-[#E57373]" />
                )}
                <span className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-[#81C784]' : 'text-[#E57373]'
                }`}>
                  {message.text}
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-[#263238] mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                    placeholder="Enter company name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Contact Person Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactPersonName" className="block text-sm font-medium text-[#263238] mb-2">
                    Contact Person Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type="text"
                      id="contactPersonName"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="Contact person name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactPersonTitle" className="block text-sm font-medium text-[#263238] mb-2">
                    Job Title *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type="text"
                      id="contactPersonTitle"
                      name="contactPersonTitle"
                      value={formData.contactPersonTitle}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="e.g. HR Manager"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#263238] mb-2">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="business@company.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#263238] mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="077 123 4567"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Address and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-[#263238] mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="Company address"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-[#263238] mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                    placeholder="City"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Website and Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-[#263238] mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="https://www.company.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-[#263238] mb-2">
                    Industry *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select industry</option>
                    {industrySectors.map((sector) => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Company Size and Founded Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-[#263238] mb-2">
                    Company Size *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select size</option>
                      {companySizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-[#263238] mb-2">
                    Year Founded
                  </label>
                  <input
                    type="number"
                    id="foundedYear"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                    placeholder="e.g. 2010"
                    min="1800"
                    max={new Date().getFullYear()}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#263238] mb-2">
                  Company Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-[#717171]" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white resize-none"
                    placeholder="Brief description of your company, what you do, and what kind of internships/opportunities you offer..."
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#263238] mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="Create password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#F57C00] transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#263238] mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-[#FFE0B2] rounded-xl focus:ring-2 focus:ring-[#F57C00] focus:border-[#F57C00] transition-all bg-white"
                      placeholder="Confirm password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#F57C00] transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#F57C00] border-[#FFE0B2] rounded focus:ring-[#F57C00] mt-0.5"
                    required
                    disabled={isLoading}
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-[#717171]">
                    I agree to the{' '}
                    <a href="#" className="text-[#F4D160] hover:text-[#F4D160]/80 underline">
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-[#F4D160] hover:text-[#F4D160]/80 underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="receiveUpdates"
                    name="receiveUpdates"
                    checked={formData.receiveUpdates}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#F57C00] border-[#FFE0B2] rounded focus:ring-[#F57C00] mt-0.5"
                    disabled={isLoading}
                  />
                  <label htmlFor="receiveUpdates" className="text-sm text-[#717171]">
                    I want to receive updates about platform features and talent recruitment opportunities
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold focus:ring-2 focus:ring-[#F57C00] focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                  isLoading 
                    ? 'bg-[#B0B0B0] cursor-not-allowed text-white' 
                    : 'bg-[#F57C00] hover:bg-[#E65100] text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Application...</span>
                  </div>
                ) : (
                  'Submit Company Registration'
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-[#FFF3E0] rounded-xl">
              <p className="text-sm text-[#F57C00] text-center">
                <strong>Note:</strong> Company registrations require manual approval. We will review your application and contact you within 24-48 hours.
              </p>
            </div>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-[#717171]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegisterPage;
