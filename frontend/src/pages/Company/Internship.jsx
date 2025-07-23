import React, { useState, useEffect } from 'react';
import CompanySidebar from '../../components/Navigation/CompanySidebar';
import CompanyDashboardNavbar from '../../components/Navigation/CompanyDashboardNavbar';
import './Internship.css';

const Internship = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Form data for creating/editing internships - ADDED IMAGE_URL FIELD
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    stipend: '',
    start_date: '',
    end_date: '',
    application_deadline: '',
    contact_email: '',
    contact_phone: '',
    image_url: '' // NEW FIELD
  });

  // Sample data with consistent structure
  const [mockInternships] = useState([]);

  const departments = ['All', 'Technology', 'Marketing', 'Design', 'Business'];
  const statuses = ['All', 'active', 'draft', 'completed'];

  // Get company ID from localStorage
  const getCompanyId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.company_id || 1;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new internship
  const handleCreateInternship = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/companies/company-internships/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: getCompanyId(),
          ...formData
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Internship created successfully!' });
        setShowAddModal(false);
        setFormData({
          title: '',
          description: '',
          location: '',
          stipend: '',
          start_date: '',
          end_date: '',
          application_deadline: '',
          contact_email: '',
          contact_phone: '',
          image_url: '' // RESET IMAGE URL
        });
        fetchInternships();
      } else {
        setMessage({ type: 'error', text: result.message || 'Error creating internship' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error creating internship:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch internships for this company
  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/companies/company-internships/?company_id=${getCompanyId()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success && result.internships) {
        // Map the API data to match your frontend structure
        const mappedInternships = result.internships.map(internship => ({
          internship_id: internship.internship_id,
          title: internship.title,
          description: internship.description || '',
          location: internship.location || '',
          stipend: internship.stipend || '',
          start_date: internship.start_date,
          end_date: internship.end_date,
          application_deadline: internship.application_deadline,
          contact_email: internship.contact_email || '',
          contact_phone: internship.contact_phone || '',
          company_name: internship.company_name,
          company_id: internship.company_id,
          created_at: internship.created_at,
          // Add default values for frontend-specific fields
          department: internship.department || 'Technology',
          type: internship.internship_type || 'Full-time',
          status: internship.status || 'active',
          applicants: internship.applicants || 0,
          rating: internship.rating || 4.5,
          image: internship.image_url || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',
          skills: internship.skills || []
        }));
        
        setInternships(mappedInternships);
      } else {
        console.error('API returned error:', result.message);
        setMessage({ type: 'error', text: result.message || 'Failed to fetch internships' });
        setInternships([]);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      setMessage({ type: 'error', text: 'Failed to connect to server. Please check your connection.' });
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter internships
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (internship.company_name && internship.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = selectedDepartment === 'All' || internship.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || internship.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Handle View Modal
  const handleView = (internship) => {
    setSelectedInternship(internship);
    setShowViewModal(true);
  };

  // Handle Edit Modal
  const handleEdit = (internship) => {
    setSelectedInternship(internship);
    setFormData({
      title: internship.title,
      description: internship.description,
      location: internship.location,
      stipend: internship.stipend,
      start_date: internship.start_date,
      end_date: internship.end_date,
      application_deadline: internship.application_deadline,
      contact_email: internship.contact_email || '',
      contact_phone: internship.contact_phone || '',
      image_url: internship.image || '' // LOAD IMAGE URL FOR EDITING
    });
    setShowEditModal(true);
  };

  // Handle Delete
  const handleDelete = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/companies/company-internships/${internshipId}/delete/`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          setInternships(prev => prev.filter(i => i.internship_id !== internshipId));
          setMessage({ type: 'success', text: 'Internship deleted successfully!' });
        } else {
          setMessage({ type: 'error', text: result.message || 'Error deleting internship' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Network error. Please try again.' });
        console.error('Error deleting internship:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Update Internship
  const handleUpdateInternship = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/companies/company-internships/${selectedInternship.internship_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Internship updated successfully!' });
        setShowEditModal(false);
        
        // Update the internship in the local state
        setInternships(prev => prev.map(internship => 
          internship.internship_id === selectedInternship.internship_id 
            ? {
                ...internship,
                ...formData,
                image: formData.image_url || internship.image
              }
            : internship
        ));
        
        setFormData({
          title: '',
          description: '',
          location: '',
          stipend: '',
          start_date: '',
          end_date: '',
          application_deadline: '',
          contact_email: '',
          contact_phone: '',
          image_url: ''
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Error updating internship' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error updating internship:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'draft': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch(type) {
      case 'Full-time': return '#10b981';
      case 'Part-time': return '#f59e0b';
      case 'Remote': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <div className="internship-page">
      {/* SIDEBAR */}
      <CompanySidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* NAVBAR */}
      <CompanyDashboardNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className={`internship-main ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search and Filter Section */}
        <section className="internship-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search internships, locations, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              {departments.map(department => (
                <option key={department} value={department}>
                  {department === 'All' ? 'All Departments' : department}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Internships Section Header */}
        <section className="internships">
          <div className="internships-header">
            <h2>Manage Internships</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="internship-btn-add-new"
            >
              + Add New Internship
            </button>
          </div>
          
          {/* Internships Grid - MODIFIED CARD STRUCTURE */}
          <div className="internships-grid">
            {filteredInternships.map((internship) => (
              <div key={internship.internship_id} className="internship-card">
                
                <div className="card-image-container">
                  <img 
                    src={internship.image} 
                    alt={internship.title} 
                    className="card-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="card-overlay">
                    <span className="card-category">{internship.department}</span>
                    <div className="card-stats">
                      <span>👥 {internship.applicants}</span>
                      <span>⭐ {internship.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="card-title">{internship.title}</h3>
                    <div className="card-meta">
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(internship.status) }}
                      >
                        {internship.status}
                      </span>
                      <span 
                        className="level-badge" 
                        style={{ color: getTypeColor(internship.type) }}
                      >
                        {internship.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-details">
                    <span>📍 {internship.location}</span>
                    <span>💰 {internship.stipend}</span>
                    <span>📅 {new Date(internship.start_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="card-instructor">
                    <span>📞 {internship.contact_email}</span>
                  </div>
                  
                  <p className="card-description">{internship.description}</p>
                  
                  <div className="card-skills">
                    {internship.skills && internship.skills.map((skill, index) => (
                      <span key={index} className="skill">{skill}</span>
                    ))}
                  </div>
                  
                  {/* MODIFIED CARD ACTIONS - Update the delete button */}
                  <div className="card-actions">
                    <div className="action-buttons-top">
                      <button className="btn-view" onClick={() => handleView(internship)}>View</button>
                      <button className="btn-edit" onClick={() => handleEdit(internship)}>Edit</button>
                    </div>
                    <div className="action-buttons-bottom">
                      <button 
                        className="btn-delete-full" 
                        onClick={() => handleDelete(internship.internship_id)}
                        title="Delete Internship"
                      >
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Internship Statistics */}
        <section className="internship-stats">
          <div className="stats-content">
            <h2>Company Internship Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">💼</div>
                <div className="stat-value">{filteredInternships.length}</div>
                <div className="stat-label">Total Internships</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{filteredInternships.filter(i => i.status === 'active').length}</div>
                <div className="stat-label">Active Internships</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{filteredInternships.reduce((sum, i) => sum + (i.applicants || 0), 0)}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{(filteredInternships.reduce((sum, i) => sum + (i.rating || 0), 0) / filteredInternships.length || 0).toFixed(1)}</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Add Internship Modal - ADDED IMAGE URL FIELD */}
      {showAddModal && (
        <div className="company-internship-user-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="company-internship-user-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-internship-user-modal-header">
              <h2>Create New Internship</h2>
              <button className="company-internship-user-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="company-internship-user-modal-body">
              <form onSubmit={handleCreateInternship} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Software Development Intern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., New York, NY or Remote"
                    />
                  </div>
                </div>

                {/* NEW IMAGE URL FIELD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <small className="text-gray-500">Optional: Add an image URL to display on the internship card</small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the internship role and responsibilities"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
                    <input
                      type="date"
                      name="application_deadline"
                      value={formData.application_deadline}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stipend</label>
                    <input
                      type="text"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., $15/hour or $2000/month"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="hr@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Internship'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedInternship && (
        <div className="company-internship-user-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="company-internship-user-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-internship-user-modal-header">
              <h2>View Internship Details</h2>
              <button className="company-internship-user-modal-close" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="company-internship-user-modal-body">
              <img
                src={selectedInternship.image}
                alt={selectedInternship.title}
                className="company-internship-user-modal-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="company-internship-user-modal-info">
                <div className="company-internship-user-modal-title-section">
                  <h3>{selectedInternship.title}</h3>
                  <div className="company-internship-user-modal-badges">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(selectedInternship.status) }}
                    >
                      {selectedInternship.status}
                    </span>
                    <span 
                      className="level-badge" 
                      style={{ color: getTypeColor(selectedInternship.type) }}
                    >
                      {selectedInternship.type}
                    </span>
                  </div>
                </div>
                
                <div className="company-internship-user-modal-meta">
                  <div className="company-internship-user-meta-item">
                    <strong>Location:</strong> {selectedInternship.location}
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>Stipend:</strong> {selectedInternship.stipend}
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>Start Date:</strong> {new Date(selectedInternship.start_date).toLocaleDateString()}
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>End Date:</strong> {new Date(selectedInternship.end_date).toLocaleDateString()}
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>Application Deadline:</strong> {new Date(selectedInternship.application_deadline).toLocaleDateString()}
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>Contact Email:</strong> {selectedInternship.contact_email}
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>Contact Phone:</strong> {selectedInternship.contact_phone}
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>Applicants:</strong> {selectedInternship.applicants} students
                  </div>
                  <div className="company-internship-user-meta-item">
                    <strong>Rating:</strong> {selectedInternship.rating}/5.0
                  </div>
                </div>
                
                <div className="company-internship-user-modal-description">
                  <strong>Description:</strong>
                  <p>{selectedInternship.description}</p>
                </div>
                
                {selectedInternship.skills && (
                  <div className="company-internship-user-modal-skills">
                    <strong>Skills Required:</strong>
                    <div className="company-internship-user-skills-container">
                      {selectedInternship.skills.map((skill, index) => (
                        <span key={index} className="skill">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - ADDED IMAGE URL FIELD */}
      {showEditModal && selectedInternship && (
        <div className="company-internship-user-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="company-internship-user-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-internship-user-modal-header">
              <h2>Edit Internship</h2>
              <button className="company-internship-user-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="company-internship-user-modal-body">
              <form onSubmit={handleUpdateInternship} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* IMAGE URL FIELD IN EDIT FORM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Update Internship
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internship;