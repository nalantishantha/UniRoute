import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Calendar, MessageCircle } from "lucide-react";
import Button from "../../../components/ui/Button";

const FeedbackDetailModal = ({ feedback, showModal, setShowModal, onReply }) => {
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (showModal) {
      setReply("");
    }
  }, [showModal, feedback]);

  if (!feedback) return null;

  const handleClose = () => {
    setShowModal(false);
    setReply("");
  };

  const handleReply = () => {
    if (onReply && reply.trim()) {
      onReply(feedback, reply);
      setReply("");
      setShowModal(false);
    }
  };

  // Prefer feedback.student and feedback.email if available, fallback to userName/userEmail, then fallback to Anonymous/No email provided
  const studentName = feedback.student || feedback.userName || "Anonymous";
  const studentEmail = feedback.email || feedback.userEmail || "No email provided";
  const feedbackMessage = feedback.comment || feedback.message || "";

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-silver flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-neutral-black">Feedback Details</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4 mb-4">
                <User className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="font-semibold text-neutral-black">{studentName}</p>
                  <p className="text-sm text-neutral-grey">{studentEmail}</p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-neutral-grey" />
                  <span className="text-sm text-neutral-grey">{feedback.date || "Unknown date"}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">Feedback</label>
                <p className="text-neutral-grey leading-relaxed whitespace-pre-line">
                  {feedbackMessage}
                </p>
              </div>
              {/* Reply Section */}
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">Reply</label>
                <div className="flex flex-col space-y-2">
                  <textarea
                    rows="3"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    placeholder="Type your reply here..."
                  />
                  <div className="flex space-x-2 justify-end">
                    <Button variant="ghost" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleReply}
                      disabled={!reply.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackDetailModal;
