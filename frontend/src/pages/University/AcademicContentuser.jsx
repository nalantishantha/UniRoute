import React, { useState } from 'react';
import UniversityUserSidebar from '../../components/Navigation/UniversityUsersidebar'; // CHANGED: Import UniversityUserSidebar
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';
import './AcademicContentuser.css';

// Dummy data for faculties, courses, subjects (same as admin version)
const initialData = {
  faculties: [
    {
      id: 1,
      name: 'Faculty of Medicine',
      description: 'Leading medical education and research in Sri Lanka',
      dean: 'Prof. Dr. A.B. Peiris',
      established: '1870',
      courses: [
        {
          id: 1,
          name: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
          duration: '5 years',
          intake: '200 students/year',
          subjects: [
            {
              id: 1,
              name: 'Anatomy',
              code: 'MED101',
              credits: 4,
              syllabus: {
                overview: 'Human body structure, organ systems, histology basics. This comprehensive course covers the fundamental structures of the human body.',
                objectives: [
                  'Understand basic anatomical terminology and body organization',
                  'Identify major organ systems and their relationships',
                  'Analyze tissue structure and cellular organization',
                  'Apply anatomical knowledge to clinical scenarios'
                ],
                topics: [
                  {
                    title: 'Introduction to Human Anatomy',
                    subtopics: [
                      'Anatomical position and directional terms',
                      'Body planes and sections',
                      'Body cavities and membranes',
                      'Homeostasis and feedback mechanisms'
                    ]
                  },
                  {
                    title: 'Skeletal System',
                    subtopics: [
                      'Bone tissue structure and composition',
                      'Bone development and growth',
                      'Axial skeleton anatomy',
                      'Appendicular skeleton anatomy',
                      'Joint classification and movement'
                    ]
                  },
                  {
                    title: 'Muscular System',
                    subtopics: [
                      'Muscle tissue types and properties',
                      'Skeletal muscle anatomy',
                      'Muscle contraction mechanisms',
                      'Major muscle groups',
                      'Muscle metabolism and fatigue'
                    ]
                  },
                  {
                    title: 'Cardiovascular System',
                    subtopics: [
                      'Heart anatomy and chambers',
                      'Cardiac cycle and electrical conduction',
                      'Blood vessel structure and types',
                      'Circulation pathways',
                      'Blood pressure regulation'
                    ]
                  }
                ],
                assessment: [
                  'Midterm Examination (30%)',
                  'Laboratory Practicals (25%)',
                  'Final Examination (35%)',
                  'Assignments and Quizzes (10%)'
                ],
                references: [
                  'Gray\'s Anatomy for Students - Drake et al.',
                  'Clinically Oriented Anatomy - Moore et al.',
                  'Atlas of Human Anatomy - Netter',
                  'Anatomy & Physiology - Tortora & Derrickson'
                ]
              },
              content: ['Course Handbook.pdf', 'Mentor Notes.pdf', 'Course Details.pdf']
            },
            {
              id: 2,
              name: 'Physiology',
              code: 'MED102',
              credits: 4,
              syllabus: {
                overview: 'Body functions, homeostasis, cardiovascular system. Study of normal body functions and mechanisms that maintain life.',
                objectives: [
                  'Understand physiological processes and mechanisms',
                  'Analyze homeostatic control systems',
                  'Evaluate organ system interactions',
                  'Apply physiological principles to health and disease'
                ],
                topics: [
                  {
                    title: 'Cell Physiology',
                    subtopics: [
                      'Cell membrane structure and transport',
                      'Cellular metabolism and energy production',
                      'Cell signaling and communication',
                      'Gene expression and protein synthesis'
                    ]
                  },
                  {
                    title: 'Nervous System Physiology',
                    subtopics: [
                      'Neuron structure and function',
                      'Action potential generation and propagation',
                      'Synaptic transmission',
                      'Central nervous system organization',
                      'Sensory and motor pathways'
                    ]
                  },
                  {
                    title: 'Cardiovascular Physiology',
                    subtopics: [
                      'Cardiac electrophysiology',
                      'Cardiac output and regulation',
                      'Vascular physiology and blood flow',
                      'Blood pressure control mechanisms',
                      'Cardiovascular responses to exercise'
                    ]
                  }
                ],
                assessment: [
                  'Theory Examinations (50%)',
                  'Laboratory Reports (20%)',
                  'Case Study Analysis (20%)',
                  'Continuous Assessment (10%)'
                ],
                references: [
                  'Guyton & Hall Textbook of Medical Physiology',
                  'Berne & Levy Physiology',
                  'Vander\'s Human Physiology',
                  'Physiological Systems Handbook'
                ]
              },
              content: ['Course Handbook.pdf', 'Mentor Notes.pdf', 'Course Details.pdf']
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Faculty of Engineering',
      description: 'Excellence in engineering education and innovation',
      dean: 'Prof. Eng. C.D. Fernando',
      established: '1912',
      courses: [
        {
          id: 2,
          name: 'Computer Science & Engineering',
          duration: '4 years',
          intake: '150 students/year',
          subjects: [
            {
              id: 3,
              name: 'Data Structures',
              code: 'CS201',
              credits: 3,
              syllabus: {
                overview: 'Fundamental data structures and their applications in computer science. Covers arrays, linked lists, stacks, queues, trees, and graphs with practical implementation and analysis.',
                objectives: [
                  'Understand the core concepts of data structures',
                  'Implement and use various data structures in programming',
                  'Analyze the efficiency of different data structures',
                  'Apply data structures to solve computational problems'
                ],
                topics: [
                  {
                    title: 'Introduction to Data Structures',
                    subtopics: [
                      'Definition and classification',
                      'Abstract Data Types (ADT)',
                      'Complexity analysis (Big O notation)'
                    ]
                  },
                  {
                    title: 'Linear Data Structures',
                    subtopics: [
                      'Arrays and dynamic arrays',
                      'Linked lists (singly, doubly, circular)',
                      'Stacks and their applications',
                      'Queues and their applications'
                    ]
                  },
                  {
                    title: 'Non-Linear Data Structures',
                    subtopics: [
                      'Trees: binary trees, BST, AVL trees',
                      'Tree traversals',
                      'Graphs: representation and traversal (BFS, DFS)'
                    ]
                  },
                  {
                    title: 'Applications and Advanced Topics',
                    subtopics: [
                      'Hash tables and hashing',
                      'Priority queues and heaps',
                      'Use cases in algorithms and real-world problems'
                    ]
                  }
                ],
                assessment: [
                  'Assignments and Programming Labs (30%)',
                  'Midterm Examination (25%)',
                  'Final Examination (35%)',
                  'Quizzes and Participation (10%)'
                ],
                references: [
                  'Data Structures and Algorithms in Java – Goodrich, Tamassia, Goldwasser',
                  'Algorithms, Part I & II – Sedgewick & Wayne',
                  'Data Structures Using C – Reema Thareja',
                  'Introduction to Algorithms – Cormen, Leiserson, Rivest, Stein'
                ]
              },
              content: ['Course Handbook.pdf', 'Mentor Notes.pdf', 'Course Details.pdf']
            }
          ]
        }
      ]
    }
  ]
};

const Academiccontentuser = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [data, setData] = useState(initialData);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  // View modal states only
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [viewingFile, setViewingFile] = useState('');

  // File action handlers (only view and download)
  const handleViewFile = (filename) => {
    setViewingFile(filename);
    setShowViewModal(true);
  };

  // Enhanced download function
  const handleDownloadFile = (filename) => {
    // The file must exist in public/files/
    const fileUrl = `/files/${filename}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Syllabus view handler
  const handleViewSyllabus = () => {
    setShowSyllabusModal(true);
  };

  return (
    <div className="academic-content-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <UniversityUserSidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* NAVBAR */}
      <UniversityNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarExpanded={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className={`academic-main-content ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        
        {/* Overview Section */}
        <section className="academic-overview">
          <div className="overview-header">
            <h1>Academic Content</h1>
            <p>Browse faculties, courses, subjects, and academic content across the university</p>
          </div>
          <div className="overview-stats">
            <div className="stat-card">
              <h3>{data.faculties.length}</h3>
              <p>Faculties</p>
            </div>
            <div className="stat-card">
              <h3>{data.faculties.reduce((total, f) => total + f.courses.length, 0)}</h3>
              <p>Total Courses</p>
            </div>
            <div className="stat-card">
              <h3>{data.faculties.reduce((total, f) => total + f.courses.reduce((ct, c) => ct + c.subjects.length, 0), 0)}</h3>
              <p>Total Subjects</p>
            </div>
          </div>
        </section>

        {/* Faculties Section */}
        <section className="faculties-section">
          <h2>University Faculties</h2>
          <div className="faculties-grid">
            {data.faculties.map(faculty => (
              <div 
                key={faculty.id} 
                className={`faculty-card ${selectedFaculty?.id === faculty.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedFaculty(faculty);
                  setSelectedCourse(null);
                  setSelectedSubject(null);
                }}
              >
                <h3>{faculty.name}</h3>
                <p>{faculty.description}</p>
                <div className="faculty-meta">
                  <span>Dean: {faculty.dean}</span>
                  <span>Est. {faculty.established}</span>
                  <span>{faculty.courses.length} Courses</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses Section */}
        {selectedFaculty && (
          <section className="courses-section">
            <div className="section-header">
              <h2>Courses in {selectedFaculty.name}</h2>
            </div>
            <div className="courses-list">
              {selectedFaculty.courses.map(course => (
                <div 
                  key={course.id}
                  className={`course-card ${selectedCourse?.id === course.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedSubject(null);
                  }}
                >
                  <div className="course-info">
                    <h4>{course.name}</h4>
                    <div className="course-meta">
                      <span>Duration: {course.duration}</span>
                      <span>Intake: {course.intake}</span>
                      <span>{course.subjects.length} Subjects</span>
                    </div>
                  </div>
                </div>
              ))}
              {selectedFaculty.courses.length === 0 && (
                <div className="empty-content">No courses available.</div>
              )}
            </div>
          </section>
        )}

        {/* Subjects Section */}
        {selectedCourse && (
          <section className="subjects-section">
            <div className="section-header">
              <h2>Subjects in {selectedCourse.name}</h2>
            </div>
            <div className="subjects-list">
              {selectedCourse.subjects.map(subject => (
                <div 
                  key={subject.id}
                  className={`subject-card ${selectedSubject?.id === subject.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <div className="subject-info">
                    <h4>{subject.name} ({subject.code})</h4>
                    <p className="syllabus-preview">{subject.syllabus.overview}</p>
                    <div className="subject-meta">
                      <span>Credits: {subject.credits}</span>
                      <span>{subject.content.length} Content Files</span>
                    </div>
                  </div>
                  <div className="subject-actions">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleViewSyllabus(); 
                      }}
                      title="View Syllabus"
                    >
                      📝 View Syllabus
                    </button>
                  </div>
                </div>
              ))}
              {selectedCourse.subjects.length === 0 && (
                <div className="empty-content">No subjects available.</div>
              )}
            </div>
          </section>
        )}

        {/* Content Files Section */}
        {selectedSubject && (
          <section className="content-section">
            <div className="section-header">
              <h2>Academic Content for {selectedSubject.name}</h2>
            </div>
            <div className="content-list">
              {selectedSubject.content.map((file, index) => (
                <div key={index} className="content-file">
                  <span>📄 {file}</span>
                  <div className="file-actions">
                    {/* REMOVED: View button */}
                    <button 
                      onClick={() => handleDownloadFile(file)}
                      title="Download File"
                      className="download-btn"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
              {selectedSubject.content.length === 0 && (
                <div className="empty-content">No content available.</div>
              )}
            </div>
          </section>
        )}

        <Footer
          title="Academic Excellence"
          subtitle="Empowering education through comprehensive academic content"
          theme="dark"
          sidebarExpanded={isSidebarOpen}
        />
      </main>

      {/* Enhanced Professional Syllabus Modal - FIXED */}
      {showSyllabusModal && selectedSubject && (
        <div className="syllabus-modal-overlay" onClick={() => setShowSyllabusModal(false)}>
          <div className="syllabus-modal-content" onClick={e => e.stopPropagation()}>
            <div className="syllabus-modal-header">
              <h3>📋 Syllabus - {selectedSubject.name}</h3>
              <div className="subject-code">Course Code: {selectedSubject.code} | Credits: {selectedSubject.credits}</div>
              <button 
                className="syllabus-modal-close"
                onClick={() => setShowSyllabusModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="syllabus-modal-body">
              {/* Course Overview */}
              <div className="syllabus-section">
                <h4>📖 Course Overview</h4>
                <div className="syllabus-overview">
                  {selectedSubject.syllabus?.overview || selectedSubject.syllabus}
                </div>
              </div>

              {/* Learning Objectives */}
              {selectedSubject.syllabus?.objectives && (
                <div className="syllabus-section">
                  <h4>🎯 Learning Objectives</h4>
                  <ul className="objectives-list">
                    {selectedSubject.syllabus.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Topics - FIXED: Complete structure */}
              {selectedSubject.syllabus?.topics && (
                <div className="syllabus-section">
                  <h4>📚 Course Topics</h4>
                  <ol className="topics-list">
                    {selectedSubject.syllabus.topics.map((topic, index) => (
                      <li key={index} className="topic-item">
                        <div className="topic-header">
                          <h5 className="topic-title">{topic.title}</h5>
                        </div>
                        <ul className="subtopics-list">
                          {topic.subtopics.map((subtopic, subIndex) => (
                            <li key={subIndex}>{subtopic}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Assessment Methods */}
              {selectedSubject.syllabus?.assessment && (
                <div className="syllabus-section">
                  <h4>📊 Assessment Methods</h4>
                  <ul className="assessment-list">
                    {selectedSubject.syllabus.assessment.map((method, index) => (
                      <li key={index} className="assessment-item">{method}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* References */}
              {selectedSubject.syllabus?.references && (
                <div className="syllabus-section">
                  <h4>📚 Recommended References</h4>
                  <ul className="references-list">
                    {selectedSubject.syllabus.references.map((reference, index) => (
                      <li key={index}>{reference}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="syllabus-modal-actions">
              <button 
                className="syllabus-btn syllabus-btn-secondary"
                onClick={() => setShowSyllabusModal(false)}
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

export default Academiccontentuser;