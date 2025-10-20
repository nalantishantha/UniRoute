import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Calendar, MessageCircle, Users, GraduationCap, BookOpen, Star } from "lucide-react";
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
  const studentEmail = feedback.student_email || feedback.email || feedback.userEmail || "No email provided";
  const feedbackMessage = feedback.comment || feedback.message || "";

  const getServiceTypeIcon = (serviceType) => {
    switch (serviceType) {
      case "mentoring":
        return <Users className="w-5 h-5 text-blue-600" />;
      case "tutoring":
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-neutral-grey" />;
    }
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case "mentoring":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "tutoring":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-300";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating
          ? "text-warning fill-current"
          : "text-neutral-light-grey"
          }`}
      />
    ));
  };

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
            <div className="flex items-center justify-between p-6 border-b border-neutral-silver">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-neutral-black">Feedback Details</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 transition-colors rounded-lg hover:bg-neutral-silver"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                  <span className="text-lg font-semibold text-primary-600">
                    {studentName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-black">{studentName}</p>
                  <p className="text-sm text-neutral-grey">{studentEmail}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-neutral-grey" />
                  <span className="text-sm text-neutral-grey">{feedback.date || "Unknown date"}</span>
                </div>
              </div>

              {/* Service Type and Course */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">Service Type</label>
                  <div className={`px-3 py-2 rounded-lg border ${getServiceTypeColor(feedback.service_type)} flex items-center space-x-2`}>
                    {getServiceTypeIcon(feedback.service_type)}
                    <span className="text-sm font-medium capitalize">{feedback.service_type}</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">Subject/Topic</label>
                  <div className="px-3 py-2 border rounded-lg border-neutral-300 bg-neutral-50">
                    <span className="text-sm text-neutral-700">{feedback.course}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              {feedback.rating && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">Rating</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className="text-sm text-neutral-grey">({feedback.rating}/5)</span>
                  </div>
                </div>
              )}

              {/* Session Details (if available) */}
              {feedback.session_details && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">Session Details</label>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {feedback.session_details.topic && (
                        <div>
                          <span className="text-neutral-grey">Topic:</span>
                          <span className="ml-2 text-neutral-black">{feedback.session_details.topic}</span>
                        </div>
                      )}
                      {feedback.session_details.session_type && (
                        <div>
                          <span className="text-neutral-grey">Type:</span>
                          <span className="ml-2 capitalize text-neutral-black">{feedback.session_details.session_type}</span>
                        </div>
                      )}
                      {feedback.session_details.duration && (
                        <div className="col-span-2">
                          <span className="text-neutral-grey">Duration:</span>
                          <span className="ml-2 text-neutral-black">{feedback.session_details.duration} minutes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Message */}
              <div>
                <label className="block mb-2 text-sm font-medium text-neutral-black">Feedback</label>
                <p className="p-4 leading-relaxed whitespace-pre-line rounded-lg text-neutral-grey bg-neutral-50">
                  {feedbackMessage || "No feedback message provided"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackDetailModal;

