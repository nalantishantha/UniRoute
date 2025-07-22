import React from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Edit,
  GraduationCap,
} from "lucide-react";

const ProfilePage = () => {
  const studentData = {
    name: "Gaja Man",
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
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-primary-400 mb-4">
            My Profile
          </h1>
          <p className="text-xl text-primary-300">
            Manage your personal information and academic details
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={studentData.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                />
                <button className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors shadow-md border border-white/30">
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left text-white">
                <h2 className="font-display font-bold text-3xl mb-2">
                  {studentData.name}
                </h2>
                <p className="text-white/90 text-lg mb-1">
                  {studentData.alStream} Student
                </p>
                <p className="text-white/80 text-sm mb-4">
                  {studentData.school} • A/L {studentData.alYear}
                </p>

                {/* Z-Score Badge */}
                <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30">
                  <Award className="h-5 w-5 mr-2" />
                  <span className="font-semibold">
                    Z-Score: {studentData.zScore}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <div className="lg:self-start">
                <Link
                  to="/student/profile-setup"
                  className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2 font-medium border border-white/30"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8">
            <h3 className="font-semibold text-primary-400 text-lg mb-6">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                <Mail className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-primary-300 text-sm">Email</p>
                  <p className="text-primary-400 font-medium text-sm">
                    {studentData.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                <Phone className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-primary-300 text-sm">Phone</p>
                  <p className="text-primary-400 font-medium text-sm">
                    {studentData.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                <MapPin className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-primary-300 text-sm">District</p>
                  <p className="text-primary-400 font-medium text-sm">
                    {studentData.district}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg border border-accent-100">
                <Calendar className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-primary-300 text-sm">A/L Year</p>
                  <p className="text-primary-400 font-medium text-sm">
                    {studentData.alYear}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-semibold text-primary-400 text-xl mb-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Academic Information</span>
            </h3>

            <div className="space-y-6">
              {/* A/L Subjects */}
              <div>
                <h4 className="text-primary-400 font-medium mb-3">
                  A/L Subjects
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {studentData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-100"
                    >
                      <BookOpen className="h-4 w-4 text-primary-400" />
                      <span className="text-primary-400 font-medium">
                        {subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Info */}
              <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                <h4 className="text-primary-400 font-medium mb-2">School</h4>
                <p className="text-primary-300">{studentData.school}</p>
              </div>
            </div>
          </div>

          {/* Career Interests */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
            <h3 className="font-semibold text-primary-400 text-xl mb-6 flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Career Interests</span>
            </h3>

            <div className="space-y-6">
              {/* Interests */}
              <div>
                <h4 className="text-primary-400 font-medium mb-3">
                  Fields of Interest
                </h4>
                <div className="flex flex-wrap gap-2">
                  {studentData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-accent-200 text-primary-400 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Universities */}
              <div>
                <h4 className="text-primary-400 font-medium mb-3">
                  Preferred Universities
                </h4>
                <div className="space-y-2">
                  {[
                    "University of Moratuwa",
                    "University of Colombo",
                    "University of Peradeniya",
                  ].map((uni, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-accent-50 rounded-lg border border-accent-100"
                    >
                      <GraduationCap className="h-4 w-4 text-primary-400" />
                      <span className="text-primary-400 font-medium">
                        {uni}
                      </span>
                      <span className="text-primary-300 text-sm ml-auto">
                        {index + 1}
                        {index === 0 ? "st" : index === 1 ? "nd" : "rd"} Choice
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-accent-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-400 text-xl">
              Profile Completion
            </h3>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              85% Complete
            </span>
          </div>

          <div className="mb-4">
            <div className="w-full bg-accent-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-400 to-accent-400 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-green-600 font-bold text-lg">✓</div>
              <p className="text-green-700 text-sm font-medium">Basic Info</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-green-600 font-bold text-lg">✓</div>
              <p className="text-green-700 text-sm font-medium">
                Academic Details
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="text-yellow-600 font-bold text-lg">⚠</div>
              <p className="text-yellow-700 text-sm font-medium">
                Career Goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
