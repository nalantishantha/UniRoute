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

  // Update editedResource when resource prop changes
  useEffect(() => {
    if (resource) {
      setEditedResource({ ...resource });
      setIsEditing(false); // Reset editing mode when resource changes
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

  const handleSave = () => {
    if (onSave) {
      onSave(editedResource);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowModal(false);
  };

  const handleRemoveResource = () => {
    if (window.confirm('Are you sure you want to remove this resource?')) {
      if (onRemove) {
        onRemove(resource);
      }
      setShowModal(false);
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
                      <Button onClick={handleRemoveResource} variant="destructive" className="hover:bg-red-600 hover:text-white">
                        Remove Resource
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button onClick={handleCancel} variant="ghost">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resource Preview */}
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Resource Preview
                  </label>
                  <div className="relative">
                    {resource.thumbnail ? (
                      <img
                        src={isEditing ? editedResource.thumbnail : resource.thumbnail}
                        alt={isEditing ? editedResource.title : resource.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-neutral-silver/30 flex items-center justify-center rounded-lg">
                        <FileText className="w-16 h-16 text-neutral-light-grey" />
                      </div>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
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
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Resource Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedResource.title || ""}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-neutral-black">
                        {resource.title}
                      </h3>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Category
                    </label>
                    {isEditing ? (
                      <select
                        value={editedResource.category || ""}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      >
                        <option value="Notes">Notes</option>
                        <option value="E-Book">E-Book</option>
                        <option value="Practice Test">Practice Test</option>
                        <option value="Research Paper">Research Paper</option>
                        <option value="Study Guide">Study Guide</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-neutral-grey">{resource.category}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={editedResource.status || ""}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
                        {resource.status}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {resource.rating > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
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
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      File Information
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="File Type (e.g., PDF, DOCX)"
                          value={editedResource.fileType || ""}
                          onChange={(e) => handleInputChange("fileType", e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        />
                        <input
                          type="text"
                          placeholder="File Size (e.g., 2.5 MB)"
                          value={editedResource.fileSize || ""}
                          onChange={(e) => handleInputChange("fileSize", e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-neutral-silver/30 text-neutral-grey rounded text-sm">
                          {resource.fileType || "PDF"}
                        </span>
                        <span className="text-sm text-neutral-grey">
                          {resource.fileSize || "1.2 MB"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    rows="4"
                    value={editedResource.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                ) : (
                  <p className="text-neutral-grey leading-relaxed">
                    {resource.description || "No description provided."}
                  </p>
                )}
              </div>

              {/* Resource Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            value={editedResource.relatedCourse || ""}
                            onChange={(e) => handleInputChange("relatedCourse", e.target.value)}
                            className="w-full mt-1 px-2 py-1 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          />
                        ) : (
                          <p className="font-semibold text-neutral-black">
                            {resource.relatedCourse || "N/A"}
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
                            className="w-full mt-1 px-2 py-1 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
                            value={editedResource.tags || ""}
                            onChange={(e) => handleInputChange("tags", e.target.value)}
                            className="w-full mt-1 px-2 py-1 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          />
                        ) : (
                          <p className="font-semibold text-neutral-black">
                            {resource.tags || "No tags"}
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
                          {resource.uploadDate || "Not specified"}
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
