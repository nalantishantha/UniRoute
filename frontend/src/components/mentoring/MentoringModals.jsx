import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Calendar, Clock, CheckCircle } from "lucide-react";
import Button from "../ui/Button";

export function DeclineModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-silver">
              <h3 className="text-lg font-semibold text-neutral-black">
                Decline Request
              </h3>
              <button
                onClick={handleClose}
                className="text-neutral-grey hover:text-neutral-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-neutral-black">
                  Please provide a reason for declining this mentoring request:
                </p>
              </div>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason here..."
                className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                rows="4"
                required
              />

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-error hover:bg-error/90"
                  disabled={loading || !reason.trim()}
                >
                  {loading ? "Declining..." : "Decline Request"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CancelSessionModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-silver">
              <h3 className="text-lg font-semibold text-neutral-black">
                Cancel Session
              </h3>
              <button
                onClick={handleClose}
                className="text-neutral-grey hover:text-neutral-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-neutral-black font-medium mb-2">
                    Are you sure you want to cancel this session?
                  </p>
                  <p className="text-neutral-grey text-sm mb-4">
                    This action cannot be undone and the student will be
                    notified.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for cancelling the session..."
                  className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                  rows="3"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Keep Session
                </Button>
                <Button
                  type="submit"
                  className="bg-error hover:bg-error/90"
                  disabled={loading || !reason.trim()}
                >
                  {loading ? "Cancelling..." : "Cancel Session"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AcceptRequestModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  request,
  onDecline,
}) {
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    if (isOpen && request) {
      checkAvailabilityConflict();
    }
  }, [isOpen, request]);

  const checkAvailabilityConflict = async () => {
    if (!request?.preferred_time || !request?.mentor_id) return;

    try {
      setCheckingConflict(true);
      setConflictMessage("");
      setHasConflict(false);

      // Parse the preferred time from the request
      const requestedTime = new Date(request.preferred_time);

      // Fetch mentor's scheduled sessions to check for conflicts
      const response = await fetch(
        `/api/mentoring/sessions/${request.mentor_id}/`
      );
      const data = await response.json();

      if (data.status === "success") {
        const sessions = data.sessions;

        // Check if the requested time conflicts with any scheduled session
        const conflict = sessions.some((session) => {
          if (session.status !== "scheduled") return false;

          const sessionStart = new Date(session.scheduled_at);
          const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000); // 1 hour session
          const requestedEnd = new Date(
            requestedTime.getTime() + 60 * 60 * 1000
          );

          // Check for overlap
          return requestedTime < sessionEnd && requestedEnd > sessionStart;
        });

        if (conflict) {
          setHasConflict(true);
          setConflictMessage(
            "This time slot conflicts with an already scheduled session. You cannot accept this request. Please decline it or reschedule the conflicting session first."
          );
        }
      }
    } catch (error) {
      console.error("Error checking conflicts:", error);
    } finally {
      setCheckingConflict(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent submission if there's a conflict
    if (hasConflict) {
      return;
    }

    // Use the student's requested time directly
    if (request?.preferred_time) {
      const scheduleData = {
        scheduled_datetime: request.preferred_time,
        location: request.session_type === "physical" ? "" : "",
        meeting_link: request.session_type === "online" ? "" : "",
      };
      onConfirm(scheduleData);
    }
  };

  const handleDecline = () => {
    if (declineReason.trim()) {
      onDecline(declineReason);
      handleClose();
    }
  };

  const handleClose = () => {
    setConflictMessage("");
    setHasConflict(false);
    setShowDeclineReason(false);
    setDeclineReason("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-silver">
              <h3 className="text-lg font-semibold text-neutral-black">
                Accept Mentoring Request
              </h3>
              <button
                onClick={handleClose}
                className="text-neutral-grey hover:text-neutral-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 space-y-3">
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <p className="text-sm font-medium text-primary-700 mb-3">
                    Session Details
                  </p>
                  <div className="space-y-2">
                    <p className="text-neutral-black">
                      <span className="font-medium">Student:</span>{" "}
                      {request?.student}
                    </p>
                    <p className="text-neutral-black">
                      <span className="font-medium">Topic:</span>{" "}
                      {request?.topic}
                    </p>
                    <p className="text-neutral-black">
                      <span className="font-medium">Session Type:</span>{" "}
                      <span className="capitalize">
                        {request?.session_type}
                      </span>
                    </p>
                    <div className="flex items-center space-x-2 text-neutral-black">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Scheduled Time:</span>
                      <span>
                        {request?.preferred_time
                          ? new Date(request.preferred_time).toLocaleString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-grey">
                      Duration: 1 hour
                    </p>
                  </div>
                </div>

                {checkingConflict && (
                  <div className="flex items-center space-x-2 text-neutral-grey text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span>Checking for conflicts...</span>
                  </div>
                )}

                {conflictMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start space-x-2 p-3 rounded-lg ${
                      hasConflict
                        ? "bg-error/10 border border-error/30"
                        : "bg-warning/10 border border-warning/30"
                    }`}
                  >
                    <AlertCircle
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        hasConflict ? "text-error" : "text-warning"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        hasConflict ? "text-red-700" : "text-yellow-700"
                      }`}
                    >
                      {conflictMessage}
                    </p>
                  </motion.div>
                )}

                {!hasConflict && !checkingConflict && (
                  <div className="flex items-start space-x-2 p-3 bg-success/10 border border-success/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-700">
                      <p className="font-medium mb-1">Ready to Accept</p>
                      <p>
                        The session will be automatically scheduled for the time
                        requested by the student. You can add location or
                        meeting link details after acceptance.
                      </p>
                    </div>
                  </div>
                )}

                {hasConflict && !showDeclineReason && (
                  <div className="p-3 bg-neutral-silver rounded-lg">
                    <p className="text-sm text-neutral-black mb-2">
                      <span className="font-medium">Options:</span>
                    </p>
                    <p className="text-sm text-neutral-grey">
                      1. Decline this request and explain to the student
                      <br />
                      2. Reschedule your conflicting session first, then accept
                      this request
                    </p>
                  </div>
                )}

                {showDeclineReason && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-neutral-black">
                      Reason for declining *
                    </label>
                    <textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Explain why you cannot accept this request (e.g., 'I have another session at this time')"
                      className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                      rows="3"
                      required
                    />
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading || checkingConflict}
                >
                  Cancel
                </Button>
                {hasConflict ? (
                  <>
                    {!showDeclineReason ? (
                      <Button
                        type="button"
                        className="bg-error hover:bg-error/90"
                        onClick={() => setShowDeclineReason(true)}
                        disabled={loading}
                      >
                        Decline Request
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="bg-error hover:bg-error/90"
                        onClick={handleDecline}
                        disabled={loading || !declineReason.trim()}
                      >
                        {loading ? "Declining..." : "Confirm Decline"}
                      </Button>
                    )}
                  </>
                ) : (
                  <Button type="submit" disabled={loading || checkingConflict}>
                    {loading ? "Accepting..." : "Accept & Schedule"}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RescheduleModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  session,
  mentorId,
}) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("09:00");
  const [selectionMode, setSelectionMode] = useState("available"); // 'available' or 'custom'
  const [conflictError, setConflictError] = useState("");

  useEffect(() => {
    if (isOpen && mentorId) {
      fetchAvailableSlots();
      fetchScheduledSessions();
    } else {
      resetState();
    }
  }, [isOpen, mentorId]);

  const resetState = () => {
    setAvailableSlots([]);
    setScheduledSessions([]);
    setSelectedSlot(null);
    setCustomDate("");
    setCustomTime("09:00");
    setSelectionMode("available");
    setConflictError("");
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      // Include session_id to exclude current session from conflict check
      const url = session?.id
        ? `/api/mentoring/available-slots/${mentorId}/?exclude_session_id=${session.id}`
        : `/api/mentoring/available-slots/${mentorId}/`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        // Filter slots for next 2 weeks and exclude past times
        const now = new Date();
        const twoWeeksLater = new Date(
          now.getTime() + 14 * 24 * 60 * 60 * 1000
        );

        const filteredSlots = data.available_slots.filter((slot) => {
          const slotDate = new Date(slot.datetime);
          // Must be in the future and within 2 weeks
          return slotDate > now && slotDate <= twoWeeksLater;
        });

        setAvailableSlots(filteredSlots);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchScheduledSessions = async () => {
    try {
      const response = await fetch(`/api/mentoring/sessions/${mentorId}/`);
      const data = await response.json();

      if (data.status === "success") {
        setScheduledSessions(
          data.sessions.filter((s) => s.status === "scheduled")
        );
      }
    } catch (error) {
      console.error("Error fetching scheduled sessions:", error);
    }
  };

  const checkForConflict = (dateTime) => {
    const newStart = new Date(dateTime);
    const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000); // 1 hour session

    // Check if it's the same as the current session time
    if (session?.scheduled_at) {
      const currentSessionStart = new Date(session.scheduled_at);
      if (newStart.getTime() === currentSessionStart.getTime()) {
        return "This is the same time slot as the current session.";
      }
    }

    // Check against other scheduled sessions
    for (const scheduledSession of scheduledSessions) {
      if (scheduledSession.id === session?.id) continue; // Skip current session

      const sessionStart = new Date(scheduledSession.scheduled_at);
      const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000);

      // Check for overlap
      if (newStart < sessionEnd && newEnd > sessionStart) {
        return "This time slot conflicts with another scheduled session.";
      }
    }

    return null;
  };

  const handleSlotSelect = (slot) => {
    setConflictError("");
    const conflict = checkForConflict(slot.datetime);

    if (conflict) {
      setConflictError(conflict);
      return;
    }

    setSelectedSlot(slot);
    setSelectionMode("available");
  };

  const handleCustomDateChange = (e) => {
    setCustomDate(e.target.value);
    setConflictError("");
    setSelectedSlot(null);
  };

  const handleCustomTimeChange = (e) => {
    setCustomTime(e.target.value);
    setConflictError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newDatetime;

    if (selectionMode === "available" && selectedSlot) {
      newDatetime = selectedSlot.datetime;
    } else if (selectionMode === "custom" && customDate && customTime) {
      newDatetime = `${customDate}T${customTime}:00`;

      // Validate that the selected datetime is not in the past
      const selectedDateTime = new Date(newDatetime);
      const now = new Date();

      if (selectedDateTime <= now) {
        setConflictError(
          "Cannot schedule a session in the past. Please select a future time."
        );
        return;
      }

      // Validate that the selected datetime is within 2 weeks
      const twoWeeksFromNow = new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000
      );
      if (selectedDateTime > twoWeeksFromNow) {
        setConflictError(
          "Cannot schedule more than 2 weeks in advance. Please select an earlier date."
        );
        return;
      }
    } else {
      setConflictError(
        "Please select a time slot or enter a custom date and time."
      );
      return;
    }

    // Check for conflicts one more time
    const conflict = checkForConflict(newDatetime);
    if (conflict) {
      setConflictError(conflict);
      return;
    }

    const rescheduleData = {
      new_datetime: newDatetime,
      location: session?.location || "",
      meeting_link: session?.meeting_link || "",
    };

    onConfirm(rescheduleData);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Group available slots by date
  const groupedSlots = availableSlots.reduce((groups, slot) => {
    const date = slot.datetime.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});

  // Get date range for custom selection (next 2 weeks from today)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-neutral-silver z-10">
              <h3 className="text-lg font-semibold text-neutral-black">
                Reschedule Session
              </h3>
              <button
                onClick={handleClose}
                className="text-neutral-grey hover:text-neutral-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Current Session Info */}
              <div className="mb-6 bg-neutral-silver p-4 rounded-lg">
                <p className="text-neutral-black mb-2">
                  <span className="font-medium">Student:</span>{" "}
                  {session?.student}
                </p>
                <p className="text-neutral-black mb-2">
                  <span className="font-medium">Topic:</span> {session?.topic}
                </p>
                <p className="text-neutral-grey text-sm flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Current Time:</span>
                  <span>
                    {session?.scheduled_at
                      ? new Date(session.scheduled_at).toLocaleString()
                      : ""}
                  </span>
                </p>
              </div>

              {/* Mode Selection */}
              <div className="mb-6">
                <div className="flex space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectionMode("available");
                      setCustomDate("");
                      setConflictError("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectionMode === "available"
                        ? "bg-primary-600 text-white"
                        : "bg-neutral-silver text-neutral-grey hover:bg-neutral-light-grey"
                    }`}
                  >
                    Available Slots
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectionMode("custom");
                      setSelectedSlot(null);
                      setConflictError("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectionMode === "custom"
                        ? "bg-primary-600 text-white"
                        : "bg-neutral-silver text-neutral-grey hover:bg-neutral-light-grey"
                    }`}
                  >
                    Custom Date & Time
                  </button>
                </div>
              </div>

              {/* Available Slots Section */}
              {selectionMode === "available" && (
                <div className="mb-6">
                  <h4 className="font-medium text-neutral-black mb-3">
                    Select from Your Available Slots
                  </h4>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : Object.keys(groupedSlots).length === 0 ? (
                    <div className="text-center py-8 text-neutral-grey">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No available slots found for the next 2 weeks.</p>
                      <p className="text-sm">
                        Use custom date & time to schedule.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.keys(groupedSlots)
                        .sort()
                        .map((date) => (
                          <div
                            key={date}
                            className="border border-neutral-light-grey rounded-lg p-4"
                          >
                            <p className="font-medium text-neutral-black mb-3">
                              {new Date(date + "T00:00:00").toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {groupedSlots[date].map((slot) => {
                                const slotTime = new Date(slot.datetime);
                                const isSelected =
                                  selectedSlot?.datetime === slot.datetime;

                                return (
                                  <button
                                    key={slot.datetime}
                                    type="button"
                                    onClick={() => handleSlotSelect(slot)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                      isSelected
                                        ? "bg-primary-600 text-white"
                                        : "bg-neutral-silver text-neutral-black hover:bg-primary-100"
                                    }`}
                                  >
                                    {slotTime.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Custom Date & Time Section */}
              {selectionMode === "custom" && (
                <div className="mb-6">
                  <h4 className="font-medium text-neutral-black mb-3">
                    Select Custom Date & Time
                  </h4>
                  <p className="text-sm text-neutral-grey mb-4">
                    Choose any date within the next 2 weeks and select a start
                    time for your 1-hour session.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={customDate}
                        onChange={handleCustomDateChange}
                        min={minDate}
                        max={maxDate}
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required={selectionMode === "custom"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={customTime}
                        onChange={handleCustomTimeChange}
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required={selectionMode === "custom"}
                      />
                    </div>
                  </div>

                  {customDate && customTime && (
                    <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <p className="text-sm text-primary-700">
                        <span className="font-medium">Selected Time:</span>{" "}
                        {new Date(
                          `${customDate}T${customTime}:00`
                        ).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" (1 hour session)"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {conflictError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start space-x-2 p-3 bg-error/10 border border-error/30 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{conflictError}</p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-silver">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    loadingSlots ||
                    (selectionMode === "available" && !selectedSlot) ||
                    (selectionMode === "custom" && (!customDate || !customTime))
                  }
                >
                  {loading ? "Rescheduling..." : "Reschedule Session"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
