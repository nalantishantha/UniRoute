import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logoWhite.png";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  HeadphonesIcon,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        userType: "",
      });
    }, 3000);
  };

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
                className="text-white/90 hover:text-primary-100 transition-colors duration-200 font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-primary-100 transition-colors duration-200 font-medium border-b-2 border-white/50"
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
                💬 We're Here to Help
              </span>
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 leading-tight">
              Get In{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-primary-200">
                Touch
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-100/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              Have questions about your university journey? Need personalized
              guidance? Our team is ready to support you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-100 px-4 py-2 rounded-full border border-primary-200 mb-6">
              <MessageSquare className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-primary-600 font-medium">Connect With Us</span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-800 mb-6">
              Multiple Ways to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-warning">
                Reach Us
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-200 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary-800 mb-4">
                Call Us
              </h3>
              <p className="text-neutral-dark-grey mb-4">
                Speak directly with our education consultants
              </p>
              <p className="font-bold text-primary-600 text-lg">
                +94 77 123 4567
              </p>
              <p className="text-sm text-neutral-dark-grey mt-2">
                Mon-Fri: 9:00 AM - 6:00 PM
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-200 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary-800 mb-4">
                Email Us
              </h3>
              <p className="text-neutral-dark-grey mb-4">
                Send us your questions and we'll respond within 24 hours
              </p>
              <p className="font-bold text-primary-600 text-lg">
                support@uniroute.lk
              </p>
              <p className="text-sm text-neutral-dark-grey mt-2">
                24/7 Email Support
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-200 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary-800 mb-4">
                Visit Us
              </h3>
              <p className="text-neutral-dark-grey mb-4">
                Meet our team at our office in Colombo
              </p>
              <p className="font-bold text-primary-600 text-lg">
                123 Galle Road
              </p>
              <p className="text-sm text-neutral-dark-grey mt-2">
                Colombo 03, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center bg-warning/20 px-4 py-2 rounded-full border border-warning mb-6">
                <Send className="h-4 w-4 text-warning mr-2" />
                <span className="text-warning font-medium">Send Message</span>
              </div>

              <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-800 mb-6">
                Let's Start a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-warning">
                  Conversation
                </span>
              </h2>

              <p className="text-lg text-neutral-dark-grey leading-relaxed mb-8">
                Whether you're a student seeking guidance, a parent with
                questions, or an institution looking to partner with us, we'd
                love to hear from you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-neutral-dark-grey">
                    Quick response within 24 hours
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-neutral-dark-grey">
                    Personalized guidance from experts
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-neutral-dark-grey">
                    Free consultation for students
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-primary-100">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-primary-800 mb-4">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-neutral-dark-grey">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-primary-800 font-medium mb-2">
                      I am a... *
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select your role</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="teacher">Teacher/Counselor</option>
                      <option value="institution">Educational Institution</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-primary-800 font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-primary-800 font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-primary-800 font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <label className="block text-primary-800 font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-primary-700 hover:to-primary-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>Send Message</span>
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-100 px-4 py-2 rounded-full border border-primary-200 mb-6">
              <HeadphonesIcon className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-primary-600 font-medium">Quick Answers</span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-800 mb-6">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-warning">
                Questions
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
                <h3 className="font-display font-bold text-xl text-primary-800 mb-3">
                  How accurate are your university recommendations?
                </h3>
                <p className="text-neutral-dark-grey">
                  Our recommendations are based on official university data, Z-score
                  calculations, and historical acceptance rates, providing 98%
                  accuracy in matching students with suitable programs.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
                <h3 className="font-display font-bold text-xl text-primary-800 mb-3">
                  Is the platform free for students?
                </h3>
                <p className="text-neutral-dark-grey">
                  Yes! Our core services including university recommendations,
                  Z-score calculations, and basic guidance are completely free for
                  all Sri Lankan students.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
                <h3 className="font-display font-bold text-xl text-primary-800 mb-3">
                  Do you cover all Sri Lankan universities?
                </h3>
                <p className="text-neutral-dark-grey">
                  We cover all state universities and most recognized private
                  institutions in Sri Lanka, with detailed information about
                  programs, requirements, and admission processes.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
                <h3 className="font-display font-bold text-xl text-primary-800 mb-3">
                  How often is your data updated?
                </h3>
                <p className="text-neutral-dark-grey">
                  We update our university data, cutoff marks, and program
                  information regularly, typically every semester or when
                  universities announce changes.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
                <h3 className="font-display font-bold text-xl text-primary-800 mb-3">
                  Can I get personalized guidance?
                </h3>
                <p className="text-neutral-dark-grey">
                  Absolutely! Our platform offers personalized recommendations
                  based on your academic performance, interests, and career goals.
                  You can also book one-on-one consultations with our experts.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
                <h3 className="font-display font-bold text-xl text-primary-800 mb-3">
                  What if I need help outside business hours?
                </h3>
                <p className="text-neutral-dark-grey">
                  You can always send us an email or use our contact form. We
                  respond to all inquiries within 24 hours, and our platform
                  resources are available 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-primary-100/80 mb-8">
            Join thousands of students who have successfully navigated their path
            to higher education with UniRoute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group bg-warning text-primary-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/about"
              className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-800 transition-colors duration-200 flex items-center justify-center"
            >
              Learn More About Us
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
                Contact Info
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-neutral-light-grey text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  +94 77 123 4567
                </li>
                <li className="flex items-center text-neutral-light-grey text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  support@uniroute.lk
                </li>
                <li className="flex items-center text-neutral-light-grey text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  123 Galle Road, Colombo 03
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

export default ContactUs;
