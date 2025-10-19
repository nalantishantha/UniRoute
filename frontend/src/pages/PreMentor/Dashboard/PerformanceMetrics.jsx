import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

export default function PerformanceMetrics({ itemVariants, dashboardData }) {
  const currentMonthStats = dashboardData?.current_month_stats || {};
  const overallStats = dashboardData?.overall_stats || {};

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Performance Overview
        </h3>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* This Month Performance */}
        <div className="text-center">
          <div className="bg-blue-100 p-4 rounded-lg mb-3">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">This Month</h4>
          <p className="text-2xl font-bold text-blue-600">
            {currentMonthStats.sessions || 0}
          </p>
          <p className="text-sm text-gray-600">Sessions Completed</p>
        </div>

        {/* Monthly Earnings */}
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-lg mb-3">
            <div className="text-2xl font-bold text-green-600">$</div>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Monthly Earnings</h4>
          <p className="text-2xl font-bold text-green-600">
            ${(currentMonthStats.earnings || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">{currentMonthStats.month_name || 'This Month'}</p>
        </div>

        {/* Average Rating */}
        <div className="text-center">
          <div className="bg-yellow-100 p-4 rounded-lg mb-3">
            <div className="text-2xl font-bold text-yellow-600">★</div>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Rating</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {(overallStats.average_rating || 0).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>

        {/* Total Sessions */}
        <div className="text-center">
          <div className="bg-purple-100 p-4 rounded-lg mb-3">
            <div className="text-2xl font-bold text-purple-600">#</div>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">All Time</h4>
          <p className="text-2xl font-bold text-purple-600">
            {overallStats.total_sessions || 0}
          </p>
          <p className="text-sm text-gray-600">Total Sessions</p>
        </div>
      </div>

      {/* Progress bars or additional metrics could go here */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Session completion rate</span>
          <span className="font-medium text-gray-900">95%</span>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
        </div>
      </div>
    </motion.div>
  );
}