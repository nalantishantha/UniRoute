import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit3,
  Save,
  XCircle,
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const statusColors = {
  published: "bg-success/20 text-success border-success/30",
  draft: "bg-warning/20 text-yellow-600 border-warning/30",
  pending: "bg-info/20 text-info border-info/30",
  approved: "bg-blue-100/20 text-blue-600 border-blue-300/30",
  rejected: "bg-error/20 text-error border-error/30",
};

const CourseDetailModal = ({
  course,
  showModal,
  setShowModal,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update editedCourse when course prop changes
  useEffect(() => {
    if (course) {
      setEditedCourse({ ...course });
      setIsEditing(false); // Reset editing mode when course changes
    }
  }, [course]);

  if (!course) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCourse({ ...course });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCourse({ ...course });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(editedCourse);
      }
      setIsEditing(false);
    } catch (error) {
      // Error handling will be done by the parent component
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setEditedCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle course deletion
  const handleRemoveCourse = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove this course? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(course.id);
      }
    } catch (error) {
      // Error handling will be done by the parent component
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format price
  const formatPrice = (price, currency = "LKR") => {
    if (price === 0 || price === "0") {
      return "Free";
    }
    return `${currency} ${parseFloat(price).toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  // Capitalize status
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
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
                  <BookOpen className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-neutral-black">
                    Course Details
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <>
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        disabled={isDeleting}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Course
                      </Button>
                      <Button
                        onClick={handleRemoveCourse}
                        variant="destructive"
                        className="hover:bg-red-600 hover:text-white"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Removing...
                          </>
                        ) : (
                          "Remove Course"
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleCancel}
                        variant="ghost"
                        disabled={isSaving}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
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
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Course Image */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-black">
                    Course Thumbnail
                  </label>
                  <div className="relative">
                    {(
                      isEditing
                        ? editedCourse.thumbnail_url
                        : course.thumbnail_url
                    ) ? (
                      <img
                        src={
                          isEditing
                            ? editedCourse.thumbnail_url
                            : course.thumbnail_url
                        }
                        alt={isEditing ? editedCourse.title : course.title}
                        className="object-cover w-full h-64 rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-64 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <div className="text-center p-6">
                          <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                          <h3 className="text-2xl font-semibold text-primary-700 leading-tight">
                            {isEditing ? editedCourse.title : course.title}
                          </h3>
                        </div>
                      </div>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg bg-opacity-40">
                        <Button variant="outline" className="bg-white">
                          Change Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Course Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCourse.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-neutral-black">
                        {course.title}
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
                        value={editedCourse.category || ""}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="Computer Science">
                          Computer Science
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-neutral-grey">{course.category}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-black">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={editedCourse.status || ""}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Published">Published</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
                          statusColors[course.status]
                        } `}
                      >
                        {course.status}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {course.rating > 0 && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-neutral-black">
                        Rating
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(course.rating)}
                        </div>
                        <span className="text-sm font-medium text-neutral-black">
                          {course.rating} / 5
                        </span>
                      </div>
                    </div>
                  )}
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
                    value={editedCourse.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                ) : (
                  <p className="leading-relaxed text-neutral-grey">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Course Details Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Price */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-8 h-8 text-success" />
                      <div>
                        <p className="text-sm text-neutral-grey">Price</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editedCourse.price || ""}
                            onChange={(e) =>
                              handleInputChange("price", e.target.value)
                            }
                            className="w-full px-2 py-1 mt-1 border rounded border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          />
                        ) : (
                          <p className="font-semibold text-neutral-black">
                            ${course.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Duration */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-8 h-8 text-info" />
                      <div>
                        <p className="text-sm text-neutral-grey">Duration</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedCourse.duration || ""}
                            onChange={(e) =>
                              handleInputChange("duration", e.target.value)
                            }
                            className="w-full px-2 py-1 mt-1 border rounded border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          />
                        ) : (
                          <p className="font-semibold text-neutral-black">
                            {course.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enrollments */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-primary-600" />
                      <div>
                        <p className="text-sm text-neutral-grey">Students</p>
                        <p className="font-semibold text-neutral-black">
                          {course.enrollments}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Last Updated */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-8 h-8 text-warning" />
                      <div>
                        <p className="text-sm text-neutral-grey">Updated</p>
                        <p className="font-semibold text-neutral-black">
                          {course.lastUpdated}
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

export default CourseDetailModal;
