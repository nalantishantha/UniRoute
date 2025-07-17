import { useState } from "react";
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

      {/* Feedback List with Filters and Search */}
      <FeedbackList
        feedbackData={feedbackData}
        filterStatus={filterStatus}
      />
    </motion.div>
  );
}
