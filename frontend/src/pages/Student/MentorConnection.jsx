import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  User,
  MessageCircle,
  Calendar,
  Star,
  Award,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  MapPin,
} from "lucide-react";

const MentorConnection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mentor = location.state?.mentor;

  const [formData, setFormData] = useState({
    topic: "",
    date: "",
    startTime: "",
    duration: "60",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Combine date and time for scheduled_at
      const scheduledAt = `${formData.date}T${formData.startTime}:00`;

      const sessionData = {
        mentor_id: mentor.id,
        topic: formData.topic,
        scheduled_at: scheduledAt,
        duration_minutes: parseInt(formData.duration),
        status: "scheduled",
      };

      const response = await fetch("/api/mentoring/sessions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Mentoring session created:", result);
        setIsSubmitted(true);
      } else {
        console.error("Error creating session:", result.message);
        alert("Error creating session: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  const meetingDurations = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-primary-100">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary-400 mb-4">
              Mentor Not Found
            </h2>
            <p className="text-primary-300 mb-6">
              Please go back and select a mentor to connect with.
            </p>
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
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl text-blue-900 mb-4">
              Session Request Sent!
            </h2>
            <p className="text-primary-300 text-lg mb-6">
              Your mentoring session request has been successfully sent to{" "}
              {mentor.name}.
            </p>
            <p className="text-primary-300 mb-8">
              They will review your request and get back to you soon with
              confirmation details.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/student/mentors")}
                className="bg-primary-400 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Find More Mentors
              </button>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="bg-accent-200 text-primary-400 px-6 py-3 rounded-lg hover:bg-accent-300 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-primary-100">
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

                {/* Duration Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-green-500/25 text-green-100 border border-green-300/40 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm drop-shadow-sm">
                    {mentor.duration}
                  </span>
                </div>

                {/* Mentor Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                    />
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
                {/* Expertise */}
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

                {/* University */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-primary-300 mb-1">
                    <GraduationCap className="h-3 w-3" />
                    <span className="text-xs font-medium">University</span>
                  </div>
                  <p className="text-primary-400 font-semibold text-sm pl-5">
                    {mentor.university}
                  </p>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-primary-300 mb-1">
                    <MapPin className="h-3 w-3" />
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
                    Schedule Session with {mentor.name}
                  </h1>
                  <p className="text-blue-800">
                    Schedule a mentoring session with {mentor.name}. Choose your
                    preferred date, time, and meeting duration.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Meeting Details */}
                  <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-400 mb-4 flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Meeting Details</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Meeting Topic/Description *
                        </label>
                        <textarea
                          name="topic"
                          value={formData.topic}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          placeholder="Brief description of what you'd like to discuss in this mentoring session..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-primary-400 font-medium mb-2">
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          />
                        </div>
                        <div>
                          <label className="block text-primary-400 font-medium mb-2">
                            Start Time *
                          </label>
                          <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-primary-400 font-medium mb-2">
                          Duration *
                        </label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                        >
                          {meetingDurations.map((duration) => (
                            <option key={duration.value} value={duration.value}>
                              {duration.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-accent-100 pt-6">
                    <button
                      type="submit"
                      className="w-full bg-primary-400 text-white px-6 py-4 rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:shadow-lg"
                    >
                      <Send className="h-5 w-5" />
                      <span>Schedule Mentoring Session</span>
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
