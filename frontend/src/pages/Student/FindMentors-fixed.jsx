import React from "react";
import { useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/StudentNavigation";
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
      name: "Dr. Saman Perera",
      title: "Senior Software Engineer",
      company: "Google",
      university: "University of Colombo",
      expertise: "Machine Learning & AI",
      location: "California, USA",
      experience: "8 years",
      rating: 4.9,
      reviews: 234,
      students: 45,
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Passionate about helping students break into tech with a focus on machine learning and artificial intelligence.",
    },
    {
      id: 2,
      name: "Ms. Kamani Silva",
      title: "Product Manager",
      company: "Microsoft",
      university: "University of Peradeniya",
      expertise: "Product Strategy & Management",
      location: "Seattle, USA",
      experience: "6 years",
      rating: 4.8,
      reviews: 189,
      students: 32,
      image: "https://images.pexels.com/photos/5212346/pexels-photo-5212346.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Expert in product development lifecycle with experience in launching successful tech products.",
    },
    {
      id: 3,
      name: "Mr. Ruwan Fernando",
      title: "Investment Banker",
      company: "Goldman Sachs",
      university: "University of Moratuwa",
      expertise: "Finance & Investment Banking",
      location: "New York, USA",
      experience: "10 years",
      rating: 4.7,
      reviews: 156,
      students: 28,
      image: "https://images.pexels.com/photos/5212347/pexels-photo-5212347.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Helping students navigate the complex world of finance and investment banking careers.",
    },
    {
      id: 4,
      name: "Dr. Niluka Rajapakse",
      title: "Startup Founder & CEO",
      company: "TechStart Lanka",
      university: "SLIIT",
      expertise: "Entrepreneurship & Startups",
      location: "Colombo, Sri Lanka",
      experience: "12 years",
      rating: 4.9,
      reviews: 201,
      students: 38,
      image: "https://images.pexels.com/photos/5212348/pexels-photo-5212348.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Serial entrepreneur with multiple successful startups in fintech and edtech sectors.",
    },
    {
      id: 5,
      name: "Dr. Priya Jayasinghe",
      title: "Data Science Lead",
      company: "Amazon",
      university: "University of Sri Jayewardenepura",
      expertise: "Data Science & Analytics",
      location: "London, UK",
      experience: "7 years",
      rating: 4.8,
      reviews: 167,
      students: 21,
      image: "https://images.pexels.com/photos/5212349/pexels-photo-5212349.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Data science expert helping students understand the power of data-driven decision making.",
    },
    {
      id: 6,
      name: "Mr. Tharaka Rathnayake",
      title: "UX Design Director",
      company: "Adobe",
      university: "NSBM Green University",
      expertise: "UX/UI Design & Research",
      location: "San Francisco, USA",
      experience: "9 years",
      rating: 4.9,
      reviews: 143,
      students: 27,
      image: "https://images.pexels.com/photos/5212350/pexels-photo-5212350.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      description: "Award-winning UX designer passionate about creating meaningful digital experiences.",
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
          <h1 className="font-display font-bold text-5xl text-primary-400 mb-4">
            Find Mentors
          </h1>
          <p className="text-xl text-primary-300 max-w-2xl mx-auto">
            Connect with experienced professionals and university graduates who
            can guide your career path
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-accent-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
            <input
              type="text"
              placeholder="Search for mentors by name, field, or university..."
              className="w-full pl-10 pr-4 py-3 border border-accent-100 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
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
              <div className="relative h-24 bg-gradient-to-r from-primary-400 to-accent-400">
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current" />
                      <span className="text-white font-semibold text-xs">
                        {mentor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500/20 text-green-100 border border-green-300/30 px-2 py-1 rounded-full text-xs font-semibold">
                    {mentor.experience}
                  </span>
                </div>
              

              <div className="p-4">
                {/* Mentor Info */}
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg text-primary-400 leading-tight">
                      {mentor.name}
                    </h3>
                    <p className="text-primary-300 text-sm mb-1">{mentor.title}</p>
                    <div className="flex items-center space-x-1 mb-1">
                      <Briefcase className="h-3 w-3 text-accent-400" />
                      <span className="text-xs text-primary-300">{mentor.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="h-3 w-3 text-accent-400" />
                      <span className="text-xs text-primary-300">{mentor.university}</span>
                    </div>
                  </div>
                </div>
              </div>
        
                {/* Expertise */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-primary-50 rounded-lg p-3">
                    <h4 className="font-semibold text-primary-400 text-sm mb-1">Expertise</h4>
                    <p className="text-primary-300 text-xs">{mentor.expertise}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-primary-300 text-xs mb-4 leading-relaxed">
                  {mentor.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-primary-300" />
                      <span className="text-primary-300">{mentor.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-accent-400" />
                      <span className="text-primary-300">({mentor.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-primary-300" />
                    <span className="text-primary-300 text-xs">{mentor.location}</span>
                  </div>
                </div>

                {/* Connect Button */}
                <div className="border-t border-accent-100 pt-3">
                  <button 
                    onClick={() => handleConnect(mentor)}
                    className="w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm hover:shadow-lg"
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
          <button className="bg-accent-200 text-primary-400 px-8 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-colors">
            Load More Mentors
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMentors;
