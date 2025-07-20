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
          <h1 className="font-display font-bold text-4xl text-primary-400 mb-4">
            My Profile
          </h1>
          <p className="text-xl text-primary-300">
            Manage your personal information and academic details
          </p>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-accent-100">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={studentData.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-accent-100"
              />
              <button className="absolute bottom-2 right-2 bg-primary-400 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display font-bold text-3xl text-primary-400 mb-2">
                {studentData.name}
              </h2>
              <p className="text-primary-300 text-lg mb-4">
                {studentData.alStream} Student
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary-300" />
                  <span className="text-primary-300">{studentData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-primary-300" />
                  <span className="text-primary-300">{studentData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary-300" />
                  <span className="text-primary-300">
                    {studentData.district} District
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary-300" />
                  <span className="text-primary-300">
                    A/L {studentData.alYear}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Link
                to="/student/profile-setup"
                className="bg-primary-400 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/student/settings"
                className="border border-accent-200 text-primary-400 px-6 py-2 rounded-lg hover:bg-accent-50 transition-colors text-center"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Academic Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  School
                </label>
                <p className="text-primary-400 font-medium">
                  {studentData.school}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  A/L Stream
                </label>
                <p className="text-primary-400 font-medium">
                  {studentData.alStream}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  A/L Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {studentData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-accent-100 text-primary-400 px-3 py-1 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  Z-Score
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary-400">
                    {studentData.zScore}
                  </span>
                  <Award className="h-5 w-5 text-accent-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Career Interests */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-6 flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Career Interests</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  Fields of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {studentData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-400 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-300 mb-2">
                  Career Goals
                </label>
                <p className="text-primary-400">
                  Aspiring to become a software engineer specializing in
                  artificial intelligence and machine learning applications.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-300 mb-2">
                  Preferred Universities
                </label>
                <div className="space-y-2">
                  <p className="text-primary-400">1. University of Moratuwa</p>
                  <p className="text-primary-400">2. University of Colombo</p>
                  <p className="text-primary-400">
                    3. University of Peradeniya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-accent-100">
          <h3 className="font-display font-semibold text-xl text-primary-400 mb-4">
            Profile Completion
          </h3>
          <div className="w-full bg-accent-100 rounded-full h-3 mb-2">
            <div
              className="bg-primary-400 h-3 rounded-full"
              style={{ width: "85%" }}
            ></div>
          </div>
          <p className="text-primary-300 text-sm">
            Your profile is 85% complete. Complete your profile to get better
            recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
