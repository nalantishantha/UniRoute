import React, { useState } from 'react';
import UniversitySidebar from '../../components/Navigation/UniversitySidebar';
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';
import { number } from 'framer-motion';
import nicFront from '../../assets/id_1F.jpg';
import nicBack from '../../assets/id_2_b.jpg';
import uniIdFront from '../../assets/id_2F.jpg';
import uniIdBack from '../../assets/ID-back-EN.png';

// Path to the real PDF in public folder
const RecommendationPDF = '/Letter.pdf';

// Mock data for mentor requests
const initialMentorRequests = [
  {
    id: 1,
    name: ' Sarah Amarasingha',
    email: 'ucsccmb22000@gmail.com',
    phone: '070-3144967',
    education: 'Undergraduate Computer Science, MIT',
    Recommendation : 'Pro Sandun Rangana of university colombo',
    bio: 'Experienced software engineer with expertise in machine learning and artificial intelligence.',
    skills: ['Python', 'Machine Learning', 'React', 'Node.js', 'AI/ML','Marketing'],
    profileImage: '/api/placeholder/100/100',
    requestDate: '2024-01-15',
    specialization: 'Computer Science & AI',
    Year: '4th year',
    Registrationnumber: '22000771',
    status: 'pending'

  },
  {
    "id": 2,
    "name": "Nimal Perera",
    "email": "ucscmb21001@cmb.ac.lk",
    "phone": "071-2345678",
    "education": "Undergraduate in Computer Science, University of Colombo",
    "Recommendation": "Prof. Kamal Gunawardena of University of Colombo",
    "bio": "Passionate about AI and software development with experience in university research projects.",
    "skills": ["Python", "Java", "Machine Learning", "Web Development", "Database Management"],
    "profileImage": "/api/placeholder/100/100",
    "requestDate": "2024-02-10",
    "specialization": "Artificial Intelligence",
    "Year": "3rd year",
    "Registrationnumber": '22000761',
    "status": "approved"
  },
  {
    "id": 3,
    "name": "Samanthi Silva",
    "email": "ucscmb21045@cmb.ac.lk",
    "phone": "072-3456789",
    "education": "Undergraduate in Information Systems, University of Colombo",
    "Recommendation": "Dr. Priyantha Fernando of University of Colombo",
    "bio": "Interested in data science and business analytics, with hands-on experience in Python and SQL.",
    "skills": ["Python", "SQL", "Data Analysis", "Statistics", "UI/UX Design"],
    "profileImage": "/api/placeholder/100/100",
    "requestDate": "2024-01-25",
    "specialization": "Data Science",
    "Year": "2nd year",
    "Registrationnumber": '22000761',
    "status": "pending"
    
  },
];

// Mock data for active mentors
const initialActiveMentors = [
  {
    id: 101,
    name: 'Kasuni Gunawardhana',
    email: 'kasuni.gunawardhana@tech.com',
    specialization: 'Software Engineering',
    experience: '1 years',
    students: 12,
    rating: 4.8,
    profileImage: 'https://randomuser.me/api/portraits/men/11.jpg',
    joinDate: '2023-09-15'
  },
  {
    id: 102,
    name: 'Lisitha Dissanayake',
    email: 'lisitha.dissanayake@business.com',
    specialization: 'Digital Marketing',
    experience: '2 years',
    students: 8,
    rating: 4.9,
    profileImage: '/api/placeholder/100/100',
    joinDate: '2023-08-20'
  }
];

