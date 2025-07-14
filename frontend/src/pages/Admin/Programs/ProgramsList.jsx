import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProgramsList = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  // Mock programs data
  const mockPrograms = [
    {
      id: 1,
      name: 'Computer Science',
      description: 'Comprehensive computer science program covering software development, algorithms, and system design',
      type: 'undergraduate',
      level: 'bachelor',
      duration: '4 years',
      credits: 120,
      department: 'Computer Science',
      university: 'Tech University',
      tuitionFee: 50000,
      currency: 'USD',
      startDate: '2024-09-01',
      applicationDeadline: '2024-06-15',
      isActive: true,
      enrollmentCapacity: 200,
      currentEnrollment: 150,
      requirements: ['High School Diploma', 'SAT Score: 1200+', 'Math Proficiency'],
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Business Administration MBA',
      description: 'Master of Business Administration program focusing on leadership, strategy, and entrepreneurship',
      type: 'graduate',
      level: 'master',
      duration: '2 years',
      credits: 60,
      department: 'Business School',
      university: 'Business University',
      tuitionFee: 80000,
      currency: 'USD',
      startDate: '2024-08-15',
      applicationDeadline: '2024-05-30',
      isActive: true,
      enrollmentCapacity: 100,
      currentEnrollment: 85,
      requirements: ['Bachelor Degree', 'GMAT Score: 650+', 'Work Experience: 2+ years'],
      createdAt: '2024-01-12T14:20:00Z'
    },
    {
      id: 3,
      name: 'Data Science Certificate',
      description: 'Professional certificate program in data science and machine learning',
      type: 'certificate',
      level: 'certificate',
      duration: '6 months',
      credits: 18,
      department: 'Data Science',
      university: 'Tech Institute',
      tuitionFee: 15000,
      currency: 'USD',
      startDate: '2024-07-01',
      applicationDeadline: '2024-06-01',
      isActive: true,
      enrollmentCapacity: 50,
      currentEnrollment: 30,
      requirements: ['Programming Experience', 'Statistics Knowledge'],
      createdAt: '2024-01-10T09:15:00Z'
    },
    {
      id: 4,
      name: 'Engineering Physics PhD',
      description: 'Doctoral program in engineering physics with research focus',
      type: 'graduate',
      level: 'phd',
      duration: '4-6 years',
      credits: 90,
      department: 'Physics',
      university: 'Research University',
      tuitionFee: 60000,
      currency: 'USD',
      startDate: '2024-09-15',
      applicationDeadline: '2024-01-15',
      isActive: false,
      enrollmentCapacity: 20,
      currentEnrollment: 12,
      requirements: ['Master Degree in Physics/Engineering', 'GRE Score: 320+', 'Research Experience'],
      createdAt: '2024-01-08T11:45:00Z'
    }
  ];

  useEffect(() => {
    // Mock API call
    const fetchPrograms = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setPrograms(mockPrograms);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesLevel = filterLevel === 'all' || program.level === filterLevel;
    
    return matchesSearch && matchesType && matchesLevel;
  });

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      undergraduate: 'bg-blue-100 text-blue-800',
      graduate: 'bg-purple-100 text-purple-800',
      certificate: 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColors[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const calculateEnrollmentPercentage = (current, capacity) => {
    return Math.round((current / capacity) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
          <p className="text-gray-600">Manage academic programs and courses</p>
        </div>
        <Link
          to="/admin/programs/new"
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
        >
          Add New Program
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Types</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>
          <div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Levels</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredPrograms.length} programs
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredPrograms.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No programs found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type/Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tuition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {program.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {program.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getTypeBadge(program.type)}
                        <div className="text-xs text-gray-500">
                          {program.level.toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{program.university}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{program.duration}</div>
                      <div className="text-xs text-gray-500">{program.credits} credits</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(program.tuitionFee, program.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {program.currentEnrollment}/{program.enrollmentCapacity}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-sky-600 h-1.5 rounded-full" 
                          style={{ width: `${calculateEnrollmentPercentage(program.currentEnrollment, program.enrollmentCapacity)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(program.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/admin/programs/${program.id}`}
                        className="text-sky-600 hover:text-sky-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/programs/edit/${program.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default ProgramsList;
