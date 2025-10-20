import React, { useState } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Target,
  Award,
  Camera,
  Settings,
  LogOut,
  Bell,
  Heart,
  CheckCircle,
} from "lucide-react";

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    currentEducation: "",
    institution: "",
    fieldOfStudy: "",
    careerGoals: "",
    interests: [],
    skills: [],
    achievements: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const availableInterests = [
    "Engineering",
    "Medicine",
    "Law",
    "Business",
    "Arts",
    "Science",
    "Technology",
    "Education",
    "Research",
    "Design",
    "Agriculture",
    "Tourism",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-blue-900 mb-4">
            Complete Your Profile
          </h1>
          <p className="text-xl text-blue-800">
            Help us personalize your UniRoute experience
          </p>
        </div>

        <form className="space-y-8">
          {/* Profile Photo */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <span>Profile Photo</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center shadow-lg border-4 border-blue-100">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <button
                  type="button"
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-semibold shadow-md"
                >
                  Upload Photo
                </button>
                <p className="text-blue-700 text-sm mt-2">
                  JPG, PNG or GIF (max 5MB)
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Recommended: 200x200 pixels
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="City, Province"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Educational Background */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Educational Background</span>
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Current Education Level *
                  </label>
                  <select
                    name="currentEducation"
                    value={formData.currentEducation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select education level</option>
                    <option value="high-school">High School</option>
                    <option value="al-completed">A/L Completed</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="School/College/University name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Physical Science, Commerce, Technology"
                />
              </div>
            </div>
          </div>

          {/* Career Goals */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <Target className="h-6 w-6" />
              <span>Career Goals & Aspirations</span>
            </h3>

            <div>
              <label className="block text-blue-900 font-medium mb-3">
                What are your career aspirations? *
              </label>
              <textarea
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe your career goals, what you hope to achieve, and the impact you want to make in your chosen field..."
              />
              <p className="text-blue-600 text-sm mt-2">
                💡 Tip: Be specific about your interests, preferred work environment, and long-term objectives.
              </p>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <Heart className="h-6 w-6" />
              <span>Areas of Interest</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.interests.includes(interest)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-blue-600 text-sm mt-3">
              💡 Tip: Select subjects and areas that genuinely interest you - this helps with better recommendations.
            </p>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Achievements & Skills</span>
            </h3>

            <div>
              <label className="block text-blue-900 font-medium mb-3">
                Notable achievements, certifications, or skills
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="List your achievements, certifications, skills, or any other relevant information..."
              />
              <p className="text-blue-600 text-sm mt-2">
                💡 Tip: Include academic awards, competitions, leadership roles, volunteer work, or technical skills.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-8 py-3 border border-accent-200 text-primary-600 rounded-xl font-semibold hover:bg-accent-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
            >
              <span>Complete Profile</span>
              <CheckCircle className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
