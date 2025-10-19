import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Star,
  User,
  BookOpen,
  Target,
  AlertCircle,
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
import { mentoringAPI } from "../../../utils/mentoringAPI";
import { joinMentoringVideoCall } from "../../../utils/videoCallAPI";
import {
  DeclineModal,
  CancelSessionModal,
  AcceptRequestModal,
  RescheduleModal,
} from "../../../components/mentoring/MentoringModals";

export default function Mentoring() {
  const navigate = useNavigate();
  const { openChat } = useChatContext();
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [mentoringRequests, setMentoringRequests] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedSessions: 0,
    completedSessions: 0,
    averageRating: 4.8,
    responseRate: 95,
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [completingSessionId, setCompletingSessionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal states
  const [declineModal, setDeclineModal] = useState({
    isOpen: false,
    requestId: null,
  });
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    sessionId: null,
  });
  const [acceptModal, setAcceptModal] = useState({
    isOpen: false,
    request: null,
  });
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    session: null,
  });

  // Error state
  const [error, setError] = useState(null);

  // TODO: Get mentor ID from authentication context
  const MENTOR_ID = 1; // This should come from auth context

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear existing data first
      setMentoringRequests([]);
      setUpcomingSessions([]);
      setCompletedSessions([]);

      // Try to fetch requests and sessions
      const [requestsData, sessionsData, statsData] = await Promise.allSettled([
        mentoringAPI.getRequests(MENTOR_ID),
        mentoringAPI.getSessions(MENTOR_ID),
        mentoringAPI.getStats(MENTOR_ID),
      ]);

      // Handle requests
      if (requestsData.status === "fulfilled") {
        const requests = requestsData.value.requests || [];

        // Keep ALL requests for filtering, but separate scheduled ones for upcoming sessions
        setMentoringRequests(requests);

        // Convert scheduled requests to upcoming sessions format
        const scheduledSessions = requests
          .filter((req) => req.status === "scheduled" && req.session_id)
          .map((req) => ({
            id: req.session_id,
            student_id: req.student_id,
            student: req.student,
            topic: req.topic,
            scheduled_at: req.scheduled_date,
            duration_minutes: req.duration_minutes || 60,
            status: "scheduled",
            location: req.location,
            meeting_link: req.meeting_link,
            avatar: req.avatar,
            session_type: req.session_type,
          }));

        setUpcomingSessions(scheduledSessions);
      } else {
        console.warn("Failed to fetch requests:", requestsData.reason);
        setMentoringRequests([]);
      }

      // Handle sessions
      if (sessionsData.status === "fulfilled") {
        const sessions = sessionsData.value.sessions || [];
        const upcomingSessions = sessions.filter(
          (session) =>
            session.status && session.status.toLowerCase() === "scheduled"
        );
        const completedSessions = sessions.filter(
          (session) =>
            session.status && session.status.toLowerCase() === "completed"
        );

        // Merge with scheduled sessions from requests (avoid duplicates)
        setUpcomingSessions((prev) => {
          const existingIds = prev.map((s) => s.id);
          const newSessions = upcomingSessions.filter(
            (s) => !existingIds.includes(s.id)
          );
          return [...prev, ...newSessions];
        });

        setCompletedSessions(completedSessions);
      } else {
        console.warn("Failed to fetch sessions:", sessionsData.reason);
        // Fallback: try to get all sessions (including existing data)
        try {
          const allSessionsData = await mentoringAPI.getAllSessions(MENTOR_ID);
          const allSessions = allSessionsData.sessions || [];
          const upcomingSessions = allSessions.filter(
            (session) =>
              session.status && session.status.toLowerCase() === "scheduled"
          );
          const completedSessions = allSessions.filter(
            (session) =>
              session.status && session.status.toLowerCase() === "completed"
          );

          // Merge with scheduled sessions from requests (avoid duplicates)
          setUpcomingSessions((prev) => {
            const existingIds = prev.map((s) => s.id);
            const newSessions = upcomingSessions.filter(
              (s) => !existingIds.includes(s.id)
            );
            return [...prev, ...newSessions];
          });

          setCompletedSessions(completedSessions);

          // Convert existing sessions to requests format for display
          const existingRequests = allSessions
            .filter(
              (session) =>
                session.status === "pending" || session.status === null
            )
            .map((session) => ({
              id: session.id,
              student_id: session.student_id,
              student: session.student,
              topic: session.topic,
              description: "Legacy session data",
              preferred_time: "Not specified",
              session_type: session.session_type || "online",
              urgency: "medium",
              status: session.status || "pending",
              requested_date: session.created_at || new Date().toISOString(),
              expiry_date: "",
              avatar: session.avatar,
              contact: "",
            }));
          setMentoringRequests((prev) => [...prev, ...existingRequests]);
        } catch (allSessionsError) {
          console.error("Failed to fetch all sessions:", allSessionsError);
        }
      }

      // Handle stats
      if (statsData.status === "fulfilled") {
        const backendStats = statsData.value.stats || {};
        setStats({
          totalRequests: backendStats.total_requests || 0,
          pendingRequests: backendStats.pending_requests || 0,
          acceptedSessions: backendStats.scheduled_sessions || 0,
          completedSessions: backendStats.completed_sessions || 0,
          averageRating: backendStats.average_rating || 4.8,
          responseRate: backendStats.response_rate || 0,
        });
      } else {
        console.warn("Failed to fetch stats:", statsData.reason);
        // Use default stats
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching mentoring data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = mentoringRequests.filter((request) => {
    const matchesSearch =
      request.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewProfile = (studentId, studentName) => {
    navigate(`student-profile/${studentId}`, {
      state: { studentName },
    });
  };

  const handleMessage = (studentId, studentName) => {
    openChat({
      id: studentId,
      name: studentName,
      avatar: "",
      online: true,
    });
  };

  const handleJoinVideoCall = async (sessionId) => {
    try {
      setError(null);
      // Join video call - opens in new window
      await joinMentoringVideoCall(sessionId, MENTOR_ID, "mentor");
    } catch (err) {
      console.error("Error joining video call:", err);
      setError("Failed to join video call. Please try again.");
    }
  };

  const handleAcceptRequest = (request) => {
    // Add mentor_id to the request object
    setAcceptModal({
      isOpen: true,
      request: { ...request, mentor_id: MENTOR_ID },
    });
  };

  const handleDeclineRequest = (requestId) => {
    setDeclineModal({ isOpen: true, requestId });
  };

  const handleCancelSession = (sessionId) => {
    setCancelModal({ isOpen: true, sessionId });
  };

  const handleRescheduleSession = (session) => {
    setRescheduleModal({ isOpen: true, session });
  };

  const handleCompleteSession = async (sessionId) => {
    if (
      !window.confirm(
        "Are you sure you want to mark this session as completed?"
      )
    ) {
      return;
    }

    try {
      setCompletingSessionId(sessionId);
      setError(null);

      await mentoringAPI.completeSession(
        sessionId,
        "Session completed successfully"
      );

      // Show success message
      setSuccessMessage("Session marked as complete successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.message || "Failed to mark session as complete");
    } finally {
      setCompletingSessionId(null);
    }
  };

  // Modal handlers
  const confirmAcceptRequest = async (scheduleData) => {
    try {
      setActionLoading(true);
      await mentoringAPI.acceptRequest(acceptModal.request.id, scheduleData);
      setAcceptModal({ isOpen: false, request: null });
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeclineRequest = async (reason) => {
    try {
      setActionLoading(true);
      // Handle decline from either DeclineModal or AcceptModal
      const requestId = declineModal.requestId || acceptModal.request?.id;
      if (requestId) {
        await mentoringAPI.declineRequest(requestId, reason);
      }
      setDeclineModal({ isOpen: false, requestId: null });
      setAcceptModal({ isOpen: false, request: null });
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmCancelSession = async (reason) => {
    try {
      setActionLoading(true);
      await mentoringAPI.cancelSession(cancelModal.sessionId, reason);
      setCancelModal({ isOpen: false, sessionId: null });
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmRescheduleSession = async (rescheduleData) => {
    try {
      setActionLoading(true);
      await mentoringAPI.rescheduleSession(
        rescheduleModal.session.id,
        rescheduleData
      );
      setRescheduleModal({ isOpen: false, session: null });
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const urgencyColors = {
    high: "bg-error/20 text-error border-error/30",
    medium: "bg-warning/20 text-yellow-600 border-warning/30",
    low: "bg-success/20 text-success border-success/30",
  };

  const statusColors = {
    pending: "bg-warning/20 text-yellow-600 border-warning/30",
    scheduled: "bg-success/20 text-success border-success/30",
    declined: "bg-error/20 text-error border-error/30",
    completed: "bg-neutral-silver text-neutral-grey border-neutral-light-grey",
    expired:
      "bg-neutral-light-grey text-neutral-grey border-neutral-light-grey",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-grey">Loading mentoring data...</p>
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
      {/* Error Display */}
      {error && (
        <Card className="border-error/30 bg-error/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-error" />
              <p className="text-error font-medium">Error: {error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setError(null);
                  fetchData();
                }}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message Display */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="border-success/30 bg-success/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <p className="text-success font-medium">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-success hover:text-success/80 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.totalRequests}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  {stats.pendingRequests} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Scheduled Sessions
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.acceptedSessions}
                </p>
                <p className="text-sm text-success mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.completedSessions}
                </p>
                <p className="text-sm text-neutral-grey mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Average Rating
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-2xl font-bold text-neutral-black">
                    {stats.averageRating}
                  </p>
                  <Star className="w-5 h-5 text-warning fill-current" />
                </div>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-1 border-b border-neutral-silver -mb-4">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "requests"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-grey hover:text-neutral-black"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Mentoring Requests</span>
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "sessions"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-grey hover:text-neutral-black"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming Sessions</span>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "completed"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-grey hover:text-neutral-black"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Completed Sessions</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Requests Tab */}
          {activeTab === "requests" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-grey" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="declined">Declined</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div className="text-sm text-neutral-grey">
                  {filteredRequests.length} requests
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={request.avatar}
                            alt={request.student}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-neutral-black">
                                  {request.student}
                                </h3>
                                <p className="text-sm text-neutral-grey">
                                  {request.topic}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                    statusColors[request.status]
                                  }`}
                                >
                                  {request.status}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                    urgencyColors[request.urgency]
                                  }`}
                                >
                                  {request.urgency}
                                </span>
                              </div>
                            </div>

                            <p className="text-neutral-black mb-4 leading-relaxed">
                              {request.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-neutral-grey">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{request.preferred_time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {request.session_type === "online" ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <MapPin className="w-4 h-4" />
                                )}
                                <span>
                                  {request.session_type === "online"
                                    ? "Online Session"
                                    : "Physical Meeting"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Requested{" "}
                                  {new Date(
                                    request.requested_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {request.status === "pending" && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleMessage(
                                        request.student_id,
                                        request.student
                                      )
                                    }
                                  >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleViewProfile(
                                        request.student_id,
                                        request.student
                                      )
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Profile
                                  </Button>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      handleDeclineRequest(request.id)
                                    }
                                    className="text-error hover:bg-error/10"
                                    disabled={actionLoading}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Decline
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptRequest(request)}
                                    disabled={actionLoading}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            )}

                            {request.status === "scheduled" &&
                              request.scheduled_date && (
                                <div className="bg-success/10 p-3 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-success">
                                        Session Scheduled
                                      </p>
                                      <p className="text-sm text-neutral-grey">
                                        {new Date(
                                          request.scheduled_date
                                        ).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(
                                          request.scheduled_date
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                      {request.location && (
                                        <p className="text-sm text-neutral-grey">
                                          Location: {request.location}
                                        </p>
                                      )}
                                      {request.session_type === "online" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleJoinVideoCall(request.id)
                                          }
                                          className="mt-2"
                                        >
                                          <Video className="w-4 h-4 mr-1" />
                                          Join Video Meeting
                                        </Button>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full border border-success/30">
                                        Scheduled
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                            {request.status === "declined" &&
                              request.decline_reason && (
                                <div className="bg-error/10 p-3 rounded-lg">
                                  <p className="text-sm font-medium text-error mb-1">
                                    Request Declined
                                  </p>
                                  <p className="text-sm text-neutral-grey">
                                    Reason: {request.decline_reason}
                                  </p>
                                </div>
                              )}

                            {request.status === "expired" && (
                              <div className="bg-neutral-light-grey/50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-neutral-grey">
                                  Request Expired
                                </p>
                                <p className="text-sm text-neutral-grey">
                                  This request expired on{" "}
                                  {new Date(
                                    request.expiry_date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={
                              session.avatar || "https://via.placeholder.com/48"
                            }
                            alt={session.student}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-neutral-black">
                                  {session.student}
                                </h3>
                                <p className="text-sm text-neutral-grey">
                                  {session.topic}
                                </p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full border border-success/30">
                                {session.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-neutral-grey">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    session.scheduled_at
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{session.duration_minutes} minutes</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {session.session_type === "online" ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <MapPin className="w-4 h-4" />
                                )}
                                <span>
                                  {session.session_type === "online"
                                    ? "Online Session"
                                    : session.location}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleMessage(
                                      session.student_id,
                                      session.student
                                    )
                                  }
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Message
                                </Button>
                                {session.session_type === "online" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleJoinVideoCall(session.id)
                                    }
                                  >
                                    <Video className="w-4 h-4 mr-1" />
                                    Join Video Meeting
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleCompleteSession(session.id)
                                  }
                                  disabled={completingSessionId === session.id}
                                  className="text-success hover:bg-success/10"
                                >
                                  {completingSessionId === session.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-success mr-1"></div>
                                      Marking Complete...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Mark Complete
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-error hover:bg-error/10"
                                  onClick={() =>
                                    handleCancelSession(session.id)
                                  }
                                  disabled={actionLoading}
                                >
                                  Cancel Session
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleRescheduleSession(session)
                                  }
                                  disabled={actionLoading}
                                >
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {upcomingSessions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-black mb-2">
                      No upcoming sessions
                    </h3>
                    <p className="text-neutral-grey mb-6">
                      You don't have any scheduled mentoring sessions yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Completed Sessions Tab */}
          {activeTab === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {completedSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={
                              session.avatar || "https://via.placeholder.com/48"
                            }
                            alt={session.student}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-neutral-black">
                                  {session.student}
                                </h3>
                                <p className="text-sm text-neutral-grey">
                                  {session.topic}
                                </p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-neutral-silver text-neutral-grey rounded-full border border-neutral-light-grey">
                                Completed
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-neutral-grey">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    session.scheduled_at
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{session.duration_minutes} minutes</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {session.session_type === "online" ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <MapPin className="w-4 h-4" />
                                )}
                                <span>
                                  {session.session_type === "online"
                                    ? "Online Session"
                                    : session.location}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleMessage(
                                      session.student_id,
                                      session.student
                                    )
                                  }
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Message
                                </Button>
                              </div>
                              <div className="text-sm text-success">
                                ✓ Session completed
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {completedSessions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-black mb-2">
                      No completed sessions
                    </h3>
                    <p className="text-neutral-grey mb-6">
                      Your completed mentoring sessions will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DeclineModal
        isOpen={declineModal.isOpen}
        onClose={() => setDeclineModal({ isOpen: false, requestId: null })}
        onConfirm={confirmDeclineRequest}
        loading={actionLoading}
      />

      <CancelSessionModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, sessionId: null })}
        onConfirm={confirmCancelSession}
        loading={actionLoading}
      />

      <AcceptRequestModal
        isOpen={acceptModal.isOpen}
        onClose={() => setAcceptModal({ isOpen: false, request: null })}
        onConfirm={confirmAcceptRequest}
        onDecline={(reason) => confirmDeclineRequest(reason)}
        loading={actionLoading}
        request={acceptModal.request}
      />

      <RescheduleModal
        isOpen={rescheduleModal.isOpen}
        onClose={() => setRescheduleModal({ isOpen: false, session: null })}
        onConfirm={confirmRescheduleSession}
        loading={actionLoading}
        session={rescheduleModal.session}
        mentorId={MENTOR_ID}
      />
    </motion.div>
  );
}
