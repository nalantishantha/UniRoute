import React from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-accent-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-400" />
              <span className="font-display font-bold text-2xl text-primary-400">UniRoute</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-primary-300 hover:text-primary-400 transition-colors duration-200">Features</a>
              <a href="#about" className="text-primary-300 hover:text-primary-400 transition-colors duration-200">About</a>
              <a href="#contact" className="text-primary-300 hover:text-primary-400 transition-colors duration-200">Contact</a>
              <Link 
                to="/login" 
                className="bg-accent-200 text-primary-400 px-6 py-2 rounded-full font-medium hover:bg-accent-300 transition-all duration-200 hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>

            <div className="md:hidden">
              <Link 
                to="/login" 
                className="bg-accent-200 text-primary-400 px-4 py-2 rounded-full text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-slide-up">
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-primary-400 mb-6 leading-tight">
                Your Path to
                <span className="block text-accent-200">Higher Education</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Navigate Sri Lanka's university landscape with confidence. Get personalized guidance based on your O/L and A/L results, Z-scores, and career aspirations.
              </p>
            </div>
            
            <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/register" 
                className="bg-primary-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-600 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-accent-200 text-primary-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-200 transition-all duration-200 hover:shadow-lg"
              >
                Explore Features
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center animate-bounce-subtle">
                <div className="text-4xl font-bold text-accent-200 mb-2">25+</div>
                <div className="text-primary-300">Government Universities</div>
              </div>
              <div className="text-center animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold text-accent-200 mb-2">500+</div>
                <div className="text-primary-300">Degree Programs</div>
              </div>
              <div className="text-center animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
                <div className="text-4xl font-bold text-accent-200 mb-2">10K+</div>
                <div className="text-primary-300">Students Guided</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-400 mb-6">
              Why Choose UniRoute?
            </h2>
            <p className="text-xl text-primary-300 max-w-2xl mx-auto">
              Comprehensive tools and guidance tailored specifically for Sri Lankan students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-400 mb-4">Z-Score Analysis</h3>
              <p className="text-primary-300 mb-4">
                Get detailed analysis of your Z-score and understand which university programs you're eligible for.
              </p>
              <div className="flex items-center text-accent-300 font-medium">
                <span>Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-400 mb-4">Program Matching</h3>
              <p className="text-primary-300 mb-4">
                Find the perfect degree programs that align with your academic background and career goals.
              </p>
              <div className="flex items-center text-accent-300 font-medium">
                <span>Explore programs</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-400 mb-4">University Guide</h3>
              <p className="text-primary-300 mb-4">
                Comprehensive information about all government universities, their facilities, and campus life.
              </p>
              <div className="flex items-center text-accent-300 font-medium">
                <span>View universities</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-400 mb-4">Career Counseling</h3>
              <p className="text-primary-300 mb-4">
                Get expert advice on career paths and professional development opportunities.
              </p>
              <div className="flex items-center text-accent-300 font-medium">
                <span>Get guidance</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-400 mb-4">Scholarship Info</h3>
              <p className="text-primary-300 mb-4">
                Discover scholarship opportunities and financial aid options for your studies.
              </p>
              <div className="flex items-center text-accent-300 font-medium">
                <span>Find scholarships</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-primary-400 mb-4">Success Stories</h3>
              <p className="text-primary-300 mb-4">
                Learn from successful graduates and their journey through higher education.
              </p>
              <div className="flex items-center text-accent-300 font-medium">
                <span>Read stories</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-accent-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-400 mb-6">
              How UniRoute Works
            </h2>
            <p className="text-xl text-primary-300 max-w-2xl mx-auto">
              Simple steps to discover your perfect university path
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-primary-400">1</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-primary-400 mb-4">Enter Your Results</h3>
              <p className="text-primary-300">
                Input your O/L and A/L results, subjects, and Z-score for personalized recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-primary-400">2</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-primary-400 mb-4">Get Matched</h3>
              <p className="text-primary-300">
                Our algorithm matches you with suitable universities and degree programs based on your profile.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-primary-400">3</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-primary-400 mb-4">Plan Your Future</h3>
              <p className="text-primary-300">
                Explore career paths, scholarships, and make informed decisions about your higher education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-400">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
            Ready to Find Your Path?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who have successfully navigated their way to higher education with UniRoute.
          </p>
          <Link 
            to="/register" 
            className="bg-accent-200 text-primary-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-300 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-400 border-t border-primary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-accent-200" />
                <span className="font-display font-bold text-2xl text-white">UniRoute</span>
              </div>
              <p className="text-primary-100 mb-4 max-w-md">
                Empowering Sri Lankan students to make informed decisions about their higher education journey.
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
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Universities</a></li>
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Scholarships</a></li>
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Career Guide</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-300 mt-8 pt-8 text-center">
            <p className="text-primary-100">
              © 2024 UniRoute. All rights reserved. Designed for Sri Lankan students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;