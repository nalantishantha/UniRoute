import { useState } from "react";
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

const mentoringRequests = [
  {
    id: 1,
    student: "Sarah Chen",
    topic: "University Admissions",
    preferredTime: "Weekdays 2-4 PM",
    sessionType: "online",
    status: "pending",
    description:
      "Looking for guidance on university applications, particularly for engineering programs. Need help with personal statements and interview preparation.",
    requestDate: "2024-01-20",
    urgency: "medium",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face",
    contact: "sarah.chen@email.com",
  },
  {
    id: 2,
    student: "Michael Brown",
    topic: "Career Planning",
    preferredTime: "Weekends 10-12 AM",
    sessionType: "physical",
    status: "accepted",
    description:
      "Recent graduate seeking advice on career paths in the tech industry. Want to discuss job search strategies and skill development.",
    requestDate: "2024-01-18",
    urgency: "low",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    contact: "michael.brown@email.com",
    scheduledDate: "2024-01-25",
    location: "Campus Library, Room 204",
  },
  {
    id: 3,
    student: "Emily Watson",
    topic: "Study Strategies",
    preferredTime: "Weekdays 6-8 PM",
    sessionType: "online",
    status: "pending",
    description:
      "Struggling with time management and study techniques. Looking for personalized advice on how to improve academic performance.",
    requestDate: "2024-01-19",
    urgency: "high",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    contact: "emily.watson@email.com",
  },
];

const upcomingSessions = [
  {
    id: 1,
    student: "Michael Brown",
    topic: "Career Planning",
    date: "2024-01-25",
    time: "10:00 AM",
    duration: "1 hour",
    type: "physical",
    location: "Campus Library, Room 204",
    status: "confirmed",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 2,
    student: "Lisa Johnson",
    topic: "University Admissions",
    date: "2024-01-26",
    time: "3:00 PM",
    duration: "1.5 hours",
    type: "online",
    meetingLink: "https://zoom.us/j/123456789",
    status: "confirmed",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face",
  },
];

const stats = {
  totalRequests: 15,
  pendingRequests: 3,
  acceptedSessions: 8,
  completedSessions: 24,
  averageRating: 4.8,
  responseRate: 95,
};

const urgencyColors = {
  high: "bg-error/20 text-error border-error/30",
  medium: "bg-warning/20 text-yellow-600 border-warning/30",
  low: "bg-success/20 text-success border-success/30",
};

const statusColors = {
  pending: "bg-warning/20 text-yellow-600 border-warning/30",
  accepted: "bg-success/20 text-success border-success/30",
  rejected: "bg-error/20 text-error border-error/30",
  completed: "bg-neutral-silver text-neutral-grey border-neutral-light-grey",
};

