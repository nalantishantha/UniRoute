import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  Search,
  BookOpen,
  User,
  Star,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  DollarSign,
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

const tutoringRequests = [
  {
    id: 1,
    student: "Alex Thompson",
    subject: "Advanced Calculus",
    level: "University",
    preferredTime: "Weekdays 4-6 PM",
    sessionType: "online",
    status: "pending",
    description:
      "Need help with derivatives and integrals. Struggling with word problems and application of concepts.",
    rate: 45,
    sessionsRequested: 8,
    requestDate: "2024-01-20",
    urgency: "high",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    contact: "alex.thompson@email.com",
  },
  {
    id: 2,
    student: "Maria Garcia",
    subject: "Physics",
    level: "High School",
    preferredTime: "Weekends 2-4 PM",
    sessionType: "physical",
    status: "accepted",
    description:
      "Preparing for AP Physics exam. Need comprehensive review of mechanics and electricity concepts.",
    rate: 40,
    sessionsRequested: 12,
    requestDate: "2024-01-18",
    urgency: "medium",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face",
    contact: "maria.garcia@email.com",
    scheduledDate: "2024-01-25",
    location: "Local Library, Study Room B",
  },
  {
    id: 3,
    student: "James Wilson",
    subject: "Chemistry",
    level: "University",
    preferredTime: "Evenings 7-9 PM",
    sessionType: "online",
    status: "pending",
    description:
      "Having difficulty with organic chemistry reactions and mechanisms. Need step-by-step guidance.",
    rate: 50,
    sessionsRequested: 6,
    requestDate: "2024-01-19",
    urgency: "medium",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    contact: "james.wilson@email.com",
  },
];

const upcomingSessions = [
  {
    id: 1,
    student: "Maria Garcia",
    subject: "Physics",
    date: "2024-01-25",
    time: "2:00 PM",
    duration: "2 hours",
    type: "physical",
    location: "Local Library, Study Room B",
    status: "confirmed",
    rate: 40,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 2,
    student: "Sophie Chen",
    subject: "Mathematics",
    date: "2024-01-26",
    time: "4:00 PM",
    duration: "1.5 hours",
    type: "online",
    meetingLink: "https://zoom.us/j/987654321",
    status: "confirmed",
    rate: 45,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 3,
    student: "David Kim",
    subject: "Chemistry",
    date: "2024-01-27",
    time: "6:00 PM",
    duration: "1 hour",
    type: "online",
    meetingLink: "https://zoom.us/j/456789123",
    status: "pending_confirmation",
    rate: 50,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
  },
];

const stats = {
  totalRequests: 18,
  pendingRequests: 4,
  acceptedSessions: 12,
  completedSessions: 89,
  averageRating: 4.9,
  totalEarnings: 3450,
  thisWeekEarnings: 280,
};

const subjects = [
  { name: "Mathematics", sessions: 45, rating: 4.9, earnings: 1800 },
  { name: "Physics", sessions: 32, rating: 4.8, earnings: 1280 },
  { name: "Chemistry", sessions: 28, rating: 4.9, earnings: 1120 },
  { name: "Biology", sessions: 15, rating: 4.7, earnings: 600 },
];

const urgencyColors = {
  high: "bg-error/20 text-error border-error/30",
  medium: "bg-warning/20 text-yellow-600 border-warning/30",
  low: "bg-success/20 text-success border-success/30",
};

const statusColors = {
  pending: "bg-warning/20 text-yellow-600 border-warning/30",
  accepted: "bg-success/20 text-success border-success/30",
  rejected: "bg-error/20 text-error border-error/30",
  confirmed: "bg-primary-100 text-primary-600 border-primary-200",
  pending_confirmation: "bg-info/20 text-info border-info/30",
};

export default function Tutoring() {
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = tutoringRequests.filter((request) => {
    const matchesSearch =
      request.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    const matchesSubject =
      filterSubject === "all" ||
      request.subject.toLowerCase() === filterSubject.toLowerCase();
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleAcceptRequest = (requestId) => {
    console.log("Accept tutoring request:", requestId);
  };

  const handleRejectRequest = (requestId) => {
    console.log("Reject tutoring request:", requestId);
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
                  {stats.totalRequests}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  {stats.pendingRequests} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-600" />
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
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm text-neutral-grey">
                    {stats.averageRating} rating
                  </span>
                </div>
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
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  ${stats.totalEarnings}
                </p>
                <p className="text-sm text-success mt-1">
                  +${stats.thisWeekEarnings} this week
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Active Sessions
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.acceptedSessions}
                </p>
                <p className="text-sm text-neutral-grey mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>
            Your tutoring performance across different subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-neutral-silver rounded-lg"
              >
                <h4 className="font-semibold text-neutral-black">
                  {subject.name}
                </h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-grey">Sessions:</span>
                    <span className="font-medium">{subject.sessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-grey">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-warning fill-current" />
                      <span className="font-medium">{subject.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-grey">Earnings:</span>
                    <span className="font-medium">${subject.earnings}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

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
              <BookOpen className="w-4 h-4" />
              <span>Tutoring Requests</span>
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
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.name} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
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
                                  {request.subject} • {request.level}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm text-neutral-grey">
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
                                    ? "Online"
                                    : "In-person"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4" />
                                <span>${request.rate}/hour</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4" />
                                <span>
                                  {request.sessionsRequested} sessions
                                </span>
                              </div>
                            </div>

                            {request.status === "pending" && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <User className="w-4 h-4 mr-1" />
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
                                        {request.scheduledDate} at{" "}
                                        {request.location || "Online meeting"}
                                      </p>
                                    </div>
                                    <Button size="sm" variant="outline">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      View Details
                                    </Button>
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
                                  {session.subject}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                    statusColors[session.status]
                                  }`}
                                >
                                  {session.status.replace("_", " ")}
                                </span>
                                <span className="text-sm font-medium text-primary-600">
                                  ${session.rate}/hr
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm text-neutral-grey">
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
                                <Button size="sm" variant="outline">
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
                                >
                                  Cancel Session
                                </Button>
                                <Button size="sm">Reschedule</Button>
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
                      You don't have any scheduled tutoring sessions yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
