import React from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  User,
  BookOpen,
  Users,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Calendar,
  Award,
  Target,
  ChevronRight,
  Plus,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  BookMarked,
  Newspaper,
  Edit,
} from "lucide-react";

const StudentDashboard = () => {
  // Sample data
  const studentProfile = {
    name: "Kasun Perera",
    alStream: "Physical Science",
    subjects: ["Combined Mathematics", "Physics", "Chemistry"],
    zScore: 1.8542,
    district: "Colombo",
    profileComplete: 85,
  };

  const quickStats = [
    {
      label: "Profile Completion",
      value: "85%",
      icon: User,
      color: "bg-blue-500",
    },
    {
      label: "Recommended Degrees",
      value: "12",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      label: "Available Mentors",
      value: "8",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "News Updates",
      value: "5",
      icon: Newspaper,
      color: "bg-orange-500",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "mentor",
      title: "New message from Dr. Samantha Silva",
      description: "Regarding your engineering career path inquiry",
      time: "2 hours ago",
      icon: MessageCircle,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "news",
      title: "University of Colombo announces new programs",
      description: "New Engineering Faculty to open in 2025",
      time: "1 day ago",
      icon: Newspaper,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "recommendation",
      title: "New degree recommendation available",
      description: "Bachelor of Computer Science - University of Moratuwa",
      time: "2 days ago",
      icon: Star,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "tutor",
      title: "Tutor session completed",
      description: "Combined Mathematics with Mr. Kamal Perera",
      time: "3 days ago",
      icon: BookMarked,
      color: "text-orange-500",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Virtual Career Fair 2024",
      date: "Jan 20-22, 2024",
      type: "Career Event",
      participants: "100+ Companies",
    },
    {
      id: 2,
      title: "University Open Day - UoC",
      date: "Feb 5, 2024",
      type: "University Event",
      participants: "All Faculties",
    },
    {
      id: 3,
      title: "STEM Scholarship Applications",
      date: "Feb 15, 2024",
      type: "Scholarship",
      participants: "500 Scholarships",
    },
  ];

  const featuredMentors = [
    {
      id: 1,
      name: "Dr. Samantha Silva",
      university: "University of Colombo",
      field: "Engineering",
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      available: true,
    },
    {
      id: 2,
      name: "Prof. Nimal Fernando",
      university: "University of Peradeniya",
      field: "Medicine",
      rating: 4.8,
      image:
        "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      available: false,
    },
    {
      id: 3,
      name: "Ms. Priya Jayawardena",
      university: "University of Moratuwa",
      field: "Computer Science",
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display font-bold text-3xl mb-2">
                Welcome back, {studentProfile.name}!
              </h1>
              <p className="text-primary-100 mb-4">
                Ready to explore your university options?
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-lg font-bold">
                    {studentProfile.zScore}
                  </div>
                  <div className="text-primary-100 text-sm">Your Z-Score</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-lg font-bold">
                    {studentProfile.profileComplete}%
                  </div>
                  <div className="text-primary-100 text-sm">
                    Profile Complete
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                to="/student/profile-setup"
                className="bg-accent-200 text-primary-400 px-6 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-all inline-flex items-center space-x-2"
              >
                <Edit className="h-5 w-5" />
                <span>Complete Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-300 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary-400">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/student/profile-setup"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              Setup Profile
            </h3>
            <p className="text-primary-300 text-sm">
              Add your A/L results and career interests
            </p>
          </Link>

          <Link
            to="/student/mentors"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              Find Mentors
            </h3>
            <p className="text-primary-300 text-sm">
              Connect with university graduates and professionals
            </p>
          </Link>

          <Link
            to="/student/tutors"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <BookMarked className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              Find Tutors
            </h3>
            <p className="text-primary-300 text-sm">
              Get help with your studies from qualified tutors
            </p>
          </Link>

          <Link
            to="/student/news"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <Newspaper className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              News Feed
            </h3>
            <p className="text-primary-300 text-sm">
              Stay updated with university news and announcements
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-2xl text-primary-400">
                  Recent Activity
                </h2>
                <button className="text-accent-300 hover:text-accent-400 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-accent-50 rounded-xl hover:bg-accent-100 transition-colors cursor-pointer"
                    >
                      <div
                        className={`p-2 rounded-full bg-white ${activity.color}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-400">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-primary-300 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-primary-300">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Mentors */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-primary-400">
                  Featured Mentors
                </h3>
                <Link
                  to="/student/mentors"
                  className="text-accent-300 hover:text-accent-400 transition-colors text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {featuredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-accent-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary-400 text-sm">
                        {mentor.name}
                      </h4>
                      <p className="text-xs text-primary-300">{mentor.field}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-accent-300 fill-current" />
                        <span className="text-xs">{mentor.rating}</span>
                      </div>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        mentor.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-primary-400">
                  Upcoming Events
                </h3>
                <Link
                  to="/student/news"
                  className="text-accent-300 hover:text-accent-400 transition-colors text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border border-accent-100 rounded-xl hover:bg-accent-50 transition-colors cursor-pointer"
                  >
                    <h4 className="font-medium text-primary-400 text-sm mb-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-primary-300 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent-300">
                        {event.type}
                      </span>
                      <span className="text-xs text-primary-300">
                        {event.participants}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
