import React from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  Search,
  Users,
  Star,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

const FindMentors = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-primary-400 mb-4">
            Find Mentors
          </h1>
          <p className="text-xl text-primary-300 max-w-2xl mx-auto">
            Connect with experienced professionals and university graduates who
            can guide your career path
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-accent-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
            <input
              type="text"
              placeholder="Search for mentors by name, field, or university..."
              className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
            />
          </div>
        </div>

        {/* Featured Mentors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div
              key={id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={`https://images.pexels.com/photos/${
                    5212345 + id
                  }/pexels-photo-${
                    5212345 + id
                  }.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop`}
                  alt="Mentor"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-display font-semibold text-lg text-primary-400">
                    Dr. Sample Mentor {id}
                  </h3>
                  <p className="text-primary-300 text-sm">
                    University of Colombo
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-accent-300 fill-current" />
                    <span className="text-sm">4.{8 + (id % 2)}</span>
                    <span className="text-primary-300 text-sm">
                      (15{id} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-primary-300 text-sm mb-4">
                Experienced professional in engineering field, passionate about
                helping students achieve their career goals.
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary-300" />
                  <span className="text-sm text-primary-300">
                    {8 + id} students
                  </span>
                </div>
                <button className="bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-accent-200 text-primary-400 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
            Load More Mentors
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMentors;
