import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowLeft,
  Search,
  Filter,
  BookOpen,
  MapPin,
  Clock,
  Users,
  Award,
  Star,
  ChevronRight,
  Target,
  TrendingUp,
  CheckCircle,
  User,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

const ProgramMatching = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const programs = [
    {
      id: 1,
      name: "Bachelor of Engineering (Hons)",
      university: "University of Moratuwa",
      faculty: "Faculty of Engineering",
      duration: "4 years",
      zScoreRequired: 1.8542,
      description:
        "Comprehensive engineering program covering multiple disciplines.",
      specializations: [
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Computer Engineering",
      ],
      careerProspects: [
        "Engineer",
        "Project Manager",
        "Technical Consultant",
        "Research Scientist",
      ],
      employmentRate: "95%",
      averageSalary: "Rs. 80,000 - 150,000",
      matchScore: 95,
      category: "engineering",
    },
    {
      id: 2,
      name: "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
      university: "University of Colombo",
      faculty: "Faculty of Medicine",
      duration: "5 years",
      zScoreRequired: 2.0123,
      description:
        "Premier medical program preparing students for healthcare careers.",
      specializations: [
        "General Medicine",
        "Surgery",
        "Pediatrics",
        "Cardiology",
      ],
      careerProspects: [
        "Doctor",
        "Surgeon",
        "Medical Researcher",
        "Healthcare Administrator",
      ],
      employmentRate: "100%",
      averageSalary: "Rs. 100,000 - 200,000",
      matchScore: 88,
      category: "medical",
    },
    {
      id: 3,
      name: "Bachelor of Science (Hons) in Computer Science",
      university: "University of Colombo",
      faculty: "Faculty of Science",
      duration: "4 years",
      zScoreRequired: 1.9234,
      description:
        "Cutting-edge computer science program focusing on software development and AI.",
      specializations: [
        "Software Engineering",
        "Artificial Intelligence",
        "Data Science",
        "Cybersecurity",
      ],
      careerProspects: [
        "Software Developer",
        "Data Scientist",
        "AI Engineer",
        "Tech Lead",
      ],
      employmentRate: "98%",
      averageSalary: "Rs. 70,000 - 180,000",
      matchScore: 92,
      category: "technology",
    },
    {
      id: 4,
      name: "Bachelor of Business Administration (BBA)",
      university: "University of Sri Jayewardenepura",
      faculty: "Faculty of Management Studies",
      duration: "4 years",
      zScoreRequired: 1.4567,
      description:
        "Comprehensive business program covering management and entrepreneurship.",
      specializations: [
        "Marketing",
        "Finance",
        "Human Resources",
        "Operations Management",
      ],
      careerProspects: [
        "Business Manager",
        "Marketing Executive",
        "Financial Analyst",
        "Entrepreneur",
      ],
      employmentRate: "90%",
      averageSalary: "Rs. 50,000 - 120,000",
      matchScore: 85,
      category: "business",
    },
    {
      id: 5,
      name: "Bachelor of Arts (Hons)",
      university: "University of Peradeniya",
      faculty: "Faculty of Arts",
      duration: "3 years",
      zScoreRequired: 1.2345,
      description:
        "Liberal arts program offering diverse subjects in humanities.",
      specializations: [
        "History",
        "Geography",
        "Political Science",
        "Sociology",
      ],
      careerProspects: [
        "Teacher",
        "Civil Servant",
        "Journalist",
        "Social Worker",
      ],
      employmentRate: "85%",
      averageSalary: "Rs. 40,000 - 80,000",
      matchScore: 78,
      category: "arts",
    },
  ];

  const categories = [
    { id: "all", name: "All Programs", icon: BookOpen },
    { id: "engineering", name: "Engineering", icon: Target },
    { id: "medical", name: "Medical", icon: Award },
    { id: "technology", name: "Technology", icon: TrendingUp },
    { id: "business", name: "Business", icon: Users },
    { id: "arts", name: "Arts", icon: Star },
  ];

  const filteredPrograms = programs
    .filter(
      (program) =>
        selectedFilter === "all" || program.category === selectedFilter
    )
    .filter(
      (program) =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.faculty.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.matchScore - a.matchScore);

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
                className="text-primary-300 hover:text-primary-400 transition-colors duration-200"
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

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-400 to-accent-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-5xl mb-6">
            Program Matching
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Find the perfect university program that matches your interests,
            skills, and career goals. Our AI-powered matching system analyzes
            your profile to recommend the best fit.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
              <input
                type="text"
                placeholder="Search programs, universities, or faculties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedFilter(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === category.id
                    ? "bg-primary-400 text-white"
                    : "bg-white text-primary-400 border border-accent-100 hover:bg-accent-50"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Match Score Summary */}
        <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl p-6 mb-8">
          <h2 className="font-display font-semibold text-2xl text-primary-400 mb-4">
            Your Match Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-primary-300">Best Match</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-primary-400">
                {filteredPrograms[0]?.matchScore || 0}%
              </div>
              <div className="text-sm text-primary-300">
                {filteredPrograms[0]?.name || "No programs found"}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-primary-300">Programs Found</span>
                <BookOpen className="h-5 w-5 text-primary-400" />
              </div>
              <div className="text-2xl font-bold text-primary-400">
                {filteredPrograms.length}
              </div>
              <div className="text-sm text-primary-300">
                Matching your criteria
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-primary-300">Avg. Match Score</span>
                <TrendingUp className="h-5 w-5 text-accent-400" />
              </div>
              <div className="text-2xl font-bold text-primary-400">
                {filteredPrograms.length > 0
                  ? Math.round(
                      filteredPrograms.reduce(
                        (sum, p) => sum + p.matchScore,
                        0
                      ) / filteredPrograms.length
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-primary-300">Across all matches</div>
            </div>
          </div>
        </div>

        {/* Programs List */}
        <div className="space-y-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-display font-semibold text-2xl text-primary-400">
                        {program.name}
                      </h3>
                      <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {program.matchScore}% Match
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-primary-300 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{program.university}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{program.faculty}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{program.duration}</span>
                      </div>
                    </div>
                    <p className="text-primary-300 mb-4">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">
                      Z-Score Required
                    </div>
                    <div className="font-semibold text-primary-400">
                      {program.zScoreRequired}
                    </div>
                  </div>
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">
                      Employment Rate
                    </div>
                    <div className="font-semibold text-primary-400">
                      {program.employmentRate}
                    </div>
                  </div>
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">
                      Average Salary
                    </div>
                    <div className="font-semibold text-primary-400">
                      {program.averageSalary}
                    </div>
                  </div>
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">
                      Duration
                    </div>
                    <div className="font-semibold text-primary-400">
                      {program.duration}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-primary-400 mb-2">
                      Specializations
                    </h4>
                    <div className="space-y-1">
                      {program.specializations.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-primary-300">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-400 mb-2">
                      Career Prospects
                    </h4>
                    <div className="space-y-1">
                      {program.careerProspects.map((career, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <TrendingUp className="h-4 w-4 text-accent-400" />
                          <span className="text-primary-300">{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button className="bg-primary-400 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      Apply Now
                    </button>
                    <button className="border border-accent-100 text-primary-400 px-6 py-2 rounded-lg hover:bg-accent-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                  <button className="flex items-center space-x-2 text-primary-300 hover:text-primary-400 transition-colors">
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-primary-200 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-2">
              No Programs Found
            </h3>
            <p className="text-primary-300">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramMatching;
