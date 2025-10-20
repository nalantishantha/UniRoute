import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function RescheduleSessionModal({
  isOpen,
  session,
  onClose,
  onConfirm,
  loading,
}) {
  const [formData, setFormData] = useState({
    new_date: "",
    new_start_time: "",
    new_end_time: "",
    reason: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      // Reset form when modal opens
      setFormData({
        new_date: "",
        new_start_time: session.start_time || "",
        new_end_time: session.end_time || "",
        reason: "",
      });
      setError(null);
    }
  }, [session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.new_date ||
      !formData.new_start_time ||
      !formData.new_end_time
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate that end time is after start time
    if (formData.new_start_time >= formData.new_end_time) {
      setError("End time must be after start time");
      return;
    }

    // Validate that new date is not in the past
    const selectedDate = new Date(formData.new_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Cannot reschedule to a past date");
      return;
    }

    onConfirm({
      booking_id: session.booking_id,
      original_date: session.date,
      new_date: formData.new_date,
      new_start_time: formData.new_start_time,
      new_end_time: formData.new_end_time,
      reason: formData.reason,
      requested_by: "tutor",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-accent-100">
            <h2 className="text-2xl font-display font-bold text-primary-900">
              Reschedule Session
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent-50 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-primary-300" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Current Session Info */}
            {session && (
              <div className="bg-accent-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Current Session
                </h3>
                <div className="flex items-center space-x-2 text-sm text-neutral-grey">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(session.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-grey">
                  <Clock className="h-4 w-4" />
                  <span>
                    {session.start_time} - {session.end_time}
                  </span>
                </div>
                <p className="text-sm text-neutral-grey">
                  <span className="font-medium">Student:</span>{" "}
                  {session.student_name}
                </p>
                <p className="text-smt text-neutral-grey">
                  <span className="font-medium">Subject:</span>{" "}
                  {session.subject}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* New Date */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                New Date <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
                <input
                  type="date"
                  value={formData.new_date}
                  onChange={(e) =>
                    setFormData({ ...formData, new_date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* New Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Start Time <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
                  <input
                    type="time"
                    value={formData.new_start_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        new_start_time: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  End Time <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-300" />
                  <input
                    type="time"
                    value={formData.new_end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, new_end_time: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Reason for Rescheduling (Optional)
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                placeholder="Explain why you need to reschedule this session..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Rescheduling..." : "Confirm Reschedule"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
