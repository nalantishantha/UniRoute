import React, { useState } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  TrendingUp,
  Calculator,
  Award,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3,
  PieChart,
  Users,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const ZScoreAnalysis = () => {
  const [zScore, setZScore] = useState("");
  const [stream, setStream] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const streams = [
    "Physical Science",
    "Biological Science",
    "Mathematics",
    "Commerce",
    "Arts",
    "Technology",
  ];

  const analyzeZScore = () => {
    const score = parseFloat(zScore);
    if (!score || !stream) return;

    // Sample analysis data
    const analysisData = {
      score: score,
      stream: stream,
      percentile: Math.min(95, Math.max(5, (score + 2) * 25)),
      eligiblePrograms: getEligiblePrograms(score, stream),
      recommendations: getRecommendations(score, stream),
      statistics: {
        averageZScore: getAverageZScore(stream),
        topUniversityRequirement: getTopUniversityRequirement(stream),
        competitiveRange: getCompetitiveRange(stream),
      },
    };

    setAnalysis(analysisData);
  };

  const getEligiblePrograms = (score, stream) => {
    const programs = {
      "Physical Science": [
        {
          name: "Engineering - University of Moratuwa",
          cutoff: 1.8,
          probability: score >= 1.8 ? "High" : score >= 1.6 ? "Medium" : "Low",
        },
        {
          name: "Physical Science - University of Colombo",
          cutoff: 1.5,
          probability: score >= 1.5 ? "High" : score >= 1.3 ? "Medium" : "Low",
        },
        {
          name: "Computer Science - University of Colombo",
          cutoff: 1.9,
          probability: score >= 1.9 ? "High" : score >= 1.7 ? "Medium" : "Low",
        },
        {
          name: "Engineering - University of Peradeniya",
          cutoff: 1.7,
          probability: score >= 1.7 ? "High" : score >= 1.5 ? "Medium" : "Low",
        },
      ],
      "Biological Science": [
        {
          name: "Medicine - University of Colombo",
          cutoff: 2.0,
          probability: score >= 2.0 ? "High" : score >= 1.8 ? "Medium" : "Low",
        },
        {
          name: "Dental Surgery - University of Peradeniya",
          cutoff: 1.9,
          probability: score >= 1.9 ? "High" : score >= 1.7 ? "Medium" : "Low",
        },
        {
          name: "Veterinary Medicine - University of Peradeniya",
          cutoff: 1.6,
          probability: score >= 1.6 ? "High" : score >= 1.4 ? "Medium" : "Low",
        },
        {
          name: "Biological Science - University of Colombo",
          cutoff: 1.4,
          probability: score >= 1.4 ? "High" : score >= 1.2 ? "Medium" : "Low",
        },
      ],
      Mathematics: [
        {
          name: "Mathematics - University of Colombo",
          cutoff: 1.6,
          probability: score >= 1.6 ? "High" : score >= 1.4 ? "Medium" : "Low",
        },
        {
          name: "Statistics - University of Colombo",
          cutoff: 1.5,
          probability: score >= 1.5 ? "High" : score >= 1.3 ? "Medium" : "Low",
        },
        {
          name: "Computer Science - University of Kelaniya",
          cutoff: 1.7,
          probability: score >= 1.7 ? "High" : score >= 1.5 ? "Medium" : "Low",
        },
      ],
      Commerce: [
        {
          name: "Management - University of Sri Jayewardenepura",
          cutoff: 1.4,
          probability: score >= 1.4 ? "High" : score >= 1.2 ? "Medium" : "Low",
        },
        {
          name: "Accounting - University of Sri Jayewardenepura",
          cutoff: 1.5,
          probability: score >= 1.5 ? "High" : score >= 1.3 ? "Medium" : "Low",
        },
        {
          name: "Economics - University of Colombo",
          cutoff: 1.6,
          probability: score >= 1.6 ? "High" : score >= 1.4 ? "Medium" : "Low",
        },
      ],
      Arts: [
        {
          name: "Arts - University of Peradeniya",
          cutoff: 1.2,
          probability: score >= 1.2 ? "High" : score >= 1.0 ? "Medium" : "Low",
        },
        {
          name: "Social Sciences - University of Kelaniya",
          cutoff: 1.3,
          probability: score >= 1.3 ? "High" : score >= 1.1 ? "Medium" : "Low",
        },
        {
          name: "Languages - University of Colombo",
          cutoff: 1.4,
          probability: score >= 1.4 ? "High" : score >= 1.2 ? "Medium" : "Low",
        },
      ],
      Technology: [
        {
          name: "Technology - University of Moratuwa",
          cutoff: 1.5,
          probability: score >= 1.5 ? "High" : score >= 1.3 ? "Medium" : "Low",
        },
        {
          name: "Applied Sciences - Wayamba University",
          cutoff: 1.3,
          probability: score >= 1.3 ? "High" : score >= 1.1 ? "Medium" : "Low",
        },
      ],
    };

    return programs[stream] || [];
  };

  const getRecommendations = (score) => {
    const recommendations = [];

    if (score >= 1.8) {
      recommendations.push({
        type: "success",
        title: "Excellent Z-Score!",
        message:
          "You have a competitive Z-score for top-tier programs. Consider applying to premier universities.",
      });
    } else if (score >= 1.5) {
      recommendations.push({
        type: "info",
        title: "Good Z-Score",
        message:
          "You have good chances for many programs. Consider both competitive and safe options.",
      });
    } else {
      recommendations.push({
        type: "warning",
        title: "Consider All Options",
        message:
          "Explore various programs and universities. Consider improving your application with extracurriculars.",
      });
    }

    recommendations.push({
      type: "info",
      title: "Application Strategy",
      message:
        "Apply to a mix of reach, match, and safety programs to maximize your chances.",
    });

    return recommendations;
  };

  const getAverageZScore = (stream) => {
    const averages = {
      "Physical Science": 1.45,
      "Biological Science": 1.52,
      Mathematics: 1.38,
      Commerce: 1.25,
      Arts: 1.15,
      Technology: 1.35,
    };
    return averages[stream] || 1.3;
  };

  const getTopUniversityRequirement = (stream) => {
    const requirements = {
      "Physical Science": 1.85,
      "Biological Science": 1.95,
      Mathematics: 1.65,
      Commerce: 1.55,
      Arts: 1.45,
      Technology: 1.55,
    };
    return requirements[stream] || 1.6;
  };

  const getCompetitiveRange = (stream) => {
    const ranges = {
      "Physical Science": { min: 1.6, max: 2.2 },
      "Biological Science": { min: 1.7, max: 2.3 },
      Mathematics: { min: 1.4, max: 1.9 },
      Commerce: { min: 1.2, max: 1.8 },
      Arts: { min: 1.0, max: 1.6 },
      Technology: { min: 1.3, max: 1.8 },
    };
    return ranges[stream] || { min: 1.2, max: 1.8 };
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
            prospects and get personalized recommendations
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            disabled={!zScore || !stream}
            className="w-full bg-primary-400 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Analyze My Z-Score
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-primary-400 mr-2" />
                <h2 className="font-display font-semibold text-2xl text-primary-400">
                  Analysis Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-accent-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    {analysis.score}
                  </div>
                  <div className="text-primary-300">Your Z-Score</div>
                </div>

                <div className="text-center p-6 bg-accent-50 rounded-xl">
                  <div className="text-3xl font-bold text-accent-300 mb-2">
                    {analysis.percentile}%
                  </div>
                  <div className="text-primary-300">Percentile Rank</div>
                </div>

                <div className="text-center p-6 bg-accent-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analysis.eligiblePrograms.length}
                  </div>
                  <div className="text-primary-300">Eligible Programs</div>
                </div>
              </div>
            </div>

            {/* Statistics Comparison */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-primary-400 mr-2" />
                <h2 className="font-display font-semibold text-2xl text-primary-400">
                  Statistical Comparison
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-accent-100 rounded-xl">
                  <h3 className="font-medium text-primary-400 mb-2">
                    Stream Average
                  </h3>
                  <div className="text-2xl font-bold text-primary-400">
                    {analysis.statistics.averageZScore}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      analysis.score > analysis.statistics.averageZScore
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {analysis.score > analysis.statistics.averageZScore
                      ? "Above Average"
                      : "Below Average"}
                  </div>
                </div>

                <div className="p-4 border border-accent-100 rounded-xl">
                  <h3 className="font-medium text-primary-400 mb-2">
                    Top University Requirement
                  </h3>
                  <div className="text-2xl font-bold text-primary-400">
                    {analysis.statistics.topUniversityRequirement}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      analysis.score >=
                      analysis.statistics.topUniversityRequirement
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {analysis.score >=
                    analysis.statistics.topUniversityRequirement
                      ? "Qualified"
                      : "Close"}
                  </div>
                </div>

                <div className="p-4 border border-accent-100 rounded-xl">
                  <h3 className="font-medium text-primary-400 mb-2">
                    Competitive Range
                  </h3>
                  <div className="text-2xl font-bold text-primary-400">
                    {analysis.statistics.competitiveRange.min} -{" "}
                    {analysis.statistics.competitiveRange.max}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      analysis.score >=
                        analysis.statistics.competitiveRange.min &&
                      analysis.score <= analysis.statistics.competitiveRange.max
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {analysis.score >=
                      analysis.statistics.competitiveRange.min &&
                    analysis.score <= analysis.statistics.competitiveRange.max
                      ? "In Range"
                      : "Outside Range"}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-primary-400 mr-2" />
                <h2 className="font-display font-semibold text-2xl text-primary-400">
                  Recommendations
                </h2>
              </div>

              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-l-4 ${
                      rec.type === "success"
                        ? "bg-green-50 border-green-500"
                        : rec.type === "warning"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {rec.type === "success" && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      )}
                      {rec.type === "warning" && (
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      )}
                      {rec.type === "info" && (
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-medium text-primary-400">
                          {rec.title}
                        </h3>
                        <p className="text-primary-300 text-sm mt-1">
                          {rec.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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

              <div className="space-y-4">
                {analysis.eligiblePrograms.map((program, index) => (
                  <div
                    key={index}
                    className="p-4 border border-accent-100 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-400">
                          {program.name}
                        </h3>
                        <p className="text-sm text-primary-300">
                          Required Z-Score: {program.cutoff}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getProbabilityColor(
                            program.probability
                          )}`}
                        >
                          {program.probability} Chance
                        </span>
                        <Award
                          className={`h-5 w-5 ${
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
