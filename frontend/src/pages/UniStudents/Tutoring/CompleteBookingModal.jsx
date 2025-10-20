import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, BookOpen, Users } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function CompleteBookingModal({
  isOpen,
  booking,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen || !booking) return null;

  const canComplete = booking.sessions_completed === booking.sessions_total;

  const handleConfirm = () => {
    onConfirm(booking.booking_id);
  };

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
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-accent-100">
            <h2 className="text-2xl font-display font-bold text-primary-900">
              Complete Booking
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent-50 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-primary-300" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Booking Info */}
            <div className="bg-accent-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary-400" />
                <span className="font-semibold text-primary-900">
                  {booking.subject}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary-400" />
                <span className="text-primary-300">
                  Student: {booking.student_name}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-accent-200">
                <span className="text-sm text-primary-300">
                  Sessions Completed:
                </span>
                <span className="font-semibold text-primary-900">
                  {booking.sessions_completed} / {booking.sessions_total}
                </span>
              </div>
            </div>

            {/* Confirmation Message */}
            {canComplete ? (
              <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Ready to Complete</p>
                  <p>
                    All {booking.sessions_total} sessions have been completed.
                    You can now mark this booking as completed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-warning/10 border border-warning/30 text-warning px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Cannot Complete Yet</p>
                  <p>
                    Only {booking.sessions_completed} of{" "}
                    {booking.sessions_total} sessions have been completed. All
                    sessions must be completed before marking this booking as
                    complete.
                  </p>
                </div>
              </div>
            )}

            {/* Session List */}
            {booking.all_sessions && booking.all_sessions.length > 0 && (
              <div>
                <h3 className="font-semibold text-primary-900 mb-3">
                  Session Status
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {booking.all_sessions.map((session, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        session.status === "completed"
                          ? "bg-success/10 border border-success/20"
                          : session.is_expired
                          ? "bg-error/10 border border-error/20"
                          : "bg-accent-50 border border-accent-200"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-primary-900">
                          Session {session.session_number}
                        </p>
                        <p className="text-xs text-primary-300">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
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
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                type="button"
                variant="success"
                onClick={handleConfirm}
                className="flex-1"
                disabled={loading || !canComplete}
              >
                {loading ? "Completing..." : "Mark as Completed"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
