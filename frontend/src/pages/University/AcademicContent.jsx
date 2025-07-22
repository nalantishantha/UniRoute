import React, { useState } from 'react';
import UniversitySidebar from '../../components/Navigation/UniversitySidebar';
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';

// Initial data for faculties, courses, subjects
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
                overview: 'Fundamental data structures and their applications in computer science.',
                objectives: [
                  'Understand the core concepts of data structures',
                  'Implement and use various data structures in programming'
                ],
                topics: [
                  {
                    title: 'Introduction to Data Structures',
                    subtopics: [
                      'Definition and classification',
                      'Abstract Data Types (ADT)'
                    ]
                  }
                ],
                assessment: [
                  'Assignments and Programming Labs (30%)',
                  'Final Examination (35%)'
                ],
                references: [
                  'Data Structures and Algorithms in Java – Goodrich'
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

const fileDisplayNames = {
  "Course Details.pdf": "Syllabus PDF",
  // Add more mappings as needed
};

const AcademicContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState(initialData);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  // Modal states
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  
  // Form states
  const [editingSyllabus, setEditingSyllabus] = useState({});
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newCourse, setNewCourse] = useState({ name: '', duration: '', intake: '' });
  const [newSubject, setNewSubject] = useState({ name: '', code: '', credits: '' });
  const [newFileName, setNewFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handler functions
  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updatedData = { ...data };
      const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
      faculty.courses = faculty.courses.filter(c => c.id !== courseId);
      
      setData(updatedData);
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
        setSelectedSubject(null);
      }
    }
  };

  const handleEditCourse = () => {
    if (!editingCourse || !newCourse.name) return;
    
    const updatedData = { ...data };
    const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
    const course = faculty.courses.find(c => c.id === editingCourse.id);
    
    course.name = newCourse.name;
    course.duration = newCourse.duration;
    course.intake = newCourse.intake;
    
    setData(updatedData);
    if (selectedCourse?.id === editingCourse.id) {
      setSelectedCourse(course);
    }
    setNewCourse({ name: '', duration: '', intake: '' });
    setEditingCourse(null);
    setShowEditCourseModal(false);
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const updatedData = { ...data };
      const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
      const course = faculty.courses.find(c => c.id === selectedCourse.id);
      course.subjects = course.subjects.filter(s => s.id !== subjectId);
      
      setData(updatedData);
      if (selectedSubject?.id === subjectId) {
        setSelectedSubject(null);
      }
    }
  };

  const handleEditSubject = () => {
    if (!editingSubject || !newSubject.name) return;
    
    const updatedData = { ...data };
    const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
    const course = faculty.courses.find(c => c.id === selectedCourse.id);
    const subject = course.subjects.find(s => s.id === editingSubject.id);
    
    subject.name = newSubject.name;
    subject.code = newSubject.code;
    subject.credits = parseInt(newSubject.credits);
    
    setData(updatedData);
    if (selectedSubject?.id === editingSubject.id) {
      setSelectedSubject(subject);
    }
    setNewSubject({ name: '', code: '', credits: '' });
    setEditingSubject(null);
    setShowEditSubjectModal(false);
  };

  const handleEditSyllabus = () => {
    setEditingSyllabus({ ...selectedSubject.syllabus });
    setShowSyllabusModal(true);
  };

  const handleSaveSyllabus = () => {
    const updatedData = { ...data };
    const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
    const course = faculty.courses.find(c => c.id === selectedCourse.id);
    const subject = course.subjects.find(s => s.id === selectedSubject.id);
    subject.syllabus = { ...editingSyllabus };
    
    setData(updatedData);
    setSelectedSubject(subject);
    setShowSyllabusModal(false);
  };

  const handleAddCourse = () => {
    if (!selectedFaculty || !newCourse.name) return;
    
    const updatedData = { ...data };
    const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
    const newId = Math.max(...faculty.courses.map(c => c.id)) + 1;
    
    faculty.courses.push({
      id: newId,
      name: newCourse.name,
      duration: newCourse.duration,
      intake: newCourse.intake,
      subjects: []
    });
    
    setData(updatedData);
    setNewCourse({ name: '', duration: '', intake: '' });
    setShowAddCourseModal(false);
  };

  const handleAddSubject = () => {
    if (!selectedCourse || !newSubject.name) return;
    
    const updatedData = { ...data };
    const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
    const course = faculty.courses.find(c => c.id === selectedCourse.id);
    const newId = Math.max(...course.subjects.map(s => s.id), 0) + 1;
    
    course.subjects.push({
      id: newId,
      name: newSubject.name,
      code: newSubject.code,
      credits: parseInt(newSubject.credits),
      syllabus: {
        overview: '',
        objectives: [],
        topics: [],
        assessment: [],
        references: []
      },
      content: []
    });
    
    setData(updatedData);
    setNewSubject({ name: '', code: '', credits: '' });
    setShowAddSubjectModal(false);
  };

  const handleAddFile = () => {
    if (!selectedSubject || (!selectedFile && !newFileName)) return;
    
    const fileName = selectedFile ? selectedFile.name : newFileName;
    
    const updatedData = { ...data };
    const faculty = updatedData.faculties.find(f => f.id === selectedFaculty.id);
    const course = faculty.courses.find(c => c.id === selectedCourse.id);
    const subject = course.subjects.find(s => s.id === selectedSubject.id);
    
    if (!subject.content.includes(fileName)) {
      subject.content.push(fileName);
    }
    
    // If it's a real file, you could upload it to a server here
    if (selectedFile) {
      // For now, we'll just add the filename to the list
      // In a real application, you would upload the file to your server
      console.log('File to upload:', selectedFile);
    }
    
    setData(updatedData);
    setSelectedSubject(subject);
    setNewFileName('');
    setSelectedFile(null);
    setShowAddFileModal(false);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setNewFileName(file.name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDownloadFile = (filename) => {
    const fileUrl = `/files/${filename}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        
        {/* Overview Section */}
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
            }}>Academic Content Management</h1>
            <p style={{
              color: '#64748b',
              fontSize: '1.1rem',
              marginBottom: '0'
            }}>Manage faculties, courses, subjects, and academic content across the university</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#6366f1',
                marginBottom: '0.5rem'
              }}>{data.faculties.length}</h3>
              <p style={{
                color: '#64748b',
                fontWeight: '500',
                margin: '0'
              }}>Faculties</p>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#6366f1',
                marginBottom: '0.5rem'
              }}>{data.faculties.reduce((total, f) => total + f.courses.length, 0)}</h3>
              <p style={{
                color: '#64748b',
                fontWeight: '500',
                margin: '0'
              }}>Total Courses</p>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#6366f1',
                marginBottom: '0.5rem'
              }}>{data.faculties.reduce((total, f) => total + f.courses.reduce((ct, c) => ct + c.subjects.length, 0), 0)}</h3>
              <p style={{
                color: '#64748b',
                fontWeight: '500',
                margin: '0'
              }}>Total Subjects</p>
            </div>
          </div>
        </section>

        {/* Faculties Section */}
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
          }}>University Faculties</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {data.faculties.map(faculty => (
              <div 
                key={faculty.id}
                style={{
                  background: selectedFaculty?.id === faculty.id ? '#eef2ff' : '#f9fafb',
                  border: `2px solid ${selectedFaculty?.id === faculty.id ? '#6366f1' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => {
                  setSelectedFaculty(faculty);
                  setSelectedCourse(null);
                  setSelectedSubject(null);
                }}
              >
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.5rem'
                }}>{faculty.name}</h3>
                <p style={{
                  color: '#64748b',
                  marginBottom: '1rem',
                  lineHeight: '1.6'
                }}>{faculty.description}</p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
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
          <section style={{
            background: 'white',
            margin: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>Courses in {selectedFaculty.name}</h2>
              <button
                onClick={() => setShowAddCourseModal(true)}
                style={{
                  background: 'white',
                  border: '2px solid #2563eb',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  color: '#2563eb',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  minWidth: '140px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                }}
              >
                ➕ Add Course
              </button>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {selectedFaculty.courses.map(course => (
                <div 
                  key={course.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: selectedCourse?.id === course.id ? '#eef2ff' : '#f9fafb',
                    border: `2px solid ${selectedCourse?.id === course.id ? '#6366f1' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedSubject(null);
                  }}
                >
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '0.5rem'
                    }}>{course.name}</h4>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span>Duration: {course.duration}</span>
                      <span>Intake: {course.intake}</span>
                      <span>{course.subjects.length} Subjects</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewCourse({
                          name: course.name,
                          duration: course.duration,
                          intake: course.intake
                        });
                        setEditingCourse(course);
                        setShowEditCourseModal(true);
                      }}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        color: '#374151',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fef2f2';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {selectedFaculty.courses.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '3rem 2rem',
                  fontStyle: 'italic',
                  background: '#f9fafb',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px'
                }}>No courses available.</div>
              )}
            </div>
          </section>
        )}

        {/* Subjects Section */}
        {selectedCourse && (
          <section style={{
            background: 'white',
            margin: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>Subjects in {selectedCourse.name}</h2>
              <button
                onClick={() => setShowAddSubjectModal(true)}
                style={{
                  background: 'white',
                  border: '2px solid #2563eb',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  color: '#2563eb',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  minWidth: '140px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                }}
              >
                ➕ Add Subject
              </button>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {selectedCourse.subjects.map(subject => (
                <div 
                  key={subject.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: selectedSubject?.id === subject.id ? '#eef2ff' : '#f9fafb',
                    border: `2px solid ${selectedSubject?.id === subject.id ? '#6366f1' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '0.5rem'
                    }}>{subject.name} ({subject.code})</h4>
                    <p style={{
                      color: '#64748b',
                      margin: '0.5rem 0',
                      fontSize: '0.9rem'
                    }}>{subject.syllabus.overview}</p>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span>Credits: {subject.credits}</span>
                      <span>{subject.content.length} Content Files</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleEditSyllabus(); 
                      }}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        color: '#374151',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        minWidth: '140px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      📝 Course Overview
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewSubject({
                          name: subject.name,
                          code: subject.code,
                          credits: subject.credits.toString()
                        });
                        setEditingSubject(subject);
                        setShowEditSubjectModal(true);
                      }}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        color: '#374151',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubject(subject.id);
                      }}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fef2f2';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {selectedCourse.subjects.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '3rem 2rem',
                  fontStyle: 'italic',
                  background: '#f9fafb',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px'
                }}>No subjects available.</div>
              )}
            </div>
          </section>
        )}

        {/* Content Files Section */}
        {selectedSubject && (
          <section style={{
            background: 'white',
            margin: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>Academic Content for {selectedSubject.name}</h2>
              <button
                onClick={() => setShowAddFileModal(true)}
                style={{
                  background: 'white',
                  border: '2px solid #2563eb',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  color: '#2563eb',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  minWidth: '140px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                }}
              >
                ➕ Add File
              </button>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {selectedSubject.content.map((file, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <span>📄 {fileDisplayNames[file] || file}</span>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button 
                      onClick={() => handleDownloadFile(file)}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        color: '#374151',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s',
                        minWidth: '100px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
              {selectedSubject.content.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '3rem 2rem',
                  fontStyle: 'italic',
                  background: '#f9fafb',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px'
                }}>No content available.</div>
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

      {/* Add Course Modal */}
      {showAddCourseModal && (
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
        }} onClick={() => setShowAddCourseModal(false)}>
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
              }}>➕ Add New Course</h3>
              <button 
                onClick={() => setShowAddCourseModal(false)}
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Course Name</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter course name"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Duration</label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 4 years"
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Intake</label>
                <input
                  type="text"
                  value={newCourse.intake}
                  onChange={(e) => setNewCourse({...newCourse, intake: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 150 students/year"
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
                onClick={() => setShowAddCourseModal(false)}
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
                onClick={handleAddCourse}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >Add Course</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourseModal && (
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
              }}>✏️ Edit Course</h3>
              <button 
                onClick={() => setShowEditCourseModal(false)}
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Course Name</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter course name"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Duration</label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 4 years"
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Intake</label>
                <input
                  type="text"
                  value={newCourse.intake}
                  onChange={(e) => setNewCourse({...newCourse, intake: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 150 students/year"
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
                onClick={() => setShowEditCourseModal(false)}
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
                onClick={handleEditCourse}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >Update Course</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
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
        }} onClick={() => setShowAddSubjectModal(false)}>
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
              }}>➕ Add New Subject</h3>
              <button 
                onClick={() => setShowAddSubjectModal(false)}
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Subject Name</label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter subject name"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Subject Code</label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., CS201"
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Credits</label>
                <input
                  type="number"
                  value={newSubject.credits}
                  onChange={(e) => setNewSubject({...newSubject, credits: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 3"
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
                onClick={() => setShowAddSubjectModal(false)}
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
                onClick={handleAddSubject}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >Add Subject</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditSubjectModal && (
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
        }} onClick={() => setShowEditSubjectModal(false)}>
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
              }}>✏️ Edit Subject</h3>
              <button 
                onClick={() => setShowEditSubjectModal(false)}
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Subject Name</label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter subject name"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Subject Code</label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., CS201"
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Credits</label>
                <input
                  type="number"
                  value={newSubject.credits}
                  onChange={(e) => setNewSubject({...newSubject, credits: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 3"
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
                onClick={() => setShowEditSubjectModal(false)}
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
                onClick={handleEditSubject}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >Update Subject</button>
            </div>
          </div>
        </div>
      )}

      {/* Add File Modal */}
      {showAddFileModal && (
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
        }} onClick={() => setShowAddFileModal(false)}>
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
              }}>➕ Add Content File</h3>
              <button 
                onClick={() => setShowAddFileModal(false)}
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Upload File</label>
                
                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${isDragOver ? '#2563eb' : '#d1d5db'}`,
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    background: isDragOver ? '#eff6ff' : '#f9fafb',
                    transition: 'all 0.2s',
                    marginBottom: '1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      color: '#6b7280'
                    }}>📁</div>
                    <div style={{
                      color: '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem'
                    }}>
                      {selectedFile ? selectedFile.name : 'Drop files here or click to browse'}
                    </div>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '0.75rem'
                    }}>
                      Supports PDF, DOC, DOCX, PPT, PPTX files
                    </div>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  style={{ display: 'none' }}
                />

                {/* Manual File Name Input (Alternative) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: '#e5e7eb'
                  }}></div>
                  <span style={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>OR</span>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: '#e5e7eb'
                  }}></div>
                </div>

                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>Enter File Name Manually</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => {
                    setNewFileName(e.target.value);
                    setSelectedFile(null); // Clear selected file if typing manually
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., Lecture Notes.pdf"
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
                onClick={() => setShowAddFileModal(false)}
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
                onClick={handleAddFile}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >Add File</button>
            </div>
          </div>
        </div>
      )}

      {/* Editable Syllabus Modal */}
      {showSyllabusModal && selectedSubject && (
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
        }} onClick={() => setShowSyllabusModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '800px',
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
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0,
                  color: '#1e293b'
                }}>📝 Edit Syllabus - {selectedSubject.name}</h3>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginTop: '0.25rem'
                }}>Course Code: {selectedSubject.code} | Credits: {selectedSubject.credits}</div>
              </div>
              <button 
                onClick={() => setShowSyllabusModal(false)}
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

            <div style={{
              padding: '1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.75rem'
                }}>🎯 Learning Objectives</h4>
                <textarea
                  value={editingSyllabus.objectives?.join('\n') || ''}
                  onChange={(e) => setEditingSyllabus({
                    ...editingSyllabus, 
                    objectives: e.target.value.split('\n').filter(obj => obj.trim() !== '')
                  })}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                  placeholder="Enter learning objectives (one per line)..."
                />
              </div>

              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.75rem'
                }}>📊 Assessment Methods</h4>
                <textarea
                  value={editingSyllabus.assessment?.join('\n') || ''}
                  onChange={(e) => setEditingSyllabus({
                    ...editingSyllabus, 
                    assessment: e.target.value.split('\n').filter(method => method.trim() !== '')
                  })}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                  placeholder="Enter assessment methods (one per line)..."
                />
              </div>

              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.75rem'
                }}>📚 Recommended References</h4>
                <textarea
                  value={editingSyllabus.references?.join('\n') || ''}
                  onChange={(e) => setEditingSyllabus({
                    ...editingSyllabus, 
                    references: e.target.value.split('\n').filter(ref => ref.trim() !== '')
                  })}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                  placeholder="Enter references (one per line)..."
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
                onClick={() => setShowSyllabusModal(false)}
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
                onClick={handleSaveSyllabus}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicContent;