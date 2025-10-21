import React, { useState, useEffect } from 'react';
import CompanySidebar from '../../components/Navigation/CompanySidebar';
import CompanyDashboardNavbar from '../../components/Navigation/CompanyDashboardNavbar';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  main: (isSidebarOpen) => ({
    flex: 1,
    marginLeft: isSidebarOpen ? 288 : 0,
    overflowY: 'auto',
    minHeight: '100vh',
    transition: 'margin-left 0.3s ease',
    background: '#f8fafc'
  }),
  searchSection: {
    padding: '2rem',
    background: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '30rem'
  },
  searchContainer: {
    display: 'flex',
    gap: '1rem',
    flex: 1,
    maxWidth: 600
  },
  searchInput: {
    flex: 1,
    padding: '1rem 1.5rem',
    border: '2px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '1rem',
    background: '#fff',
    transition: 'all 0.3s ease',
    outline: 'none',
    maxWidth: 600
  },
  filterContainer: {
    display: 'flex',
    gap: '1rem'
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.9rem',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: 140,
    textAlign: 'center'
  },
  announcements: {
    padding: '2rem',
    background: '#f8fafc',
    maxWidth: 1200,
    margin: '0 auto'
  },
  announcementsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '0 1rem'
  },
  announcementsHeaderH2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0
  },
  btnAddNew: {
    background: ' #174A7C var(--tw-gradient-to-position)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
  },
  announcementsTable: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 100px',
    background: '#f8fafc',
    borderBottom: '2px solid #e5e7eb',
    padding: '1rem',
    fontWeight: 600,
    color: '#374151',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  headerCell: {
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center'
  },
  tableBody: {
    background: '#fff'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 100px',
    padding: '1.5rem 1rem',
    borderBottom: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
    alignItems: 'center'
  },
  cell: {
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center'
  },
  announcementInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  announcementIcon: {
    width: 48,
    height: 48,
    background: '#eff6ff',
    border: '2px solid #dbeafe',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0
  },
  announcementDetails: {
    flex: 1,
    minWidth: 0
  },
  announcementTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 0.25rem 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  announcementSubtitle: {
    fontSize: '0.85rem',
    color: '#2563eb',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  dateText: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontWeight: 500
  },
  statusBadge: (status) => ({
    padding: '0.3rem 1rem',
    borderRadius: 16,
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    minWidth: 115,
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
    background: status === 'draft'
      ? 'linear-gradient(135deg, #655c5cff, #555551ff)'
      : ' #174A7C var(--tw-gradient-to-position)'
  }),
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginLeft: '-16px' // Move buttons to the left
  },
  btnAction: {
    width: 32,
    height: 32,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    background: '#f3f4f6',
    color: '#2563eb'
  },
  btnDelete: {
    background: '#fef2f2',
    color: '#dc2626'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    padding: '0 1rem'
  },
  paginationBtn: {
    background: '#f3f4f6',
    color: '#2563eb',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: 6,
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  paginationInfo: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontWeight: 500,
    letterSpacing: '0.025em'
  },
  stats: {
    padding: '2rem',
    background: '#fff',
    borderRadius: 12,
    margin: '2rem auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    maxWidth: 1200
  },
  statsContent: {
    maxWidth: 1200,
    margin: '0 auto',
    textAlign: 'center'
  },
  statsContentH2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  statItem: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease'
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontWeight: 500
  },
  footer: {
    marginTop: '2rem',
    background: '#f8fafc',
    padding: '2rem 0',
    borderTop: '1px solid #e5e7eb'
  },
  footerContent: {
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center'
  },
  newsletter: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
  newsletterInput: {
    padding: '0.75rem 1.25rem',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '1rem',
    outline: 'none'
  },
  newsletterBtn: {
    background: '#174A7C var(--tw-gradient-to-position)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: 8,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  modalContent: {
    background: '#fff',
    borderRadius: 20,
    maxWidth: 520,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    border: '1px solid #e2e8f0'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 2rem 1rem 2rem',
    marginBottom: 0,
    borderBottom: '1px solid #f1f5f9'
  },
  modalHeaderH2: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
    lineHeight: 1.3,
    flex: 1,
    paddingRight: '1.5rem'
  },
  modalClose: {
    background: '#f8fafc',
    border: 'none',
    width: 40,
    height: 40,
    borderRadius: '50%',
    fontSize: '1.4rem',
    color: '#64748b',
    cursor: 'pointer',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    fontWeight: 300
  },
  modalBody: {
    padding: '1rem 2rem 2rem 2rem'
  },
  modalImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  modalTitleSection: {
    marginBottom: '1.5rem'
  },
  modalBadges: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  priorityBadge: (priority) => ({
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: priority === 'high'
      ? '#ef4444'
      : priority === 'medium'
      ? '#f59e0b'
      : priority === 'low'
      ? '#10b981'
      : '#6b7280'
  }),
  modalMeta: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  metaItem: {
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: 8,
    fontSize: '0.95rem',
    borderLeft: '4px solid #2563eb',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  modalDescription: {
    marginBottom: '1.5rem'
  },
  modalDescriptionStrong: {
    color: '#1e293b',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.75rem',
    fontSize: '1rem'
  },
  modalDescriptionP: {
    color: '#475569',
    lineHeight: 1.6,
    margin: 0,
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: 8,
    borderLeft: '4px solid #10b981'
  },
  modalTags: {
    marginBottom: '1rem'
  },
  modalTagsStrong: {
    color: '#1e293b',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.75rem',
    fontSize: '1rem'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  tag: {
    background: '#eff6ff',
    color: '#2563eb',
    padding: '0.4rem 0.8rem',
    borderRadius: 20,
    fontSize: '0.8rem',
    fontWeight: 500,
    border: '1px solid #dbeafe'
  },
  formGroup: {
    marginBottom: '1.25rem'
  },
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  formGroupLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#374151',
    fontSize: '0.9rem'
  },
  formInput: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    background: '#fff'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  btnCancel: {
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnSave: {
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

const Announcement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [editFormData, setEditFormData] = useState({});
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
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
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

  // Handle Edit Modal
  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setEditFormData({
      ...announcement,
      tags: announcement.tags.join(', ')
    });
    setShowEditModal(true);
  };

  // Handle Add New Announcement
  const handleAddNew = () => {
    setEditFormData({
      id: Date.now(),
      title: '',
      description: '',
      category: 'Achievement',
      date: new Date().toISOString().split('T')[0],
      author: 'InnovateTech Leadership',
      status: 'draft',
      priority: 'medium',
      tags: '',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
      views: 0,
      likes: 0
    });
    setShowAddModal(true);
  };

  // Handle Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const updatedAnnouncement = {
      ...editFormData,
      tags: editFormData.tags,
      company_id: 1 // Replace with actual company_id
    };
    const response = await fetch(`/api/companies/company-announcements/${selectedAnnouncement.id}/update/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAnnouncement)
    });
    const result = await response.json();
    if (result.success) {
      setShowEditModal(false);
      setSelectedAnnouncement(null);
      // Optionally, re-fetch announcements here
    } else {
      alert(result.message || 'Failed to update announcement');
    }
  };

  // Handle Add New Save
  const handleAddSave = async (e) => {
    e.preventDefault();
    const newAnnouncement = {
      ...editFormData,
      tags: editFormData.tags,
      company_id: 1 // Replace with actual company_id
    };
    const response = await fetch('/api/companies/company-announcements/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnnouncement)
    });
    const result = await response.json();
    if (result.success) {
      setShowAddModal(false);
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

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const response = await fetch(`/api/companies/company-announcements/${id}/delete/`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        // Optionally, re-fetch announcements here
      } else {
        alert(result.message || 'Failed to delete announcement');
      }
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return '#10b981';
      case 'draft': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Handle Add Announcement
  const handleAddAnnouncement = async (formData) => {
    const response = await fetch('/api/companies/company-announcements/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    // handle result (show success, update list, close modal, etc.)
  };

  useEffect(() => {
    async function fetchAnnouncements() {
      const response = await fetch('/api/companies/company-announcements/?company_id=1');
      const result = await response.json();
      if (result.success) {
        setAnnouncements(result.announcements.map(a => ({
          ...a,
          id: a.announcement_id,
          tags: Array.isArray(a.tags) ? a.tags : (a.tags ? a.tags.split(',') : [])
        })));
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <div style={styles.page}>
      <CompanySidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <CompanyDashboardNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />
      <main style={styles.main(isSidebarOpen)}>
        <section style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search announcements, categories, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterContainer}>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </section>
        <section style={styles.announcements}>
          <div style={styles.announcementsHeader}>
            <h2 style={styles.announcementsHeaderH2}>Announcements</h2>
            <button style={styles.btnAddNew} onClick={handleAddNew}>
              + Add Announcements
            </button>
          </div>
          <div style={styles.announcementsTable}>
            <div style={styles.tableHeader}>
              <div style={styles.headerCell}>ANNOUNCEMENT</div>
              <div style={styles.headerCell}>PUBLISH DATE</div>
              <div style={styles.headerCell}>STATUS</div>
              <div style={styles.headerCell}>ACTIONS</div>
            </div>
            <div style={styles.tableBody}>
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} style={styles.tableRow}>
                  <div style={styles.cell}>
                    <div style={styles.announcementInfo}>
                      <div style={styles.announcementIcon}>📢</div>
                      <div style={styles.announcementDetails}>
                        <h3 style={styles.announcementTitle}>{announcement.title}</h3>
                        <p style={styles.announcementSubtitle}>{announcement.category}</p>
                      </div>
                    </div>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.dateText}>{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.cell}>
                    <span 
                      style={styles.statusBadge(announcement.status)}
                    >
                      {announcement.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div style={styles.cell}>
                    <div>
                      <div style={styles.actionButtons}>
                        <button 
                          style={styles.btnAction} 
                          onClick={() => handleView(announcement)}
                          title="View Announcement"
                        >
                          👁️
                        </button>
                        <button 
                          style={styles.btnAction} 
                          onClick={() => handleEdit(announcement)}
                          title="Edit Announcement"
                        >
                          ✏️
                        </button>
                        <button 
                          style={{...styles.btnAction, ...styles.btnDelete}} 
                          onClick={() => handleDelete(announcement.id)}
                          title="Delete Announcement"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.pagination}>
            <button style={styles.paginationBtn}>
              ← Previous Page
            </button>
            <span style={styles.paginationInfo}>PAGE 1 OF 1</span>
            <button style={styles.paginationBtn}>
              Next Page →
            </button>
          </div>
        </section>
        <section style={styles.stats}>
          <div style={styles.statsContent}>
            <h2 style={styles.statsContentH2}>Announcement Statistics</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={styles.statIcon}>📢</div>
                <div style={styles.statValue}>{announcements.length}</div>
                <div style={styles.statLabel}>Total Announcements</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statValue}>{announcements.filter(a => a.status === 'published').length}</div>
                <div style={styles.statLabel}>Published</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statIcon}>📝</div>
                <div style={styles.statValue}>{announcements.filter(a => a.status === 'draft').length}</div>
                <div style={styles.statLabel}>Drafts</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statIcon}>👁️</div>
                <div style={styles.statValue}>{announcements.reduce((sum, a) => sum + a.views, 0)}</div>
                <div style={styles.statLabel}>Total Views</div>
              </div>
            </div>
          </div>
        </section>
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <h3>Stay Connected</h3>
            <div style={styles.newsletter}>
              <input type="email" placeholder="Your email" style={styles.newsletterInput} />
              <button style={styles.newsletterBtn}>Subscribe</button>
            </div>
          </div>
        </footer>

        {/* View Modal */}
        {showViewModal && selectedAnnouncement && (
          <div style={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalHeaderH2}>View Announcement</h2>
                <button style={styles.modalClose} onClick={() => setShowViewModal(false)}>✕</button>
              </div>
              <div style={styles.modalBody}>
                <img src={selectedAnnouncement.image} alt={selectedAnnouncement.title} style={styles.modalImage} />
                <div>
                  <div style={styles.modalTitleSection}>
                    <h3>{selectedAnnouncement.title}</h3>
                    <div style={styles.modalBadges}>
                      <span 
                        style={styles.statusBadge(selectedAnnouncement.status)}
                      >
                        {selectedAnnouncement.status}
                      </span>
                      <span 
                        style={styles.priorityBadge(selectedAnnouncement.priority)}
                      >
                        {selectedAnnouncement.priority} priority
                      </span>
                    </div>
                  </div>
                  <div style={styles.modalMeta}>
                    <div style={styles.metaItem}>
                      <strong>📅 Date:</strong> {new Date(selectedAnnouncement.date).toLocaleDateString()}
                    </div>
                    <div style={styles.metaItem}>
                      <strong>👤 Author:</strong> {selectedAnnouncement.author}
                    </div>
                    <div style={styles.metaItem}>
                      <strong>🏷️ Category:</strong> {selectedAnnouncement.category}
                    </div>
                    <div style={styles.metaItem}>
                      <strong>📊 Statistics:</strong> {selectedAnnouncement.views} views, {selectedAnnouncement.likes} likes
                    </div>
                  </div>
                  <div style={styles.modalDescription}>
                    <strong style={styles.modalDescriptionStrong}>📝 Description:</strong>
                    <p style={styles.modalDescriptionP}>{selectedAnnouncement.description}</p>
                  </div>
                  <div style={styles.modalTags}>
                    <strong style={styles.modalTagsStrong}>🏷️ Tags:</strong>
                    <div style={styles.tagsContainer}>
                      {selectedAnnouncement.tags.map((tag, index) => (
                        <span key={index} style={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedAnnouncement && (
          <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalHeaderH2}>Edit Announcement</h2>
                <button style={styles.modalClose} onClick={() => setShowEditModal(false)}>✕</button>
              </div>
              <div style={styles.modalBody}>
                <form onSubmit={handleSaveEdit}>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleInputChange}
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Category</label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      >
                        {categories.filter(cat => cat !== 'All').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Priority</label>
                      <select
                        name="priority"
                        value={editFormData.priority}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Status</label>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Author</label>
                    <input
                      type="text"
                      name="author"
                      value={editFormData.author}
                      onChange={handleInputChange}
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleInputChange}
                      rows="4"
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={editFormData.tags}
                      onChange={handleInputChange}
                      placeholder="Achievement, Partnership, Innovation"
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={editFormData.image}
                      onChange={handleInputChange}
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formActions}>
                    <button type="button" style={styles.btnCancel} onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" style={styles.btnSave}>Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add New Modal */}
        {showAddModal && (
          <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalHeaderH2}>Add New Announcement</h2>
                <button style={styles.modalClose} onClick={() => setShowAddModal(false)}>✕</button>
              </div>
              <div style={styles.modalBody}>
                <form onSubmit={handleAddSave}>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleInputChange}
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Category</label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      >
                        {categories.filter(cat => cat !== 'All').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Priority</label>
                      <select
                        name="priority"
                        value={editFormData.priority}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formGroupLabel}>Status</label>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleInputChange}
                        required
                        style={styles.formInput}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Author</label>
                    <input
                      type="text"
                      name="author"
                      value={editFormData.author}
                      onChange={handleInputChange}
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleInputChange}
                      rows="4"
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={editFormData.tags}
                      onChange={handleInputChange}
                      placeholder="Achievement, Partnership, Innovation"
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formGroupLabel}>Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={editFormData.image}
                      onChange={handleInputChange}
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formActions}>
                    <button type="button" style={styles.btnCancel} onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" style={styles.btnSave}>Add Announcement</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Announcement;