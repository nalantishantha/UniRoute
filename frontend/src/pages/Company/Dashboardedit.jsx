import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/Navigation/CompanySidebar'; // CHANGED: Import CompanySidebar
import CompanyDashboardNavbar from '../../components/Navigation/CompanyDashboardNavbar';
import './Dashboardedit.css';

const Dashboardedit = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename state variable
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState({});
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dashboardId, setDashboardId] = useState(null);
  const navigate = useNavigate();

  // Editable company info
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Inovetive Tech Dashboard',
    description: 'Leading provider of innovative tech solutions, shaping the future of digital excellence',
    logo: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png'
  });

  // Editable story section
  const [storyContent, setStoryContent] = useState({
    title: 'Our Story',
    subtitle: 'From humble beginnings to a global leader in technology, we\'ve always been driven by a passion for innovation and a commitment to excellence.',
    sectionTitle: 'Pioneering the Future of Technology',
    description: 'Founded in 2020, Tech Innovations began with a vision to revolutionize how businesses interact with technology. What started as a small team with big ideas has grown into a leading provider of innovative solutions, serving a diverse clientele across various industries. Our journey has been defined by continuous learning, adaptability, and an unwavering focus on customer success.',
    secondDescription: 'We believe that technology should empower, simplify, and inspire. Every solution we craft, every project we undertake, is guided by this philosophy. Our commitment to research and development ensures that we are always at the forefront of emerging technologies, delivering not just solutions, but future-proof advantages.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'
  });

  // Editable offers section
  const [offers, setOffers] = useState([
    { id: 1, title: 'Innovative Solutions', description: 'We develop cutting-edge solutions that solve complex problems and drive progress.' },
    { id: 2, title: 'Expert Consultation', description: 'Our team of seasoned experts provides unparalleled insights and strategic guidance.' },
    { id: 3, title: 'Reliable Support', description: 'Dedicated support ensures seamless operation and peace of mind for our clients.' },
    { id: 4, title: 'Future-Proof Technology', description: 'Building scalable and adaptable technologies ready for tomorrow\'s challenges.' },
    { id: 5, title: 'Custom Development', description: 'Tailored software and hardware solutions crafted to meet unique business needs.' },
    { id: 6, title: 'Global Reach', description: 'Delivering innovative tech solutions to businesses across continents.' }
  ]);

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

  // Editable announcements
  const [recentAnnouncements, setRecentAnnouncements] = useState([
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

  // Editable team members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Eleanor Vance', role: 'CEO & Founder', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 2, name: 'Marcus Thorne', role: 'Chief Technology Officer', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: 'Sophia Chen', role: 'Head of Product', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: 4, name: 'Liam Fitzgerald', role: 'Lead Software Engineer', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 5, name: 'Ava Rodriguez', role: 'VP of Marketing', image: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { id: 6, name: 'Daniel Kim', role: 'Customer Success Lead', image: 'https://randomuser.me/api/portraits/men/6.jpg' }
  ]);

  // Editable testimonials
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      quote: "Tech Innovations transformed our operations with their custom software. Their expertise and dedication are unmatched!",
      author: "Sarah Jenkins",
      role: "CIO, Nexus Analytics"
    },
    {
      id: 2,
      quote: "The team at Tech Innovations provided us with insights that significantly boosted our market presence. Truly visionary!",
      author: "David Lee",
      role: "Director of Strategy, Global Ventures"
    },
    {
      id: 3,
      quote: "Their cutting-edge solutions helped us streamline our processes and reduce costs. A truly invaluable partner.",
      author: "Maria Garcia",
      role: "Operations Manager, EcoTech Solutions"
    },
    {
      id: 4,
      quote: "Excellent support and truly innovative products. Tech Innovations is a leader in their field, highly recommended!",
      author: "Robert Wilson",
      role: "CIO, Quantum Dynamics"
    }
  ]);

  // Editable contact info
  const [contactInfo, setContactInfo] = useState({
    email: 'info@techinnovations.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Drive, Innovation City, CA 90210'
  });

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

  // Handle internship view
  const handleViewInternship = (internship) => {
    setSelectedInternship(internship);
    setShowInternshipModal(true);
  };

  // Handle course view
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  // Edit functions
  const toggleEdit = (section, id = null) => {
    const key = id ? `${section}-${id}` : section;
    setIsEditing(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveChanges = (section, id = null) => {
    const key = id ? `${section}-${id}` : section;
    setIsEditing(prev => ({
      ...prev,
      [key]: false
    }));
    // Here you would typically save to backend
    console.log(`Saved changes for ${section}`, id);
  };

  const updateOffer = (id, field, value) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, [field]: value } : offer
    ));
  };

  const updateTeamMember = (id, field, value) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const updateTestimonial = (id, field, value) => {
    setTestimonials(prev => prev.map(testimonial => 
      testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
    ));
  };

  const updateAnnouncement = (id, field, value) => {
    setRecentAnnouncements(prev => prev.map(announcement => 
      announcement.id === id ? { ...announcement, [field]: value } : announcement
    ));
  };

  // Save dashboard data
  const handleSaveDashboard = async () => {
    const data = {
      story_title: storyContent.title,
      story_subtitle: storyContent.subtitle,
      story_section_title: storyContent.sectionTitle,
      story_description: storyContent.description,
      story_second_description: storyContent.secondDescription,
      story_image: storyContent.image,
      offers,
      team: teamMembers,
      testimonials,
      contact_email: contactInfo.email,
      contact_phone: contactInfo.phone,
      contact_address: contactInfo.address,
      announcements: recentAnnouncements, // Add this line
    };
    if (!dashboardId) {
      // Create dashboard
      const response = await fetch('/api/companies/company-dashboard-edit/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, company_id: 1 })
      });
      const result = await response.json();
      if (result.success) {
        setDashboardId(result.dashboard_id);
        alert('Dashboard created!');
      } else {
        alert(result.message || 'Failed to create dashboard');
      }
    } else {
      // Update dashboard
      const response = await fetch(`/api/companies/company-dashboard-edit/${dashboardId}/update/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        alert('Dashboard updated!');
      } else {
        alert(result.message || 'Failed to update dashboard');
      }
    }
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

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboard() {
      const response = await fetch('/api/companies/company-dashboard-edit/?company_id=1');
      const result = await response.json();
      if (result.success) {
        const d = result.dashboard;
        setStoryContent({
          title: d.story_title,
          subtitle: d.story_subtitle,
          sectionTitle: d.story_section_title,
          description: d.story_description,
          secondDescription: d.story_second_description,
          image: d.story_image
        });
        setOffers(d.offers);
        setTeamMembers(d.team);
        setTestimonials(d.testimonials);
        setContactInfo({
          email: d.contact_email,
          phone: d.contact_phone,
          address: d.contact_address
        });
        setRecentAnnouncements(d.announcements || []);
        setDashboardId(d.dashboard_id);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="edit-dashboard-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <CompanySidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* NAVBAR */}
      <CompanyDashboardNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className={`edit-dashboard-main ${isSidebarOpen ? 'edit-sidebar-expanded' : 'edit-sidebar-collapsed'}`}>
        {/* Company Story Section */}
        <section className="edit-dashboard-story">
          <div className="edit-story-header">
            <button 
              className="edit-section-btn"
              onClick={() => {
                if (isEditing.story) {
                  handleSaveDashboard(); // <-- Save to backend
                }
                toggleEdit('story');
              }}
            >
              {isEditing.story ? 'Save Story' : 'Edit Story'}
            </button>
          </div>
          {isEditing.story ? (
            <input
              type="text"
              value={storyContent.title}
              onChange={(e) => setStoryContent(prev => ({...prev, title: e.target.value}))}
              className="edit-input-field edit-title-input"
            />
          ) : (
            <h2>{storyContent.title}</h2>
          )}
          {isEditing.story ? (
            <textarea
              value={storyContent.subtitle}
              onChange={(e) => setStoryContent(prev => ({...prev, subtitle: e.target.value}))}
              className="edit-textarea-field"
            />
          ) : (
            <p className="edit-dashboard-story__subtitle">{storyContent.subtitle}</p>
          )}
          <div className="edit-dashboard-story__details">
            <div>
              {isEditing.story ? (
                <input
                  type="text"
                  value={storyContent.sectionTitle}
                  onChange={(e) => setStoryContent(prev => ({...prev, sectionTitle: e.target.value}))}
                  className="edit-input-field"
                />
              ) : (
                <h3>{storyContent.sectionTitle}</h3>
              )}
              {isEditing.story ? (
                <>
                  <textarea
                    value={storyContent.description}
                    onChange={(e) => setStoryContent(prev => ({...prev, description: e.target.value}))}
                    className="edit-textarea-field"
                  />
                  <textarea
                    value={storyContent.secondDescription}
                    onChange={(e) => setStoryContent(prev => ({...prev, secondDescription: e.target.value}))}
                    className="edit-textarea-field"
                    onBlur={() => saveChanges('story')}
                  />
                </>
              ) : (
                <>
                  <p>{storyContent.description}</p>
                  <p>{storyContent.secondDescription}</p>
                </>
              )}
              <a href="#" className="edit-dashboard-link">Learn More About Us →</a>
            </div>
            <div>
              {isEditing.story ? (
                <input
                  type="url"
                  value={storyContent.image}
                  onChange={(e) => setStoryContent(prev => ({...prev, image: e.target.value}))}
                  className="edit-input-field"
                  placeholder="Image URL"
                />
              ) : (
                <img src={storyContent.image} alt="Team" />
              )}
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="edit-dashboard-offer">
          <div className="edit-offer-header">
            <h2>What We Offer</h2>
            <button 
              className="edit-section-btn"
              onClick={() => toggleEdit('offers')}
            >
              {isEditing.offers ? 'Save Offers' : 'Edit Offers'}
            </button>
          </div>
          <p>Our comprehensive suite of services and products are designed to empower your business, enhance efficiency, and drive unparalleled growth.</p>
          <div className="edit-dashboard-offer__grid">
            {offers.map((offer) => (
              <div key={offer.id} className="edit-dashboard-offer__item">
                {isEditing.offers ? (
                  <>
                    <input
                      type="text"
                      value={offer.title}
                      onChange={(e) => updateOffer(offer.id, 'title', e.target.value)}
                      className="edit-input-field"
                    />
                    <textarea
                      value={offer.description}
                      onChange={(e) => updateOffer(offer.id, 'description', e.target.value)}
                      className="edit-textarea-field"
                      onBlur={() => saveChanges('offers')}
                    />
                  </>
                ) : (
                  <>
                    <h4>{offer.title}</h4>
                    <p>{offer.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recently Uploaded Internships */}
        <section className="edit-recent-uploads">
          <div className="edit-section-header-with-button">
            <h3>Recently Uploaded Internships</h3>
            <button className="edit-view-all-btn" onClick={handleViewAllInternships}>
              View All Internships →
            </button>
          </div>
          <div className="edit-upload-grid">
            {recentInternships.map((internship) => (
              <div key={internship.id} className="edit-upload-card">
                <img src={internship.image} alt={internship.title} />
                <div className="edit-upload-content">
                  <div className="edit-upload-title">{internship.title}</div>
                  <div className="edit-upload-meta">{internship.type} | {internship.location}</div>
                  <div className="edit-upload-company">{internship.company}</div>
                  <div className="edit-upload-time">Uploaded {internship.uploadedDate}</div>
                  <button className="edit-btn edit-btn-outline" onClick={() => handleViewInternship(internship)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Uploaded Courses */}
        <section className="edit-recent-uploads">
          <div className="edit-section-header-with-button">
            <h3>Recently Uploaded Courses</h3>
            <button className="edit-view-all-btn" onClick={handleViewAllCourses}>
              View All Courses →
            </button>
          </div>
          <div className="edit-upload-grid">
            {recentCourses.map((course) => (
              <div key={course.id} className="edit-upload-card">
                <img src={course.image} alt={course.title} />
                <div className="edit-upload-content">
                  <div className="edit-upload-title">{course.title}</div>
                  <div className="edit-upload-meta">{course.level} | {course.duration}</div>
                  <div className="edit-upload-time">Uploaded {course.uploadedDate}</div>
                  <button className="edit-btn edit-btn-outline" onClick={() => handleViewCourse(course)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Announcements */}
        <section className="edit-recent-section">
          <div className="edit-recent-box">
            <div className="edit-recent-box-header">
              <h4>Recent Announcements</h4>
              <button className="edit-view-all-link-btn" onClick={handleViewAllAnnouncements}>
                View All Announcements →
              </button>
            </div>
            <ul>
              {recentAnnouncements.map((announcement) => (
                <li key={announcement.id}>
                  <b>{announcement.title}</b>
                  <span>{announcement.description}</span>
                  <div className="edit-time-stamp">{announcement.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Team Section */}
        <section className="edit-dashboard-team">
          <div className="edit-team-header">
            <h2>Meet Our Visionaries</h2>
            <button 
              className="edit-section-btn"
              onClick={() => toggleEdit('team')}
            >
              {isEditing.team ? 'Save Team' : 'Edit Team'}
            </button>
          </div>
          <p>Our team is composed of passionate innovators, dedicated problem-solvers, and industry leaders committed to pushing the boundaries of technology.</p>
          <div className="edit-dashboard-team__grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="edit-dashboard-team__member">
                {isEditing.team ? (
                  <input
                    type="url"
                    value={member.image}
                    onChange={(e) => updateTeamMember(member.id, 'image', e.target.value)}
                    className="edit-input-field"
                    placeholder="Image URL"
                  />
                ) : (
                  <img src={member.image} alt={member.name} />
                )}
                <div className="edit-dashboard-team__member-info">
                  {isEditing.team ? (
                    <>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        className="edit-input-field"
                      />
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        className="edit-input-field"
                        onBlur={() => saveChanges('team')}
                      />
                    </>
                  ) : (
                    <>
                      <h5>{member.name}</h5>
                      <span>{member.role}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="edit-dashboard-testimonials">
          <div className="edit-testimonials-header">
            <h2>What Our Clients Say</h2>
            <button 
              className="edit-section-btn"
              onClick={() => toggleEdit('testimonials')}
            >
              {isEditing.testimonials ? 'Save Testimonials' : 'Edit Testimonials'}
            </button>
          </div>
          <div className="edit-dashboard-testimonials__grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="edit-dashboard-testimonial">
                {isEditing.testimonials ? (
                  <>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                      className="edit-textarea-field"
                    />
                    <input
                      type="text"
                      value={testimonial.author}
                      onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                      className="edit-input-field"
                    />
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                      className="edit-input-field"
                      onBlur={() => saveChanges('testimonials')}
                    />
                  </>
                ) : (
                  <>
                    <p>"{testimonial.quote}"</p>
                    <span>
                      {testimonial.author}<br />
                      <small>{testimonial.role}</small>
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="edit-dashboard-contact">
          <div className="edit-contact-header">
            <h2>Get in Touch</h2>
            <button 
              className="edit-section-btn"
              onClick={() => toggleEdit('contact')}
            >
              {isEditing.contact ? 'Save Contact' : 'Edit Contact'}
            </button>
          </div>
          <p>We'd love to hear from you. Whether you have a question about our services, need support, or just want to chat, our team is ready.</p>
          <div className="edit-dashboard-contact__grid">
            <div className="edit-dashboard-contact__item">
              <span className="edit-dashboard-contact__icon">✉️</span>
              <h5>Email Us</h5>
              {isEditing.contact ? (
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({...prev, email: e.target.value}))}
                  className="edit-input-field"
                />
              ) : (
                <p>{contactInfo.email}</p>
              )}
            </div>
            <div className="edit-dashboard-contact__item">
              <span className="edit-dashboard-contact__icon">📞</span>
              <h5>Call Us</h5>
              {isEditing.contact ? (
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({...prev, phone: e.target.value}))}
                  className="edit-input-field"
                />
              ) : (
                <p>{contactInfo.phone}</p>
              )}
            </div>
            <div className="edit-dashboard-contact__item">
              <span className="edit-dashboard-contact__icon">📍</span>
              <h5>Visit Us</h5>
              {isEditing.contact ? (
                <input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo(prev => ({...prev, address: e.target.value}))}
                  className="edit-input-field"
                  onBlur={() => saveChanges('contact')}
                />
              ) : (
                <p>{contactInfo.address}</p>
              )}
            </div>
          </div>
        </section>

        {/* Internship Details Modal */}
        {showInternshipModal && selectedInternship && (
          <div className="edit-dashboard-modal-overlay" onClick={() => setShowInternshipModal(false)}>
            <div className="edit-dashboard-modal-content" onClick={e => e.stopPropagation()}>
              <div className="edit-dashboard-modal-header">
                <h2>{selectedInternship.title}</h2>
                <button className="edit-dashboard-modal-close-btn" onClick={() => setShowInternshipModal(false)}>×</button>
              </div>
              <div className="edit-dashboard-modal-body">
                <img src={selectedInternship.image} alt={selectedInternship.title} className="edit-dashboard-modal-img" />
                <p data-info="company"><strong>Company:</strong> {selectedInternship.company}</p>
                <p data-info="location"><strong>Location:</strong> {selectedInternship.location}</p>
                <p data-info="type"><strong>Type:</strong> {selectedInternship.type}</p>
                <p data-info="uploaded"><strong>Uploaded:</strong> {selectedInternship.uploadedDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Course Details Modal */}
        {showCourseModal && selectedCourse && (
          <div className="edit-dashboard-modal-overlay" onClick={() => setShowCourseModal(false)}>
            <div className="edit-dashboard-modal-content" onClick={e => e.stopPropagation()}>
              <div className="edit-dashboard-modal-header">
                <h2>{selectedCourse.title}</h2>
                <button className="edit-dashboard-modal-close-btn" onClick={() => setShowCourseModal(false)}>×</button>
              </div>
              <div className="edit-dashboard-modal-body">
                <img src={selectedCourse.image} alt={selectedCourse.title} className="edit-dashboard-modal-img" />
                <p data-info="level"><strong>Level:</strong> {selectedCourse.level}</p>
                <p data-info="duration"><strong>Duration:</strong> {selectedCourse.duration}</p>
                <p data-info="uploaded"><strong>Uploaded:</strong> {selectedCourse.uploadedDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="edit-dashboard-footer">
          <div className="edit-footer-content">
            <h3>Stay Connected</h3>
            <div className="edit-newsletter">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboardedit;