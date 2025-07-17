import React, { useState } from 'react';
import UniSidebar from '../../components/UniSidebar';
import UniHeader from '../../components/UniHeader';
import Footer from '../../components/Footer';
import './Manageportfolio.css';

const Manageportfolio = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [editMode, setEditMode] = useState({});

  // University data - now editable
  const [universityInfo, setUniversityInfo] = useState({
    name: "University of Colombo",
    established: "1921",
    motto: "Excellence Through Knowledge",
    location: "Colombo, Sri Lanka",
    type: "Public Research University",
    chancellor: "Prof. Lakshman Dissanayake",
    vicechancellor: "Prof. H.D. Karunaratne",
    students: "12,000+",
    faculty: "800+",
    campuses: "3"
  });

  const [achievements, setAchievements] = useState([
    {
      year: "2024",
      title: "QS World University Rankings",
      rank: "#801-850",
      description: "Maintained position in top global universities"
    },
    {
      year: "2023",
      title: "Best University in Sri Lanka",
      rank: "#1",
      description: "Ranked as the leading university in the country"
    },
    {
      year: "2023",
      title: "Research Excellence Award",
      rank: "Gold",
      description: "Outstanding research contributions in multiple fields"
    },
    {
      year: "2022",
      title: "Green Campus Initiative",
      rank: "Platinum",
      description: "Awarded for sustainable campus practices"
    }
  ]);

  const [rankingHistory, setRankingHistory] = useState([
    { year: "2024", worldRank: "801-850", localRank: "1", score: "85.2" },
    { year: "2023", worldRank: "851-900", localRank: "1", score: "84.8" },
    { year: "2022", worldRank: "901-950", localRank: "2", score: "83.5" },
    { year: "2021", worldRank: "951-1000", localRank: "2", score: "82.1" },
    { year: "2020", worldRank: "1001+", localRank: "3", score: "80.9" }
  ]);

  const [faculties, setFaculties] = useState([
    {
      name: "Faculty of Medicine",
      established: "1870",
      departments: ["Anatomy", "Physiology", "Pharmacology", "Pathology", "Surgery"],
      students: "1,200",
      programs: ["MBBS", "MD", "MS", "PhD"]
    },
    {
      name: "Faculty of Science",
      established: "1942",
      departments: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
      students: "2,500",
      programs: ["BSc", "MSc", "PhD", "Diploma"]
    },
    {
      name: "Faculty of Arts",
      established: "1921",
      departments: ["English", "Sinhala", "Tamil", "History", "Geography"],
      students: "3,000",
      programs: ["BA", "MA", "PhD", "Diploma"]
    },
    {
      name: "Faculty of Law",
      established: "1875",
      departments: ["Public Law", "Private Law", "Commercial Law", "International Law"],
      students: "800",
      programs: ["LLB", "LLM", "PhD"]
    },
    {
      name: "Faculty of Education",
      established: "1980",
      departments: ["Educational Psychology", "Curriculum Studies", "Educational Management"],
      students: "1,500",
      programs: ["BEd", "MEd", "PhD", "Diploma"]
    },
    {
      name: "Faculty of Management & Finance",
      established: "1992",
      departments: ["Management Studies", "Finance", "Marketing", "Human Resources"],
      students: "2,000",
      programs: ["BBA", "MBA", "PhD", "Professional Diploma"]
    }
  ]);

  const [degreePrograms, setDegreePrograms] = useState([
    { level: "Undergraduate", count: "45", duration: "3-6 years" },
    { level: "Postgraduate", count: "78", duration: "1-3 years" },
    { level: "Doctoral", count: "25", duration: "3-7 years" },
    { level: "Professional", count: "12", duration: "6 months-2 years" }
  ]);

  const [recentEvents, setRecentEvents] = useState([
    {
      id: 1,
      title: "Annual Research Conference 2024",
      date: "March 15-17, 2024",
      type: "Conference",
      description: "Three-day international research conference featuring latest academic discoveries",
      image: "🔬"
    },
    {
      id: 2,
      title: "Graduation Ceremony",
      date: "December 20, 2023",
      type: "Ceremony",
      description: "Annual graduation ceremony for over 3,000 students",
      image: "🎓"
    },
    {
      id: 3,
      title: "International Student Exchange Program",
      date: "September 2023",
      type: "Program",
      description: "Launch of new exchange program with 15 international universities",
      image: "🌍"
    },
    {
      id: 4,
      title: "Centenary Celebration",
      date: "July 2021",
      type: "Celebration",
      description: "100 years of excellence in higher education milestone celebration",
      image: "🎉"
    }
  ]);

  const [facilities, setFacilities] = useState([
    { name: "Central Library", description: "Over 500,000 books and digital resources", icon: "📚" },
    { name: "Research Laboratories", description: "State-of-the-art research facilities", icon: "🔬" },
    { name: "Sports Complex", description: "Olympic-size pool and multi-sport facilities", icon: "🏊‍♂️" },
    { name: "Medical Center", description: "Full-service healthcare for students and staff", icon: "🏥" },
    { name: "Student Hostels", description: "Modern accommodation for 3,000+ students", icon: "🏠" },
    { name: "Computer Centers", description: "24/7 access to computing resources", icon: "💻" }
  ]);

  // Edit mode functions
  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateUniversityInfo = (field, value) => {
    setUniversityInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAchievement = (index, field, value) => {
    setAchievements(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addAchievement = () => {
    setAchievements(prev => [...prev, {
      year: "2024",
      title: "New Achievement",
      rank: "#1",
      description: "Achievement description"
    }]);
  };

  const deleteAchievement = (index) => {
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  const updateRanking = (index, field, value) => {
    setRankingHistory(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateFaculty = (index, field, value) => {
    setFaculties(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateEvent = (index, field, value) => {
    setRecentEvents(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateFacility = (index, field, value) => {
    setFacilities(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const saveChanges = () => {
    // Here you would typically send data to backend
    alert('Changes saved successfully!');
    setEditMode({});
  };

  return (
    <div className="manage-portfolio-page">
      <div className="manage-portfolio-container">
        <UniSidebar activePage="manage-portfolio" onExpandChange={setIsSidebarExpanded} />
        <UniHeader sidebarExpanded={isSidebarExpanded} />

        <main className={`manage-portfolio-main-content ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          
          {/* Hero Section */}
          <section className="manage-portfolio-hero">
            <div className="manage-hero-background">
              <div className="manage-hero-overlay"></div>
            </div>
            <div className="manage-hero-content">
              <div className="manage-university-logo">🏛️</div>
              
              {editMode.hero ? (
                <div className="manage-edit-form">
                  <input
                    type="text"
                    value={universityInfo.name}
                    onChange={(e) => updateUniversityInfo('name', e.target.value)}
                    className="manage-edit-input manage-edit-title"
                  />
                  <input
                    type="text"
                    value={universityInfo.motto}
                    onChange={(e) => updateUniversityInfo('motto', e.target.value)}
                    className="manage-edit-input manage-edit-motto"
                  />
                </div>
              ) : (
                <>
                  <h1 className="manage-university-name">{universityInfo.name}</h1>
                  <p className="manage-university-motto">"{universityInfo.motto}"</p>
                </>
              )}
              
              <div className="manage-hero-stats">
                <div className="manage-hero-stat">
                  {editMode.hero ? (
                    <input
                      type="text"
                      value={universityInfo.established}
                      onChange={(e) => updateUniversityInfo('established', e.target.value)}
                      className="manage-edit-input manage-edit-stat"
                    />
                  ) : (
                    <span className="manage-stat-number">{universityInfo.established}</span>
                  )}
                  <span className="manage-stat-label">Established</span>
                </div>
                <div className="manage-hero-stat">
                  {editMode.hero ? (
                    <input
                      type="text"
                      value={universityInfo.students}
                      onChange={(e) => updateUniversityInfo('students', e.target.value)}
                      className="manage-edit-input manage-edit-stat"
                    />
                  ) : (
                    <span className="manage-stat-number">{universityInfo.students}</span>
                  )}
                  <span className="manage-stat-label">Students</span>
                </div>
                <div className="manage-hero-stat">
                  {editMode.hero ? (
                    <input
                      type="text"
                      value={universityInfo.faculty}
                      onChange={(e) => updateUniversityInfo('faculty', e.target.value)}
                      className="manage-edit-input manage-edit-stat"
                    />
                  ) : (
                    <span className="manage-stat-number">{universityInfo.faculty}</span>
                  )}
                  <span className="manage-stat-label">Faculty</span>
                </div>
              </div>
            </div>
            
            <button 
              className="manage-edit-btn manage-edit-hero-btn"
              onClick={() => toggleEditMode('hero')}
            >
              {editMode.hero ? '💾 Save' : '✏️ Edit Hero'}
            </button>
          </section>

          {/* University Overview */}
          <section className="manage-portfolio-section manage-overview-section">
            <div className="manage-section-header">
              <div className="manage-section-title-row">
                <div>
                  <h2>🏛️ University Overview</h2>
                  <p>Learn about our institution's foundation and leadership</p>
                </div>
                <button 
                  className="manage-edit-btn"
                  onClick={() => toggleEditMode('overview')}
                >
                  {editMode.overview ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="manage-overview-grid">
              <div className="manage-overview-card">
                <h3>📍 Location</h3>
                {editMode.overview ? (
                  <input
                    type="text"
                    value={universityInfo.location}
                    onChange={(e) => updateUniversityInfo('location', e.target.value)}
                    className="manage-edit-input"
                  />
                ) : (
                  <p>{universityInfo.location}</p>
                )}
              </div>
              <div className="manage-overview-card">
                <h3>🏫 Type</h3>
                {editMode.overview ? (
                  <input
                    type="text"
                    value={universityInfo.type}
                    onChange={(e) => updateUniversityInfo('type', e.target.value)}
                    className="manage-edit-input"
                  />
                ) : (
                  <p>{universityInfo.type}</p>
                )}
              </div>
              <div className="manage-overview-card">
                <h3>👨‍💼 Chancellor</h3>
                {editMode.overview ? (
                  <input
                    type="text"
                    value={universityInfo.chancellor}
                    onChange={(e) => updateUniversityInfo('chancellor', e.target.value)}
                    className="manage-edit-input"
                  />
                ) : (
                  <p>{universityInfo.chancellor}</p>
                )}
              </div>
              <div className="manage-overview-card">
                <h3>👨‍🎓 Vice Chancellor</h3>
                {editMode.overview ? (
                  <input
                    type="text"
                    value={universityInfo.vicechancellor}
                    onChange={(e) => updateUniversityInfo('vicechancellor', e.target.value)}
                    className="manage-edit-input"
                  />
                ) : (
                  <p>{universityInfo.vicechancellor}</p>
                )}
              </div>
              <div className="manage-overview-card">
                <h3>🏢 Campuses</h3>
                {editMode.overview ? (
                  <input
                    type="text"
                    value={universityInfo.campuses}
                    onChange={(e) => updateUniversityInfo('campuses', e.target.value)}
                    className="manage-edit-input"
                  />
                ) : (
                  <p>{universityInfo.campuses}</p>
                )}
              </div>
              <div className="manage-overview-card">
                <h3>🎯 Focus</h3>
                <p>Research & Innovation</p>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="manage-portfolio-section manage-achievements-section">
            <div className="manage-section-header">
              <div className="manage-section-title-row">
                <div>
                  <h2>🏆 Achievements & Awards</h2>
                  <p>Recognition of our excellence and commitment to quality education</p>
                </div>
                <div className="manage-section-controls">
                  <button 
                    className="manage-edit-btn"
                    onClick={() => toggleEditMode('achievements')}
                  >
                    {editMode.achievements ? '💾 Save' : '✏️ Edit'}
                  </button>
                  {editMode.achievements && (
                    <button 
                      className="manage-add-btn"
                      onClick={addAchievement}
                    >
                      ➕ Add Achievement
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="manage-achievements-grid">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="manage-achievement-card">
                  {editMode.achievements && (
                    <button 
                      className="manage-delete-btn"
                      onClick={() => deleteAchievement(idx)}
                    >
                      🗑️
                    </button>
                  )}
                  
                  {editMode.achievements ? (
                    <div className="manage-edit-form">
                      <input
                        type="text"
                        value={achievement.year}
                        onChange={(e) => updateAchievement(idx, 'year', e.target.value)}
                        className="manage-edit-input"
                        placeholder="Year"
                      />
                      <input
                        type="text"
                        value={achievement.title}
                        onChange={(e) => updateAchievement(idx, 'title', e.target.value)}
                        className="manage-edit-input"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={achievement.rank}
                        onChange={(e) => updateAchievement(idx, 'rank', e.target.value)}
                        className="manage-edit-input"
                        placeholder="Rank"
                      />
                      <textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
                        className="manage-edit-textarea"
                        placeholder="Description"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="manage-achievement-year">{achievement.year}</div>
                      <h3 className="manage-achievement-title">{achievement.title}</h3>
                      <div className="manage-achievement-rank">{achievement.rank}</div>
                      <p className="manage-achievement-description">{achievement.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Ranking History */}
          <section className="manage-portfolio-section manage-ranking-section">
            <div className="manage-section-header">
              <div className="manage-section-title-row">
                <div>
                  <h2>📈 Ranking History</h2>
                  <p>Our journey of academic excellence over the years</p>
                </div>
                <button 
                  className="manage-edit-btn"
                  onClick={() => toggleEditMode('ranking')}
                >
                  {editMode.ranking ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="manage-ranking-chart">
              <div className="manage-chart-header">
                <div>Year</div>
                <div>World Rank</div>
                <div>Local Rank</div>
                <div>Score</div>
                <div>Trend</div>
              </div>
              {rankingHistory.map((rank, idx) => (
                <div key={idx} className="manage-chart-row">
                  {editMode.ranking ? (
                    <>
                      <input
                        type="text"
                        value={rank.year}
                        onChange={(e) => updateRanking(idx, 'year', e.target.value)}
                        className="manage-edit-input manage-edit-small"
                      />
                      <input
                        type="text"
                        value={rank.worldRank}
                        onChange={(e) => updateRanking(idx, 'worldRank', e.target.value)}
                        className="manage-edit-input manage-edit-small"
                      />
                      <input
                        type="text"
                        value={rank.localRank}
                        onChange={(e) => updateRanking(idx, 'localRank', e.target.value)}
                        className="manage-edit-input manage-edit-small"
                      />
                      <input
                        type="text"
                        value={rank.score}
                        onChange={(e) => updateRanking(idx, 'score', e.target.value)}
                        className="manage-edit-input manage-edit-small"
                      />
                      <div className="manage-rank-trend">
                        {idx < rankingHistory.length - 1 ? '📈' : '📊'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="manage-rank-year">{rank.year}</div>
                      <div className="manage-rank-world">{rank.worldRank}</div>
                      <div className="manage-rank-local">#{rank.localRank}</div>
                      <div className="manage-rank-score">{rank.score}</div>
                      <div className="manage-rank-trend">
                        {idx < rankingHistory.length - 1 ? '📈' : '📊'}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Faculties & Departments */}
          <section className="manage-portfolio-section manage-faculties-section">
            <div className="manage-section-header">
              <div className="manage-section-title-row">
                <div>
                  <h2>🏫 Faculties & Schools</h2>
                  <p>Comprehensive academic divisions offering diverse programs</p>
                </div>
                <button 
                  className="manage-edit-btn"
                  onClick={() => toggleEditMode('faculties')}
                >
                  {editMode.faculties ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="manage-faculties-grid">
              {faculties.map((faculty, idx) => (
                <div key={idx} className="manage-faculty-card">
                  <div className="manage-faculty-header">
                    {editMode.faculties ? (
                      <input
                        type="text"
                        value={faculty.name}
                        onChange={(e) => updateFaculty(idx, 'name', e.target.value)}
                        className="manage-edit-input"
                      />
                    ) : (
                      <h3>{faculty.name}</h3>
                    )}
                    <span className="manage-faculty-established">Est. {faculty.established}</span>
                  </div>
                  <div className="manage-faculty-stats">
                    <div className="manage-faculty-stat">
                      {editMode.faculties ? (
                        <input
                          type="text"
                          value={faculty.students}
                          onChange={(e) => updateFaculty(idx, 'students', e.target.value)}
                          className="manage-edit-input manage-edit-small"
                        />
                      ) : (
                        <span className="manage-faculty-stat-number">{faculty.students}</span>
                      )}
                      <span className="manage-faculty-stat-label">Students</span>
                    </div>
                    <div className="manage-faculty-stat">
                      <span className="manage-faculty-stat-number">{faculty.departments.length}</span>
                      <span className="manage-faculty-stat-label">Departments</span>
                    </div>
                  </div>
                  <div className="manage-faculty-departments">
                    <h4>Departments:</h4>
                    <div className="manage-departments-list">
                      {faculty.departments.map((dept, deptIdx) => (
                        <span key={deptIdx} className="manage-department-tag">{dept}</span>
                      ))}
                    </div>
                  </div>
                  <div className="manage-faculty-programs">
                    <h4>Programs:</h4>
                    <div className="manage-programs-list">
                      {faculty.programs.map((program, progIdx) => (
                        <span key={progIdx} className="manage-program-tag">{program}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Degree Programs */}
          <section className="manage-portfolio-section manage-programs-section">
            <div className="manage-section-header">
              <div className="manage-section-title-row">
                <div>
                  <h2>🎓 Degree Programs</h2>
                  <p>Comprehensive academic offerings across all levels</p>
                </div>
                <button 
                  className="manage-edit-btn"
                  onClick={() => toggleEditMode('programs')}
                >
                  {editMode.programs ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="manage-programs-grid">
              {degreePrograms.map((program, idx) => (
                <div key={idx} className="manage-program-card">
                  {editMode.programs ? (
                    <input
                      type="text"
                      value={program.level}
                      onChange={(e) => setDegreePrograms(prev => {
                        const updated = [...prev];
                        updated[idx] = { ...updated[idx], level: e.target.value };
                        return updated;
                      })}
                      className="manage-edit-input"
                    />
                  ) : (
                    <h3>{program.level}</h3>
                  )}
                  
                  {editMode.programs ? (
                    <input
                      type="text"
                      value={program.count}
                      onChange={(e) => setDegreePrograms(prev => {
                        const updated = [...prev];
                        updated[idx] = { ...updated[idx], count: e.target.value };
                        return updated;
                      })}
                      className="manage-edit-input manage-edit-count"
                    />
                  ) : (
                    <div className="manage-program-count">{program.count}</div>
                  )}
                  
                  <p>Programs Available</p>
                  <div className="manage-program-duration">
                    {editMode.programs ? (
                      <input
                        type="text"
                        value={program.duration}
                        onChange={(e) => setDegreePrograms(prev => {
                          const updated = [...prev];
                          updated[idx] = { ...updated[idx], duration: e.target.value };
                          return updated;
                        })}
                        className="manage-edit-input"
                        placeholder="Duration"
                      />
                    ) : (
                      <span>⏰ Duration: {program.duration}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Events */}
          <section className="manage-portfolio-section manage-events-section">
            <div className="manage-section-header">
              <div className="manage-section-title-row">
                <div>
                  <h2>📅 Recent Events & Milestones</h2>
                  <p>Highlighting our major events and achievements</p>
                </div>
                <button 
                  className="manage-edit-btn"
                  onClick={() => toggleEditMode('events')}
                >
                  {editMode.events ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="manage-events-timeline">
              {recentEvents.map((event, idx) => (
                <div key={event.id} className="manage-event-item">
                  <div className="manage-event-icon">{event.image}</div>
                  <div className="manage-event-content">
                    <div className="manage-event-header">
                      {editMode.events ? (
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => updateEvent(idx, 'title', e.target.value)}
                          className="manage-edit-input"
                        />
                      ) : (
                        <h3>{event.title}</h3>
                      )}
                      <span className="manage-event-type">{event.type}</span>
                    </div>
                    {editMode.events ? (
                      <input
                        type="text"
                        value={event.date}
                        onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                        className="manage-edit-input"
                      />
                    ) : (
                      <div className="manage-event-date">{event.date}</div>
                    )}
                    {editMode.events ? (
                      <textarea
                        value={event.description}
                        onChange={(e) => updateEvent(idx, 'description', e.target.value)}
                        className="manage-edit-textarea"
                      />
                    ) : (
                      <p className="manage-event-description">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Facilities */}
          <section className="manage-portfolio-section manage-facilities-section">
            <div className="manage-section-header">
              <div className="manage-section-title-row">
                <div>
                  <h2>🏢 Campus Facilities</h2>
                  <p>World-class infrastructure supporting academic excellence</p>
                </div>
                <button 
                  className="manage-edit-btn"
                  onClick={() => toggleEditMode('facilities')}
                >
                  {editMode.facilities ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="manage-facilities-grid">
              {facilities.map((facility, idx) => (
                <div key={idx} className="manage-facility-card">
                  <div className="manage-facility-icon">{facility.icon}</div>
                  {editMode.facilities ? (
                    <>
                      <input
                        type="text"
                        value={facility.name}
                        onChange={(e) => updateFacility(idx, 'name', e.target.value)}
                        className="manage-edit-input"
                      />
                      <textarea
                        value={facility.description}
                        onChange={(e) => updateFacility(idx, 'description', e.target.value)}
                        className="manage-edit-textarea"
                      />
                    </>
                  ) : (
                    <>
                      <h3>{facility.name}</h3>
                      <p>{facility.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Global Save Button */}
          {Object.values(editMode).some(mode => mode) && (
            <div className="manage-global-save">
              <button className="manage-global-save-btn" onClick={saveChanges}>
                💾 Save All Changes
              </button>
            </div>
          )}

        </main>

        <Footer
          title="University of Colombo"
          subtitle="Excellence in Higher Education Since 1921"
          theme="dark"
          sidebarExpanded={isSidebarExpanded}
        />
      </div>
    </div>
  );
};

export default Manageportfolio;