import React, { useState } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";

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
  const [playing, setPlaying] = useState(null); // youtubeId or null

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      <StudentNavigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h1 className="font-display font-bold text-3xl text-primary-600 mb-2">Pre-Uni Courses</h1>
          <p className="text-primary-400">Video lessons and short courses to help you prepare for university entrance and improve your Z-score.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-primary-400">Featured Video Lessons</h2>
              <p className="text-primary-300 text-sm">Select a lesson to watch. These are short, focused modules created for final-year students.</p>
            </div>
            <div className="text-right">
              <Link to="/student/z-score-analysis" className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm">Analyze Z-Score</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleVideos.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl shadow p-4 border border-accent-100 flex flex-col">
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                {/* thumbnail using YouTube image */}
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setPlaying(v.youtubeId)}
                    className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg"
                    aria-label={`Play ${v.title}`}
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="mt-4 flex-1">
                <h3 className="font-semibold text-primary-400 mb-1">{v.title}</h3>
                <p className="text-primary-300 text-sm">{v.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-primary-300">{v.duration}</div>
                <div>
                  <Link to={`/student/pre-uni-courses/details/${v.id}`} className="text-primary-600 font-medium">Details →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video modal */}
        {playing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden">
              <div className="flex justify-between items-center p-3 border-b">
                <h3 className="font-semibold text-primary-600">Video Lesson</h3>
                <button
                  onClick={() => setPlaying(null)}
                  className="text-primary-600 px-3 py-1 rounded hover:bg-primary-50"
                >
                  Close
                </button>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  title="pre-uni-video"
                  src={`https://www.youtube.com/embed/${playing}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreUniCourses;
