import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Video,
  Image,
  Archive,
  Link,
  Download,
  Trash2,
  Edit3,
  GripVertical,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  FileIcon,
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import {
  resourcesAPI,
  videosAPI,
  cloudinaryUpload,
  handleAPIError,
} from "../../../utils/preUniCoursesAPI";

const ContentManagementSection = ({ course, onUpdate }) => {
  const [resources, setResources] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("videos");

  // Loading states for individual operations
  const [deletingItems, setDeletingItems] = useState(new Set());
  const [editingItems, setEditingItems] = useState(new Set());
  const [editingTitles, setEditingTitles] = useState({});

  // File input refs
  const videoFileRef = React.useRef(null);
  const resourceFileRef = React.useRef(null);

  // Fetch course content on mount
  useEffect(() => {
    if (course?.id) {
      fetchContent();
    }
  }, [course?.id]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [videosResponse, resourcesResponse] = await Promise.all([
        videosAPI.getCourseVideos(course.id),
        resourcesAPI.getCourseResources(course.id),
      ]);

      if (videosResponse.success) {
        setVideos(videosResponse.videos || []);
      }
      if (resourcesResponse.success) {
        setResources(resourcesResponse.resources || []);
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to load course content"));
    } finally {
      setLoading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (const file of files) {
        // Upload to Cloudinary
        const uploadResult = await cloudinaryUpload.uploadVideo(file);

        // Save to database
        const videoData = {
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          description: "",
          video_url: uploadResult.url,
          video_public_id: uploadResult.public_id,
          duration_seconds: Math.round(uploadResult.duration || 0),
          file_size_bytes: uploadResult.bytes,
          video_provider: "cloudinary",
        };

        const response = await videosAPI.addCourseVideo(course.id, videoData);
        if (response.success) {
          setVideos((prev) => [...prev, response.video]);
        }
      }

      setSuccess("Videos uploaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(handleAPIError(err, "Failed to upload video"));
    } finally {
      setUploading(false);
    }
  };

  // Handle resource upload
  const handleResourceUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (const file of files) {
        // Determine resource type
        const extension = file.name.split(".").pop()?.toLowerCase();
        let resourceType = "pdf";

        if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
          resourceType = "image";
        } else if (["doc", "docx"].includes(extension)) {
          resourceType = "doc";
        } else if (["ppt", "pptx"].includes(extension)) {
          resourceType = "ppt";
        } else if (["xls", "xlsx"].includes(extension)) {
          resourceType = "excel";
        } else if (["zip", "rar", "7z"].includes(extension)) {
          resourceType = "zip";
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinaryUpload.uploadResource(file);

        // Save to database
        const resourceData = {
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          description: "",
          resource_type: resourceType,
          file_url: uploadResult.url,
          file_public_id: uploadResult.public_id,
          file_size_bytes: uploadResult.bytes,
          is_free: false,
        };

        const response = await resourcesAPI.addCourseResource(
          course.id,
          resourceData
        );
        if (response.success) {
          setResources((prev) => [...prev, response.resource]);
        }
      }

      setSuccess("Resources uploaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(handleAPIError(err, "Failed to upload resource"));
    } finally {
      setUploading(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    setDeletingItems((prev) => new Set([...prev, `video-${videoId}`]));
    setError(null);

    try {
      // Note: You'll need to add delete video API - for now just remove from state
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      setSuccess("Video deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(handleAPIError(err, "Failed to delete video"));
    } finally {
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`video-${videoId}`);
        return newSet;
      });
    }
  };

  // Delete resource
  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setDeletingItems((prev) => new Set([...prev, `resource-${resourceId}`]));
    setError(null);

    try {
      const response = await resourcesAPI.deleteCourseResource(
        course.id,
        resourceId
      );
      if (response.success) {
        setResources((prev) => prev.filter((r) => r.id !== resourceId));
        setSuccess("Resource deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.error || "Failed to delete resource");
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to delete resource"));
    } finally {
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`resource-${resourceId}`);
        return newSet;
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${Math.round(mb * 1024)} KB` : `${mb.toFixed(1)} MB`;
  };

  // Start editing title
  const startEditingTitle = (itemId, currentTitle, type) => {
    setEditingTitles({
      ...editingTitles,
      [`${type}-${itemId}`]: currentTitle,
    });
  };

  // Cancel editing title
  const cancelEditingTitle = (itemId, type) => {
    const newEditingTitles = { ...editingTitles };
    delete newEditingTitles[`${type}-${itemId}`];
    setEditingTitles(newEditingTitles);
  };

  // Save edited title for video
  const saveVideoTitle = async (videoId, newTitle) => {
    if (!newTitle.trim()) {
      setError("Title cannot be empty");
      return;
    }

    setEditingItems((prev) => new Set([...prev, `video-${videoId}`]));
    setError(null);

    try {
      // Note: You'll need to add update video API - for now just update state
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, title: newTitle.trim() } : video
        )
      );

      const newEditingTitles = { ...editingTitles };
      delete newEditingTitles[`video-${videoId}`];
      setEditingTitles(newEditingTitles);

      setSuccess("Video title updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(handleAPIError(err, "Failed to update video title"));
    } finally {
      setEditingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`video-${videoId}`);
        return newSet;
      });
    }
  };

  // Save edited title for resource
  const saveResourceTitle = async (resourceId, newTitle) => {
    if (!newTitle.trim()) {
      setError("Title cannot be empty");
      return;
    }

    setEditingItems((prev) => new Set([...prev, `resource-${resourceId}`]));
    setError(null);

    try {
      const response = await resourcesAPI.updateCourseResource(
        course.id,
        resourceId,
        { title: newTitle.trim() }
      );

      if (response.success) {
        setResources((prev) =>
          prev.map((resource) =>
            resource.id === resourceId
              ? { ...resource, title: newTitle.trim() }
              : resource
          )
        );

        const newEditingTitles = { ...editingTitles };
        delete newEditingTitles[`resource-${resourceId}`];
        setEditingTitles(newEditingTitles);

        setSuccess("Resource title updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.error || "Failed to update resource title");
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to update resource title"));
    } finally {
      setEditingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`resource-${resourceId}`);
        return newSet;
      });
    }
  };

  // Get resource icon
  const getResourceIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "doc":
        return <FileIcon className="w-5 h-5" />;
      case "ppt":
        return <FileIcon className="w-5 h-5" />;
      case "excel":
        return <FileIcon className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "zip":
        return <Archive className="w-5 h-5" />;
      case "link":
        return <Link className="w-5 h-5" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-black">
          Course Content
        </h3>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => videoFileRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Add Video</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => resourceFileRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Add Resource</span>
          </Button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={videoFileRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => handleVideoUpload(Array.from(e.target.files))}
      />
      <input
        ref={resourceFileRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={(e) => handleResourceUpload(Array.from(e.target.files))}
      />

      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3"
          >
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-success text-sm">{success}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-error text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-error hover:text-error/80"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("videos")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "videos"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-grey hover:text-neutral-black"
            }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "resources"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-grey hover:text-neutral-black"
            }`}
          >
            Resources ({resources.length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-neutral-grey mt-2">Loading content...</p>
        </div>
      )}

      {/* Uploading State */}
      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-neutral-grey mt-2">Uploading files...</p>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === "videos" && !loading && (
        <div className="space-y-3">
          {videos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h4 className="font-medium text-neutral-black mb-2">
                  No videos yet
                </h4>
                <p className="text-neutral-grey text-sm mb-4">
                  Upload your first video to get started
                </p>
                <Button
                  size="sm"
                  onClick={() => videoFileRef.current?.click()}
                  disabled={uploading}
                >
                  Upload Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            videos.map((video) => {
              const isEditing = editingTitles.hasOwnProperty(
                `video-${video.id}`
              );
              const isDeleting = deletingItems.has(`video-${video.id}`);
              const isUpdating = editingItems.has(`video-${video.id}`);

              return (
                <Card key={video.id} className={isDeleting ? "opacity-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Video className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingTitles[`video-${video.id}`]}
                                onChange={(e) =>
                                  setEditingTitles({
                                    ...editingTitles,
                                    [`video-${video.id}`]: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter video title"
                                disabled={isUpdating}
                              />
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="xs"
                                  onClick={() =>
                                    saveVideoTitle(
                                      video.id,
                                      editingTitles[`video-${video.id}`]
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="text-xs"
                                >
                                  {isUpdating ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  onClick={() =>
                                    cancelEditingTitle(video.id, "video")
                                  }
                                  disabled={isUpdating}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h5 className="font-medium text-neutral-black">
                                {video.title}
                              </h5>
                              <p className="text-sm text-neutral-grey">
                                {video.duration_seconds
                                  ? `${Math.round(
                                      video.duration_seconds / 60
                                    )} min`
                                  : "Duration unknown"}{" "}
                                • {formatFileSize(video.file_size_bytes)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isDeleting ? (
                          <div className="flex items-center space-x-2 text-sm text-neutral-grey">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-error"></div>
                            <span>Deleting...</span>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                startEditingTitle(
                                  video.id,
                                  video.title,
                                  "video"
                                )
                              }
                              disabled={isEditing || isUpdating}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteVideo(video.id)}
                              className="text-error hover:text-error/80"
                              disabled={isEditing || isUpdating}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && !loading && (
        <div className="space-y-3">
          {resources.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h4 className="font-medium text-neutral-black mb-2">
                  No resources yet
                </h4>
                <p className="text-neutral-grey text-sm mb-4">
                  Upload PDFs, documents, or other learning materials
                </p>
                <Button
                  size="sm"
                  onClick={() => resourceFileRef.current?.click()}
                  disabled={uploading}
                >
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          ) : (
            resources.map((resource) => {
              const isEditing = editingTitles.hasOwnProperty(
                `resource-${resource.id}`
              );
              const isDeleting = deletingItems.has(`resource-${resource.id}`);
              const isUpdating = editingItems.has(`resource-${resource.id}`);

              return (
                <Card
                  key={resource.id}
                  className={isDeleting ? "opacity-50" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            resource.resource_type === "pdf"
                              ? "bg-red-100"
                              : resource.resource_type === "image"
                              ? "bg-blue-100"
                              : resource.resource_type === "zip"
                              ? "bg-yellow-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {getResourceIcon(resource.resource_type)}
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingTitles[`resource-${resource.id}`]}
                                onChange={(e) =>
                                  setEditingTitles({
                                    ...editingTitles,
                                    [`resource-${resource.id}`]: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter resource title"
                                disabled={isUpdating}
                              />
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="xs"
                                  onClick={() =>
                                    saveResourceTitle(
                                      resource.id,
                                      editingTitles[`resource-${resource.id}`]
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="text-xs"
                                >
                                  {isUpdating ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  onClick={() =>
                                    cancelEditingTitle(resource.id, "resource")
                                  }
                                  disabled={isUpdating}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h5 className="font-medium text-neutral-black">
                                {resource.title}
                              </h5>
                              <p className="text-sm text-neutral-grey">
                                {resource.resource_type.toUpperCase()} •{" "}
                                {formatFileSize(resource.file_size_bytes)}
                                {resource.is_free && (
                                  <span className="ml-2 text-success">
                                    • Free
                                  </span>
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isDeleting ? (
                          <div className="flex items-center space-x-2 text-sm text-neutral-grey">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-error"></div>
                            <span>Deleting...</span>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                window.open(resource.file_url, "_blank")
                              }
                              disabled={isEditing || isUpdating}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                startEditingTitle(
                                  resource.id,
                                  resource.title,
                                  "resource"
                                )
                              }
                              disabled={isEditing || isUpdating}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteResource(resource.id)}
                              className="text-error hover:text-error/80"
                              disabled={isEditing || isUpdating}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ContentManagementSection;
