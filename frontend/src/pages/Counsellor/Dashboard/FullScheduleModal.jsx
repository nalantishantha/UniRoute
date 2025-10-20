import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

// Extended schedule data for the full view
const fullScheduleData = [
  {
    id: 1,
    title: "Mathematics Tutoring",
    student: "Emily Watson",
    date: "2024-01-15",
    time: "2:00 PM - 3:00 PM",
    type: "online",
    duration: "1 hour",
    subject: "Advanced Calculus",
    status: "confirmed",
    meetingLink: "https://zoom.us/j/123456789"
  },
  {
    id: 2,
    title: "University Admission Guidance",
    student: "Michael Brown",
    date: "2024-01-16",
    time: "10:00 AM - 12:00 PM",
    type: "physical",
    duration: "2 hours",
    subject: "Application Review",
    status: "confirmed",
    location: "Room 205, Academic Building"
  },
  {
    id: 3,
    title: "Chemistry Lab Prep",
    student: "Lisa Johnson",
    date: "2024-01-17",
    time: "3:00 PM - 4:30 PM",
    type: "online",
    duration: "1.5 hours",
    subject: "Organic Chemistry",
    status: "pending",
    meetingLink: "https://zoom.us/j/987654321"
  },
  {
    id: 4,
    title: "Physics Problem Solving",
    student: "David Wilson",
    date: "2024-01-18",
    time: "1:00 PM - 2:00 PM",
    type: "online",
    duration: "1 hour",
    subject: "Quantum Mechanics",
    status: "confirmed",
    meetingLink: "https://zoom.us/j/456789123"
  },
  {
    id: 5,
    title: "Essay Writing Workshop",
    student: "Sarah Davis",
    date: "2024-01-19",
    time: "4:00 PM - 5:30 PM",
    type: "physical",
    duration: "1.5 hours",
    subject: "Academic Writing",
    status: "confirmed",
    location: "Library Study Room 3"
  },
  {
    id: 6,
    title: "Biology Lab Review",
    student: "Tom Anderson",
    date: "2024-01-20",
    time: "11:00 AM - 12:30 PM",
    type: "online",
    duration: "1.5 hours",
    subject: "Cell Biology",
    status: "confirmed",
    meetingLink: "https://zoom.us/j/789123456"
  }
];

const FullScheduleModal = ({ isOpen, onClose }) => {
  const [currentWeek, setCurrentWeek] = React.useState(0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader className="border-b border-neutral-silver">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-primary-600" />
                    <span>Full Schedule</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-neutral-grey hover:text-neutral-black"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(currentWeek - 1)}
                      disabled={currentWeek === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-neutral-black">
                      January 2024 - Week {currentWeek + 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(currentWeek + 1)}
                      disabled={currentWeek >= 3}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div>
                      <span className="text-xs text-neutral-grey">Confirmed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full"></div>
                      <span className="text-xs text-neutral-grey">Pending</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-y-auto max-h-[60vh]">
                  <div className="p-6 space-y-4">
                    {fullScheduleData.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-neutral-silver rounded-lg p-4 hover:border-primary-300 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Session Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-neutral-black text-lg">
                                  {session.title}
                                </h3>
                                <p className="text-neutral-grey text-sm">
                                  {session.subject}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </span>
                            </div>

                            {/* Session Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-neutral-grey" />
                                <span className="text-sm text-neutral-black">
                                  {session.student}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-neutral-grey" />
                                <span className="text-sm text-neutral-black">
                                  {formatDate(session.date)}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-neutral-grey" />
                                <span className="text-sm text-neutral-black">
                                  {session.time}
                                </span>
                              </div>
                            </div>

                            {/* Location/Link and Type */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {session.type === 'online' ? (
                                  <Video className="w-4 h-4 text-primary-600" />
                                ) : (
                                  <MapPin className="w-4 h-4 text-success" />
                                )}
                                <span className="text-sm text-neutral-black">
                                  {session.type === 'online'
                                    ? session.meetingLink
                                    : session.location
                                  }
                                </span>
                              </div>

                              <span className={`text-xs px-2 py-1 rounded-full ${session.type === "online"
                                  ? "bg-primary-100 text-primary-600"
                                  : "bg-success/20 text-success"
                                }`}>
                                {session.type} • {session.duration}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 pt-2">
                              {session.type === 'online' && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => window.open(session.meetingLink, '_blank')}
                                >
                                  <Video className="w-3 h-3 mr-1" />
                                  Join Meeting
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                Reschedule
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-neutral-silver p-4 bg-neutral-silver/10">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-grey">
                      Showing {fullScheduleData.length} sessions
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Export Calendar
                      </Button>
                      <Button variant="primary" size="sm">
                        Schedule New Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FullScheduleModal;
