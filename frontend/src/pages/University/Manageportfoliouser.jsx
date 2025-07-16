import React, { useState } from 'react';
import UniSidebar from '../../components/UniSidebar';
import UniHeader from '../../components/UniHeader';
import Footer from '../../components/Footer';
import './Manageportfoliouser.css';

const Manageportfoliouser = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // University data
  const universityInfo = {
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
  };

  const achievements = [
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
  ];

  const rankingHistory = [
    { year: "2024", worldRank: "801-850", localRank: "1", score: "85.2" },
    { year: "2023", worldRank: "851-900", localRank: "1", score: "84.8" },
    { year: "2022", worldRank: "901-950", localRank: "2", score: "83.5" },
    { year: "2021", worldRank: "951-1000", localRank: "2", score: "82.1" },
    { year: "2020", worldRank: "1001+", localRank: "3", score: "80.9" }
  ];

  const faculties = [
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
  ];

  const degreePrograms = [
    { level: "Undergraduate", count: "45", duration: "3-6 years" },
    { level: "Postgraduate", count: "78", duration: "1-3 years" },
    { level: "Doctoral", count: "25", duration: "3-7 years" },
    { level: "Professional", count: "12", duration: "6 months-2 years" }
  ];

  const recentEvents = [
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
  ];

  const facilities = [
    { name: "Central Library", description: "Over 500,000 books and digital resources", icon: "📚" },
    { name: "Research Laboratories", description: "State-of-the-art research facilities", icon: "🔬" },
    { name: "Sports Complex", description: "Olympic-size pool and multi-sport facilities", icon: "🏊‍♂️" },
    { name: "Medical Center", description: "Full-service healthcare for students and staff", icon: "🏥" },
    { name: "Student Hostels", description: "Modern accommodation for 3,000+ students", icon: "🏠" },
    { name: "Computer Centers", description: "24/7 access to computing resources", icon: "💻" }
  ];

  return (
    <div className="portfolio-page">
      <div className="portfolio-container">
        <UniSidebar activePage="manage-portfolio" onExpandChange={setIsSidebarExpanded} />
        <UniHeader sidebarExpanded={isSidebarExpanded} />

        <main className={`portfolio-main-content ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          
          {/* Hero Section */}
          <section className="portfolio-hero">
            <div className="hero-background">
              <div className="hero-overlay"></div>
            </div>
            <div className="hero-content">
              <h1 className="university-name">{universityInfo.name}</h1>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">{universityInfo.established}</span>
                  <span className="stat-label">Established</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">{universityInfo.students}</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">{universityInfo.faculty}</span>
                  <span className="stat-label">Faculty</span>
                </div>
              </div>
            </div>
          </section>

          {/* University Overview */}
          <section className="portfolio-section overview-section">
            <div className="section-header">
              <h2>🏛️ University Overview</h2>
              <p>Learn about our institution's foundation and leadership</p>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📍 Location</h3>
                <p>{universityInfo.location}</p>
              </div>
              <div className="overview-card">
                <h3>🏫 Type</h3>
                <p>{universityInfo.type}</p>
              </div>
              <div className="overview-card">
                <h3>👨‍💼 Chancellor</h3>
                <p>{universityInfo.chancellor}</p>
              </div>
              <div className="overview-card">
                <h3>👨‍🎓 Vice Chancellor</h3>
                <p>{universityInfo.vicechancellor}</p>
              </div>
              <div className="overview-card">
                <h3>🏢 Campuses</h3>
                <p>{universityInfo.campuses}</p>
              </div>
              <div className="overview-card">
                <h3>🎯 Focus</h3>
                <p>Research & Innovation</p>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="portfolio-section achievements-section">
            <div className="section-header">
              <h2>🏆 Achievements & Awards</h2>
              <p>Recognition of our excellence and commitment to quality education</p>
            </div>
            <div className="achievements-grid">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="achievement-card">
                  <div className="achievement-year">{achievement.year}</div>
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <div className="achievement-rank">{achievement.rank}</div>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ranking History */}
          <section className="portfolio-section ranking-section">
            <div className="section-header">
              <h2>📈 Ranking History</h2>
              <p>Our journey of academic excellence over the years</p>
            </div>
            <div className="ranking-chart">
              <div className="chart-header">
                <div>Year</div>
                <div>World Rank</div>
                <div>Local Rank</div>
                <div>Score</div>
                <div>Trend</div>
              </div>
              {rankingHistory.map((rank, idx) => (
                <div key={idx} className="chart-row">
                  <div className="rank-year">{rank.year}</div>
                  <div className="rank-world">{rank.worldRank}</div>
                  <div className="rank-local">#{rank.localRank}</div>
                  <div className="rank-score">{rank.score}</div>
                  <div className="rank-trend">
                    {idx < rankingHistory.length - 1 ? '📈' : '📊'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Faculties & Departments */}
          <section className="portfolio-section faculties-section">
            <div className="section-header">
              <h2>🏫 Faculties & Schools</h2>
              <p>Comprehensive academic divisions offering diverse programs</p>
            </div>
            <div className="faculties-grid">
              {faculties.map((faculty, idx) => (
                <div key={idx} className="faculty-card">
                  <div className="faculty-header">
                    <h3>{faculty.name}</h3>
                    <span className="faculty-established">Est. {faculty.established}</span>
                  </div>
                  <div className="faculty-stats">
                    <div className="faculty-stat">
                      <span className="stat-number">{faculty.students}</span>
                      <span className="stat-label">Students</span>
                    </div>
                    <div className="faculty-stat">
                      <span className="stat-number">{faculty.departments.length}</span>
                      <span className="stat-label">Departments</span>
                    </div>
                  </div>
                  <div className="faculty-departments">
                    <h4>Departments:</h4>
                    <div className="departments-list">
                      {faculty.departments.map((dept, deptIdx) => (
                        <span key={deptIdx} className="department-tag">{dept}</span>
                      ))}
                    </div>
                  </div>
                  <div className="faculty-programs">
                    <h4>Programs:</h4>
                    <div className="programs-list">
                      {faculty.programs.map((program, progIdx) => (
                        <span key={progIdx} className="program-tag">{program}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Degree Programs */}
          <section className="portfolio-section programs-section">
            <div className="section-header">
              <h2>🎓 Degree Programs</h2>
              <p>Comprehensive academic offerings across all levels</p>
            </div>
            <div className="programs-grid">
              {degreePrograms.map((program, idx) => (
                <div key={idx} className="program-card">
                  <h3>{program.level}</h3>
                  <div className="program-count">{program.count}</div>
                  <p>Programs Available</p>
                  <div className="program-duration">
                    <span>⏰ Duration: {program.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Events */}
          <section className="portfolio-section events-section">
            <div className="section-header">
              <h2>📅 Recent Events & Milestones</h2>
              <p>Highlighting our major events and achievements</p>
            </div>
            <div className="events-timeline">
              {recentEvents.map((event, idx) => (
                <div key={event.id} className="event-item">
                  <div className="event-icon">{event.image}</div>
                  <div className="event-content">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <span className="event-type">{event.type}</span>
                    </div>
                    <div className="event-date">{event.date}</div>
                    <p className="event-description">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Facilities */}
          <section className="portfolio-section facilities-section">
            <div className="section-header">
              <h2>🏢 Campus Facilities</h2>
              <p>World-class infrastructure supporting academic excellence</p>
            </div>
            <div className="facilities-grid">
              {facilities.map((facility, idx) => (
                <div key={idx} className="facility-card">
                  <div className="facility-icon">{facility.icon}</div>
                  <h3>{facility.name}</h3>
                  <p>{facility.description}</p>
                </div>
              ))}
            </div>
          </section>

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

export default Manageportfoliouser;