import React, { useState, useEffect } from 'react';
import UniversityUserSidebar from '../../components/Navigation/UniversityUsersidebar'; // CORRECT: Keep this import
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';
import './Dashboarduser.css';

const initialStats = [
  { id: 1, label: 'Total Students', value: 4200, icon: '🎓', trend: '+12%' },
  { id: 2, label: 'Faculties', value: 8, icon: '🏛️', trend: '+2' },
  { id: 3, label: 'Active Courses', value: 120, icon: '📚', trend: '+8%' },
  { id: 4, label: 'Upcoming Events', value: 5, icon: '📅', trend: '+3' },
];

const initialActivities = [
  { id: 1, type: 'announcement', title: 'New Academic Year Registration', time: '2 hours ago', priority: 'high' },
  { id: 2, type: 'event', title: 'Science Fair 2025', time: '5 hours ago', priority: 'medium' },
  { id: 3, type: 'course', title: 'Data Science Course Updated', time: '1 day ago', priority: 'low' },
  { id: 4, type: 'student', title: '50 New Student Applications', time: '2 days ago', priority: 'medium' },
];

const quickActions = [
  { 
    title: '📢 Publish Announcements', 
    description: 'Share important news and updates with all students and staff members across the university.',
    link: '/university/announcement-user', // CHANGED: Link to user pages
    color: 'blue',
    stats: '25 active announcements'
  },
  { 
    title: '📅 Manage Events', 
    description: 'Organize and promote university events with the integrated calendar system and event management This updated by weekly.',
    link: '/university/announcement-user', // CHANGED: Link to user pages
    color: 'purple',
    stats: '8 upcoming events'
  },
  { 
    title: '📖 Academic Content', 
    description: 'Upload, update, and manage course materials, syllabi and academic resources for all faculties',
    link: '/university/academic-content-user', // CHANGED: Link to user pages
    color: 'green',
    stats: '340 content files'
  },
  { 
    title: '💼 Manage Portfolio', 
    description: 'Manage university portfolio, achievements, certifications and institutional credentials with others.',
    link: '/university/manage-portfolio-user', // CHANGED: Link to user pages
    color: 'purple',
    stats: '18 portfolio items'
  },
  // REMOVED: "Advertise University" action since university users don't have access to Ad Publish
];

const Dashboarduser = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState(initialStats);
  const [activities, setActivities] = useState(initialActivities);

  return (
    <div className="university-dashboard-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <UniversityUserSidebar 
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
        {/* Enhanced Stats Section */}
        <section className="dashboard-stats-section">
          <div className="stats-header">
            <h2>University Overview</h2>
            <p>Real-time insights and key metrics</p>
          </div>
          <div className="dashboard-stats">
            {stats.map((stat, idx) => (
              <div className={`stat-card animated-card delay-${idx}`} key={stat.label}>
                <div className="stat-background"></div>
                <div className="stat-content">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value.toLocaleString()}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-trend">
                    <span className="trend-indicator">📈</span>
                    {stat.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Grid Layout */}
        <section className="dashboard-grid">
          
          {/* Quick Actions */}
          <div className="grid-section quick-actions-section expanded">
            <div className="section-header">
              <h3>🚀 Quick Actions</h3>
              <span className="section-badge">4 Available</span> {/* CHANGED: Now shows 4 instead of 5 */}
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action, idx) => (
                <div key={idx} className={`action-card color-${action.color} slide-in-animation delay-${idx}`}>
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
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid-section activities-section">
            <div className="section-header">
              <h3>📋 Recent Activities</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activities-list">
              {activities.map((activity, idx) => (
                <div key={activity.id} className={`activity-item fade-in-up delay-${idx}`}>
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
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid-section metrics-section">
            <div className="section-header">
              <h3>📊 Performance Metrics</h3>
              <span className="section-badge">This Month</span>
            </div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-value">94.5%</div>
                <div className="metric-label">Student Satisfaction</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{width: '94.5%'}}></div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🎯</div>
                <div className="metric-value">87.2%</div>
                <div className="metric-label">Course Completion</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{width: '87.2%'}}></div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💼</div>
                <div className="metric-value">91.8%</div>
                <div className="metric-label">Graduate Employment</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{width: '91.8%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="grid-section status-section">
            <div className="section-header">
              <h3>🔧 System Status</h3>
              <span className="status-indicator online">All Systems Online</span>
            </div>
            <div className="status-list">
              <div className="status-item">
                <span className="status-dot online"></span>
                <span>Academic Portal</span>
                <span className="status-uptime">99.9% uptime</span>
              </div>
              <div className="status-item">
                <span className="status-dot online"></span>
                <span>Student Management</span>
                <span className="status-uptime">99.7% uptime</span>
              </div>
              <div className="status-item">
                <span className="status-dot warning"></span>
                <span>Payment Gateway</span>
                <span className="status-uptime">Maintenance</span>
              </div>
              <div className="status-item">
                <span className="status-dot online"></span>
                <span>Content Delivery</span>
                <span className="status-uptime">100% uptime</span>
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

export default Dashboarduser;