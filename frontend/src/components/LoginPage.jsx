import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    email: '', // ✅ Changed from username to email
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  // Update the handleSubmit function

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage({ type: '', text: '' });
  
  try {
    console.log('Login attempt:', formData);

    // Send API request to Django backend
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
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on user type
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
            navigate('/student/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-accent-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-primary-400 hover:text-primary-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-400" />
              <span className="font-display font-bold text-2xl text-primary-400">UniRoute</span>
            </div>
            
            <div className="text-sm text-primary-300">
              <span>New here? </span>
              <Link to="/register" className="text-accent-300 hover:text-accent-400 font-medium">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-accent-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-primary-400" />
              </div>
              <h1 className="font-display font-bold text-3xl text-primary-400 mb-2">
                Welcome Back
              </h1>
              <p className="text-primary-300">
                Sign in to continue your educational journey
              </p>
            </div>

            {/* Success/Error Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-300 hover:text-primary-400 transition-colors"
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
                    className="h-4 w-4 text-primary-400 border-accent-200 rounded focus:ring-primary-200"
                    disabled={isLoading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-primary-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-accent-300 hover:text-accent-400 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-400 hover:bg-primary-600 text-white'
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
              <p className="text-primary-300">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent-300 hover:text-accent-400 font-medium transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Test Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Test Credentials:</h3>
            <div className="space-y-2">
              <div className="text-xs text-blue-700">
                <strong>Student:</strong><br/>
                Email: <code className="bg-blue-100 px-1 rounded">perera@gmail.com</code><br/>
                Password: <code className="bg-blue-100 px-1 rounded">mypassword123</code>
              </div>
              <div className="text-xs text-blue-700">
                <strong>Admin:</strong><br/>
                Email: <code className="bg-blue-100 px-1 rounded">admin@uniroute.com</code><br/>
                Password: <code className="bg-blue-100 px-1 rounded">admin123</code>
              </div>
              <div className="text-xs text-blue-700">
                <strong>University Student:</strong><br/>
                Email: <code className="bg-blue-100 px-1 rounded">sarah.silva@university.lk</code><br/>
                Password: <code className="bg-blue-100 px-1 rounded">sarah123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;