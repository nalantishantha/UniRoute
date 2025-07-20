import React, { useState } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  DollarSign,
  MapPin,
  BookOpen,
  Award,
  Users,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const ScholarshipInfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const scholarships = [
    {
      id: 1,
      name: "Mahapola Higher Education Scholarship",
      provider: "Mahapola Higher Education Scholarship Trust Fund",
      category: "Merit-based",
      level: "Undergraduate",
      amount: "Rs. 5,000 - 7,500 per month",
      duration: "4 years",
      deadline: "2024-03-15",
      eligibility: [
        "Sri Lankan citizen",
        "Financial need",
        "Good academic performance",
        "University admission",
      ],
      description:
        "The largest scholarship program in Sri Lanka supporting financially disadvantaged students with good academic records.",
      benefits: [
        "Monthly allowance",
        "Book allowance",
        "Hostel facilities support",
      ],
      requirements: [
        "Family income certificate",
        "GCE A/L results",
        "University admission letter",
      ],
      applicationProcess: "Online application through Mahapola website",
      contactInfo: "+94 11 2691757",
      website: "https://www.mahapola.lk",
      status: "Open",
      applicants: "15,000+",
      successRate: "35%",
    },
    {
      id: 2,
      name: "Commonwealth Scholarship",
      provider: "Commonwealth Scholarship Commission",
      category: "Merit-based",
      level: "Postgraduate",
      amount: "Full funding + stipend",
      duration: "1-3 years",
      deadline: "2024-01-12",
      eligibility: [
        "Commonwealth citizen",
        "First-class honors degree",
        "Development impact focus",
      ],
      description:
        "Prestigious international scholarship for postgraduate studies in Commonwealth countries.",
      benefits: [
        "Full tuition coverage",
        "Living stipend",
        "Travel allowance",
        "Thesis grant",
      ],
      requirements: [
        "Academic transcripts",
        "Research proposal",
        "Letters of recommendation",
        "English proficiency",
      ],
      applicationProcess: "Online application through CSC portal",
      contactInfo: "+94 11 2694491",
      website: "https://cscuk.fcdo.gov.uk",
      status: "Closed",
      applicants: "200+",
      successRate: "15%",
    },
    {
      id: 3,
      name: "SLIIT Merit Scholarship",
      provider: "Sri Lanka Institute of Information Technology",
      category: "Merit-based",
      level: "Undergraduate",
      amount: "25% - 100% tuition waiver",
      duration: "4 years",
      deadline: "2024-02-28",
      eligibility: [
        "Excellent A/L results",
        "SLIIT entrance exam",
        "Interview performance",
      ],
      description:
        "Merit-based scholarships for outstanding students pursuing degrees in IT and engineering.",
      benefits: [
        "Tuition fee reduction",
        "Priority registration",
        "Academic mentoring",
      ],
      requirements: [
        "A/L certificate",
        "Entrance exam",
        "Personal statement",
        "Interview",
      ],
      applicationProcess: "Application with university admission",
      contactInfo: "+94 11 2413500",
      website: "https://www.sliit.lk",
      status: "Open",
      applicants: "800+",
      successRate: "25%",
    },
    {
      id: 4,
      name: "Ceylinco Scholarship Programme",
      provider: "Ceylinco Insurance PLC",
      category: "Need-based",
      level: "Undergraduate",
      amount: "Rs. 50,000 - 100,000 per year",
      duration: "4 years",
      deadline: "2024-04-30",
      eligibility: [
        "Financial need",
        "Good academic record",
        "Community involvement",
      ],
      description:
        "Corporate scholarship supporting underprivileged students with academic potential.",
      benefits: [
        "Annual grant",
        "Mentorship program",
        "Internship opportunities",
      ],
      requirements: [
        "Income certificate",
        "Academic records",
        "Essay submission",
        "Community service proof",
      ],
      applicationProcess: "Download application from website",
      contactInfo: "+94 11 2429429",
      website: "https://www.ceylinco.com",
      status: "Open",
      applicants: "1,200+",
      successRate: "20%",
    },
    {
      id: 5,
      name: "Japan-Sri Lanka Friendship Scholarship",
      provider: "Japan International Cooperation Agency (JICA)",
      category: "International",
      level: "Postgraduate",
      amount: "Full funding + allowances",
      duration: "2 years",
      deadline: "2024-05-31",
      eligibility: [
        "Work experience",
        "English/Japanese proficiency",
        "Development focus",
      ],
      description:
        "Technical cooperation scholarship for postgraduate studies in Japan.",
      benefits: [
        "Full expenses",
        "Monthly allowance",
        "Travel costs",
        "Japanese language training",
      ],
      requirements: [
        "Work experience certificate",
        "Language test scores",
        "Health certificate",
        "Recommendation letters",
      ],
      applicationProcess: "Through implementing organizations",
      contactInfo: "+94 11 2693630",
      website: "https://www.jica.go.jp",
      status: "Open",
      applicants: "50+",
      successRate: "40%",
    },
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Merit-based", name: "Merit-based" },
    { id: "Need-based", name: "Need-based" },
    { id: "International", name: "International" },
  ];

  const levels = [
    { id: "all", name: "All Levels" },
    { id: "Undergraduate", name: "Undergraduate" },
    { id: "Postgraduate", name: "Postgraduate" },
  ];

  const filteredScholarships = scholarships
    .filter(
      (scholarship) =>
        selectedCategory === "all" || scholarship.category === selectedCategory
    )
    .filter(
      (scholarship) =>
        selectedLevel === "all" || scholarship.level === selectedLevel
    )
    .filter(
      (scholarship) =>
        scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Coming Soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Navigation */}
      <StudentNavigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-400 to-accent-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-5xl mb-6">
            Scholarship Information
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Discover funding opportunities to support your higher education
            journey. Find scholarships that match your profile and career goals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
              <input
                type="text"
                placeholder="Search scholarships, providers, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              >
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-300 text-sm">
                  Available Scholarships
                </p>
                <p className="text-2xl font-bold text-primary-400">
                  {filteredScholarships.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-accent-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-300 text-sm">Open Applications</p>
                <p className="text-2xl font-bold text-primary-400">
                  {
                    filteredScholarships.filter((s) => s.status === "Open")
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-300 text-sm">Total Funding</p>
                <p className="text-2xl font-bold text-primary-400">Rs. 50M+</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-300 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-primary-400">28%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        <div className="space-y-6">
          {filteredScholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-display font-semibold text-2xl text-primary-400">
                        {scholarship.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          scholarship.status
                        )}`}
                      >
                        {scholarship.status}
                      </span>
                    </div>
                    <p className="text-primary-300 mb-2">
                      {scholarship.provider}
                    </p>
                    <p className="text-primary-300 mb-4">
                      {scholarship.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">Amount</div>
                    <div className="font-semibold text-primary-400">
                      {scholarship.amount}
                    </div>
                  </div>
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">
                      Duration
                    </div>
                    <div className="font-semibold text-primary-400">
                      {scholarship.duration}
                    </div>
                  </div>
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">
                      Deadline
                    </div>
                    <div className="font-semibold text-primary-400">
                      {scholarship.deadline}
                    </div>
                  </div>
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="text-sm text-primary-300 mb-1">
                      Success Rate
                    </div>
                    <div className="font-semibold text-primary-400">
                      {scholarship.successRate}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-primary-400 mb-3 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Eligibility Criteria</span>
                    </h4>
                    <ul className="space-y-1">
                      {scholarship.eligibility.map((criteria, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-primary-300 text-sm">
                            {criteria}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-400 mb-3 flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Benefits</span>
                    </h4>
                    <ul className="space-y-1">
                      {scholarship.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-accent-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-primary-300 text-sm">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-primary-400 mb-3 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Required Documents</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.requirements.map((requirement, index) => (
                      <span
                        key={index}
                        className="bg-accent-100 text-primary-400 px-3 py-1 rounded-full text-sm"
                      >
                        {requirement}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <div className="text-primary-300 mb-1">
                      Application Process
                    </div>
                    <div className="text-primary-400">
                      {scholarship.applicationProcess}
                    </div>
                  </div>
                  <div>
                    <div className="text-primary-300 mb-1">Contact</div>
                    <div className="text-primary-400">
                      {scholarship.contactInfo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-accent-100">
                  <div className="flex items-center space-x-4 text-sm text-primary-300">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{scholarship.applicants} applicants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{scholarship.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{scholarship.level}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <a
                      href={scholarship.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 bg-accent-100 text-primary-400 px-4 py-2 rounded-lg hover:bg-accent-200 transition-colors"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button className="bg-primary-400 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-primary-200 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-2">
              No Scholarships Found
            </h3>
            <p className="text-primary-300">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl p-8">
          <h2 className="font-display font-semibold text-2xl text-primary-400 mb-6 text-center">
            Tips for Scholarship Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <AlertCircle className="h-8 w-8 text-accent-400 mb-3" />
              <h3 className="font-medium text-primary-400 mb-2">Start Early</h3>
              <p className="text-primary-300 text-sm">
                Begin your application process well before deadlines to ensure
                you have time to gather all required documents.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-medium text-primary-400 mb-2">
                Read Requirements
              </h3>
              <p className="text-primary-300 text-sm">
                Carefully review all eligibility criteria and application
                requirements before applying.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <Star className="h-8 w-8 text-yellow-500 mb-3" />
              <h3 className="font-medium text-primary-400 mb-2">Stand Out</h3>
              <p className="text-primary-300 text-sm">
                Highlight your unique achievements, community involvement, and
                future goals in your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipInfo;
