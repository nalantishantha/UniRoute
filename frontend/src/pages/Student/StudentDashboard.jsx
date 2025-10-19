import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import { getCurrentUser } from "../../utils/auth";
import {
  GraduationCap,
  User,
  BookOpen,
  Users,
  Star,
  MapPin,
  Clock,
  Check,
  TrendingUp,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Calendar,
  Award,
  Target,
  ChevronRight,
  Plus,
  Bell,
  Settings,
  LogOut,
  Loader2,
  AlertCircle,
  Menu,
  X,
  UserPlus,
  BookMarked,
  Newspaper,
  Edit,
} from "lucide-react";

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
    
    // Listen for profile update events
    const handleProfileUpdate = () => {
      console.log('Dashboard: Profile updated, refreshing data...');
      fetchStudentProfile();
    };
    
    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Dashboard: Page became visible, refreshing data...');
        fetchStudentProfile();
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.user_id) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      console.log('Dashboard: Fetching profile for user:', currentUser.user_id);

      const response = await fetch(`http://127.0.0.1:8000/api/students/profile/?user_id=${currentUser.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dashboard: Profile data received:', data);

  if (data.success) {
        // Process the data for dashboard display
        const profileData = {
          name: data.student_data.full_name || data.student_data.username || 'Student Name',
          email: data.student_data.email,
          alStream: data.student_data.current_stage || "Not specified",
          subjects: [], // You can add this later from another table
          zScore: null, // You can add this later from results table
          district: data.student_data.district || data.student_data.location || "Not specified",
          school: data.student_data.school || "Not specified",
          profileImage: data.student_data.profile_picture 
            ? (data.student_data.profile_picture.startsWith('http') 
                ? `${data.student_data.profile_picture}?t=${Date.now()}` 
                : `http://127.0.0.1:8000/media/${data.student_data.profile_picture}?t=${Date.now()}`)
            : "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
          // Calculate profile completion percentage
          profileComplete: calculateProfileCompletion(data.student_data),
          isVerified: data.student_data.is_verified,
          joinedDate: data.student_data.created_at,
          lastUpdated: data.student_data.updated_at,
        };
        
        setStudentProfile(profileData);

        // After profile is set, fetch mentoring sessions for this student
        try {
          const currentUserId = currentUser.user_id;
          fetchGroupedMentoringRequests(currentUserId);
        } catch (e) {
          console.warn('Dashboard: failed to fetch mentoring sessions', e);
        }
      } else {
        setError(data.message || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Dashboard: Error fetching student profile:', error);
      setError('Failed to connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (data) => {
    const fields = [
      data.full_name,
      data.email,
      data.contact_number,
      data.location,
      data.bio,
      data.profile_picture,
      data.current_stage,
      data.district,
      data.school
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const quickStatss = [
    {
      label: "Profile Completion",
      value: "85%",
      icon: User,
      color: "bg-blue-500",
    },
    {
      label: "Recommended Degrees",
      value: "12",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      label: "Available Mentors",
      value: "8",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "News Updates",
      value: "5",
      icon: Newspaper,
      color: "bg-orange-500",
    },
  ];
  // Seed recent activities with static entries; mentoring sessions will be merged in when fetched
  useEffect(() => {
    setRecentActivities([
      {
        id: 'seed-1',
        type: "mentor",
        title: "New message from Dr. Samantha Silva",
        description: "Regarding your engineering career path inquiry",
        time: "2 hours ago",
        icon: MessageCircle,
        color: "text-blue-500",
      },
      {
        id: 'seed-2',
        type: "news",
        title: "University of Colombo announces new programs",
        description: "New Engineering Faculty to open in 2025",
        time: "1 day ago",
        icon: Newspaper,
        color: "text-green-500",
      },
      {
        id: 'seed-3',
        type: "recommendation",
        title: "New degree recommendation available",
        description: "Bachelor of Computer Science - University of Moratuwa",
        time: "2 days ago",
        icon: Star,
        color: "text-purple-500",
      },
      {
        id: 'seed-4',
        type: "tutor",
        title: "Tutor session completed",
        description: "Combined Mathematics with Mr. Kamal Perera",
        time: "3 days ago",
        icon: BookMarked,
        color: "text-orange-500",
      },
    ]);
  }, []);

  // Fetch accepted mentoring sessions for the student and merge into recent activities
  const fetchAcceptedMentoringSessions = async (studentId) => {
    if (!studentId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/mentoring/sessions/?student_id=${studentId}`);
      if (!res.ok) {
        console.warn('Dashboard: mentoring sessions endpoint returned', res.status);
        return;
      }
      const payload = await res.json();
      const sessions = Array.isArray(payload.sessions) ? payload.sessions : payload || [];

      // Filter accepted sessions and map to recent activity items
      const accepted = sessions.filter((s) => {
        // handle different backend field names conservatively
        return s.status === 'accepted' || s.is_accepted === true || s.state === 'accepted';
      }).map((s) => ({
        id: `ment-${s.id}`,
        type: 'mentor',
        title: s.mentor && (s.mentor.full_name || s.mentor.name) ? `Mentor ${s.mentor.full_name || s.mentor.name} accepted your session` : 'Mentor accepted your session',
        description: s.subject || s.topic || s.note || (s.mentor ? `Session with ${s.mentor.full_name || s.mentor.name}` : ''),
        time: s.scheduled_time || s.start_time || s.date || 'Scheduled',
        icon: UserPlus || MessageCircle,
        color: 'text-green-500',
      }));

      if (accepted.length > 0) {
        // Prepend accepted mentoring sessions to recent activities
        setRecentActivities((prev) => [...accepted, ...prev]);
      }
    } catch (err) {
      console.warn('Dashboard: error fetching mentoring sessions', err);
    }
  };

  // Fetch mentoring requests grouped by status from student endpoint
  const [mentoringGrouped, setMentoringGrouped] = useState({ pending: [], accepted: [], completed: [] });

  const fetchGroupedMentoringRequests = async (studentId) => {
    if (!studentId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/mentoring/requests-grouped/?user_id=${studentId}`);
      if (!res.ok) {
        console.warn('Dashboard: mentoring requests grouped endpoint returned', res.status);
        return;
      }
      const payload = await res.json();
      if (payload && payload.success) {
        setMentoringGrouped({
          pending: Array.isArray(payload.pending) ? payload.pending : [],
          accepted: Array.isArray(payload.accepted) ? payload.accepted : [],
          completed: Array.isArray(payload.completed) ? payload.completed : [],
        });

        // Merge accepted mentoring requests into recent activities (keep existing seed items)
        const acceptedItems = (Array.isArray(payload.accepted) ? payload.accepted : []).map((r) => ({
          id: `req-${r.id}`,
          type: 'mentor',
          title: r.mentor ? `${r.mentor} accepted your request` : 'Mentor accepted your request',
          description: r.subject || 'Mentoring request',
          time: r.preferred_time || (r.created_at ? new Date(r.created_at).toLocaleString() : 'Scheduled'),
          icon: UserPlus,
          color: 'text-green-500',
        }));

        if (acceptedItems.length > 0) {
          setRecentActivities((prev) => [...acceptedItems, ...prev]);
        }
      }
    } catch (err) {
      console.warn('Dashboard: error fetching grouped mentoring requests', err);
    }
  };

  // upcomingEvents removed; sidebar will show a compact Recent Activities list instead

  // const featuredMentors = [
  //   {
  //     id: 1,
  //     name: "Dr. Samantha Silva",
  //     university: "University of Colombo",
  //     field: "Engineering",
  //     rating: 4.9,
  //     image:
  //       "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  //     available: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Prof. Nimal Fernando",
  //     university: "University of Peradeniya",
  //     field: "Medicine",
  //     rating: 4.8,
  //     image:
  //       "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  //     available: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Ms. Priya Jayawardena",
  //     university: "University of Moratuwa",
  //     field: "Computer Science",
  //     rating: 4.9,
  //     image:
  //       "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  //     available: true,
  //   },
  // ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
        <StudentNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-400 mx-auto mb-4" />
              <p className="text-primary-400 text-lg">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
        <StudentNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchStudentProfile}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If no student profile data, show default state
  if (!studentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
        <StudentNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No profile data available</p>
            <Link 
              to="/student/profile-setup"
              className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
            >
              Set Up Profile
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Update quick stats with real data
  const quickStats = [
    {
      label: "Profile Completion",
      value: `${studentProfile.profileComplete}%`,
      icon: User,
      color: "bg-blue-500",
    },
    {
      label: "Current Stage",
      value: studentProfile.alStream,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      label: "District",
      value: studentProfile.district,
      icon: MapPin,
      color: "bg-purple-500",
    },
    {
      label: "Status",
      value: studentProfile.isVerified ? "Verified" : "Pending",
      icon: Award,
      color: studentProfile.isVerified ? "bg-green-500" : "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-100 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display font-bold text-3xl mb-2">
                Welcome back, {studentProfile.name}!
              </h1>
              <p className="text-primary-100 mb-4">
                Ready to explore your university options?
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-lg font-bold">
                    {studentProfile.profileComplete}%
                  </div>
                  <div className="text-primary-100 text-sm">
                    Profile Complete
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              {studentProfile.profileComplete < 100 && (
                <Link
                  to="/student/edit-profile"
                  className="bg-accent-200 text-primary-400 px-6 py-3 rounded-xl font-semibold hover:bg-accent-300 transition-all inline-flex items-center space-x-2"
                >
                  <Edit className="h-5 w-5" />
                  <span>Complete Profile</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-300 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary-400">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/student/z-score-analysis"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              Z-Score Analysis
            </h3>
            <p className="text-primary-300 text-sm mb-4">
              Assess your A/L performance and university eligibility
            </p>
            {/* <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-300 text-xs">Current Z-Score</p>
                <p className="text-2xl font-bold text-primary-400">
                  {studentProfile.zScore ?? 'N/A'}
                </p>
              </div>
              <div className="self-center">
                <span className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-xl text-sm">
                  View Analysis
                </span>
              </div>
            </div> */}
          </Link>

          <Link
            to="/student/mentors"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              Find Mentors
            </h3>
            <p className="text-primary-300 text-sm">
              Connect with university graduates and professionals
            </p>
          </Link>

          <Link
            to="/student/tutors"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <BookMarked className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              Find Tutors
            </h3>
            <p className="text-primary-300 text-sm">
              Get help with your studies from qualified tutors
            </p>
          </Link>

          <Link
            to="/student/news"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-accent-100 group"
          >
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <Newspaper className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-400 mb-2">
              News Feed
            </h3>
            <p className="text-primary-300 text-sm">
              Stay updated with university news and announcements
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-2xl text-primary-400">
                  Your sessions and activities
                </h2>
                <button className="text-accent-300 hover:text-accent-400 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Mentoring Requests grouped by status */}
                <div className="mb-4">
                  <h4 className="font-medium text-primary-400 mb-2">Pending Requests</h4>
                  {mentoringGrouped.pending.length === 0 && (
                    <p className="text-sm text-primary-300 mb-2">No pending requests</p>
                  )}
                  {mentoringGrouped.pending.map((r) => (
                    <div key={`pending-${r.id}`} className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2">
                      <div className="p-2 rounded-full bg-white text-yellow-500">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-primary-400 font-medium">{r.mentor || 'Mentor'}</h5>
                        <p className="text-sm text-primary-300">{r.subject}</p>
                        <p className="text-xs text-primary-300">{r.preferred_time || (r.created_at ? new Date(r.created_at).toLocaleString() : '')}</p>
                      </div>
                      <div className="text-sm text-yellow-600 font-semibold">Pending</div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-primary-400 mb-2">Accepted Requests</h4>
                  {mentoringGrouped.accepted.length === 0 && (
                    <p className="text-sm text-primary-300 mb-2">No accepted requests</p>
                  )}
                  {mentoringGrouped.accepted.map((r) => (
                    <div key={`accepted-${r.id}`} className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2">
                      <div className="p-2 rounded-full bg-white text-green-500">
                        <Check className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-primary-400 font-medium">{r.mentor || 'Mentor'}</h5>
                        <p className="text-sm text-primary-300">{r.subject}</p>
                        <p className="text-xs text-primary-300">{r.preferred_time || (r.created_at ? new Date(r.created_at).toLocaleString() : '')}</p>
                      </div>
                      <div className="text-sm text-green-600 font-semibold">Accepted</div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-primary-400 mb-2">Completed Requests</h4>
                  {mentoringGrouped.completed.length === 0 && (
                    <p className="text-sm text-primary-300 mb-2">No completed requests</p>
                  )}
                  {mentoringGrouped.completed.map((r) => (
                    <div key={`completed-${r.id}`} className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2">
                      <div className="p-2 rounded-full bg-white text-gray-500">
                        <Check className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-primary-400 font-medium">{r.mentor || 'Mentor'}</h5>
                        <p className="text-sm text-primary-300">{r.subject}</p>
                        <p className="text-xs text-primary-300">{r.preferred_time || (r.created_at ? new Date(r.created_at).toLocaleString() : '')}</p>
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">Completed</div>
                    </div>
                  ))}
                </div>

                {/* {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-accent-50 rounded-xl hover:bg-accent-100 transition-colors cursor-pointer"
                    >
                      <div
                        className={`p-2 rounded-full bg-white ${activity.color}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-400">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-primary-300 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-primary-300">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })} */}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Mentors */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-primary-400">
                  Featured Mentors
                </h3>
                <Link
                  to="/student/mentors"
                  className="text-accent-300 hover:text-accent-400 transition-colors text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {featuredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-accent-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary-400 text-sm">
                        {mentor.name}
                      </h4>
                      <p className="text-xs text-primary-300">{mentor.field}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-accent-300 fill-current" />
                        <span className="text-xs">{mentor.rating}</span>
                      </div>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        mentor.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-primary-400">
                  Recent Activities
                </h3>
                <Link
                  to="/student/activity"
                  className="text-accent-300 hover:text-accent-400 transition-colors text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div
                    key={`side-${activity.id}`}
                    className="p-3 border border-accent-100 rounded-xl hover:bg-accent-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-white ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-primary-400 text-sm mb-1">{activity.title}</h4>
                        <p className="text-xs text-primary-300">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <p className="text-sm text-primary-300">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
