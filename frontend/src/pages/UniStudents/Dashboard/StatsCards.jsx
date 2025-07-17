import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";

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

const StatsCards = ({ itemVariants }) => {
  return (
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
  );
};

export default StatsCards;
