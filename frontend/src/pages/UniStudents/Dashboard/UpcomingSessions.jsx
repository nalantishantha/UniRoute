import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

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

const UpcomingSessions = ({ itemVariants }) => {
  return (
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
                      className={`text-xs px-2 py-1 rounded-full ${session.type === "online"
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
  );
};

export default UpcomingSessions;
