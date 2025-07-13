import { useState } from "react";
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

export default function PreUniCourses() {
  const [showCreateModal, setShowCreateModal] = useState(false);

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

      {/* Courses Grid */}
      <CoursesGrid
        courses={courses}
        setShowCreateModal={setShowCreateModal}
      />

      {/* Create Course Modal */}
      <CreateCourseModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
    </motion.div>
  );
}
