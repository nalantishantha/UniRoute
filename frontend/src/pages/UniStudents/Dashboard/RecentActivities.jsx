import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  Star,
  DollarSign,
  ArrowUpRight,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { dashboardAPI } from "../../../utils/dashboardAPI";
import { getCurrentUser } from "../../../utils/auth";

const RecentActivities = ({ itemVariants }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user and use their user_id
  const currentUser = getCurrentUser();
  const USER_ID = currentUser?.user_id || 19;

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardAPI.getRecentActivities(USER_ID);

      if (response.success) {
        setActivities(response.activities || []);
      } else {
        setError(response.message || 'Failed to fetch recent activities');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching recent activities');
      console.error('Error fetching recent activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return <Users className="w-5 h-5" />;
      case 'session':
        return <Clock className="w-5 h-5" />;
      case 'feedback':
        return <Star className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'resource':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const renderActivityContent = () => {
    if (loading) {
      return (
        <div className="p-6 text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 rounded-full border-primary-600 border-t-transparent animate-spin"></div>
          <p className="text-neutral-grey">Loading activities...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
          <h3 className="mb-2 text-lg font-medium text-neutral-black">
            Error Loading Activities
          </h3>
          <p className="mb-4 text-neutral-grey">{error}</p>
          <Button onClick={fetchRecentActivities} variant="outline">
            Try Again
          </Button>
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <div className="p-6 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-neutral-light-grey" />
          <h3 className="mb-2 text-lg font-medium text-neutral-black">
            No Recent Activities
          </h3>
          <p className="text-neutral-grey">
            Your recent activities will appear here once you start mentoring or tutoring.
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-neutral-silver">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-neutral-silver/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${dashboardAPI.getActivityIconClass(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-black">
                  {dashboardAPI.getActivityDisplayTitle(activity)}
                </p>
                <p className="text-xs text-neutral-grey mt-1">
                  {dashboardAPI.getActivitySubtitle(activity)}
                </p>
                {activity.details && activity.details.rating && (
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < activity.details.rating
                            ? "text-yellow-400 fill-current"
                            : "text-neutral-light-grey"
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-light-grey" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
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
            <Button variant="ghost" size="sm" onClick={fetchRecentActivities}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {renderActivityContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivities;
