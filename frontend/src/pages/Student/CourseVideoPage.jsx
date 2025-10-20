import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import StarRating from "../../components/StarRating";
import { getCurrentUser } from '../../utils/auth';
import { ArrowLeft, Download, FileText, Play, Star } from "lucide-react";

const CourseVideoPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const ytPlayerRef = useRef(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      const studentParam = user && user.user_id ? `&student_id=${user.user_id}` : '';
      const res = await fetch(`/api/courses/?include_related=true${studentParam}`);
      const data = await res.json();
      
      if (data && data.success) {
        const courseData = (data.courses || []).find(c => c.id === parseInt(courseId));
        if (courseData) {
          setCourse(courseData);
          // Set first video or preview as current
          if (courseData.videos && courseData.videos.length > 0) {
            const preview = courseData.videos.find(v => v.is_preview) || courseData.videos[0];
            setCurrentVideo(preview);
          }
        } else {
          setError('Course not found');
        }
      } else {
        setError('Failed to load course');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Load YouTube Iframe API
  const loadYouTubeAPI = () => new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    if (document.getElementById('yt-iframe-api')) {
      const check = () => { if (window.YT && window.YT.Player) resolve(window.YT); else setTimeout(check, 50); };
      check();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.id = 'yt-iframe-api';
    s.onload = () => { const check = () => { if (window.YT && window.YT.Player) resolve(window.YT); else setTimeout(check, 50); }; check(); };
    s.onerror = reject;
    document.body.appendChild(s);
  });

  // Extract YouTube ID from current video
  const getYouTubeId = (video) => {
    if (!video) return null;
    const videoUrl = video.video_url || '';
    if (video.video_provider === 'youtube' || /youtube\.com|youtu\.be/.test(videoUrl)) {
      const match = videoUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      return match ? match[1] : video.video_public_id || null;
    }
    return null;
  };

  // Create/destroy YT player when currentVideo changes
  useEffect(() => {
    let mounted = true;
    if (!currentVideo) return;

    const youtubeId = getYouTubeId(currentVideo);
    if (!youtubeId) return;

    const setupPlayer = async () => {
      try {
        const YT = await loadYouTubeAPI();

        // Destroy existing player
        if (ytPlayerRef.current) {
          try { ytPlayerRef.current.destroy(); } catch (e) {}
          ytPlayerRef.current = null;
        }

        // Wait for DOM element to be available
        const playerElement = document.getElementById('yt-player-main');
        if (!playerElement) {
          console.error('Player element not found');
          return;
        }

        const player = new YT.Player('yt-player-main', {
          height: '100%',
          width: '100%',
          videoId: youtubeId,
          playerVars: { 
            rel: 0, 
            autoplay: 1,
            modestbranding: 1,
            controls: 1
          },
          events: {
            onReady: (e) => { 
              console.log('Player ready');
              try { e.target.playVideo(); } catch (err) { console.error('Play error', err); } 
            },
            onStateChange: (e) => {
              const ENDED = (window.YT && window.YT.PlayerState && window.YT.PlayerState.ENDED) ? window.YT.PlayerState.ENDED : 0;
              console.log('Player state:', e.data, 'ENDED:', ENDED);
              if (e.data === ENDED) {
                handleVideoEnded();
              }
            },
            onError: (e) => {
              console.error('YouTube player error:', e.data);
            }
          }
        });

        if (mounted) ytPlayerRef.current = player;
      } catch (err) {
        console.error('YT setup failed', err);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(setupPlayer, 100);

    return () => {
      mounted = false;
      try { if (ytPlayerRef.current) { ytPlayerRef.current.destroy(); ytPlayerRef.current = null; } } catch (e) {}
    };
  }, [currentVideo]);

  const handleVideoEnded = async () => {
    if (!currentVideo || !course) return;

    const user = getCurrentUser();
    if (!user || !user.user_id) return;

    try {
      // Post progress
      await fetch(`/api/courses/${course.id}/videos/${currentVideo.id}/progress/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.user_id, watched_seconds: currentVideo.duration_seconds || 0, completed: true })
      });

      // Open rating modal
      setRatingModal({ courseId: course.id, videoId: currentVideo.id, watched_seconds: currentVideo.duration_seconds || 0, rating: 5, review: '' });
    } catch (err) {
      console.error('Progress error', err);
    }
  };

  const submitRating = async () => {
    if (!ratingModal) return;
    const user = getCurrentUser();
    if (!user || !user.user_id) { window.location.replace('/login'); return; }

    const postJson = async (url, body) => {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const text = await res.text();
      try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; } catch (e) { return { ok: res.ok, status: res.status, data: text }; }
    };

    // Ensure progress is recorded first
    if (ratingModal.videoId) {
      const prog = await postJson(`/api/courses/${ratingModal.courseId}/videos/${ratingModal.videoId}/progress/`, { student_id: user.user_id, watched_seconds: ratingModal.watched_seconds || 0, completed: true });
      if (!prog.ok) {
        alert((prog.data && prog.data.error) || 'Could not verify video progress');
        return;
      }
    }

    // Submit video rating (this will also update course aggregate)
    const ratingRes = await postJson(`/api/courses/${ratingModal.courseId}/videos/${ratingModal.videoId}/rate/`, { student_id: user.user_id, rating: ratingModal.rating, review: ratingModal.review });
    if (!ratingRes.ok) {
      alert((ratingRes.data && ratingRes.data.error) || 'Failed to submit rating');
      return;
    }

    const data = ratingRes.data;
    if (data && data.success) {
      // Update course and video ratings in UI
      setCourse(prev => ({
        ...prev,
        average_rating: data.course.average_rating,
        rating_count: data.course.rating_count,
        videos: prev.videos.map(v =>
          v.id === ratingModal.videoId
            ? { ...v, average_rating: data.video.average_rating, rating_count: data.video.rating_count }
            : v
        )
      }));

      // Update current video if it's the one being rated
      if (currentVideo && currentVideo.id === ratingModal.videoId) {
        setCurrentVideo(prev => ({
          ...prev,
          average_rating: data.video.average_rating,
          rating_count: data.video.rating_count
        }));
      }

      setRatingModal(null);
      alert('Thanks for your rating! 🌟');
    } else {
      alert((data && data.error) || 'Failed to submit rating');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-primary-300">Loading course...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error || 'Course not found'}</div>
          <div className="text-center mt-4">
            <button onClick={() => navigate('/student/pre-uni-courses')} className="px-4 py-2 bg-primary-600 text-white rounded">
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      <StudentNavigation />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button onClick={() => navigate('/student/pre-uni-courses')} className="flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Video Player */}
              <div className="relative bg-black" style={{ paddingTop: '56.25%' }}>
                {currentVideo && getYouTubeId(currentVideo) ? (
                  <div id="yt-player-main" className="absolute top-0 left-0 w-full h-full"></div>
                ) : currentVideo && currentVideo.video_url ? (
                  <video
                    controls
                    controlsList="nodownload"
                    className="absolute top-0 left-0 w-full h-full"
                    src={currentVideo.video_url}
                    poster={currentVideo.thumbnail_url || course?.thumbnail_url}
                    onEnded={handleVideoEnded}
                  >
                    <source src={currentVideo.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No video available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-primary-400 mb-2">{currentVideo?.title || course.title}</h1>
                <p className="text-primary-300 mb-4">{currentVideo?.description || course.description}</p>
                
                {/* Course Stats */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <StarRating rating={course.average_rating || 0} readOnly={true} size="sm" />
                      <span className="ml-2 text-primary-300">({course.rating_count || 0} ratings)</span>
                    </div>
                    <div className="text-primary-300">{course.enroll_count || 0} students</div>
                  </div>
                  <button
                    onClick={() => setRatingModal({ courseId: course.id, videoId: currentVideo?.id, watched_seconds: currentVideo?.duration_seconds || 0, rating: 5, review: '' })}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    <Star className="h-4 w-4 fill-current" />
                    <span>Rate this Video</span>
                  </button>
                </div>

                {/* Resources Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-primary-400 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Course Resources
                  </h3>
                  {course.resources && course.resources.length > 0 ? (
                    <div className="space-y-2">
                      {course.resources.map((resource) => (
                        <div
                          key={resource.id}
                          onClick={() => {
                            // Handle different resource types
                            if (resource.resource_type === 'link') {
                              // External links (like Udemy)
                              window.open(resource.file_url, '_blank');
                            } else {
                              // Downloadable files (PDFs, docs, etc.) or Cloudinary hosted
                              const link = document.createElement('a');
                              link.href = resource.file_url;
                              link.download = resource.title || 'download';
                              link.target = '_blank';
                              link.rel = 'noreferrer';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          className="flex items-center justify-between p-3 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors border border-accent-100 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <Download className="h-5 w-5 text-primary-400" />
                            <div>
                              <div className="text-sm font-medium text-primary-600">{resource.title}</div>
                              <div className="text-xs text-primary-300">
                                {resource.resource_type?.toUpperCase() || 'FILE'} 
                                {resource.is_free && ' · Free'}
                                {resource.description && ` · ${resource.description.substring(0, 50)}`}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-primary-600 font-medium">
                            {resource.resource_type === 'link' ? 'Open' : 'Download'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-primary-300 text-sm">No resources available for this course</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Video List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-primary-400 mb-4">Course Videos</h3>
              {course.videos && course.videos.length > 0 ? (
                <div className="space-y-2">
                  {course.videos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => setCurrentVideo(video)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentVideo?.id === video.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-accent-50 hover:bg-accent-100 text-primary-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-sm font-medium">{index + 1}.</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{video.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {video.duration_seconds && (
                              <div className={`text-xs ${currentVideo?.id === video.id ? 'text-white/80' : 'text-primary-300'}`}>
                                {Math.floor(video.duration_seconds / 60)} min
                              </div>
                            )}
                            {video.is_preview && (
                              <span className={`text-xs px-2 py-0.5 rounded ${currentVideo?.id === video.id ? 'bg-white/20' : 'bg-primary-100'}`}>
                                Preview
                              </span>
                            )}
                          </div>
                          {video.average_rating > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <StarRating rating={video.average_rating} readOnly={true} size="sm" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-primary-300 text-sm">No videos available</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary-600">Rate this Video</h3>
              <button
                onClick={() => setRatingModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">How would you rate this video?</p>
                <div className="flex justify-center mb-2">
                  <StarRating
                    rating={ratingModal.rating}
                    onRatingChange={(value) => setRatingModal({ ...ratingModal, rating: value })}
                    size="xl"
                  />
                </div>
                <p className="text-2xl font-bold text-primary-600">{ratingModal.rating.toFixed(1)} / 5.0</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your thoughts (optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  rows={4}
                  placeholder="What did you think about this video?"
                  value={ratingModal.review}
                  onChange={(e) => setRatingModal({ ...ratingModal, review: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRatingModal(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-lg"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseVideoPage;
