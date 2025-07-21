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
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6 shadow-lg">
              <span className="text-primary-200 font-medium">
                🎓 Empowering Sri Lankan Students
              </span>
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-primary-200">
                UniRoute
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-100/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              We're dedicated to making higher education accessible and
              understandable for every Sri Lankan student through innovative
              technology and personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-primary-100 px-4 py-2 rounded-full border border-primary-200 mb-6">
                <Target className="h-4 w-4 text-primary-600 mr-2" />
                <span className="text-primary-600 font-medium">Our Mission</span>
              </div>

              <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-800 mb-6">
                Bridging Dreams with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-warning">
                  Reality
                </span>
              </h2>

              <p className="text-lg text-neutral-dark-grey leading-relaxed mb-6">
                UniRoute was born from the understanding that navigating Sri
                Lanka's higher education system can be overwhelming. We believe
                every student deserves clear, personalized guidance to make
                informed decisions about their future.
              </p>

              <p className="text-lg text-neutral-dark-grey leading-relaxed">
                Our platform combines cutting-edge technology with deep
                understanding of the Sri Lankan education landscape to provide
                students with the tools, insights, and support they need to
                succeed.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Student-Centered</h3>
                    <p className="text-primary-100">
                      Every feature designed with students' needs in mind
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Trusted & Reliable</h3>
                    <p className="text-primary-100">
                      Accurate data and proven methodologies
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Innovation First</h3>
                    <p className="text-primary-100">
                      Using technology to solve real educational challenges
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-warning/20 px-4 py-2 rounded-full border border-warning mb-6">
              <BookOpen className="h-4 w-4 text-warning mr-2" />
              <span className="text-warning font-medium">Our Journey</span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-800 mb-6">
              How We Started
            </h2>
            <p className="text-xl text-neutral-dark-grey max-w-3xl mx-auto">
              Founded by a team of educators, technologists, and former students
              who experienced the challenges of university selection firsthand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary-800 mb-4">
                10,000+
              </h3>
              <p className="text-neutral-dark-grey">
                Students guided to their dream universities through our platform
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary-800 mb-4">
                25+
              </h3>
              <p className="text-neutral-dark-grey">
                Universities and higher education institutions partnered with us
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary-800 mb-4">
                98%
              </h3>
              <p className="text-neutral-dark-grey">
                Success rate in matching students with suitable programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-warning/40 px-4 py-2 rounded-full border border-warning mb-6">
              <Star className="h-4 w-4 text-warning mr-2" />
              <span className="text-warning font-medium">Core Values</span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
              What We Stand For
            </h2>
            <p className="text-xl text-primary-100/80 max-w-3xl mx-auto">
              Our values guide everything we do, from product development to
              student support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10 text-warning" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Accessibility
              </h3>
              <p className="text-primary-100/70">
                Making quality education guidance available to students from all
                backgrounds.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-warning" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Integrity
              </h3>
              <p className="text-primary-100/70">
                Providing honest, transparent, and unbiased information to help
                students make informed decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-10 w-10 text-warning" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Innovation
              </h3>
              <p className="text-primary-100/70">
                Continuously improving our platform with the latest technology
                and educational insights.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-warning" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Empathy
              </h3>
              <p className="text-primary-100/70">
                Understanding and addressing the unique challenges faced by Sri
                Lankan students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100/80 mb-8">
            Join thousands of students who have found their path to success with
            UniRoute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group bg-warning text-primary-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/contact"
              className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-800 transition-colors duration-200 flex items-center justify-center"
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
