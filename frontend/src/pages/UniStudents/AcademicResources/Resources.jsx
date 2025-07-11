import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  Tag,
  Calendar,
  File,
  Image,
  Video,
  X,
  Plus,
  FolderOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const resources = [
  {
    id: 1,
    title: "Calculus Fundamentals Guide",
    category: "Mathematics",
    tags: ["calculus", "derivatives", "integrals"],
    type: "pdf",
    size: "2.4 MB",
    downloads: 128,
    uploadDate: "2024-01-15",
    description:
      "Comprehensive guide covering basic calculus concepts with worked examples",
  },
  {
    id: 2,
    title: "Physics Formula Sheet",
    category: "Physics",
    tags: ["formulas", "mechanics", "electricity"],
    type: "pdf",
    size: "1.8 MB",
    downloads: 89,
    uploadDate: "2024-01-12",
    description: "Essential physics formulas for university entrance exams",
  },
  {
    id: 3,
    title: "Chemistry Lab Safety Protocols",
    category: "Chemistry",
    tags: ["safety", "laboratory", "protocols"],
    type: "pdf",
    size: "3.2 MB",
    downloads: 67,
    uploadDate: "2024-01-10",
    description: "Complete guide to laboratory safety and best practices",
  },
  {
    id: 4,
    title: "Biology Cell Structure Diagrams",
    category: "Biology",
    tags: ["cells", "diagrams", "anatomy"],
    type: "pdf",
    size: "5.1 MB",
    downloads: 145,
    uploadDate: "2024-01-08",
    description: "Detailed diagrams and explanations of cellular structures",
  },
  {
    id: 5,
    title: "Mathematics Problem Solving Video",
    category: "Mathematics",
    tags: ["video", "problem-solving", "algebra"],
    type: "video",
    size: "45.2 MB",
    downloads: 234,
    uploadDate: "2024-01-05",
    description:
      "Step-by-step video guide for solving complex algebra problems",
  },
];

const categories = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Other",
];

const typeIcons = {
  pdf: FileText,
  video: Video,
  image: Image,
  document: File,
};

export default function Resources() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // Get all unique tags
  const allTags = [...new Set(resources.flatMap((resource) => resource.tags))];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => resource.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const UploadModal = () => (
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">Resources</h1>
          <p className="text-neutral-grey mt-1">
            Upload and manage your educational resources
          </p>
        </div>
        <Button
          size="lg"
          className="mt-4 lg:mt-0 flex items-center space-x-2"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resource</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
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
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">663</p>
                <p className="text-xs text-neutral-grey">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
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
              <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-grey" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-grey">View:</span>
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <p className="text-sm font-medium text-neutral-black mb-2">
              Filter by tags:
            </p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      isSelected
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-neutral-silver text-neutral-grey border-neutral-light-grey hover:border-primary-400"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 text-xs text-error hover:bg-error/10 rounded-full border border-error/30"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid/List */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {filteredResources.map((resource, index) => {
          const IconComponent = typeIcons[resource.type] || FileText;

          return (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {viewMode === "grid" ? (
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-black group-hover:text-primary-600 transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-neutral-grey">
                            {resource.category}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-neutral-silver rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-neutral-grey" />
                      </button>
                    </div>

                    <p className="text-sm text-neutral-grey mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-neutral-silver text-neutral-grey rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-neutral-light-grey">
                          +{resource.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-neutral-grey">
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{resource.downloads} downloads</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{resource.uploadDate}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-neutral-black">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-neutral-grey">
                              {resource.category} • {resource.size}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-neutral-grey">
                              {resource.downloads} downloads
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-grey mb-3 line-clamp-1">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-neutral-silver text-neutral-grey rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-black mb-2">
              No resources found
            </h3>
            <p className="text-neutral-grey mb-6">
              {searchTerm ||
              selectedCategory !== "All" ||
              selectedTags.length > 0
                ? "Try adjusting your search or filter criteria"
                : "Upload your first study material to get started"}
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </CardContent>
        </Card>
      )}

      <UploadModal />
    </motion.div>
  );
}
