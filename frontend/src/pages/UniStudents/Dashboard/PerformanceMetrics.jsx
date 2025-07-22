import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";

const PerformanceMetrics = ({ itemVariants }) => {
  return (
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
  );
};

export default PerformanceMetrics;
