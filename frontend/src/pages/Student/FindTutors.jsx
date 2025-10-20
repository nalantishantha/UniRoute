import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  Search,
  Star,
  MapPin,
  Users,
  Briefcase,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const FindTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/tutoring/tutors/');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load tutors');
        if (mounted) setTutors(data.tutors || []);
      } catch (err) {
        console.error('Failed to fetch tutors', err);
        if (mounted) setError(err.message || 'Failed to load tutors');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTutors();
    return () => { mounted = false };
  }, []);

  const handleBookSession = (tutor) => {
    // Normalize tutor object to match expected structure in TutorBooking page
    const normalizedTutor = {
      tutor_id: tutor.tutor_id,
      id: tutor.tutor_id, // For backward compatibility
      name: tutor.full_name || tutor.tutor_name || tutor.username,
      full_name: tutor.full_name || tutor.username,
      username: tutor.username,
      image: tutor.profile_picture || '',
      title: tutor.bio || '',
      university: tutor.university || '',
      location: tutor.location || '',
      hourlyRate: tutor.hourly_rate,
      expertise: tutor.expertise || '',
      description: tutor.bio || tutor.expertise || '',
      rating: tutor.rating || 0,
      experience: tutor.years_experience || '2+ years',
      students: tutor.students || tutor.count || 0,
      reviews: tutor.reviews || 0,
    };
    
    navigate("/student/tutor-booking", { state: { tutor: normalizedTutor } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-blue-900 mb-4">Find Subject Tutors</h1>
          <p className="text-xl text-blue-800 max-w-2xl mx-auto">Get expert help with your A/L subjects from qualified tutors and subject specialists</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-accent-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-800" />
            <input
              type="text"
              placeholder="Search tutors by subject, name, or location..."
              className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 col-span-full">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
            <p className="mt-4 text-primary-300">Loading tutors...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {error && <div className="col-span-3 text-center py-8 text-red-600">{error}</div>}
              {(!error && tutors.length === 0) && (
                <div className="col-span-3 text-center py-8">No tutors found.</div>
              )}

              {(!error && tutors.length > 0) && tutors
                .filter((t) => {
                  const term = searchTerm.toLowerCase();
                  const name = (t.tutor_name || t.name || t.full_name || "").toLowerCase();
                  const expertise = (t.expertise || t.description || "").toLowerCase();
                  const location = (t.location || "").toLowerCase();
                  return (
                    name.includes(term) ||
                    expertise.includes(term) ||
                    location.includes(term)
                    );
                })
                .map((tutor) => (
            <div key={tutor.tutor_id || tutor.id || tutor.user_id} className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-primary-500">
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="absolute top-2 right-2">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current drop-shadow-sm" />
                      <span className="text-white font-semibold text-xs drop-shadow-sm">{tutor.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 left-2">
                  <span className="bg-green-500/25 text-green-100 border border-green-300/40 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm drop-shadow-sm">{tutor.years_experience || tutor.experience} years</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={tutor.profile_picture || tutor.image || ''} alt={tutor.tutor_name || tutor.name || tutor.full_name || ''} className="w-12 h-12 rounded-full object-cover border-2 border-white/40 shadow-lg" />
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg text-white leading-tight drop-shadow-md">{tutor.full_name || tutor.tutor_name || tutor.name || tutor.username}</h3>
                        {/* <p className="text-white/95 text-sm mb-1 drop-shadow-sm">{tutor.bio || tutor.title || ''}</p> */}
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-3 w-3 text-white/90 drop-shadow-sm" />
                          <span className="text-xs text-white/90 drop-shadow-sm">{(tutor.university_info && tutor.university_info.university_name) || tutor.university || 'University of Colombo'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-3 border border-blue-200/50">
                    <h4 className="font-semibold text-blue-800 text-sm mb-1">Subject Expertise</h4>
                    <p className="text-blue-900 text-2xs font-bold">{tutor.expertise}</p>
                  </div>
                </div>

                <p className="text-blue-900 text-2xs font-semibold mb-4 leading-relaxed">{tutor.bio || tutor.description}</p>

                <div className="flex items-center justify-between mb-4 text-xs flex-grow">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-blue-700" />
                      <span className="text-blue-700 font-medium">{tutor.students || tutor.count || 5} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-700 font-medium">({tutor.reviews || 25} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-blue-700" />
                    <span className="text-blue-700 text-xs font-medium">{tutor.location || tutor.contact_number || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-primary-900 font-semibold text-xs">{tutor.hourly_rate}/hr</span>
                  </div>
                </div>

                <div className="border-t border-accent-100 pt-3 mt-auto">
                  <button onClick={() => handleBookSession(tutor)} className="w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm hover:shadow-lg">
                    <BookOpen className="h-4 w-4" />
                    <span>Book Session</span>
                  </button>
                </div>
              </div>
            </div>
              ))}
            </div>

            {tutors.length > 0 && (
              <div className="text-center mt-8">
                <button className="bg-accent-200 text-blue-900 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">Load More Tutors</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindTutors;
