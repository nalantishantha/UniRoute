import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
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

  // Navigation functions
  const handleViewAllInternships = () => {
    navigate('/company/internship');
  };

  const handleViewAllCourses = () => {
    navigate('/company/course');
  };

  const handleViewAllAnnouncements = () => {
    navigate('/company/announcement');
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
      <div className="dashboard-container">
        {/* Toggle Sidebar Component */}
        <Sidebar 
          activePage="dashboard" 
          onExpandChange={setIsSidebarExpanded}
        />

        {/* Main Content with responsive class */}
        <main className={`dashboard-main ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {/* Hero Section - Same style as Course page */}
          <section className="company-dashboard-hero">
            <div className="hero-content">
              <div className="hero-text">
                <div className="hero-title-with-logo">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
                    alt="Company Logo"
                    className="company-logo"
                  />
                  <h1>Inovetive Tech Dashboard</h1>
                </div>
                <p>Leading provider of innovative tech solutions, shaping the future of digital excellence</p>
                <div className="hero-time-display">
                  <div className="current-time">{formatTime(currentTime)}</div>
                  <div className="current-date">{formatDate(currentTime)}</div>
                </div>
              </div>
            </div>
          </section>

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
              <button className="view-all-btn" onClick={handleViewAllInternships}>
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
                    <button className="btn btn-outline">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recently Uploaded Courses */}
          <section className="recent-uploads">
            <div className="section-header-with-button">
              <h3>Recently Uploaded Courses</h3>
              <button className="view-all-btn" onClick={handleViewAllCourses}>
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
                    <button className="btn btn-outline">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Announcements & Activity Log */}
          <section className="recent-section">
            <div className="recent-box">
              <div className="recent-box-header">
                <h4>Recent Announcements</h4>
                <button className="view-all-link-btn" onClick={handleViewAllAnnouncements}>
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;