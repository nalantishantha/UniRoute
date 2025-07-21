import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logoWhite.png";
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
  Target,
  Heart,
  Shield,
  Lightbulb,
  Globe,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-primary-600 to-primary-800 border-b border-primary-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-30">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logoWhite}
                  alt="UniRoute Logo"
                  className="h-20 w-auto -mr-5"
                />
                <span className="font-display font-bold text-2xl text-white">
                  UniRoute
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8 ml-auto">
              <Link
                to="/"
                className="text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <a
                href="/#features"
                className="text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              >
                Features
              </a>
              <Link
                to="/about"
                className="text-white hover:text-primary-100 transition-colors duration-200 font-medium border-b-2 border-white/50"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              >
                Contact
              </Link>
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
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6 shadow-lg">
              <span className="text-primary-200 font-medium">
                🎓 Empowering Sri Lankan Students
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-primary-200">
                UniRoute
              </span>
            </h1>

            <p className="text-xl text-primary-100/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Making higher education accessible and understandable for every Sri Lankan student through innovative technology and personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Stats Combined Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center bg-primary-100 px-4 py-2 rounded-full border border-primary-200 mb-6">
                <Target className="h-4 w-4 text-primary-600 mr-2" />
                <span className="text-primary-600 font-medium">Our Mission</span>
              </div>

              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-800 mb-6">
                Bridging Dreams with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-warning">
                  Reality
                </span>
              </h2>

              <p className="text-lg text-neutral-dark-grey leading-relaxed mb-6">
                UniRoute combines cutting-edge technology with deep understanding of the Sri Lankan education landscape to provide students with the tools, insights, and support they need to succeed.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-neutral-dark-grey">Student-centered design and approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-neutral-dark-grey">Trusted and reliable information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-neutral-dark-grey">Innovation-driven solutions</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl text-white text-center">
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <p className="text-primary-100">Students Guided</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-primary-200 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary-800 mb-1">25+</div>
                  <p className="text-sm text-neutral-dark-grey">Universities</p>
                </div>
                <div className="bg-white border-2 border-primary-200 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary-800 mb-1">98%</div>
                  <p className="text-sm text-neutral-dark-grey">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-primary-100/80 max-w-2xl mx-auto">
              Our core values guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-warning/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Accessibility
              </h3>
              <p className="text-primary-100/70 text-sm">
                Quality education guidance for all backgrounds
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-warning/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Integrity
              </h3>
              <p className="text-primary-100/70 text-sm">
                Honest, transparent, and unbiased information
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-warning/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Innovation
              </h3>
              <p className="text-primary-100/70 text-sm">
                Latest technology and educational insights
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-warning/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Empathy
              </h3>
              <p className="text-primary-100/70 text-sm">
                Understanding unique student challenges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-800 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-neutral-dark-grey mb-8">
            Join thousands of students who have found their path to success with UniRoute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-primary-600 to-primary-800 text-white px-8 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-900 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/contact"
              className="group border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-primary-600 hover:text-white transition-colors duration-200 flex items-center justify-center"
            >
              Contact Us
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-dark-grey py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img src={logoWhite} alt="UniRoute Logo" className="h-12 w-auto mr-2" />
                <span className="font-display font-bold text-2xl text-white">
                  UniRoute
                </span>
              </div>
              <p className="text-neutral-light-grey mb-4 max-w-md">
                Empowering Sri Lankan students to make informed decisions about
                their higher education journey through personalized guidance and
                cutting-edge technology.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/universities"
                    className="text-neutral-light-grey hover:text-white transition-colors text-sm"
                  >
                    Universities
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-white mb-4">
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

export default AboutUs;
