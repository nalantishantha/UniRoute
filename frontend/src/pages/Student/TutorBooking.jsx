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
  Video,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";

const TutorBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tutor = location.state?.tutor;

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    alSubjects: [],
    currentGrade: "",
    weakAreas: "",
    learningGoals: "",
    sessionType: "video",
    sessionDuration: "60",
    preferredDates: "",
    preferredTimes: "",
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
    console.log("Booking data:", formData);
    setIsSubmitted(true);
  };

  const meetingTypes = [
    { id: "video", label: "Video Call", icon: Video },
    { id: "phone", label: "Phone Call", icon: Phone },
    { id: "in-person", label: "In Person", icon: User },
    { id: "online", label: "Online Platform", icon: MessageCircle },
  ];

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-primary-100">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl text-primary-400 mb-4">
              Tutor Information Missing
            </h2>
            <p className="text-primary-300 mb-6">
              No tutor information was found. Please go back and select a tutor.
            </p>
            <button
              onClick={() => navigate("/student/tutors")}
              className="bg-primary-400 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Back to Tutors
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
              <h2 className="font-display font-bold text-3xl text-primary-400 mb-4">
                Session Booking Sent!
              </h2>
              <p className="text-primary-300 mb-6">
                Your tutoring session request has been sent to {tutor.name}. They will review your request and confirm the session details within 24 hours.
              </p>
              <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-primary-400 mb-2">What happens next?</h3>
                <ul className="text-sm text-primary-300 space-y-1">
                  <li>• {tutor.name} will receive your session booking request</li>
                  <li>• They'll review your learning goals and subject needs</li>
                  <li>• You'll receive a confirmation email with session details</li>
                  <li>• Payment instructions will be provided upon confirmation</li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate("/student/tutors")}
                  className="flex-1 bg-accent-100 text-primary-400 px-4 py-3 rounded-lg hover:bg-accent-200 transition-colors"
                >
                  Browse More Tutors
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
            <span>Back to Tutors</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tutor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden sticky top-8">
              {/* Tutor Header with Gradient */}
              <div className="relative h-32 bg-gradient-to-r from-primary-400 to-accent-400">
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current" />
                      <span className="text-white font-semibold text-xs">
                        {tutor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500/20 text-green-100 border border-green-300/30 px-2 py-1 rounded-full text-xs font-semibold">
                    {tutor.experience}
                  </span>
                </div>

                {/* Tutor Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={tutor.image}
                        alt={tutor.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-2lg text-white leading-tight">
                          {tutor.name}
                        </h3>
                        <p className="text-white/90 text-sm mb-1">{tutor.title}</p>
                        <div className="flex items-center space-x-1 mb-1">
                          <Award className="h-3 w-3 text-white/80" />
                          <span className="text-xs text-white/80">{tutor.university}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-white/80" />
                          <span className="text-xs text-white/80">{tutor.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{tutor.hourlyRate}</p>
                      <p className="text-white/80 text-xs">per hour</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Expertise */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-3">
                    <h4 className="font-semibold text-primary-400 text-sm mb-1">Expertise</h4>
                    <p className="text-primary-300 text-8xs font-bold">{tutor.expertise}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-primary-300 text-5xs mb-4 leading-relaxed">
                  {tutor.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-primary-300" />
                      <span className="text-primary-300">{tutor.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-accent-400" />
                      <span className="text-primary-300">({tutor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="font-display font-bold text-3xl text-primary-400 mb-2">
                    Book Session with {tutor.name}
                  </h1>
                  <p className="text-primary-300">
                    Fill out this form to book a tutoring session. Provide details about your learning needs 
                    and goals to help your tutor prepare the best session for you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Academic Information */}
                  <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-400 mb-4 flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Academic Information</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          A/L Subjects *
                        </label>
                        <textarea
                          name="alSubjects"
                          value={formData.alSubjects}
                          onChange={handleInputChange}
                          required
                          rows={2}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="e.g., Combined Mathematics, Physics, Chemistry"
                        />
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Areas You Need Help With *
                        </label>
                        <textarea
                          name="weakAreas"
                          value={formData.weakAreas}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="Describe specific topics or areas where you need assistance..."
                        />
                      </div>
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Learning Goals *
                        </label>
                        <textarea
                          name="learningGoals"
                          value={formData.learningGoals}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="What do you hope to achieve from these tutoring sessions?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Session Preferences */}
                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-400 mb-4 flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Session Preferences</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-primary-400 font-medium mb-3">
                          Session Type *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {meetingTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, sessionType: type.id }))}
                                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                                  formData.sessionType === type.id
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-primary-400 font-medium mb-2">
                            Session Duration *
                          </label>
                          <select
                            name="sessionDuration"
                            value={formData.sessionDuration}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          >
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-primary-400 font-medium mb-2">
                            Estimated Cost
                          </label>
                          <div className="w-full px-4 py-3 border border-accent-100 rounded-lg bg-gray-50 text-primary-400 font-semibold">
                            {tutor.hourlyRate ? 
                              `Rs. ${parseInt(tutor.hourlyRate.replace(/[^\d]/g, '')) * (parseInt(formData.sessionDuration) / 60)}` : 
                              'Calculate based on duration'
                            }
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-primary-400 font-medium mb-2">
                            Preferred Dates
                          </label>
                          <input
                            type="text"
                            name="preferredDates"
                            value={formData.preferredDates}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            placeholder="e.g., Weekdays, Weekends, Specific dates"
                          />
                        </div>
                        <div>
                          <label className="block text-primary-400 font-medium mb-2">
                            Preferred Times
                          </label>
                          <input
                            type="text"
                            name="preferredTimes"
                            value={formData.preferredTimes}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            placeholder="e.g., Morning, Afternoon, Evening"
                          />
                        </div>
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
                      placeholder="Any additional information or special requests for your tutor..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-accent-100 pt-6">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 border border-accent-100 text-primary-400 py-3 rounded-lg hover:bg-accent-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-primary-400 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Book Session</span>
                      </button>
                    </div>
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

export default TutorBooking;
