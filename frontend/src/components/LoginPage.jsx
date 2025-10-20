import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, clearAuth } from "../utils/auth";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import loginImage from "../assets/loginImage.jpeg";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    const currentUser = getCurrentUser();
    const logoutTimestamp = localStorage.getItem('logout_timestamp');

    console.log('LoginPage useEffect - Current user:', currentUser, 'Logout timestamp:', logoutTimestamp);

    // If there's a recent logout timestamp, clear any stale user data
    if (logoutTimestamp) {
      const logoutTime = parseInt(logoutTimestamp);
      const currentTime = Date.now();

      // If logout was recent (within 1 hour), don't auto-redirect
      if (currentTime - logoutTime < 3600000) {
        console.log('Recent logout detected, clearing any stale auth data');
        clearAuth();
        return;
      }
    }

    if (currentUser) {
      const userType = currentUser.user_type;
      console.log("User already logged in, redirecting to:", userType);

      switch (userType) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "student":
          navigate("/student/home", { replace: true });
          break;
        case "uni_student":
          navigate("/university-student/dashboard", { replace: true });
          break;
        case "mentor":
          navigate("/university-student/dashboard", { replace: true });
          break;
        case "pre_mentor":
          navigate("/pre-mentor/dashboard", { replace: true });
          break;
        case "institution":
          navigate("/university/dashboard", { replace: true });
          break;
        case 'company':
          navigate('/company/dashboard-edit', { replace: true });
          break;
        case 'counsellor':
          navigate('/counsellor/dashboard', { replace: true });
          break;
        default:
          // Clear invalid session
          console.log('Invalid user type, clearing auth');
          clearAuth();
          break;
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      console.log("Login attempt:", formData);

      const response = await fetch("/api/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login API Response:", data);

      if (data.success) {
        setMessage({
          type: "success",
          text: "Login successful! Welcome back!",
        });

        console.log('Login successful, clearing old auth data and setting new data...');

        // Clear any previous logout timestamp first - this is critical
        localStorage.removeItem('logout_timestamp');
        console.log('Cleared logout timestamp');

        // Clear any existing auth data first
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.clear();
        console.log('Cleared old auth data');

        // Set new authentication data
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log('Set new user data:', data.user.user_type);

        // Set login timestamp for session management
        localStorage.setItem('login_timestamp', Date.now().toString());
        console.log('Set login timestamp');

        setTimeout(() => {
          // Double-check that logout timestamp is cleared and user data is set
          localStorage.removeItem('logout_timestamp');
          if (!localStorage.getItem('user')) {
            console.log('Re-setting user data after timeout');
            localStorage.setItem("user", JSON.stringify(data.user));
          }

          const userType = data.user.user_type;
          console.log("User type for redirect:", userType);

          switch (userType) {
            case "admin":
              window.location.replace("/admin/dashboard");
              break;
            case "student":
              window.location.replace("/student/home");
              break;
            case "uni_student":
              window.location.replace("/university-student/dashboard");
              break;
            case "mentor":
              window.location.replace("/university-student/dashboard");
              break;
            case "pre_mentor":
              window.location.replace("/pre-mentor/dashboard");
              break;
            case "institution":
              window.location.replace("/university/dashboard");
              break;
            case 'company':
              window.location.replace('/company/dashboard-edit');
              break;
            case "company":
              navigate("/company/dashboard-edit");
            case 'counsellor':
              window.location.replace('/counsellor/dashboard');
              break;
            default:
              window.location.replace("/student/home");
              break;
          }
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen backdrop-blur-2xl bg-gradient-to-br from-primary-50 to-primary-200">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#C1DBF4]">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              to="/"
              className="flex items-center space-x-2 text-[#1D5D9B] hover:text-[#174A7C] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>

            <div className="flex items-center ">
              <span>
                <img src={logo} alt="UniRoute Logo" className="w-full h-14" />{" "}
              </span>
              <span className="-ml-3 text-2xl font-bold text-primary-900">
                UniRoute
              </span>
            </div>

            <div className="text-sm text-[#717171]">
              <span>New here? </span>
              <Link
                to="/register"
                className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}

      <div className="flex items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-screen-lg">
          <div className=" w-full mx-auto flex flex-col md:flex-row  bg-white rounded-2xl shadow-xl p-8 border border-[#C1DBF4] overflow-hidden">
            {/* Background Image */}
            <div className="object-center w-full mt-20 border-r md:w-1/2">
              <img
                src={loginImage}
                alt="UniRoute Platform"
                className="object-cover w-full h-auto"
              />
              {/* Overlay for better text readability */}
            </div>
            <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
              {/* Header */}
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="bg-[#E7F3FB] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src={logo} alt="UniRoute Logo" className="h-18 w-18 " />{" "}
                </div>
                <h1 className="mb-2 text-3xl font-bold text-primary-700">
                  Welcome Back!
                </h1>
                <p className="text-neutral-500">
                  Sign in to continue your educational journey
                </p>
              </div>

              {/* Success/Error Message */}
              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${message.type === "success"
                    ? "bg-[#81C784]/10 border border-[#81C784]/20"
                    : "bg-[#E57373]/10 border border-[#E57373]/20"
                    }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-[#81C784]" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-[#E57373]" />
                  )}
                  <span
                    className={`text-sm font-medium ${message.type === "success"
                      ? "text-[#81C784]"
                      : "text-[#E57373]"
                      }`}
                  >
                    {message.text}
                  </span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#263238] mb-2"
                  >
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#263238] mb-2"
                  >
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
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
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
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 text-sm text-[#717171]"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-[#F4D160] hover:text-[#F4D160]/80 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold focus:ring-2 focus:ring-[#1D5D9B] focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${isLoading
                    ? "bg-[#B0B0B0] cursor-not-allowed text-white"
                    : "bg-[#1D5D9B] hover:bg-[#174A7C] text-white"
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-neutral-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium transition-colors"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
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
