import React, { useState } from "react";
import { Link } from "react-router-dom";
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
      image: "/api/placeholder/400/250",
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
      image: "/api/placeholder/400/250",
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
      image: "/api/placeholder/400/250",
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
      image: "/api/placeholder/400/250",
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
      image: "/api/placeholder/400/250",
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
      image: "/api/placeholder/400/250",
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
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-400 to-accent-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-5xl mb-6">
            University Guide
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Explore Sri Lanka's top universities and find the perfect
            institution for your higher education journey. Compare programs,
            facilities, and opportunities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
              <input
                type="text"
                placeholder="Search universities, locations, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-accent-100 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>
            <div className="flex space-x-3">
              {universityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedType === type.id
                      ? "bg-primary-400 text-white"
                      : "bg-accent-50 text-primary-400 hover:bg-accent-100"
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
              className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden"
            >
              {/* University Header */}
              <div className="relative h-48 bg-gradient-to-r from-primary-400 to-accent-400">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-white mb-1">
                        {university.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-white/90">
                        <MapPin className="h-4 w-4" />
                        <span>{university.location}</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2">
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
                <p className="text-primary-300 mb-4">
                  {university.description}
                </p>

                {/* University Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-100 rounded-lg mx-auto mb-2">
                      <Calendar className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="text-sm text-primary-300">Established</div>
                    <div className="font-semibold text-primary-400">
                      {university.established}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-100 rounded-lg mx-auto mb-2">
                      <Users className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="text-sm text-primary-300">Students</div>
                    <div className="font-semibold text-primary-400">
                      {university.studentCount}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent-100 rounded-lg mx-auto mb-2">
                      <Building className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="text-sm text-primary-300">Faculties</div>
                    <div className="font-semibold text-primary-400">
                      {university.faculties}
                    </div>
                  </div>
                </div>

                {/* Programs */}
                <div className="mb-6">
                  <h4 className="font-medium text-primary-400 mb-3 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Programs Offered</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {university.programs.map((program, index) => (
                      <span
                        key={index}
                        className="bg-accent-100 text-primary-400 px-3 py-1 rounded-full text-sm"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <div className="text-primary-300 mb-1">Tuition Fee</div>
                    <div className="font-medium text-primary-400">
                      {university.tuitionFee}
                    </div>
                  </div>
                  <div>
                    <div className="text-primary-300 mb-1">Application</div>
                    <div className="font-medium text-primary-400">
                      {university.applicationDeadline}
                    </div>
                  </div>
                </div>

                {/* Contact and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-accent-100">
                  <div className="flex space-x-3">
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary-300 hover:text-primary-400 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                    </a>
                    <div className="flex items-center space-x-1 text-primary-300">
                      <Phone className="h-4 w-4" />
                      <span>Contact</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-accent-100 text-primary-400 px-4 py-2 rounded-lg hover:bg-accent-200 transition-colors">
                      Compare
                    </button>
                    <button className="bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-primary-200 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-2xl text-primary-400 mb-2">
              No Universities Found
            </h3>
            <p className="text-primary-300">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
          <h2 className="font-display font-semibold text-2xl text-primary-400 mb-6 text-center">
            Sri Lankan Higher Education at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">17</div>
              <div className="text-primary-300">National Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">
                20+
              </div>
              <div className="text-primary-300">Private Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">
                120,000+
              </div>
              <div className="text-primary-300">University Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">
                500+
              </div>
              <div className="text-primary-300">Degree Programs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityGuide;
