import React, { useState } from "react";
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

  const universities = [
    {
      id: 1,
      name: "University of Colombo",
      type: "National",
      location: "Colombo, Western Province",
      established: 1921,
      studentCount: "12,000+",
      faculties: 16,
      ranking: 1,
      description:
        "The oldest and most prestigious university in Sri Lanka, known for its academic excellence and research contributions.",
      website: "https://www.cmb.ac.lk",
      phone: "+94 11 2581835",
      email: "info@cmb.ac.lk",
      backgroundImage: uocImage,
      programs: [
        "Medicine",
        "Engineering",
        "Science",
        "Arts",
        "Law",
        "Management",
      ],
      facilities: [
        "Central Library",
        "Research Centers",
        "Sports Complex",
        "Student Hostels",
        "Medical Center",
      ],
      achievements: [
        "QS World University Rankings",
        "Research Excellence",
        "Alumni Network",
      ],
      tuitionFee: "Government Funded",
      applicationDeadline: "Applications through UGC",
      rating: 4.8,
    },
    {
      id: 2,
      name: "University of Peradeniya",
      type: "National",
      location: "Peradeniya, Central Province",
      established: 1942,
      studentCount: "15,000+",
      faculties: 9,
      ranking: 2,
      description:
        "One of the largest and most beautiful universities in Sri Lanka, situated in the scenic hill country.",
      website: "https://www.pdn.ac.lk",
      phone: "+94 81 2392751",
      email: "info@pdn.ac.lk",
      backgroundImage: peradeniyaImage,
      programs: [
        "Medicine",
        "Engineering",
        "Science",
        "Arts",
        "Agriculture",
        "Veterinary Medicine",
      ],
      facilities: [
        "Botanical Gardens",
        "Teaching Hospital",
        "Research Labs",
        "Sports Facilities",
        "Cultural Center",
      ],
      achievements: [
        "Research Publications",
        "International Collaborations",
        "Innovation Hub",
      ],
      tuitionFee: "Government Funded",
      applicationDeadline: "Applications through UGC",
      rating: 4.7,
    },
    {
      id: 3,
      name: "University of Moratuwa",
      type: "National",
      location: "Moratuwa, Western Province",
      established: 1978,
      studentCount: "10,000+",
      faculties: 5,
      ranking: 3,
      description:
        "Sri Lanka's premier technological university, specializing in engineering, technology, and architecture.",
      website: "https://www.mrt.ac.lk",
      phone: "+94 11 2640051",
      email: "info@mrt.ac.lk",
      backgroundImage: moratuwaImage,
      programs: [
        "Engineering",
        "Architecture",
        "Information Technology",
        "Business",
      ],
      facilities: [
        "Modern Labs",
        "Technology Incubator",
        "Innovation Center",
        "Industry Partnerships",
      ],
      achievements: [
        "Engineering Excellence",
        "Industry Connections",
        "Innovation Awards",
      ],
      tuitionFee: "Government Funded",
      applicationDeadline: "Applications through UGC",
      rating: 4.9,
    },
    {
      id: 4,
      name: "University of Sri Jayewardenepura",
      type: "National",
      location: "Nugegoda, Western Province",
      established: 1958,
      studentCount: "11,000+",
      faculties: 8,
      ranking: 4,
      description:
        "Known for its strong programs in management, applied sciences, and humanities.",
      website: "https://www.sjp.ac.lk",
      phone: "+94 11 2802026",
      email: "info@sjp.ac.lk",
      backgroundImage: jayewardenepuraImage,
      programs: [
        "Management Studies",
        "Applied Sciences",
        "Humanities",
        "Medical Sciences",
        "Graduate Studies",
      ],
      facilities: [
        "Business Incubator",
        "Research Centers",
        "Library Complex",
        "Sports Facilities",
      ],
      achievements: [
        "Business Education Excellence",
        "Research Contributions",
        "Alumni Success",
      ],
      tuitionFee: "Government Funded",
      applicationDeadline: "Applications through UGC",
      rating: 4.6,
    },
    {
      id: 5,
      name: "SLIIT (Sri Lanka Institute of Information Technology)",
      type: "Private",
      location: "Malabe, Western Province",
      established: 1999,
      studentCount: "8,000+",
      faculties: 6,
      ranking: 5,
      description:
        "Leading private institution specializing in computing, engineering, and business studies.",
      website: "https://www.sliit.lk",
      phone: "+94 11 2413500",
      email: "info@sliit.lk",
      backgroundImage: sliitImage,
      programs: ["Computing", "Engineering", "Business", "Humanities"],
      facilities: [
        "Modern Campus",
        "Tech Labs",
        "Industry Partnerships",
        "Career Services",
      ],
      achievements: [
        "Industry Recognition",
        "Graduate Employment",
        "International Programs",
      ],
      tuitionFee: "Rs. 300,000 - 500,000 per year",
      applicationDeadline: "Rolling Admissions",
      rating: 4.5,
    },
    {
      id: 6,
      name: "NSBM Green University",
      type: "Private",
      location: "Pitipana, Western Province",
      established: 2011,
      studentCount: "6,000+",
      faculties: 5,
      ranking: 6,
      description:
        "South Asia's first green university, offering innovative programs in a sustainable environment.",
      website: "https://www.nsbm.ac.lk",
      phone: "+94 11 5445000",
      email: "info@nsbm.ac.lk",
      backgroundImage: nsbmImage,
      programs: ["Business", "Computing", "Engineering", "Sciences"],
      facilities: [
        "Green Campus",
        "Modern Labs",
        "Innovation Hub",
        "Sustainability Center",
      ],
      achievements: [
        "Green Certification",
        "Innovation Awards",
        "Industry Partnerships",
      ],
      tuitionFee: "Rs. 250,000 - 400,000 per year",
      applicationDeadline: "Multiple Intakes",
      rating: 4.4,
    },
  ];

  const universityTypes = [
    { id: "all", name: "All Universities" },
    { id: "National", name: "National Universities" },
    { id: "Private", name: "Private Universities" },
  ];

  const filteredUniversities = universities
    .filter((uni) => selectedType === "all" || uni.type === selectedType)
    .filter(
      (uni) =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.programs.some((program) =>
          program.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Description */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-blue-900 mb-6">
            University Guide
          </h1>
          <p className="text-xl text-blue-800 max-w-3xl mx-auto">
            Explore Sri Lanka's top universities and find the perfect
            institution for your higher education journey. Compare programs,
            facilities, and opportunities.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-800" />
              <input
                type="text"
                placeholder="Search universities, locations, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="flex space-x-3">
              {universityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedType === type.id
                      ? "bg-blue-600 text-white"
                      : "bg-accent-50 text-blue-900 hover:bg-accent-100"
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
          {filteredUniversities.map((university) => (
            <div
              key={university.id}
              className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* University Header */}
              <div className="relative h-56 bg-gradient-to-l from-primary-700 to-accent-900"
                style={{
                      backgroundImage: `linear-gradient(to left, rgba(91, 138, 214, 0.3), rgba(165, 105, 221, 0.3)), url(${university.backgroundImage})`,
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

              <div className="p-6">
                {/* Description */}
                <div className="mb-6">
                  <p className="text-blue-900 text-2lg leading-relaxed text-sm">
                    {university.description}
                  </p>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
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
                      {university.programs.length}+
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
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Popular Programs</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {university.programs.slice(0, 4).map((program, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-accent-400 to-accent-400 text-blue-900 px-3 py-1.5 rounded-full text-sm font-medium border border-accent-200 hover:shadow-sm transition-shadow"
                      >
                        {program}
                      </span>
                    ))}
                    {university.programs.length > 4 && (
                      <span className="text-blue-800 text-sm px-3 py-1.5">
                        +{university.programs.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Facilities Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Key Facilities</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {university.facilities.slice(0, 4).map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2 text-blue-800">
                        <div className="w-1.5 h-1.5 bg-accent-400 rounded-full"></div>
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial & Application Info */}
                <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 text-blue-800 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="font-medium">Tuition Fee</span>
                      </div>
                      <div className="font-semibold text-blue-900 pl-4">
                        {university.tuitionFee}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-blue-800 mb-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-medium">Application</span>
                      </div>
                      <div className="font-semibold text-blue-900 pl-4">
                        {university.applicationDeadline}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Actions */}
                <div className="border-t border-accent-100 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-4">
                      <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary-300 hover:text-primary-400 transition-colors group"
                      >
                        <div className="p-1.5 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                          <Globe className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Website</span>
                      </a>
                      <button className="flex items-center space-x-2 text-primary-300 hover:text-primary-400 transition-colors group">
                        <div className="p-1.5 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Contact</span>
                      </button>
                      <button className="flex items-center space-x-2 text-primary-300 hover:text-primary-400 transition-colors group">
                        <div className="p-1.5 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Email</span>
                      </button>
                    </div>
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

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-2">
              No Universities Found
            </h3>
            <p className="text-blue-800">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
          <h2 className="font-display font-semibold text-2xl text-blue-900 mb-6 text-center">
            Sri Lankan Higher Education at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">17</div>
              <div className="text-blue-800">National Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                20+
              </div>
              <div className="text-blue-800">Private Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                120,000+
              </div>
              <div className="text-blue-800">University Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                500+
              </div>
              <div className="text-blue-800">Degree Programs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityGuide;
