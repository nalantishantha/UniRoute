import React from "react";
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
  Award,
  Edit,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

const ProfilePage = () => {
  const studentData = {
    name: "Kasun Perera",
    email: "kasun.perera@example.com",
    phone: "+94 77 123 4567",
    district: "Colombo",
    school: "Royal College",
    alStream: "Physical Science",
    alYear: "2023",
    subjects: ["Combined Mathematics", "Physics", "Chemistry"],
    zScore: 1.8542,
    interests: ["Engineering", "Technology", "Research"],
    profileImage:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-blue-900 mb-4">
            My Profile
          </h1>
          <p className="text-xl text-blue-800">
            Manage your personal information and academic details
          </p>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-accent-100">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={studentData.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                />
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg px-4 py-2 border border-blue-200/50">
                  <div className="text-2xl font-bold text-blue-900">{studentData.zScore}</div>
                  <div className="text-blue-700 text-sm font-medium">Z-Score</div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6">
                <h2 className="font-display font-bold text-3xl text-blue-900 mb-2">
                  {studentData.name}
                </h2>
                <p className="text-blue-800 text-lg font-medium mb-1">
                  {studentData.alStream} Student
                </p>
                <p className="text-blue-700 text-sm">
                  {studentData.school} • A/L {studentData.alYear}
                </p>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-center lg:justify-start space-x-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">{studentData.email}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">{studentData.phone}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">{studentData.district} District</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">A/L {studentData.alYear}</span>
                </div>
              </div>

              {/* A/L Subjects */}
              <div className="mb-6">
                <h4 className="text-blue-900 font-semibold mb-3">A/L Subjects</h4>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {studentData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Link
                to="/student/profile-setup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium shadow-md"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/student/settings"
                className="border border-blue-200 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Academic Information</span>
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg p-4 border border-blue-100">
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    School
                  </label>
                  <p className="text-blue-900 font-medium text-lg">
                    {studentData.school}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg p-4 border border-blue-100">
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    A/L Stream
                  </label>
                  <p className="text-blue-900 font-medium text-lg">
                    {studentData.alStream}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-25 rounded-lg p-4 border border-green-100">
                <label className="block text-sm font-semibold text-green-700 mb-3">
                  Z-Score Achievement
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{studentData.zScore}</span>
                    </div>
                    <div>
                      <p className="text-green-900 font-semibold">Excellent Performance</p>
                      <p className="text-green-700 text-sm">Above average achievement</p>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-3">
                  A/L Subjects
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {studentData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow"
                    >
                      <BookOpen className="h-5 w-5 mx-auto mb-2" />
                      <span className="font-medium text-sm">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Career Interests */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-6 flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Career Interests & Goals</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-3">
                  Fields of Interest
                </label>
                <div className="flex flex-wrap gap-3">
                  {studentData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-500 to-purple-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-25 rounded-lg p-4 border border-purple-100">
                <label className="block text-sm font-semibold text-purple-700 mb-3">
                  Career Goals
                </label>
                <p className="text-purple-900 leading-relaxed">
                  Aspiring to become a software engineer specializing in
                  artificial intelligence and machine learning applications.
                  Passionate about developing innovative solutions that can
                  make a positive impact on society.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-3">
                  Preferred Universities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: "University of Moratuwa", rank: "1st Choice", color: "from-green-500 to-green-400" },
                    { name: "University of Colombo", rank: "2nd Choice", color: "from-blue-500 to-blue-400" },
                    { name: "University of Peradeniya", rank: "3rd Choice", color: "from-indigo-500 to-indigo-400" }
                  ].map((uni, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-r ${uni.color} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <div className="text-center">
                        <GraduationCap className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-medium text-sm mb-1">{uni.name}</p>
                        <span className="text-xs opacity-90">{uni.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-accent-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-xl text-blue-900">
              Profile Completion
            </h3>
            <span className="bg-gradient-to-r from-green-500 to-green-400 text-white px-3 py-1 rounded-full text-sm font-medium">
              85% Complete
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-800 font-medium">Overall Progress</span>
              <span className="text-blue-900 font-bold">85%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full shadow-sm"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-green-600 font-bold text-lg">✓</div>
              <p className="text-green-800 text-sm font-medium">Basic Info</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-green-600 font-bold text-lg">✓</div>
              <p className="text-green-800 text-sm font-medium">Academic Details</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="text-yellow-600 font-bold text-lg">⚠</div>
              <p className="text-yellow-800 text-sm font-medium">Career Goals</p>
            </div>
          </div>
          
          <p className="text-blue-800 text-sm mt-4 text-center">
            Complete your career goals section to get better university recommendations and mentorship matches.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
