import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import TutoringSlotBooking from "../../components/TutoringAvailability/TutoringSlotBooking";
import { ArrowLeft, CheckCircle, AlertCircle, Star, Award, MapPin, Users } from "lucide-react";

const TutorBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tutor = location.state?.tutor;

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-primary-600 mb-2">Tutor Information Missing</h2>
            <p className="text-primary-300 mb-6">No tutor information was found. Please go back and select a tutor.</p>
            <button onClick={() => navigate("/student/tutors")} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">Back to Tutors</button>
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
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent-100">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="font-display font-bold text-2xl text-primary-600 mb-2">Session Booking Sent!</h2>
              <p className="text-primary-300 mb-6">Your tutoring session request has been sent to {tutor.name}. They will review your request and confirm the session details within 24 hours.</p>
              <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-primary-600 mb-2">What happens next?</h3>
                <ul className="text-sm text-primary-300 space-y-1">
                  <li>• {tutor.name} will receive your session booking request</li>
                  <li>• They'll review your learning goals and subject needs</li>
                  <li>• You'll receive a confirmation email with session details</li>
                  <li>• Payment instructions will be provided upon confirmation</li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => navigate("/student/tutors")} className="flex-1 bg-accent-200 text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-accent-300 transition-colors">Browse More Tutors</button>
                <button onClick={() => navigate("/student/dashboard")} className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">Go to Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      {/* Navigation */}
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tutors</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tutor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden sticky top-8">
              {/* Tutor Header with Gradient */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-primary-500">
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current" />
                      <span className="text-white font-semibold text-xs">
                        {tutor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500/20 text-green-100 border border-green-300/30 px-2 py-1 rounded-full text-xs font-semibold">
                    {tutor.experience}
                  </span>
                </div>

                {/* Tutor Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={tutor.image}
                        alt={tutor.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-2lg text-white leading-tight">
                          {tutor.name}
                        </h3>
                        <p className="text-white/90 text-sm mb-1">{tutor.title}</p>
                        <div className="flex items-center space-x-1 mb-1">
                          <Award className="h-3 w-3 text-white/80" />
                          <span className="text-xs text-white/80">{tutor.university}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-white/80" />
                          <span className="text-xs text-white/80">{tutor.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{tutor.hourlyRate}</p>
                      <p className="text-white/80 text-xs">per hour</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Expertise */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-3 border border-primary-200/50">
                    <h4 className="font-semibold text-primary-600 text-sm mb-1">Expertise</h4>
                    <p className="text-primary-600 text-xs font-medium">{tutor.expertise}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-primary-300 text-sm mb-4 leading-relaxed">
                  {tutor.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-primary-600" />
                      <span className="text-primary-300">{tutor.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-primary-600" />
                      <span className="text-primary-300">({tutor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-accent-100">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="font-display font-bold text-2xl text-primary-600 mb-2">
                    Book Session with {tutor.name}
                  </h1>
                  <p className="text-primary-300">
                    Fill out this form to book a tutoring session. Provide details about your learning needs 
                    and goals to help your tutor prepare the best session for you.
                  </p>
                </div>

                {/* Use recurring tutoring slot booking */}
                <TutoringSlotBooking 
                  tutorId={tutor.tutor_id} 
                  tutorName={tutor.full_name || tutor.tutor_name || tutor.name || tutor.username} 
                  onBookingSuccess={() => setIsSubmitted(true)} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorBooking;
