import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './Internship.css';

const Internship = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');

  // Sample internships data
  const [internships, setInternships] = useState([
    {
      id: 1,
      title: 'Software Engineering Internship',
      description: 'Join our engineering team to develop cutting-edge software solutions. Work on real projects, learn modern technologies, and gain hands-on experience in software development.',
      department: 'Technology',
      duration: '12 weeks',
      location: 'San Francisco, CA',
      type: 'Full-time',
      stipend: 2500,
      company: 'TechCorp',
      coordinator: 'Dr. James Wilson',
      requirements: 'Basic Programming Knowledge, Git',
      status: 'active',
      applicants: 87,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',
      skills: ['Python', 'JavaScript', 'React', 'Node.js'],
      startDate: '2024-06-01',
      endDate: '2024-08-24'
    },
    {
      id: 2,
      title: 'Digital Marketing Internship',
      description: 'Learn digital marketing strategies including social media marketing, content creation, SEO optimization, and campaign management in our dynamic marketing team.',
      department: 'Marketing',
      duration: '10 weeks',
      location: 'New York, NY',
      type: 'Full-time',
      stipend: 2000,
      company: 'MarketingPro',
      coordinator: 'Sarah Miller',
      requirements: 'Communication Skills, Basic Analytics',
      status: 'active',
      applicants: 64,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
      skills: ['Social Media', 'SEO', 'Content Marketing', 'Analytics'],
      startDate: '2024-05-15',
      endDate: '2024-07-24'
    },
    {
      id: 3,
      title: 'Data Science Internship',
      description: 'Work with our data science team to analyze large datasets, build predictive models, and create data visualizations that drive business decisions.',
      department: 'Technology',
      duration: '16 weeks',
      location: 'Seattle, WA',
      type: 'Full-time',
      stipend: 3000,
      company: 'DataTech Solutions',
      coordinator: 'Alex Chen',
      requirements: 'Statistics, Python, SQL',
      status: 'active',
      applicants: 95,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      skills: ['Python', 'Machine Learning', 'SQL'],
      startDate: '2024-06-10',
      endDate: '2024-09-30'
    },
    {
      id: 4,
      title: 'UX/UI Design Internship',
      description: 'Join our design team to create user-centered designs, conduct user research, create wireframes, and develop prototypes for web and mobile applications.',
      department: 'Design',
      duration: '14 weeks',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      stipend: 2200,
      company: 'DesignStudio',
      coordinator: 'Emily Rodriguez',
      requirements: 'Design Portfolio, Figma Knowledge',
      status: 'draft',
      applicants: 0,
      rating: 0,
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&q=80',
      skills: ['Figma', 'User Research', 'Design Systems'],
      startDate: '2024-07-01',
      endDate: '2024-10-05'
    },
    {
      id: 5,
      title: 'Business Development Internship',
      description: 'Support our business development team in market research, client acquisition, partnership development, and strategic planning initiatives.',
      department: 'Business',
      duration: '8 weeks',
      location: 'Chicago, IL',
      type: 'Full-time',
      stipend: 1800,
      company: 'BizGrow Inc',
      coordinator: 'Michael Davis',
      requirements: 'Business Fundamentals, Communication',
      status: 'active',
      applicants: 52,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
      skills: ['Market Research', 'Sales', 'Strategy', 'Communication'],
      startDate: '2024-06-15',
      endDate: '2024-08-10'
    },
    {
      id: 6,
      title: 'Product Management Internship',
      description: 'Learn product management fundamentals by working on product roadmaps, conducting user interviews, analyzing metrics, and collaborating with cross-functional teams.',
      department: 'Technology',
      duration: '12 weeks',
      location: 'Austin, TX',
      type: 'Full-time',
      stipend: 2800,
      company: 'ProductTech',
      coordinator: 'Jennifer Kim',
      requirements: 'Analytical Skills, Project Management',
      status: 'active',
      applicants: 73,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80',
      skills: ['Product Strategy', 'Analytics', 'User Research', 'Agile'],
      startDate: '2024-06-01',
      endDate: '2024-08-24'
    }
  ]);

  const departments = ['All Department', 'Technology', 'Marketing', 'Design', 'Business'];
  const durations = ['All Durations ', '8 weeks', '10 weeks', '12 weeks', '14 weeks', '16 weeks'];

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || internship.department === selectedDepartment;
    const matchesDuration = selectedDuration === 'All' || internship.duration === selectedDuration;
    return matchesSearch && matchesDepartment && matchesDuration;
  });

  // Handle View Modal
  const handleView = (internship) => {
    setSelectedInternship(internship);
    setShowViewModal(true);
  };

  // Handle Edit Modal
  const handleEdit = (internship) => {
    setSelectedInternship(internship);
    setEditFormData({
      ...internship,
      skills: internship.skills.join(', ')
    });
    setShowEditModal(true);
  };

  // Handle Add New Internship
  const handleAddNew = () => {
    setEditFormData({
      id: Date.now(),
      title: '',
      description: '',
      department: 'Technology',
      duration: '12 weeks',
      location: '',
      type: 'Full-time',
      stipend: 0,
      company: '',
      coordinator: '',
      requirements: '',
      status: 'draft',
      applicants: 0,
      rating: 0,
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',
      skills: '',
      startDate: '',
      endDate: ''
    });
    setShowAddModal(true);
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      setInternships(internships.filter(internship => internship.id !== id));
    }
  };

  // Handle Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedInternship = {
      ...editFormData,
      skills: editFormData.skills.split(',').map(skill => skill.trim()),
      stipend: parseFloat(editFormData.stipend)
    };
    
    setInternships(internships.map(internship => 
      internship.id === selectedInternship.id ? updatedInternship : internship
    ));
    setShowEditModal(false);
    setSelectedInternship(null);
  };

  // Handle Add New Save
  const handleAddSave = (e) => {
    e.preventDefault();
    const newInternship = {
      ...editFormData,
      skills: editFormData.skills.split(',').map(skill => skill.trim()),
      stipend: parseFloat(editFormData.stipend)
    };
    
    setInternships([...internships, newInternship]);
    setShowAddModal(false);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="internship-page">
      <div className="internship-container">
        {/* Sidebar Component with callback */}
        <Sidebar 
          activePage="internship" 
          onExpandChange={setIsSidebarExpanded}
          userType="admin"
        />

        {/* Main Content with responsive class */}
        <main className={`internship-main ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {/* Hero Section */}
          <section className="internship-hero">
            <div className="hero-content">
              <h1>Internship Management</h1>
              <p>Create and manage exceptional internship opportunities for talented students</p>
            </div>
          </section>

          {/* Search and Filter Section */}
          <section className="internship-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search internships, companies, or skills..."
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
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
              
              <select 
                value={selectedDuration} 
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="filter-select"
              >
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Internships Section Header */}
          <section className="internships">
            <div className="internships-header">
              <h2>All Internships</h2>
              <button className="btn-add-new" onClick={handleAddNew}>
                + New Internship
              </button>
            </div>
            
            {/* Internships Grid */}
            <div className="internships-grid">
              {filteredInternships.map((internship) => (
                <div key={internship.id} className="internship-card">
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(internship.id)}
                    title="Delete Internship"
                  >
                    ✕
                  </button>
                  
                  <div className="card-image-container">
                    <img src={internship.image} alt={internship.title} className="card-image" />
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
                      <span>⏱️ {internship.duration}</span>
                      <span>📍 {internship.location}</span>
                      <span>💰 ${internship.stipend}/month</span>
                    </div>
                    
                    <div className="card-instructor">
                      <span>👨‍💼 {internship.coordinator}</span>
                    </div>
                    
                    <p className="card-description">{internship.description}</p>
                    
                    <div className="card-skills">
                      {internship.skills.map((skill, index) => (
                        <span key={index} className="skill">{skill}</span>
                      ))}
                    </div>
                    
                    <div className="card-actions">
                      <button className="btn-view" onClick={() => handleView(internship)}>View</button>
                      <button className="btn-edit" onClick={() => handleEdit(internship)}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Internship Statistics */}
          <section className="internship-stats">
            <div className="stats-content">
              <h2>Internship Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">💼</div>
                  <div className="stat-value">{internships.length}</div>
                  <div className="stat-label">Total Internships</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{internships.filter(i => i.status === 'active').length}</div>
                  <div className="stat-label">Active Positions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{internships.reduce((sum, i) => sum + i.applicants, 0)}</div>
                  <div className="stat-label">Total Applicants</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">${internships.reduce((sum, i) => sum + i.stipend, 0).toLocaleString()}</div>
                  <div className="stat-label">Monthly Stipends</div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="internship-footer">
            <div className="footer-content">
              <h3>Stay Connected</h3>
              <div className="newsletter">
                <input type="email" placeholder="Your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* View Modal */}
      {showViewModal && selectedInternship && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>View Internship</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <img
                src={selectedInternship.image}
                alt={selectedInternship.title}
                className="modal-image internship-modal-image"
              />
              <div className="modal-info">
                <div className="modal-title-section">
                  <h3>{selectedInternship.title}</h3>
                  <div className="modal-badges">
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
                
                <div className="modal-meta">
                  <div className="meta-item">
                    <strong>👨‍💼 Coordinator:</strong> {selectedInternship.coordinator}
                  </div>
                  <div className="meta-item">
                    <strong>🏷️ Department:</strong> {selectedInternship.department}
                  </div>
                  <div className="meta-item">
                    <strong>⏱️ Duration:</strong> {selectedInternship.duration}
                  </div>
                  <div className="meta-item">
                    <strong>📍 Location:</strong> {selectedInternship.location}
                  </div>
                  <div className="meta-item">
                    <strong>💰 Stipend:</strong> ${selectedInternship.stipend}/month
                  </div>
                  <div className="meta-item">
                    <strong>🏢 Company:</strong> {selectedInternship.company}
                  </div>
                  <div className="meta-item">
                    <strong>👥 Applicants:</strong> {selectedInternship.applicants} students
                  </div>
                  <div className="meta-item">
                    <strong>⭐ Rating:</strong> {selectedInternship.rating}/5.0
                  </div>
                  <div className="meta-item">
                    <strong>📅 Start Date:</strong> {new Date(selectedInternship.startDate).toLocaleDateString()}
                  </div>
                  <div className="meta-item">
                    <strong>📅 End Date:</strong> {new Date(selectedInternship.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="modal-description">
                  <strong>📝 Description:</strong>
                  <p>{selectedInternship.description}</p>
                </div>
                
                <div className="modal-skills">
                  <strong>🛠️ Skills Required:</strong>
                  <div className="skills-container">
                    {selectedInternship.skills.map((skill, index) => (
                      <span key={index} className="skill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedInternship && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Internship</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveEdit}>
                <div className="form-group">
                  <label>Internship Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      name="department"
                      value={editFormData.department}
                      onChange={handleInputChange}
                      required
                    >
                      {departments.filter(dept => dept !== 'All').map(department => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <select
                      name="duration"
                      value={editFormData.duration}
                      onChange={handleInputChange}
                      required
                    >
                      {durations.filter(dur => dur !== 'All').map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, CA"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      name="type"
                      value={editFormData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Stipend ($)</label>
                    <input
                      type="number"
                      name="stipend"
                      value={editFormData.stipend}
                      onChange={handleInputChange}
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={editFormData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Coordinator</label>
                  <input
                    type="text"
                    name="coordinator"
                    value={editFormData.coordinator}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Requirements</label>
                  <input
                    type="text"
                    name="requirements"
                    value={editFormData.requirements}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Programming, Communication Skills"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editFormData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={editFormData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Skills Required (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={editFormData.skills}
                    onChange={handleInputChange}
                    placeholder="Python, JavaScript, React, Node.js"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={editFormData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Internship</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSave}>
                <div className="form-group">
                  <label>Internship Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      name="department"
                      value={editFormData.department}
                      onChange={handleInputChange}
                      required
                    >
                      {departments.filter(dept => dept !== 'All').map(department => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <select
                      name="duration"
                      value={editFormData.duration}
                      onChange={handleInputChange}
                      required
                    >
                      {durations.filter(dur => dur !== 'All').map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, CA"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      name="type"
                      value={editFormData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Stipend ($)</label>
                    <input
                      type="number"
                      name="stipend"
                      value={editFormData.stipend}
                      onChange={handleInputChange}
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={editFormData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Coordinator</label>
                  <input
                    type="text"
                    name="coordinator"
                    value={editFormData.coordinator}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Requirements</label>
                  <input
                    type="text"
                    name="requirements"
                    value={editFormData.requirements}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Programming, Communication Skills"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editFormData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={editFormData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Skills Required (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={editFormData.skills}
                    onChange={handleInputChange}
                    placeholder="Python, JavaScript, React, Node.js"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={editFormData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">Add Internship</button>
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