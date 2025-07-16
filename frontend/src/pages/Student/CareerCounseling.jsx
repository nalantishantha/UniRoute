import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Video,
  MessageCircle,
  Phone,
  Star,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

const CareerCounseling = () => {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [bookingType, setBookingType] = useState("video");

  const counselors = [
    {
      id: 1,
      name: "Dr. Samanthi Perera",
      title: "Senior Career Counselor",
      specialization: "Engineering & Technology Careers",
      experience: "15 years",
      rating: 4.9,
      reviews: 127,
      education: "PhD in Engineering Education, University of Moratuwa",
      languages: ["English", "Sinhala"],
      availability: "Mon-Fri, 9 AM - 5 PM",
      hourlyRate: "Rs. 2,500",
      about:
        "Specialized in guiding students towards engineering and technology careers. Extensive experience in industry connections and placement guidance.",
      expertise: [
        "Career Path Planning",
        "Industry Trends",
        "Skill Development",
        "Interview Preparation",
      ],
      successStories: 95,
      image: "/api/placeholder/150/150",
    },
    {
      id: 2,
      name: "Prof. Nimal Fernando",
      title: "Medical Career Advisor",
      specialization: "Healthcare & Medical Careers",
      experience: "20 years",
      rating: 4.8,
      reviews: 89,
      education: "MBBS, MD, University of Colombo",
      languages: ["English", "Sinhala", "Tamil"],
      availability: "Tue-Sat, 10 AM - 6 PM",
      hourlyRate: "Rs. 3,000",
      about:
        "Former medical practitioner turned career counselor, helping students navigate medical education and healthcare careers.",
      expertise: [
        "Medical School Guidance",
        "Specialization Selection",
        "Research Opportunities",
        "Medical Ethics",
      ],
      successStories: 78,
      image: "/api/placeholder/150/150",
    },
    {
      id: 3,
      name: "Ms. Kavitha Silva",
      title: "Business & Management Counselor",
      specialization: "Business, Finance & Management",
      experience: "12 years",
      rating: 4.7,
      reviews: 156,
      education: "MBA, CIM (UK), University of Sri Jayewardenepura",
      languages: ["English", "Sinhala"],
      availability: "Mon-Thu, 2 PM - 8 PM",
      hourlyRate: "Rs. 2,000",
      about:
        "Business professional with extensive corporate experience, specializing in business education and management career paths.",
      expertise: [
        "Business Strategy",
        "Entrepreneurship",
        "Financial Planning",
        "Leadership Development",
      ],
      successStories: 112,
      image: "/api/placeholder/150/150",
    },
    {
      id: 4,
      name: "Dr. Ajith Bandara",
      title: "Science & Research Advisor",
      specialization: "Pure Sciences & Research",
      experience: "18 years",
      rating: 4.9,
      reviews: 73,
      education: "PhD in Chemistry, University of Peradeniya",
      languages: ["English", "Sinhala"],
      availability: "Wed-Sun, 9 AM - 4 PM",
      hourlyRate: "Rs. 2,200",
      about:
        "Research scientist and academic with deep knowledge of science education pathways and research opportunities.",
      expertise: [
        "Research Methodology",
        "Academic Writing",
        "Grant Applications",
        "PhD Guidance",
      ],
      successStories: 64,
      image: "/api/placeholder/150/150",
    },
  ];

  const counselingServices = [
    {
      title: "Career Assessment",
      description:
        "Comprehensive evaluation of your interests, skills, and personality to identify suitable career paths.",
      duration: "90 minutes",
      price: "Rs. 3,500",
      features: [
        "Personality Assessment",
        "Skills Analysis",
        "Interest Mapping",
        "Career Report",
      ],
    },
    {
      title: "University Selection Guidance",
      description:
        "Expert advice on choosing the right university and program based on your goals and qualifications.",
      duration: "60 minutes",
      price: "Rs. 2,500",
      features: [
        "Program Comparison",
        "Admission Requirements",
        "Application Strategy",
        "Backup Options",
      ],
    },
    {
      title: "Interview Preparation",
      description:
        "Mock interviews and coaching to help you succeed in university admissions and job interviews.",
      duration: "45 minutes",
      price: "Rs. 2,000",
      features: [
        "Mock Interviews",
        "Communication Skills",
        "Confidence Building",
        "Q&A Practice",
      ],
    },
    {
      title: "Career Path Planning",
      description:
        "Long-term career planning with milestone setting and strategic guidance for your professional journey.",
      duration: "75 minutes",
      price: "Rs. 3,000",
      features: [
        "Goal Setting",
        "Timeline Creation",
        "Skill Development Plan",
        "Progress Tracking",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-accent-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/student/home" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-400" />
              <span className="font-display font-bold text-2xl text-primary-400">
                UniRoute
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/student/mentors"
                className="text-primary-300 hover:text-primary-400 transition-colors duration-200"
              >
                Mentors
              </Link>
              <Link
                to="/student/tutors"
                className="text-primary-300 hover:text-primary-400 transition-colors duration-200"
              >
                Tutors
              </Link>
              <Link
                to="/student/news"
                className="text-primary-300 hover:text-primary-400 transition-colors duration-200"
              >
                News
              </Link>
              <Link
                to="/student/career-counseling"
                className="text-primary-400 font-medium transition-colors duration-200"
              >
                Counseling
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-primary-300 hover:text-primary-400 transition-colors relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link
                to="/student/profile"
                className="text-primary-300 hover:text-primary-400 transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>
              <Link
                to="/student/settings"
                className="text-primary-300 hover:text-primary-400 transition-colors"
              >
                <Settings className="h-6 w-6" />
              </Link>
              <Link
                to="/student/dashboard"
                className="bg-accent-200 text-primary-400 px-6 py-2 rounded-full font-medium hover:bg-accent-300 transition-all duration-200 hover:shadow-lg"
              >
                My Dashboard
              </Link>
              <Link
                to="/"
                className="text-primary-300 hover:text-primary-400 transition-colors"
              >
                <LogOut className="h-6 w-6" />
              </Link>
            </div>

            <div className="md:hidden">
              <Link
                to="/student/dashboard"
                className="bg-accent-200 text-primary-400 px-4 py-2 rounded-full text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-400 to-accent-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-5xl mb-6">
            Career Counseling
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Get personalized guidance from experienced career counselors to make
            informed decisions about your education and future career path.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Services Overview */}
        <div className="mb-12">
          <h2 className="font-display font-semibold text-3xl text-primary-400 mb-8 text-center">
            Our Counseling Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {counselingServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100"
              >
                <h3 className="font-display font-semibold text-xl text-primary-400 mb-3">
                  {service.title}
                </h3>
                <p className="text-primary-300 mb-4">{service.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-accent-400" />
                    <span className="text-sm text-primary-300">
                      {service.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-accent-400" />
                    <span className="text-sm font-semibold text-primary-400">
                      {service.price}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-primary-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counselors Section */}
        <div className="mb-12">
          <h2 className="font-display font-semibold text-3xl text-primary-400 mb-8 text-center">
            Meet Our Expert Counselors
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-xl text-primary-400 mb-1">
                        {counselor.name}
                      </h3>
                      <p className="text-primary-300 mb-2">{counselor.title}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">
                            {counselor.rating}
                          </span>
                          <span className="text-primary-300">
                            ({counselor.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-accent-400" />
                          <span className="text-primary-300">
                            {counselor.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-primary-400 mb-2">
                      Specialization
                    </h4>
                    <p className="text-primary-300 text-sm">
                      {counselor.specialization}
                    </p>
                  </div>

                  <p className="text-primary-300 mb-4">{counselor.about}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-primary-300 mb-1">
                        Success Stories
                      </div>
                      <div className="font-semibold text-primary-400">
                        {counselor.successStories}+ students
                      </div>
                    </div>
                    <div>
                      <div className="text-primary-300 mb-1">Hourly Rate</div>
                      <div className="font-semibold text-primary-400">
                        {counselor.hourlyRate}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-primary-400 mb-2">
                      Expertise Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {counselor.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-accent-100 text-primary-400 px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedCounselor(counselor)}
                      className="flex-1 bg-primary-400 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Book Session
                    </button>
                    <button className="bg-accent-100 text-primary-400 py-2 px-4 rounded-lg hover:bg-accent-200 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {selectedCounselor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-2xl text-primary-400">
                    Book Session with {selectedCounselor.name}
                  </h3>
                  <button
                    onClick={() => setSelectedCounselor(null)}
                    className="text-primary-300 hover:text-primary-400"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Session Type */}
                  <div>
                    <label className="block text-primary-400 font-medium mb-3">
                      Session Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "video", label: "Video Call", icon: Video },
                        { id: "phone", label: "Phone Call", icon: Phone },
                        { id: "chat", label: "Text Chat", icon: MessageCircle },
                      ].map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setBookingType(type.id)}
                            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                              bookingType === type.id
                                ? "border-primary-400 bg-primary-50"
                                : "border-accent-100 hover:border-accent-200"
                            }`}
                          >
                            <IconComponent className="h-6 w-6 text-primary-400 mb-2" />
                            <span className="text-sm text-primary-400">
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-primary-400 font-medium mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-primary-400 font-medium mb-2">
                        Preferred Time
                      </label>
                      <select className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Session Duration */}
                  <div>
                    <label className="block text-primary-400 font-medium mb-2">
                      Session Duration
                    </label>
                    <select className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400">
                      <option>30 minutes - Rs. 1,500</option>
                      <option>60 minutes - Rs. 2,500</option>
                      <option>90 minutes - Rs. 3,500</option>
                    </select>
                  </div>

                  {/* Topics of Discussion */}
                  <div>
                    <label className="block text-primary-400 font-medium mb-2">
                      What would you like to discuss?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief description of topics you'd like to cover in the session..."
                      className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedCounselor(null)}
                      className="flex-1 border border-accent-100 text-primary-400 py-3 rounded-lg hover:bg-accent-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 bg-primary-400 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors">
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Why Choose Our Counseling */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
          <h2 className="font-display font-semibold text-3xl text-primary-400 mb-8 text-center">
            Why Choose Our Career Counseling?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-primary-400 mb-3">
                Expert Counselors
              </h3>
              <p className="text-primary-300">
                Experienced professionals with deep industry knowledge and
                proven track records.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-primary-400 mb-3">
                Personalized Guidance
              </h3>
              <p className="text-primary-300">
                Tailored advice based on your unique interests, skills, and
                career aspirations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-primary-400 mb-3">
                Proven Success
              </h3>
              <p className="text-primary-300">
                High success rates with students achieving their educational and
                career goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCounseling;
