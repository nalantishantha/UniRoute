import React, { useState, useEffect } from 'react';
import UniSidebar from '../../components/UniSidebar';
import UniHeader from '../../components/UniHeader';
import Footer from '../../components/Footer';
import './Dashboarduser.css';

const stats = [
  { label: 'Total Students', value: 4200, icon: '🎓', trend: '+12%' },
  { label: 'Faculties', value: 8, icon: '🏛️', trend: '+2' },
  { label: 'Active Courses', value: 120, icon: '📚', trend: '+8%' },
  { label: 'Upcoming Events', value: 5, icon: '📅', trend: '+3' },
];

const recentActivities = [
  { id: 1, type: 'announcement', title: 'New Academic Year Registration', time: '2 hours ago', priority: 'high' },
  { id: 2, type: 'event', title: 'Science Fair 2025', time: '5 hours ago', priority: 'medium' },
  { id: 3, type: 'course', title: 'Data Science Course Updated', time: '1 day ago', priority: 'low' },
  { id: 4, type: 'student', title: '50 New Student Applications', time: '2 days ago', priority: 'medium' },
];

const quickActions = [
  { 
    title: '📢 Publish Announcements', 
    description: 'Share important news and updates with all students and staff members across the university.',
    link: '/university/announcement',
    color: 'blue',
    stats: '25 active announcements'
  },
  { 
    title: '📅 Manage Events', 
    description: 'Organize and promote university events with the integrated calendar system and event management This updated by weekly.',
    link: '/university/announcement',
    color: 'purple',
    stats: '8 upcoming events'
  },
  { 
    title: '📖 Academic Content', 
    description: 'Upload, update, and manage course materials, syllabi and academic resources for all faculties with full support.',
    link: '/university/academic-content',
    color: 'green',
    stats: '340 content files'
  },
  { 
    title: '🎯 Advertise University', 
    description: 'Create and publish promotional advertisements to attract new students and showcase programs.',
    link: '/university/ad-publish',
    color: 'orange',
    stats: '12 active ads'
  },
  { 
    title: '💼 Manage Portfolio', 
    description: 'Manage university portfolio, achievements, certifications and institutional credentials with others.',
    link: '/university/manage-portfolio',
    color: 'purple',
    stats: '18 portfolio items'
  },
];

const Dashboarduser = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({ temp: '28°C', condition: 'Sunny' });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="university-dashboard-page">
      <div className="dashboard-container">
        <UniSidebar activePage="dashboard" onExpandChange={setIsSidebarExpanded} />
        <UniHeader sidebarExpanded={isSidebarExpanded} />

        <main className={`dashboard-main-content ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          
          {/* Enhanced Hero Section */}
          <section className="dashboard-hero">
            <div className="hero-bg-elements">
              <div className="floating-orb orb-1"></div>
              <div className="floating-orb orb-2"></div>
              <div className="floating-orb orb-3"></div>
              <div className="wave-animation"></div>
            </div>
            <div className="hero-content">
              <div className="hero-main">
                <h1 className="hero-title">Welcome to University Dashboard</h1>
                <p className="hero-subtitle">
                  Comprehensive management system for University of Colombo's academic, administrative, and promotional activities.
                </p>
                <div className="hero-features">
                  <span className="feature-tag">📊 Analytics</span>
                  <span className="feature-tag">🎯 Management</span>
                  <span className="feature-tag">📈 Growth</span>
                </div>
              </div>
              <div className="hero-info-panel">
                <div className="time-widget">
                  <div className="live-indicator">● LIVE</div>
                  <div className="current-time">{currentTime.toLocaleTimeString()}</div>
                  <div className="current-date">{currentTime.toLocaleDateString()}</div>
                </div>
                <div className="weather-widget">
                  <div className="weather-icon">☀️</div>
                  <div className="weather-info">
                    <span className="temperature">{weatherData.temp}</span>
                    <span className="condition">{weatherData.condition}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                <span className="section-badge">5 Available</span>
              </div>
              <div className="quick-actions-grid five-column">
                {quickActions.map((action, idx) => (
                  <div key={idx} className={`action-card color-${action.color} slide-in-animation delay-${idx}`}>
                    <div className="action-background"></div>
                    <div className="action-content">
                      <div className="action-title">{action.title}</div>
                      <div className="action-description">{action.description}</div>
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
                {recentActivities.map((activity, idx) => (
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
            sidebarExpanded={isSidebarExpanded}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboarduser;