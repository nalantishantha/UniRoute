import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Edit3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import CoursesGrid from "./CoursesGrid";
import CreateCourseModal from "./CreateCourseModal";
import CourseDetailModal from "./CourseDetailModal";
import ContentManagementModal from "./ContentManagementModal";
import { coursesAPI, handleAPIError } from "../../../utils/preUniCoursesAPI";
import { getCurrentUser } from "../../../utils/auth";

export default function PreUniCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseForContent, setSelectedCourseForContent] =
    useState(null);
  const [mentorId, setMentorId] = useState(null);
  const [mentorCheckComplete, setMentorCheckComplete] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    enrolled: 0,
  });

  // Get current authenticated user
  const currentUser = getCurrentUser();

  // If user is not authenticated, show error
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-neutral-light-grey">
            Please log in to access the pre-university courses.
          </p>
        </Card>
      </div>
    );
  }

  // Function to get mentor ID for the current user
  const fetchMentorId = async () => {
    try {
      // First get the university student, then find their mentor record
      const uniStudentResponse = await fetch(
        `http://127.0.0.1:8000/api/university-students/by-user/${currentUser.user_id}/`
      );

      if (uniStudentResponse.ok) {
        const uniStudentData = await uniStudentResponse.json();

        // Now get the mentor record for this university student
        const mentorResponse = await fetch(
          `http://127.0.0.1:8000/api/mentoring/by-university-student/${uniStudentData.university_student_id}/`
        );

        if (mentorResponse.ok) {
          const mentorData = await mentorResponse.json();
          setMentorId(mentorData.mentor_id);
          console.log(
            `Found mentor ID: ${mentorData.mentor_id} for user ${currentUser.user_id}`
          );
        } else {
          console.log("User is not an approved mentor");
          setMentorId(null);
        }
      } else {
        console.warn("Could not fetch university student ID");
        setMentorId(null);
      }
    } catch (err) {
      console.error("Error fetching mentor ID:", err);
      setMentorId(null);
    } finally {
      setMentorCheckComplete(true);
    }
  };

  // Initialize mentor ID on component mount
  useEffect(() => {
    fetchMentorId();
  }, [currentUser.user_id]);

  // Fetch courses from API
  const fetchCourses = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Check if mentorId is available
      if (!mentorId) {
        // If user is not a mentor, set empty courses and clear loading
        setCourses([]);
        calculateStats([]);
        setLoading(false);
        return;
      }

      const response = await coursesAPI.getCourses({
        mentor_id: mentorId,
        ...filters,
      });

      if (response.success) {
        setCourses(response.courses);
        calculateStats(response.courses);
      } else {
        setError(response.error || "Failed to fetch courses");
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to load courses"));
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from courses
  const calculateStats = (coursesData) => {
    const stats = coursesData.reduce(
      (acc, course) => {
        acc.total++;
        acc[course.status]++;
        acc.totalEnrollments += course.enroll_count || 0;
        return acc;
      },
      {
        total: 0,
        published: 0,
        draft: 0,
        pending: 0,
        rejected: 0,
        totalEnrollments: 0,
      }
    );
    setStats(stats);
  };

  // Fetch courses when mentor check is complete
  useEffect(() => {
    if (mentorCheckComplete) {
      fetchCourses();
    }
  }, [mentorCheckComplete, mentorId]);

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  const handleManageContent = (course) => {
    setSelectedCourseForContent(course);
    setShowContentModal(true);
  };

  const handleSaveCourse = async (updatedCourse) => {
    try {
      const response = await coursesAPI.updateCourse(
        updatedCourse.id,
        updatedCourse
      );

      if (response.success) {
        // Update the courses list
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === updatedCourse.id ? response.course : course
          )
        );
        setShowDetailModal(false);
        // Recalculate stats
        calculateStats(courses);
        // Show success message
        setSuccessMessage(response.message || "Course updated successfully!");
      } else {
        setError(response.error || "Failed to update course");
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to save course"));
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      // Check if mentorId is available
      if (!mentorId) {
        throw new Error(
          "Mentor ID required - you must be an approved mentor to create courses"
        );
      }

      const response = await coursesAPI.createCourse({
        ...courseData,
        mentor_id: mentorId,
      });

      if (response.success) {
        // Show success message
        setSuccessMessage("Course created successfully!");
        setError(null);

        // Add new course to the list
        setCourses((prevCourses) => [response.course, ...prevCourses]);
        setShowCreateModal(false);

        // Recalculate stats
        calculateStats([response.course, ...courses]);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.error || "Failed to create course");
        setSuccessMessage(null);
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to create course"));
      setSuccessMessage(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await coursesAPI.deleteCourse(courseId);

      if (response.success) {
        // Show success message
        setSuccessMessage(response.message || "Course deleted successfully");
        setError(null);

        // Remove course from the list
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        setShowDetailModal(false);

        // Recalculate stats
        const updatedCourses = courses.filter(
          (course) => course.id !== courseId
        );
        calculateStats(updatedCourses);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.error || "Failed to delete course");
        setSuccessMessage(null);
      }
    } catch (err) {
      setError(handleAPIError(err, "Failed to delete course"));
      setSuccessMessage(null);
    }
  };

  // Handle filter changes from CoursesGrid
  const handleFilterChange = (filters) => {
    fetchCourses(filters);
  };

  // Show mentor application message if user is not a mentor
  if (mentorCheckComplete && !mentorId && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-screen"
      >
        <Card className="p-8 text-center max-w-md">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">
            Become a Course Mentor
          </h2>
          <p className="text-neutral-grey mb-6">
            You need to be an approved mentor to create and manage
            pre-university courses. Apply to become a mentor to start sharing
            your knowledge with A/L students.
          </p>
          <Button size="lg" className="w-full">
            Apply to Become a Mentor
          </Button>
          <p className="text-sm text-neutral-light-grey mt-4">
            Only approved university students can become course mentors.
          </p>
        </Card>
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
          className="mt-4 lg:mt-0 flex items-center space-x-2"
          onClick={() => setShowCreateModal(true)}
          disabled={!mentorId}
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </Button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
          <p className="text-success text-sm">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-success hover:text-success/80"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
          <p className="text-error text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-error hover:text-error/80"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-neutral-grey mt-4">Loading courses...</p>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-black">
                    {stats.total}
                  </p>
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
                  <p className="text-2xl font-bold text-neutral-black">
                    {stats.published}
                  </p>
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
                  <p className="text-2xl font-bold text-neutral-black">
                    {stats.draft}
                  </p>
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
                  <p className="text-2xl font-bold text-neutral-black">
                    {stats.totalEnrollments}
                  </p>
                  <p className="text-xs text-neutral-grey">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && (
        <CoursesGrid
          courses={courses}
          loading={loading}
          setShowCreateModal={setShowCreateModal}
          onViewCourse={handleViewCourse}
          onManageContent={handleManageContent}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onCreateCourse={handleCreateCourse}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        showModal={showDetailModal}
        setShowModal={setShowDetailModal}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
      />

      {/* Content Management Modal */}
      <ContentManagementModal
        course={selectedCourseForContent}
        showModal={showContentModal}
        setShowModal={setShowContentModal}
      />
    </motion.div>
  );
}
