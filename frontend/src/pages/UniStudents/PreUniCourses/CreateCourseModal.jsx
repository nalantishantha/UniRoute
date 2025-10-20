import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, AlertCircle } from "lucide-react";
import Button from "../../../components/ui/Button";
import {
  utilityAPI,
  handleAPIError,
  cloudinaryUpload,
} from "../../../utils/preUniCoursesAPI";

const CreateCourseModal = ({
  showCreateModal,
  setShowCreateModal,
  onCreateCourse,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
  });
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Load categories and levels when modal opens
  useEffect(() => {
    if (showCreateModal) {
      loadUtilityData();
    }
  }, [showCreateModal]);

  const loadUtilityData = async () => {
    try {
      const [categoriesRes, levelsRes] = await Promise.all([
        utilityAPI.getCategories(),
        utilityAPI.getLevels(),
      ]);

      if (categoriesRes.success) {
        setCategories(categoriesRes.categories);
      }
      if (levelsRes.success) {
        setLevels(levelsRes.levels);
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to load form data"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file for the thumbnail");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Thumbnail file size must be less than 5MB");
        return;
      }

      setThumbnailFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    // Clear the file input
    const fileInput = document.getElementById("thumbnail-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const uploadThumbnailToCloudinary = async (file) => {
    try {
      return await cloudinaryUpload.uploadImage(file, {
        width: 800,
        height: 450,
        crop: "fill",
      });
    } catch (error) {
      throw new Error(`Failed to upload thumbnail: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let courseData = { ...formData };

      // Upload thumbnail if selected
      if (thumbnailFile) {
        setUploadingThumbnail(true);
        try {
          const thumbnailData = await uploadThumbnailToCloudinary(
            thumbnailFile
          );
          courseData.thumbnail_url = thumbnailData.url;
          courseData.thumbnail_public_id = thumbnailData.public_id;
        } catch (uploadError) {
          // Continue without thumbnail if upload fails
          console.warn("Thumbnail upload failed:", uploadError.message);
          setError(
            `Warning: ${uploadError.message} Course will be created without thumbnail.`
          );
        } finally {
          setUploadingThumbnail(false);
        }
      }

      await onCreateCourse(courseData);

      // Reset form on success
      setFormData({
        title: "",
        description: "",
        category: "",
        level: "",
        price: 0,
      });
      setThumbnailFile(null);
      setThumbnailPreview(null);
    } catch (err) {
      setError(handleAPIError(err, "Failed to create course"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setError(null);
    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      level: "",
      price: 0,
    });
  };
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
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-neutral-silver">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-black">
                    Create New Course
                  </h2>
                  <button
                    type="button"
                    onClick={handleClose}
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
                {/* Error Alert */}
                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                    <p className="text-error text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter course title"
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Description *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your course content and objectives"
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Price (LKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0 for free course"
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                    <p className="text-xs text-neutral-grey mt-1">
                      Set to 0 for free course
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) =>
                        handleInputChange("level", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      <option value="">Select difficulty level</option>
                      {levels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Course Thumbnail (Optional)
                  </label>

                  {!thumbnailPreview ? (
                    <div
                      className="border-2 border-dashed border-neutral-light-grey rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                      onClick={() =>
                        document.getElementById("thumbnail-upload").click()
                      }
                    >
                      <div className="w-12 h-12 mx-auto mb-4 bg-neutral-silver rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-neutral-grey" />
                      </div>
                      <p className="text-sm text-neutral-grey mb-2">
                        Click to upload course thumbnail
                      </p>
                      <p className="text-xs text-neutral-light-grey">
                        PNG, JPG up to 5MB. If no thumbnail is uploaded, course
                        name will be displayed.
                      </p>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative border-2 border-neutral-light-grey rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    What happens next?
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your course will be saved as a draft</li>
                    <li>
                      • You can add videos and content in the course editor
                    </li>
                    <li>• Submit for review when ready to publish</li>
                    <li>• Students can enroll once approved</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-silver flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || uploadingThumbnail}>
                  {uploadingThumbnail
                    ? "Uploading thumbnail..."
                    : loading
                    ? "Creating..."
                    : "Create Course"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCourseModal;
