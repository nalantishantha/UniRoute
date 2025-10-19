import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Video } from "lucide-react";
import Button from "../../../components/ui/Button";
import ContentManagementSection from "./ContentManagementSection";

const ContentManagementModal = ({ course, showModal, setShowModal }) => {
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && course && (
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
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-silver">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="w-6 h-6 text-primary-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-black">
                      Course Content Management
                    </h2>
                    <p className="text-neutral-grey">{course.title}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 transition-colors rounded-lg hover:bg-neutral-silver"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Management Section */}
            <div className="p-6">
              <ContentManagementSection
                course={course}
                onUpdate={() => {
                  // Callback for when content is updated
                  // Could refresh course data here if needed
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentManagementModal;
