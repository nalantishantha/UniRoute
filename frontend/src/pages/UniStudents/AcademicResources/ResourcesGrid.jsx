import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Download,
  Eye,
  Edit3,
  MoreHorizontal,
  Tag,
  Calendar,
  File,
  Image,
  Video,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const typeIcons = {
  pdf: FileText,
  video: Video,
  image: Image,
  document: File,
};

const ResourcesGrid = ({ resources, categories, setShowUploadModal, onViewResource }) => {
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

  return (
    <>
      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-neutral-grey" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2 pl-10 pr-4 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
            <p className="mb-2 text-sm font-medium text-neutral-black">
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
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${isSelected
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
                  className="px-3 py-1 text-xs border rounded-full text-error hover:bg-error/10 border-error/30"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid/List */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-light-grey" />
            <h3 className="mb-2 text-lg font-medium text-neutral-black">
              No resources found
            </h3>
            <p className="mb-6 text-neutral-grey">
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
      ) : (
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
                  <Card className="transition-shadow cursor-pointer group hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                            <IconComponent className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold transition-colors text-neutral-black group-hover:text-primary-600">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-neutral-grey">
                              {resource.category}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 transition-colors rounded-lg hover:bg-neutral-silver">
                          <MoreHorizontal className="w-4 h-4 text-neutral-grey" />
                        </button>
                      </div>

                      <p className="mb-4 text-sm text-neutral-grey line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-neutral-silver text-neutral-grey"
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => onViewResource && onViewResource(resource)}
                        >
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
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-lg bg-primary-100">
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
                          <p className="mb-3 text-sm text-neutral-grey line-clamp-1">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs rounded-full bg-neutral-silver text-neutral-grey"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onViewResource && onViewResource(resource)}
                              >
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
      )}
    </>
  );
};

export default ResourcesGrid;
