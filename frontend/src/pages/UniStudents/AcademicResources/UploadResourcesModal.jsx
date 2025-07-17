import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import Button from "../../../components/ui/Button";

const UploadResourcesModal = ({ showUploadModal, setShowUploadModal }) => {
  return (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowUploadModal(false)}
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
                  Upload Study Material
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-neutral-grey mt-1">
                Share your study materials with students
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  File Upload
                </label>
                <div className="border-2 border-dashed border-neutral-light-grey rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                  <Upload className="w-12 h-12 text-neutral-grey mx-auto mb-4" />
                  <p className="text-lg font-medium text-neutral-black mb-2">
                    Drop your files here
                  </p>
                  <p className="text-sm text-neutral-grey mb-4">
                    or click to browse
                  </p>
                  <Button variant="outline">Choose Files</Button>
                  <p className="text-xs text-neutral-light-grey mt-4">
                    Supports PDF, DOC, PPT, Images, Videos up to 50MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter resource title"
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
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the content and purpose of this resource"
                  className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Add tags separated by commas (e.g., calculus, derivatives, examples)"
                  className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
                <p className="text-xs text-neutral-grey mt-1">
                  Tags help students find your resources more easily
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="public"
                  className="rounded border-neutral-light-grey"
                />
                <label htmlFor="public" className="text-sm text-neutral-black">
                  Make this resource publicly available to all students
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-silver flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button>Upload Resource</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadResourcesModal;
