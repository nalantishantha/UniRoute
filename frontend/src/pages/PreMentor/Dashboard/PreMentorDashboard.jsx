import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StatsCards from "./StatsCards";
import RecentActivities from "./RecentActivities";
import UpcomingSessions from "./UpcomingSessions";
import PerformanceMetrics from "./PerformanceMetrics";
import InternshipAds from "./InternshipAds";
import MentorRequestNotice from "../../../components/PreMentor/MentorRequestNotice";

export default function PreMentorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || user.user_type !== 'pre_mentor') {
        throw new Error('Invalid user type or user not found');
      }

      const response = await fetch(`http://localhost:8000/api/pre-mentors/dashboard/?user_id=${user.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error text-lg font-medium mb-2">Error Loading Dashboard</div>
        <div className="text-neutral-grey mb-4">{error}</div>
        <button
          onClick={fetchDashboardData}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Mentor Request Notice */}
      <MentorRequestNotice itemVariants={itemVariants} />

      {/* Stats Grid */}
      <StatsCards itemVariants={itemVariants} dashboardData={dashboardData} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <RecentActivities itemVariants={itemVariants} dashboardData={dashboardData} />

        {/* Upcoming Sessions */}
        <UpcomingSessions itemVariants={itemVariants} dashboardData={dashboardData} />
      </div>

      {/* Internship Opportunities */}
      <InternshipAds itemVariants={itemVariants} />

      {/* Performance Metrics */}
      <PerformanceMetrics itemVariants={itemVariants} dashboardData={dashboardData} />
    </motion.div>
  );
}