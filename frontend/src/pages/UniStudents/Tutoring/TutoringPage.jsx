import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Clock,
  Video,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Star,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useChatContext } from "../../../context/ChatContext";
import { tutoringAPI } from "../../../utils/tutoringAPI";
import { joinTutoringVideoCall } from "../../../utils/tutoringVideoCallAPI";
import RescheduleSessionModal from "./RescheduleSessionModal";
import CompleteBookingModal from "./CompleteBookingModal";

export default function Tutoring() {
  const navigate = useNavigate();
  const { openChat } = useChatContext();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [stats, setStats] = useState({
    total_bookings: 0,
    active_bookings: 0,
    completed_bookings: 0,
    total_sessions: 0,
    completed_sessions: 0,
    average_rating: 0,
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal states
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    session: null,
  });
  const [completeModal, setCompleteModal] = useState({
    isOpen: false,
    booking: null,
  });

  // Error state
  const [error, setError] = useState(null);

  // Tutor ID - fetched from backend using user ID
  const [tutorId, setTutorId] = useState(null);

  // Fetch tutor ID on component mount
  useEffect(() => {
    const fetchTutorId = async () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setError("User not logged in");
          return;
        }

        const user = JSON.parse(userStr);

        // Fetch tutor info using user ID
        const tutorData = await tutoringAPI.getTutorByUserId(user.user_id);
        setTutorId(tutorData.tutor.tutor_id);
      } catch (err) {
        console.error("Failed to fetch tutor ID:", err);
        setError(err.message || "Failed to load tutor information");
        setLoading(false);
      }
    };

    fetchTutorId();
  }, []);

  // Fetch data when tutorId is available
  useEffect(() => {
    if (tutorId) {
      fetchData();
    }
  }, [tutorId]);

  const fetchData = async () => {
    if (!tutorId) {
      console.log("Tutor ID not available yet");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch upcoming sessions, completed sessions, and stats
      const [upcomingData, completedData, statsData] = await Promise.allSettled(
        [
          tutoringAPI.getTutorSessions(tutorId, "upcoming"),
          tutoringAPI.getTutorSessions(tutorId, "completed"),
          tutoringAPI.getTutorStats(tutorId),
        ]
      );

      // Handle upcoming sessions
      if (upcomingData.status === "fulfilled") {
        setUpcomingSessions(upcomingData.value.sessions || []);
      } else {
        console.warn("Failed to fetch upcoming sessions:", upcomingData.reason);
        setUpcomingSessions([]);
      }

      // Handle completed sessions
      if (completedData.status === "fulfilled") {
        setCompletedSessions(completedData.value.sessions || []);
      } else {
        console.warn(
          "Failed to fetch completed sessions:",
          completedData.reason
        );
        setCompletedSessions([]);
      }

      // Handle stats
      if (statsData.status === "fulfilled") {
        setStats(
          statsData.value.stats || {
            total_bookings: 0,
            active_bookings: 0,
            completed_bookings: 0,
            total_sessions: 0,
            completed_sessions: 0,
            average_rating: 0,
          }
        );
      } else {
        console.warn("Failed to fetch stats:", statsData.reason);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load tutoring data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (studentId, studentName) => {
    navigate(`/uni-student/student-profile/${studentId}`, {
      state: { studentName },
    });
  };

  const handleMessage = (studentId, studentName) => {
    openChat({
      userId: studentId,
      userName: studentName,
      userType: "student",
    });
  };

  const handleJoinVideoCall = async (bookingId) => {
    try {
      setError(null);
      // Join tutoring video call - opens in new window
      // tutorId is already available in state
      await joinTutoringVideoCall(bookingId, tutorId, "tutor");
    } catch (err) {
      console.error("Error joining tutoring video call:", err);
      setError("Failed to join tutoring video call. Please try again.");
      alert("Failed to join video call. Please try again.");
    }
  };

  const handleRescheduleSession = (session) => {
    setRescheduleModal({
      isOpen: true,
      session,
    });
  };

  const handleCompleteBooking = (session) => {
    // Group sessions by booking_id to get all sessions for this booking
    const bookingSessions = upcomingSessions.filter(
      (s) => s.booking_id === session.booking_id
    );

    setCompleteModal({
      isOpen: true,
      booking: {
        booking_id: session.booking_id,
        student_name: session.student_name,
        subject: session.subject,
        sessions_total: session.sessions_total,
        sessions_completed: session.sessions_completed,
        all_sessions: bookingSessions,
      },
    });
  };

  const confirmRescheduleSession = async (rescheduleData) => {
    try {
      setActionLoading(true);
      await tutoringAPI.rescheduleSession(
        rescheduleData.booking_id,
        rescheduleData
      );

      setSuccessMessage("Session rescheduled successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh data
      await fetchData();

      setRescheduleModal({ isOpen: false, session: null });
    } catch (error) {
      console.error("Failed to reschedule session:", error);
      alert(error.message || "Failed to reschedule session. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmCompleteBooking = async (bookingId) => {
    try {
      setActionLoading(true);
      await tutoringAPI.completeBooking(bookingId);

      setSuccessMessage("Booking marked as completed!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh data
      await fetchData();

      setCompleteModal({ isOpen: false, booking: null });
    } catch (error) {
      console.error("Failed to complete booking:", error);
      alert(error.message || "Failed to complete booking. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkSessionComplete = async (session) => {
    try {
      setActionLoading(true);
      await tutoringAPI.markSessionCompleted(session.booking_id);

      setSuccessMessage("Session marked as completed!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Failed to mark session as completed:", error);
      alert(
        error.message ||
          "Failed to mark session as completed. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const statusColors = {
    scheduled: "bg-success/20 text-success border-success/30",
    completed: "bg-neutral-silver text-neutral-grey border-neutral-light-grey",
    expired: "bg-error/20 text-error border-error/30",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-grey">Loading tutoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-grey">
                    Active Bookings
                  </p>
                  <p className="text-2xl font-bold text-primary-900 mt-1">
                    {stats.active_bookings}
                  </p>
                </div>
                <div className="bg-primary-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-grey">
                    Total Sessions
                  </p>
                  <p className="text-2xl font-bold text-primary-900 mt-1">
                    {stats.total_sessions}
                  </p>
                </div>
                <div className="bg-accent-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-accent-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-grey">
                    Completed Sessions
                  </p>
                  <p className="text-2xl font-bold text-primary-900 mt-1">
                    {stats.completed_sessions}
                  </p>
                </div>
                <div className="bg-success/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-grey">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-primary-900 mt-1">
                    {stats.average_rating.toFixed(1)}
                  </p>
                </div>
                <div className="bg-warning/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className=" rounded-lg shadow-sm border border-accent-100 mb-3">
          <div className="flex border-b border-accent-100">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === "upcoming"
                  ? "border-primary-500 text-primary-600 border-b "
                  : "border-transparent text-neutral-grey hover:text-neutral-black"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Sessions</span>
                <span className="bg-primary-100 text-primary-400 px-2 py-1 rounded-full text-xs">
                  {
                    upcomingSessions.filter((s) => s.status === "scheduled")
                      .length
                  }
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === "completed"
                  ? "border-primary-500 text-primary-600 "
                  : "border-transparent text-neutral-grey hover:text-neutral-black"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Completed Sessions</span>
                <span className="bg-accent-100 text-accent-400 px-2 py-1 rounded-full text-xs">
                  {completedSessions.length}
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          {/* <div className="p-4 border-b border-accent-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
              <input
                type="text"
                placeholder="Search by student name, subject, or topic..."
                className="w-full pl-10 pr-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div> */}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "upcoming" && (
            <UpcomingSessionsTab
              sessions={upcomingSessions.filter((s) => {
                const term = searchTerm.toLowerCase();
                return (
                  s.student_name.toLowerCase().includes(term) ||
                  s.subject.toLowerCase().includes(term) ||
                  (s.topic && s.topic.toLowerCase().includes(term))
                );
              })}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
              onJoinVideoCall={handleJoinVideoCall}
              onReschedule={handleRescheduleSession}
              onComplete={handleCompleteBooking}
              onMarkSessionComplete={handleMarkSessionComplete}
            />
          )}

          {activeTab === "completed" && (
            <CompletedSessionsTab
              sessions={completedSessions.filter((s) => {
                const term = searchTerm.toLowerCase();
                return (
                  s.student_name.toLowerCase().includes(term) ||
                  s.subject.toLowerCase().includes(term) ||
                  (s.topic && s.topic.toLowerCase().includes(term))
                );
              })}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
            />
          )}
        </AnimatePresence>
      </div>
      {/* Modals */}
      <RescheduleSessionModal
        isOpen={rescheduleModal.isOpen}
        session={rescheduleModal.session}
        onClose={() => setRescheduleModal({ isOpen: false, session: null })}
        onConfirm={confirmRescheduleSession}
        loading={actionLoading}
      />
      <CompleteBookingModal
        isOpen={completeModal.isOpen}
        booking={completeModal.booking}
        onClose={() => setCompleteModal({ isOpen: false, booking: null })}
        onConfirm={confirmCompleteBooking}
        loading={actionLoading}
      />
    </motion.div>
  );
}

// Upcoming Sessions Tab Component
function UpcomingSessionsTab({
  sessions,
  onViewProfile,
  onMessage,
  onJoinVideoCall,
  onReschedule,
  onComplete,
  onMarkSessionComplete,
}) {
  const [expandedBookings, setExpandedBookings] = useState({});

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-12 w-12 text-primary-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            No Upcoming Sessions
          </h3>
          <p className="text-primary-300">
            You don't have any upcoming tutoring sessions scheduled.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group sessions by booking and sort by date
  const bookingGroups = {};
  sessions.forEach((session) => {
    if (!bookingGroups[session.booking_id]) {
      bookingGroups[session.booking_id] = [];
    }
    bookingGroups[session.booking_id].push(session);
  });

  // Sort each booking's sessions: incomplete first, then by date (soonest first)
  Object.keys(bookingGroups).forEach((bookingId) => {
    bookingGroups[bookingId].sort((a, b) => {
      // First, prioritize incomplete sessions (scheduled/expired) over completed
      const aIsComplete = a.status === "completed";
      const bIsComplete = b.status === "completed";

      if (aIsComplete !== bIsComplete) {
        return aIsComplete ? 1 : -1; // Incomplete sessions first
      }

      // Within the same completion status, sort by date (soonest first)
      return new Date(a.date) - new Date(b.date);
    });
  });

  // Sort bookings by their first incomplete session date, or first session if all complete
  const sortedBookingEntries = Object.entries(bookingGroups).sort((a, b) => {
    // Find first incomplete session for each booking
    const firstIncompleteA =
      a[1].find((s) => s.status !== "completed") || a[1][0];
    const firstIncompleteB =
      b[1].find((s) => s.status !== "completed") || b[1][0];

    // Compare by date
    return new Date(firstIncompleteA.date) - new Date(firstIncompleteB.date);
  });

  const toggleExpanded = (bookingId) => {
    setExpandedBookings((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  return (
    <div className="space-y-6">
      {sortedBookingEntries.map(([bookingId, bookingSessions]) => {
        const firstSession = bookingSessions[0];
        const allCompleted = bookingSessions.every(
          (s) => s.status === "completed"
        );
        const canComplete =
          firstSession.sessions_completed === firstSession.sessions_total;
        const isExpanded = expandedBookings[bookingId] || false;
        const displayedSessions = isExpanded
          ? bookingSessions
          : bookingSessions.slice(0, 1);

        return (
          <Card key={bookingId} className="hover:shadow-lg transition-shadow">
            <CardHeader className=" border-b border-accent-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={firstSession.student_picture || "/default-avatar.png"}
                    alt={firstSession.student_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <CardTitle className="text-lg text-primary-900">
                      {firstSession.student_name}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {firstSession.subject}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {firstSession.sessions_completed}/
                        {firstSession.sessions_total} sessions
                      </span>
                      <span className="text-xs  px-2 py-1 rounded-full">
                        {firstSession.payment_type}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onMessage(
                        firstSession.student_id,
                        firstSession.student_name
                      )
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onViewProfile(
                        firstSession.student_id,
                        firstSession.student_name
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button> */}
                  {canComplete && (
                    <Button
                      size="sm"
                      onClick={() => onComplete(firstSession)}
                      className="text-success hover:bg-success/10"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete Package
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {displayedSessions.map((session) => (
                  <div
                    key={`${session.booking_id}-${session.session_number}`}
                    className={`p-4 rounded-lg border ${
                      session.status === "completed"
                        ? "bg-success/5 border-success/20"
                        : session.is_expired
                        ? "bg-error/5 border-error/20"
                        : "bg-white border-accent-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-primary-900">
                            Session {session.session_number}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === "completed"
                                ? "bg-success/20 text-success"
                                : session.is_expired
                                ? "bg-error/20 text-error"
                                : "bg-primary-100 text-primary-400"
                            }`}
                          >
                            {session.status === "completed"
                              ? "Completed"
                              : session.is_expired
                              ? "Expired"
                              : "Scheduled"}
                          </span>
                          {session.is_rescheduled && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning flex items-center">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Rescheduled
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-grey">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(session.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.start_time} - {session.end_time}
                          </span>
                        </div>
                        {session.topic && (
                          <p className="text-sm text-neutral-grey mt-2">
                            <span className="font-medium">Topic:</span>{" "}
                            {session.topic}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.status === "scheduled" &&
                          !session.is_expired && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  onJoinVideoCall(session.booking_id)
                                }
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join Video Meeting
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onMarkSessionComplete(session)}
                                className="text-success hover:bg-success/10"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark Complete
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onReschedule(session)}
                              >
                                Reschedule
                              </Button>
                            </>
                          )}
                        {session.is_expired && (
                          <Button variant="outline" size="sm" disabled>
                            <XCircle className="h-4 w-4 mr-1" />
                            Expired
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show/Hide Toggle */}
                {bookingSessions.length > 1 && (
                  <button
                    onClick={() => toggleExpanded(bookingId)}
                    className="w-full py-2 text-sm text-primary-400 hover:text-primary-600 font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show Less</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Show All {bookingSessions.length} Sessions</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Completed Sessions Tab Component
function CompletedSessionsTab({ sessions, onViewProfile, onMessage }) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CheckCircle className="h-12 w-12 text-primary-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            No Completed Sessions
          </h3>
          <p className="text-primary-300">
            You haven't completed any tutoring sessions yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group sessions by booking
  const bookingGroups = {};
  sessions.forEach((session) => {
    if (!bookingGroups[session.booking_id]) {
      bookingGroups[session.booking_id] = [];
    }
    bookingGroups[session.booking_id].push(session);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {Object.entries(bookingGroups).map(([bookingId, bookingSessions]) => {
        const firstSession = bookingSessions[0];

        return (
          <Card
            key={bookingId}
            className="hover:shadow-lg transition-shadow opacity-90"
          >
            <CardHeader className="border-b border-accent-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={firstSession.student_picture || "/default-avatar.png"}
                    alt={firstSession.student_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <CardTitle className="text-lg text-primary-900">
                      {firstSession.student_name}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {firstSession.subject}
                      </span>
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-success" />
                        {firstSession.sessions_total} sessions completed
                      </span>
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onMessage(
                        firstSession.student_id,
                        firstSession.student_name
                      )
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onViewProfile(
                        firstSession.student_id,
                        firstSession.student_name
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button> */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                {bookingSessions.map((session) => (
                  <div
                    key={`${session.booking_id}-${session.session_number}`}
                    className="p-3 rounded-lg bg-success/5 border border-success/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-primary-900">
                            Session {session.session_number}
                          </span>
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-primary-300">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(session.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.start_time} - {session.end_time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </motion.div>
  );
}
