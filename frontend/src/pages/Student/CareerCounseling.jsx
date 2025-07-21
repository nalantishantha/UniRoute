import React, { useState } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
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
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-primary-100">
      {/* Navigation */}
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Description */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-primary-400 mb-6">
            Career Counseling
          </h1>
          <p className="text-xl text-primary-300 max-w-3xl mx-auto">
            Get personalized guidance from experienced career counselors to make
            informed decisions about your education and future career path.
          </p>
        </div>

        {/* Services Overview */}
        <div className="mb-12">
          <h2 className="font-display font-semibold text-3xl text-primary-400 mb-8 text-center">
            Our Counseling Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {counselingServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Service Header */}
                <div className="relative h-20 bg-gradient-to-r from-blue-500 to-primary-500">
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Service Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
                      {index === 0 && <User className="h-6 w-6 text-white" />}
                      {index === 1 && <GraduationCap className="h-6 w-6 text-white" />}
                      {index === 2 && <MessageCircle className="h-6 w-6 text-white" />}
                      {index === 3 && <Target className="h-6 w-6 text-white" />}
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/25 text-white border border-white/40 px-2 py-1 rounded-full text-xs font-semibold drop-shadow-sm">
                      {service.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Service Title */}
                  <div className="mb-4">
                    <h3 className="font-display font-semibold text-xl text-primary-400 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-primary-300 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Duration Info */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-primary-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Duration: {service.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-medium text-primary-400 mb-3 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>What's Included</span>
                    </h4>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-primary-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="border-t border-accent-100 pt-4">
                    <button className="w-full bg-primary-400 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium text-sm hover:shadow-lg">
                      Book This Service
                    </button>
                  </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Counselor Header */}
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-primary-500">
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/25 backdrop-blur-md rounded-lg px-2 py-1 border border-white/40">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-300 fill-current" />
                        <span className="text-white font-semibold text-xs drop-shadow-sm">
                          {counselor.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-500/25 text-green-100 border border-green-300/40 px-2 py-1 rounded-full text-xs font-semibold drop-shadow-sm">
                      {counselor.experience}
                    </span>
                  </div>

                  {/* Counselor Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-end justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-md">
                            {counselor.name}
                          </h3>
                          <p className="text-white/95 text-sm mb-2 font-semibold drop-shadow-sm">{counselor.title}</p>
                          <div className="flex items-center space-x-2 text-white/90 text-xs drop-shadow-sm">
                            <span>{counselor.reviews} reviews</span>
                            <span>•</span>
                            <span>{counselor.successStories}+ stories</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Specialization */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-3">
                      <h4 className="font-semibold text-primary-400 mb-1 flex items-center space-x-2">
                        <Award className="h-3 w-3" />
                        <span className="text-sm">Specialization</span>
                      </h4>
                      <p className="text-primary-300 text-xs leading-relaxed">
                        {counselor.specialization}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-primary-300 leading-relaxed text-xs">
                      {counselor.about.substring(0, 120)}...
                    </p>
                  </div>

                  {/* Key Statistics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-lg p-2 text-center border border-green-200 shadow-md">
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg mx-auto mb-1 shadow-sm">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-xs text-green-700 mb-1 font-medium">Success</div>
                      <div className="font-bold text-green-700 text-sm">
                        {counselor.successStories}+
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg p-2 text-center border border-blue-200 shadow-md">
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg mx-auto mb-1 shadow-sm">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-xs text-blue-700 mb-1 font-medium">Rate</div>
                      <div className="font-bold text-blue-700 text-xs">
                        {counselor.hourlyRate}
                      </div>
                    </div>
                  </div>

                  {/* Expertise Areas */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-primary-400 mb-2 flex items-center space-x-2">
                      <BookOpen className="h-3 w-3" />
                      <span className="text-sm">Expertise</span>
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {counselor.expertise.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-accent-400 to-accent-400 text-primary-400 px-2 py-1 rounded-full text-xs font-medium border border-accent-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {counselor.expertise.length > 3 && (
                        <span className="text-primary-300 text-xs px-2 py-1">
                          +{counselor.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-accent-100 pt-3">
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-accent-100 text-primary-400 px-3 py-2 rounded-lg hover:bg-accent-200 transition-all duration-200 font-medium text-xs hover:shadow-md">
                        View Profile
                      </button>
                      <button
                        onClick={() => setSelectedCounselor(counselor)}
                        className="flex-1 bg-primary-400 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium text-xs hover:shadow-lg"
                      >
                        Book Session
                      </button>
                    </div>
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
