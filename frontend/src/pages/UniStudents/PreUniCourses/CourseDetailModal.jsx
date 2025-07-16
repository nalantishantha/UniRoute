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
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const statusColors = {
  Published: "bg-success/20 text-success border-success/30",
  Draft: "bg-warning/20 text-yellow-600 border-warning/30",
  Pending: "bg-info/20 text-info border-info/30",
  Rejected: "bg-error/20 text-error border-error/30",
};

const CourseDetailModal = ({ course, showModal, setShowModal, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState({});

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

  const handleSave = () => {
    if (onSave) {
      onSave(editedCourse);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setEditedCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Placeholder for remove course handler
  const handleRemoveCourse = () => {
    // TODO: Implement remove logic or call parent handler
    if (window.confirm('Are you sure you want to remove this course?')) {
      // You can call a prop like onRemove(course) here
      alert('Course removed (implement actual logic)');
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
                      <Button onClick={handleEdit} variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Course
                      </Button>
                      <Button onClick={handleRemoveCourse} variant="destructive">
                        Remove Course
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
                {/* Course Image */}
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Course Thumbnail
                  </label>
                  <div className="relative">
                    <img
                      src={isEditing ? editedCourse.thumbnail : course.thumbnail}
                      alt={isEditing ? editedCourse.title : course.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
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
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Course Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCourse.title || ""}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-neutral-black">
                        {course.title}
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
                        value={editedCourse.category || ""}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-neutral-grey">{course.category}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={editedCourse.status || ""}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Published">Published</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span
                        className={`inline - flex px - 3 py - 1 text - sm font - medium rounded - full border ${statusColors[course.status]
                          } `}
                      >
                        {course.status}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {course.rating > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">
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
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    rows="4"
                    value={editedCourse.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                ) : (
                  <p className="text-neutral-grey leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Course Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            onChange={(e) => handleInputChange("price", e.target.value)}
                            className="w-full mt-1 px-2 py-1 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
                            onChange={(e) => handleInputChange("duration", e.target.value)}
                            className="w-full mt-1 px-2 py-1 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