const Mentoruni = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mentorRequests, setMentorRequests] = useState(initialMentorRequests);
  const [activeMentors, setActiveMentors] = useState(initialActiveMentors);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('requests');

  const handleAcceptMentor = (mentor) => {
    // Move mentor from requests to active mentors
    const newActiveMentor = {
      ...mentor,
      students: 0,
      rating: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setActiveMentors(prev => [...prev, newActiveMentor]);
    setMentorRequests(prev => prev.filter(req => req.id !== mentor.id));
    
    // Show success message (in real app, send email to mentor)
    alert(`✅ Mentor request accepted! Success message sent to ${mentor.name}`);
  };

  const handleRejectMentor = () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    
    // Remove mentor from requests
    setMentorRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
    
    // Show rejection message (in real app, send email to mentor)
    alert(`❌ Mentor request rejected. Rejection reason sent to ${selectedRequest.name}: "${rejectReason}"`);
    
    // Reset modal
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  const openRejectModal = (mentor) => {
    setSelectedRequest(mentor);
    setShowRejectModal(true);
  };

  const handleViewMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowViewModal(true);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would download the actual PDF
    alert('Downloading recommendation letter PDF...');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      <UniversitySidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <UniversityNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      <main style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '288px' : '0',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
        background: '#f8fafc',
        paddingTop: '90px'
      }}>
        
        {/* Header Section */}
        <section style={{
          background: 'white',
          margin: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>Mentor Management</h1>
            <p style={{
              color: '#64748b',
              fontSize: '1.1rem',
              marginBottom: '0'
            }}>Review and manage mentor applications and active mentors</p>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '2px solid #e5e7eb',
            marginBottom: '0'
          }}>
            <button
              onClick={() => setActiveTab('requests')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: '600',
                color: activeTab === 'requests' ? '#2563eb' : '#64748b',
                borderBottom: activeTab === 'requests' ? '3px solid #2563eb' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Mentor Requests ({mentorRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: '600',
                color: activeTab === 'active' ? '#2563eb' : '#64748b',
                borderBottom: activeTab === 'active' ? '3px solid #2563eb' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Active Mentors ({activeMentors.length})
            </button>
          </div>
        </section>

        {/* Mentor Requests Tab */}
        {activeTab === 'requests' && (
          <section style={{
            background: 'white',
            margin: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1.5rem'
            }}>Pending Mentor Requests</h2>

            {mentorRequests.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                padding: '3rem 2rem',
                fontStyle: 'italic',
                background: '#f9fafb',
                border: '2px dashed #d1d5db',
                borderRadius: '8px'
              }}>No pending mentor requests.</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 400px)', // Fixed 3 columns, adjust as needed
                gap: '1.5rem',
                justifyContent: 'start',
                alignItems: 'start',
                minHeight: '420px' // Ensures grid height stays consistent
              }}>
                {mentorRequests.map(mentor => (
                  <div key={mentor.id} style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '2rem',
                    transition: 'all 0.2s',
                    width: '400px',
                    minWidth: '400px',
                    maxWidth: '400px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewMentor(mentor)}
                  >
                    {/* Mentor Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      marginBottom: '1.75rem'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: 'white',
                        boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                        border: '3px solid #ffffff',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={`https://randomuser.me/api/portraits/${mentor.id % 2 === 0 ? 'men' : 'women'}/${(mentor.id % 50) + 1}.jpg`}
                          alt={mentor.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1.15rem',
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: '0 0 0.5rem 0',
                          lineHeight: '1.3'
                        }}>{mentor.name}</h3>
                        <p style={{
                          color: '#64748b',
                          fontSize: '0.9rem',
                          margin: '0',
                          fontWeight: '500'
                        }}>{mentor.specialization}</p>
                      </div>
                    </div>

                    {/* Mentor Details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem 1rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.4'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ marginBottom: '0.25rem' }}>Registration:</strong>
                        <span style={{ color: '#64748b' }}>{mentor.Registrationnumber}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ marginBottom: '0.25rem' }}>Year:</strong>
                        <span style={{ color: '#64748b' }}>{mentor.Year}</span>
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                        <strong style={{ marginBottom: '0.25rem' }}>Education:</strong>
                        <span style={{ color: '#64748b' }}>{mentor.education}</span>
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                        <strong style={{ marginBottom: '0.25rem' }}>Email:</strong>
                        <span style={{ color: '#64748b' }}>{mentor.email}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <strong style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Bio:</strong>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.875rem',
                        margin: '0',
                        lineHeight: '1.6',
                        textAlign: 'justify'
                      }}>{mentor.bio}</p>
                    </div>

                    {/* Skills */}
                    <div style={{ marginBottom: '2rem' }}>
                      <strong style={{ fontSize: '0.875rem', marginBottom: '0.75rem', display: 'block' }}>Skills:</strong>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        {mentor.skills.map((skill, index) => (
                          <span key={index} style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: '1px solid #dbeafe'
                          }}>{skill}</span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptMentor(mentor);
                        }}
                        style={{
                          flex: 1,
                          background: ' #174A7C var(--tw-gradient-to-position)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#2563eb';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#2563eb';
                        }}
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRejectModal(mentor);
                        }}
                        style={{
                          flex: 1,
                          background: '#64748b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#475569';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#64748b';
                        }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Active Mentors Tab */}
        {activeTab === 'active' && (
          <section style={{
            background: 'white',
            margin: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1.5rem'
            }}>Active Mentors</h2>

            {activeMentors.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                padding: '3rem 2rem',
                fontStyle: 'italic',
                background: '#f9fafb',
                border: '2px dashed #d1d5db',
                borderRadius: '8px'
              }}>No active mentors yet.</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 350px)', // Fixed 3 columns with 350px width
                gap: '1.5rem',
                justifyContent: 'start',
                alignItems: 'start',
                minHeight: '320px' // Ensures grid height stays consistent
              }}>
                {activeMentors.map(mentor => (
                  <div key={mentor.id} style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '2rem',
                    transition: 'all 0.3s ease',
                    width: '350px',
                    minWidth: '350px',
                    maxWidth: '350px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Blue accent strip */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #2563eb, #3b82f6)'
                    }} />

                    {/* Mentor Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={`https://randomuser.me/api/portraits/${mentor.id % 2 === 0 ? 'men' : 'women'}/${(mentor.id % 50) + 10}.jpg`}
                          alt={mentor.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#1e293b',
                          margin: '0 0 0.25rem 0'
                        }}>{mentor.name}</h3>
                        <p style={{
                          color: '#2563eb',
                          fontSize: '0.9rem',
                          margin: '0',
                          fontWeight: '600'
                        }}>{mentor.specialization}</p>
                      </div>
                    </div>

                    {/* Mentor Stats */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid #bfdbfe',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)'
                      }}>
                        <div style={{
                          fontSize: '1.75rem',
                          fontWeight: '800',
                          color: '#1d4ed8',
                          marginBottom: '0.25rem'
                        }}>{mentor.students}</div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Students</div>
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid #bfdbfe',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)'
                      }}>
                        <div style={{
                          fontSize: '1.75rem',
                          fontWeight: '800',
                          color: '#1d4ed8',
                          marginBottom: '0.25rem'
                        }}>{mentor.rating || 'N/A'}</div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Rating</div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div style={{
                      background: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '1.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#1e293b' }}>Email:</strong> {mentor.email}</div>
                      <div style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#1e293b' }}>Experience:</strong> {mentor.experience}</div>
                      <div><strong style={{ color: '#1e293b' }}>Joined:</strong> {mentor.joinDate}</div>
                    </div>

                    {/* Status Badge and Delete Button */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      marginTop: '0.5rem'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                        color: 'white',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '25px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        ✓ Active Mentor
                      </div>
                      <button
                        onClick={() => setActiveMentors(prev => prev.filter(m => m.id !== mentor.id))}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                          marginLeft: 'auto'
                        }}
                        onMouseOver={e => (e.target.style.background = '#b91c1c')}
                        onMouseOut={e => (e.target.style.background = '#ef4444')}
                        title="Delete Mentor"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <Footer
          title="Mentor Excellence"
          subtitle="Building the future through quality mentorship"
          theme="dark"
          sidebarExpanded={isSidebarOpen}
        />
      </main>

      {/* View Mentor Modal */}
      {showViewModal && selectedMentor && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setShowViewModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            maxWidth: '800px',
            width: '95%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }} onClick={e => e.stopPropagation()}>
            {/* Updated Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              padding: '2rem',
              borderRadius: '20px 20px 0 0',
              borderBottom: '2px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              {/* Decorative gradient bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #2563eb, #3b82f6, #1d4ed8)',
                borderRadius: '20px 20px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Remove or comment out this block to hide the profile image */}
                {/* 
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                  border: '3px solid #ffffff',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={selectedMentor.profileImage}
                    alt={selectedMentor.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                */}
                <div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    margin: '0 0 0.5rem 0',
                    color: '#1e293b',
                    lineHeight: '1.2'
                  }}>{selectedMentor.name}</h2>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      color: '#2563eb',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      border: '1px solid #dbeafe'
                    }}>{selectedMentor.specialization}</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      color: '#16a34a',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      border: '1px solid #bbf7d0'
                    }}>📋 Application Review</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowViewModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                  border: '2px solid #cbd5e1',
                  width: '45px',
                  height: '45px',
                  borderRadius: '15px',
                  color: '#64748b',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  fontWeight: '300'
                }}
                onMouseOver={e => {
                  e.target.style.background = 'linear-gradient(135deg, #fee2e2, #fecaca)';
                  e.target.style.borderColor = '#f87171';
                  e.target.style.color = '#dc2626';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={e => {
                  e.target.style.background = 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.color = '#64748b';
                  e.target.style.transform = 'scale(1)';
                }}
              >✕</button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              {/* Basic Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem'
                }}>📋 Basic Information</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  background: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div><strong>Registration Number:</strong> {selectedMentor.Registrationnumber}</div>
                  <div><strong>Academic Year:</strong> {selectedMentor.Year}</div>
                  <div><strong>Email:</strong> {selectedMentor.email}</div>
                  <div><strong>Phone:</strong> {selectedMentor.phone}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Education:</strong> {selectedMentor.education}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Recommendation:</strong> {selectedMentor.Recommendation}</div>
                </div>
              </div>

              {/* Bio & Skills */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem'
                }}>📝 Bio & Skills</h3>
                <div style={{
                  background: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem'
                }}>
                  <p style={{ lineHeight: '1.6', margin: '0', color: '#374151' }}>{selectedMentor.bio}</p>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {selectedMentor.skills.map((skill, index) => (
                    <span key={index} style={{
                      background: '#174A7C var(--tw-gradient-to-position)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>{skill}</span>
                  ))}
                </div>
              </div>

              {/* Identity Documents */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem'
                }}>🆔 Identity Documents</h3>
                
                {/* NIC Images */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>National Identity Card</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{
                      background: '#f8fafc',
                      border: '2px dashed #d1d5db',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <img src={nicFront} alt="NIC Front" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                      <div style={{ fontWeight: '600', color: '#374151' }}>NIC Front Side</div>
                    </div>
                    <div style={{
                      background: '#f8fafc',
                      border: '2px dashed #d1d5db',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <img src={nicBack} alt="NIC Back" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                      <div style={{ fontWeight: '600', color: '#374151' }}>NIC Back Side</div>
                    </div>
                  </div>
                </div>

                {/* University ID Images */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>University ID Card</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{
                      background: '#f8fafc',
                      border: '2px dashed #d1d5db',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <img src={uniIdFront} alt="University ID Front" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                      <div style={{ fontWeight: '600', color: '#374151' }}>University ID Front</div>
                    </div>
                    <div style={{
                      background: '#f8fafc',
                      border: '2px dashed #d1d5db',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <img src={uniIdBack} alt="University ID Back" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                      <div style={{ fontWeight: '600', color: '#374151' }}>University ID Back</div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Letter */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Recommendation Letter</h4>
                  <div style={{
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    border: '2px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '2.5rem' }}>📄</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>Recommendation Letter PDF</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>From: {selectedMentor.Recommendation}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <a
                        href={RecommendationPDF}
                        download="Recommendation_Letter.pdf"
                        style={{
                          background: '#ffffff',
                          color: '#2563eb',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '0.6rem 1.2rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          textDecoration: 'none',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.2s ease',
                          letterSpacing: '0.025em'
                        }}
                        onMouseOver={e => {
                          e.target.style.background = '#f8fafc';
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.1)';
                        }}
                        onMouseOut={e => {
                          e.target.style.background = '#ffffff';
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        <div style={{
                          width: '16px',
                          height: '16px',
                          background: '#2563eb',
                          borderRadius: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>⬇</div>
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1.5rem'
              }}>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleAcceptMentor(selectedMentor);
                  }}
                  style={{
                    background: ' #174A7C var(--tw-gradient-to-position)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ✓ Accept Application
                </button>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    openRejectModal(selectedMentor);
                  }}
                  style={{
                    background: '#64748b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ✗ Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setShowRejectModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              background: '#fff',
              color: '#1e293b',
              padding: '1.5rem 2rem',
              borderRadius: '12px 12px 0 0',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0,
                color: '#1e293b'
              }}>✗ Reject Mentor Application</h3>
              <button 
                onClick={() => setShowRejectModal(false)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  color: '#64748b',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >✕</button>
            </div>
            
            <div style={{ padding: '1.5rem 2rem' }}>
              <p style={{
                color: '#374151',
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                Please provide a reason for rejecting <strong>{selectedRequest?.name}</strong>'s mentor application. 
                This message will be sent to the applicant.
              </p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                  placeholder="Please explain why this application was rejected..."
                />
              </div>
            </div>

            <div style={{
              padding: '1rem 2rem 1.5rem 2rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button 
                onClick={() => setShowRejectModal(false)}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >Cancel</button>
              <button
                onClick={handleRejectMentor}
                disabled={!rejectReason.trim()}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: rejectReason.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem',
                  opacity: rejectReason.trim() ? 1 : 0.6
                }}
              >
                Send Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentoruni;
