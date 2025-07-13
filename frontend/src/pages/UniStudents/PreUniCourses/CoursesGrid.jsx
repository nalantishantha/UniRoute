import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Eye,
  Edit3,
  MoreHorizontal,
  Star,
  Calendar,
  Plus,
  Search,
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

const CoursesGrid = ({ courses, setShowCreateModal }) => {
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

  return (
    <>
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
      {filteredCourses.length === 0 ? (
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
      ) : (
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
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[course.status]
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
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[course.status]
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
      )}
    </>
  );
};

export default CoursesGrid;
