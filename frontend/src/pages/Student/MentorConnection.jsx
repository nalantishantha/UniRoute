import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  User,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Target,
  BookOpen,
  Star,
  Award,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const MentorConnection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mentor = location.state?.mentor;

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    alResults: "",
    stream: "",
    zScore: "",
    interestedFields: [],
    preferredUniversities: [],
    careerGoals: "",
    specificQuestions: "",
    preferredMeetingType: "video",
    availability: "",
    additionalMessage: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Connection request submitted:", formData);
    setIsSubmitted(true);
  };

  const meetingTypes = [
    { id: "video", label: "Video Call", icon: MessageCircle },
    { id: "phone", label: "Phone Call", icon: Phone },
    { id: "email", label: "Email Exchange", icon: Mail },
    { id: "in-person", label: "In-Person Meeting", icon: User },
  ];

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-primary-100">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary-400 mb-4">Mentor Not Found</h2>
            <p className="text-primary-300 mb-6">Please go back and select a mentor to connect with.</p>
            <button
              onClick={() => navigate("/student/mentors")}
              className="bg-primary-400 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Back to Mentors
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-primary-100">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="font-display font-bold text-3xl text-blue-900 mb-4">
                Connection Request Sent!
              </h2>
              <p className="text-blue-800 mb-6">
                Your university program guidance request has been sent to {mentor.name}. They will review your A/L background and career interests, then get back to you within 24-48 hours with personalized advice.
              </p>
              <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-primary-400 mb-2">What happens next?</h3>
                <ul className="text-sm text-primary-300 space-y-1">
                  <li>• {mentor.name} will review your A/L results and career goals</li>
                  <li>• They'll analyze suitable university programs for your profile</li>
                  <li>• You'll receive personalized program recommendations via email</li>
                  <li>• Schedule a detailed consultation to discuss your options</li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate("/student/mentors")}
                  className="flex-1 bg-accent-100 text-primary-400 px-4 py-3 rounded-lg hover:bg-accent-200 transition-colors"
                >
                  Browse More Mentors
                </button>
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="flex-1 bg-primary-400 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-primary-100">
      {/* Navigation */}
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-primary-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Mentors</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden sticky top-8">
              {/* Mentor Header */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-primary-500">
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/25 backdrop-blur-md rounded-lg px-2 py-1 border border-white/40">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current drop-shadow-sm" />
                      <span className="text-white font-semibold text-xs drop-shadow-sm">
                        {mentor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-green-500/25 text-green-100 border border-green-300/40 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm drop-shadow-sm">
                    {mentor.experience}
                  </span>
                </div>

                {/* Mentor Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-lg">
                      <User className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-md">
                        {mentor.name}
                      </h3>
                      <p className="text-white/95 text-xs drop-shadow-sm">{mentor.title}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Specialization */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-3 border border-blue-200/50">
                    <h4 className="font-semibold text-blue-900 mb-1 flex items-center space-x-2">
                      <Award className="h-3 w-3" />
                      <span className="text-sm">Expertise</span>
                    </h4>
                    <p className="text-blue-800 text-xs leading-relaxed font-medium">
                      {mentor.expertise}
                    </p>
                  </div>
                </div>

                {/* Company */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-primary-300 mb-1">
                    <BookOpen className="h-3 w-3" />
                    <span className="text-xs font-medium">Company</span>
                  </div>
                  <p className="text-primary-400 font-semibold text-sm pl-5">
                    {mentor.company}
                  </p>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-primary-300 mb-1">
                    <Target className="h-3 w-3" />
                    <span className="text-xs font-medium">Location</span>
                  </div>
                  <p className="text-primary-400 font-semibold text-sm pl-5">
                    {mentor.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="font-display font-bold text-3xl text-blue-900 mb-2">
                    Connect with {mentor.name}
                  </h1>
                  <p className="text-blue-800">
                    Get personalized guidance for your university program selection after A/L results. 
                    Share your academic background and career interests to receive tailored advice.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-4 border border-blue-200/50">
                    <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Personal Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-blue-900 font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-900 font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="+94 XX XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* A/L Academic Information */}
                  <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-400 mb-4 flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>A/L Academic Background</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          A/L Stream *
                        </label>
                        <select
                          name="stream"
                          value={formData.stream}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                        >
                          <option value="">Select your A/L stream</option>
                          <option value="Physical Science">Physical Science</option>
                          <option value="Biological Science">Biological Science</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Arts">Arts</option>
                          <option value="Technology">Technology</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          A/L Results *
                        </label>
                        <input
                          type="text"
                          name="alResults"
                          value={formData.alResults}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="e.g., A A B or Expected results"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-primary-400 font-medium mb-2">
                          Z-Score (if available)
                        </label>
                        <input
                          type="text"
                          name="zScore"
                          value={formData.zScore}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="e.g., 1.8567 or Expected Z-Score range"
                        />
                      </div>
                    </div>
                  </div>

                  {/* University Program Interests */}
                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-400 mb-4 flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>University Program Selection</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Fields of Interest *
                        </label>
                        <textarea
                          name="interestedFields"
                          value={formData.interestedFields}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="e.g., Engineering, Medicine, Computer Science, Business, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Preferred Universities *
                        </label>
                        <textarea
                          name="preferredUniversities"
                          value={formData.preferredUniversities}
                          onChange={handleInputChange}
                          required
                          rows={2}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="e.g., University of Colombo, University of Moratuwa, University of Peradeniya"
                        />
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Career Goals *
                        </label>
                        <textarea
                          name="careerGoals"
                          value={formData.careerGoals}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="What career path are you aiming for after university?"
                        />
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Specific Questions for Mentor *
                        </label>
                        <textarea
                          name="specificQuestions"
                          value={formData.specificQuestions}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="What specific questions do you have about university program selection, career paths, or industry insights?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Meeting Preferences */}
                  <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-400 mb-4 flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Meeting Preferences</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-primary-400 font-medium mb-3">
                          Preferred Meeting Type *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {meetingTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, preferredMeetingType: type.id }))}
                                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                                  formData.preferredMeetingType === type.id
                                    ? "border-primary-400 bg-primary-50"
                                    : "border-accent-100 hover:border-accent-200"
                                }`}
                              >
                                <IconComponent className="h-5 w-5 text-primary-400 mb-1" />
                                <span className="text-xs text-primary-400 text-center">
                                  {type.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Your Availability
                        </label>
                        <input
                          type="text"
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="e.g., Weekdays 6-8 PM, Weekends flexible"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="block text-primary-400 font-medium mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      name="additionalMessage"
                      value={formData.additionalMessage}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                      placeholder="Any additional information you'd like to share with your mentor..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-accent-100 pt-6">
                    <button
                      type="submit"
                      className="w-full bg-primary-400 text-white px-6 py-4 rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:shadow-lg"
                    >
                      <Send className="h-5 w-5" />
                      <span>Send Connection Request</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorConnection;
