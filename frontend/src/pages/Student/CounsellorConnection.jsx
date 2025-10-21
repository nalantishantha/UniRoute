import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import CounsellorAvailableSlotBooking from "../../components/CounsellorAvailability/AvailableSlotBooking";
import {
  User,
  Star,
  Award,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  MapPin,
  Briefcase,
  Clock,
} from "lucide-react";

const CounsellorConnection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const counsellor = location.state?.counsellor;

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBookingSuccess = (data) => {
    console.log("Booking successful:", data);
    setIsSubmitted(true);
  };

  if (!counsellor) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary-400 mb-4">
              Counsellor Not Found
            </h2>
            <p className="text-primary-300 mb-6">
              Please go back and select a counsellor to connect with.
            </p>
            <button
              onClick={() => navigate("/student/counseling")}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Back to Counsellors
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl text-blue-900 mb-4">
              Session Request Sent!
            </h2>
            <p className="text-primary-300 text-lg mb-6">
              Your counselling session request has been successfully sent to{" "}
              {counsellor.user_details?.full_name || counsellor.user?.username || 'Counsellor'}.
            </p>
            <p className="text-primary-300 mb-8">
              They will review your request and get back to you soon with
              confirmation details.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/student/counseling")}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Back to Counsellors
              </button>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="bg-accent-200 text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-primary-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Counsellors</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counsellor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden sticky top-8">
              {/* Counsellor Header */}
              <div className="relative h-32 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
                <div className="absolute inset-0 bg-black/15"></div>

                {/* Experience Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/25 backdrop-blur-md rounded-lg px-2 py-1 border border-white/40">
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3 text-yellow-300 fill-current drop-shadow-sm" />
                      <span className="text-white font-semibold text-xs drop-shadow-sm">
                        {counsellor.experience_years || 0}+ years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-green-500/25 text-green-100 border border-green-300/40 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm drop-shadow-sm">
                    Available
                  </span>
                </div>

                {/* Counsellor Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center space-x-3">
                    {counsellor.user_details?.profile_picture ? (
                      <img
                        src={counsellor.user_details.profile_picture}
                        alt={counsellor.user_details?.full_name || counsellor.user?.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/30">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-md">
                        {counsellor.user_details?.full_name || counsellor.user?.username || 'Counsellor'}
                      </h3>
                      <p className="text-white/95 text-xs drop-shadow-sm">
                        Career Counsellor
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Expertise */}
                {counsellor.expertise && (
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-3 border border-blue-200/50">
                      <h4 className="font-semibold text-blue-900 mb-1 flex items-center space-x-2">
                        <Award className="h-3 w-3" />
                        <span className="text-sm">Expertise</span>
                      </h4>
                      <p className="text-blue-800 text-xs leading-relaxed font-medium">
                        {counsellor.expertise}
                      </p>
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {counsellor.specializations && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-primary-300 mb-1">
                      <GraduationCap className="h-3 w-3" />
                      <span className="text-xs font-medium">Specializations</span>
                    </div>
                    <p className="text-primary-400 font-semibold text-sm pl-5">
                      {counsellor.specializations}
                    </p>
                  </div>
                )}

                {/* Qualifications */}
                {counsellor.qualifications && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-primary-300 mb-1">
                      <Briefcase className="h-3 w-3" />
                      <span className="text-xs font-medium">Qualifications</span>
                    </div>
                    <p className="text-primary-400 text-sm pl-5">
                      {counsellor.qualifications}
                    </p>
                  </div>
                )}

                {/* Location */}
                {counsellor.user_details?.location && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-primary-300 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs font-medium">Location</span>
                    </div>
                    <p className="text-primary-400 font-semibold text-sm pl-5">
                      {counsellor.user_details.location}
                    </p>
                  </div>
                )}

                {/* Bio */}
                {counsellor.bio && (
                  <div className="border-t border-accent-100 pt-4">
                    <h4 className="font-semibold text-primary-400 mb-2">About</h4>
                    <p className="text-primary-300 text-sm leading-relaxed">
                      {counsellor.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Connection Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="font-display font-bold text-3xl text-blue-900 mb-2">
                    Book Session with {counsellor.user_details?.full_name || counsellor.user?.username || 'Counsellor'}
                  </h1>
                  <p className="text-blue-800">
                    Choose from available time slots to schedule your counselling session.
                  </p>
                </div>

                <CounsellorAvailableSlotBooking 
                  counsellorId={counsellor.counsellor_id} 
                  counsellorName={counsellor.user_details?.full_name || counsellor.user?.username}
                  onBookingSuccess={handleBookingSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorConnection;
