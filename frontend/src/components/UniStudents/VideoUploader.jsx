import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Video, 
  FileVideo, 
  CheckCircle, 
  AlertCircle, 
  Play,
  Trash2,
  Eye,
  Calendar,
  Tag
} from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

const VideoUploader = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'lecture',
    subject: '',
    tags: '',
    is_public: true
  });
  const [videoFile, setVideoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myVideos, setMyVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');
  
  const fileInputRef = useRef(null);
  const currentUser = getCurrentUser();

  // Category options
  const categories = [
    { value: 'lecture', label: 'Lecture' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'assignment_help', label: 'Assignment Help' },
    { value: 'exam_prep', label: 'Exam Preparation' },
    { value: 'lab_demo', label: 'Lab Demonstration' },
    { value: 'project_guide', label: 'Project Guide' },
    { value: 'other', label: 'Other' }
  ];

  // Load subjects and user's videos on component mount
  useEffect(() => {
    loadSubjects();
    loadMyVideos();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/videos/subjects/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadMyVideos = async () => {
    if (!currentUser?.user_id) return;
    
    setLoading(true);
    try {
      // First get the tutor ID for current user
      const tutorResponse = await fetch(`http://127.0.0.1:8000/api/tutoring/tutor-profile/?user_id=${currentUser.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!tutorResponse.ok) {
        throw new Error('Failed to get tutor profile');
      }
      
      const tutorData = await tutorResponse.json();
      if (!tutorData.success || !tutorData.data?.tutor_id) {
        throw new Error('Tutor profile not found');
      }
      
      const tutorId = tutorData.data.tutor_id;
      
      // Now get videos for this tutor
      const response = await fetch(`http://127.0.0.1:8000/api/videos/tutor/${tutorId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setMyVideos(data.data.videos || []);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setError('Failed to load your videos');
    }
    setLoading(false);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WEBM)');
        return;
      }
      
      // Validate file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        setError(`File size too large. Maximum allowed: 500MB. Your file: ${(file.size / (1024*1024)).toFixed(2)}MB`);
        return;
      }
      
      setVideoFile(file);
      setError('');
      
      // Create video preview URL
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }
    
    if (!uploadForm.title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!uploadForm.subject) {
      setError('Please select a subject');
      return;
    }
    
    if (!currentUser?.user_id) {
      setError('User not authenticated');
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('user_id', currentUser.user_id);
      formData.append('title', uploadForm.title.trim());
      formData.append('description', uploadForm.description.trim());
      formData.append('category', uploadForm.category);
      formData.append('subject', uploadForm.subject);
      formData.append('video_file', videoFile);
      formData.append('is_public', uploadForm.is_public);
      
      // Process tags
      const tags = uploadForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      formData.append('tags', JSON.stringify(tags));
      
      const response = await fetch('http://127.0.0.1:8000/api/videos/upload/', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Video uploaded successfully! It will be reviewed before being published.');
        
        // Reset form
        setUploadForm({
          title: '',
          description: '',
          category: 'lecture',
          subject: '',
          tags: '',
          is_public: true
        });
        setVideoFile(null);
        setVideoPreview('');
        
        // Reload videos
        setTimeout(() => {
          loadMyVideos();
          setShowUploadModal(false);
          setSuccess('');
        }, 2000);
        
      } else {
        setError(data.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Network error. Please try again.');
    }
    
    setUploading(false);
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/videos/${videoId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser?.user_id
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess('Video deleted successfully');
        loadMyVideos();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Videos</h1>
            <p className="text-gray-600 mt-2">Upload and manage your course video content</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Video
          </motion.button>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Videos Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Videos</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : myVideos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
              <p className="text-gray-600 mb-4">Upload your first course video to get started</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVideos.map((video) => (
                <motion.div
                  key={video.video_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => deleteVideo(video.video_id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      {video.subject_name}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(video.uploaded_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Eye className="w-4 h-4 mr-2" />
                      {video.view_count} views
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <FileVideo className="w-4 h-4 mr-2" />
                      {video.file_size_mb} MB
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                      {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                    </span>
                    
                    <span className="text-xs text-gray-500 capitalize">
                      {video.category.replace('_', ' ')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => !uploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Upload Course Video</h2>
                    <button
                      type="button"
                      onClick={() => !uploading && setShowUploadModal(false)}
                      disabled={uploading}
                      className="p-2 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-gray-600">
                    Share educational content with students
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* File Upload Area */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Video File *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{ cursor: "pointer" }}
                    >
                      {videoFile ? (
                        <div className="space-y-4">
                          <Video className="w-12 h-12 mx-auto text-blue-600" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">{videoFile.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatFileSize(videoFile.size)}
                            </p>
                          </div>
                          {videoPreview && (
                            <div className="max-w-xs mx-auto">
                              <video
                                src={videoPreview}
                                controls
                                className="w-full rounded-lg"
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="mb-2 text-lg font-medium text-gray-900">
                            Drop your video here
                          </p>
                          <p className="mb-4 text-sm text-gray-600">
                            or click to browse
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports MP4, AVI, MOV, WMV, FLV, WEBM up to 500MB
                          </p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*,.mp4,.avi,.mov,.wmv,.flv,.webm"
                        style={{ display: "none" }}
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      disabled={uploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      placeholder="Enter video title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={uploadForm.description}
                      onChange={handleInputChange}
                      disabled={uploading}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      placeholder="Describe what students will learn from this video"
                    />
                  </div>

                  {/* Category and Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Category
                      </label>
                      <select
                        name="category"
                        value={uploadForm.category}
                        onChange={handleInputChange}
                        disabled={uploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={uploadForm.subject}
                        onChange={handleInputChange}
                        disabled={uploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        required
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.subject_id} value={subject.subject_id}>
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={uploadForm.tags}
                      onChange={handleInputChange}
                      disabled={uploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      placeholder="mathematics, calculus, derivatives (comma separated)"
                    />
                  </div>

                  {/* Public Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_public"
                      checked={uploadForm.is_public}
                      onChange={handleInputChange}
                      disabled={uploading}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-900">
                      Make video public (visible to all students)
                    </label>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      disabled={uploading}
                      className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={uploading || !videoFile}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoUploader;
