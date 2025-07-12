import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import Button from "../../../components/ui/Button";

const CreateCourseModal = ({ showCreateModal, setShowCreateModal }) => {
  return (
    <AnimatePresence>
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-silver">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-black">
                  Create New Course
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-neutral-grey mt-1">
                Fill in the details to create your new pre-university course
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course title"
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400">
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe your course content and objectives"
                  className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 8 weeks"
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Difficulty
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Course Thumbnail
                </label>
                <div className="border-2 border-dashed border-neutral-light-grey rounded-lg p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-neutral-silver rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-neutral-grey" />
                  </div>
                  <p className="text-sm text-neutral-grey">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-neutral-light-grey mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-silver flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button>Create Course</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCourseModal;
