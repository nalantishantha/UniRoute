import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";
import { dashboardAPI } from "../../../utils/dashboardAPI";
import { getCurrentUser } from "../../../utils/auth";

const StatsCards = ({ itemVariants }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user and use their user_id
  const currentUser = getCurrentUser();
  const USER_ID = currentUser?.user_id || 19;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardAPI.getDashboardStats(USER_ID);

      if (response.success) {
        setStats(response.stats || {});
      } else {
        setError(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching dashboard stats');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatConfig = () => [
    {
      title: "Total Resources",
      value: stats.total_resources?.value || "0",
      change: stats.total_resources?.change || "+0",
      changeType: stats.total_resources?.change_type || "neutral",
      icon: BookOpen,
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "Mentoring Sessions",
      value: stats.mentoring_sessions?.value || "0",
      change: stats.mentoring_sessions?.change || "0 active",
      changeType: stats.mentoring_sessions?.change_type || "neutral",
      icon: Calendar,
      color: "from-secondary to-warning",
    },
    {
      title: "Active Enrollments",
      value: stats.active_enrollments?.value || "0",
      change: stats.active_enrollments?.change || "+0",
      changeType: stats.active_enrollments?.change_type || "neutral",
      icon: Users,
      color: "from-success to-green-500",
    },
    {
      title: "Monthly Revenue",
      value: stats.monthly_revenue?.value || "LKR0",
      change: stats.monthly_revenue?.change || "+0%",
      changeType: stats.monthly_revenue?.change_type || "neutral",
      icon: DollarSign,
      color: "from-info to-blue-500",
    },
  ];

  if (loading) {
    return (
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-20 h-4 mb-2 rounded bg-neutral-light-grey"></div>
                    <div className="w-16 h-8 rounded bg-neutral-light-grey"></div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-neutral-light-grey"></div>
                </div>
                <div className="w-full h-2 mt-4 rounded-full bg-neutral-light-grey"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-error" />
            <p className="text-sm text-neutral-grey">{error}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      {getStatConfig().map((stat) => (
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
                  <div className="flex items-baseline mt-2 space-x-2">
                    <p className="text-2xl font-bold text-neutral-black">
                      {stat.value}
                    </p>
                    <span
                      className={`text-sm font-medium ${stat.changeType === "positive"
                          ? "text-success"
                          : stat.changeType === "negative"
                            ? "text-error"
                            : "text-neutral-grey"
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
              <div className="w-full h-2 mt-4 rounded-full bg-neutral-silver">
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
  );
};

export default StatsCards;
