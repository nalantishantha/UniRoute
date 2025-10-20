import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, CheckCircle, AlertCircle, School, Calendar } from 'lucide-react';

const UniversityStudentRegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    universityId: '',
    facultyId: '',
    degreeProgramId: '',
    durationId: '',
    yearOfStudy: '',
    registrationNumber: '',
    agreeToTerms: false,
    receiveUpdates: true
  });

  // Dropdown data
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [durations, setDurations] = useState([]);

  // Add error boundary effect
  useEffect(() => {
    const handleError = (error) => {
      console.error('Page error caught:', error);
      setPageError(error.message);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setPageError('An unexpected error occurred');
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  // Fetch universities on mount
  useEffect(() => {
    console.log('Fetching universities...');
    
    fetch('http://127.0.0.1:8000/api/universities/')
      .then(res => {
        console.log('Universities response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Universities data:', data);
        setUniversities(data.results || data);
      })
      .catch(error => {
        console.error('Error fetching universities:', error);
        setUniversities([]);
      });
  }, []);

  // Fetch faculties when universityId changes
  useEffect(() => {
    if (formData.universityId) {
      console.log('Fetching faculties for university:', formData.universityId);
      
      fetch(`http://127.0.0.1:8000/api/universities/faculties/?university_id=${formData.universityId}`)
        .then(res => {
          console.log('Faculties response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Faculties data:', data);
          setFaculties(data.results || data);
        })
        .catch(error => {
          console.error('Error fetching faculties:', error);
          setFaculties([]);
        });
    } else {
      setFaculties([]);
    }
  }, [formData.universityId]);

  // Fetch degree programs when facultyId changes
  useEffect(() => {
    if (formData.facultyId) {
      console.log('Fetching degree programs for faculty:', formData.facultyId);
      
      fetch(`http://127.0.0.1:8000/api/universities/degree-programs/?faculty_id=${formData.facultyId}`)
        .then(res => {
          console.log('Degree programs response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Degree programs data:', data);
          setDegreePrograms(data.results || data);
        })
        .catch(error => {
          console.error('Error fetching degree programs:', error);
          setDegreePrograms([]);
        });
    } else {
      setDegreePrograms([]);
    }
  }, [formData.facultyId]);

  // Fetch durations when degreeProgramId changes
  useEffect(() => {
    if (formData.degreeProgramId) {
      console.log('Fetching durations for degree program:', formData.degreeProgramId);
      
      fetch(`http://127.0.0.1:8000/api/universities/degree-program-durations/?degree_program_id=${formData.degreeProgramId}`)
        .then(res => {
          console.log('Durations response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Durations data:', data);
          setDurations(data.results || data);
        })
        .catch(error => {
          console.error('Error fetching durations:', error);
          setDurations([]);
        });
    } else {
      setDurations([]);
    }
  }, [formData.degreeProgramId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle clearing dependent fields when parent selections change
    let updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    if (name === 'universityId') {
      updatedFormData = {
        ...updatedFormData,
        facultyId: '',
        degreeProgramId: '',
        durationId: ''
      };
    } else if (name === 'facultyId') {
      updatedFormData = {
        ...updatedFormData,
        degreeProgramId: '',
        durationId: ''
      };
    } else if (name === 'degreeProgramId') {
      updatedFormData = {
        ...updatedFormData,
        durationId: ''
      };
    }

    setFormData(updatedFormData);
    
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
        confirmPassword: formData.confirmPassword,
        universityId: formData.universityId,
        facultyId: formData.facultyId,
        degreeProgramId: formData.degreeProgramId,
        durationId: formData.durationId,
        yearOfStudy: formData.yearOfStudy,
        registrationNumber: formData.registrationNumber
      };

      console.log('Sending university student registration data:', registrationData);

      // Note: You'll need to create this endpoint in your backend
      const response = await fetch('http://127.0.0.1:8000/api/accounts/register/university-student/', {
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
          navigate('/university-student/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E8] to-[#C8E6C9] flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#C8E6C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/register" className="flex items-center space-x-2 text-[#2E7D32] hover:text-[#1B5E20] transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Role Selection</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-[#2E7D32]" />
              <span className="font-bold text-2xl text-[#2E7D32]">UniRoute</span>
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
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#C8E6C9]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-[#E8F5E8] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-[#2E7D32]" />
              </div>
              <h1 className="font-bold text-3xl text-[#263238] mb-2">
                University Student Registration
              </h1>
              <p className="text-[#717171]">
                Connect with opportunities during your studies
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

            {/* Page Error Message */}
            {pageError && (
              <div className="mb-6 p-4 rounded-xl flex items-center space-x-3 bg-[#E57373]/10 border border-[#E57373]/20">
                <AlertCircle className="h-5 w-5 text-[#E57373]" />
                <span className="text-sm font-medium text-[#E57373]">
                  Page Error: {pageError}
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
                      className="w-full pl-10 pr-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
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
                    className="w-full px-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
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
                    className="w-full pl-10 pr-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
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
                    className="w-full pl-10 pr-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                    placeholder="077 123 4567"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* University Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="universityId" className="block text-sm font-medium text-[#263238] mb-2">
                    University
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <select
                      id="universityId"
                      name="universityId"
                      value={formData.universityId}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select university</option>
                      {universities.map(u => (
                        <option key={u.university_id || u.id} value={u.university_id || u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="facultyId" className="block text-sm font-medium text-[#263238] mb-2">
                    Faculty
                  </label>
                  <select
                    id="facultyId"
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                    required
                    disabled={isLoading || !formData.universityId}
                  >
                    <option value="">Select faculty</option>
                    {faculties.map(f => (
                      <option key={f.faculty_id || f.id} value={f.faculty_id || f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Degree Program & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="degreeProgramId" className="block text-sm font-medium text-[#263238] mb-2">
                    Degree Program
                  </label>
                  <select
                    id="degreeProgramId"
                    name="degreeProgramId"
                    value={formData.degreeProgramId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                    required
                    disabled={isLoading || !formData.facultyId}
                  >
                    <option value="">Select degree program</option>
                    {degreePrograms.map(d => (
                      <option key={d.degree_program_id || d.id} value={d.degree_program_id || d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="durationId" className="block text-sm font-medium text-[#263238] mb-2">
                    Program Duration
                  </label>
                  <select
                    id="durationId"
                    name="durationId"
                    value={formData.durationId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                    required
                    disabled={isLoading || !formData.degreeProgramId}
                  >
                    <option value="">Select duration</option>
                    {durations.map(d => (
                      <option key={d.duration_id || d.id} value={d.duration_id || d.id}>{d.duration || d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year of Study & Registration Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yearOfStudy" className="block text-sm font-medium text-[#263238] mb-2">
                    Year of Study
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#717171]" />
                    <select
                      id="yearOfStudy"
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                      <option value="postgrad">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-[#263238] mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                    placeholder="Registration Number"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
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
                      className="w-full pl-10 pr-12 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                      placeholder="Password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#2E7D32] transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

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
                      className="w-full pl-10 pr-12 py-3 border border-[#C8E6C9] rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all bg-white"
                      placeholder="Confirm"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717171] hover:text-[#2E7D32] transition-colors"
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
                    className="h-4 w-4 text-[#2E7D32] border-[#C8E6C9] rounded focus:ring-[#2E7D32] mt-0.5"
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
                    className="h-4 w-4 text-[#2E7D32] border-[#C8E6C9] rounded focus:ring-[#2E7D32] mt-0.5"
                    disabled={isLoading}
                  />
                  <label htmlFor="receiveUpdates" className="text-sm text-[#717171]">
                    I want to receive updates about internships and career opportunities
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold focus:ring-2 focus:ring-[#2E7D32] focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                  isLoading 
                    ? 'bg-[#B0B0B0] cursor-not-allowed text-white' 
                    : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create University Student Account'
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

export default UniversityStudentRegisterPage;
