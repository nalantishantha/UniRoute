import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowLeft,
  Calendar,
  Users,
  BookOpen,
  Bell,
  Heart,
  Share2,
  MessageCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const NewsFeed = () => {
  const newsItems = [
    {
      id: 1,
      title: "University of Colombo Opens New Engineering Faculty",
      summary:
        "The university announces a new state-of-the-art engineering faculty with cutting-edge laboratories and research facilities.",
      date: "December 15, 2024",
      category: "University News",
      readTime: "3 min read",
      likes: 156,
      comments: 23,
    },
    {
      id: 2,
      title: "2025 A/L Results Expected in March",
      summary:
        "Department of Examinations announces the tentative date for A/L results release with new grading system updates.",
      date: "December 12, 2024",
      category: "Exam News",
      readTime: "2 min read",
      likes: 234,
      comments: 45,
    },
    {
      id: 3,
      title: "New Scholarship Program for STEM Students",
      summary:
        "Government introduces comprehensive scholarship program covering tuition and living expenses for outstanding STEM students.",
      date: "December 10, 2024",
      category: "Scholarships",
      readTime: "4 min read",
      likes: 189,
      comments: 67,
    },
    {
      id: 4,
      title: "Career Fair 2025: 100+ Companies Participating",
      summary:
        "Annual career fair scheduled for February with participation from leading local and international companies.",
      date: "December 8, 2024",
      category: "Career Events",
      readTime: "3 min read",
      likes: 298,
      comments: 34,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-accent-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/student/home" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-400" />
              <span className="font-display font-bold text-2xl text-primary-400">
                UniRoute
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/student/mentors"
                className="text-primary-300 hover:text-primary-400 transition-colors duration-200"
              >
                Mentors
              </Link>
              <Link
                to="/student/tutors"
                className="text-primary-300 hover:text-primary-400 transition-colors duration-200"
              >
                Tutors
              </Link>
              <Link
                to="/student/news"
                className="text-primary-400 font-medium transition-colors duration-200"
              >
                News
              </Link>
              <Link
                to="/student/career-counseling"
                className="text-primary-300 hover:text-primary-400 transition-colors duration-200"
              >
                Counseling
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-primary-300 hover:text-primary-400 transition-colors relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link
                to="/student/profile"
                className="text-primary-300 hover:text-primary-400 transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>
              <Link
                to="/student/settings"
                className="text-primary-300 hover:text-primary-400 transition-colors"
              >
                <Settings className="h-6 w-6" />
              </Link>
              <Link
                to="/student/dashboard"
                className="bg-accent-200 text-primary-400 px-6 py-2 rounded-full font-medium hover:bg-accent-300 transition-all duration-200 hover:shadow-lg"
              >
                My Dashboard
              </Link>
              <Link
                to="/"
                className="text-primary-300 hover:text-primary-400 transition-colors"
              >
                <LogOut className="h-6 w-6" />
              </Link>
            </div>

            <div className="md:hidden">
              <Link
                to="/student/dashboard"
                className="bg-accent-200 text-primary-400 px-4 py-2 rounded-full text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-primary-400 mb-4">
            News & Updates
          </h1>
          <p className="text-xl text-primary-300">
            Stay updated with the latest university news, announcements, and
            opportunities
          </p>
        </div>

        {/* News Items */}
        <div className="space-y-6">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-accent-200 text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-1 text-primary-300 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <h2 className="font-display font-semibold text-2xl text-primary-400 mb-3">
                    {item.title}
                  </h2>

                  <p className="text-primary-300 mb-4 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-primary-300">
                    <span>{item.readTime}</span>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-accent-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-primary-300 hover:text-primary-400 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-primary-300 hover:text-primary-400 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 text-primary-300 hover:text-primary-400 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>

                <Link
                  to={`/student/news/${item.id}`}
                  className="bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-accent-200 text-primary-400 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
            Load More News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
