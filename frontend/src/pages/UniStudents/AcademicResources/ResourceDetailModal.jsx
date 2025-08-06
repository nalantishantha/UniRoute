import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit3,
  Save,
  XCircle,
  FileText,
  Download,
  Calendar,
  Star,
  User,
  Tag,
  BookOpen,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const statusColors = {
  Available: "bg-success/20 text-success border-success/30",
  Restricted: "bg-warning/20 text-yellow-600 border-warning/30",
  Premium: "bg-info/20 text-info border-info/30",
  Archived: "bg-error/20 text-error border-error/30",
};

const ResourceDetailModal = ({ resource, showModal, setShowModal, onSave, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResource, setEditedResource] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update editedResource when resource prop changes
  useEffect(() => {
    if (resource) {
      setEditedResource({ ...resource });
      setIsEditing(false); // Reset editing mode when resource changes
      setDeleteError(""); // Clear any previous delete errors
      setSaveError(""); // Clear any previous save errors
      setSaveSuccess(false); // Clear save success state
    }
  }, [resource]);

  if (!resource) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedResource({ ...resource });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedResource({ ...resource });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    if (onSave) {
      const result = await onSave(editedResource);
      if (result && result.success) {
        setSaveSuccess(true);
        setIsEditing(false);
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError(result?.message || "Failed to save changes");
      }
    }
    setIsSaving(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowModal(false);
    setDeleteError("");
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleRemoveResource = async () => {
    if (window.confirm(`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      setDeleteError("");

      if (onRemove) {
        const result = await onRemove(resource);
        if (!result.success) {
          setDeleteError(result.message || "Failed to delete resource");
          setIsDeleting(false);
        }
        // If successful, the modal will close automatically from the parent component
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedResource(prev => ({
      ...prev,
      [field]: value
    }));
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
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-silver">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-neutral-black">
                    Resource Details
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <>
                      <Button onClick={handleEdit} variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Resource
                      </Button>
                      <Button
                        onClick={handleRemoveResource}
                        variant="destructive"
                        className="hover:bg-red-600 hover:text-white"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {isDeleting ? "Deleting..." : "Remove Resource"}
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button onClick={handleCancel} variant="ghost">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-2 transition-colors rounded-lg hover:bg-neutral-silver"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Delete Error Message */}
              {deleteError && (
                <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-800">{deleteError}</p>
                </div>
              )}

              {/* Save Error Message */}
              {saveError && (
                <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-800">{saveError}</p>
                </div>
              )}

              {/* Save Success Message */}
              {saveSuccess && (
                <div className="p-3 mt-4 border border-green-200 rounded-lg bg-green-50">
                  <p className="text-sm text-green-800">✅ Resource updated successfully!</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Resource Preview */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Resource Preview
                  </label>
                  <div className="relative">
                    {resource.thumbnail ? (
                      <img
                        src={isEditing ? editedResource.thumbnail : resource.thumbnail}
                        alt={isEditing ? editedResource.title : resource.title}
                        className="object-cover w-full h-64 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-64 rounded-lg bg-neutral-silver/30">
                        <FileText className="w-16 h-16 text-neutral-light-grey" />
                      </div>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg bg-opacity-40">
                        <Button variant="outline" className="bg-white">
                          Change Thumbnail
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button variant="primary" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resource
                    </Button>
                  </div>
                </div>

                {/* Resource Info */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Resource Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedResource.title || ""}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-neutral-black">
                        {resource.title}
                      </h3>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Category
                    </label>
                    {isEditing ? (
                      <select
                        value={editedResource.category || ""}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      >
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Information Systems">Information Systems</option>
                        <option value="DSA">DSA</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-neutral-grey">{resource.category}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={editedResource.status || ""}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      >
                        <option value="Available">Available</option>
                        <option value="Restricted">Restricted</option>
                        <option value="Premium">Premium</option>
                        <option value="Archived">Archived</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${statusColors[resource.status] || "bg-neutral-silver text-neutral-grey"
                          }`}
                      >
                        {resource.status || "Available"}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {resource.rating > 0 && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-neutral-black">
                        Rating
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(resource.rating)}
                        </div>
                        <span className="text-sm font-medium text-neutral-black">
                          {resource.rating} / 5
                        </span>
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      File Information
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="File Type (e.g., PDF, DOCX)"
                          value={editedResource.file_type || ""}
                          onChange={(e) => handleInputChange("file_type", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        />
                        <input
                          type="text"
                          placeholder="File Size (e.g., 2.5 MB)"
                          value={editedResource.file_size || ""}
                          onChange={(e) => handleInputChange("file_size", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 text-sm rounded bg-neutral-silver/30 text-neutral-grey">
                          {resource.file_type || "PDF"}
                        </span>
                        <span className="text-sm text-neutral-grey">
                          {resource.file_size || "1.2 MB"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-neutral-black">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    rows="4"
                    value={editedResource.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                ) : (
                  <p className="leading-relaxed text-neutral-grey">
                    {resource.description || "No description provided."}
                  </p>
                )}
              </div>

              {/* Resource Details Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Related Course */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-8 h-8 text-primary-600" />
                      <div>
                        <p className="text-sm text-neutral-grey">Related Course</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedResource.related_course || ""}
                            onChange={(e) => handleInputChange("relatedCourse", e.target.value)}
                            className="w-full px-2 py-1 mt-1 border rounded border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          />
                        ) : (
                          <p className="font-semibold text-neutral-black">
                            {resource.related_course || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Author/Uploaded By */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-8 h-8 text-info" />
                      <div>
                        <p className="text-sm text-neutral-grey">Author</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedResource.author || ""}
                            onChange={(e) => handleInputChange("author", e.target.value)}
                            className="w-full px-2 py-1 mt-1 border rounded border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          />
                        ) : (
                          <p className="font-semibold text-neutral-black">
                            {resource.author || "Unknown"}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Tag className="w-8 h-8 text-warning" />
                      <div>
                        <p className="text-sm text-neutral-grey">Tags</p>
                        {isEditing ? (
                          <input
                            type="text"
                            placeholder="Comma-separated tags"
                            value={Array.isArray(editedResource.tags) ? editedResource.tags.join(', ') : editedResource.tags || ""}
                            onChange={(e) => handleInputChange("tags", e.target.value.split(',').map(tag => tag.trim()))}
                            className="w-full px-2 py-1 mt-1 border rounded border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          />
                        ) : (
                          <p className="font-semibold text-neutral-black">
                            {Array.isArray(resource.tags) ? resource.tags.join(', ') : resource.tags || "No tags"}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upload Date */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-8 h-8 text-success" />
                      <div>
                        <p className="text-sm text-neutral-grey">Uploaded</p>
                        <p className="font-semibold text-neutral-black">
                          {resource.uploadDate || resource.created_at || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResourceDetailModal;