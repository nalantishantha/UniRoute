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
} from "lucide-react";

const FindMentors = () => {
  const navigate = useNavigate();
  
  const mentors = [
    {
      id: 1,
      name: "Kasun Bandara",
      title: "3rd Year Computer Science Student",
      company: "University of Colombo",
      university: "University of Colombo",
      expertise: "Computer Science & Engineering",
      location: "Colombo, Sri Lanka",
      experience: "3 years",
      rating: 4.9,
      reviews: 45,
      students: 12,
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Helps A/L students understand CS program requirements and shares real university experience insights.",
    },
    {
      id: 2,
      name: "Nimesha Silva",
      title: "4th Year Business Management Student",
      company: "University of Peradeniya",
      university: "University of Peradeniya",
      expertise: "Business & Management",
      location: "Kandy, Sri Lanka",
      experience: "4 years",
      rating: 4.8,
      reviews: 38,
      students: 15,
      image: "https://images.pexels.com/photos/5212346/pexels-photo-5212346.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Guides students in business program selection and shares practical university life experiences.",
    },
    {
      id: 3,
      name: "Dineth Fernando",
      title: "Final Year Engineering Student",
      company: "University of Moratuwa",
      university: "University of Moratuwa",
      expertise: "Mechanical Engineering",
      location: "Moratuwa, Sri Lanka",
      experience: "4 years",
      rating: 4.7,
      reviews: 29,
      students: 8,
      image: "https://images.pexels.com/photos/5212347/pexels-photo-5212347.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Specializes in helping students understand engineering program requirements and career paths.",
    },
    {
      id: 4,
      name: "Sachini Rajapakse",
      title: "3rd Year Information Technology Student",
      company: "SLIIT",
      university: "SLIIT",
      expertise: "Information Technology",
      location: "Malabe, Sri Lanka",
      experience: "3 years",
      rating: 4.9,
      reviews: 52,
      students: 18,
      image: "https://images.pexels.com/photos/5212348/pexels-photo-5212348.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Mentors students on IT program choices and shares insights about private university education.",
    },
    {
      id: 5,
      name: "Amali Jayasinghe",
      title: "4th Year Statistics Student",
      company: "University of Sri Jayewardenepura",
      university: "University of Sri Jayewardenepura",
      expertise: "Statistics & Data Science",
      location: "Nugegoda, Sri Lanka",
      experience: "4 years",
      rating: 4.8,
      reviews: 34,
      students: 10,
      image: "https://images.pexels.com/photos/5212349/pexels-photo-5212349.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Guides students in selecting statistics and data science programs with real university insights.",
    },
    {
      id: 6,
      name: "Tharindu Rathnayake",
      title: "3rd Year Media & Design Student",
      company: "NSBM Green University",
      university: "NSBM Green University",
      expertise: "Media & Creative Design",
      location: "Homagama, Sri Lanka",
      experience: "3 years",
      rating: 4.9,
      reviews: 41,
      students: 14,
      image: "https://images.pexels.com/photos/5212350/pexels-photo-5212350.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Helps students choose design and creative programs based on current industry trends and university experience.",
    },
  ];

  const handleConnect = (mentor) => {
    navigate("/student/mentor-connection", { state: { mentor } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-blue-900 mb-4 drop-shadow-md">
            Connect with University Student Mentors
          </h1>
          <p className="text-xl text-blue-800 max-w-2xl mx-auto">
            Get guidance from current university students who can share their real experiences and help you choose the right programs after your A/L results
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-accent-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
            <input
              type="text"
              placeholder="Search mentors by field, university, or program expertise..."
              className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-blue-900 placeholder-blue-600"
            />
          </div>
        </div>

        {/* Featured Mentors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-2xl shadow-lg border border-accent-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Mentor Header */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-primary-500">
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2">
                  <div className="bg-white/25 backdrop-blur-md rounded-lg px-2 py-1 border border-white/40">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current drop-shadow-sm" />
                      <span className="text-white font-semibold text-xs drop-shadow-sm">
                        {mentor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500/25 text-green-100 border border-green-300/40 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm drop-shadow-sm">
                    {mentor.experience}
                  </span>
                </div>

                {/* Mentor Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/40 shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg text-white leading-tight drop-shadow-md">
                          {mentor.name}
                        </h3>
                        <p className="text-white/95 text-sm mb-1 drop-shadow-sm">{mentor.title}</p>
                        <div className="flex items-center space-x-1 mb-1">
                          <Briefcase className="h-3 w-3 text-white/90 drop-shadow-sm" />
                          <span className="text-xs text-white/90 drop-shadow-sm">{mentor.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-3 w-3 text-white/90 drop-shadow-sm" />
                          <span className="text-xs text-white/90 drop-shadow-sm">{mentor.university}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">

                {/* Expertise */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-3 border border-blue-200/50">
                    <h4 className="font-semibold text-blue-800 text-sm mb-1">Expertise</h4>
                    <p className="text-blue-900 text-2xs font-bold">{mentor.expertise}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-blue-900 text-2xs font-semibold mb-4 leading-relaxed">
                  {mentor.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-blue-700" />
                      <span className="text-blue-700 font-medium">{mentor.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-700 font-medium">({mentor.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-blue-700" />
                    <span className="text-blue-700 text-xs font-medium">{mentor.location}</span>
                  </div>
                </div>

                {/* Connect Button */}
                <div className="border-t border-accent-100 pt-3">
                  <button 
                    onClick={() => handleConnect(mentor)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-accent-200 text-blue-900 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
            Load More Mentors
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMentors;
