import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
      console.log('Login attempt:', formData);

      const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Login API Response:', data);

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Login successful! Welcome back!' 
        });
        
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => {
          const userType = data.user.user_type;
          console.log('User type:', userType);
          
          switch(userType) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'uni_student':
              navigate('/university-student/dashboard');
              break;
            case 'student':
            default:
              navigate('/student/home');
              break;
          }
        }, 1000);
        
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Login failed. Please try again.' 
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
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
            <Link to="/" className="flex items-center space-x-2 text-[#1D5D9B] hover:text-[#174A7C] transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-[#1D5D9B]" />
              <span className="font-bold text-2xl text-[#1D5D9B]">UniRoute</span>
            </div>
            
            <div className="text-sm text-[#717171]">
              <span>New here? </span>
              <Link to="/register" className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium">
                Create account
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
                Welcome Back
              </h1>
              <p className="text-[#717171]">
                Sign in to continue your educational journey
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
                    placeholder="Enter your email address"
                    required
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
                    placeholder="Enter your password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#1D5D9B] border-[#C1DBF4] rounded focus:ring-[#1D5D9B]"
                    disabled={isLoading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-[#717171]">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-[#F4D160] hover:text-[#F4D160]/80 transition-colors">
                  Forgot password?
                </a>
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
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-[#717171]">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Test Credentials Info */}
          {/* <div className="mt-6 p-4 bg-white/80 border border-[#C1DBF4] rounded-xl backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-[#263238] mb-2">Test Credentials:</h3>
            <div className="space-y-2">
              <div className="text-xs text-[#717171]">
                <strong>Student:</strong><br/>
                Email: <code className="bg-[#E7F3FB] px-1 rounded">perera@gmail.com</code><br/>
                Password: <code className="bg-[#E7F3FB] px-1 rounded">mypassword123</code>
              </div>
              <div className="text-xs text-[#717171]">
                <strong>Admin:</strong><br/>
                Email: <code className="bg-[#E7F3FB] px-1 rounded">admin@uniroute.com</code><br/>
                Password: <code className="bg-[#E7F3FB] px-1 rounded">admin123</code>
              </div>
              <div className="text-xs text-[#717171]">
                <strong>University Student:</strong><br/>
                Email: <code className="bg-[#E7F3FB] px-1 rounded">sarah.silva@university.lk</code><br/>
                Password: <code className="bg-[#E7F3FB] px-1 rounded">sarah123</code>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;