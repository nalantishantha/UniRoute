import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";

export default function StatsCards({ itemVariants, dashboardData }) {
  if (!dashboardData) return null;

  const stats = [
    {
      title: "Total Earnings",
      value: `LKR${dashboardData.pre_mentor_info?.total_earnings?.toFixed(2) || '0.00'}`,
      change: dashboardData.current_month_stats?.earnings > 0 ? `+LKR${dashboardData.current_month_stats.earnings.toFixed(2)}` : '+LKR0.00',
      changeType: "positive",
      icon: DollarSign,
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "Total Sessions",
      value: dashboardData.overall_stats?.total_sessions || 0,
      change: `+${dashboardData.current_month_stats?.sessions || 0}`,
      changeType: "positive",
      icon: Users,
      color: "from-secondary to-warning",
    },
    {
      title: "Average Rating",
      value: (dashboardData.overall_stats?.average_rating || 0).toFixed(1),
      change: "★",
      changeType: "neutral",
      icon: Star,
      color: "from-success to-green-500",
    },
    {
      title: "Hourly Rate",
      value: `LKR${dashboardData.pre_mentor_info?.hourly_rate?.toFixed(2) || '0.00'}`,
      change: dashboardData.pre_mentor_info?.is_available ? "Available" : "Unavailable",
      changeType: dashboardData.pre_mentor_info?.is_available ? "positive" : "negative",
      icon: TrendingUp,
      color: "from-info to-blue-500",
    },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
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
}