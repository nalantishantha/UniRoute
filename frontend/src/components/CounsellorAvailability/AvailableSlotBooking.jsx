import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Send,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";

const CounsellorAvailableSlotBooking = ({ counsellorId, counsellorName, onBookingSuccess }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = this week, 1 = next week
  const [bookingData, setBookingData] = useState({
    topic: "",
    description: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchAvailableSlots = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/counsellors/available-slots/${counsellorId}/`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setAvailableSlots(data.available_slots);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to fetch available slots" });
    } finally {
      setLoading(false);
    }
  }, [counsellorId]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.topic.trim()) {
      setMessage({ type: "error", text: "Topic is required" });
      return;
    }

    if (!bookingData.description.trim()) {
      setMessage({ type: "error", text: "Description is required" });
      return;
    }

    // Get student ID from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setMessage({ type: "error", text: "Please log in to book a session" });
      return;
    }
    
    const user = JSON.parse(userStr);
    if (!user.student_id) {
      setMessage({ type: "error", text: "Student information not found. Please log in again." });
      return;
    }

    try {
      setLoading(true);
      
      // Create session request
      const response = await fetch(`/api/counsellors/requests/${counsellorId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: user.student_id,
          topic: bookingData.topic,
          scheduled_at: selectedSlot.datetime,
          session_type: "online",
          description: bookingData.description
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setMessage({ type: "success", text: "Booking request sent successfully! The counsellor will review and approve your request." });
        resetBookingForm();
        fetchAvailableSlots(); // Refresh slots
        if (onBookingSuccess) {
          onBookingSuccess(data);
        }
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to submit booking request" });
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setSelectedSlot(null);
    setShowBookingForm(false);
    setBookingData({
      topic: "",
      description: ""
    });
  };

  // Group slots by date
  const groupedSlots = availableSlots.reduce((groups, slot) => {
    const date = slot.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});

  // Get slots for current week view
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + (currentWeek * 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekSlots = Object.keys(groupedSlots).filter(date => {
    const slotDate = new Date(date);
    return slotDate >= weekStart && slotDate <= weekEnd;
  }).reduce((filtered, date) => {
    filtered[date] = groupedSlots[date];
    return filtered;
  }, {});

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Available Time Slots</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-neutral-grey">
              {currentWeek === 0 ? "This Week" : "Next Week"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(Math.min(1, currentWeek + 1))}
              disabled={currentWeek === 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {counsellorName && (
          <p className="text-neutral-grey">
            Book a session with {counsellorName}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Message Display */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded-lg flex items-center space-x-2 ${
                message.type === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="ml-auto text-current hover:opacity-70"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available Slots */}
        {loading && !showBookingForm ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : Object.keys(weekSlots).length === 0 ? (
          <div className="text-center py-8 text-neutral-grey">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No available slots for this week.</p>
            <p className="text-sm">Please check next week or contact the counsellor directly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(weekSlots).sort().map(date => (
              <div key={date} className="border border-neutral-light-grey rounded-lg p-4">
                <h3 className="font-medium text-lg mb-3 text-neutral-black">
                  {formatDate(date)}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {weekSlots[date].map(slot => (
                    <motion.button
                      key={`${slot.date}-${slot.start_time}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-3 border rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all text-left ${
                        selectedSlot && 
                        selectedSlot.date === slot.date && 
                        selectedSlot.start_time === slot.start_time
                          ? "border-primary-500 bg-primary-100 ring-2 ring-primary-200"
                          : "border-primary-200"
                      }`}
                      disabled={loading}
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <span className="font-medium text-sm">
                          {slot.formatted_time}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Form */}
        <AnimatePresence>
          {showBookingForm && selectedSlot && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Book Session</span>
                  </CardTitle>
                  <p className="text-neutral-grey">
                    {formatDate(selectedSlot.date)} at {selectedSlot.formatted_time}
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Topic/Subject *
                      </label>
                      <input
                        type="text"
                        value={bookingData.topic}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          topic: e.target.value
                        }))}
                        placeholder="e.g., Career guidance for engineering field"
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description *
                      </label>
                      <textarea
                        value={bookingData.description}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        rows={4}
                        placeholder="Please describe what you'd like to discuss and any specific questions you have..."
                        className="w-full p-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Send Request</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetBookingForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CounsellorAvailableSlotBooking;
