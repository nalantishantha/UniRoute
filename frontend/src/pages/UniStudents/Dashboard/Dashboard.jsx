import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Plus,
  ArrowUpRight,
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const stats = [
  {
    title: "Total Courses",
    value: "12",
    change: "+2",
    changeType: "positive",
    icon: BookOpen,
    color: "from-primary-500 to-primary-600",
  },
  {
    title: "Created Courses",
    value: "8",
    change: "+1",
    changeType: "positive",
    icon: Plus,
    color: "from-secondary to-warning",
  },
  {
    title: "Active Enrollments",
    value: "156",
    change: "+12",
    changeType: "positive",
    icon: Users,
    color: "from-success to-green-500",
  },
  {
    title: "Monthly Revenue",
    value: "$2,840",
    change: "+18%",
    changeType: "positive",
    icon: DollarSign,
    color: "from-info to-blue-500",
  },
];

const recentActivities = [
  {
    title: "New enrollment in 'Mathematics Foundations'",
    student: "Sarah Chen",
    time: "2 hours ago",
    type: "enrollment",
  },
  {
    title: "Session completed with John Doe",
    subject: "Physics Tutoring",
    time: "4 hours ago",
    type: "session",
  },
  {
    title: "New feedback received (5 stars)",
    course: "Biology Prep Course",
    time: "6 hours ago",
    type: "feedback",
  },
  {
    title: "Payment received",
    amount: "$120",
    time: "1 day ago",
    type: "payment",
  },
];

const upcomingSessions = [
  {
    title: "Mathematics Tutoring",
    student: "Emily Watson",
    time: "Today, 2:00 PM",
    type: "online",
    duration: "1 hour",
  },
  {
    title: "University Admission Guidance",
    student: "Michael Brown",
    time: "Tomorrow, 10:00 AM",
    type: "physical",
    duration: "2 hours",
  },
  {
    title: "Chemistry Lab Prep",
    student: "Lisa Johnson",
    time: "Friday, 3:00 PM",
    type: "online",
    duration: "1.5 hours",
  },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("week");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Section */}
      {/* <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-end"
      >
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button size="lg" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </Button>
        </div>
      </motion.div> */}

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-grey">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <p className="text-2xl font-bold text-neutral-black">
                        {stat.value}
                      </p>
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "positive"
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 w-full bg-neutral-silver rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Your latest interactions and updates
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-silver">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-neutral-silver/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "enrollment"
                            ? "bg-primary-100 text-primary-600"
                            : activity.type === "session"
                            ? "bg-success/20 text-success"
                            : activity.type === "feedback"
                            ? "bg-warning/20 text-yellow-600"
                            : "bg-info/20 text-info"
                        }`}
                      >
                        {activity.type === "enrollment" && (
                          <Users className="w-5 h-5" />
                        )}
                        {activity.type === "session" && (
                          <Clock className="w-5 h-5" />
                        )}
                        {activity.type === "feedback" && (
                          <Star className="w-5 h-5" />
                        )}
                        {activity.type === "payment" && (
                          <DollarSign className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-black">
                          {activity.title}
                        </p>
                        <p className="text-xs text-neutral-grey mt-1">
                          {activity.student ||
                            activity.course ||
                            activity.amount}{" "}
                          • {activity.time}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-neutral-light-grey" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <span>Upcoming Sessions</span>
              </CardTitle>
              <CardDescription>
                Your scheduled mentoring and tutoring sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-neutral-silver rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-black">
                        {session.title}
                      </h4>
                      <p className="text-sm text-neutral-grey mt-1">
                        {session.student}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-neutral-grey">
                          {session.time}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            session.type === "online"
                              ? "bg-primary-100 text-primary-600"
                              : "bg-success/20 text-success"
                          }`}
                        >
                          {session.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-grey">
                        {session.duration}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-neutral-grey">Course Rating</p>
                <p className="text-2xl font-bold text-neutral-black">4.8/5</p>
                <p className="text-xs text-success">+0.2 from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-neutral-grey">Completion Rate</p>
                <p className="text-2xl font-bold text-neutral-black">92%</p>
                <p className="text-xs text-success">+5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-warning rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-neutral-black" />
              </div>
              <div>
                <p className="text-sm text-neutral-grey">Student Success</p>
                <p className="text-2xl font-bold text-neutral-black">87%</p>
                <p className="text-xs text-success">+3% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
