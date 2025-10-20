import React, { useEffect, useState } from "react";
import UniversitySidebar from "../../components/Navigation/UniversitySidebar"; // CHANGED: Import UniversitySidebar
import UniversityNavbar from "../../components/Navigation/UniversityNavbar";
import Footer from "../../components/Footer";
import "./Announcement.css";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/universityAnnouncementApi";

// Add these imports for the calendar
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";

// Calendar localization setup
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// No longer need local dummy announcements; backend will seed on first fetch
const initialAnnouncements = [];

const initialEvents = [
  {
    id: 1,
    title: "Convocation Ceremony",
    date: "2025-07-20",
    description: "Annual convocation for all graduating students.",
  },
  {
    id: 2,
    title: "Research Symposium",
    date: "2025-07-25",
    description: "A symposium to showcase student and faculty research.",
  },
];

const Announcement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [events, setEvents] = useState(initialEvents);

  // Announcement modal state
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [annForm, setAnnForm] = useState({
    title: "",
    description: "",
    date: "",
    author: "",
    status: "draft",
  });

  // Event modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    description: "",
  });

  // Add view event modal state
  const [showViewEventModal, setShowViewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Add view announcement modal state (add this with your other state declarations)
  const [showAnnViewModal, setShowAnnViewModal] = useState(false);
  const [viewingAnn, setViewingAnn] = useState(null);

  // Add calendar view state
  const [calendarView, setCalendarView] = useState("month");

  // Load announcements on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAnnouncements({ university_id: 1, seed: true });
        if (mounted && res.success) setAnnouncements(res.announcements);
      } catch (e) {
        console.error("Failed to load announcements", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Announcement handlers
  const handleAnnFormChange = (e) =>
    setAnnForm({ ...annForm, [e.target.name]: e.target.value });
  const handleAnnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnn) {
        const res = await updateAnnouncement(editingAnn.id, annForm, {
          legacy: editingAnn.source === "legacy",
        });
        if (res.success) {
          setAnnouncements((anns) =>
            anns.map((a) => (a.id === editingAnn.id ? res.announcement : a))
          );
        }
      } else {
        const res = await createAnnouncement({ ...annForm, university_id: 1 });
        if (res.success) {
          setAnnouncements((anns) => [res.announcement, ...anns]);
        }
      }
    } catch (err) {
      console.error("Save announcement failed", err);
    }
    setShowAnnModal(false);
    setEditingAnn(null);
    setAnnForm({
      title: "",
      description: "",
      date: "",
      author: "",
      status: "draft",
    });
  };
  const handleAnnEdit = (ann) => {
    setEditingAnn(ann);
    setAnnForm(ann);
    setShowAnnModal(true);
  };
  const handleAnnDelete = async (id) => {
    try {
      const target = announcements.find((a) => a.id === id);
      const res = await deleteAnnouncement(id, {
        legacy: target?.source === "legacy",
      });
      if (res.success)
        setAnnouncements((anns) => anns.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };
  const handleAnnView = (ann) => {
    setViewingAnn(ann);
    setShowAnnViewModal(true);
  };

  // Event handlers
  const handleEventFormChange = (e) =>
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents((evts) =>
        evts.map((ev) =>
          ev.id === editingEvent.id ? { ...eventForm, id: editingEvent.id } : ev
        )
      );
    } else {
      setEvents((evts) => [...evts, { ...eventForm, id: Date.now() }]);
    }
    setShowEventModal(false);
    setEditingEvent(null);
    setEventForm({ title: "", date: "", description: "" });
  };
  const handleEventEdit = (ev) => {
    setEditingEvent(ev);
    setEventForm(ev);
    setShowEventModal(true);
  };
  const handleEventDelete = (id) =>
    setEvents((evts) => evts.filter((ev) => ev.id !== id));
  const handleEventView = (ev) => {
    setSelectedEvent(ev);
    setShowViewEventModal(true);
  };

  // Enhanced calendar event handler - shows view modal
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowViewEventModal(true);
  };

  // Calendar slot selection for adding events
  const handleSelectSlot = ({ start }) => {
    const dateStr = start.toISOString().split("T")[0];
    setEventForm({ title: "", date: dateStr, description: "" });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  // Convert your events to calendar format
  const calendarEvents = events.map((ev) => ({
    title: ev.title,
    start: new Date(ev.date),
    end: new Date(ev.date),
    allDay: true,
    resource: ev,
  }));

  return (
    <div className="university-announcement-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <UniversitySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* NAVBAR */}
      <UniversityNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main
        className={`announcement-main-content ${
          isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
      >
        {/* Move calendar section to top */}
        <section className="calendar-section">
          <div className="calendar-header">
            <h2>Upcoming Events</h2>
            <div className="calendar-controls">
              <div className="view-buttons">
                <button
                  className={`view-btn ${
                    calendarView === "month" ? "active" : ""
                  }`}
                  onClick={() => setCalendarView("month")}
                >
                  Month
                </button>

                <button
                  className={`view-btn ${
                    calendarView === "agenda" ? "active" : ""
                  }`}
                  onClick={() => setCalendarView("agenda")}
                >
                  Agenda
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowEventModal(true);
                  setEditingEvent(null);
                  setEventForm({ title: "", date: "", description: "" });
                }}
              >
                + Add Event
              </button>
            </div>
          </div>
          <div className="calendar-component-wrapper">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              view={calendarView}
              onView={setCalendarView}
              views={["month", "week", "day", "agenda"]}
              style={{ height: 600 }}
              popup
              selectable
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: "#174A7C var(--tw-gradient-to-position)",
                  borderRadius: "6px",
                  border: "none",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                },
              })}
              components={{
                toolbar: (props) => (
                  <div className="custom-toolbar">
                    <div className="toolbar-navigation">
                      <button
                        className="nav-btn"
                        onClick={() => props.onNavigate("PREV")}
                      >
                        ←
                      </button>
                      <button
                        className="nav-btn today-btn"
                        onClick={() => props.onNavigate("TODAY")}
                      >
                        Today
                      </button>
                      <button
                        className="nav-btn"
                        onClick={() => props.onNavigate("NEXT")}
                      >
                        →
                      </button>
                    </div>
                    <div className="toolbar-label">
                      <h3>{props.label}</h3>
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </section>

        {/* Move announcements section to bottom */}
        <section className="announcements-section">
          <div className="announcements-header">
            <h2>Announcements</h2>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowAnnModal(true);
                setEditingAnn(null);
                setAnnForm({
                  title: "",
                  description: "",
                  date: "",
                  author: "",
                  status: "draft",
                });
              }}
            >
              + Add Announcement
            </button>
          </div>
          <div className="announcements-list">
            {announcements.map((ann) => (
              <div className="announcement-card" key={ann.id}>
                <div>
                  <h3>{ann.title}</h3>
                  <p>{ann.description}</p>
                  <div className="announcement-meta">
                    <span>{ann.date}</span>
                    <span>By {ann.author}</span>
                    <span className={`status-badge ${ann.status}`}>
                      {ann.status}
                    </span>
                  </div>
                </div>
                <div className="announcement-actions">
                  <button
                    className="btn-action"
                    onClick={() => handleAnnView(ann)}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    className="btn-action"
                    onClick={() => handleAnnEdit(ann)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action"
                    onClick={() => handleAnnDelete(ann.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="empty-msg">No announcements yet.</div>
            )}
          </div>
        </section>

        <Footer
          title="Stay Connected"
          subtitle="Get the latest updates about University of Colombo and academic opportunities"
          theme="dark"
          sidebarExpanded={isSidebarOpen}
        />
      </main>

      {/* Enhanced Announcement Modal */}
      {showAnnModal && (
        <div
          className="university-announcement-modal-overlay"
          onClick={() => setShowAnnModal(false)}
        >
          <div
            className="university-announcement-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="university-announcement-modal-header">
              <h3>
                {editingAnn
                  ? "✏️ Edit Announcement"
                  : "📢 Add New Announcement"}
              </h3>
              <button
                className="university-announcement-modal-close"
                onClick={() => setShowAnnModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="university-announcement-modal-body">
              <form onSubmit={handleAnnSubmit}>
                <div className="university-announcement-form-group">
                  <label>Title *</label>
                  <input
                    name="title"
                    value={annForm.title}
                    onChange={handleAnnFormChange}
                    className="university-announcement-form-input"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div className="university-announcement-form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={annForm.description}
                    onChange={handleAnnFormChange}
                    className="university-announcement-form-textarea"
                    placeholder="Enter announcement description"
                    required
                  />
                </div>

                <div className="university-announcement-form-group">
                  <label>Date *</label>
                  <input
                    name="date"
                    type="date"
                    value={annForm.date}
                    onChange={handleAnnFormChange}
                    className="university-announcement-form-input"
                    required
                  />
                </div>

                <div className="university-announcement-form-group">
                  <label>Author *</label>
                  <input
                    name="author"
                    value={annForm.author}
                    onChange={handleAnnFormChange}
                    className="university-announcement-form-input"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div className="university-announcement-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={annForm.status}
                    onChange={handleAnnFormChange}
                    className="university-announcement-form-select"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="university-announcement-form-actions">
                  <button
                    type="button"
                    className="university-announcement-btn-cancel"
                    onClick={() => setShowAnnModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="university-announcement-btn-save"
                  >
                    {editingAnn ? "Save Changes" : "Add Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {showEventModal && (
        <div
          className="university-announcement-modal-overlay"
          onClick={() => setShowEventModal(false)}
        >
          <div
            className="university-announcement-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="university-announcement-modal-header">
              <h3>{editingEvent ? "✏️ Edit Event" : "📅 Add New Event"}</h3>
              <button
                className="university-announcement-modal-close"
                onClick={() => setShowEventModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="university-announcement-modal-body">
              <form onSubmit={handleEventSubmit}>
                <div className="university-announcement-form-group">
                  <label>Event Title *</label>
                  <input
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventFormChange}
                    className="university-announcement-form-input"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="university-announcement-form-group">
                  <label>Event Date *</label>
                  <input
                    name="date"
                    type="date"
                    value={eventForm.date}
                    onChange={handleEventFormChange}
                    className="university-announcement-form-input"
                    required
                  />
                </div>

                <div className="university-announcement-form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleEventFormChange}
                    className="university-announcement-form-textarea"
                    placeholder="Describe the event details"
                    required
                  />
                </div>

                <div className="university-announcement-form-actions">
                  <button
                    type="button"
                    className="university-announcement-btn-cancel"
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="university-announcement-btn-save"
                  >
                    {editingEvent ? "Save Changes" : "Add Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {showViewEventModal && selectedEvent && (
        <div
          className="university-announcement-modal-overlay"
          onClick={() => setShowViewEventModal(false)}
        >
          <div
            className="university-announcement-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="university-announcement-modal-header">
              <h3>📅 Event Details</h3>
              <button
                className="university-announcement-modal-close"
                onClick={() => setShowViewEventModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="university-announcement-modal-body">
              <div className="university-announcement-event-details">
                <div className="university-announcement-event-meta">
                  <div
                    className="university-announcement-meta-item"
                    data-info="date"
                  >
                    <strong>Date:</strong>
                    <span>
                      {new Date(selectedEvent.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div
                    className="university-announcement-meta-item"
                    data-info="time"
                  >
                    <strong>Event ID:</strong>
                    <span>#{selectedEvent.id}</span>
                  </div>
                </div>

                <div className="university-announcement-event-description">
                  <strong>Event Title:</strong>
                  <h4
                    style={{
                      margin: "0.5rem 0 1rem 0",
                      color: "#1e293b",
                      fontSize: "1.2rem",
                    }}
                  >
                    {selectedEvent.title}
                  </h4>
                </div>

                <div className="university-announcement-event-description">
                  <strong>Description:</strong>
                  <p>{selectedEvent.description}</p>
                </div>

                <div className="university-announcement-form-actions">
                  <button
                    className="university-announcement-btn-cancel"
                    onClick={() => setShowViewEventModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="university-announcement-btn-save"
                    onClick={() => {
                      setShowViewEventModal(false);
                      handleEventEdit(selectedEvent);
                    }}
                  >
                    Edit Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Announcement Modal */}
      {showAnnViewModal && viewingAnn && (
        <div
          className="university-announcement-modal-overlay"
          onClick={() => setShowAnnViewModal(false)}
        >
          <div
            className="university-announcement-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="university-announcement-modal-header">
              <h3>📢 {viewingAnn.title}</h3>
              <button
                className="university-announcement-modal-close"
                onClick={() => setShowAnnViewModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="university-announcement-modal-body">
              <div className="university-announcement-event-details">
                <div className="university-announcement-event-meta">
                  <div
                    className="university-announcement-meta-item"
                    data-info="date"
                  >
                    <strong>Date:</strong>
                    <span>
                      {new Date(viewingAnn.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="university-announcement-meta-item">
                    <strong>Author:</strong>
                    <span>{viewingAnn.author}</span>
                  </div>
                  <div className="university-announcement-meta-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${viewingAnn.status}`}>
                      {viewingAnn.status}
                    </span>
                  </div>
                </div>

                <div className="university-announcement-event-description">
                  <strong>Description:</strong>
                  <p>{viewingAnn.description}</p>
                </div>

                <div className="university-announcement-form-actions">
                  <button
                    className="university-announcement-btn-cancel"
                    onClick={() => setShowAnnViewModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="university-announcement-btn-save"
                    onClick={() => {
                      setShowAnnViewModal(false);
                      handleAnnEdit(viewingAnn);
                    }}
                  >
                    Edit Announcement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
