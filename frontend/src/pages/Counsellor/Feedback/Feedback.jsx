import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import FeedbackList from "./FeedbackList";
import { feedbackAPI } from "../../../utils/feedbackAPI";
import { getCurrentUser } from "../../../utils/auth";

export default function Feedback() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [feedbackData, setFeedbackData] = useState([]);
  const [stats, setStats] = useState({
    total_feedback: 0,
    average_rating: 0,
    unread_count: 0,
    response_rate: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    mentoring_count: 0,
    tutoring_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user and use their user_id
  const currentUser = getCurrentUser();
  const USER_ID = currentUser?.user_id || 19;

  useEffect(() => {
    fetchFeedback();
  }, [serviceTypeFilter]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        service_type: serviceTypeFilter,
      };

      const response = await feedbackAPI.getFeedback(USER_ID, filters);

      if (response.success) {
        setFeedbackData(response.feedback || []);
        setStats(response.stats || stats);
      } else {
        setError(response.message || 'Failed to fetch feedback');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching feedback');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating
          ? "text-warning fill-current"
          : "text-neutral-light-grey"
          }`}
      />
    ));
  };

  const monthlyTrends = [
    { month: "Jul", rating: 4.1, count: 8 },
    { month: "Aug", rating: 4.3, count: 12 },
    { month: "Sep", rating: 4.0, count: 15 },
    { month: "Oct", rating: 4.4, count: 18 },
    { month: "Nov", rating: 4.2, count: 16 },
    { month: "Dec", rating: 4.2, count: 14 },
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-96"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-grey">Loading feedback...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-black mb-2">
              Error Loading Feedback
            </h3>
            <p className="text-neutral-grey mb-4">{error}</p>
            <Button onClick={fetchFeedback} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          >
            <option value="all">All Services</option>
            <option value="mentoring">Mentoring Only</option>
            <option value="tutoring">Tutoring Only</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          >
            <option value="all">All Feedback</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Total Feedback
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.total_feedback}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  {stats.unread_count} unread
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Average Rating
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-2xl font-bold text-neutral-black">
                    {stats.average_rating}
                  </p>
                  <div className="flex">
                    {renderStars(Math.round(stats.average_rating))}
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Response Rate
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.response_rate}%
                </p>
                <p className="text-sm text-success mt-1">Active engagement</p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Sentiment
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-sm text-success">
                    {stats.positive}+
                  </span>
                  <span className="text-sm text-warning">{stats.neutral}~</span>
                  <span className="text-sm text-error">{stats.negative}-</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Trends</CardTitle>
          <CardDescription>
            Monthly feedback rating and volume trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyTrends.map((data, index) => (
              <div
                key={data.month}
                className="flex flex-col items-center flex-1"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.rating / 5) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg mb-2 min-h-[20px]"
                />
                <span className="text-xs text-neutral-grey">{data.month}</span>
                <span className="text-xs font-medium text-neutral-black">
                  {data.rating}
                </span>
                <span className="text-xs text-neutral-light-grey">
                  ({data.count})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback List with Filters and Search */}
      <FeedbackList
        feedbackData={feedbackData}
        filterStatus={filterStatus}
        serviceTypeFilter={serviceTypeFilter}
        onRefreshData={fetchFeedback}
      />
    </motion.div>
  );
}
