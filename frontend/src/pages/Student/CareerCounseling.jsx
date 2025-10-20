import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Video,
  MessageCircle,
  Phone,
  Star,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  AlertCircle,
} from "lucide-react";

const CareerCounseling = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/counsellors/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch counselors');
      }

      const data = await response.json();
      setCounselors(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching counselors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      {/* Navigation */}
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Description */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-600 mb-2">
            Career Counseling
          </h1>
          <p className="text-primary-400 max-w-3xl mx-auto">
            Get personalized guidance from experienced career counselors to make
            informed decisions about your education and future career path.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
            <p className="mt-4 text-primary-300">Loading counselors...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Error Loading Counselors</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Counselors Section */}
        {!loading && !error && (
        <div className="mb-12">
          <h2 className="font-display font-semibold text-2xl text-primary-600 mb-6 text-center">
            Meet Our Expert Counselors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {counselors.map((counselor) => {
              // Parse expertise if it's a JSON string
              let expertiseArray = [];
              try {
                expertiseArray = counselor.expertise 
                  ? (typeof counselor.expertise === 'string' 
                      ? JSON.parse(counselor.expertise) 
                      : counselor.expertise)
                  : [];
              } catch (e) {
                expertiseArray = counselor.expertise ? [counselor.expertise] : [];
              }

              // Parse specializations if it's a JSON string
              let specializationsArray = [];
              try {
                specializationsArray = counselor.specializations 
                  ? (typeof counselor.specializations === 'string' 
                      ? JSON.parse(counselor.specializations) 
                      : counselor.specializations)
                  : [];
              } catch (e) {
                specializationsArray = counselor.specializations ? [counselor.specializations] : [];
              }

              const displaySpecialization = specializationsArray.length > 0 
                ? specializationsArray[0] 
                : counselor.specializations || 'Career Counselor';

              return (
              <div
                key={counselor.counsellor_id}
                className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Counselor Header */}
                <div className="relative h-36 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Available Badge */}
                  {counselor.available_for_sessions && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-emerald-500/30 backdrop-blur-lg rounded-xl px-3 py-1.5 border border-white/40 shadow-lg">
                        <span className="text-white font-bold text-xs drop-shadow-md">
                          Available Now
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Experience Badge */}
                  {counselor.experience_years && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/25 text-white border border-white/40 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-lg drop-shadow-lg">
                        {counselor.experience_years} {counselor.experience_years === 1 ? 'year' : 'years'} Experience
                      </span>
                    </div>
                  )}

                  {/* Counselor Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex-shrink-0">
                        {counselor.user_details?.profile_picture ? (
                          <img 
                            src={counselor.user_details.profile_picture} 
                            alt={counselor.user_details.full_name || counselor.user?.username}
                            className="w-16 h-16 rounded-full object-cover border-3 border-white/60 shadow-xl"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-3 border-white/60 shadow-xl">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-lg mb-0.5">
                          {counselor.user_details?.full_name || counselor.user?.username || 'Counselor'}
                        </h3>
                        <p className="text-white/90 text-xs font-medium drop-shadow-md mb-1">
                          Professional Career Counselor
                        </p>
                        {counselor.user_details?.is_verified && (
                          <div className="flex items-center justify-end space-x-1 text-white/95 text-xs drop-shadow-md mt-0.5">
                            <CheckCircle className="h-3 w-3" />
                            <span className="font-medium">Verified Professional</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Specialization */}
                  {displaySpecialization && (
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-3 border border-primary-200/50">
                        <h4 className="font-semibold text-primary-600 mb-1 flex items-center space-x-2">
                          <Award className="h-3 w-3" />
                          <span className="text-sm">Specialization</span>
                        </h4>
                        <p className="text-primary-600 text-xs leading-relaxed font-medium">
                          {displaySpecialization}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bio/Description */}
                  {(counselor.bio || counselor.user_details?.bio) && (
                    <div className="mb-4">
                      <p className="text-primary-300 leading-relaxed text-sm">
                        {(counselor.bio || counselor.user_details?.bio).substring(0, 120)}
                        {(counselor.bio || counselor.user_details?.bio).length > 120 && '...'}
                      </p>
                    </div>
                  )}

                  {/* Key Statistics */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-lg p-2 text-center border border-green-200 shadow-md">
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg mx-auto mb-1 shadow-sm">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-xs text-green-700 mb-1 font-medium">
                        Experience
                      </div>
                      <div className="font-bold text-green-700 text-sm">
                        {counselor.experience_years || 0}+ yrs
                      </div>
                    </div>
                    {/* <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg p-2 text-center border border-blue-200 shadow-md">
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg mx-auto mb-1 shadow-sm">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-xs text-blue-700 mb-1 font-medium">
                        Rate
                      </div>
                      <div className="font-bold text-blue-700 text-xs">
                        {counselor.hourly_rate ? `Rs. ${parseFloat(counselor.hourly_rate).toLocaleString()}` : 'Contact'}
                      </div>
                    </div> */}
                  </div>

                  {/* Qualifications */}
                  {counselor.qualifications && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-primary-600 mb-2 flex items-center space-x-2">
                        <GraduationCap className="h-3 w-3" />
                        <span className="text-sm">Qualifications</span>
                      </h4>
                      <p className="text-primary-300 text-sm leading-relaxed">
                        {counselor.qualifications.substring(0, 80)}
                        {counselor.qualifications.length > 80 && '...'}
                      </p>
                    </div>
                  )}

                  {/* Expertise Areas */}
                  {expertiseArray.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-primary-600 mb-2 flex items-center space-x-2">
                        <BookOpen className="h-3 w-3" />
                        <span className="text-sm">Expertise</span>
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {expertiseArray.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-accent-400 to-accent-400 text-primary-600 px-2 py-1 rounded-full text-xs font-medium border border-accent-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {expertiseArray.length > 3 && (
                          <span className="text-primary-300 text-xs px-2 py-1">
                            +{expertiseArray.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  {counselor.user_details?.contact_number && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-primary-300 text-xs">
                        <Phone className="h-3 w-3" />
                        <span>{counselor.user_details.contact_number}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="border-t border-accent-100 pt-3">
                    <div className="flex space-x-2">
                      {/* <button className="flex-1 bg-accent-100 text-primary-600 px-3 py-2 rounded-lg hover:bg-accent-200 transition-all duration-200 font-medium text-xs hover:shadow-md">
                        View Profile
                      </button> */}
                      {counselor.available_for_sessions && (
                        <Link
                          to={`/student/book-counselor-session/${counselor.counsellor_id}`}
                          className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium text-sm hover:shadow-lg text-center"
                        >
                          Book Session
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Why Choose Our Counseling */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
          <h2 className="font-display font-semibold text-3xl text-blue-900 mb-8 text-center">
            Why Choose Our Career Counseling?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-blue-900 mb-3">
                Expert Counselors
              </h3>
              <p className="text-blue-800">
                Experienced professionals with deep industry knowledge and
                proven track records.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-blue-900 mb-3">
                Personalized Guidance
              </h3>
              <p className="text-blue-800">
                Tailored advice based on your unique interests, skills, and
                career aspirations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-blue-900 mb-3">
                Proven Success
              </h3>
              <p className="text-blue-800">
                High success rates with students achieving their educational and
                career goals.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CareerCounseling;
