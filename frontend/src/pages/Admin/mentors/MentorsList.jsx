import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/auth';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  Award,
  Building,
  BookOpen,
  MapPin,
  Star,
  TrendingUp,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const MentorsList = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpertise, setFilterExpertise] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mentorsPerPage] = useState(10);

  // Mock data for mentors
  const mockMentors = [
    {
      id: 1,
      first_name: 'Dilshan',
      last_name: 'Rathnayake',
      email: 'dilshan.rathnayake@techcorp.lk',
      contact_number: '0771234567',
      university: 'University of Moratuwa', // fixed key
      degree_program: 'BSc in Artificial Intelligence', // fixed key
      experience_years: 8,
      expertise_areas: ['Software Development', 'Machine Learning', 'Cloud Computing'],
      industry: 'Technology',
      mentorship_capacity: 5,
      current_mentees: 3,
      linkedin_profile: 'https://linkedin.com/in/dilshan-rathnayake',
      rating: 4.8,
      total_reviews: 24,
      bio: 'Experienced software engineer with expertise in full-stack development and machine learning.',
      is_active: true,
      is_verified: true,
      joined_date: '2023-03-15',
      last_login: '2024-07-03T14:20:00Z'
    },
    {
      id: 2,
      first_name: 'Priyanka',
      last_name: 'Silva',
      email: 'priyanka.silva@bankorp.lk',
      contact_number: '0772345678',
      university: 'University of Colombo School of Colombo', // fixed key
      degree_program: 'BSc. in Information Technology', // fixed key
      experience_years: 12,
      expertise_areas: ['Finance', 'Investment Banking', 'Risk Management'],
      industry: 'Banking & Finance',
      mentorship_capacity: 4,
      current_mentees: 4,
      linkedin_profile: 'https://linkedin.com/in/priyanka-silva',
      rating: 4.9,
      total_reviews: 31,
      bio: 'Senior financial analyst with extensive experience in investment banking and risk assessment.',
      is_active: true,
      is_verified: true,
      joined_date: '2023-01-20',
      last_login: '2024-07-02T16:45:00Z'
    },
    {
      id: 3,
      first_name: 'Roshan',
      last_name: 'Fernando',
      email: 'roshan.fernando@medtech.lk',
      contact_number: '0773456789',
      university: 'University of Kelaniya',
      degree_program: 'BSc in Management and Information Technology',
      experience_years: 6,
      expertise_areas: ['Biomedical Engineering', 'Healthcare Technology', 'Research'],
      industry: 'Healthcare',
      mentorship_capacity: 3,
      current_mentees: 2,
      linkedin_profile: 'https://linkedin.com/in/roshan-fernando',
      rating: 4.7,
      total_reviews: 18,
      bio: 'Innovative biomedical engineer focused on developing cutting-edge healthcare solutions.',
      is_active: true,
      is_verified: true,
      joined_date: '2023-06-10',
      last_login: '2024-07-01T10:30:00Z'
    },
    {
      id: 4,
      first_name: 'Chamila',
      last_name: 'Wickramasinghe',
      email: 'chamila.wickrama@marketing.lk',
      contact_number: '0774567890',
      university: 'University of Peradeniya',
      degree_program: 'BSc. in Engineering(Hons)',
      experience_years: 10,
      expertise_areas: ['Digital Marketing', 'Brand Strategy', 'Content Creation'],
      industry: 'Marketing & Advertising',
      mentorship_capacity: 6,
      current_mentees: 1,
      linkedin_profile: 'https://linkedin.com/in/chamila-wickrama',
      rating: 4.6,
      total_reviews: 22,
      bio: 'Creative marketing professional with a passion for building strong brand identities.',
      is_active: false,
      is_verified: true,
      joined_date: '2023-02-28',
      last_login: '2024-06-25T14:15:00Z'
    },
    {
      id: 5,
      first_name: 'Nuwan',
      last_name: 'Perera',
      email: 'nuwan.perera@startup.lk',
      contact_number: '0775678901',
      university: 'University of Colombo School of Computing',
      degree_program: 'Computer Science',
      experience_years: 5,
      expertise_areas: ['Entrepreneurship', 'Product Management', 'Business Strategy'],
      industry: 'Startup & Innovation',
      mentorship_capacity: 8,
      current_mentees: 6,
      linkedin_profile: 'https://linkedin.com/in/nuwan-perera',
      rating: 4.9,
      total_reviews: 15,
      bio: 'Serial entrepreneur with successful exits and passion for mentoring young entrepreneurs.',
      is_active: true,
      is_verified: false,
      joined_date: '2023-08-05',
      last_login: '2024-07-03T11:45:00Z'
    }
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setMentors(mockMentors);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  // Filter mentors
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExpertise = filterExpertise === 'all' || 
      mentor.expertise_areas.some(area => area.toLowerCase().includes(filterExpertise.toLowerCase()));
    const matchesCompany = filterCompany === 'all' || mentor.company === filterCompany;

    return matchesSearch && matchesExpertise && matchesCompany;
  });

  // Pagination
  const indexOfLastMentor = currentPage * mentorsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
  const currentMentors = filteredMentors.slice(indexOfFirstMentor, indexOfLastMentor);
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);

  // Get unique expertise areas and companies for filter
  const expertiseAreas = [...new Set(mentors.flatMap(m => m.expertise_areas))];
  const companies = [...new Set(mentors.map(m => m.company))];

  const handleDeleteMentor = (mentorId) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      setMentors(prev => prev.filter(mentor => mentor.id !== mentorId));
    }
  };

  const handleToggleStatus = (mentorId) => {
    setMentors(prev =>
      prev.map(mentor =>
        mentor.id === mentorId
          ? { ...mentor, is_active: !mentor.is_active }
          : mentor
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCapacityColor = (current, total) => {
    const percentage = (current / total) * 100;
    if (percentage >= 80) return 'bg-red-100 text-red-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Mentors Management</h1>
                </div>
              </div>
              <Link
                to="/admin/mentors/new"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Mentor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterExpertise}
                    onChange={(e) => setFilterExpertise(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Expertise</option>
                    {expertiseAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterCompany}
                    onChange={(e) => setFilterCompany(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Universities</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredMentors.length} of {mentors.length} mentors
                </div>
              </div>
            </div>
          </div>

          {/* Mentors Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Degree Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expertise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentorship
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMentors.map((mentor) => (
                    <tr key={mentor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-lg mr-3">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {mentor.first_name} {mentor.last_name}
                              </span>
                              {mentor.is_verified && (
                                <Award className="h-4 w-4 text-blue-500" title="Verified Mentor" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{mentor.email}</div>
                            <div className="text-sm text-gray-500">{mentor.experience_years} years exp</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* University */}
                        <div className="text-sm text-gray-900">{mentor.university || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Degree Program */}
                        <div className="text-sm text-gray-900">{mentor.degree_program || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mentor.company}</div>
                        <div className="text-sm text-gray-500">{mentor.industry}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mentor.position}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise_areas.slice(0, 2).map((area, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                            >
                              {area}
                            </span>
                          ))}
                          {mentor.expertise_areas.length > 2 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                              +{mentor.expertise_areas.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {mentor.current_mentees}/{mentor.mentorship_capacity} mentees
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCapacityColor(mentor.current_mentees, mentor.mentorship_capacity)}`}>
                          {mentor.current_mentees === mentor.mentorship_capacity ? 'Full' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Star className={`h-4 w-4 ${getRatingColor(mentor.rating)}`} />
                          <span className={`text-sm font-medium ${getRatingColor(mentor.rating)}`}>
                            {mentor.rating}
                          </span>
                          <span className="text-sm text-gray-500">({mentor.total_reviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          mentor.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {mentor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(mentor.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/mentors/${mentor.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/mentors/${mentor.id}/edit`}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(mentor.id)}
                            className={`p-1 rounded ${
                              mentor.is_active
                                ? 'text-orange-600 hover:text-orange-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={mentor.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {mentor.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteMentor(mentor.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstMentor + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastMentor, filteredMentors.length)}</span> of{' '}
                      <span className="font-medium">{filteredMentors.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === index + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MentorsList;