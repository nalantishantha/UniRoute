import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  Search,
  Star,
  MapPin,
  Users,
  MessageCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const FindMentors = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch mentors from API
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/students/mentors/");
      const data = await response.json();

      if (data.success) {
        setMentors(data.mentors);
      } else {
        console.error("Error fetching mentors:", data.message);
        // Fallback to empty array if API fails
        setMentors([]);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      // Fallback to empty array if API fails
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // Filter mentors based on search term
  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConnect = (mentor) => {
    navigate("/student/mentor-connection", { state: { mentor } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-600 mb-2">
            Connect with University Student Mentors
          </h1>
          <p className="text-primary-400 max-w-2xl mx-auto">
            Get guidance from current university students who can share their
            real experiences and help you choose the right programs after your
            A/L results
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-accent-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-600" />
            <input
              type="text"
              placeholder="Search mentors by field, university, or program expertise..."
              className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
            <p className="mt-4 text-primary-300">Loading mentors...</p>
          </div>
        ) : (
          <>
            {/* Featured Mentors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                  >
                    {/* Mentor Header */}
                    <div className="relative h-36 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/25 backdrop-blur-lg rounded-xl px-3 py-1.5 border border-white/40 shadow-lg">
                          <div className="flex items-center space-x-1.5">
                            <Star className="h-3.5 w-3.5 text-yellow-300 fill-current drop-shadow-md" />
                            <span className="text-white font-bold text-sm drop-shadow-md">
                              {mentor.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* duration Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-emerald-500/30 text-white border border-white/40 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-lg drop-shadow-lg">
                          {mentor.duration}
                        </span>
                      </div>

                      {/* Mentor Info */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-between space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={mentor.image}
                              alt={mentor.name}
                              className="w-16 h-16 rounded-full object-cover border-3 border-white/60 shadow-xl"
                            />
                          </div>
                          <div className="flex-1 text-right">
                            <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-lg mb-0.5">
                              {mentor.name}
                            </h3>
                            <p className="text-white/90 text-xs font-medium drop-shadow-md mb-1">
                              University Student Mentor
                            </p>
                            <div className="flex items-center justify-end space-x-1.5">
                              <GraduationCap className="h-3.5 w-3.5 text-white/95 drop-shadow-md" />
                              <span className="text-xs text-white/95 font-medium drop-shadow-md">
                                {mentor.university}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      {/* degree */}
                      <div className="mb-4">
                        <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-3 border border-primary-200/50">
                          <h4 className="font-semibold text-primary-600 text-sm mb-1">
                            Degree Program
                          </h4>
                          <p className="text-primary-600 text-xs font-medium">
                            {mentor.degree}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-primary-300 text-sm mb-4 leading-relaxed">
                        {mentor.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 text-xs flex-grow">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-primary-600" />
                            <span className="text-primary-300 font-medium">
                              {mentor.students} students
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-primary-600" />
                            <span className="text-primary-300 font-medium">
                              ({mentor.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-primary-600" />
                          <span className="text-primary-300 text-xs font-medium">
                            {mentor.location}
                          </span>
                        </div>
                      </div>

                      {/* Connect Button */}
                      <div className="border-t border-accent-100 pt-3 mt-auto">
                        <button
                          onClick={() => handleConnect(mentor)}
                          className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm hover:shadow-lg"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Connect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-primary-300 text-lg">
                    No mentors found matching your search criteria.
                  </p>
                  <p className="text-primary-300 text-sm mt-2">
                    Try adjusting your search terms or check back later for new
                    mentors.
                  </p>
                </div>
              )}
            </div>

            {/* Load More */}
            {filteredMentors.length > 0 && (
              <div className="text-center">
                <button className="bg-accent-200 text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
                  Load More Mentors
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindMentors;
