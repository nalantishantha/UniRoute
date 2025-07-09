import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  Plus,
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import { Card, CardContent, Button } from "../../../components/UniStudent";
import RecentActivities from "./RecentActivities";
import UpcomingSessions from "./UpcomingSessions";

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

export default function Dashboard() {
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
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
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
                        className={`text-sm font-medium ${stat.changeType === "positive"
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
        <RecentActivities variants={itemVariants} />

        {/* Upcoming Sessions */}
        <UpcomingSessions variants={itemVariants} />
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
