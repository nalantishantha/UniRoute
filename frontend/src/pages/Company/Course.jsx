import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './Course.css';

const Course = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  // Sample courses data
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Advanced React Development',
      description: 'Master advanced React concepts including hooks, context API, performance optimization, and modern React patterns. Build scalable applications with best practices.',
      category: 'Technology',
      level: 'Advanced',
      duration: '12 weeks',
      price: 299,
      instructor: 'Dr. Sarah Johnson',
      prerequisites: 'Basic React, JavaScript ES6',
      status: 'active',
      enrollments: 156,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80',
      skills: ['React', 'JavaScript', 'Redux', 'TypeScript'],
      startDate: '2024-07-01',
      endDate: '2024-09-24'
    },
    {
      id: 2,
      title: 'Digital Marketing Fundamentals',
      description: 'Learn comprehensive digital marketing strategies including SEO, social media marketing, content marketing, and analytics to grow your business online.',
      category: 'Marketing',
      level: 'Beginner',
      duration: '8 weeks',
      price: 199,
      instructor: 'Michael Chen',
      prerequisites: 'Basic Computer Skills',
      status: 'active',
      enrollments: 243,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
      skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
      startDate: '2024-06-15',
      endDate: '2024-08-10'
    },
    {
      id: 3,
      title: 'Data Science with Python',
      description: 'Comprehensive data science course covering Python programming, statistics, machine learning, and data visualization using popular libraries.',
      category: 'Technology',
      level: 'Intermediate',
      duration: '16 weeks',
      price: 399,
      instructor: 'Dr. Emily Rodriguez',
      prerequisites: 'Basic Programming, Statistics',
      status: 'active',
      enrollments: 189,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      skills: ['Python', 'Machine Learning', 'Pandas', 'Matplotlib'],
      startDate: '2024-07-10',
      endDate: '2024-10-30'
    },
    {
      id: 4,
      title: 'UX/UI Design Masterclass',
      description: 'Complete UX/UI design course covering user research, wireframing, prototyping, and design systems. Learn industry-standard design tools.',
      category: 'Design',
      level: 'Intermediate',
      duration: '14 weeks',
      price: 349,
      instructor: 'Alexandra Kim',
      prerequisites: 'Basic Design Knowledge',
      status: 'draft',
      enrollments: 0,
      rating: 0,
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&q=80',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      startDate: '2024-08-01',
      endDate: '2024-11-05'
    },
    {
      id: 5,
      title: 'Business Strategy & Management',
      description: 'Learn strategic thinking, business planning, leadership skills, and management techniques to advance your career in business.',
      category: 'Business',
      level: 'Advanced',
      duration: '10 weeks',
      price: 279,
      instructor: 'Robert Davis',
      prerequisites: 'Work Experience, Business Fundamentals',
      status: 'active',
      enrollments: 127,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
      skills: ['Strategy', 'Leadership', 'Planning', 'Management'],
      startDate: '2024-06-20',
      endDate: '2024-08-29'
    },
    {
      id: 6,
      title: 'Mobile App Development',
      description: 'Build native mobile applications for iOS and Android using React Native. Learn mobile development best practices and deployment strategies.',
      category: 'Technology',
      level: 'Advanced',
      duration: '18 weeks',
      price: 449,
      instructor: 'Jennifer Liu',
      prerequisites: 'React, JavaScript, Mobile Concepts',
      status: 'active',
      enrollments: 98,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80',
      skills: ['React Native', 'Mobile Development', 'iOS', 'Android'],
      startDate: '2024-07-05',
      endDate: '2024-11-15'
    }
  ]);

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
      skills: course.skills.join(', ')
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

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  // Handle Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedCourse = {
      ...editFormData,
      skills: editFormData.skills.split(',').map(skill => skill.trim()),
      price: parseFloat(editFormData.price)
    };
    
    setCourses(courses.map(course => 
      course.id === selectedCourse.id ? updatedCourse : course
    ));
    setShowEditModal(false);
    setSelectedCourse(null);
  };

  // Handle Add New Save
  const handleAddSave = (e) => {
    e.preventDefault();
    const newCourse = {
      ...editFormData,
      skills: editFormData.skills.split(',').map(skill => skill.trim()),
      price: parseFloat(editFormData.price)
    };
    
    setCourses([...courses, newCourse]);
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
      <div className="course-container">
        {/* Sidebar Component with callback */}
        <Sidebar 
          activePage="course" 
          onExpandChange={setIsSidebarExpanded}
        />

        {/* Main Content with responsive class */}
        <main className={`course-main ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {/* Hero Section */}
          <section className="course-hero-unique">
            <div className="course-hero-content">
              <h1>Course Management</h1>
              <p>Create and manage exceptional courses for talented students</p>
            </div>
          </section>

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
              <button className="btn-add-new" onClick={handleAddNew}>
                + New Course
              </button>
            </div>
            
            {/* Courses Grid */}
            <div className="course-grid-container-unique">
              {filteredCourses.map((course) => (
                <div key={course.id} className="course-card-unique">
                  <button 
                    className="btn-delete-course"
                    onClick={() => handleDelete(course.id)}
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
      </div>

      {/* View Modal */}
      {showViewModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>View Course</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                className="modal-image course-modal-image"
              />
              <div className="modal-info">
                <div className="modal-title-section">
                  <h3>{selectedCourse.title}</h3>
                  <div className="modal-badges">
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
                
                <div className="modal-meta">
                  <div className="meta-item">
                    <strong>👨‍🏫 Instructor:</strong> {selectedCourse.instructor}
                  </div>
                  <div className="meta-item">
                    <strong>🏷️ Category:</strong> {selectedCourse.category}
                  </div>
                  <div className="meta-item">
                    <strong>⏱️ Duration:</strong> {selectedCourse.duration}
                  </div>
                  <div className="meta-item">
                    <strong>📚 Level:</strong> {selectedCourse.level}
                  </div>
                  <div className="meta-item">
                    <strong>💰 Price:</strong> ${selectedCourse.price}
                  </div>
                  <div className="meta-item">
                    <strong>📋 Prerequisites:</strong> {selectedCourse.prerequisites}
                  </div>
                  <div className="meta-item">
                    <strong>👥 Enrollments:</strong> {selectedCourse.enrollments} students
                  </div>
                  <div className="meta-item">
                    <strong>⭐ Rating:</strong> {selectedCourse.rating}/5.0
                  </div>
                  <div className="meta-item">
                    <strong>📅 Start Date:</strong> {new Date(selectedCourse.startDate).toLocaleDateString()}
                  </div>
                  <div className="meta-item">
                    <strong>📅 End Date:</strong> {new Date(selectedCourse.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="modal-description">
                  <strong>📝 Description:</strong>
                  <p>{selectedCourse.description}</p>
                </div>
                
                <div className="modal-skills">
                  <strong>🛠️ Skills Covered:</strong>
                  <div className="skills-container">
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
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Course</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveEdit}>
                <div className="form-group">
                  <label>Course Title</label>
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
                  <div className="form-group">
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
                
                <div className="form-row">
                  <div className="form-group">
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
                  <div className="form-group">
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
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={editFormData.instructor}
                      onChange={handleInputChange}
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
                  <label>Prerequisites</label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={editFormData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Programming, JavaScript"
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
              <h2>Add New Course</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSave}>
                <div className="form-group">
                  <label>Course Title</label>
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
                  <div className="form-group">
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
                
                <div className="form-row">
                  <div className="form-group">
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
                  <div className="form-group">
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
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={editFormData.instructor}
                      onChange={handleInputChange}
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
                  <label>Prerequisites</label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={editFormData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Programming, JavaScript"
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
                  <button type="submit" className="btn-save">Add Course</button>
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