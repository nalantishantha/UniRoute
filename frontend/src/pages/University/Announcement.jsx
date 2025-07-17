import React, { useState } from 'react';
import UniSidebar from '../../components/UniSidebar';
import UniHeader from '../../components/UniHeader';
import Footer from '../../components/Footer';
import './Announcement.css';

// Add these imports for the calendar
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';

// Calendar localization setup
const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Dummy data for announcements and events
const initialAnnouncements = [
  {
    id: 1,
    title: 'Semester Registration Open',
    description: 'Registration for the new semester is now open. Please complete your registration before the deadline.',
    date: '2025-07-01',
    author: 'Registrar',
    status: 'published'
  },
  {
    id: 2,
    title: 'Library Closed for Renovation',
    description: 'The main library will be closed from July 15 to July 30 for renovation.',
    date: '2025-07-10',
    author: 'Library Admin',
    status: 'draft'
  },
  {
    id: 3,
    title: 'New Cafeteria Menu',
    description: 'The university cafeteria has introduced a new menu starting this week. Check it out for healthy and affordable meals.',
    date: '2025-07-12',
    author: 'Cafeteria Manager',
    status: 'published'
  },
  {
    id: 4,
    title: 'Guest Lecture: AI in Education',
    description: 'Join us for a guest lecture on Artificial Intelligence in Education by Dr. Jane Smith on July 18th at the Main Auditorium.',
    date: '2025-07-18',
    author: 'Academic Affairs',
    status: 'published'
  },
  {
    id: 5,
    title: 'Sports Meet Registration',
    description: 'Registrations for the annual sports meet are now open. Interested students can sign up at the Sports Office.',
    date: '2025-07-20',
    author: 'Sports Coordinator',
    status: 'draft'
  }
];

const initialEvents = [
  {
    id: 1,
    title: 'Convocation Ceremony',
    date: '2025-07-20',
    description: 'Annual convocation for all graduating students.',
  },
  {
    id: 2,
    title: 'Research Symposium',
    date: '2025-07-25',
    description: 'A symposium to showcase student and faculty research.',
  }
];

