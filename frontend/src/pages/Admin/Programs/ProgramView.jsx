import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProgramView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock program data
  const mockPrograms = [
    {
      id: 1,
      name: 'Computer Science',
      description: 'Comprehensive computer science program covering software development, algorithms, and system design. This program prepares students for careers in technology through hands-on learning and theoretical foundations.',
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
      prerequisites: ['Calculus I', 'Physics I'],
      learningObjectives: [
        'Master programming fundamentals in multiple languages',
        'Understand algorithms and data structures',
        'Develop problem-solving and analytical thinking skills',
        'Learn software engineering best practices',
        'Gain experience with modern development tools and frameworks'
      ],
      coursework: 'Core courses include programming fundamentals, data structures, algorithms, computer systems, software engineering, database systems, web development, and artificial intelligence. Students also complete mathematics courses and choose from various electives.',
      facultyInfo: 'World-class faculty with industry and research experience from top technology companies and research institutions.',
      accreditation: 'ABET Accredited',
      careerOutcomes: 'Software Engineer, Data Scientist, Product Manager, Research Scientist, System Administrator, Web Developer, Mobile App Developer',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z'
    },
    {
      id: 2,
      name: 'Business Administration MBA',
      description: 'Master of Business Administration program focusing on leadership, strategy, and entrepreneurship with emphasis on global business practices.',
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
      prerequisites: ['Statistics', 'Business Writing'],
      learningObjectives: [
        'Develop strategic thinking and leadership skills',
        'Master financial analysis and management',
        'Understand global business environment',
        'Learn entrepreneurship and innovation'
      ],
      coursework: 'Core curriculum covers finance, marketing, operations, strategy, and leadership. Electives include entrepreneurship, international business, and specialized tracks.',
      facultyInfo: 'Distinguished faculty with extensive business and consulting experience.',
      accreditation: 'AACSB Accredited',
      careerOutcomes: 'Executive Leadership, Management Consulting, Investment Banking, Strategy Analysis, Entrepreneurship',
      createdAt: '2024-01-12T14:20:00Z',
      updatedAt: '2024-01-18T16:20:00Z'
    }
  ];

  useEffect(() => {
    // Mock API call
    const fetchProgram = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundProgram = mockPrograms.find(p => p.id === parseInt(id));
        setProgram(foundProgram);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!program) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h1>
          <p className="text-gray-600 mb-6">The program you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/programs')}
            className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              {getTypeBadge(program.type)}
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                {program.level.toUpperCase()}
              </span>
              {getStatusBadge(program.isActive)}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/admin/programs/edit/${program.id}`)}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            >
              Edit
            </button>
            <button
              onClick={() => navigate('/admin/programs')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Basic Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* University & Department */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Institution</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <p className="mt-1 text-sm text-gray-900">{program.university}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <p className="mt-1 text-sm text-gray-900">{program.department}</p>
            </div>
            {program.accreditation && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Accreditation</label>
                <p className="mt-1 text-sm text-gray-900">{program.accreditation}</p>
              </div>
            )}
          </div>

          {/* Program Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Program Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <p className="mt-1 text-sm text-gray-900">{program.duration}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Credits</label>
              <p className="mt-1 text-sm text-gray-900">{program.credits} credits</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tuition Fee</label>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formatCurrency(program.tuitionFee, program.currency)}
              </p>
            </div>
          </div>

          {/* Enrollment & Dates */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Enrollment & Dates</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Enrollment</label>
              <p className="mt-1 text-sm text-gray-900">
                {program.currentEnrollment}/{program.enrollmentCapacity} students
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-sky-600 h-2 rounded-full" 
                  style={{ width: `${calculateEnrollmentPercentage(program.currentEnrollment, program.enrollmentCapacity)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(program.startDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(program.applicationDeadline)}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Program Description</h2>
          <p className="text-gray-700 leading-relaxed">{program.description}</p>
        </div>

        {/* Coursework */}
        {program.coursework && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Coursework Overview</h2>
            <p className="text-gray-700 leading-relaxed">{program.coursework}</p>
          </div>
        )}

        {/* Requirements and Prerequisites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Admission Requirements */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Admission Requirements</h2>
            <ul className="space-y-2">
              {program.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-sky-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          {program.prerequisites && program.prerequisites.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h2>
              <ul className="space-y-2">
                {program.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-700">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Learning Objectives */}
        {program.learningObjectives && program.learningObjectives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h2>
            <ul className="space-y-2">
              {program.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Faculty Information */}
        {program.facultyInfo && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Faculty Information</h2>
            <p className="text-gray-700 leading-relaxed">{program.facultyInfo}</p>
          </div>
        )}

        {/* Career Outcomes */}
        {program.careerOutcomes && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Career Outcomes</h2>
            <p className="text-gray-700 leading-relaxed">{program.careerOutcomes}</p>
          </div>
        )}

        {/* System Information */}
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-medium text-gray-700">Created At</label>
              <p className="text-gray-600">{formatDateTime(program.createdAt)}</p>
            </div>
            <div>
              <label className="block font-medium text-gray-700">Last Updated</label>
              <p className="text-gray-600">{formatDateTime(program.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => navigate('/admin/programs')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/admin/programs/edit/${program.id}`)}
            className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
          >
            Edit Program
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramView;
