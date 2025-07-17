import React, { useState } from 'react';
import UniSidebar from '../../components/UniSidebar';
import UniHeader from '../../components/UniHeader';
import Footer from '../../components/Footer';
import './Announcementuser.css';

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

// Dummy data for announcements and events (same as admin but read-only)
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
    status: 'published'
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
    status: 'published'
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
  },
  {
    id: 3,
    title: 'Career Fair 2025',
    date: '2025-07-30',
    description: 'Meet with top employers and explore career opportunities.',
  },
  {
    id: 4,
    title: 'Cultural Festival',
    date: '2025-08-05',
    description: 'Annual cultural festival showcasing student talents.',
  }
];

const Announcementuser = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  // Only published announcements for users
  const announcements = initialAnnouncements.filter(ann => ann.status === 'published');
  const events = initialEvents;

  // Calendar view state
  const [calendarView, setCalendarView] = useState('month');

  // View modal states
  const [showAnnViewModal, setShowAnnViewModal] = useState(false);
  const [viewingAnn, setViewingAnn] = useState(null);
  const [showEventViewModal, setShowEventViewModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);

  // View handlers (only view functionality)
  const handleAnnView = (ann) => {
    setViewingAnn(ann);
    setShowAnnViewModal(true);
  };

  const handleEventView = (event) => {
    setViewingEvent(event);
    setShowEventViewModal(true);
  };

  // Enhanced calendar event handler
  const handleSelectEvent = (event) => {
    handleEventView(event.resource);
  };

  // Convert events to calendar format
  const calendarEvents = events.map(ev => ({
    title: ev.title,
    start: new Date(ev.date),
    end: new Date(ev.date),
    allDay: true,
    resource: ev,
  }));

  return (
    <div className="user-announcement-page">
      <div className="user-announcement-dashboard-container">
        <UniSidebar activePage="announcement-user" onExpandChange={setIsSidebarExpanded} />
        <UniHeader sidebarExpanded={isSidebarExpanded} />

        <main className={`user-announcement-main-content ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          
          {/* Calendar section */}
          <section className="user-calendar-section">
            <div className="user-calendar-header">
              <h2>Upcoming Events</h2>
              <div className="user-calendar-controls">
                <div className="user-view-buttons">
                  <button 
                    className={`user-view-btn ${calendarView === 'month' ? 'active' : ''}`}
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={`user-view-btn ${calendarView === 'week' ? 'active' : ''}`}
                    onClick={() => setCalendarView('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`user-view-btn ${calendarView === 'day' ? 'active' : ''}`}
                    onClick={() => setCalendarView('day')}
                  >
                    Day
                  </button>
                  <button 
                    className={`user-view-btn ${calendarView === 'agenda' ? 'active' : ''}`}
                    onClick={() => setCalendarView('agenda')}
                  >
                    Agenda
                  </button>
                </div>
              </div>
            </div>
            <div className="user-calendar-component-wrapper">
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
                onSelectEvent={handleSelectEvent}
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
                    <div className="user-custom-toolbar">
                      <div className="user-toolbar-navigation">
                        <button className="user-nav-btn" onClick={() => props.onNavigate('PREV')}>
                          ←
                        </button>
                        <button className="user-nav-btn user-today-btn" onClick={() => props.onNavigate('TODAY')}>
                          Today
                        </button>
                        <button className="user-nav-btn" onClick={() => props.onNavigate('NEXT')}>
                          →
                        </button>
                      </div>
                      <div className="user-toolbar-label">
                        <h3>{props.label}</h3>
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </section>

          {/* Announcements section */}
          <section className="user-announcements-section">
            <div className="user-announcements-header">
              <h2>Latest Announcements</h2>
            </div>
            <div className="user-announcements-list">
              {announcements.map(ann => (
                <div className="user-announcement-card" key={ann.id}>
                  <div>
                    <h3>{ann.title}</h3>
                    <p>{ann.description}</p>
                    <div className="user-announcement-meta">
                      <span>{ann.date}</span>
                      <span>By {ann.author}</span>
                      <span className={`user-status-badge ${ann.status}`}>{ann.status}</span>
                    </div>
                  </div>
                  <div className="user-announcement-actions">
                    <button className="user-btn-action" onClick={() => handleAnnView(ann)} title="View">
                      👁️ View
                    </button>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="user-empty-msg">No announcements available at the moment.</div>
              )}
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

      {/* Announcement View Modal */}
      {showAnnViewModal && viewingAnn && (
        <div className="user-modal-overlay" onClick={() => setShowAnnViewModal(false)}>
          <div className="user-modal-content" onClick={e => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3>{viewingAnn.title}</h3>
              <button 
                className="user-modal-close"
                onClick={() => setShowAnnViewModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="user-modal-body">
              <div className="user-announcement-details">
                <div className="user-detail-row">
                  <strong>Date:</strong> {viewingAnn.date}
                </div>
                <div className="user-detail-row">
                  <strong>Author:</strong> {viewingAnn.author}
                </div>
                <div className="user-detail-row">
                  <strong>Status:</strong> 
                  <span className={`user-status-badge ${viewingAnn.status}`}>
                    {viewingAnn.status}
                  </span>
                </div>
                <div className="user-detail-description">
                  <strong>Description:</strong>
                  <p>{viewingAnn.description}</p>
                </div>
              </div>
            </div>
            <div className="user-modal-actions">
              <button 
                className="user-btn user-btn-secondary" 
                onClick={() => setShowAnnViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event View Modal */}
      {showEventViewModal && viewingEvent && (
        <div className="user-modal-overlay" onClick={() => setShowEventViewModal(false)}>
          <div className="user-modal-content" onClick={e => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3>{viewingEvent.title}</h3>
              <button 
                className="user-modal-close"
                onClick={() => setShowEventViewModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="user-modal-body">
              <div className="user-event-details">
                <div className="user-detail-row">
                  <strong>Date:</strong> {viewingEvent.date}
                </div>
                <div className="user-detail-description">
                  <strong>Description:</strong>
                  <p>{viewingEvent.description}</p>
                </div>
              </div>
            </div>
            <div className="user-modal-actions">
              <button 
                className="user-btn user-btn-secondary" 
                onClick={() => setShowEventViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcementuser;