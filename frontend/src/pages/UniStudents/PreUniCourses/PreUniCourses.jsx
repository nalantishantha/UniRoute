import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  Star,
  TrendingUp,
  Calendar,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const courses = [
  {
    id: 1,
    title: "Mathematics Foundations",
    category: "Mathematics",
    status: "Published",
    enrollments: 45,
    rating: 4.8,
    price: 120,
    duration: "8 weeks",
    lastUpdated: "2024-01-15",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    description:
      "Complete foundation course covering algebra, geometry, and basic calculus",
  },
  {
    id: 2,
    title: "Physics for Beginners",
    category: "Physics",
    status: "Published",
    enrollments: 32,
    rating: 4.6,
    price: 150,
    duration: "10 weeks",
    lastUpdated: "2024-01-10",
    thumbnail:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    description: "Introduction to physics concepts with practical experiments",
  },
  {
    id: 3,
    title: "Chemistry Lab Techniques",
    category: "Chemistry",
    status: "Draft",
    enrollments: 0,
    rating: 0,
    price: 180,
    duration: "12 weeks",
    lastUpdated: "2024-01-20",
    thumbnail:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400",
    description:
      "Hands-on chemistry laboratory techniques and safety protocols",
  },
  {
    id: 4,
    title: "Biology Essentials",
    category: "Biology",
    status: "Pending",
    enrollments: 0,
    rating: 0,
    price: 110,
    duration: "6 weeks",
    lastUpdated: "2024-01-18",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    description: "Essential biology concepts for university preparation",
  },
];

const statusColors = {
  Published: "bg-success/20 text-success border-success/30",
  Draft: "bg-warning/20 text-yellow-600 border-warning/30",
  Pending: "bg-info/20 text-info border-info/30",
  Rejected: "bg-error/20 text-error border-error/30",
};

export default function PreUniCourses() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const CreateCourseModal = () => (
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
            <div className="p-6 border-b border-neutral-silver">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-black">
                  Create New Course
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course title"
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe your course content and objectives"
                  className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 8 weeks"
                    className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Difficulty
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Course Thumbnail
                </label>
                <div className="border-2 border-dashed border-neutral-light-grey rounded-lg p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-neutral-silver rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-neutral-grey" />
                  </div>
                  <p className="text-sm text-neutral-grey">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-neutral-light-grey mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-silver flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button>Create Course</Button>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
        <Button
          size="lg"
          className="mt-4 lg:mt-0 flex items-center space-x-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">8</p>
                <p className="text-xs text-neutral-grey">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">2</p>
                <p className="text-xs text-neutral-grey">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">1</p>
                <p className="text-xs text-neutral-grey">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-black">77</p>
                <p className="text-xs text-neutral-grey">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-grey" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
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
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {viewMode === "grid" ? (
              <Card className="overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        statusColors[course.status]
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-neutral-dark-grey" />
                    </button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-black group-hover:text-primary-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-neutral-grey">
                        {course.category}
                      </p>
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-neutral-grey mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-neutral-light-grey" />
                      <span className="text-sm text-neutral-grey">
                        {course.enrollments} students
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-neutral-light-grey" />
                      <span className="text-sm text-neutral-grey">
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-neutral-light-grey" />
                      <span className="text-sm text-neutral-grey">
                        ${course.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neutral-light-grey" />
                      <span className="text-sm text-neutral-grey">
                        {course.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-neutral-black">
                            {course.title}
                          </h3>
                          <p className="text-sm text-neutral-grey">
                            {course.category}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${
                            statusColors[course.status]
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-grey mt-2 line-clamp-1">
                        {course.description}
                      </p>
                      <div className="flex items-center space-x-6 mt-3">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-neutral-light-grey" />
                          <span className="text-sm text-neutral-grey">
                            {course.enrollments}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-neutral-light-grey" />
                          <span className="text-sm text-neutral-grey">
                            ${course.price}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-neutral-light-grey" />
                          <span className="text-sm text-neutral-grey">
                            {course.duration}
                          </span>
                        </div>
                        {course.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-warning fill-current" />
                            <span className="text-sm font-medium">
                              {course.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </motion.div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-black mb-2">
              No courses found
            </h3>
            <p className="text-neutral-grey mb-6">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Create your first course to get started"}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateCourseModal />
    </motion.div>
  );
}
