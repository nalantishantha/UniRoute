import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  TrendingUp,
  BarChart3,
  Users,
  BookOpen,
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

  const handleExportReport = async () => {
    try {
      const filters = {
        service_type: serviceTypeFilter,
      };

      await feedbackAPI.exportFeedbackReport(USER_ID, filters);

      // You could add a success notification here if you have a notification system
    } catch (err) {
      setError(err.message || 'An error occurred while exporting the report');
      console.error('Error exporting report:', err);
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-96"
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-primary-600"></div>
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
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-error" />
            <h3 className="mb-2 text-lg font-medium text-neutral-black">
              Error Loading Feedback
            </h3>
            <p className="mb-4 text-neutral-grey">{error}</p>
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
        <div className="flex items-center mt-4 space-x-3 lg:mt-0">
          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg border-neutral-light-grey focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          >
            <option value="all">All Services</option>
            <option value="mentoring">Mentoring Only</option>
            <option value="tutoring">Tutoring Only</option>
          </select>
          <Button variant="outline" onClick={handleExportReport}>Export Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Total Feedback
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-black">
                  {stats.total_feedback}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl">
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
                <div className="flex items-center mt-2 space-x-2">
                  <p className="text-2xl font-bold text-neutral-black">
                    {stats.average_rating}
                  </p>
                  <div className="flex">
                    {renderStars(Math.round(stats.average_rating))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-xl">
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
                  Mentoring
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-black">
                  {stats.mentoring_count}
                </p>
                <p className="mt-1 text-sm text-neutral-grey">feedback</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Tutoring
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-black">
                  {stats.tutoring_count}
                </p>
                <p className="mt-1 text-sm text-neutral-grey">feedback</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>
            Breakdown of feedback sentiment across all services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-success/20">
                <BarChart3 className="w-8 h-8 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">{stats.positive}</p>
              <p className="text-sm text-neutral-grey">Positive</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-warning/20">
                <BarChart3 className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.neutral}</p>
              <p className="text-sm text-neutral-grey">Neutral</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-error/20">
                <BarChart3 className="w-8 h-8 text-error" />
              </div>
              <p className="text-2xl font-bold text-error">{stats.negative}</p>
              <p className="text-sm text-neutral-grey">Negative</p>
            </div>
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
