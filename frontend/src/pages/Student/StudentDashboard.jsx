import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import { getCurrentUser } from "../../utils/auth";
import { joinMentoringVideoCall } from "../../utils/videoCallAPI";
import StarRating from "../../components/StarRating";
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
  Video,
} from "lucide-react";

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mentoring'); // 'mentoring' or 'tutoring'
  
  // Rating modal state
  const [ratingModal, setRatingModal] = useState(null);
  
  // Tutoring states
  const [tutoringGrouped, setTutoringGrouped] = useState({ 
    pending: [], 
    confirmed: [], 
    completed: [], 
    cancelled: [] 
  });
  const [upcomingTutoringSessions, setUpcomingTutoringSessions] = useState([]);

  useEffect(() => {
    fetchStudentProfile();

    // Listen for profile update events
    const handleProfileUpdate = () => {
      console.log("Dashboard: Profile updated, refreshing data...");
      fetchStudentProfile();
    };

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Dashboard: Page became visible, refreshing data...");
        fetchStudentProfile();
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.user_id) {
          fetchGroupedMentoringRequests(currentUser.user_id);
          fetchUpcomingSessions(currentUser.user_id);
          fetchUpcomingRequests(currentUser.user_id);
        }
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Handle joining video call for mentoring sessions
  const handleJoinVideoCall = (sessionId) => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.user_id) {
      alert("Please log in to join the video call");
      return;
    }

    // Call the joinMentoringVideoCall function with student role
    joinMentoringVideoCall(sessionId, currentUser.user_id, "student");
  };

  // Handle submitting feedback for a completed mentoring session
  const submitMentoringFeedback = async () => {
    if (!ratingModal) return;
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.user_id) {
      alert("Please log in to submit feedback");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/mentoring/sessions/feedback/submit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: ratingModal.sessionId,
          student_id: studentProfile.studentId,
          rating: ratingModal.rating,
          feedback: ratingModal.feedback
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Thank you for your feedback! 🌟');
        setRatingModal(null);
        
        // Refresh the mentoring requests to update the UI
        if (currentUser && currentUser.user_id) {
          fetchGroupedMentoringRequests(currentUser.user_id);
        }
      } else {
        alert(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  // Poll upcoming sessions every 30 seconds when studentProfile exists
  // useEffect(() => {
  //   let intervalId = null;
  //   const currentUser = getCurrentUser();
  //   if (studentProfile && currentUser && currentUser.user_id) {
  //     // initial fetch
  //     fetchUpcomingSessions(currentUser.user_id);
  //     fetchUpcomingRequests(currentUser.user_id);
  //     intervalId = setInterval(() => {
  //       fetchUpcomingSessions(currentUser.user_id);
  //       fetchUpcomingRequests(currentUser.user_id);
  //     }, 30000);
  //   }
  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [studentProfile]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = getCurrentUser();

      if (!currentUser || !currentUser.user_id) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      console.log("Dashboard: Fetching profile for user:", currentUser.user_id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/students/profile/?user_id=${currentUser.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dashboard: Profile data received:", data);

      if (data.success) {
        // Process the data for dashboard display
        const profileData = {
          name:
            data.student_data.full_name ||
            data.student_data.username ||
            "Student Name",
          email: data.student_data.email,
          alStream: data.student_data.current_stage || "Not specified",
          subjects: [], // You can add this later from another table
          zScore: null, // You can add this later from results table
          district:
            data.student_data.district ||
            data.student_data.location ||
            "Not specified",
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
          studentId: data.student_data.student_id, // Store student_id for tutoring bookings
        };

        setStudentProfile(profileData);

        // After profile is set, fetch mentoring sessions and tutoring bookings for this student
        try {
          const currentUserId = currentUser.user_id;
          fetchGroupedMentoringRequests(currentUserId);
          
          // Fetch tutoring bookings if student_id is available
          if (data.student_data.student_id) {
            fetchTutoringBookings(data.student_data.student_id);
          }
        } catch (e) {
          console.warn("Dashboard: failed to fetch sessions", e);
        }
      } else {
        setError(data.message || "Failed to load profile data");
      }
    } catch (error) {
      console.error("Dashboard: Error fetching student profile:", error);
      setError(
        "Failed to connect to server. Please check if the backend is running."
      );
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
      data.school,
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Seed recent activities with static entries; mentoring sessions will be merged in when fetched
  useEffect(() => {
    setRecentActivities([
      {
        id: "seed-1",
        type: "mentor",
        title: "New message from Dr. Samantha Silva",
        description: "Regarding your engineering career path inquiry",
        time: "2 hours ago",
        icon: MessageCircle,
        color: "text-blue-500",
      },
      {
        id: "seed-2",
        type: "news",
        title: "University of Colombo announces new programs",
        description: "New Engineering Faculty to open in 2025",
        time: "1 day ago",
        icon: Newspaper,
        color: "text-green-500",
      },
      {
        id: "seed-3",
        type: "recommendation",
        title: "New degree recommendation available",
        description: "Bachelor of Computer Science - University of Moratuwa",
        time: "2 days ago",
        icon: Star,
        color: "text-purple-500",
      },
      {
        id: "seed-4",
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
      const res = await fetch(
        `http://127.0.0.1:8000/api/mentoring/sessions/?student_id=${studentId}`
      );
      if (!res.ok) {
        console.warn(
          "Dashboard: mentoring sessions endpoint returned",
          res.status
        );
        return;
      }
      const payload = await res.json();
      const sessions = Array.isArray(payload.sessions)
        ? payload.sessions
        : payload || [];

      // Filter accepted sessions and map to recent activity items
      const accepted = sessions
        .filter((s) => {
          // handle different backend field names conservatively
          return (
            s.status === "accepted" ||
            s.is_accepted === true ||
            s.state === "accepted"
          );
        })
        .map((s) => ({
          id: `ment-${s.id}`,
          type: "mentor",
          title:
            s.mentor && (s.mentor.full_name || s.mentor.name)
              ? `Mentor ${
                  s.mentor.full_name || s.mentor.name
                } accepted your session`
              : "Mentor accepted your session",
          description:
            s.subject ||
            s.topic ||
            s.note ||
            (s.mentor
              ? `Session with ${s.mentor.full_name || s.mentor.name}`
              : ""),
          time: s.scheduled_time || s.start_time || s.date || "Scheduled",
          icon: UserPlus || MessageCircle,
          color: "text-green-500",
        }));

      if (accepted.length > 0) {
        // Prepend accepted mentoring sessions to recent activities
        setRecentActivities((prev) => [...accepted, ...prev]);
      }
    } catch (err) {
      console.warn("Dashboard: error fetching mentoring sessions", err);
    }
  };

  // Fetch mentoring requests grouped by status from student endpoint
  const [mentoringGrouped, setMentoringGrouped] = useState({ pending: [], declined: [], completed: [] });
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  const fetchGroupedMentoringRequests = async (studentId) => {
    if (!studentId) return;
    setSessionsLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/students/mentoring/requests-grouped/?user_id=${studentId}`
      );
      if (!res.ok) {
        console.warn(
          "Dashboard: mentoring requests grouped endpoint returned",
          res.status
        );
        setSessionsLoading(false);
        return;
      }
      const payload = await res.json();
      if (payload && payload.success) {
        // prefer explicit declined list from backend; otherwise infer from completed items
        const declinedFromPayload = Array.isArray(payload.declined) ? payload.declined : [];
        const completedFromPayload = Array.isArray(payload.completed) ? payload.completed : [];
        const inferredDeclined = declinedFromPayload.length > 0 ? declinedFromPayload : completedFromPayload.filter((x) => x.status === 'declined' || x.decline_reason);
        const acceptedFromPayload = Array.isArray(payload.accepted) ? payload.accepted : [];

        // Store only pending, declined, and completed in the tab view (exclude accepted)
        setMentoringGrouped({
          pending: Array.isArray(payload.pending) ? payload.pending : [],
          declined: inferredDeclined,
          completed: completedFromPayload,
        });

        // Move accepted requests to upcoming sessions
        setUpcomingSessions(acceptedFromPayload);

        // Merge accepted mentoring requests into recent activities (keep existing seed items)
        const acceptedItems = acceptedFromPayload.map((r) => ({
          id: `req-${r.id}`,
          type: "mentor",
          title: r.mentor
            ? `${r.mentor} accepted your request`
            : "Mentor accepted your request",
          description: r.subject || "Mentoring request",
          time:
            r.preferred_time ||
            (r.created_at
              ? new Date(r.created_at).toLocaleString()
              : "Scheduled"),
          icon: UserPlus,
          color: "text-green-500",
        }));

        if (acceptedItems.length > 0) {
          setRecentActivities((prev) => [...acceptedItems, ...prev]);
        }
      }
    } catch (err) {
      console.warn("Dashboard: error fetching grouped mentoring requests", err);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Fetch upcoming scheduled sessions
  const fetchUpcomingSessions = async (studentId) => {
    if (!studentId) return;
    setUpcomingLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/students/mentoring/upcoming/?user_id=${studentId}`
      );
      if (!res.ok) {
        console.warn(
          "Dashboard: upcoming sessions endpoint returned",
          res.status
        );
        setUpcomingLoading(false);
        return;
      }
      const payload = await res.json();
      if (payload && payload.success) {
        const upcoming = Array.isArray(payload.upcoming)
          ? payload.upcoming
          : [];
        setUpcomingSessions(upcoming);
        // Merge upcoming sessions into recent activities (dedupe by id)
        mergeUpcomingIntoRecent(upcoming);
      }
    } catch (err) {
      console.warn("Dashboard: error fetching upcoming sessions", err);
    } finally {
      setUpcomingLoading(false);
    }
  };

  // Fetch upcoming mentoring requests (status='scheduled') from mentoring_requests
  const fetchUpcomingRequests = async (studentId) => {
    if (!studentId) return;
    setUpcomingLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/students/mentoring/upcoming-requests/?user_id=${studentId}`
      );
      if (!res.ok) {
        console.warn(
          "Dashboard: upcoming requests endpoint returned",
          res.status
        );
        setUpcomingLoading(false);
        return;
      }
      const payload = await res.json();
      if (payload && payload.success) {
        // prefer requests if present
        const upcoming = Array.isArray(payload.upcoming)
          ? payload.upcoming
          : [];
        setUpcomingSessions(upcoming);
        // Merge upcoming requested sessions into recent activities (dedupe)
        mergeUpcomingIntoRecent(upcoming);
      }
    } catch (err) {
      console.warn("Dashboard: error fetching upcoming requests", err);
    } finally {
      setUpcomingLoading(false);
    }
  };

  // Merge upcoming sessions into recentActivities sidebar (dedupe)
  const mergeUpcomingIntoRecent = (upcomingArr) => {
    if (!Array.isArray(upcomingArr) || upcomingArr.length === 0) return;
    setRecentActivities((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const newItems = upcomingArr
        .map((s) => ({
          id: `up-${s.id}`,
          type: "mentor",
          title: s.topic || "Mentoring Session",
          description: `With ${s.mentor || "Mentor"}`,
          time: s.scheduled_at
            ? new Date(s.scheduled_at).toLocaleString()
            : s.session_date
            ? new Date(s.session_date).toLocaleString()
            : "Scheduled",
          icon: Calendar,
          color: "text-blue-500",
        }))
        .filter((item) => !existingIds.has(item.id));

      if (newItems.length === 0) return prev;
      return [...newItems, ...prev];
    });
  };

  // Fetch tutoring bookings for the student
  const fetchTutoringBookings = async (studentId) => {
    if (!studentId) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/tutoring/bookings/student/${studentId}/`
      );
      if (!res.ok) {
        console.warn('Dashboard: tutoring bookings endpoint returned', res.status);
        return;
      }
      const payload = await res.json();
      if (payload && payload.status === 'success') {
        const bookings = Array.isArray(payload.bookings) ? payload.bookings : [];
        
        // Get upcoming tutoring sessions (confirmed bookings with future dates)
        const now = new Date();
        const upcoming = bookings.filter(b => {
          if (b.status === 'confirmed' && b.start_date) {
            const sessionDate = new Date(b.start_date);
            return sessionDate >= now;
          }
          return false;
        });
        setUpcomingTutoringSessions(upcoming);

        // Filter out upcoming bookings from the confirmed list shown in the tab
        const confirmedNotUpcoming = bookings.filter(b => {
          if (b.status === 'confirmed' && b.start_date) {
            const sessionDate = new Date(b.start_date);
            return sessionDate < now; // Only past confirmed sessions
          }
          return b.status === 'confirmed' && !b.start_date; // Include confirmed without dates
        });

        // Group tutoring bookings by status (excluding upcoming from confirmed)
        const pending = bookings.filter(b => b.status === 'pending');
        const completed = bookings.filter(b => b.status === 'completed');
        const cancelled = bookings.filter(b => b.status === 'cancelled');
        
        setTutoringGrouped({
          pending,
          confirmed: confirmedNotUpcoming,
          completed,
          cancelled
        });
      }
    } catch (err) {
      console.warn('Dashboard: error fetching tutoring bookings', err);
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
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary-400" />
              <p className="text-lg text-primary-400">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="max-w-md p-6 mx-auto border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
              <p className="mb-4 text-red-600">{error}</p>
              <button
                onClick={fetchStudentProfile}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
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
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
        <StudentNavigation />
        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-600">No profile data available</p>
            <Link
              to="/student/profile-setup"
              className="inline-block px-6 py-2 mt-4 text-white rounded bg-primary-600 hover:bg-primary-700"
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
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="p-8 mb-8 text-white bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold font-display">
                Welcome back, {studentProfile.name}!
              </h1>
              <p className="mb-4 text-primary-100">
                Ready to explore your university options?
              </p>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="text-lg font-bold">
                    {studentProfile.profileComplete}%
                  </div>
                  <div className="text-sm text-primary-100">
                    Profile Complete
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              {studentProfile.profileComplete < 100 && (
                <Link
                  to="/student/edit-profile"
                  className="inline-flex items-center px-6 py-3 space-x-2 font-semibold transition-all bg-accent-200 text-primary-600 rounded-xl hover:bg-accent-300"
                >
                  <Edit className="w-5 h-5" />
                  <span>Complete Profile</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="p-6 bg-white border shadow-lg rounded-2xl border-accent-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-300">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary-400">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/student/z-score-analysis"
            className="p-6 transition-all transform bg-white border shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 border-accent-100 group"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-colors bg-blue-100 rounded-full group-hover:bg-blue-200">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold font-display text-primary-400">
              Z-Score Analysis
            </h3>
            <p className="mb-4 text-sm text-primary-300">
              Assess your A/L performance and university eligibility
            </p>
            {/* <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-primary-300">Current Z-Score</p>
                <p className="text-2xl font-bold text-primary-400">
                  {studentProfile.zScore ?? 'N/A'}
                </p>
              </div>
              <div className="self-center">
                <span className="inline-flex items-center px-3 py-2 text-sm text-white bg-primary-600 rounded-xl">
                  View Analysis
                </span>
              </div>
            </div> */}
          </Link>

          <Link
            to="/student/mentors"
            className="p-6 transition-all transform bg-white border shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 border-accent-100 group"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-colors bg-purple-100 rounded-full group-hover:bg-purple-200">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold font-display text-primary-400">
              Find Mentors
            </h3>
            <p className="text-sm text-primary-300">
              Connect with university graduates and professionals
            </p>
          </Link>

          <Link
            to="/student/tutors"
            className="p-6 transition-all transform bg-white border shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 border-accent-100 group"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-colors bg-green-100 rounded-full group-hover:bg-green-200">
              <BookMarked className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold font-display text-primary-400">
              Find Tutors
            </h3>
            <p className="text-sm text-primary-300">
              Get help with your studies from qualified tutors
            </p>
          </Link>

          <Link
            to="/student/news"
            className="p-6 transition-all transform bg-white border shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 border-accent-100 group"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-colors bg-orange-100 rounded-full group-hover:bg-orange-200">
              <Newspaper className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold font-display text-primary-400">
              News Feed
            </h3>
            <p className="text-sm text-primary-300">
              Stay updated with university news and announcements
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white border shadow-lg rounded-2xl border-accent-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold font-display text-primary-400">
                  Your sessions and activities
                </h2>
                <button className="transition-colors text-accent-300 hover:text-accent-400">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs for Mentoring and Tutoring */}
              <div className="mb-6">
                <div className="flex space-x-2 border-b border-accent-200">
                  <button
                    onClick={() => setActiveTab('mentoring')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'mentoring'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-primary-300 hover:text-primary-500'
                    }`}
                  >
                    Mentoring
                  </button>
                  <button
                    onClick={() => setActiveTab('tutoring')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'tutoring'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-primary-300 hover:text-primary-500'
                    }`}
                  >
                    Tutoring
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Loading state for sessions */}
                {sessionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-400 mx-auto mb-2" />
                      <p className="text-primary-300 text-sm">
                        Loading your sessions...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Mentoring Tab Content */}
                    {activeTab === 'mentoring' && (
                      <>
                        {/* Mentoring Requests grouped by status */}
                        <div className="mb-4">
                          <h4 className="font-medium text-primary-400 mb-2">
                            Pending Requests
                          </h4>
                          {mentoringGrouped.pending.length === 0 && (
                            <p className="text-sm text-primary-300 mb-2">
                              No pending requests
                            </p>
                          )}
                          {mentoringGrouped.pending.map((r) => (
                        <div
                          key={`pending-${r.id}`}
                          className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2"
                        >
                          <div className="p-2 rounded-full bg-white text-yellow-500">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-primary-400 font-medium">
                              {r.mentor || "Mentor"}
                            </h5>
                            <p className="text-sm text-primary-300">
                              {r.subject}
                            </p>
                            <p className="text-xs text-primary-300">
                              {r.preferred_time ||
                                (r.created_at
                                  ? new Date(r.created_at).toLocaleString()
                                  : "")}
                            </p>
                          </div>
                          <div className="text-sm text-yellow-600 font-semibold">
                            Pending
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-primary-400 mb-2">
                        Completed Requests
                      </h4>
                      {mentoringGrouped.completed.length === 0 && (
                        <p className="text-sm text-primary-300 mb-2">
                          No completed requests
                        </p>
                      )}
                      {mentoringGrouped.completed.map((r) => (
                        <div
                          key={`completed-${r.id}`}
                          className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2"
                        >
                          <div className="p-2 rounded-full bg-white text-gray-500">
                            <Check className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-primary-400 font-medium">
                              {r.mentor || "Mentor"}
                            </h5>
                            <p className="text-sm text-primary-300">
                              {r.subject}
                            </p>
                            <p className="text-xs text-primary-300">
                              {r.preferred_time ||
                                (r.created_at
                                  ? new Date(r.created_at).toLocaleString()
                                  : "")}
                            </p>
                            {!r.has_feedback && r.session_id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRatingModal({
                                    sessionId: r.session_id,
                                    mentorName: r.mentor || "Mentor",
                                    subject: r.subject,
                                    rating: 5,
                                    feedback: ''
                                  });
                                }}
                                className="mt-2 flex items-center space-x-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Star className="h-3 w-3 fill-current" />
                                <span>Rate Session</span>
                              </button>
                            )}
                            {r.has_feedback && (
                              <p className="text-xs text-green-600 mt-1 flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                Feedback submitted
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 font-semibold">
                            Completed
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-primary-400 mb-2">
                        Declined Requests
                      </h4>
                      {mentoringGrouped.declined.length === 0 && (
                        <p className="text-sm text-primary-300 mb-2">
                          No declined requests
                        </p>
                      )}
                      {mentoringGrouped.declined.map((r) => (
                        <div
                          key={`declined-${r.id}`}
                          className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2"
                        >
                          <div className="p-2 rounded-full bg-white text-red-500">
                            <X className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-primary-400 font-medium">
                              {r.mentor || "Mentor"}
                            </h5>
                            <p className="text-sm text-primary-300">
                              {r.subject}
                            </p>
                            <p className="text-xs text-primary-300">
                              {r.preferred_time ||
                                (r.created_at
                                  ? new Date(r.created_at).toLocaleString()
                                  : "")}
                            </p>
                            {r.decline_reason && (
                              <p className="text-xs text-red-500 mt-1">
                                Reason: {r.decline_reason}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-red-600 font-semibold">
                            Declined
                          </div>
                        </div>
                      ))}
                    </div>
                      </>
                    )}

                    {/* Tutoring Tab Content */}
                    {activeTab === 'tutoring' && (
                      <>
                        {/* Tutoring Bookings grouped by status */}
                        <div className="mb-4">
                          <h4 className="font-medium text-primary-400 mb-2">
                            Pending Bookings
                          </h4>
                          {tutoringGrouped.pending.length === 0 && (
                            <p className="text-sm text-primary-300 mb-2">
                              No pending bookings
                            </p>
                          )}
                          {tutoringGrouped.pending.map((b) => (
                            <div
                              key={`tutor-pending-${b.booking_id}`}
                              className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2"
                            >
                              <div className="p-2 rounded-full bg-white text-yellow-500">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-primary-400 font-medium">
                                  {b.tutor_name || 'Tutor'}
                                </h5>
                                <p className="text-sm text-primary-300">
                                  {b.subject_name || b.topic || 'Subject'}
                                </p>
                                <p className="text-xs text-primary-300">
                                  Start: {b.start_date ? new Date(b.start_date).toLocaleDateString() : 'TBD'}
                                </p>
                                <p className="text-xs text-primary-300">
                                  {b.is_recurring ? `Recurring: ${b.sessions_paid || 0} sessions` : 'One-time session'}
                                </p>
                              </div>
                              <div className="text-sm text-yellow-600 font-semibold">
                                Pending
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-primary-400 mb-2">
                            Confirmed Bookings
                          </h4>
                          {tutoringGrouped.confirmed.length === 0 && (
                            <p className="text-sm text-primary-300 mb-2">
                              No confirmed bookings
                            </p>
                          )}
                          {tutoringGrouped.confirmed.map((b) => (
                            <div
                              key={`tutor-confirmed-${b.booking_id}`}
                              className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2"
                            >
                              <div className="p-2 rounded-full bg-white text-green-500">
                                <Check className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-primary-400 font-medium">
                                  {b.tutor_name || 'Tutor'}
                                </h5>
                                <p className="text-sm text-primary-300">
                                  {b.subject_name || b.topic || 'Subject'}
                                </p>
                                <p className="text-xs text-primary-300">
                                  Start: {b.start_date ? new Date(b.start_date).toLocaleDateString() : 'TBD'}
                                </p>
                                <p className="text-xs text-primary-300">
                                  {b.is_recurring && `${b.sessions_completed || 0}/${b.sessions_paid || 0} sessions completed`}
                                </p>
                              </div>
                              <div className="text-sm text-green-600 font-semibold">
                                Confirmed
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-primary-400 mb-2">
                            Completed Bookings
                          </h4>
                          {tutoringGrouped.completed.length === 0 && (
                            <p className="text-sm text-primary-300 mb-2">
                              No completed bookings
                            </p>
                          )}
                          {tutoringGrouped.completed.map((b) => (
                            <div
                              key={`tutor-completed-${b.booking_id}`}
                              className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2"
                            >
                              <div className="p-2 rounded-full bg-white text-gray-500">
                                <Check className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-primary-400 font-medium">
                                  {b.tutor_name || 'Tutor'}
                                </h5>
                                <p className="text-sm text-primary-300">
                                  {b.subject_name || b.topic || 'Subject'}
                                </p>
                                <p className="text-xs text-primary-300">
                                  Completed: {b.end_date ? new Date(b.end_date).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-xs text-primary-300">
                                  {b.sessions_completed || 0} sessions completed
                                </p>
                              </div>
                              <div className="text-sm text-gray-600 font-semibold">
                                Completed
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-primary-400 mb-2">
                            Cancelled Bookings
                          </h4>
                          {tutoringGrouped.cancelled.length === 0 && (
                            <p className="text-sm text-primary-300 mb-2">
                              No cancelled bookings
                            </p>
                          )}
                          {tutoringGrouped.cancelled.map((b) => (
                            <div
                              key={`tutor-cancelled-${b.booking_id}`}
                              className="flex items-start space-x-4 p-3 bg-accent-50 rounded-xl mb-2"
                            >
                              <div className="p-2 rounded-full bg-white text-red-500">
                                <X className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-primary-400 font-medium">
                                  {b.tutor_name || 'Tutor'}
                                </h5>
                                <p className="text-sm text-primary-300">
                                  {b.subject_name || b.topic || 'Subject'}
                                </p>
                                <p className="text-xs text-primary-300">
                                  Cancelled on: {b.updated_at ? new Date(b.updated_at).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <div className="text-sm text-red-600 font-semibold">
                                Cancelled
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start p-4 space-x-4 transition-colors cursor-pointer bg-accent-50 rounded-xl hover:bg-accent-100"
                    >
                      <div
                        className={`p-2 rounded-full bg-white ${activity.color}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-400">
                          {activity.title}
                        </h3>
                        <p className="mb-1 text-sm text-primary-300">
                          {activity.description}
                        </p>
                        <p className="text-xs text-primary-300">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })} */}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Mentors */}
            {/* <div className="p-6 bg-white border shadow-lg rounded-2xl border-accent-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold font-display text-primary-400">
                  Featured Mentors
                </h3>
                <Link
                  to="/student/mentors"
                  className="text-sm transition-colors text-accent-300 hover:text-accent-400"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {featuredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center p-3 space-x-3 transition-colors cursor-pointer rounded-xl hover:bg-accent-50"
                  >
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="object-cover w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-primary-400">
                        {mentor.name}
                      </h4>
                      <p className="text-xs text-primary-300">{mentor.field}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current text-accent-300" />
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
            <div className="p-6 bg-white border shadow-lg rounded-2xl border-accent-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold font-display text-primary-400">
                  Upcoming {activeTab === 'mentoring' ? 'Mentoring' : 'Tutoring'} Sessions
                </h3>
              </div>
              <div className="space-y-3">
                {upcomingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-400 mx-auto mb-2" />
                      <p className="text-primary-300 text-sm">
                        Loading sessions...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'mentoring' && (
                      <>
                        {upcomingSessions.length === 0 && (
                          <p className="text-sm text-primary-300">
                            No upcoming mentoring sessions
                          </p>
                        )}
                        {upcomingSessions.slice(0, 5).map((s) => (
                          <div
                            key={`side-up-${s.id}`}
                            className="p-3 border border-accent-100 rounded-xl hover:bg-accent-50 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full bg-white text-blue-500`}>
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-primary-400 text-sm mb-1">{`Session with ${
                                  s.mentor || "Mentor"
                                }`}</h4>
                                <p className="text-xs text-primary-300">
                                  {s.session_date
                                    ? new Date(s.session_date).toLocaleString()
                                    : s.scheduled_at
                                    ? new Date(s.scheduled_at).toLocaleString()
                                    : ""}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinVideoCall(s.id);
                                  }}
                                  className="mt-2 flex items-center space-x-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  <Video className="h-3 w-3" />
                                  <span>Join Video Meeting</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {activeTab === 'tutoring' && (
                      <>
                        {upcomingTutoringSessions.length === 0 && (
                          <p className="text-sm text-primary-300">
                            No upcoming tutoring sessions
                          </p>
                        )}
                        {upcomingTutoringSessions.slice(0, 5).map((b) => (
                          <div
                            key={`side-tutor-${b.booking_id}`}
                            className="p-3 border border-accent-100 rounded-xl hover:bg-accent-50 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full bg-white text-green-500`}>
                                <BookMarked className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-primary-400 text-sm mb-1">
                                  {`${b.subject_name || b.topic || 'Subject'} with ${b.tutor_name || 'Tutor'}`}
                                </h4>
                                <p className="text-xs text-primary-300">
                                  {b.start_date ? new Date(b.start_date).toLocaleDateString() : 'TBD'}
                                </p>
                                {b.is_recurring && (
                                  <p className="text-xs text-primary-300">
                                    {`${b.sessions_completed || 0}/${b.sessions_paid || 0} sessions`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary-600">Rate Mentoring Session</h3>
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
              <div className="bg-accent-50 p-3 rounded-lg">
                <p className="text-sm text-primary-400 font-medium">{ratingModal.mentorName}</p>
                <p className="text-xs text-primary-300">{ratingModal.subject}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">How would you rate this session?</p>
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
                  Share your feedback (optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  rows={4}
                  placeholder="How was your mentoring session? What did you learn?"
                  value={ratingModal.feedback}
                  onChange={(e) => setRatingModal({ ...ratingModal, feedback: e.target.value })}
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
                  onClick={submitMentoringFeedback}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-lg"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;