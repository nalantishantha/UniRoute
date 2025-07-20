import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyUserSidebar from '../../components/Navigation/CompanyUsersidebar';
import CompanyDashboardNavbar from '../../components/Navigation/CompanyDashboardNavbar';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // REVERTED: Back to true (sidebar visible by default)
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Sample data for dashboard
  const [recentInternships] = useState([
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Tech Innovations (Pvt) Ltd',
      location: 'Colombo',
      type: 'Full Time',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      uploadedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Management Intern',
      company: 'Tech Innovations (Pvt) Ltd',
      location: 'Remote',
      type: 'Full Time',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      uploadedDate: '3 days ago'
    },
    {
      id: 3,
      title: 'Data Science Intern',
      company: 'Tech Innovations (Pvt) Ltd',
      location: 'Kandy',
      type: 'Part Time',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      uploadedDate: '5 days ago'
    }
  ]);

  const [recentCourses] = useState([
    {
      id: 1,
      title: 'Introduction to Web Development',
      level: 'Beginner',
      duration: '6 Weeks',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      uploadedDate: '1 day ago'
    },
    {
      id: 2,
      title: 'Data Science with Python',
      level: 'Intermediate',
      duration: '8 Weeks',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      uploadedDate: '2 days ago'
    },
    {
      id: 3,
      title: 'Marketing Fundamentals',
      level: 'Beginner',
      duration: '4 Weeks',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      uploadedDate: '4 days ago'
    }
  ]);

  const [recentAnnouncements] = useState([
    {
      id: 1,
      title: 'Scheduled Maintenance Notification',
      description: 'Our services will be temporarily unavailable for scheduled maintenance on Saturday, 8:00 PM - 10:00 PM.',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'New Security Best Practices Guide',
      description: 'We\'ve released a comprehensive guide to help keep your account secure.',
      time: '1 day ago'
    },
    {
      id: 3,
      title: 'Webinar: Mastering Analytics Reports',
      description: 'Join our upcoming webinar to maximize your analytics skills.',
      time: '3 days ago'
    }
  ]);

  const [recentActivities] = useState([
    { id: 1, action: 'Dashboard settings updated by Jane Doe', time: '2 hours ago' },
    { id: 2, action: 'New report: Q1 Sales Overview generated', time: '4 hours ago' },
    { id: 3, action: 'API Key "Marketing_X7" regenerated', time: '6 hours ago' },
    { id: 4, action: 'Subscription plan upgraded to Premium', time: '1 day ago' }
  ]);

  const [teamMembers] = useState([
    { name: 'Eleanor Vance', role: 'CEO & Founder', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Marcus Thorne', role: 'Chief Technology Officer', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { name: 'Sophia Chen', role: 'Head of Product', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { name: 'Liam Fitzgerald', role: 'Lead Software Engineer', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { name: 'Ava Rodriguez', role: 'VP of Marketing', image: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { name: 'Daniel Kim', role: 'Customer Success Lead', image: 'https://randomuser.me/api/portraits/men/6.jpg' }
  ]);

  const [testimonials] = useState([
    {
      quote: "Tech Innovations transformed our operations with their custom software. Their expertise and dedication are unmatched!",
      author: "Sarah Jenkins",
      role: "CIO, Nexus Analytics"
    },
    {
      quote: "The team at Tech Innovations provided us with insights that significantly boosted our market presence. Truly visionary!",
      author: "David Lee",
      role: "Director of Strategy, Global Ventures"
    },
    {
      quote: "Their cutting-edge solutions helped us streamline our processes and reduce costs. A truly invaluable partner.",
      author: "Maria Garcia",
      role: "Operations Manager, EcoTech Solutions"
    },
    {
      quote: "Excellent support and truly innovative products. Tech Innovations is a leader in their field, highly recommended!",
      author: "Robert Wilson",
      role: "CIO, Quantum Dynamics"
    }
  ]);

  const [showUserInternshipModal, setShowUserInternshipModal] = useState(false);
  const [showUserCourseModal, setShowUserCourseModal] = useState(false);
  const [selectedUserInternship, setSelectedUserInternship] = useState(null);
  const [selectedUserCourse, setSelectedUserCourse] = useState(null);

  // Navigation functions
  const handleViewAllInternships = () => {
    navigate('/company/internshipuser');
  };

  const handleViewAllCourses = () => {
    navigate('/company/courseuser');
  };

  const handleViewAllAnnouncements = () => {
    navigate('/company/announcementuser');
  };

  // View Details handlers for user popups
  const handleUserViewInternship = (internship) => {
    setSelectedUserInternship(internship);
    setShowUserInternshipModal(true);
  };
  const handleUserViewCourse = (course) => {
    setSelectedUserCourse(course);
    setShowUserCourseModal(true);
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-page">
      <CompanyUserSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <CompanyDashboardNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />
      <main className={`dashboard-main ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        
        {/* Company Story Section */}
        <section className="dashboard-story">
          <h2>Our Story</h2>
          <p className="dashboard-story__subtitle">From humble beginnings to a global leader in technology, we've always been driven by a passion for innovation and a commitment to excellence.</p>
          <div className="dashboard-story__details">
            <div>
              <h3>Pioneering the Future of Technology</h3>
              <p>Founded in 2020, Tech Innovations began with a vision to revolutionize how businesses interact with technology. What started as a small team with big ideas has grown into a leading provider of innovative solutions, serving a diverse clientele across various industries. Our journey has been defined by continuous learning, adaptability, and an unwavering focus on customer success.</p>
              <p>We believe that technology should empower, simplify, and inspire. Every solution we craft, every project we undertake, is guided by this philosophy. Our commitment to research and development ensures that we are always at the forefront of emerging technologies, delivering not just solutions, but future-proof advantages.</p>
              <a href="#" className="dashboard-link">Learn More About Us →</a>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" alt="Team" />
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="dashboard-offer">
          <h2>What We Offer</h2>
          <p>Our comprehensive suite of services and products are designed to empower your business, enhance efficiency, and drive unparalleled growth.</p>
          <div className="dashboard-offer__grid">
            <div className="dashboard-offer__item">
              <h4>Innovative Solutions</h4>
              <p>We develop cutting-edge solutions that solve complex problems and drive progress.</p>
            </div>
            <div className="dashboard-offer__item">
              <h4>Expert Consultation</h4>
              <p>Our team of seasoned experts provides unparalleled insights and strategic guidance.</p>
            </div>
            <div className="dashboard-offer__item">
              <h4>Reliable Support</h4>
              <p>Dedicated support ensures seamless operation and peace of mind for our clients.</p>
            </div>
            <div className="dashboard-offer__item">
              <h4>Future-Proof Technology</h4>
              <p>Building scalable and adaptable technologies ready for tomorrow's challenges.</p>
            </div>
            <div className="dashboard-offer__item">
              <h4>Custom Development</h4>
              <p>Tailored software and hardware solutions crafted to meet unique business needs.</p>
            </div>
            <div className="dashboard-offer__item">
              <h4>Global Reach</h4>
              <p>Delivering innovative tech solutions to businesses across continents.</p>
            </div>
          </div>
        </section>

        {/* Recently Uploaded Internships */}
        <section className="recent-uploads">
          <div className="section-header-with-button">
            <h3>Recently Uploaded Internships</h3>
            <button
              className="company-dashboard-user-viewall-btn company-dashboard-user-viewall-internship-btn"
              onClick={handleViewAllInternships}
            >
              View All Internships →
            </button>
          </div>
          <div className="upload-grid">
            {recentInternships.map((internship) => (
              <div key={internship.id} className="upload-card">
                <img src={internship.image} alt={internship.title} />
                <div className="upload-content">
                  <div className="upload-title">{internship.title}</div>
                  <div className="upload-meta">{internship.type} | {internship.location}</div>
                  <div className="upload-company">{internship.company}</div>
                  <div className="upload-time">Uploaded {internship.uploadedDate}</div>
                  <button
                    className="company-dashboard-user-current-btn"
                    onClick={() => handleUserViewInternship(internship)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Uploaded Courses */}
        <section className="recent-uploads">
          <div className="section-header-with-button">
            <h3>Recently Uploaded Courses</h3>
            <button
              className="company-dashboard-user-viewall-btn company-dashboard-user-viewall-course-btn"
              onClick={handleViewAllCourses}
            >
              View All Courses →
            </button>
          </div>
          <div className="upload-grid">
            {recentCourses.map((course) => (
              <div key={course.id} className="upload-card">
                <img src={course.image} alt={course.title} />
                <div className="upload-content">
                  <div className="upload-title">{course.title}</div>
                  <div className="upload-meta">{course.level} | {course.duration}</div>
                  <div className="upload-time">Uploaded {course.uploadedDate}</div>
                  <button
                    className="company-dashboard-user-current-btn"
                    onClick={() => handleUserViewCourse(course)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Announcements */}
        <section className="recent-section">
          <div className="recent-box">
            <div className="recent-box-header">
              <h4>Recent Announcements</h4>
              <button
                className="company-dashboard-user-viewall-btn company-dashboard-user-viewall-announcement-btn"
                onClick={handleViewAllAnnouncements}
              >
                View All Announcements →
              </button>
            </div>
            <ul>
              {recentAnnouncements.map((announcement) => (
                <li key={announcement.id}>
                  <b>{announcement.title}</b>
                  <span>{announcement.description}</span>
                  <div className="time-stamp">{announcement.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Team Section */}
        <section className="dashboard-team">
          <h2>Meet Our Visionaries</h2>
          <p>Our team is composed of passionate innovators, dedicated problem-solvers, and industry leaders committed to pushing the boundaries of technology.</p>
          <div className="dashboard-team__grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="dashboard-team__member">
                <img src={member.image} alt={member.name} />
                <div className="dashboard-team__member-info">
                  <h5>{member.name}</h5>
                  <span>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="dashboard-testimonials">
          <h2>What Our Clients Say</h2>
          <div className="dashboard-testimonials__grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="dashboard-testimonial">
                <p>"{testimonial.quote}"</p>
                <span>
                  {testimonial.author}<br />
                  <small>{testimonial.role}</small>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="dashboard-contact">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you. Whether you have a question about our services, need support, or just want to chat, our team is ready.</p>
          <div className="dashboard-contact__grid">
            <div className="dashboard-contact__item">
              <span className="dashboard-contact__icon">✉️</span>
              <h5>Email Us</h5>
              <p>info@techinnovations.com</p>
            </div>
            <div className="dashboard-contact__item">
              <span className="dashboard-contact__icon">📞</span>
              <h5>Call Us</h5>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="dashboard-contact__item">
              <span className="dashboard-contact__icon">📍</span>
              <h5>Visit Us</h5>
              <p>123 Tech Drive, Innovation City, CA 90210</p>
            </div>
          </div>
        </section>

        {/* Footer - Same as Course page */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <h3>Stay Connected</h3>
            <div className="newsletter">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </footer>

        {/* Internship Details Modal (User) */}
        {showUserInternshipModal && selectedUserInternship && (
          <div className="company-dashboard-user-current-modal-overlay" onClick={() => setShowUserInternshipModal(false)}>
            <div className="company-dashboard-user-current-modal-content" onClick={e => e.stopPropagation()}>
              <div className="company-dashboard-user-current-modal-header">
                <h2>{selectedUserInternship.title}</h2>
                <button className="company-dashboard-user-current-modal-close-btn" onClick={() => setShowUserInternshipModal(false)}>×</button>
              </div>
              <div className="company-dashboard-user-current-modal-body">
                <img src={selectedUserInternship.image} alt={selectedUserInternship.title} className="company-dashboard-user-current-modal-img" />
                <div className="company-dashboard-user-current-modal-info-list">
                  <div className="company-dashboard-user-current-modal-info">
                    <span className="company-dashboard-user-current-modal-icon">🏢</span>
                    <span><strong>Company:</strong></span>
                    <span>{selectedUserInternship.company}</span>
                  </div>
                  <div className="company-dashboard-user-current-modal-info">
                    <span className="company-dashboard-user-current-modal-icon">📍</span>
                    <span><strong>Location:</strong></span>
                    <span>{selectedUserInternship.location}</span>
                  </div>
                  <div className="company-dashboard-user-current-modal-info">
                    <span className="company-dashboard-user-current-modal-icon">💼</span>
                    <span><strong>Type:</strong></span>
                    <span>{selectedUserInternship.type}</span>
                  </div>
                  <div className="company-dashboard-user-current-modal-info">
                    <span className="company-dashboard-user-current-modal-icon">📅</span>
                    <span><strong>Uploaded:</strong></span>
                    <span>{selectedUserInternship.uploadedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Details Modal (User) */}
        {showUserCourseModal && selectedUserCourse && (
          <div className="company-dashboard-user-current-modal-overlay" onClick={() => setShowUserCourseModal(false)}>
            <div className="company-dashboard-user-current-modal-content" onClick={e => e.stopPropagation()}>
              <div className="company-dashboard-user-current-modal-header">
                <h2>{selectedUserCourse.title}</h2>
                <button className="company-dashboard-user-current-modal-close-btn" onClick={() => setShowUserCourseModal(false)}>×</button>
              </div>
              <div className="company-dashboard-user-current-modal-body">
                <img src={selectedUserCourse.image} alt={selectedUserCourse.title} className="company-dashboard-user-current-modal-img" />
                <div className="company-dashboard-user-current-modal-info-list">
                  <div className="company-dashboard-user-current-modal-info">
                    <span className="company-dashboard-user-current-modal-icon">📊</span>
                    <span><strong>Level:</strong></span>
                    <span>{selectedUserCourse.level}</span>
                  </div>
                  <div className="company-dashboard-user-current-modal-info">
                    <span className="company-dashboard-user-current-modal-icon">⏱️</span>
                    <span><strong>Duration:</strong></span>
                    <span>{selectedUserCourse.duration}</span>
                  </div>
                  <div className="company-dashboard-user-current-modal-info">
                    <span className="company-dashboard-user-current-modal-icon">📅</span>
                    <span><strong>Uploaded:</strong></span>
                    <span>{selectedUserCourse.uploadedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;