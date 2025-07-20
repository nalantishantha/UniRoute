import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logoWhite.png";
import landingPageImage from "../assets/LandingPageImage.png";

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
  Play,
  Zap,
  Target,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white ">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-primary-600 to-primary-800 border-b border-primary-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-30">
            <div className="flex items-center">
              <img
                src={logoWhite}
                alt="UniRoute Logo"
                className="h-20 w-auto -mr-5"
              />
              <span className="font-display font-bold text-2xl text-white">
                UniRoute
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8 ml-auto">
              <a
                href="#features"
                className="text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              >
                Contact
              </a>
              <Link
                to="/login"
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-primary-800 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="border-2 border-primary-200 bg-primary-200 text-primary-800 px-6 py-2 rounded-lg font-medium hover:bg-white hover:border-white transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-2 ml-auto">
              <Link
                to="/login"
                className="border-2 border-white text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-primary-800 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-warning text-primary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-10 overflow-hidden">
        {/* Content */}
        <div className="left-32 lg:col-span-5 relative z-10 w-full py-20 lg:py-32 ">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="animate-slide-in">
                <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6 shadow-lg">
                  <span className="text-primary-400 font-medium">
                    Sri Lanka's #1 University Guidance Platform
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-primary-400 mb-6 leading-tight drop-shadow-lg">
                  Your Path to
                  <span className="block font-extrabold  text-primary-700 drop-shadow-lg">
                    Higher Education
                  </span>
                </h1>

                <p className="text-xl md:text-2xl  text-primary-300 mb-8 max-w-3xl leading-relaxed ">
                  Navigate Sri Lanka's university landscape with confidence. Get
                  <span className="text-primary-400 font-bold">
                    {" "}
                    personalized guidance{" "}
                  </span>
                  based on your O/L and A/L results, Z-scores, and career
                  aspirations.
                </p>
              </div>

              <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-start items-start mb-16">
                <Link
                  to="/register"
                  className="bg-gradient-to-br from-primary-500 to-primary-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-primary-800 hover:to-primary-500 hover:shadow-xl hover:text-white transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5" />
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
        </div>
        {/* Background Image */}
        <div className="absolute right-0 -bottom-3  inset-18 z-0 px-0 py-0 lg:col-span-5 ">
          <img
            src={landingPageImage}
            alt="UniRoute Platform"
            className="w-full h-auto object-cover object-left left-0"
          />
          {/* Overlay for better text readability */}
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-white"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 -top-3 bg-neutral-white relative">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-100 hover:to-primary-150">
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
            </div>

            <div className="bg-gradient-to-br  from-primary-700 to-primary-500  p-8 rounded-xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-500   hover:to-primary-700">
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
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-100 hover:to-primary-150">
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
            </div>

            <div className="bg-gradient-to-br  from-primary-700 to-primary-500  p-8 rounded-xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-500   hover:to-primary-700">
              <div className="bg-gradient-to-br from-primary-900 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
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
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-100 hover:to-primary-150">
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
            </div>

            <div className="bg-gradient-to-br  from-primary-700 to-primary-500  p-8 rounded-xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-primary-500   hover:to-primary-700">
              <div className="bg-gradient-to-br from-primary-900 to-primary-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
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
            </div>
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
              How It Works
            </h2>
            <p className="text-xl text-primary-100/40 max-w-2xl mx-auto mb-12">
              Get started with UniRoute in just three simple steps and find your
              perfect university match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center bg-white p-8 rounded-2xl border border-primary-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
              {/* Animated background accent */}
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
                  Input your O/L and A/L results to get your Z-score calculation
                  and eligibility analysis.
                </p>

                {/* Progress indicator */}
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="group text-center bg-white p-8 rounded-2xl border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
              {/* Animated background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-primary-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300">
                    2
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl text-primary-800 mb-4 group-hover:text-primary-900 transition-colors duration-300">
                  Get Recommendations
                </h3>

                <p className="text-neutral-dark-grey leading-relaxed group-hover:text-primary-700 transition-colors duration-300">
                  Receive personalized university and program recommendations
                  based on your profile.
                </p>

                {/* Progress indicator */}
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="group text-center bg-white p-8 rounded-2xl border border-primary-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
              {/* Animated background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-warning/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-700 to-primary-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300">
                    3
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl text-primary-800 mb-4 group-hover:text-primary-900 transition-colors duration-300">
                  Make Your Choice
                </h3>

                <p className="text-neutral-dark-grey leading-relaxed group-hover:text-primary-700 transition-colors duration-300">
                  Compare options and make informed decisions about your higher
                  education journey.
                </p>

                {/* Progress indicator */}
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-50 px-4 py-2 rounded-full border border-primary-200 mb-6">
              <Star className="h-4 w-4 text-primary-900 mr-2" />
              <span className="text-primary-900 font-medium">
                Student Success Stories
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-800 mb-6">
              What Students Say
            </h2>
            <p className="text-xl text-neutral-dark-grey max-w-2xl mx-auto">
              Hear from students who have successfully navigated their
              university journey with UniRoute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group bg-gradient-to-br from-white via-primary-50/30 to-warning/10 p-8 rounded-2xl border border-warning/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:border-warning/40 relative overflow-hidden">
              {/* Animated background element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-warning/20 to-primary-200/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="flex items-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">AP</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-primary-900 group-hover:text-primary-800 transition-colors duration-300">
                    Amara Perera
                  </h4>
                  <p className="text-primary-700 font-medium">
                    University of Colombo
                  </p>
                  <div className="w-12 h-1 bg-gradient-to-r from-warning to-primary-500 rounded-full mt-1 group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="text-4xl text-warning/30 font-serif mb-2">
                  "
                </div>
                <p className="text-neutral-dark-grey mb-6 leading-relaxed italic group-hover:text-primary-800 transition-colors duration-300">
                  UniRoute helped me understand my options after A/Ls. The
                  Z-score analysis was incredibly accurate!
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-warning fill-current transform group-hover:scale-110 transition-transform duration-200"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    Success Story
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white via-primary-50/30 to-warning/10 p-8 rounded-2xl border border-warning/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:border-warning/40 relative overflow-hidden">
              {/* Animated background element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-200/20 to-warning/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="flex items-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">KS</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-primary-900 group-hover:text-primary-800 transition-colors duration-300">
                    Kasun Silva
                  </h4>
                  <p className="text-primary-700 font-medium">
                    University of Moratuwa
                  </p>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary-600 to-warning rounded-full mt-1 group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="text-4xl text-primary-300 font-serif mb-2">
                  "
                </div>
                <p className="text-neutral-dark-grey mb-6 leading-relaxed italic group-hover:text-primary-800 transition-colors duration-300">
                  The career guidance feature helped me choose Engineering. Now
                  I'm studying at my dream university!
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-warning fill-current transform group-hover:scale-110 transition-transform duration-200"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    Engineering Graduate
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white via-primary-50/30 to-warning/10 p-8 rounded-2xl border border-warning/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:border-warning/40 relative overflow-hidden">
              {/* Animated background element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-warning/20 to-primary-200/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="flex items-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-warning/80 to-primary-600 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">NF</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-primary-900 group-hover:text-primary-800 transition-colors duration-300">
                    Nethmi Fernando
                  </h4>
                  <p className="text-primary-700 font-medium">
                    University of Peradeniya
                  </p>
                  <div className="w-12 h-1 bg-gradient-to-r from-warning to-primary-600 rounded-full mt-1 group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="text-4xl text-warning/30 font-serif mb-2">
                  "
                </div>
                <p className="text-neutral-dark-grey mb-6 leading-relaxed italic group-hover:text-primary-800 transition-colors duration-300">
                  Found the perfect scholarship through UniRoute. The platform
                  is a game-changer for students.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-warning fill-current transform group-hover:scale-110 transition-transform duration-200"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    Scholarship Winner
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center bg-warning/20 backdrop-blur-sm px-4 py-2 rounded-full border border-warning/30 mb-6">
              <CheckCircle className="h-4 w-4 text-warning mr-2" />
              <span className="text-warning font-medium">
                Join 10,000+ Successful Students
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
              Ready to Find Your Perfect Path?
            </h2>

            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of students who have successfully navigated their
              way to higher education with UniRoute.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-warning text-primary-800 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-warning/90 transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Get Started Today</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/login"
              className="border-2 border-warning/40 bg-warning/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-warning/20 hover:border-warning/60 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-neutral-light-grey text-base mb-4 max-w-md">
                Empowering Sri Lankan students to make informed decisions about
                their higher education journey.
              </p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-warning transition-colors">
                  <span className="text-white font-bold text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-info rounded-full flex items-center justify-center cursor-pointer hover:bg-warning transition-colors">
                  <span className="text-white font-bold text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center cursor-pointer hover:bg-warning transition-colors">
                  <span className="text-white font-bold text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white text-base mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Universities
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Programs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Scholarships
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Career Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white text-base mb-3">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-dark-grey mt-8 pt-6 text-center">
            <p className="text-neutral-light-grey text-sm">
              © 2024 UniRoute. All rights reserved. Designed for Sri Lankan
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
