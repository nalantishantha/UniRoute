import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Eye,
  Reply,
  Calendar,
  User,
  BookOpen,
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

const feedbackData = [
  {
    id: 1,
    student: "Sarah Chen",
    course: "Mathematics Foundations",
    rating: 5,
    sentiment: "positive",
    comment:
      "Alex is an amazing tutor! His explanations are clear and he's very patient. I finally understand calculus thanks to his teaching methods.",
    date: "2024-01-20",
    isRead: true,
    hasReply: false,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 2,
    student: "Michael Brown",
    course: "Physics for Beginners",
    rating: 4,
    sentiment: "positive",
    comment:
      "Great course content and Alex is very knowledgeable. Sometimes the pace is a bit fast, but overall excellent experience.",
    date: "2024-01-18",
    isRead: true,
    hasReply: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 3,
    student: "Emily Watson",
    course: "Chemistry Lab Techniques",
    rating: 5,
    sentiment: "positive",
    comment:
      "Absolutely loved this course! The lab demonstrations were fantastic and Alex made complex concepts easy to understand.",
    date: "2024-01-15",
    isRead: false,
    hasReply: false,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 4,
    student: "John Doe",
    course: "Biology Essentials",
    rating: 3,
    sentiment: "neutral",
    comment:
      "The course material is good but I wish there were more interactive elements. Alex is helpful when asked questions directly.",
    date: "2024-01-12",
    isRead: true,
    hasReply: false,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 5,
    student: "Lisa Johnson",
    course: "Advanced Mathematics",
    rating: 5,
    sentiment: "positive",
    comment:
      "Best math tutor I've ever had! Alex goes above and beyond to ensure students understand the material. Highly recommend!",
    date: "2024-01-10",
    isRead: true,
    hasReply: true,
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 6,
    student: "David Wilson",
    course: "Physics Problem Solving",
    rating: 2,
    sentiment: "negative",
    comment:
      "The course didn't meet my expectations. Some explanations were unclear and I struggled to follow along with the examples.",
    date: "2024-01-08",
    isRead: false,
    hasReply: false,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
  },
];

const stats = {
  totalFeedback: feedbackData.length,
  averageRating: 4.2,
  unreadCount: feedbackData.filter((f) => !f.isRead).length,
  responseRate: 85,
  positive: feedbackData.filter((f) => f.sentiment === "positive").length,
  neutral: feedbackData.filter((f) => f.sentiment === "neutral").length,
  negative: feedbackData.filter((f) => f.sentiment === "negative").length,
};

const monthlyTrends = [
  { month: "Jul", rating: 4.1, count: 8 },
  { month: "Aug", rating: 4.3, count: 12 },
  { month: "Sep", rating: 4.0, count: 15 },
  { month: "Oct", rating: 4.4, count: 18 },
  { month: "Nov", rating: 4.2, count: 16 },
  { month: "Dec", rating: 4.2, count: 14 },
];

export default function Feedback() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesSearch =
      feedback.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && feedback.isRead) ||
      (filterStatus === "unread" && !feedback.isRead);
    const matchesSentiment =
      filterSentiment === "all" || feedback.sentiment === filterSentiment;

    return matchesSearch && matchesStatus && matchesSentiment;
  });

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-4 h-4 text-success" />;
      case "negative":
        return <ThumbsDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-warning" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-success/20 text-success border-success/30";
      case "negative":
        return "bg-error/20 text-error border-error/30";
      default:
        return "bg-warning/20 text-yellow-600 border-warning/30";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-warning fill-current"
            : "text-neutral-light-grey"
        }`}
      />
    ));
  };

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
                  {stats.totalFeedback}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  {stats.unreadCount} unread
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
                    {stats.averageRating}
                  </p>
                  <div className="flex">
                    {renderStars(Math.round(stats.averageRating))}
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
                  {stats.responseRate}%
                </p>
                <p className="text-sm text-success mt-1">+5% this month</p>
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

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-grey" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                />
              </div>
              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value)}
                className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            <div className="text-sm text-neutral-grey">
              Showing {filteredFeedback.length} of {feedbackData.length}{" "}
              feedback
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((feedback, index) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                !feedback.isRead ? "border-l-4 border-l-primary-500" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={feedback.avatar}
                    alt={feedback.student}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-neutral-black">
                            {feedback.student}
                          </h3>
                          {!feedback.isRead && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <BookOpen className="w-3 h-3 text-neutral-light-grey" />
                          <span className="text-sm text-neutral-grey">
                            {feedback.course}
                          </span>
                          <span className="text-neutral-light-grey">•</span>
                          <Calendar className="w-3 h-3 text-neutral-light-grey" />
                          <span className="text-sm text-neutral-grey">
                            {feedback.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getSentimentColor(
                            feedback.sentiment
                          )}`}
                        >
                          {feedback.sentiment}
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                    </div>

                    <p className="text-neutral-black mb-4 leading-relaxed">
                      {feedback.comment}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {getSentimentIcon(feedback.sentiment)}
                          <span className="text-sm text-neutral-grey capitalize">
                            {feedback.sentiment}
                          </span>
                        </div>
                        {feedback.hasReply && (
                          <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                            Replied
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-black mb-2">
              No feedback found
            </h3>
            <p className="text-neutral-grey">
              {searchTerm || filterSentiment !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't received any feedback yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
