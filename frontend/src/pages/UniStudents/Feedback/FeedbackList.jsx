import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  Search,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Eye,
  Reply,
  Calendar,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const FeedbackList = ({ feedbackData, filterStatus }) => {
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
        className={`w-4 h-4 ${index < rating
            ? "text-warning fill-current"
            : "text-neutral-light-grey"
          }`}
      />
    ));
  };

  return (
    <>
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
              className={`cursor-pointer transition-all hover:shadow-md ${!feedback.isRead ? "border-l-4 border-l-primary-500" : ""
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
    </>
  );
};

export default FeedbackList;
