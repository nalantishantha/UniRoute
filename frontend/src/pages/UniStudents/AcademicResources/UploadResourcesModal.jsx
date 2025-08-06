import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import Button from "../../../components/ui/Button";

const UploadResourcesModal = ({ showUploadModal, setShowUploadModal }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Mathematics");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Available");
  const [author, setAuthor] = useState("");
  const [related_course, setRelatedCourse] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setSuccess(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
      setSuccess(false);
    }
  };

  // In handleSubmit function, after successful upload:
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess(false);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean)));
    formData.append("status", status)
    formData.append("author", author)
    formData.append("related_course", related_course)
    formData.append("is_public", isPublic);
    formData.append("file", file);
    formData.append("uploaded_by_id", 1); // TODO: Replace with actual user ID

    try {
      const response = await fetch("/api/resources/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        // Reset form fields
        setTitle("");
        setCategory("None");
        setDescription("");
        setTags("");
        setStatus("");
        setAuthor("");
        setRelatedCourse("");
        setIsPublic(true);
        setFile(null);
        // Call success callback to refresh resources
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        // Auto close modal after 2 seconds
        setTimeout(() => {
          setShowUploadModal(false);
          setSuccess(false);
        }, 2000);
      } else {
        setError(data.message || "Upload failed.");
      }
    } catch (err) {
      setError("Network error.");
    }
    setUploading(false);
  };


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
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-neutral-silver">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-black">
                    Upload Study Material
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 transition-colors rounded-lg hover:bg-neutral-silver"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-1 text-neutral-grey">
                  Share your study materials with students
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div onClick={() => fileInputRef.current.click()}>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    File Upload
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                      ? "border-primary-400 bg-primary-50"
                      : "border-neutral-light-grey"
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{ cursor: "pointer" }}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-grey" />
                    <p className="mb-2 text-lg font-medium text-neutral-black">
                      {file ? file.name : "Drop your files here"}
                    </p>
                    <p className="mb-4 text-sm text-neutral-grey">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        fileInputRef.current.click();
                      }}
                    >
                      Choose Files
                    </Button>
                    <p className="mt-4 text-xs text-neutral-light-grey">
                      Supports PDF, DOC, PPT, Images, Videos up to 50MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter resource title"
                      required
                      className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      <option>Software Engineering</option>
                      <option>Electronics</option>
                      <option>Information Systems</option>
                      <option>DSA</option>
                      <option>Mathematics</option>
                      <option>Physics</option>
                      <option>Computer Science</option>
                      <option>Chemistry</option>
                      <option>Biology</option>
                      <option>English</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the content and purpose of this resource"
                    required
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="Add tags separated by commas (e.g., calculus, derivatives, examples)"
                      className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                    <p className="mt-1 text-xs text-neutral-grey">
                      Tags help students find your resources more easily
                    </p>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      <option>Available</option>
                      <option>Premium</option>
                      <option>Restricted</option>
                      <option>Archieved</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Author
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Related Course
                    </label>
                    <input
                      type="text"
                      value={related_course}
                      onChange={e => setRelatedCourse(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="public"
                    checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)}
                    className="rounded border-neutral-light-grey"
                  />
                  <label htmlFor="public" className="text-sm text-neutral-black">
                    Make this resource publicly available to all students
                  </label>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <p className="font-semibold text-center text-green-800">
                      ✅ File uploaded successfully!
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-center text-red-800">{error}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end p-6 space-x-3 border-t border-neutral-silver">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Resource"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadResourcesModal;