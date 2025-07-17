import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './Courseuser.css';

const Courseuser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  // Sample courses data (same as Course.jsx)
  const [courses] = useState([
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

  // Handle View Modal
  const handleView = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  return (
    <div className="courseuser-page">
      <div className="courseuser-container">
        <Sidebar 
          activePage="course" 
          onExpandChange={setIsSidebarExpanded}
          userType="user"
        />

        <main className={`courseuser-main ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {/* Hero Section - Same as Course page */}
          <section className="courseuser-hero-unique">
            <div className="courseuser-hero-content">
              <h1>Available Courses</h1>
              <p>Browse and view our latest courses</p>
            </div>
          </section>

          {/* Search and Filter Section - Same as Course page */}
          <section className="courseuser-search">
            <div className="courseuser-search-container">
              <input
                type="text"
                placeholder="Search courses, instructors, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="courseuser-search-input"
              />
            </div>
            
            <div className="courseuser-filter-container">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="courseuser-filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="courseuser-filter-select"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Courses Section - Same as Course page but NO Add New button */}
          <section className="courseuser-section-unique">
            <div className="courseuser-section-header-unique">
              <h2>All Courses</h2>
              {/* NO Add New button for user */}
            </div>
            
            {/* Courses Grid - Same as Course page */}
            <div className="courseuser-grid-container-unique">
              {filteredCourses.map((course) => (
                <div key={course.id} className="courseuser-card-unique">
                  {/* NO delete button for user */}
                  
                  <div className="courseuser-card-image-container">
                    <img src={course.image} alt={course.title} className="courseuser-card-image" />
                    <div className="courseuser-card-overlay">
                      <span className="courseuser-card-category">{course.category}</span>
                      <div className="courseuser-card-stats">
                        <span>👥 {course.enrollments}</span>
                        <span>⭐ {course.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="courseuser-card-content">
                    <div className="courseuser-card-header">
                      <h3 className="courseuser-card-title">{course.title}</h3>
                      <div className="courseuser-card-meta">
                        <span 
                          className="courseuser-status-badge" 
                          style={{ backgroundColor: getStatusColor(course.status) }}
                        >
                          {course.status}
                        </span>
                        <span 
                          className="courseuser-level-badge" 
                          style={{ color: getLevelColor(course.level) }}
                        >
                          {course.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="courseuser-card-details">
                      <span>⏱️ {course.duration}</span>
                      <span>📚 {course.level}</span>
                      <span>💰 ${course.price}</span>
                    </div>
                    
                    <div className="courseuser-card-instructor">
                      <span>👨‍🏫 {course.instructor}</span>
                    </div>
                    
                    <p className="courseuser-card-description">{course.description}</p>
                    
                    <div className="courseuser-card-skills">
                      {course.skills.map((skill, index) => (
                        <span key={index} className="courseuser-skill">{skill}</span>
                      ))}
                    </div>
                    
                    <div className="courseuser-card-actions">
                      <button className="courseuser-btn-view" onClick={() => handleView(course)}>View</button>
                      {/* NO Edit button for user */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Course Statistics - Same as Course page */}
          <section className="courseuser-stats">
            <div className="courseuser-stats-content">
              <h2>Course Statistics</h2>
              <div className="courseuser-stats-grid">
                <div className="courseuser-stat-item">
                  <div className="courseuser-stat-icon">📚</div>
                  <div className="courseuser-stat-value">{courses.length}</div>
                  <div className="courseuser-stat-label">Total Courses</div>
                </div>
                <div className="courseuser-stat-item">
                  <div className="courseuser-stat-icon">✅</div>
                  <div className="courseuser-stat-value">{courses.filter(c => c.status === 'active').length}</div>
                  <div className="courseuser-stat-label">Active Courses</div>
                </div>
                <div className="courseuser-stat-item">
                  <div className="courseuser-stat-icon">👥</div>
                  <div className="courseuser-stat-value">{courses.reduce((sum, c) => sum + c.enrollments, 0)}</div>
                  <div className="courseuser-stat-label">Total Enrollments</div>
                </div>
                <div className="courseuser-stat-item">
                  <div className="courseuser-stat-icon">💰</div>
                  <div className="courseuser-stat-value">${courses.reduce((sum, c) => sum + (c.price * c.enrollments), 0).toLocaleString()}</div>
                  <div className="courseuser-stat-label">Total Revenue</div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer - Same as Course page */}
          <footer className="courseuser-footer">
            <div className="courseuser-footer-content">
              <h3>Stay Connected</h3>
              <div className="courseuser-newsletter">
                <input type="email" placeholder="Your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* View Modal - Same as Course page */}
      {showViewModal && selectedCourse && (
        <div className="courseuser-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="courseuser-modal-content" onClick={e => e.stopPropagation()}>
            <div className="courseuser-modal-header">
              <h2>View Course</h2>
              <button className="courseuser-modal-close" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="courseuser-modal-body">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                className="courseuser-modal-image"
              />
              <div className="courseuser-modal-info">
                <div className="courseuser-modal-title-section">
                  <h3>{selectedCourse.title}</h3>
                  <div className="courseuser-modal-badges">
                    <span 
                      className="courseuser-status-badge" 
                      style={{ backgroundColor: getStatusColor(selectedCourse.status) }}
                    >
                      {selectedCourse.status}
                    </span>
                    <span 
                      className="courseuser-level-badge" 
                      style={{ color: getLevelColor(selectedCourse.level) }}
                    >
                      {selectedCourse.level}
                    </span>
                  </div>
                </div>
                
                <div className="courseuser-modal-meta">
                  <div className="courseuser-meta-item">
                    <strong>👨‍🏫 Instructor:</strong> {selectedCourse.instructor}
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>🏷️ Category:</strong> {selectedCourse.category}
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>⏱️ Duration:</strong> {selectedCourse.duration}
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>📚 Level:</strong> {selectedCourse.level}
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>💰 Price:</strong> ${selectedCourse.price}
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>📋 Prerequisites:</strong> {selectedCourse.prerequisites}
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>👥 Enrollments:</strong> {selectedCourse.enrollments} students
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>⭐ Rating:</strong> {selectedCourse.rating}/5.0
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>📅 Start Date:</strong> {new Date(selectedCourse.startDate).toLocaleDateString()}
                  </div>
                  <div className="courseuser-meta-item">
                    <strong>📅 End Date:</strong> {new Date(selectedCourse.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="courseuser-modal-description">
                  <strong>📝 Description:</strong>
                  <p>{selectedCourse.description}</p>
                </div>
                
                <div className="courseuser-modal-skills">
                  <strong>🛠️ Skills Covered:</strong>
                  <div className="courseuser-skills-container">
                    {selectedCourse.skills.map((skill, index) => (
                      <span key={index} className="courseuser-skill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courseuser;