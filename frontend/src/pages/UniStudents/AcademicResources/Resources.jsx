import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Download, Tag, FolderOpen } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import ResourcesGrid from "./ResourcesGrid";
import UploadResourcesModal from "./UploadResourcesModal";
import ResourceDetailModal from "./ResourceDetailModal";

const categories = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Other",
];

export default function Resources() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch resources from backend
  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/resources/");
      const data = await response.json();
      if (response.ok) {
        setResources(data.resources || []);
      } else {
        setError("Failed to fetch resources");
      }
    } catch (err) {
      setError("Network error while fetching resources");
    } finally {
      setLoading(false);
    }
  };

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  // Get all unique tags
  const allTags = [
    ...new Set(resources.flatMap((resource) => resource.tags || [])),
  ];

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setShowDetailModal(true);
  };

  const handleSaveResource = (editedResource) => {
    console.log("Resource updated:", editedResource);
    // Update the resource in the list
    setResources(
      resources.map((resource) =>
        resource.id === editedResource.id ? editedResource : resource
      )
    );
  };

  const handleRemoveResource = (resource) => {
    console.log("Resource removed:", resource);
    // Remove resource from the list
    setResources(resources.filter((r) => r.id !== resource.id));
  };

  // Handle successful upload - refresh resources
  const handleUploadSuccess = () => {
    fetchResources(); // Refresh the resources list
  };

  // Calculate stats
  const totalDownloads = resources.reduce(
    (sum, resource) => sum + (resource.downloads || 0),
    0
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-4 rounded-full border-primary-600 border-t-transparent animate-spin"></div>
            <p className="text-neutral-grey">Loading resources...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div></div>
        <Button
          size="lg"
          className="flex items-center mt-4 space-x-2 lg:mt-0"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resource</span>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchResources} className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">
                  {resources.length}
                </p>
                <p className="text-xs text-neutral-grey">Total Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/20">
                <Download className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">
                  {totalDownloads}
                </p>
                <p className="text-xs text-neutral-grey">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/20">
                <Tag className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">
                  {allTags.length}
                </p>
                <p className="text-xs text-neutral-grey">Unique Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-info/20">
                <FolderOpen className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">
                  {categories.length - 1}
                </p>
                <p className="text-xs text-neutral-grey">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Grid with Filters */}
      <ResourcesGrid
        resources={resources}
        categories={categories}
        setShowUploadModal={setShowUploadModal}
        onViewResource={handleViewResource}
      />

      <UploadResourcesModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        showModal={showDetailModal}
        setShowModal={setShowDetailModal}
        onSave={handleSaveResource}
        onRemove={handleRemoveResource}
      />
    </motion.div>
  );
}
