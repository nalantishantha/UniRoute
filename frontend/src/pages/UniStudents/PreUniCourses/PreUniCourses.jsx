import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Edit3,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import CoursesGrid from "./CoursesGrid";
import CreateCourseModal from "./CreateCourseModal";
import CourseDetailModal from "./CourseDetailModal";

export default function PreUniCourses() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    total_courses: 0,
    published: 0,
    draft: 0,
    pending: 0,
    total_enrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/pre-uni-courses/');
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch course statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/pre-uni-courses/stats/');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Load courses and stats on component mount
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  const handleSaveCourse = (updatedCourse) => {
    // Here you would typically make an API call to save the changes
    console.log("Saving course:", updatedCourse);
    // For now, we'll just close the modal
    setShowDetailModal(false);
  };

  const handleCourseCreated = () => {
    // Refresh courses and stats after creating a new course
    fetchCourses();
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-neutral-grey">Loading courses...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
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
                <p className="text-2xl font-bold text-neutral-black">{stats.total_courses}</p>
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
                <p className="text-2xl font-bold text-neutral-black">{stats.published}</p>
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
                <p className="text-2xl font-bold text-neutral-black">{stats.draft}</p>
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
                <p className="text-2xl font-bold text-neutral-black">{stats.total_enrollments}</p>
                <p className="text-xs text-neutral-grey">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <CoursesGrid
        courses={courses}
        setShowCreateModal={setShowCreateModal}
        onViewCourse={handleViewCourse}
      />

      {/* Create Course Modal */}
      <CreateCourseModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onCourseCreated={handleCourseCreated}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        showModal={showDetailModal}
        setShowModal={setShowDetailModal}
        onSave={handleSaveCourse}
      />
    </motion.div>
  );
}
