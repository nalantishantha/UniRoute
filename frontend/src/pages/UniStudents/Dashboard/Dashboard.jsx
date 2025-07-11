import { motion } from "framer-motion";
import StatsCards from "./StatsCards";
import RecentActivities from "./RecentActivities";
import UpcomingSessions from "./UpcomingSessions";
import PerformanceMetrics from "./PerformanceMetrics";

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
      {/* Stats Grid */}
      <StatsCards itemVariants={itemVariants} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <RecentActivities itemVariants={itemVariants} />

        {/* Upcoming Sessions */}
        <UpcomingSessions itemVariants={itemVariants} />
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics itemVariants={itemVariants} />
    </motion.div>
  );
}
