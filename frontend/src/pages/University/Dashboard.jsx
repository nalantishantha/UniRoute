import React, { useState, useEffect, useRef } from 'react';
import { FaUserGraduate, FaUniversity, FaBook, FaCalendarAlt } from 'react-icons/fa';
import UniversitySidebar from '../../components/Navigation/UniversitySidebar'; // CHANGED: Import UniversitySidebar
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';
import './Dashboard.css';

const initialStats = [
  { id: 1, label: 'Total Students', value: 4200, icon: <FaUserGraduate />, trend: '+12%' },
  { id: 2, label: 'Faculties', value: 8, icon: <FaUniversity />, trend: '+2' },
  { id: 3, label: 'Active Courses', value: 120, icon: <FaBook />, trend: '+8%' },
  { id: 4, label: 'Upcoming Events', value: 5, icon: <FaCalendarAlt />, trend: '+3' },
];

const initialActivities = [
  { id: 1, type: 'announcement', title: 'New Academic Year Registration', time: '2 hours ago', priority: 'high' },
  { id: 2, type: 'event', title: 'Science Fair 2025', time: '5 hours ago', priority: 'medium' },
  { id: 3, type: 'course', title: 'Data Science Course Updated', time: '1 day ago', priority: 'low' },
  { id: 4, type: 'student', title: '50 New Student Applications', time: '2 days ago', priority: 'medium' },
];

