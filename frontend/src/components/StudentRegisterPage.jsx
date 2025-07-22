import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const StudentRegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      console.log('Sending registration data:', registrationData);

      const response = await fetch('http://127.0.0.1:8000/api/accounts/register/student/', {
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
          text: 'Registration successful! Welcome to UniRoute!' 
        });
        
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 2000);
        
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F3FB] to-[#C1DBF4] flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#C1DBF4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/register" className="flex items-center space-x-2 text-[#1D5D9B] hover:text-[#174A7C] transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Role Selection</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-[#1D5D9B]" />
              <span className="font-bold text-2xl text-[#1D5D9B]">UniRoute</span>
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
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#C1DBF4]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-[#E7F3FB] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-[#1D5D9B]" />
              </div>
              <h1 className="font-bold text-3xl text-[#263238] mb-2">
                Student Registration
              </h1>
              <p className="text-[#717171]">
                Start your journey to higher education
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
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#263238] mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-xl focus:ring-2 focus:ring-[#1D5D9B] focus:border-[#1D5D9B] transition-all bg-white"
                      placeholder="First name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#263238] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#C1DBF4] rounded-xl focus:ring-2 focus:ring-[#1D5D9B] focus:border-[#1D5D9B] transition-all bg-white"
                    placeholder="Last name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#263238] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-xl focus:ring-2 focus:ring-[#1D5D9B] focus:border-[#1D5D9B] transition-all bg-white"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#263238] mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#C1DBF4] rounded-xl focus:ring-2 focus:ring-[#1D5D9B] focus:border-[#1D5D9B] transition-all bg-white"
                    placeholder="077 123 4567"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#263238] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-[#C1DBF4] rounded-xl focus:ring-2 focus:ring-[#1D5D9B] focus:border-[#1D5D9B] transition-all bg-white"
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#1D5D9B] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#263238] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-[#C1DBF4] rounded-xl focus:ring-2 focus:ring-[#1D5D9B] focus:border-[#1D5D9B] transition-all bg-white"
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#1D5D9B] transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
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
                    className="h-4 w-4 text-[#1D5D9B] border-[#C1DBF4] rounded focus:ring-[#1D5D9B] mt-0.5"
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
                    className="h-4 w-4 text-[#1D5D9B] border-[#C1DBF4] rounded focus:ring-[#1D5D9B] mt-0.5"
                    disabled={isLoading}
                  />
                  <label htmlFor="receiveUpdates" className="text-sm text-[#717171]">
                    I want to receive updates about new features and university programs
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold focus:ring-2 focus:ring-[#1D5D9B] focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                  isLoading 
                    ? 'bg-[#B0B0B0] cursor-not-allowed text-white' 
                    : 'bg-[#1D5D9B] hover:bg-[#174A7C] text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Student Account'
                )}
              </button>
            </form>

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

export default StudentRegisterPage;
