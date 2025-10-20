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
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-600 mb-2">Find Subject Tutors</h1>
          <p className="text-primary-400 max-w-2xl mx-auto">Get expert help with your A/L subjects from qualified tutors and subject specialists</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-accent-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-600" />
            <input
              type="text"
              placeholder="Search tutors by subject, name, or location..."
              className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
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
            <div key={tutor.tutor_id || tutor.id || tutor.user_id} className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="relative h-36 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                <div className="absolute top-3 right-3">
                  <div className="bg-white/25 backdrop-blur-lg rounded-xl px-3 py-1.5 border border-white/40 shadow-lg">
                    <div className="flex items-center space-x-1.5">
                      <Star className="h-3.5 w-3.5 text-yellow-300 fill-current drop-shadow-md" />
                      <span className="text-white font-bold text-sm drop-shadow-md">{tutor.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-500/30 text-white border border-white/40 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-lg drop-shadow-lg">{tutor.years_experience || tutor.experience} years</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-shrink-0">
                      <img src={tutor.profile_picture || tutor.image || ''} alt={tutor.tutor_name || tutor.name || tutor.full_name || ''} className="w-16 h-16 rounded-full object-cover border-3 border-white/60 shadow-xl" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-lg mb-0.5">{tutor.full_name || tutor.tutor_name || tutor.name || tutor.username}</h3>
                      <p className="text-white/90 text-xs font-medium drop-shadow-md mb-1">Subject Tutor</p>
                      <div className="flex items-center justify-end space-x-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-white/95 drop-shadow-md" />
                        <span className="text-xs text-white/95 font-medium drop-shadow-md">{(tutor.university_info && tutor.university_info.university_name) || tutor.university || 'University of Colombo'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-4">
                <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-3 border border-primary-200/50">
                  <h4 className="font-semibold text-primary-600 text-sm mb-1">Subject Expertise</h4>
                  <p className="text-primary-600 text-xs font-medium">{tutor.expertise}</p>
                </div>
                </div>

                <p className="text-primary-300 text-sm mb-4 leading-relaxed">{tutor.bio || tutor.description}</p>

                <div className="flex items-center justify-between mb-4 text-xs flex-grow">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-primary-600" />
                      <span className="text-primary-300 font-medium">{tutor.students || tutor.count || 5} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-primary-600" />
                      <span className="text-primary-300 font-medium">({tutor.reviews || 25} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-primary-600" />
                    <span className="text-primary-300 text-xs font-medium">{tutor.location || tutor.contact_number || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-primary-600 font-semibold text-sm">{tutor.hourly_rate}/hr</span>
                  </div>
                </div>

                <div className="border-t border-accent-100 pt-3 mt-auto">
                  <button onClick={() => handleBookSession(tutor)} className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm hover:shadow-lg">
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
                <button className="bg-accent-200 text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">Load More Tutors</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindTutors;
