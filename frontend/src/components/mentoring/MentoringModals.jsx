import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
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
}) {
  const [scheduleData, setScheduleData] = useState({
    scheduled_datetime: "",
    location: "",
    meeting_link: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (scheduleData.scheduled_datetime) {
      onConfirm(scheduleData);
    }
  };

  const handleClose = () => {
    setScheduleData({
      scheduled_datetime: "",
      location: "",
      meeting_link: "",
    });
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
                Schedule Session
              </h3>
              <button
                onClick={handleClose}
                className="text-neutral-grey hover:text-neutral-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <p className="text-neutral-black mb-2">
                  <span className="font-medium">Student:</span>{" "}
                  {request?.student}
                </p>
                <p className="text-neutral-black mb-2">
                  <span className="font-medium">Topic:</span> {request?.topic}
                </p>
                <p className="text-neutral-grey text-sm">
                  <span className="font-medium">Preferred Time:</span>{" "}
                  {request?.preferred_time}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Schedule Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleData.scheduled_datetime}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        scheduled_datetime: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    required
                  />
                </div>

                {request?.session_type === "physical" && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={scheduleData.location}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          location: e.target.value,
                        })
                      }
                      placeholder="Enter meeting location"
                      className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                )}

                {request?.session_type === "online" && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={scheduleData.meeting_link}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          meeting_link: e.target.value,
                        })
                      }
                      placeholder="Enter meeting link (e.g., Zoom, Teams)"
                      className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                )}
              </div>

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
                  disabled={loading || !scheduleData.scheduled_datetime}
                >
                  {loading ? "Scheduling..." : "Schedule Session"}
                </Button>
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
}) {
  const [rescheduleData, setRescheduleData] = useState({
    new_datetime: "",
    location: session?.location || "",
    meeting_link: session?.meeting_link || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rescheduleData.new_datetime) {
      onConfirm(rescheduleData);
    }
  };

  const handleClose = () => {
    setRescheduleData({
      new_datetime: "",
      location: session?.location || "",
      meeting_link: session?.meeting_link || "",
    });
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
              <div className="mb-6">
                <p className="text-neutral-black mb-2">
                  <span className="font-medium">Student:</span>{" "}
                  {session?.student}
                </p>
                <p className="text-neutral-black mb-2">
                  <span className="font-medium">Topic:</span> {session?.topic}
                </p>
                <p className="text-neutral-grey text-sm">
                  <span className="font-medium">Current Time:</span>{" "}
                  {session?.scheduled_at
                    ? new Date(session.scheduled_at).toLocaleString()
                    : ""}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    New Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={rescheduleData.new_datetime}
                    onChange={(e) =>
                      setRescheduleData({
                        ...rescheduleData,
                        new_datetime: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    required
                  />
                </div>

                {session?.session_type === "physical" && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={rescheduleData.location}
                      onChange={(e) =>
                        setRescheduleData({
                          ...rescheduleData,
                          location: e.target.value,
                        })
                      }
                      placeholder="Enter meeting location"
                      className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                )}

                {session?.session_type === "online" && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={rescheduleData.meeting_link}
                      onChange={(e) =>
                        setRescheduleData({
                          ...rescheduleData,
                          meeting_link: e.target.value,
                        })
                      }
                      placeholder="Enter meeting link (e.g., Zoom, Teams)"
                      className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                )}
              </div>

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
                  disabled={loading || !rescheduleData.new_datetime}
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
