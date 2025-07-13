import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Download,
  Tag,
  FolderOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import ResourcesGrid from "./ResourcesGrid";
import UploadResourcesModal from "./UploadResourcesModal";

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

export default function Resources() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Get all unique tags
  const allTags = [...new Set(resources.flatMap((resource) => resource.tags))];

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

      {/* Resources Grid with Filters */}
      <ResourcesGrid
        resources={resources}
        categories={categories}
        setShowUploadModal={setShowUploadModal}
      />

      <UploadResourcesModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
      />
    </motion.div>
  );
}
