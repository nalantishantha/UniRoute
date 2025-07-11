import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  Star,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

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

const RecentActivities = ({ itemVariants }) => {
  return (
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === "enrollment"
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
  );
};

export default RecentActivities;
