import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProgramForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    level: '',
    duration: '',
    credits: '',
    department: '',
    university: '',
    tuitionFee: '',
    currency: 'USD',
    startDate: '',
    applicationDeadline: '',
    isActive: true,
    enrollmentCapacity: '',
    requirements: [''],
    prerequisites: [''],
    learningObjectives: [''],
    coursework: '',
    facultyInfo: '',
    accreditation: '',
    careerOutcomes: ''
  });

  const [loading, setLoading] = useState(false);

  // Mock data for editing
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
      requirements: ['High School Diploma', 'SAT Score: 1200+', 'Math Proficiency'],
      prerequisites: ['Calculus I', 'Physics I'],
      learningObjectives: ['Master programming fundamentals', 'Understand algorithms and data structures', 'Develop problem-solving skills'],
      coursework: 'Core courses include programming, mathematics, computer systems, and software engineering.',
      facultyInfo: 'World-class faculty with industry and research experience',
      accreditation: 'ABET Accredited',
      careerOutcomes: 'Software Engineer, Data Scientist, Product Manager, Research Scientist'
    }
  ];

  useEffect(() => {
    if (isEdit) {
      // Mock API call - in real app, fetch program data
      const program = mockPrograms.find(p => p.id === parseInt(id));
      if (program) {
        setFormData(program);
      }
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(isEdit ? 'Updating program:' : 'Creating program:', formData);
      
      // Navigate back to programs list
      navigate('/admin/programs');
    } catch (error) {
      console.error('Error saving program:', error);
    } finally {
      setLoading(false);
    }
  };

  const programTypes = [
    'undergraduate',
    'graduate',
    'certificate',
    'diploma',
    'continuing-education'
  ];

  const programLevels = [
    'certificate',
    'diploma',
    'associate',
    'bachelor',
    'master',
    'phd',
    'professional'
  ];

  const currencies = [
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Program' : 'Add New Program'}
          </h1>
          <button
            onClick={() => navigate('/admin/programs')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Programs
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University *
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select Type</option>
                  {programTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select Level</option>
                  {programLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 4 years, 18 months"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Credits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Enrollment Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Capacity
                </label>
                <input
                  type="number"
                  name="enrollmentCapacity"
                  value={formData.enrollmentCapacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tuition Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuition Fee
                </label>
                <input
                  type="number"
                  name="tuitionFee"
                  value={formData.tuitionFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Requirements
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  placeholder="Enter requirement"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirements', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="px-4 py-2 text-sky-600 hover:text-sky-800"
            >
              + Add Requirement
            </button>
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites
            </label>
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                  placeholder="Enter prerequisite"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('prerequisites', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('prerequisites')}
              className="px-4 py-2 text-sky-600 hover:text-sky-800"
            >
              + Add Prerequisite
            </button>
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Objectives
            </label>
            {formData.learningObjectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)}
                  placeholder="Enter learning objective"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('learningObjectives', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('learningObjectives')}
              className="px-4 py-2 text-sky-600 hover:text-sky-800"
            >
              + Add Objective
            </button>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 gap-6">
            {/* Coursework */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coursework Overview
              </label>
              <textarea
                name="coursework"
                value={formData.coursework}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Faculty Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faculty Information
              </label>
              <textarea
                name="facultyInfo"
                value={formData.facultyInfo}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Accreditation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accreditation
              </label>
              <input
                type="text"
                name="accreditation"
                value={formData.accreditation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Career Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Outcomes
              </label>
              <textarea
                name="careerOutcomes"
                value={formData.careerOutcomes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              id="isActive"
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Program is Active
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/programs')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Program' : 'Create Program')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramForm;
