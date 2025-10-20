import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign } from "lucide-react";

export default function UpcomingSessions({ itemVariants, dashboardData }) {
  const upcomingSessions = dashboardData?.upcoming_sessions || [];

  return (
    <motion.div
      variants={itemVariants}
      className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Upcoming Sessions
        </h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {upcomingSessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming sessions</p>
          <p className="text-sm text-gray-400 mt-1">
            Your schedule is clear for the next 7 days
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingSessions.map((session, index) => (
            <div
              key={session.session_id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {session.student_name}
                  </h4>
                  <p className="text-sm text-gray-600">{session.subject}</p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  ${session.session_fee}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(session.session_date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {session.start_time} - {session.end_time}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {upcomingSessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View Full Schedule
          </button>
        </div>
      )}
    </motion.div>
  );
}