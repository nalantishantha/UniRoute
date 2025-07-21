import React from "react";
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
  BookOpen,
  DollarSign,
} from "lucide-react";

const FindTutors = () => {
  const navigate = useNavigate();
  
  const tutors = [
    {
      id: 1,
      name: "Chamara Perera",
      title: "A/L Mathematics Tutor",
      company: "Private Tuition Center",
      university: "University of Colombo",
      expertise: "Combined Mathematics",
      location: "Colombo, Sri Lanka",
      experience: "5 years",
      rating: 4.9,
      reviews: 156,
      students: 45,
      hourlyRate: "Rs. 2,000",
      image: "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Experienced A/L Mathematics tutor specializing in Combined Mathematics with proven track record.",
    },
    {
      id: 2,
      name: "Sanduni Fernando",
      title: "Chemistry & Biology Tutor",
      company: "Science Academy",
      university: "University of Peradeniya",
      expertise: "Chemistry & Biology",
      location: "Kandy, Sri Lanka",
      experience: "6 years",
      rating: 4.8,
      reviews: 134,
      students: 38,
      hourlyRate: "Rs. 1,800",
      image: "https://images.pexels.com/photos/6749779/pexels-photo-6749779.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Expert in A/L Chemistry and Biology with focus on practical understanding and exam preparation.",
    },
    {
      id: 3,
      name: "Ruwan Silva",
      title: "Physics Specialist",
      company: "Physics Institute",
      university: "University of Moratuwa",
      expertise: "A/L Physics",
      location: "Moratuwa, Sri Lanka",
      experience: "7 years",
      rating: 4.9,
      reviews: 98,
      students: 29,
      hourlyRate: "Rs. 2,200",
      image: "https://images.pexels.com/photos/6749780/pexels-photo-6749780.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Physics expert helping students master complex concepts with practical applications.",
    },
    {
      id: 4,
      name: "Nirasha Jayasinghe",
      title: "English & Literature Tutor",
      company: "Language Center",
      university: "University of Kelaniya",
      expertise: "English Literature",
      location: "Kelaniya, Sri Lanka",
      experience: "4 years",
      rating: 4.7,
      reviews: 89,
      students: 32,
      hourlyRate: "Rs. 1,500",
      image: "https://images.pexels.com/photos/6749781/pexels-photo-6749781.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Passionate English Literature tutor focusing on critical analysis and essay writing skills.",
    },
    {
      id: 5,
      name: "Kasun Rathnayake",
      title: "Economics & Accounting Tutor",
      company: "Commerce Institute",
      university: "University of Sri Jayewardenepura",
      expertise: "Economics & Accounting",
      location: "Nugegoda, Sri Lanka",
      experience: "5 years",
      rating: 4.8,
      reviews: 112,
      students: 41,
      hourlyRate: "Rs. 1,700",
      image: "https://images.pexels.com/photos/6749782/pexels-photo-6749782.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Commerce stream expert specializing in Economics and Accounting for A/L students.",
    },
    {
      id: 6,
      name: "Malsha Wickramasinghe",
      title: "History & Geography Tutor",
      company: "Arts Education Center",
      university: "University of Ruhuna",
      expertise: "History & Geography",
      location: "Matara, Sri Lanka",
      experience: "6 years",
      rating: 4.6,
      reviews: 76,
      students: 24,
      hourlyRate: "Rs. 1,400",
      image: "https://images.pexels.com/photos/6749783/pexels-photo-6749783.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Arts stream specialist helping students excel in History and Geography subjects.",
    },
  ];

  const handleBookSession = (tutor) => {
    navigate("/student/tutor-booking", { state: { tutor } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-primary-400 mb-4">
            Find Subject Tutors
          </h1>
          <p className="text-xl text-primary-300 max-w-2xl mx-auto">
            Get expert help with your A/L subjects from qualified tutors and subject specialists
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-accent-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
            <input
              type="text"
              placeholder="Search tutors by subject, name, or location..."
              className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
            />
          </div>
        </div>

        {/* Featured Tutors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Tutor Header */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-primary-500">
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2">
                  <div className="bg-white/25 backdrop-blur-md rounded-lg px-2 py-1 border border-white/40">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current" />
                      <span className="text-white font-semibold text-xs drop-shadow-sm">
                        {tutor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500/25 text-green-100 border border-green-300/40 px-2 py-1 rounded-full text-xs font-semibold drop-shadow-sm">
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
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-md">
                          {tutor.name}
                        </h3>
                        <p className="text-white/95 text-sm mb-2 font-semibold drop-shadow-sm">{tutor.title}</p>
                        <div className="flex items-center space-x-1 mb-1">
                          <Briefcase className="h-3 w-3 text-white/90" />
                          <span className="text-xs text-white/90 drop-shadow-sm">{tutor.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-3 w-3 text-white/90" />
                          <span className="text-xs text-white/90 drop-shadow-sm">{tutor.university}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Subject Expertise */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-3">
                    <h4 className="font-semibold text-primary-400 text-sm mb-1">Subject Expertise</h4>
                    <p className="text-primary-300 text-xs">{tutor.expertise}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-primary-300 text-xs mb-4 leading-relaxed">
                  {tutor.description}
                </p>

                {/* Stats and Rate */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-primary-300" />
                      <span className="text-primary-300">{tutor.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-accent-400" />
                      <span className="text-primary-300">({tutor.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3 text-primary-300" />
                    <span className="text-primary-400 font-semibold text-xs">{tutor.hourlyRate}/hr</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 mb-4">
                  <MapPin className="h-3 w-3 text-primary-300" />
                  <span className="text-primary-300 text-xs">{tutor.location}</span>
                </div>

                {/* Book Session Button */}
                <div className="border-t border-accent-100 pt-3">
                  <button 
                    onClick={() => handleBookSession(tutor)}
                    className="w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm hover:shadow-lg"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Book Session</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-accent-200 text-primary-400 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
            Load More Tutors
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindTutors;
