import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  TrendingUp,
  Calculator,
  Award,
  BookOpen,
  Users,
  Loader2,
} from "lucide-react";

const ZScoreAnalysis = () => {
  const [zScore, setZScore] = useState("");
  const [district, setDistrict] = useState("");
  const [stream, setStream] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const districts = [
    "Colombo",
    "Galle",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Kurunegala",
    "Matara",
  ];

  const streams = [
    "Physical Science",
    "Biological Science",
    "Mathematics",
    "Commerce",
    "Arts",
    "Technology",
  ];

  // Load saved analysis from sessionStorage on component mount
  useEffect(() => {
    const savedAnalysis = sessionStorage.getItem("zscoreAnalysis");
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis);
        setAnalysis(parsed);
        setZScore(parsed.user_zscore || "");
        setDistrict(parsed.district || "");
        setStream(parsed.stream || "");
      } catch (e) {
        console.error("Error loading saved analysis:", e);
      }
    }
  }, []);

  const analyzeZScore = async () => {
    const score = parseFloat(zScore);
    if (!score || !district || !stream) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/university-programs/analyze-zscore/?zscore=${score}&district=${encodeURIComponent(
          district
        )}&stream=${encodeURIComponent(stream)}`
      );

      const data = await response.json();

      if (data.success) {
        setAnalysis(data);
        // Save to sessionStorage
        sessionStorage.setItem("zscoreAnalysis", JSON.stringify(data));
      } else {
        alert(data.message || "Error analyzing Z-score");
        setAnalysis(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze Z-score. Please try again.");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (probability) => {
    switch (probability) {
      case "High":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-primary-400 mb-4">
            Z-Score Analysis
          </h1>
          <p className="text-xl text-primary-300 max-w-2xl mx-auto">
            Analyze your Z-score to understand your university admission
            prospects and get personalized degree program recommendations
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100 mb-8">
          <div className="flex items-center mb-6">
            <Calculator className="h-6 w-6 text-primary-400 mr-2" />
            <h2 className="font-display font-semibold text-2xl text-primary-400">
              Enter Your Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Your Z-Score
              </label>
              <input
                type="number"
                step="0.0001"
                value={zScore}
                onChange={(e) => setZScore(e.target.value)}
                className="w-full px-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                placeholder="e.g., 1.8542"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-400 mb-2">
                District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              >
                <option value="">Select your district</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-400 mb-2">
                A/L Stream
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full px-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              >
                <option value="">Select your stream</option>
                {streams.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={analyzeZScore}
            disabled={!zScore || !district || !stream || loading}
            className="w-full bg-primary-400 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze My Z-Score"
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && analysis.success && (
          <div className="space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-primary-400 mr-2" />
                <h2 className="font-display font-semibold text-2xl text-primary-400">
                  Analysis Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-accent-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    {analysis.user_zscore}
                  </div>
                  <div className="text-primary-300">Your Z-Score</div>
                </div>

                <div className="text-center p-6 bg-accent-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analysis.total_programs}
                  </div>
                  <div className="text-primary-300">Eligible Programs</div>
                </div>
              </div>
            </div>

            {/* Eligible Programs */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
              <div className="flex items-center mb-6">
                <BookOpen className="h-6 w-6 text-primary-400 mr-2" />
                <h2 className="font-display font-semibold text-2xl text-primary-400">
                  Eligible Programs
                </h2>
              </div>

              {analysis.eligible_programs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-primary-300 text-lg">
                    No programs found for your criteria. Try adjusting your
                    search parameters.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysis.eligible_programs.map((program, index) => (
                    <div
                      key={index}
                      className="p-6 border border-accent-100 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-primary-400 mb-2">
                            {program.title}
                            {program.code && (
                              <span className="text-sm text-primary-300 ml-2">
                                ({program.code})
                              </span>
                            )}
                          </h3>
                          
                          <div className="space-y-1 text-sm text-primary-300 mb-3">
                            {program.faculty_name && (
                              <p>
                                <span className="font-medium">Faculty:</span>{" "}
                                {program.faculty_name}
                              </p>
                            )}
                            {program.university_name && (
                              <p>
                                <span className="font-medium">University:</span>{" "}
                                {program.university_name}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">
                                Required Z-Score:
                              </span>{" "}
                              {program.required_zscore} ({program.year})
                            </p>
                          </div>

                          {program.description && (
                            <p className="text-primary-300 text-sm mb-3">
                              {program.description}
                            </p>
                          )}

                          {program.career_paths && (
                            <div className="text-sm">
                              <span className="font-medium text-primary-400">
                                Career Paths:
                              </span>
                              <p className="text-primary-300 mt-1">
                                {program.career_paths}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium ${getProbabilityColor(
                              program.probability
                            )}`}
                          >
                            {program.probability} Chance
                          </span>
                          <Award
                            className={`h-6 w-6 ${
                              program.probability === "High"
                                ? "text-green-500"
                                : program.probability === "Medium"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl p-8 text-white">
              <h2 className="font-display font-semibold text-2xl mb-4">
                Next Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/program-matching"
                  className="bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <BookOpen className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Explore Programs</h3>
                  <p className="text-sm text-primary-100">
                    Find detailed information about degree programs
                  </p>
                </Link>

                <Link
                  to="/university-guide"
                  className="bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <GraduationCap className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">University Guide</h3>
                  <p className="text-sm text-primary-100">
                    Learn about universities and their facilities
                  </p>
                </Link>

                <Link
                  to="/mentors"
                  className="bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <Users className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Get Guidance</h3>
                  <p className="text-sm text-primary-100">
                    Connect with mentors for personalized advice
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZScoreAnalysis;
