import React, { useState } from 'react';
import UniversitySidebar from '../../components/Navigation/UniversitySidebar'; // CHANGED: Import UniversitySidebar
import UniversityNavbar from '../../components/Navigation/UniversityNavbar';
import Footer from '../../components/Footer';
import './AcademicContent.css';

// Dummy data for faculties, courses, subjects
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
              syllabus: 'Human body structure, organ systems, histology basics. This comprehensive course covers the fundamental structures of the human body including skeletal, muscular, cardiovascular, respiratory, nervous, and endocrine systems.',
              content: ['Anatomy Lecture Notes.pdf', 'Lab Manual.pdf', 'Practice Questions.pdf']
            },
            {
              id: 2,
              name: 'Physiology',
              code: 'MED102',
              credits: 4,
              syllabus: 'Body functions, homeostasis, cardiovascular system. Study of normal body functions and mechanisms that maintain life.',
              content: ['Physiology Textbook.pdf', 'Lab Experiments.zip']
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
              syllabus: 'Arrays, linked lists, stacks, queues, trees, graphs. Implementation and analysis of fundamental data structures.',
              content: ['DS Notes.pdf', 'Programming Examples.zip', 'Assignment Guidelines.pdf']
            }
          ]
        }
      ]
    }
  ]
};

const AcademicContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // CHANGED: Rename from isSidebarExpanded to isSidebarOpen
  const [data, setData] = useState(initialData);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingFile, setViewingFile] = useState('');
  
  // Form states
  const [courseForm, setCourseForm] = useState({ name: '', duration: '', intake: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', credits: '', syllabus: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [contentFile, setContentFile] = useState('');
  const [tempSyllabus, setTempSyllabus] = useState('');

  // Course handlers
  const handleAddCourse = () => {
    if (!courseForm.name.trim() || !courseForm.duration.trim() || !courseForm.intake.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    setData(prev => {
      const updatedFaculties = prev.faculties.map(faculty =>
        faculty.id === selectedFaculty.id
          ? {
              ...faculty,
              courses: [
                ...faculty.courses,
                {
                  id: Date.now(),
                  name: courseForm.name,
                  duration: courseForm.duration,
                  intake: courseForm.intake,
                  subjects: []
                }
              ]
            }
          : faculty
      );
      // Update selectedFaculty to the new faculty object
      const newFaculty = updatedFaculties.find(f => f.id === selectedFaculty.id);
      setSelectedFaculty(newFaculty);
      return { ...prev, faculties: updatedFaculties };
    });
    setShowCourseModal(false);
    setCourseForm({ name: '', duration: '', intake: '' });
    alert('Course added successfully!');
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({ 
      name: course.name, 
      duration: course.duration, 
      intake: course.intake 
    });
    setShowCourseModal(true);
  };

  const handleUpdateCourse = () => {
    if (!courseForm.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setData(prev => ({
      ...prev,
      faculties: prev.faculties.map(f =>
        f.id === selectedFaculty.id
          ? {
              ...f,
              courses: f.courses.map(c =>
                c.id === editingCourse.id ? { ...c, ...courseForm } : c
              )
            }
          : f
      )
    }));
    
    // Update selectedCourse if it's the one being edited
    if (selectedCourse && selectedCourse.id === editingCourse.id) {
      setSelectedCourse({ ...selectedCourse, ...courseForm });
    }
    
    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseForm({ name: '', duration: '', intake: '' });
    alert('Course updated successfully!');
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all subjects in this course.')) {
      setData(prev => ({
        ...prev,
        faculties: prev.faculties.map(f =>
          f.id === selectedFaculty.id
            ? { ...f, courses: f.courses.filter(c => c.id !== courseId) }
            : f
        )
      }));
      
      // Clear selected course if it's the one being deleted
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null);
        setSelectedSubject(null);
      }
      
      alert('Course deleted successfully!');
    }
  };

  // Subject handlers
  const handleAddSubject = () => {
    if (!selectedCourse || !subjectForm.name.trim() || !subjectForm.code.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newSubject = {
      id: Date.now(),
      ...subjectForm,
      credits: parseInt(subjectForm.credits) || 0,
      content: []
    };
    
    setData(prev => ({
      ...prev,
      faculties: prev.faculties.map(f =>
        f.id === selectedFaculty.id
          ? {
              ...f,
              courses: f.courses.map(c =>
                c.id === selectedCourse.id
                  ? { ...c, subjects: [...c.subjects, newSubject] }
                  : c
              )
            }
          : f
      )
    }));
    
    // Update selectedCourse to reflect the new subject
    setSelectedCourse(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
    
    setShowSubjectModal(false);
    setSubjectForm({ name: '', code: '', credits: '', syllabus: '' });
    alert('Subject added successfully!');
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      credits: subject.credits.toString(),
      syllabus: subject.syllabus
    });
    setShowSubjectModal(true);
  };

  const handleUpdateSubject = () => {
    if (!subjectForm.name.trim() || !subjectForm.code.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedSubject = {
      ...editingSubject,
      ...subjectForm,
      credits: parseInt(subjectForm.credits) || 0
    };

    setData(prev => ({
      ...prev,
      faculties: prev.faculties.map(f =>
        f.id === selectedFaculty.id
          ? {
              ...f,
              courses: f.courses.map(c =>
                c.id === selectedCourse.id
                  ? {
                      ...c,
                      subjects: c.subjects.map(s =>
                        s.id === editingSubject.id ? updatedSubject : s
                      )
                    }
                  : c
              )
            }
          : f
      )
    }));
    
    // Update selectedCourse and selectedSubject
    setSelectedCourse(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === editingSubject.id ? updatedSubject : s
      )
    }));
    
    if (selectedSubject && selectedSubject.id === editingSubject.id) {
      setSelectedSubject(updatedSubject);
    }
    
    setShowSubjectModal(false);
    setEditingSubject(null);
    setSubjectForm({ name: '', code: '', credits: '', syllabus: '' });
    alert('Subject updated successfully!');
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setData(prev => ({
        ...prev,
        faculties: prev.faculties.map(f =>
          f.id === selectedFaculty.id
            ? {
                ...f,
                courses: f.courses.map(c =>
                  c.id === selectedCourse.id
                    ? { ...c, subjects: c.subjects.filter(s => s.id !== subjectId) }
                    : c
                )
              }
            : f
        )
      }));
      
      // Update selectedCourse
      setSelectedCourse(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s.id !== subjectId)
      }));
      
      // Clear selectedSubject if it's the one being deleted
      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject(null);
      }
      
      alert('Subject deleted successfully!');
    }
  };

  // Content handlers
  const handleUploadContent = () => {
    if (!contentFile.trim() || !selectedSubject) {
      alert('Please enter a file name');
      return;
    }
    
    setData(prev => ({
      ...prev,
      faculties: prev.faculties.map(f =>
        f.id === selectedFaculty.id
          ? {
              ...f,
              courses: f.courses.map(c =>
                c.id === selectedCourse.id
                  ? {
                      ...c,
                      subjects: c.subjects.map(s =>
                        s.id === selectedSubject.id
                          ? { ...s, content: [...s.content, contentFile] }
                          : s
                      )
                    }
                  : c
              )
            }
          : f
      )
    }));
    
    // Update selectedSubject
    setSelectedSubject(prev => ({
      ...prev,
      content: [...prev.content, contentFile]
    }));
    
    // Update selectedCourse
    setSelectedCourse(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === selectedSubject.id
          ? { ...s, content: [...s.content, contentFile] }
          : s
      )
    }));
    
    setShowContentModal(false);
    setContentFile('');
    alert('Content uploaded successfully!');
  };

  // File action handlers
  const handleViewFile = (filename) => {
    setViewingFile(filename);
    setShowViewModal(true);
  };

  const handleDownloadFile = (filename) => {
    alert(`Downloading: ${filename}\n\nIn a real application, this would trigger a file download.`);
  };

  const handleDeleteFile = (filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      setData(prev => ({
        ...prev,
        faculties: prev.faculties.map(f =>
          f.id === selectedFaculty.id
            ? {
                ...f,
                courses: f.courses.map(c =>
                  c.id === selectedCourse.id
                    ? {
                        ...c,
                        subjects: c.subjects.map(s =>
                          s.id === selectedSubject.id
                            ? { ...s, content: s.content.filter(file => file !== filename) }
                            : s
                        )
                      }
                    : c
                )
              }
            : f
        )
      }));
      
      // Update selectedSubject
      setSelectedSubject(prev => ({
        ...prev,
        content: prev.content.filter(file => file !== filename)
      }));
      
      // Update selectedCourse
      setSelectedCourse(prev => ({
        ...prev,
        subjects: prev.subjects.map(s =>
          s.id === selectedSubject.id
            ? { ...s, content: s.content.filter(file => file !== filename) }
            : s
        )
      }));
      
      alert('File deleted successfully!');
    }
  };

  // Syllabus handlers
  const handleOpenSyllabus = (subject) => {
    // Parse syllabus string into overview and topics/subtopics if possible
    const syllabus = subject.syllabus || '';
    let overview = syllabus;
    let topics = [];
    // If the syllabus contains numbered topics, split them
    const topicMatches = syllabus.match(/(\d+\.\s.*?)(?=\d+\.|$)/gs);
    if (topicMatches && topicMatches.length > 0) {
      overview = syllabus.split(topicMatches[0])[0].trim();
      topics = topicMatches.map(t => {
        const [title, ...subs] = t.split('\n').map(line => line.trim()).filter(Boolean);
        return {
          title: title.replace(/^\d+\.\s*/, ''),
          subtopics: subs.map(s => s.replace(/^[-•]\s*/, ''))
        };
      });
    }
    setTempSyllabus({ overview, topics });
    setSelectedSubject(subject); // Ensure the correct subject is set
    setShowSyllabusModal(true);
  };

  const handleSaveSyllabus = () => {
    if (!tempSyllabus.trim()) {
      alert('Please enter syllabus content');
      return;
    }

    setData(prev => ({
      ...prev,
      faculties: prev.faculties.map(f =>
        f.id === selectedFaculty.id
          ? {
              ...f,
              courses: f.courses.map(c =>
                c.id === selectedCourse.id
                  ? {
                      ...c,
                      subjects: c.subjects.map(s =>
                        s.id === selectedSubject.id
                          ? { ...s, syllabus: tempSyllabus }
                          : s
                      )
                    }
                  : c
              )
            }
          : f
      )
    }));
    
    // Update selectedSubject
    setSelectedSubject(prev => ({
      ...prev,
      syllabus: tempSyllabus
    }));
    
    // Update selectedCourse
    setSelectedCourse(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === selectedSubject.id
          ? { ...s, syllabus: tempSyllabus }
          : s
      )
    }));
    
    setShowSyllabusModal(false);
    alert('Syllabus updated successfully!');
  };

  // Course handlers - ADD this missing function
  const handleCourseSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      handleUpdateCourse();
    } else {
      handleAddCourse();
    }
  };

  // Add these states at the top inside AcademicContent component
  const [showCourseEditModal, setShowCourseEditModal] = useState(false);
  const [courseEditForm, setCourseEditForm] = useState({ name: '', duration: '', intake: '' });
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Handler for opening the edit modal
  const handleOpenCourseEditModal = (course) => {
    setEditingCourseId(course.id);
    setCourseEditForm({
      name: course.name,
      duration: course.duration,
      intake: course.intake
    });
    setShowCourseEditModal(true);
  };

  // Handler for saving the edited course
  const handleSaveCourseEdit = (e) => {
    e.preventDefault();
    if (!courseEditForm.name.trim() || !courseEditForm.duration.trim() || !courseEditForm.intake.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    setData(prev => ({
      ...prev,
      faculties: prev.faculties.map(f =>
        f.id === selectedFaculty.id
          ? {
              ...f,
              courses: f.courses.map(c =>
                c.id === editingCourseId
                  ? { ...c, ...courseEditForm }
                  : c
              )
            }
          : f
      )
    }));
    // Update selectedCourse if it's the one being edited
    if (selectedCourse && selectedCourse.id === editingCourseId) {
      setSelectedCourse({ ...selectedCourse, ...courseEditForm });
    }
    setShowCourseEditModal(false);
    setEditingCourseId(null);
    setCourseEditForm({ name: '', duration: '', intake: '' });
    alert('Course updated successfully!');
  };

  return (
    <div className="academic-content-page">
      {/* SIDEBAR AT THE VERY TOP - OUTSIDE CONTAINER */}
      <UniversitySidebar 
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
            <h1>Academic Content Management</h1>
            <p>Manage faculties, courses, subjects, and academic content across the university</p>
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
              <button 
                className="btn btn-primary"
                onClick={() => { 
                  setShowCourseModal(true); 
                  setEditingCourse(null); 
                  setCourseForm({ name: '', duration: '', intake: '' }); 
                }}
              >
                + Add Course
              </button>
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
                  <div className="course-actions">
                    <button 
                      className="university-academiccontent-admin-current-edit-btn"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenCourseEditModal(course); 
                      }}
                      title="Edit Course"
                    >
                      ✏️
                    </button>
                    <button 
                      className="university-academiccontent-admin-current-delete-btn"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteCourse(course.id); 
                      }}
                      title="Delete Course"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {selectedFaculty.courses.length === 0 && (
                <div className="empty-content">No courses available. Add a course to get started.</div>
              )}
            </div>
          </section>
        )}

        {/* Subjects Section - UPDATED: Remove Content button */}
        {selectedCourse && (
          <section className="subjects-section">
            <div className="section-header">
              <h2>Subjects in {selectedCourse.name}</h2>
              <button 
                className="btn btn-primary"
                onClick={() => { 
                  setShowSubjectModal(true); 
                  setEditingSubject(null); 
                  setSubjectForm({ name: '', code: '', credits: '', syllabus: '' }); 
                }}
              >
                + Add Subject
              </button>
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
                    <p className="syllabus-preview">{subject.syllabus}</p>
                    <div className="subject-meta">
                      <span>Credits: {subject.credits}</span>
                      <span>{subject.content.length} Content Files</span>
                    </div>
                  </div>
                  <div className="subject-actions">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenSyllabus(subject); 
                      }}
                      title="Edit Syllabus"
                    >
                      📝 Syllabus
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleEditSubject(subject); 
                      }}
                      title="Edit Subject"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteSubject(subject.id); 
                      }}
                      title="Delete Subject"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {selectedCourse.subjects.length === 0 && (
                <div className="empty-content">No subjects available. Add a subject to get started.</div>
              )}
            </div>
          </section>
        )}

        {/* Content Files Section - UPDATED: Remove View button */}
        {selectedSubject && (
          <section className="content-section">
            <div className="section-header">
              <h2>Academic Content for {selectedSubject.name}</h2>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowContentModal(true)}
              >
                + Upload Content
              </button>
            </div>
            <div className="content-list">
              {selectedSubject.content.map((file, index) => (
                <div key={index} className="content-file">
                  <span>📄 {file}</span>
                  <div className="file-actions">
                    <button 
                      onClick={() => handleDownloadFile(file)}
                      title="Download File"
                    >
                      ⬇️ Download
                    </button>
                    <button 
                      onClick={() => handleDeleteFile(file)}
                      title="Delete File"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {selectedSubject.content.length === 0 && (
                <div className="empty-content">No content uploaded yet. Upload files to share with students.</div>
              )}
            </div>
          </section>
        )}

        <Footer
          title="Academic Excellence"
          subtitle="Empowering education through comprehensive academic content management"
          theme="dark"
          sidebarExpanded={isSidebarOpen}
        />
      </main>

      {/* Course Modal - Use unique classes */}
      {showCourseModal && (
        <div className="university-academiccontent-admin-simple-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="university-academiccontent-admin-simple-content" onClick={e => e.stopPropagation()}>
            <div className="university-academiccontent-admin-simple-header">
              <h3>{editingCourse ? '✏️ Edit Course' : '➕ Add New Course'}</h3>
              <button 
                className="university-academiccontent-admin-simple-close"
                onClick={() => setShowCourseModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form className="university-academiccontent-admin-simple-form" onSubmit={handleCourseSubmit}>
              <input 
                className="university-academiccontent-admin-simple-input"
                type="text" 
                placeholder="Course Name *" 
                value={courseForm.name}
                onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                required 
              />
              <input 
                className="university-academiccontent-admin-simple-input"
                type="text" 
                placeholder="Duration (e.g., 4 Years) *" 
                value={courseForm.duration}
                onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                required 
              />
              <input 
                className="university-academiccontent-admin-simple-input"
                type="text" 
                placeholder="Intake (e.g., February, September) *" 
                value={courseForm.intake}
                onChange={(e) => setCourseForm({...courseForm, intake: e.target.value})}
                required 
              />
              
              <div className="university-academiccontent-admin-simple-actions">
                <button 
                  className="university-academiccontent-admin-simple-btn"
                  type="button" 
                  onClick={() => setShowCourseModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="university-academiccontent-admin-simple-btn university-academiccontent-admin-simple_primary"
                  type="submit"
                >
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="admin-modal-overlay" onClick={() => setShowSubjectModal(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingSubject ? '✏️ Edit Subject' : '➕ Add New Subject'}</h3>
              <button 
                className="admin-modal-close"
                onClick={() => setShowSubjectModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form className="admin-modal-form" onSubmit={e => { 
              e.preventDefault(); 
              editingSubject ? handleUpdateSubject() : handleAddSubject(); 
            }}>
              <input
                className="admin-modal-input"
                type="text"
                placeholder="Subject Name *"
                value={subjectForm.name}
                onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                required
              />
              <input
                className="admin-modal-input"
                type="text"
                placeholder="Subject Code (e.g., CS101) *"
                value={subjectForm.code}
                onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                required
              />
              <input
                className="admin-modal-input"
                type="number"
                placeholder="Credits *"
                value={subjectForm.credits}
                onChange={e => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                required
                min="1"
                max="10"
              />
              <textarea
                className="admin-modal-textarea"
                placeholder="Syllabus Overview *"
                value={subjectForm.syllabus}
                onChange={e => setSubjectForm({ ...subjectForm, syllabus: e.target.value })}
                required
                rows="4"
              />
              <div className="admin-modal-actions">
                <button 
                  className="admin-modal-btn"
                  type="button" 
                  onClick={() => setShowSubjectModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="admin-modal-btn admin-btn-primary"
                  type="submit"
                >
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Professional Syllabus Modal - EXACTLY LIKE USER PAGE */}
      {showSyllabusModal && selectedSubject && (
        <div className="university-academiccontent-admin-modal-overlay" onClick={() => setShowSyllabusModal(false)}>
          <div className="university-academiccontent-admin-modal-content university-academiccontent-admin-modal-large" onClick={e => e.stopPropagation()}>
            <div className="university-academiccontent-admin-modal-header">
              <h3>📋 Syllabus - {selectedSubject.name}</h3>
              <div className="university-academiccontent-admin-subject-code">Course Code: {selectedSubject.code} | Credits: {selectedSubject.credits}</div>
              <button 
                className="university-academiccontent-admin-modal-close"
                onClick={() => setShowSyllabusModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="university-academiccontent-admin-modal-body">
              {/* Course Overview Section */}
              <div className="university-academiccontent-admin-section">
                <h4>📖 Course Overview</h4>
                <div className="university-academiccontent-admin-overview" style={{whiteSpace: 'pre-line'}}>
                  {tempSyllabus && tempSyllabus.overview
                    ? tempSyllabus.overview
                    : selectedSubject.syllabus}
                </div>
              </div>

              {/* Topics Section */}
              {tempSyllabus && tempSyllabus.topics && tempSyllabus.topics.length > 0 && (
                <div className="university-academiccontent-admin-section">
                  <h4>📚 Course Topics</h4>
                  <ol style={{paddingLeft: '1.2em'}}>
                    {tempSyllabus.topics.map((topic, idx) => (
                      <li key={idx} style={{marginBottom: '0.7em'}}>
                        <strong>{topic.title}</strong>
                        {topic.subtopics && topic.subtopics.length > 0 && (
                          <ul style={{marginTop: '0.3em', paddingLeft: '1.2em'}}>
                            {topic.subtopics.map((sub, i) => (
                              <li key={i} style={{color: '#475569'}}>{sub}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            <div className="university-academiccontent-admin-modal-actions">
              <button 
                className="university-academiccontent-admin-btn university-academiccontent-admin-btn-secondary"
                onClick={() => setShowSyllabusModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Upload Modal */}
      {showContentModal && (
        <div className="admin-modal-overlay" onClick={() => setShowContentModal(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>📁 Upload Academic Content</h3>
              <button 
                className="admin-modal-close"
                onClick={() => setShowContentModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form className="admin-modal-form" onSubmit={e => { e.preventDefault(); handleUploadContent(); }}>
              <input
                className="admin-modal-input"
                type="text"
                placeholder="File name (e.g., Lecture Notes Chapter 1.pdf) *"
                value={contentFile}
                onChange={e => setContentFile(e.target.value)}
                required
              />
              <div className="admin-upload-area">
                <p>📁 Drag and drop files here or click to browse</p>
                <p className="admin-upload-note">Supported formats: PDF, DOC, PPT, ZIP, Video files</p>
                <input type="file" style={{ display: 'none' }} />
              </div>
              <div className="admin-modal-actions">
                <button 
                  className="admin-modal-btn"
                  type="button" 
                  onClick={() => setShowContentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="admin-modal-btn admin-btn-primary"
                  type="submit"
                >
                  Upload Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add the new professional edit modal for course */}
      {showCourseEditModal && (
        <div className="university-academiccontent-admin-current-modal-overlay" onClick={() => setShowCourseEditModal(false)}>
          <div className="university-academiccontent-admin-current-modal-content" onClick={e => e.stopPropagation()}>
            <div className="university-academiccontent-admin-current-modal-header">
              <h3>✏️ Edit Course</h3>
              <button 
                className="university-academiccontent-admin-current-modal-close"
                onClick={() => setShowCourseEditModal(false)}
              >
                ✕
              </button>
            </div>
            <form className="university-academiccontent-admin-current-modal-form" onSubmit={handleSaveCourseEdit}>
              <label>Course Name</label>
              <input 
                className="university-academiccontent-admin-current-modal-input"
                type="text"
                value={courseEditForm.name}
                onChange={e => setCourseEditForm({ ...courseEditForm, name: e.target.value })}
                required
              />
              <label>Duration</label>
              <input 
                className="university-academiccontent-admin-current-modal-input"
                type="text"
                value={courseEditForm.duration}
                onChange={e => setCourseEditForm({ ...courseEditForm, duration: e.target.value })}
                required
              />
              <label>Intake</label>
              <input 
                className="university-academiccontent-admin-current-modal-input"
                type="text"
                value={courseEditForm.intake}
                onChange={e => setCourseEditForm({ ...courseEditForm, intake: e.target.value })}
                required
              />
              <div className="university-academiccontent-admin-current-modal-actions">
                <button
                  type="button"
                  className="university-academiccontent-admin-current-modal-btn"
                  onClick={() => setShowCourseEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="university-academiccontent-admin-current-modal-btn university-academiccontent-admin-current-modal-btn_primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicContent;