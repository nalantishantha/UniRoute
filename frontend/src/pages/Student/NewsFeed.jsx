import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  GraduationCap,
  ArrowLeft,
  Calendar,
  Users,
  BookOpen,
  Bell,
  User,
  Loader2,
} from "lucide-react";

const NewsFeed = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/students/announcements/');
      const data = await response.json();
      
      if (data.success) {
        setAnnouncements(data.announcements);
      } else {
        setError(data.message || 'Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-100">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-blue-900 mb-4">
            News & Updates
          </h1>
          <p className="text-xl text-blue-800">
            Stay updated with the latest university news and announcements
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 text-blue-900 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Announcements List */}
        {!loading && !error && (
          <div className="space-y-6">
            {announcements.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Bell className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                <p className="text-xl text-blue-800">No announcements available at the moment.</p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.announcement_id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100 hover:shadow-xl transition-all"
                >
                  {/* Header with University Name and Date */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-accent-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <GraduationCap className="h-6 w-6 text-blue-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-blue-900">
                          {announcement.university_name}
                        </h3>
                        <div className="flex items-center space-x-1 text-blue-600 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(announcement.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Announcement Content */}
                  <div className="mb-4">
                    <h2 className="font-display font-semibold text-2xl text-blue-900 mb-3">
                      {announcement.title}
                    </h2>

                    <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                      {announcement.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
