import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
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
  Loader2,
} from "lucide-react";

const ProgramMatching = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: "all", name: "All Programs", icon: BookOpen },
    { id: "Maths", name: "Physical Science", icon: Target },
    { id: "Science", name: "Biological Science", icon: Award },
    { id: "Commerce", name: "Commerce", icon: Users },
    { id: "Arts", name: "Arts", icon: Star },
    { id: "Technology", name: "Technology", icon: TrendingUp },
    { id: "Other", name: "Open", icon: BookOpen },
  ];

  // Fetch programs from backend
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = `/api/university-programs/programs/?category=${selectedFilter}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setPrograms(data.programs || []);
        } else {
          setError(data.message || 'Failed to fetch programs');
          setPrograms([]);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again.');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrograms();
  }, [selectedFilter]);

  const filteredPrograms = programs.filter(
    (program) =>
      program.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.faculty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-blue-900 mb-4 drop-shadow-md">
            Degree Programs From Government Universities
          </h1>
          {/* <p className="text-xl text-blue-800 max-w-3xl mx-auto">
            Find the perfect university program that matches your interests,
            skills, and career goals. Our AI-powered matching system analyzes
            your profile to recommend the best fit.
          </p> */}
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
              <input
                type="text"
                placeholder="Search programs, universities, or faculties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-blue-900 placeholder-blue-600"
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
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-700 border border-accent-100 hover:bg-blue-50"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Match Score Summary */}
        {/* <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-6 mb-8">
          <h2 className="font-display font-semibold text-2xl text-blue-900 mb-4">
            Programs Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Programs Found</span>
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {filteredPrograms.length}
              </div>
              <div className="text-sm text-blue-700">
                Matching your criteria
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Total Programs</span>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {programs.length}
              </div>
              <div className="text-sm text-blue-700">Available in database</div>
            </div>
          </div>
        </div> */}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-blue-700 text-lg">Loading programs...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 mx-auto block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Programs List */}
        {!loading && !error && (
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
                        <h3 className="font-display font-semibold text-2xl text-blue-900">
                          {program.name}
                        </h3>
                        {program.code && (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {program.code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-blue-700 mb-3">
                        {program.university && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{program.university}</span>
                          </div>
                        )}
                        {program.faculty && (
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{program.faculty}</span>
                          </div>
                        )}
                        {program.duration && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{program.duration}</span>
                          </div>
                        )}
                      </div>
                      {program.description && (
                        <p className="text-blue-700 mb-4">
                          {program.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {program.zScoreRequired && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-700 mb-1">
                          Z-Score Required
                        </div>
                        <div className="font-semibold text-blue-900">
                          {program.zScoreRequired}
                        </div>
                      </div>
                    )}
                    {program.duration && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-700 mb-1">
                          Duration
                        </div>
                        <div className="font-semibold text-blue-900">
                          {program.duration}
                        </div>
                      </div>
                    )}
                    {program.degree_type && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-700 mb-1">
                          Degree Type
                        </div>
                        <div className="font-semibold text-blue-900">
                          {program.degree_type}
                        </div>
                      </div>
                    )}
                  </div>

                  {program.careerProspects && program.careerProspects.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Career Prospects
                      </h4>
                      <div className="space-y-1">
                        {program.careerProspects.map((career, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-700">{career.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-2">
              No Programs Found
            </h3>
            <p className="text-blue-700">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramMatching;
