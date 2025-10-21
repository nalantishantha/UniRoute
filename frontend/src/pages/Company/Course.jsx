import React, { useState, useEffect } from 'react';
import CompanySidebar from '../../components/Navigation/CompanySidebar'; // CHANGED: Import CompanySidebar
import CompanyDashboardNavbar from '../../components/Navigation/CompanyDashboardNavbar';
import './Course.css';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const response = await fetch(`/api/companies/company-courses/?company_id=1`);
      const result = await response.json();
      if (result.success && result.courses) {
        setCourses(result.courses);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const categories = ['All Categories', 'Technology', 'Marketing', 'Design', 'Business'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Handle View Modal
  const handleView = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  // Handle Edit Modal
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setEditFormData({
      ...course,
      skills: Array.isArray(course.skills) ? course.skills.join(', ') : course.skills,
      startDate: course.start_date || '',
      endDate: course.end_date || ''
    });
    setShowEditModal(true);
  };

  // Handle Add New Course
  const handleAddNew = () => {
    setEditFormData({
      id: Date.now(),
      title: '',
      description: '',
      category: 'Technology',
      level: 'Beginner',
      duration: '8 weeks',
      price: 0,
      instructor: '',
      prerequisites: '',
      status: 'draft',
      enrollments: 0,
      rating: 0,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80',
      skills: '',
      startDate: '',
      endDate: ''
    });
    setShowAddModal(true);
  };

  // Add new course
  const handleAddSave = async (e) => {
    e.preventDefault();
    const newCourse = {
      ...editFormData,
      skills: editFormData.skills,
      company_id: 1
    };
    const response = await fetch('/api/companies/company-courses/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse) // <-- Use newCourse here!
    });
    const result = await response.json();
    if (result.success) {
      setShowAddModal(false);
      fetchCourses();
    }
  };

  // Handle Delete
  const handleDelete = async (course_id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const response = await fetch(`/api/companies/company-courses/${course_id}/delete/`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        fetchCourses();
      }
    }
  };

  // Edit course
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const updatedCourse = {
      ...editFormData,
      skills: editFormData.skills,
      start_date: editFormData.startDate,
      end_date: editFormData.endDate,
    };
    delete updatedCourse.startDate;
    delete updatedCourse.endDate;
    const response = await fetch(`/api/companies/company-courses/${selectedCourse.course_id}/update/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCourse)
    });
    const result = await response.json();
    if (result.success) {
      setShowEditModal(false);
      setSelectedCourse(null);
      fetchCourses();
    }
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

  // Get level color
  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="course-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
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
      <main className={`course-main ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* REMOVED HERO SECTION */}

        {/* Search and Filter Section */}
        <section className="course-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search courses, instructors, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="filter-select"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Courses Section Header */}
        <section className="course-section-unique">
          <div className="course-section-header-unique">
            <h2>All Courses</h2>
            <button className="course-company-btn-add-new" onClick={handleAddNew}>
              + New Course
            </button>
          </div>
          
          {/* Courses Grid */}
          <div className="course-grid-container-unique">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-card-unique">
                <button 
                  className="btn-delete-course"
                  onClick={() => handleDelete(course.course_id)}
                  title="Delete Course"
                >
                  ✕
                </button>
                
                <div className="course-card-image-container">
                  <img src={course.image} alt={course.title} className="course-card-image" />
                  <div className="course-card-overlay">
                    <span className="course-card-category">{course.category}</span>
                    <div className="course-card-stats">
                      <span>👥 {course.enrollments}</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="course-card-content">
                  <div className="course-card-header">
                    <h3 className="course-card-title">{course.title}</h3>
                    <div className="course-card-meta">
                      <span 
                        className="course-status-badge" 
                        style={{ backgroundColor: getStatusColor(course.status) }}
                      >
                        {course.status}
                      </span>
                      <span 
                        className="course-level-badge" 
                        style={{ color: getLevelColor(course.level) }}
                      >
                        {course.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="course-card-details">
                    <span>⏱️ {course.duration}</span>
                    <span>📚 {course.level}</span>
                    <span>💰 ${course.price}</span>
                  </div>
                  
                  <div className="course-card-instructor">
                    <span>👨‍🏫 {course.instructor}</span>
                  </div>
                  
                  <p className="course-card-description">{course.description}</p>
                  
                  <div className="course-card-skills">
                    {course.skills.map((skill, index) => (
                      <span key={index} className="course-skill">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="course-card-actions">
                    <button className="course-btn-view" onClick={() => handleView(course)}>View</button>
                    <button className="course-btn-edit" onClick={() => handleEdit(course)}>Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Course Statistics */}
        <section className="course-stats">
          <div className="stats-content">
            <h2>Course Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-value">{courses.length}</div>
                <div className="stat-label">Total Courses</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{courses.filter(c => c.status === 'active').length}</div>
                <div className="stat-label">Active Courses</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{courses.reduce((sum, c) => sum + c.enrollments, 0)}</div>
                <div className="stat-label">Total Enrollments</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💰</div>
                <div className="stat-value">${courses.reduce((sum, c) => sum + (c.price * c.enrollments), 0).toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="course-footer">
          <div className="footer-content">
            <h3>Stay Connected</h3>
            <div className="newsletter">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </footer>
      </main>

      {/* View Modal */}
      {showViewModal && selectedCourse && (
        <div className="company-course-admin-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="company-course-admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-course-admin-modal-header">
              <h2>View Course</h2>
              <button className="company-course-admin-modal-close" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="company-course-admin-modal-body">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                className="company-course-admin-modal-image"
              />
              <div className="company-course-admin-modal-info">
                <div className="company-course-admin-modal-title-section">
                  <h3>{selectedCourse.title}</h3>
                  <div className="company-course-admin-modal-badges">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(selectedCourse.status) }}
                    >
                      {selectedCourse.status}
                    </span>
                    <span 
                      className="level-badge" 
                      style={{ color: getLevelColor(selectedCourse.level) }}
                    >
                      {selectedCourse.level}
                    </span>
                  </div>
                </div>
                
                <div className="company-course-admin-modal-meta">
                  <div className="company-course-admin-meta-item" data-info="instructor">
                    <strong>Instructor:</strong> {selectedCourse.instructor}
                  </div>
                  <div className="company-course-admin-meta-item" data-info="category">
                    <strong>Category:</strong> {selectedCourse.category}
                  </div>
                  <div className="company-course-admin-meta-item" data-info="duration">
                    <strong>Duration:</strong> {selectedCourse.duration}
                  </div>
                  <div className="company-course-admin-meta-item" data-info="level">
                    <strong>Level:</strong> {selectedCourse.level}
                  </div>
                  <div className="company-course-admin-meta-item" data-info="price">
                    <strong>Price:</strong> ${selectedCourse.price}
                  </div>
                  <div className="company-course-admin-meta-item" data-info="enrollments">
                    <strong>Enrollments:</strong> {selectedCourse.enrollments} students
                  </div>
                  <div className="company-course-admin-meta-item" data-info="rating">
                    <strong>Rating:</strong> {selectedCourse.rating}/5.0
                  </div>
                  <div className="company-course-admin-meta-item" data-info="start-date">
                    <strong>Start Date:</strong> {new Date(selectedCourse.startDate).toLocaleDateString()}
                  </div>
                  <div className="company-course-admin-meta-item" data-info="end-date">
                    <strong>End Date:</strong> {new Date(selectedCourse.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="company-course-admin-modal-description">
                  <strong>Description:</strong>
                  <p>{selectedCourse.description}</p>
                </div>
                
                <div className="company-course-admin-modal-skills">
                  <strong>Skills Covered:</strong>
                  <div className="company-course-admin-skills-container">
                    {selectedCourse.skills.map((skill, index) => (
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
      {showEditModal && selectedCourse && (
        <div className="company-course-admin-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="company-course-admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-course-admin-modal-header">
              <h2>Edit Course</h2>
              <button className="company-course-admin-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="company-course-admin-modal-body">
              <form onSubmit={handleSaveEdit}>
                <div className="company-course-admin-form-group">
                  <label>Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.filter(cat => cat !== 'All Categories').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="company-course-admin-form-group">
                    <label>Level</label>
                    <select
                      name="level"
                      value={editFormData.level}
                      onChange={handleInputChange}
                      required
                    >
                      {levels.filter(lvl => lvl !== 'All Levels').map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={editFormData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 8 weeks"
                      required
                    />
                  </div>
                  <div className="company-course-admin-form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="10"
                      required
                    />
                  </div>
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={editFormData.instructor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="company-course-admin-form-group">
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
                
                <div className="company-course-admin-form-group">
                  <label>Prerequisites</label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={editFormData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Programming, JavaScript"
                  />
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editFormData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="company-course-admin-form-group">
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
                
                <div className="company-course-admin-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-group">
                  <label>Skills Covered (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={editFormData.skills}
                    onChange={handleInputChange}
                    placeholder="React, JavaScript, TypeScript, Redux"
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={editFormData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-actions">
                  <button type="button" className="company-course-admin-btn-cancel" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="company-course-admin-btn-save">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {showAddModal && (
        <div className="company-course-admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="company-course-admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-course-admin-modal-header">
              <h2>Add New Course</h2>
              <button className="company-course-admin-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="company-course-admin-modal-body">
              <form onSubmit={handleAddSave}>
                <div className="company-course-admin-form-group">
                  <label>Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.filter(cat => cat !== 'All Categories').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="company-course-admin-form-group">
                    <label>Level</label>
                    <select
                      name="level"
                      value={editFormData.level}
                      onChange={handleInputChange}
                      required
                    >
                      {levels.filter(lvl => lvl !== 'All Levels').map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={editFormData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 8 weeks"
                      required
                    />
                  </div>
                  <div className="company-course-admin-form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="10"
                      required
                    />
                  </div>
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={editFormData.instructor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="company-course-admin-form-group">
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
                
                <div className="company-course-admin-form-group">
                  <label>Prerequisites</label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={editFormData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Programming, JavaScript"
                  />
                </div>
                
                <div className="company-course-admin-form-row">
                  <div className="company-course-admin-form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editFormData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="company-course-admin-form-group">
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
                
                <div className="company-course-admin-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-group">
                  <label>Skills Covered (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={editFormData.skills}
                    onChange={handleInputChange}
                    placeholder="React, JavaScript, TypeScript, Redux"
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={editFormData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="company-course-admin-form-actions">
                  <button type="button" className="company-course-admin-btn-cancel" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="company-course-admin-btn-save">Add Course</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;