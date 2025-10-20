import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import uocImage from "../../assets/uoc.jpg"; // University of Colombo
import peradeniyaImage from "../../assets/uop.jpg"; // University of Peradeniya - you can replace with actual image
import moratuwaImage from "../../assets/uom.jpg"; // University of Moratuwa - you can replace with actual image
import jayewardenepuraImage from "../../assets/uosj.jpg"; // University of Sri Jayewardenepura - you can replace with actual image
import sliitImage from "../../assets/SLIIT.jpg"; // SLIIT - you can replace with actual image
import nsbmImage from "../../assets/NSBM.jpg"; // NSBM - you can replace with actual image
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  Search,
  MapPin,
  Users,
  Calendar,
  Award,
  BookOpen,
  Building,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Star,
  TrendingUp,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const UniversityGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programsModal, setProgramsModal] = useState({ open: false, programs: [], universityName: '' });
  const [quickStats, setQuickStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Normalize program / title strings to Title Case (e.g. "INFORMATION COMMUNICATION TECHNOLOGY" -> "Information Communication Technology")
  const normalizeTitle = (input) => {
    if (!input && input !== 0) return input;
    const s = String(input).trim();
    if (!s) return s;
    // lowercase everything then uppercase first letter of each word (also handle hyphenated words)
    return s
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((word) => word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-'))
      .join(' ');
  };

  // We'll fetch universities from backend (detailed endpoint)
  useEffect(() => {
    let mounted = true;
    fetch('/api/universities/detailed/')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const list = data.results || data.results || [];
        // determine type heuristically: if the website contains 'ac.lk' or ugc_ranking exists assume National, otherwise Private
        const enriched = list.map((u) => ({
          id: u.university_id || u.id,
          name: u.name,
          type: u.ugc_ranking ? 'National' : 'Private',
          location: u.location || '',
          established: u.established_year || u.established || null,
          studentCount: u.student_count || '',
          faculties: u.faculties_count || 0,
          ranking: u.ugc_ranking || u.ranking || null,
          description: u.description || '',
          website: u.website,
          phone: u.phone_number,
          email: u.contact_email,
          backgroundImage: u.logo || '',
          programs: (u.degree_programs || []).map((p) => {
            // p may be a string or an object with title
            if (p && typeof p === 'object') {
              return { ...p, title: normalizeTitle(p.title || '') };
            }
            return normalizeTitle(p || '');
          }),
          facilities: u.facilities || [],
          tuitionFee: u.tuition_fee || '',
          applicationDeadline: u.application_deadline || '',
          rating: u.rating || (u.ugc_ranking ? 4.5 : 4.0),
          degree_programs_count: u.degree_programs_count || 0,
        }));
        setUniversities(enriched);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching universities', err);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);
  
  useEffect(() => {
    let mounted = true;
    setLoadingStats(true);
    fetch('/api/universities/quick-stats/')
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        if (data?.success && data.stats) {
          setQuickStats(data.stats);
        } else {
          setQuickStats(null);
        }
      })
      .catch(err => {
        console.error('Failed to fetch quick stats', err);
        setQuickStats(null);
      })
      .finally(() => {
        if (mounted) setLoadingStats(false);
      });

    return () => { mounted = false };
  }, []);

  const universityTypes = [
    { id: "all", name: "All Universities" },
    { id: "National", name: "National Universities" },
    { id: "Private", name: "Private Universities" },
  ];

  const filteredUniversities = (loading ? [] : universities)
    .filter((uni) => selectedType === "all" || uni.type === selectedType)
    .filter((uni) => {
      const q = searchTerm.toLowerCase();
      if (!q) return true;
      const inPrograms = (uni.programs || []).some((p) => (p.title || p).toString().toLowerCase().includes(q));
      return (
        (uni.name || '').toLowerCase().includes(q) ||
        (uni.location || '').toLowerCase().includes(q) ||
        inPrograms
      );
    });

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      {/* Navigation */}
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Description */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-600 mb-2">
            University Guide
          </h1>
          <p className="text-primary-400 max-w-3xl mx-auto">
            Explore Sri Lanka's top universities and find the perfect
            institution for your higher education journey. Compare programs,
            facilities, and opportunities.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-600" />
              <input
                type="text"
                placeholder="Search universities, locations, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              />
            </div>
            <div className="flex space-x-3">
              {universityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedType === type.id
                      ? "bg-primary-600 text-white"
                      : "bg-accent-50 text-primary-600 hover:bg-accent-100"
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
              <p className="mt-4 text-primary-300">Loading universities...</p>
            </div>
          ) : null}
          {filteredUniversities.map((university) => (
            <div
              key={university.id}
              className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* University Header */}
              <div className="relative h-56 bg-gradient-to-l from-primary-700 to-accent-900 rounded-t-2xl overflow-hidden"
                style={{
                      backgroundImage: `linear-gradient(to left, rgba(91, 138, 214, 0.3), rgba(165, 105, 221, 0.3)), url(${university.backgroundImage || ''})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* University Type Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    university.type === 'National' 
                      ? 'bg-green-500/20 text-green-100 border border-green-300/30' 
                      : 'bg-blue-500/20 text-blue-100 border border-blue-300/30'
                  }`}>
                    {university.type} University
                  </span>
                </div>

                {/* Ranking Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-yellow-300" />
                      <span className="text-white font-semibold text-sm">
                        #{university.ranking}
                      </span>
                    </div>
                  </div>
                </div>

                {/* University Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-2xl text-white mb-2 leading-tight">
                        {university.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-white/90 mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{university.location}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-white/80 text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Est. {university.established}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{university.studentCount}</span>
                        </div>
                      </div>
                    </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-300 fill-current" />
                        <span className="text-white font-semibold">
                          {university.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                {/* Description */}
                <div className="mb-4">
                  <p className="text-primary-300 leading-relaxed text-sm">
                    {university.description}
                  </p>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg p-3 text-center border border-purple-200 shadow-md">
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg mx-auto mb-2 shadow-sm">
                      <Building className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-xs text-purple-700 mb-1 font-medium">Faculties</div>
                    <div className="font-bold text-purple-700 text-lg">
                      {university.faculties}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg p-3 text-center border border-blue-200 shadow-md">
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg mx-auto mb-2 shadow-sm">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-xs text-blue-700 mb-1 font-medium">Programs</div>
                    <div className="font-bold text-blue-700 text-lg">
                      {(university.degree_programs_count || (university.programs && university.programs.length))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-lg p-3 text-center border border-green-200 shadow-md">
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg mx-auto mb-2 shadow-sm">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-xs text-green-700 mb-1 font-medium">Ranking</div>
                    <div className="font-bold text-green-700 text-lg">
                      #{university.ranking}
                    </div>
                  </div>
                </div>

                {/* Programs Section */}
                <div className="mb-4">
                  <h4 className="font-semibold text-primary-600 mb-2 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Popular Programs</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(university.programs || university.degree_programs || []).slice(0, 4).map((program, index) => {
                      const title = program.title || program;
                      return (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-accent-400 to-accent-400 text-primary-600 px-3 py-1.5 rounded-full text-sm font-medium border border-accent-200 hover:shadow-sm transition-shadow"
                        >
                          {title}
                        </span>
                      );
                    })}
                    {(university.degree_programs_count || (university.programs && university.programs.length) || 0) > 4 && (
                      <button
                        onClick={() => setProgramsModal({ open: true, programs: university.programs || university.degree_programs || [], universityName: university.name })}
                        className="text-primary-600 text-sm px-3 py-1.5 underline"
                      >
                        View all ({university.degree_programs_count || (university.programs && university.programs.length)})
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact & Actions */}
                <div className="border-t border-accent-100 pt-3 mt-auto">
                  <div className="flex items-center space-x-4">
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 text-primary-300 hover:text-primary-400 transition-colors group"
                      aria-label={`Visit website of ${university.name}`}
                    >
                      <div className="p-1.5 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                        <Globe className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Website</span>
                    </a>
                    <a href={`tel:${university.phone}`} className="flex items-center space-x-1.5 text-primary-300 hover:text-primary-400 transition-colors group" aria-label={`Call ${university.name}`}>
                      <div className="p-1.5 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Contact</span>
                    </a>
                    <a href={`mailto:${university.email}`} className="flex items-center space-x-1.5 text-primary-300 hover:text-primary-400 transition-colors group" aria-label={`Email ${university.name}`}>
                      <div className="p-1.5 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Email</span>
                    </a>
                  </div>
                  
                  {/* <div className="flex space-x-3">
                    <button className="flex-1 bg-accent-100 text-primary-400 px-4 py-3 rounded-lg hover:bg-accent-200 transition-all duration-200 font-medium text-sm hover:shadow-md">
                      Compare Universities
                    </button>
                    <button className="flex-1 bg-blue-400 from-primary-400 to-accent-400 text-white px-4 py-3 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 font-medium text-sm hover:shadow-lg">
                      View Details
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-primary-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl text-primary-600 mb-2">
              No Universities Found
            </h3>
            <p className="text-primary-300">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
          <h2 className="font-display font-semibold text-xl text-primary-600 mb-6 text-center">
            Sri Lankan Higher Education at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{loadingStats ? '—' : (quickStats?.universities_count ?? 0)}</div>
              <div className="text-primary-300">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{loadingStats ? '—' : (quickStats?.faculties_count ?? 0)}</div>
              <div className="text-primary-300">Faculties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{loadingStats ? '—' : (quickStats?.students_count ?? 0).toLocaleString()}</div>
              <div className="text-primary-300">University Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{loadingStats ? '—' : (quickStats?.degree_programs_count ?? 0)}</div>
              <div className="text-primary-300">Degree Programs</div>
            </div>
          </div>
        </div>
      </div>
      {/* Programs Modal */}
      {programsModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Degree Programs @ {programsModal.universityName}</h3>
              <button onClick={() => setProgramsModal({ open: false, programs: [], universityName: '' })} className="text-sm text-gray-600">Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-auto">
              {(programsModal.programs || []).map((p, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium">{p.title || p}</div>
                  {p.code && <div className="text-xs text-gray-500">Code: {p.code}</div>}
                  {p.description && <div className="text-sm text-gray-700 mt-1">{p.description}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityGuide;
