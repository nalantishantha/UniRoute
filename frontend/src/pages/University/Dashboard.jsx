import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaUniversity,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";
import UniversitySidebar from "../../components/Navigation/UniversitySidebar";
import UniversityNavbar from "../../components/Navigation/UniversityNavbar";
import Footer from "../../components/Footer";
import "./Dashboard.css";
import {
  fetchDashboard,
  updateDashboard,
} from "../../services/universityDashboardApi";

// Icon mapping for backend 'iconKey'
const iconMap = {
  "user-graduate": <FaUserGraduate />,
  university: <FaUniversity />,
  book: <FaBook />,
  calendar: <FaCalendarAlt />,
};

// Initial fallbacks used before API loads (same as backend defaults)
const fallbackStats = [
  {
    id: 1,
    label: "Total Students",
    value: 4200,
    iconKey: "user-graduate",
    trend: "+12%",
  },
  { id: 2, label: "Faculties", value: 8, iconKey: "university", trend: "+2" },
  { id: 3, label: "Active Courses", value: 120, iconKey: "book", trend: "+8%" },
  {
    id: 4,
    label: "Upcoming Events",
    value: 5,
    iconKey: "calendar",
    trend: "+3",
  },
];
const fallbackActivities = [
  {
    id: 1,
    type: "announcement",
    title: "New Academic Year Registration",
    time: "2 hours ago",
    priority: "high",
  },
  {
    id: 2,
    type: "event",
    title: "Science Fair 2025",
    time: "5 hours ago",
    priority: "medium",
  },
  {
    id: 3,
    type: "course",
    title: "Data Science Course Updated",
    time: "1 day ago",
    priority: "low",
  },
  {
    id: 4,
    type: "student",
    title: "50 New Student Applications",
    time: "2 days ago",
    priority: "medium",
  },
];
const fallbackQuickActions = [
  {
    id: 1,
    title: "📢 Publish Announcements",
    description:
      "Share important news and updates with all students and staff members across the university.",
    link: "/university/announcement",
    color: "blue",
    stats: "25 active announcements",
  },
  {
    id: 2,
    title: "📅 Manage Events",
    description:
      "Organize and promote university events with the integrated calendar system and event management This updated by weekly.",
    link: "/university/announcement",
    color: "purple",
    stats: "8 upcoming events",
  },
  {
    id: 3,
    title: "📖 Academic Content",
    description:
      "Upload, update, and manage course materials, syllabi and academic resources for all faculties ",
    link: "/university/academic-content",
    color: "green",
    stats: "340 content files",
  },
  {
    id: 4,
    title: "🎯 Advertise University",
    description:
      "Create and publish promotional advertisements to attract new students and showcase programs.",
    link: "/university/ad-publish",
    color: "orange",
    stats: "12 active ads",
  },
  {
    id: 5,
    title: "💼 Manage Portfolio",
    description:
      "Manage university portfolio, achievements, certifications and institutional credentials with others.",
    link: "/university/manage-portfolio",
    color: "purple",
    stats: "18 portfolio items",
  },
];
const fallbackMetrics = [
  { id: 1, label: "Student Satisfaction", value: 94.5 },
  { id: 2, label: "Course Completion", value: 87.2 },
  { id: 3, label: "Graduate Employment", value: 91.8 },
];
const fallbackStatuses = [
  { id: 1, name: "Academic Portal", status: "online", uptime: "99.9% uptime" },
  {
    id: 2,
    name: "Student Management",
    status: "online",
    uptime: "99.7% uptime",
  },
  { id: 3, name: "Payment Gateway", status: "warning", uptime: "Maintenance" },
  { id: 4, name: "Content Delivery", status: "online", uptime: "100% uptime" },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // University selection (replace 1 with the actual university id for the logged-in admin)
  const universityId = 1;

  // Edit toggles
  const [editingStats, setEditingStats] = useState(false);
  const [editingStatId, setEditingStatId] = useState(null);
  const [statEditValue, setStatEditValue] = useState("");
  const [editingQuickActions, setEditingQuickActions] = useState(false);
  const [editingActivities, setEditingActivities] = useState(false);
  const [editingMetrics, setEditingMetrics] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);

  // Data states
  const [stats, setStats] = useState(fallbackStats);
  const [recentActivities, setRecentActivities] = useState(fallbackActivities);
  const [quickActions, setQuickActions] = useState(fallbackQuickActions);
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [statuses, setStatuses] = useState(fallbackStatuses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchDashboard(universityId);
        if (!mounted || !res?.success) return;
        const d = res.dashboard;
        setStats(d.stats?.length ? d.stats : fallbackStats);
        setQuickActions(
          d.quick_actions?.length ? d.quick_actions : fallbackQuickActions
        );
        setRecentActivities(
          d.recent_activities?.length ? d.recent_activities : fallbackActivities
        );
        setMetrics(d.metrics?.length ? d.metrics : fallbackMetrics);
        setStatuses(d.statuses?.length ? d.statuses : fallbackStatuses);
      } catch (e) {
        setError("Failed to load dashboard");
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [universityId]);

  // Save helpers (update only the section being edited)
  const saveSection = async (partial) => {
    try {
      await updateDashboard(universityId, partial);
    } catch (e) {
      console.error(e);
      alert("Save failed. See console for details.");
    }
  };

  // Stats edit handlers
  const handleEditStats = async () => {
    if (editingStats) {
      await saveSection({ stats });
    }
    setEditingStats(!editingStats);
  };

  const handleStatEdit = (statId, currentValue) => {
    setEditingStatId(statId);
    setStatEditValue(String(currentValue));
  };
  const handleStatEditSave = (statId) => {
    setStats((arr) =>
      arr.map((s) =>
        s.id === statId
          ? { ...s, value: parseInt(statEditValue) || s.value }
          : s
      )
    );
    setEditingStatId(null);
    setStatEditValue("");
  };
  const handleStatEditKeyDown = (e, statId) =>
    e.key === "Enter" && handleStatEditSave(statId);
  const handleStatEditBlur = (statId) => handleStatEditSave(statId);

  // Quick actions
  const handleEditQuickActions = async () => {
    if (editingQuickActions) {
      await saveSection({ quick_actions: quickActions });
    }
    setEditingQuickActions(!editingQuickActions);
  };
  const handleQuickActionEdit = (id) => {
    const item = quickActions.find((q) => q.id === id);
    const title = window.prompt("Title:", item.title);
    const description = window.prompt("Description:", item.description);
    const statsText = window.prompt("Stats label:", item.stats);
    if (title) item.title = title;
    if (description) item.description = description;
    if (statsText) item.stats = statsText;
    setQuickActions([...quickActions]);
  };

  // Activities
  const handleEditActivities = async () => {
    if (editingActivities) {
      await saveSection({ recent_activities: recentActivities });
    }
    setEditingActivities(!editingActivities);
  };
  const handleActivityEdit = (id) => {
    const item = recentActivities.find((a) => a.id === id);
    const title = window.prompt("Activity title:", item.title);
    const time = window.prompt('Time (e.g., "2 hours ago"):', item.time);
    const priority = window.prompt(
      "Priority (high|medium|low):",
      item.priority
    );
    if (title) item.title = title;
    if (time) item.time = time;
    if (priority) item.priority = priority;
    setRecentActivities([...recentActivities]);
  };

  // Metrics
  const handleEditMetrics = async () => {
    if (editingMetrics) {
      await saveSection({ metrics });
    }
    setEditingMetrics(!editingMetrics);
  };
  const handleMetricEdit = (idOrLabel) => {
    const m =
      typeof idOrLabel === "number"
        ? metrics.find((x) => x.id === idOrLabel)
        : metrics.find((x) => x.label === idOrLabel);
    if (!m) return;
    const v = window.prompt(
      `Set value for ${m.label} (0-100):`,
      String(m.value)
    );
    const num = parseFloat(v);
    if (!isNaN(num)) {
      m.value = Math.min(100, Math.max(0, num));
      setMetrics([...metrics]);
    }
  };

  // Status
  const handleEditStatus = async () => {
    if (editingStatus) {
      await saveSection({ statuses });
    }
    setEditingStatus(!editingStatus);
  };
  const handleStatusEdit = (nameOrId) => {
    const s =
      typeof nameOrId === "number"
        ? statuses.find((x) => x.id === nameOrId)
        : statuses.find((x) => x.name === nameOrId);
    if (!s) return;
    const uptime = window.prompt(`Uptime/status text for ${s.name}:`, s.uptime);
    const status = window.prompt(`Status (online|warning):`, s.status);
    if (uptime) s.uptime = uptime;
    if (status) s.status = status;
    setStatuses([...statuses]);
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;

  return (
    <div className="university-dashboard-page">
      <UniversitySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <UniversityNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      <main
        className={`dashboard-main-content ${
          isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
      >
        {/* Stats Section */}
        <section className="dashboard-stats-section">
          <div className="stats-header">
            <div className="stats-header-content">
              <div style={{ textAlign: "center" }}>
                <h2>University Overview</h2>
                <p>Real-time insights and key metrics</p>
                <button
                  onClick={handleEditStats}
                  className="stats-edit-btn"
                  style={{ marginTop: "1rem" }}
                >
                  {editingStats ? "💾 Save Stats" : "✏️ Edit Stats"}
                </button>
              </div>
            </div>
          </div>
          <div className="dashboard-stats-align-row">
            <div className="dashboard-stats dashboard-stats-row-unique">
              {stats.map((stat) => (
                <div className="stat-card no-animation" key={stat.id}>
                  <div className="stat-background"></div>
                  <div className="stat-content">
                    <div
                      className="stat-icon"
                      style={{ animation: "none", transition: "none" }}
                    >
                      {iconMap[stat.iconKey] || <FaBook />}
                    </div>
                    <div className="stat-value">
                      {editingStats && editingStatId === stat.id ? (
                        <input
                          type="number"
                          className="stat-edit-input"
                          value={statEditValue}
                          autoFocus
                          onChange={(e) => setStatEditValue(e.target.value)}
                          onBlur={() => handleStatEditBlur(stat.id)}
                          onKeyDown={(e) => handleStatEditKeyDown(e, stat.id)}
                          style={{
                            fontSize: "2.2rem",
                            fontWeight: 700,
                            width: "90px",
                            textAlign: "center",
                            border: "2px dashed #f59e0b",
                            borderRadius: "8px",
                            outline: "none",
                            color: "#6366f1",
                            background: "#fffbe9",
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
                      disabled={
                        editingStatId !== null && editingStatId !== stat.id
                      }
                      style={
                        editingStatId !== null && editingStatId !== stat.id
                          ? { opacity: 0.5, pointerEvents: "none" }
                          : {}
                      }
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="dashboard-grid">
          {/* Quick Actions */}
          <div className="grid-section quick-actions-section expanded">
            <div className="section-header">
              <h3> Quick Actions</h3>
              <div className="section-header-right">
                <span className="section-badge">
                  {quickActions.length} Available
                </span>
                <button
                  onClick={handleEditQuickActions}
                  className="section-edit-btn"
                >
                  {editingQuickActions ? "💾 Save" : "✏️ Edit"}
                </button>
              </div>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  className={`action-card color-${action.color} no-animation`}
                >
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

          {/* Recent Activities */}
          <div className="grid-section activities-section">
            <div className="recent-activities-header">
              <h3>Recent Activities</h3>
              <button
                onClick={handleEditActivities}
                className="section-edit-btn"
              >
                {editingActivities ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item no-animation">
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

          {/* Performance Metrics */}
          <div className="grid-section metrics-section">
            <div className="section-header">
              <h3> Performance Metrics</h3>
              <div className="section-header-right">
                <span className="section-badge">This Month</span>
                <button
                  onClick={handleEditMetrics}
                  className="section-edit-btn"
                >
                  {editingMetrics ? "💾 Save" : "✏️ Edit"}
                </button>
              </div>
            </div>
            <div className="metrics-grid">
              {metrics.map((m) => (
                <div className="metric-card" key={m.id}>
                  <div className="metric-icon">📊</div>
                  <div className="metric-value">{m.value}%</div>
                  <div className="metric-label">{m.label}</div>
                  <div className="metric-progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${m.value}%` }}
                    ></div>
                  </div>
                  {editingMetrics && (
                    <button
                      className="metric-edit-btn"
                      onClick={() => handleMetricEdit(m.id)}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="grid-section status-section">
            <div className="system-status-header">
              <h3>System Status</h3>
              <button onClick={handleEditStatus} className="section-edit-btn">
                {editingStatus ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>

            <div className="status-list">
              {statuses.map((s) => (
                <div className="status-item" key={s.id}>
                  <span className={`status-dot ${s.status}`}></span>
                  <span>{s.name}</span>
                  <span className="status-uptime">{s.uptime}</span>
                  {editingStatus && (
                    <button
                      className="status-edit-btn"
                      onClick={() => handleStatusEdit(s.id)}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              ))}
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

export default Dashboard;
