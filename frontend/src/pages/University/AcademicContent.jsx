import React, { useState } from 'react';
import UniSidebar from '../../components/UniSidebar';
import UniHeader from '../../components/UniHeader';
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
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
    if (!selectedFaculty || !courseForm.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newCourse = {
      id: Date.now(),
      ...courseForm,
      subjects: []
    };
    
    setData(prev => ({
      ...prev,
      faculties: prev.faculties.map(f =>
        f.id === selectedFaculty.id
          ? { ...f, courses: [...f.courses, newCourse] }
          : f
      )
    }));
    
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
    // Simulate file download
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
  const handleOpenSyllabus = () => {
    setTempSyllabus(selectedSubject.syllabus);
    setShowSyllabusModal(true);
  };

  const handleSaveSyllabus = () => {
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

  return (
    <div className="academic-content-page">
      <div className="academic-dashboard-container">
        <UniSidebar activePage="academic-content" onExpandChange={setIsSidebarExpanded} />
        <UniHeader sidebarExpanded={isSidebarExpanded} />

        <main className={`academic-main-content ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          
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
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditCourse(course); 
                        }}
                        title="Edit Course"
                      >
                        ✏️
                      </button>
                      <button 
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

          {/* Subjects Section */}
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
                          handleOpenSyllabus(); 
                        }}
                        title="Edit Syllabus"
                      >
                        📝 Syllabus
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setShowContentModal(true); 
                        }}
                        title="Upload Content"
                      >
                        📁 Content
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

          {/* Content Files Section */}
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
                        onClick={() => handleViewFile(file)}
                        title="View File"
                      >
                        👁️ View
                      </button>
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
            sidebarExpanded={isSidebarExpanded}
          />
        </main>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
            <form onSubmit={e => { 
              e.preventDefault(); 
              editingCourse ? handleUpdateCourse() : handleAddCourse(); 
            }}>
              <input
                type="text"
                placeholder="Course Name *"
                value={courseForm.name}
                onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Duration (e.g., 4 years) *"
                value={courseForm.duration}
                onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Annual Intake (e.g., 100 students/year) *"
                value={courseForm.intake}
                onChange={e => setCourseForm({ ...courseForm, intake: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCourseModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="modal-overlay" onClick={() => setShowSubjectModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
            <form onSubmit={e => { 
              e.preventDefault(); 
              editingSubject ? handleUpdateSubject() : handleAddSubject(); 
            }}>
              <input
                type="text"
                placeholder="Subject Name *"
                value={subjectForm.name}
                onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Subject Code (e.g., CS101) *"
                value={subjectForm.code}
                onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Credits *"
                value={subjectForm.credits}
                onChange={e => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                required
                min="1"
                max="10"
              />
              <textarea
                placeholder="Syllabus Overview *"
                value={subjectForm.syllabus}
                onChange={e => setSubjectForm({ ...subjectForm, syllabus: e.target.value })}
                required
                rows="4"
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowSubjectModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Syllabus Modal */}
      {showSyllabusModal && selectedSubject && (
        <div className="modal-overlay" onClick={() => setShowSyllabusModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <h3>Edit Syllabus - {selectedSubject.name}</h3>
            <textarea
              className="syllabus-editor"
              value={tempSyllabus}
              onChange={e => setTempSyllabus(e.target.value)}
              placeholder="Enter detailed syllabus including course objectives, learning outcomes, topics covered, assessment methods, and recommended textbooks..."
              rows="12"
            />
            <div className="modal-actions">
              <button onClick={() => setShowSyllabusModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveSyllabus}>
                Save Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Upload Modal */}
      {showContentModal && (
        <div className="modal-overlay" onClick={() => setShowContentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Upload Academic Content</h3>
            <form onSubmit={e => { e.preventDefault(); handleUploadContent(); }}>
              <input
                type="text"
                placeholder="File name (e.g., Lecture Notes Chapter 1.pdf) *"
                value={contentFile}
                onChange={e => setContentFile(e.target.value)}
                required
              />
              <div className="upload-area">
                <p>📁 Drag and drop files here or click to browse</p>
                <p className="upload-note">Supported formats: PDF, DOC, PPT, ZIP, Video files</p>
                <input type="file" style={{ display: 'none' }} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowContentModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Upload Content</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File View Modal */}
      {showViewModal && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <h3>📄 Viewing: {viewingFile}</h3>
            <div className="file-preview">
              <div className="preview-placeholder">
                <p>📄 File Preview</p>
                <p>Filename: {viewingFile}</p>
                <p>In a real application, this would show the actual file content or a preview.</p>
                <p>For PDFs, images, and documents, you would integrate viewers here.</p>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowViewModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => handleDownloadFile(viewingFile)}>
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicContent;