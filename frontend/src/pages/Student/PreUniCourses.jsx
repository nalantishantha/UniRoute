import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import { getCurrentUser } from '../../utils/auth';

const sampleVideos = [
  {
    id: "math-1",
    title: "Advanced Mathematics: Problem Solving",
    description: "Walkthrough of common A/L mathematics problems and past paper techniques.",
    duration: "45:12",
    // public sample video (YouTube embed id)
    youtubeId: "sBws8MSXN7A",
  },
  {
    id: "physics-1",
    title: "Physics: Mechanics Deep Dive",
    description: "Core mechanics concepts explained with worked examples.",
    duration: "38:05",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "chem-1",
    title: "Chemistry: Stoichiometry & Reactions",
    description: "Key stoichiometry problems and balancing techniques.",
    duration: "30:20",
    youtubeId: "9bZkp7q19f0",
  },
];

const PreUniCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(null); // { type: 'youtube'|'external', id or url, title }
  const [ratingModal, setRatingModal] = useState(null); // { courseId, rating, review }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const user = getCurrentUser();
        const studentQuery = user && user.user_id ? `&student_id=${user.user_id}` : '';
        const response = await fetch(`/api/courses/?include_related=true${studentQuery}`);
        const data = await response.json();
        if (data && data.success) {
          // initialize enrolled flag from server if provided
          const serverCourses = data.courses || [];
          serverCourses.forEach(c => {
            if (c.enrolled_by_current_user) c._enrolled = true;
          });
          setCourses(serverCourses);
        } else {
          setError('Failed to load courses');
        }
      } catch (err) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const openVideo = (video) => {
    // detect youtube id if provider is youtube or url contains youtube
    const url = video.video_url || '';
    if (video.video_provider === 'youtube' || /youtube\.com|youtu\.be/.test(url)) {
      // extract youtube id
      const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
      const id = match ? match[1] : video.video_public_id || null;
      if (id) {
        setPlaying({ type: 'youtube', id, title: video.title });
        return;
      }
    }

    // fallback: open external link in new tab
    setPlaying({ type: 'external', url, title: video.title });
  };

  const enrollInCourse = async (courseId, idx) => {
    const user = getCurrentUser();
    if (!user || !user.user_id) {
      // redirect to login or show message
      window.location.replace('/login');
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}/enroll/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.user_id })
      });
      const data = await res.json();
      if (data && data.success) {
        // update UI: mark enrolled and update enroll_count
        let enrolledCourse = null;
        setCourses((prev) => {
          const copy = [...prev];
          const c = copy[idx] || copy.find(x => x.id === courseId);
          if (c) {
            c.enroll_count = (c.enroll_count || 0) + 1;
            c._enrolled = true;
            enrolledCourse = c;
          }
          return copy;
        });

        // Play a preview or first video if available
        const courseToPlay = enrolledCourse || courses.find(x => x.id === courseId);
        const videos = courseToPlay && courseToPlay.videos ? courseToPlay.videos : [];
        if (videos && videos.length > 0) {
          const preview = videos.find(v => v.is_preview) || videos[0];
          if (preview) openVideo(preview);
        } else {
          // No videos available
          // You can remove alert if you don't want a message
          alert('Enrolled successfully — no course videos available to play.');
        }
      } else {
        alert(data.error || 'Enrollment failed');
      }
    } catch (err) {
      console.error('Enrollment error', err);
      alert('Enrollment failed');
    }
  };

  const renderResourceLink = (r) => {
    const url = r.file_url || '';
    const isUdemy = /udemy\.com/.test(url.toLowerCase());
    const isExternal = isUdemy || /^https?:\/\//.test(url);

    return (
      <a
        key={r.id}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-primary-600 hover:underline block mt-1"
      >
        {r.title} {r.is_free ? '(Free)' : ''} {isUdemy ? '· Udemy' : ''}
      </a>
    );
  };

  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'resources'

  const allResources = courses.reduce((acc, c) => {
    if (c.resources && c.resources.length) {
      c.resources.forEach(r => acc.push({ ...r, course_title: c.title, course_id: c.id }));
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      <StudentNavigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h1 className="font-display font-bold text-3xl text-primary-600 mb-2">Pre-Uni Courses</h1>
          <p className="text-primary-400">Video lessons and short courses to help you prepare for university entrance and improve your Z-score.</p>
        </div>

        {loading && <div className="text-center text-primary-300">Loading courses...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex rounded-lg bg-white/80 p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'videos' ? 'bg-primary-600 text-white' : 'text-primary-600'}`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'resources' ? 'bg-primary-600 text-white' : 'text-primary-600'}`}
            >
              Resources
            </button>
          </div>
        </div>

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow p-4 border border-accent-100 flex flex-col">
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={course.thumbnail_url || `https://via.placeholder.com/400x225?text=${encodeURIComponent(course.title)}`}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              </div>

              {/* Resource or category label (placed outside the image to avoid overlap) */}
              <div className="mt-2">
                {course.resources && course.resources.length > 0 ? (
                  <div className="inline-block bg-white/90 px-3 py-1 rounded-full text-xs font-medium shadow-sm max-w-full truncate">
                    {course.resources[0].title}
                  </div>
                ) : (
                  <div className="inline-block bg-white/90 px-3 py-1 rounded-full text-xs font-medium shadow-sm max-w-full truncate">
                    {course.category}
                  </div>
                )}
              </div>

              <div className="mt-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-primary-400 mb-1">{course.title}</h3>
                  <div className="flex items-center space-x-2">
                    {course.has_youtube ? <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">YouTube</span> : null}
                    {course.has_udemy ? <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Udemy</span> : null}
                  </div>
                </div>
                <p className="text-primary-300 text-sm line-clamp-3">{course.description}</p>
              </div>

              <div className="mt-4">
                <div className="text-sm text-primary-300">Duration: {course.total_duration_minutes ? `${course.total_duration_minutes} mins` : '—'}</div>
                <div className="text-sm text-primary-300">Videos: {course.video_count || 0} · Resources: {course.resource_count || 0}</div>
              </div>

              {/* <div className="mt-3">
                list previews / first few videos and resources
                {course.videos && course.videos.slice(0,3).map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-1">
                    <div className="text-sm text-primary-300">{v.order}. {v.title}</div>
                    <div>
                      Preview button remains for preview videos only; Open removed per request
                      {v.is_preview && (
                        <button onClick={() => openVideo(v)} className="text-primary-600 text-sm">Preview</button>
                      )}
                    </div>
                  </div>
                ))}

                {course.resources && course.resources.slice(0,3).map((r) => renderResourceLink(r))}
              </div> */}

              <div className="mt-4 flex items-center justify-end">
                {course._enrolled ? (
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 rounded bg-success text-white text-sm">Enrolled</button>
                    <button onClick={() => setRatingModal({ courseId: course.id, rating: 5, review: '' })} className="px-3 py-1 rounded bg-primary-50 text-primary-600 text-sm border">Rate</button>
                  </div>
                ) : (
                  <button onClick={() => enrollInCourse(course.id, courses.indexOf(course))} className="px-3 py-1 rounded bg-primary-600 text-white text-sm">Enroll</button>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            {allResources.length === 0 && <div className="text-center text-primary-300">No resources available</div>}
            {allResources.map((r) => (
              <div key={`${r.id}-${r.course_id}`} className="bg-white rounded-xl p-4 border shadow-sm flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-primary-600">{r.title} <span className="text-xs text-primary-300">· {r.resource_type}</span></div>
                  <div className="text-sm text-primary-300">{r.description}</div>
                  <div className="text-xs text-primary-300 mt-1">Course: {r.course_title}</div>
                </div>
                <div className="flex flex-col items-end">
                  <a href={r.file_url} target="_blank" rel="noreferrer" className="text-primary-600 underline">Open</a>
                  {r.is_free ? <div className="text-xs text-success mt-2">Free</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video modal */}
        {playing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden">
              <div className="flex justify-between items-center p-3 border-b">
                <h3 className="font-semibold text-primary-600">{playing.title || 'Video'}</h3>
                <button
                  onClick={() => setPlaying(null)}
                  className="text-primary-600 px-3 py-1 rounded hover:bg-primary-50"
                >
                  Close
                </button>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                {playing.type === 'youtube' ? (
                  <iframe
                    title="pre-uni-video"
                    src={`https://www.youtube.com/embed/${playing.id}?autoplay=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="p-6 text-center">
                    <a href={playing.url} target="_blank" rel="noreferrer" className="text-primary-600 underline">Open external video</a>
                  </div>
                )}

                {/* Rating modal */}
                {ratingModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-primary-600">Rate course</h3>
                        <button onClick={() => setRatingModal(null)} className="text-primary-600 px-2">Close</button>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm text-primary-400">Select rating (0-5)</div>
                        <input type="range" min="0" max="5" step="0.5" value={ratingModal.rating} onChange={(e) => setRatingModal({...ratingModal, rating: parseFloat(e.target.value)})} />
                        <div className="text-sm">{ratingModal.rating} / 5</div>
                        <textarea className="w-full border p-2 rounded" rows={4} placeholder="Write a short review (optional)" value={ratingModal.review} onChange={(e) => setRatingModal({...ratingModal, review: e.target.value})} />
                        <div className="flex justify-end">
                          <button onClick={async () => {
                            const user = getCurrentUser();
                            if (!user || !user.user_id) { window.location.replace('/login'); return; }

                            try {
                              const res = await fetch(`/api/courses/${ratingModal.courseId}/rate/`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ student_id: user.user_id, rating: ratingModal.rating, review: ratingModal.review })
                              });
                              const data = await res.json();
                              if (data && data.success) {
                                // update course aggregate in local state
                                setCourses(prev => prev.map(c => c.id === data.course.id ? {...c, average_rating: data.course.average_rating, rating_count: data.course.rating_count} : c));
                                setRatingModal(null);
                                alert('Thanks for your rating!');
                              } else {
                                alert(data.error || 'Failed to submit rating');
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Failed to submit rating');
                            }
                          }} className="px-4 py-2 bg-primary-600 text-white rounded">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreUniCourses;
