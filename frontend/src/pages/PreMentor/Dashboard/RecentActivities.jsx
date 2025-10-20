import { motion } from "framer-motion";
import { Activity, DollarSign, Calendar } from "lucide-react";

export default function RecentActivities({ itemVariants, dashboardData }) {
  const recentEarnings = dashboardData?.recent_earnings || [];

  return (
    <motion.div
      variants={itemVariants}
      className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Earnings
        </h3>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>

      {recentEarnings.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent earnings</p>
          <p className="text-sm text-gray-400 mt-1">
            Complete sessions to start earning
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentEarnings.map((earning, index) => (
            <div
              key={earning.earning_id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${earning.payment_status === 'paid'
                    ? 'bg-green-100'
                    : earning.payment_status === 'pending'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}>
                  <DollarSign className={`w-4 h-4 ${earning.payment_status === 'paid'
                      ? 'text-green-600'
                      : earning.payment_status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    ${earning.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {earning.description}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(earning.earning_date).toLocaleDateString()}
                </div>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${earning.payment_status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : earning.payment_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {earning.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {recentEarnings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Earnings
          </button>
        </div>
      )}
    </motion.div>
  );
}