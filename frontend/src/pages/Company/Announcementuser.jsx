import React, { useState } from 'react';
import CompanyUserSidebar from '../../components/Navigation/CompanyUsersidebar'; // CHANGED: Import CompanyUserSidebar
import CompanyDashboardNavbar from '../../components/Navigation/CompanyDashboardNavbar';
import './Announcementuser.css';

const Announcementuser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Partnership with Tech Giants',
      description: 'We are thrilled to announce our strategic partnership with leading technology companies to enhance our innovation capabilities.',
      category: 'Partnership',
      date: '2024-01-15',
      author: 'InnovateTech Leadership',
      status: 'published',
      priority: 'high',
      tags: ['Partnership', 'Technology', 'Innovation'],
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', // Business partnership handshake
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: 'Q4 2023 Outstanding Performance Award',
      description: 'InnovateTech has been recognized for exceptional performance in Q4 2023, achieving record-breaking growth and customer satisfaction.',
      category: 'Achievement',
      date: '2024-01-10',
      author: 'HR Department',
      status: 'published',
      priority: 'medium',
      tags: ['Award', 'Performance', 'Achievement'],
      image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80', // Trophy/award
      views: 890,
      likes: 67
    },
    {
      id: 3,
      title: 'New Office Opening in Silicon Valley',
      description: 'We are expanding our operations with a new state-of-the-art office in Silicon Valley to better serve our clients and attract top talent.',
      category: 'Expansion',
      date: '2024-01-05',
      author: 'Operations Team',
      status: 'published',
      priority: 'high',
      tags: ['Expansion', 'Office', 'Growth'],
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', // Modern office exterior
      views: 2100,
      likes: 145
    },
    {
      id: 4,
      title: 'Innovation Lab Launch',
      description: 'Our new Innovation Lab is now open, featuring cutting-edge research facilities and collaborative spaces for breakthrough discoveries.',
      category: 'Innovation',
      date: '2024-01-03',
      author: 'R&D Department',
      status: 'draft',
      priority: 'medium',
      tags: ['Innovation', 'Research', 'Lab'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', // Tech innovation lab
      views: 445,
      likes: 32
    },
    {
      id: 5,
      title: 'Sustainability Initiative Achievement',
      description: 'InnovateTech has successfully reduced carbon emissions by 40% through our comprehensive sustainability programs.',
      category: 'Sustainability',
      date: '2023-12-28',
      author: 'Sustainability Team',
      status: 'published',
      priority: 'medium',
      tags: ['Sustainability', 'Environment', 'Achievement'],
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80', // Green nature/environment
      views: 756,
      likes: 98
    },
    {
      id: 6,
      title: 'Employee Recognition Program',
      description: 'Celebrating our exceptional team members who have made outstanding contributions to our company culture and success.',
      category: 'HR',
      date: '2023-12-20',
      author: 'Human Resources',
      status: 'published',
      priority: 'low',
      tags: ['Recognition', 'Employees', 'Culture'],
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80', // Happy employees/team
      views: 623,
      likes: 54
    }
  ]);

  const categories = ['All', 'Partnership', 'Achievement', 'Expansion', 'Innovation', 'Sustainability', 'HR'];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || announcement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle View Modal
  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  // Add this function to handle status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#10b981'; // green
      case 'pending':
        return '#f59e0b'; // yellow
      case 'draft':
        return '#6b7280'; // gray
      case 'expired':
        return '#ef4444'; // red
      case 'published':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // default gray
    }
  };

  // Add this function alongside getStatusColor
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // yellow
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="announcement-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <CompanyUserSidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* NAVBAR */}
      <CompanyDashboardNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className={`announcement-main ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* REMOVED HERO SECTION */}

        <section className="announcement-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search announcements, categories, or content..."
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
          </div>
        </section>

        <section className="announcements">
          <div className="announcements-header">
            <h2>Announcements</h2>
            {/* NO Add New button for user */}
          </div>

          <div className="announcements-table">
            <div className="table-header">
              <div className="header-cell announcement-col">ANNOUNCEMENT</div>
              <div className="header-cell date-col">PUBLISH DATE</div>
              <div className="header-cell status-col">STATUS</div>
              <div className="header-cell actions-col">ACTIONS</div>
            </div>

            <div className="table-body">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="table-row">
                  <div className="cell announcement-cell">
                    <div className="announcement-info">
                      <div className="announcement-icon">📢</div>
                      <div className="announcement-details">
                        <h3 className="announcement-title">{announcement.title}</h3>
                        <p className="announcement-subtitle">{announcement.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="cell date-cell">
                    <span className="date-text">{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                  <div className="cell status-cell">
                    <span 
                      className={`status-badge ${announcement.status}`}
                      style={{ backgroundColor: getStatusColor(announcement.status) }}
                    >
                      {announcement.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="cell actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleView(announcement)}
                        title="View Announcement"
                      >
                        👁️
                      </button>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pagination">
            <button className="pagination-btn">
              ← Previous Page
            </button>
            <span className="pagination-info">PAGE 1 OF 1</span>
            <button className="pagination-btn">
              Next Page →
            </button>
          </div>
        </section>

        <section className="announcement-stats">
          <div className="stats-content">
            <h2>Announcement Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📢</div>
                <div className="stat-value">{announcements.length}</div>
                <div className="stat-label">Total Announcements</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{announcements.filter(a => a.status === 'published').length}</div>
                <div className="stat-label">Published</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📝</div>
                <div className="stat-value">{announcements.filter(a => a.status === 'draft').length}</div>
                <div className="stat-label">Drafts</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👁️</div>
                <div className="stat-value">{announcements.reduce((sum, a) => sum + a.views, 0)}</div>
                <div className="stat-label">Total Views</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="announcement-footer">
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
      {showViewModal && selectedAnnouncement && (
        <div className="company-user-announcement-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="company-user-announcement-modal-content" onClick={e => e.stopPropagation()}>
            <div className="company-user-announcement-modal-header">
              <h2>View Announcement</h2>
              <button className="company-user-announcement-modal-close" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="company-user-announcement-modal-body">
              <img src={selectedAnnouncement.image} alt={selectedAnnouncement.title} className="company-user-announcement-modal-image" />
              <div className="company-user-announcement-modal-info">
                <div className="company-user-announcement-modal-title-section">
                  <h3>{selectedAnnouncement.title}</h3>
                  <div className="company-user-announcement-modal-badges">
                    <span 
                      className={`company-user-announcement-status-badge ${selectedAnnouncement.status}`}
                    >
                      {selectedAnnouncement.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span 
                      className="company-user-announcement-priority-badge"
                      style={{ color: getPriorityColor(selectedAnnouncement.priority) }}
                    >
                      {selectedAnnouncement.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                
                <div className="company-user-announcement-modal-meta">
                  <div className="company-user-announcement-meta-item">
                    <strong>📅 Date:</strong> {new Date(selectedAnnouncement.date).toLocaleDateString()}
                  </div>
                  <div className="company-user-announcement-meta-item">
                    <strong>👤 Author:</strong> {selectedAnnouncement.author}
                  </div>
                  <div className="company-user-announcement-meta-item">
                    <strong>🏷️ Category:</strong> {selectedAnnouncement.category}
                  </div>
                  <div className="company-user-announcement-meta-item">
                    <strong>📊 Statistics:</strong> {selectedAnnouncement.views} views, {selectedAnnouncement.likes} likes
                  </div>
                </div>
                
                <div className="company-user-announcement-modal-description">
                  <strong>📝 Description:</strong>
                  <p>{selectedAnnouncement.description}</p>
                </div>
                
                <div className="company-user-announcement-modal-tags">
                  <strong>🏷️ Tags:</strong>
                  <div className="company-user-announcement-tags-container">
                    {selectedAnnouncement.tags.map((tag, index) => (
                      <span key={index} className="company-user-announcement-tag">{tag}</span>
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

export default Announcementuser;