const initialQuickActions = [
  { 
    id: 1,
    title: '📢 Publish Announcements', 
    description: 'Share important news and updates with all students and staff members across the university.',
    link: '/university/announcement',
    color: 'blue',
    stats: '25 active announcements'
  },
  { 
    id: 2,
    title: '📅 Manage Events', 
    description: 'Organize and promote university events with the integrated calendar system and event management This updated by weekly.',
    link: '/university/announcement',
    color: 'purple',
    stats: '8 upcoming events'
  },
  { 
    id: 3,
    title: '📖 Academic Content', 
    description: 'Upload, update, and manage course materials, syllabi and academic resources for all faculties ',
    link: '/university/academic-content',
    color: 'green',
    stats: '340 content files'
  },
  { 
    id: 4,
    title: '🎯 Advertise University', 
    description: 'Create and publish promotional advertisements to attract new students and showcase programs.',
    link: '/university/ad-publish', // CHANGED: Fixed the link to match UniversitySidebar navigation
    color: 'orange',
    stats: '12 active ads'
  },
  { 
    id: 5,
    title: '💼 Manage Portfolio', 
    description: 'Manage university portfolio, achievements, certifications and institutional credentials with others.',
    link: '/university/manage-portfolio',
    color: 'purple',
    stats: '18 portfolio items'
  },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Edit states for admin functionality
  const [editingStats, setEditingStats] = useState(false);
  const [editingStatId, setEditingStatId] = useState(null); // NEW: Track which stat is being edited
  const [statEditValue, setStatEditValue] = useState('');   // NEW: Temp value for editing
  const [editingQuickActions, setEditingQuickActions] = useState(false);
  const [editingActivities, setEditingActivities] = useState(false);
  const [editingMetrics, setEditingMetrics] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  
  // Data states
  const [stats, setStats] = useState(initialStats);
  const [recentActivities, setRecentActivities] = useState(initialActivities);
  const [quickActions, setQuickActions] = useState(initialQuickActions);

  // Edit handlers
  const handleEditStats = () => {
    if (editingStats) {
      // Save stats changes
      console.log('Stats saved:', stats);
    }
    setEditingStats(!editingStats);
  };

  const handleEditQuickActions = () => {
    if (editingQuickActions) {
      // Save quick actions changes
      console.log('Quick actions saved:', quickActions);
    }
    setEditingQuickActions(!editingQuickActions);
  };

  const handleEditActivities = () => {
    if (editingActivities) {
      // Save activities changes
      console.log('Activities saved:', recentActivities);
    }
    setEditingActivities(!editingActivities);
  };

  const handleEditMetrics = () => {
    if (editingMetrics) {
      // Save metrics changes
      console.log('Metrics saved');
    }
    setEditingMetrics(!editingMetrics);
  };

  const handleEditStatus = () => {
    if (editingStatus) {
      // Save status changes
      console.log('Status saved');
    }
    setEditingStatus(!editingStatus);
  };

  // Individual stat edit handlers
  const handleStatEdit = (statId, currentValue) => {
    setEditingStatId(statId);
    setStatEditValue(currentValue);
  };

  const handleStatEditSave = (statId) => {
    setStats(stats =>
      stats.map(stat =>
        stat.id === statId
          ? { ...stat, value: parseInt(statEditValue) || stat.value }
          : stat
      )
    );
    setEditingStatId(null);
    setStatEditValue('');
  };

  // Optional: Save on Enter key
  const handleStatEditKeyDown = (e, statId) => {
    if (e.key === 'Enter') {
      handleStatEditSave(statId);
    }
  };

  // Optional: Save on blur
  const handleStatEditBlur = (statId) => {
    handleStatEditSave(statId);
  };

  // Edit handlers for quick actions, activities, metrics, and status remain the same

  return (
    <div className="university-dashboard-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <UniversitySidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* NAVBAR */}
      <UniversityNavbar 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className={`dashboard-main-content ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        
        {/* Enhanced Stats Section with Edit Button */}
        <section className="dashboard-stats-section">
          <div className="stats-header">
            <div className="stats-header-content">
              <div style={{ textAlign: 'center' }}>
                <h2>University Overview</h2>
                <p>Real-time insights and key metrics</p>
                <button onClick={handleEditStats} className="stats-edit-btn" style={{ marginTop: '1rem' }}>
                  {editingStats ? '💾 Save Stats' : '✏️ Edit Stats'}
                </button>
              </div>
            </div>
          </div>
          <div className="dashboard-stats">
            {stats.map((stat) => (
              <div className="stat-card no-animation" key={stat.label}>
                <div className="stat-background"></div>
                <div className="stat-content">
                  <div className="stat-icon" style={{ animation: 'none', transition: 'none' }}>{stat.icon}</div>
                  <div className="stat-value">
                    {editingStats && editingStatId === stat.id ? (
                      <input
                        type="number"
                        className="stat-edit-input"
                        value={statEditValue}
                        autoFocus
                        onChange={e => setStatEditValue(e.target.value)}
                        onBlur={() => handleStatEditBlur(stat.id)}
                        onKeyDown={e => handleStatEditKeyDown(e, stat.id)}
                        style={{
                          fontSize: '2.2rem',
                          fontWeight: 700,
                          width: '90px',
                          textAlign: 'center',
                          border: '2px dashed #f59e0b',
                          borderRadius: '8px',
                          outline: 'none',
                          color: '#6366f1',
                          background: '#fffbe9',
                        }}
                      />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-trend">
                    <span className="trend-indicator">📈</span>
                    {stat.trend}
                  </div>
                </div>
                {editingStats && (
                  <button
                    className="stat-edit-individual-btn"
                    onClick={() => handleStatEdit(stat.id, stat.value)}
                    disabled={editingStatId !== null && editingStatId !== stat.id}
                    style={editingStatId !== null && editingStatId !== stat.id ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Grid Layout */}
        <section className="dashboard-grid">
          
          {/* Quick Actions with Edit Button */}
          <div className="grid-section quick-actions-section expanded">
            <div className="section-header">
              <h3>🚀 Quick Actions</h3>
              <div className="section-header-right">
                <span className="section-badge">5 Available</span>
                <button onClick={handleEditQuickActions} className="section-edit-btn">
                  {editingQuickActions ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <div key={action.id} className={`action-card color-${action.color} no-animation`}>
                  <div className="action-background"></div>
                  <div className="action-content">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                    <div className="action-stats">{action.stats}</div>
                    <a href={action.link} className="action-btn">
                      <span>Get Started</span>
                      <span className="btn-arrow">→</span>
                    </a>
                  </div>
                  {editingQuickActions && (
                    <button 
                      className="action-edit-btn"
                      onClick={() => handleQuickActionEdit(action.id)}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities with Edit Button */}
          <div className="grid-section activities-section">
            <div className="recent-activities-header">
              <h3>📋 Recent Activities</h3>
              <button className="view-all-btn">View All</button>
              <button onClick={handleEditActivities} className="section-edit-btn">
                {editingActivities ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item no-animation">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'announcement' && '📢'}
                    {activity.type === 'event' && '📅'}
                    {activity.type === 'course' && '📚'}
                    {activity.type === 'student' && '👥'}
                  </div>
                  <div className="activity-content">
                    <h5>{activity.title}</h5>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className={`priority-badge ${activity.priority}`}>
                    {activity.priority}
                  </div>
                  {editingActivities && (
                    <button 
                      className="activity-edit-btn"
                      onClick={() => handleActivityEdit(activity.id)}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics with Edit Button */}
          <div className="grid-section metrics-section">
            <div className="section-header">
              <h3>📊 Performance Metrics</h3>
              <div className="section-header-right">
                <span className="section-badge">This Month</span>
                <button onClick={handleEditMetrics} className="section-edit-btn">
                  {editingMetrics ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-value">94.5%</div>
                <div className="metric-label">Student Satisfaction</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{width: '94.5%'}}></div>
                </div>
                {editingMetrics && (
                  <button 
                    className="metric-edit-btn"
                    onClick={() => handleMetricEdit('Student Satisfaction')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className="metric-card">
                <div className="metric-icon">🎯</div>
                <div className="metric-value">87.2%</div>
                <div className="metric-label">Course Completion</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{width: '87.2%'}}></div>
                </div>
                {editingMetrics && (
                  <button 
                    className="metric-edit-btn"
                    onClick={() => handleMetricEdit('Course Completion')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className="metric-card">
                <div className="metric-icon">💼</div>
                <div className="metric-value">91.8%</div>
                <div className="metric-label">Graduate Employment</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{width: '91.8%'}}></div>
                </div>
                {editingMetrics && (
                  <button 
                    className="metric-edit-btn"
                    onClick={() => handleMetricEdit('Graduate Employment')}
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* System Status with Edit Button */}
         <div className="grid-section status-section">
            <div className="system-status-header">
              <h3>🔧 System Status</h3>
              <span className="status-indicator online">All Systems Online</span>
              <button onClick={handleEditStatus} className="section-edit-btn">
                {editingStatus ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>
          
            <div className="status-list">
              <div className="status-item">
                <span className="status-dot online"></span>
                <span>Academic Portal</span>
                <span className="status-uptime">99.9% uptime</span>
                {editingStatus && (
                  <button 
                    className="status-edit-btn"
                    onClick={() => handleStatusEdit('Academic Portal')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className="status-item">
                <span className="status-dot online"></span>
                <span>Student Management</span>
                <span className="status-uptime">99.7% uptime</span>
                {editingStatus && (
                  <button 
                    className="status-edit-btn"
                    onClick={() => handleStatusEdit('Student Management')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className="status-item">
                <span className="status-dot warning"></span>
                <span>Payment Gateway</span>
                <span className="status-uptime">Maintenance</span>
                {editingStatus && (
                  <button 
                    className="status-edit-btn"
                    onClick={() => handleStatusEdit('Payment Gateway')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className="status-item">
                <span className="status-dot online"></span>
                <span>Content Delivery</span>
                <span className="status-uptime">100% uptime</span>
                {editingStatus && (
                  <button 
                    className="status-edit-btn"
                    onClick={() => handleStatusEdit('Content Delivery')}
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          </div>

        </section>

        <Footer
          title="University Excellence"
          subtitle="Empowering education through innovative digital solutions"
          theme="dark"
          sidebarExpanded={isSidebarOpen}
        />
      </main>
    </div>
  );
};

export default Dashboard