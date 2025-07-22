import React from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import logoWhite from "../../assets/logoWhite.png";
import {
  GraduationCap,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  MapPin,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  User,
  Settings,
  LogOut,
  Bell,
  Target,
} from "lucide-react";

const StudentHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6 shadow-lg">
                <span className="text-primary-400 font-medium">
                  Welcome back to Sri Lanka's #1 University Guidance Platform
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-primary-400 mb-6 leading-tight drop-shadow-lg">
                Your Path to
                <span className="block font-extrabold text-primary-700 drop-shadow-lg">
                  Higher Education
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Navigate Sri Lanka's university landscape with confidence. Get
                <span className="text-primary-400 font-bold">
                  {" "}
                  personalized guidance{" "}
                </span>
                based on your O/L and A/L results, Z-scores, and career
                aspirations.
              </p>
            </div>

            <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/student/z-score-analysis"
                className="bg-gradient-to-br from-primary-500 to-primary-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-primary-800 hover:to-primary-500 hover:shadow-xl hover:text-white transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <span>Analyze Your Z-Score</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/student/program-matching"
                className="border-2 border-primary-200 text-primary-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-200 hover:text-primary-800 transition-all duration-200 hover:shadow-lg"
              >
                Find Programs
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left animate-bounce-in bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold text-primary-700 mb-2 drop-shadow-lg">
                  25+
                </div>
                <div className="text-primary-500 font-semibold text-base drop-shadow-md">
                  Government Universities
                </div>
              </div>
              <div
                className="text-center md:text-left animate-bounce-in bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-4xl font-bold text-primary-700 mb-2 drop-shadow-lg">
                  500+
                </div>
                <div className="text-primary-500 font-semibold text-base drop-shadow-md">
                  Degree Programs
                </div>
              </div>
              <div
                className="text-center md:text-left animate-bounce-in bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-4xl font-bold text-primary-700 mb-2 drop-shadow-lg">
                  10K+
                </div>
                <div className="text-primary-500 font-semibold text-base drop-shadow-md">
                  Students Guided
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-50 px-4 py-2 rounded-full border border-primary-200 mb-6">
              <Target className="h-4 w-4 text-primary-900 mr-2" />
              <span className="text-primary-900 font-medium">
                Why Students Choose Us
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-800 mb-6">
              Why Choose UniRoute?
            </h2>
            <p className="text-xl text-neutral-dark-grey max-w-2xl mx-auto">
              Comprehensive tools and guidance tailored specifically for
              <span className="text-primary-900 font-medium">
                {" "}
                Sri Lankan students
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              to="/student/z-score-analysis"
              className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-100 hover:to-primary-150"
            >
              <div className="bg-gradient-to-br from-primary-900 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-800 mb-4">
                Z-Score Analysis
              </h3>
              <p className="text-neutral-dark-grey mb-4 leading-relaxed">
                Get detailed analysis of your Z-score and understand which
                university programs you're eligible for.
              </p>
              <div className="flex items-center text-primary-900 font-medium hover:text-primary-800 transition-colors cursor-pointer">
                <span>Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/student/program-matching"
              className="bg-gradient-to-br from-primary-700 to-primary-500 p-8 rounded-xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-500 hover:to-primary-700"
            >
              <div className="bg-gradient-to-br from-primary-900 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-white mb-4">
                Program Matching
              </h3>
              <p className="text-primary-100 mb-4 leading-relaxed">
                Find the perfect degree programs that align with your academic
                background and career goals.
              </p>
              <div className="flex items-center text-white font-medium hover:text-primary-800 transition-colors cursor-pointer">
                <span>Explore programs</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/student/university-guide"
              className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-100 hover:to-primary-150"
            >
              <div className="bg-gradient-to-br from-primary-900 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-800 mb-4">
                University Guide
              </h3>
              <p className="text-neutral-dark-grey mb-4 leading-relaxed">
                Comprehensive information about all government universities,
                their facilities, and campus life.
              </p>
              <div className="flex items-center text-primary-900 font-medium hover:text-primary-800 transition-colors cursor-pointer">
                <span>View universities</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/student/career-counseling"
              className="bg-gradient-to-br from-primary-700 to-primary-500 p-8 rounded-xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-500 hover:to-primary-700"
            >
              <div className="bg-gradient-to-br from-primary-900 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-white mb-4">
                Career Counseling
              </h3>
              <p className="text-primary-100 mb-4 leading-relaxed">
                Get expert advice on career paths and professional development
                opportunities.
              </p>
              <div className="flex items-center text-white font-medium hover:text-primary-800 transition-colors cursor-pointer">
                <span>Get guidance</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/student/scholarship-info"
              className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-100 hover:to-primary-150"
            >
              <div className="bg-gradient-to-br from-primary-800 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-800 mb-4">
                Scholarship Info
              </h3>
              <p className="text-neutral-dark-grey mb-4 leading-relaxed">
                Discover scholarship opportunities and financial aid options for
                your studies.
              </p>
              <div className="flex items-center text-primary-900 font-medium hover:text-primary-800 transition-colors cursor-pointer">
                <span>Find scholarships</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/student/success-stories"
              className="bg-gradient-to-br from-primary-700 to-primary-500 p-8 rounded-xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-500 hover:to-primary-700"
            >
              <div className="bg-gradient-to-br from-primary-900 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-white mb-4">
                Success Stories
              </h3>
              <p className="text-primary-100 mb-4 leading-relaxed">
                Learn from successful graduates and their journey through higher
                education.
              </p>
              <div className="flex items-center text-white font-medium hover:text-primary-800 transition-colors cursor-pointer">
                <span>Read stories</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-warning/40 px-4 py-2 rounded-full border border-warning mb-6">
              <CheckCircle className="h-4 w-4 text-warning mr-2" />
              <span className="text-warning font-medium">
                Simple & Effective Process
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-warning mb-6">
              How UniRoute Works
            </h2>
            <p className="text-xl text-primary-100/40 max-w-2xl mx-auto">
              Simple steps to discover your perfect university path
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center bg-white p-8 rounded-2xl border border-primary-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-warning/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300">
                    1
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-primary-800 mb-4 group-hover:text-primary-900 transition-colors duration-300">
                  Enter Your Results
                </h3>
                <p className="text-neutral-dark-grey leading-relaxed group-hover:text-primary-700 transition-colors duration-300">
                  Input your O/L and A/L results, subjects, and Z-score for
                  personalized recommendations.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="group text-center bg-white p-8 rounded-2xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-primary-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300">
                    2
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-primary-800 mb-4 group-hover:text-primary-900 transition-colors duration-300">
                  Get Matched
                </h3>
                <p className="text-neutral-dark-grey leading-relaxed group-hover:text-primary-700 transition-colors duration-300">
                  Our algorithm matches you with suitable universities and
                  degree programs based on your profile.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="group text-center bg-white p-8 rounded-2xl border border-primary-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-warning/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-700 to-primary-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300">
                    3
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-primary-800 mb-4 group-hover:text-primary-900 transition-colors duration-300">
                  Plan Your Future
                </h3>
                <p className="text-neutral-dark-grey leading-relaxed group-hover:text-primary-700 transition-colors duration-300">
                  Explore career paths, scholarships, and make informed
                  decisions about your higher education.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center bg-warning/20 backdrop-blur-sm px-4 py-2 rounded-full border border-warning/30 mb-6">
              <CheckCircle className="h-4 w-4 text-warning mr-2" />
              <span className="text-warning font-medium">
                Continue Your Journey
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
              Ready to Find Your Path?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students who have successfully navigated their
              way to higher education with UniRoute.
            </p>
          </div>

          <Link
            to="/student/dashboard"
            className="bg-warning text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-warning/90 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-2"
          >
            <span>Go to My Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src={logoWhite}
                  alt="UniRoute Logo"
                  className="h-12 w-auto -mr-2"
                />
                <span className="font-display font-bold text-2xl text-white">
                  UniRoute
                </span>
              </div>
              <p className="text-neutral-light-grey mb-4 max-w-md">
                Empowering Sri Lankan students to make informed decisions about
                their higher education journey.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors">
                  <span className="text-white text-sm">fb</span>
                </div>
                <div className="w-10 h-10 bg-primary-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors">
                  <span className="text-white text-sm">tw</span>
                </div>
                <div className="w-10 h-10 bg-primary-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors">
                  <span className="text-white text-sm">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/student/university-guide"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Universities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/program-matching"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Programs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/scholarship-info"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Scholarships
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/career-counseling"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Career Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-dark-grey mt-8 pt-8 text-center">
            <p className="text-neutral-light-grey">
              © 2025 UniRoute. All rights reserved. Designed for Sri Lankan
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentHome;