const Announcement = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [events, setEvents] = useState(initialEvents);

  // Announcement modal state
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [annForm, setAnnForm] = useState({ title: '', description: '', date: '', author: '', status: 'draft' });

  // Event modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', date: '', description: '' });

  // Add calendar view state
  const [calendarView, setCalendarView] = useState('month');

  // Announcement handlers
  const handleAnnFormChange = e => setAnnForm({ ...annForm, [e.target.name]: e.target.value });
  const handleAnnSubmit = e => {
    e.preventDefault();
    if (editingAnn) {
      setAnnouncements(anns =>
        anns.map(a => (a.id === editingAnn.id ? { ...annForm, id: editingAnn.id } : a))
      );
    } else {
      setAnnouncements(anns => [
        ...anns,
        { ...annForm, id: Date.now() }
      ]);
    }
    setShowAnnModal(false);
    setEditingAnn(null);
    setAnnForm({ title: '', description: '', date: '', author: '', status: 'draft' });
  };
  const handleAnnEdit = ann => {
    setEditingAnn(ann);
    setAnnForm(ann);
    setShowAnnModal(true);
  };
  const handleAnnDelete = id => setAnnouncements(anns => anns.filter(a => a.id !== id));
  const handleAnnView = ann => alert(`${ann.title}\n\n${ann.description}`);

  // Event handlers
  const handleEventFormChange = e => setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  const handleEventSubmit = e => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(evts =>
        evts.map(ev => (ev.id === editingEvent.id ? { ...eventForm, id: editingEvent.id } : ev))
      );
    } else {
      setEvents(evts => [
        ...evts,
        { ...eventForm, id: Date.now() }
      ]);
    }
    setShowEventModal(false);
    setEditingEvent(null);
    setEventForm({ title: '', date: '', description: '' });
  };
  const handleEventEdit = ev => {
    setEditingEvent(ev);
    setEventForm(ev);
    setShowEventModal(true);
  };
  const handleEventDelete = id => setEvents(evts => evts.filter(ev => ev.id !== id));
  const handleEventView = ev => alert(`${ev.title}\n\n${ev.description}`);

  // Enhanced calendar event handler
  const handleSelectEvent = (event) => {
    handleEventView(event.resource);
  };

  // Calendar slot selection for adding events
  const handleSelectSlot = ({ start }) => {
    const dateStr = start.toISOString().split('T')[0];
    setEventForm({ title: '', date: dateStr, description: '' });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  // Convert your events to calendar format
  const calendarEvents = events.map(ev => ({
    title: ev.title,
    start: new Date(ev.date),
    end: new Date(ev.date),
    allDay: true,
    resource: ev,
  }));

  return (
    <div className="university-announcement-page">
      <div className="announcement-dashboard-container">
        <UniSidebar activePage="announcement" onExpandChange={setIsSidebarExpanded} />
        <UniHeader sidebarExpanded={isSidebarExpanded} />

        <main className={`announcement-main-content ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          
          {/* Move calendar section to top */}
          <section className="calendar-section">
            <div className="calendar-header">
              <h2>Upcoming Events</h2>
              <div className="calendar-controls">
                <div className="view-buttons">
                  <button 
                    className={`view-btn ${calendarView === 'month' ? 'active' : ''}`}
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={`view-btn ${calendarView === 'week' ? 'active' : ''}`}
                    onClick={() => setCalendarView('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`view-btn ${calendarView === 'day' ? 'active' : ''}`}
                    onClick={() => setCalendarView('day')}
                  >
                    Day
                  </button>
                  <button 
                    className={`view-btn ${calendarView === 'agenda' ? 'active' : ''}`}
                    onClick={() => setCalendarView('agenda')}
                  >
                    Agenda
                  </button>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowEventModal(true); setEditingEvent(null); setEventForm({ title: '', date: '', description: '' }); }}>
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
                views={['month', 'week', 'day', 'agenda']}
                style={{ height: 600 }}
                popup
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: '#6366f1',
                    borderRadius: '6px',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }
                })}
                components={{
                  toolbar: (props) => (
                    <div className="custom-toolbar">
                      <div className="toolbar-navigation">
                        <button className="nav-btn" onClick={() => props.onNavigate('PREV')}>
                          ←
                        </button>
                        <button className="nav-btn today-btn" onClick={() => props.onNavigate('TODAY')}>
                          Today
                        </button>
                        <button className="nav-btn" onClick={() => props.onNavigate('NEXT')}>
                          →
                        </button>
                      </div>
                      <div className="toolbar-label">
                        <h3>{props.label}</h3>
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </section>

          {/* Move announcements section to bottom */}
          <section className="announcements-section">
            <div className="announcements-header">
              <h2>Announcements</h2>
              <button className="btn btn-primary" onClick={() => { setShowAnnModal(true); setEditingAnn(null); setAnnForm({ title: '', description: '', date: '', author: '', status: 'draft' }); }}>
                + Add Announcement
              </button>
            </div>
            <div className="announcements-list">
              {announcements.map(ann => (
                <div className="announcement-card" key={ann.id}>
                  <div>
                    <h3>{ann.title}</h3>
                    <p>{ann.description}</p>
                    <div className="announcement-meta">
                      <span>{ann.date}</span>
                      <span>By {ann.author}</span>
                      <span className={`status-badge ${ann.status}`}>{ann.status}</span>
                    </div>
                  </div>
                  <div className="announcement-actions">
                    <button className="btn-action" onClick={() => handleAnnView(ann)} title="View">👁️</button>
                    <button className="btn-action" onClick={() => handleAnnEdit(ann)} title="Edit">✏️</button>
                    <button className="btn-action" onClick={() => handleAnnDelete(ann.id)} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <div className="empty-msg">No announcements yet.</div>}
            </div>
          </section>

          <Footer
            title="Stay Connected"
            subtitle="Get the latest updates about University of Colombo and academic opportunities"
            theme="dark"
            sidebarExpanded={isSidebarExpanded}
          />
        </main>
      </div>

      {/* Announcement Modal */}
      {showAnnModal && (
        <div className="modal-overlay" onClick={() => setShowAnnModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingAnn ? 'Edit Announcement' : 'Add Announcement'}</h3>
            <form onSubmit={handleAnnSubmit}>
              <input name="title" value={annForm.title} onChange={handleAnnFormChange} placeholder="Title" required />
              <textarea name="description" value={annForm.description} onChange={handleAnnFormChange} placeholder="Description" required />
              <input name="date" type="date" value={annForm.date} onChange={handleAnnFormChange} required />
              <input name="author" value={annForm.author} onChange={handleAnnFormChange} placeholder="Author" required />
              <select name="status" value={annForm.status} onChange={handleAnnFormChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowAnnModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingAnn ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
            <form onSubmit={handleEventSubmit}>
              <input name="title" value={eventForm.title} onChange={handleEventFormChange} placeholder="Event Title" required />
              <input name="date" type="date" value={eventForm.date} onChange={handleEventFormChange} required />
              <textarea name="description" value={eventForm.description} onChange={handleEventFormChange} placeholder="Description" required />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowEventModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingEvent ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;