export default function Mentoring() {
  const navigate = useNavigate();
  const { openChat } = useChatContext();
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState(mentoringRequests);
  const [sessions, setSessions] = useState(upcomingSessions);

  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Calculate dynamic stats
  const dynamicStats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter((req) => req.status === "pending").length,
    acceptedSessions: requests.filter((req) => req.status === "accepted")
      .length,
    completedSessions: stats.completedSessions, // Keep static for now
    averageRating: stats.averageRating, // Keep static for now
    responseRate: stats.responseRate, // Keep static for now
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewProfile = (studentId, studentName) => {
    // Changed from studentNAme to studentName
    navigate(`student-profile/${studentId}`, {
      // Also simplified the path
      state: { studentName },
    });
  };

  const handleMessage = (studentId, studentName) => {
    // Navigate to chat page with specific student
    openChat({
      id: studentId,
      name: studentName,
      avatar: "",
      online: true,
    });
  };

  const handleAcceptRequest = (requestId) => {
    const requestToAccept = requests.find((req) => req.id === requestId);
    if (!requestToAccept) return;
    
    setSelectedRequest(requestToAccept);
    setShowAcceptModal(true);
  };

  const handleRejectRequest = (requestId) => {
    const requestToReject = requests.find((req) => req.id === requestId);
    if (!requestToReject) return;
    
    setSelectedRequest(requestToReject);
    setShowRejectModal(true);
  };

  const confirmAcceptRequest = () => {
    if (!selectedRequest || !scheduleDate || !scheduleTime) return;

    // Update the request status to accepted
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "accepted",
              scheduledDate: scheduleDate,
              scheduledTime: scheduleTime,
              location:
                req.sessionType === "physical"
                  ? "Campus Library, Room TBD"
                  : undefined,
            }
          : req
      )
    );

    // Create a new session entry for upcoming sessions
    const newSession = {
      id: Date.now(), // Generate unique ID
      student: selectedRequest.student,
      topic: selectedRequest.topic,
      date: scheduleDate,
      time: scheduleTime,
      duration: "1 hour",
      type: selectedRequest.sessionType,
      location:
        selectedRequest.sessionType === "physical"
          ? "Campus Library, Room TBD"
          : undefined,
      meetingLink:
        selectedRequest.sessionType === "online"
          ? "https://zoom.us/j/to-be-generated"
          : undefined,
      status: "confirmed",
      avatar: selectedRequest.avatar,
    };

    // Add to upcoming sessions
    setSessions((prevSessions) => [...prevSessions, newSession]);

    // Reset modal state
    setShowAcceptModal(false);
    setSelectedRequest(null);
    setScheduleDate("");
    setScheduleTime("");

    console.log("Request accepted and session scheduled:", selectedRequest.id);
  };

  const confirmRejectRequest = () => {
    if (!selectedRequest || !rejectReason.trim()) return;

    // Update the request status to rejected
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === selectedRequest.id 
          ? { ...req, status: "rejected", rejectReason: rejectReason }
          : req
      )
    );

    // Reset modal state
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectReason("");

    console.log("Request rejected:", selectedRequest.id, "Reason:", rejectReason);
  };

  const handleCancelSession = (sessionId) => {
    const sessionToCancel = sessions.find((session) => session.id === sessionId);
    if (!sessionToCancel) return;
    
    setSelectedSession(sessionToCancel);
    setShowCancelModal(true);
  };

  const confirmCancelSession = () => {
    if (!selectedSession) return;

    // Remove session from upcoming sessions
    setSessions((prevSessions) => 
      prevSessions.filter((session) => session.id !== selectedSession.id)
    );

    // Update corresponding request status back to pending if it exists
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.student === selectedSession.student && req.topic === selectedSession.topic
          ? { ...req, status: "pending", scheduledDate: undefined, scheduledTime: undefined }
          : req
      )
    );

    // Reset modal state
    setShowCancelModal(false);
    setSelectedSession(null);

    console.log("Session cancelled:", selectedSession.id);
  };

  const handleRescheduleSession = (sessionId) => {
    const sessionToReschedule = sessions.find((session) => session.id === sessionId);
    if (!sessionToReschedule) return;
    
    setSelectedSession(sessionToReschedule);
    setScheduleDate(sessionToReschedule.date);
    setScheduleTime(sessionToReschedule.time);
    setShowRescheduleModal(true);
  };

  const confirmRescheduleSession = () => {
    if (!selectedSession || !scheduleDate || !scheduleTime) return;

    // Update session with new date and time
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === selectedSession.id
          ? { ...session, date: scheduleDate, time: scheduleTime }
          : session
      )
    );

    // Update corresponding request if it exists
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.student === selectedSession.student && req.topic === selectedSession.topic
          ? { ...req, scheduledDate: scheduleDate, scheduledTime: scheduleTime }
          : req
      )
    );

    // Reset modal state
    setShowRescheduleModal(false);
    setSelectedSession(null);
    setScheduleDate("");
    setScheduleTime("");

    console.log("Session rescheduled:", selectedSession.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
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
                  {dynamicStats.totalRequests}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  {dynamicStats.pendingRequests} pending
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
                  Accepted Sessions
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {dynamicStats.acceptedSessions}
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
                  {dynamicStats.completedSessions}
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
                    {dynamicStats.averageRating}
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
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
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
                                <span>{request.preferredTime}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {request.sessionType === "online" ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <MapPin className="w-4 h-4" />
                                )}
                                <span>
                                  {request.sessionType === "online"
                                    ? "Online Session"
                                    : "Physical Meeting"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Requested {request.requestDate}</span>
                              </div>
                            </div>

                            {request.status === "pending" && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleMessage(request.id, request.student)
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
                                        request.id,
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
                                      handleRejectRequest(request.id)
                                    }
                                    className="text-error hover:bg-error/10"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Decline
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleAcceptRequest(request.id)
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            )}

                            {request.status === "accepted" &&
                              request.scheduledDate && (
                                <div className="bg-success/10 p-3 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-success">
                                        Session Scheduled
                                      </p>
                                      <p className="text-sm text-neutral-grey">
                                        {request.scheduledDate} at {request.scheduledTime || "TBD"} - {" "}
                                        {request.location || "Online meeting"}
                                      </p>
                                    </div>
                                  </div>
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
                {sessions.map((session, index) => (
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
                            src={session.avatar}
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
                                  {session.date} at {session.time}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{session.duration}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {session.type === "online" ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <MapPin className="w-4 h-4" />
                                )}
                                <span>
                                  {session.type === "online"
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
                                    handleMessage(session.id, session.student)
                                  }
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Message
                                </Button>
                                {session.type === "online" &&
                                  session.meetingLink && (
                                    <Button size="sm" variant="outline">
                                      <Video className="w-4 h-4 mr-1" />
                                      Join Meeting
                                    </Button>
                                  )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-error hover:bg-error/10"
                                  onClick={() => handleCancelSession(session.id)}
                                >
                                  Cancel Session
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleRescheduleSession(session.id)}
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

              {sessions.length === 0 && (
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
        </CardContent>
      </Card>

      {/* Accept Request Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-black mb-4">
              Schedule Session with {selectedRequest?.student}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-grey mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-grey mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <p className="text-sm text-primary-700">
                  <strong>Topic:</strong> {selectedRequest?.topic}
                </p>
                <p className="text-sm text-primary-700">
                  <strong>Type:</strong> {selectedRequest?.sessionType === 'online' ? 'Online Session' : 'Physical Meeting'}
                </p>
                <p className="text-sm text-primary-700">
                  <strong>Preferred Time:</strong> {selectedRequest?.preferredTime}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAcceptModal(false);
                  setSelectedRequest(null);
                  setScheduleDate("");
                  setScheduleTime("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAcceptRequest}
                disabled={!scheduleDate || !scheduleTime}
                className="flex-1"
              >
                Confirm Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-black mb-4">
              Decline Request from {selectedRequest?.student}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-grey mb-2">
                  Reason for declining
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for declining this mentoring request..."
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                />
              </div>
              <div className="bg-error/10 p-3 rounded-lg">
                <p className="text-sm text-error">
                  <strong>Topic:</strong> {selectedRequest?.topic}
                </p>
                <p className="text-sm text-error">
                  <strong>Urgency:</strong> {selectedRequest?.urgency}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectReason("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRejectRequest}
                disabled={!rejectReason.trim()}
                variant="ghost"
                className="flex-1 text-error hover:bg-error/10"
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Session Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-black mb-4">
              Cancel Session
            </h3>
            <p className="text-neutral-grey mb-6">
              Are you sure you want to cancel this session with <strong>{selectedSession?.student}</strong>?
            </p>
            <div className="bg-warning/10 p-3 rounded-lg mb-6">
              <p className="text-sm text-yellow-700">
                <strong>Session:</strong> {selectedSession?.topic}
              </p>
              <p className="text-sm text-yellow-700">
                <strong>Scheduled:</strong> {selectedSession?.date} at {selectedSession?.time}
              </p>
              <p className="text-sm text-yellow-700">
                <strong>Type:</strong> {selectedSession?.type === 'online' ? 'Online Session' : 'Physical Meeting'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSession(null);
                }}
                className="flex-1"
              >
                Keep Session
              </Button>
              <Button
                onClick={confirmCancelSession}
                variant="ghost"
                className="flex-1 text-error hover:bg-error/10"
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Session Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-black mb-4">
              Reschedule Session with {selectedSession?.student}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-grey mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-grey mb-2">
                  New Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <div className="bg-neutral-100 p-3 rounded-lg">
                <p className="text-sm text-neutral-700">
                  <strong>Current Schedule:</strong> {selectedSession?.date} at {selectedSession?.time}
                </p>
                <p className="text-sm text-neutral-700">
                  <strong>Topic:</strong> {selectedSession?.topic}
                </p>
                <p className="text-sm text-neutral-700">
                  <strong>Type:</strong> {selectedSession?.type === 'online' ? 'Online Session' : 'Physical Meeting'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedSession(null);
                  setScheduleDate("");
                  setScheduleTime("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRescheduleSession}
                disabled={!scheduleDate || !scheduleTime}
                className="flex-1"
              >
                Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
