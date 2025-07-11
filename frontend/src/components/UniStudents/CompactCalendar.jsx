import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { cn } from "../../utils/cn";

export default function CompactCalendar({ isOpen, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample events data for demonstration
  const events = [
    { date: "2024-01-15", type: "assignment", title: "Math Assignment Due" },
    { date: "2024-01-18", type: "meeting", title: "Mentoring Session" },
    { date: "2024-01-22", type: "exam", title: "Physics Exam" },
    { date: "2024-01-25", type: "assignment", title: "Essay Submission" },
    { date: "2024-01-28", type: "meeting", title: "Study Group" },
  ];

  // Event type colors
  const eventColors = {
    assignment: "bg-blue-400",
    meeting: "bg-green-400",
    exam: "bg-red-400",
    study: "bg-yellow-400",
    deadline: "bg-purple-400",
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateStr);
  };

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days
  const calendarDays = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
    });
  }

  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;

    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday,
      date: new Date(currentYear, currentMonth, day),
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(currentYear, currentMonth + 1, day),
    });
  }

  // Navigation functions
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle day click
  const handleDayClick = (date) => {
    // Navigate to calendar page with selected date
    window.location.href = `/calendar?date=${date.toISOString().split("T")[0]}`;
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Compact Calendar Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-neutral-silver/50 p-6 w-80"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-black">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevMonth}
                  className="p-1 rounded-lg hover:bg-neutral-silver/50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-dark-grey" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-1 rounded-lg hover:bg-neutral-silver/50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-dark-grey" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-neutral-silver/50 transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-dark-grey" />
                </button>
              </div>
            </div>

            {/* Today Button */}
            <button
              onClick={goToToday}
              className="w-full mb-4 px-3 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 text-sm font-medium"
            >
              Go to Today
            </button>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-neutral-grey py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((dayObj, index) => {
                const dayEvents = getEventsForDate(dayObj.date);
                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(dayObj.date)}
                    className={cn(
                      "relative aspect-square text-sm font-medium rounded-lg transition-all duration-200 hover:bg-primary-50 hover:scale-105",
                      dayObj.isCurrentMonth
                        ? "text-neutral-black hover:text-primary-700"
                        : "text-neutral-grey/50 hover:text-neutral-grey",
                      dayObj.isToday &&
                        "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
                    )}
                  >
                    {dayObj.day}
                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {dayEvents.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              eventColors[event.type] || "bg-gray-400"
                            )}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-neutral-silver/50">
              {/* Event legend */}
              <div className="mb-3">
                <p className="text-xs text-neutral-grey mb-2">Event Types:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-neutral-grey">Assignment</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-neutral-grey">Meeting</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="text-neutral-grey">Exam</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => (window.location.href = "/calendar")}
                className="w-full px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                View Full Calendar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
