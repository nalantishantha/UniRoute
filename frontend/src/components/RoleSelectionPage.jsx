import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowLeft, 
  Users, 
  University, 
  Building2, 
  UserCheck,
  ArrowRight 
} from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'student',
      title: 'Student',
      description: 'Looking for university programs and guidance',
      icon: GraduationCap,
      path: '/register/student',
      color: 'from-[#1D5D9B] to-[#174A7C]',
      bgColor: 'bg-[#E7F3FB]'
    },
    {
      id: 'university-student',
      title: 'University Student',
      description: 'Currently enrolled in a university program',
      icon: UserCheck,
      path: '/register/university-student',
      color: 'from-[#2E7D32] to-[#1B5E20]',
      bgColor: 'bg-[#E8F5E8]'
    },
    {
      id: 'university',
      title: 'University',
      description: 'Educational institution looking to showcase programs',
      icon: University,
      path: '/register/university',
      color: 'from-[#7B1FA2] to-[#4A148C]',
      bgColor: 'bg-[#F3E5F5]'
    },
    {
      id: 'company',
      title: 'Company',
      description: 'Business offering internships and career opportunities',
      icon: Building2,
      path: '/register/company',
      color: 'from-[#F57C00] to-[#E65100]',
      bgColor: 'bg-[#FFF3E0]'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F3FB] to-[#C1DBF4] flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#C1DBF4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-[#1D5D9B] hover:text-[#174A7C] transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-[#1D5D9B]" />
              <span className="font-bold text-2xl text-[#1D5D9B]">UniRoute</span>
            </div>
            
            <div className="text-sm text-[#717171]">
              <span>Already have an account? </span>
              <Link to="/login" className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="bg-[#E7F3FB] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-[#1D5D9B]" />
            </div>
            <h1 className="font-bold text-4xl text-[#263238] mb-4">
              Who are you?
            </h1>
            <p className="text-xl text-[#717171] max-w-2xl mx-auto">
              Choose your role to get started with the right registration process for your needs
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userTypes.map((userType) => {
              const IconComponent = userType.icon;
              return (
                <Link
                  key={userType.id}
                  to={userType.path}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#C1DBF4] overflow-hidden"
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${userType.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`${userType.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-[#1D5D9B]" />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-2xl text-[#263238] mb-3 group-hover:text-[#1D5D9B] transition-colors">
                      {userType.title}
                    </h3>
                    <p className="text-[#717171] text-lg mb-6 leading-relaxed">
                      {userType.description}
                    </p>

                    {/* Arrow */}
                    <div className="flex items-center text-[#1D5D9B] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span className="mr-2">Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1D5D9B] rounded-2xl transition-colors duration-300"></div>
                </Link>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-[#717171] text-lg">
              Not sure which option is right for you?{' '}
              <Link to="/help" className="text-[#F4D160] hover:text-[#F4D160]/80 font-medium underline">
                Get help choosing
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
