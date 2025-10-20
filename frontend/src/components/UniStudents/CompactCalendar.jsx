import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";

export default function CompactCalendar({ isOpen, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const mentorId = user.mentor_id || null;

  // Fetch sessions data
  useEffect(() => {
    const fetchSessions = async () => {
      if (!isOpen) return;

      setLoading(true);
      const fetchedEvents = [];

      try {
        // Fetch tutor_id first
        let tutorId = user.tutor_id || null;
        if (!tutorId && (user.university_student_id || user.student_id)) {
          try {
            const response = await fetch(
              `http://localhost:8000/api/tutoring/tutors/`
            );
            const data = await response.json();
            if (data.success && data.tutors) {
              const myTutor = data.tutors.find(
                (t) =>
                  t.university_student_id ===
                  (user.university_student_id || user.student_id)
              );
              if (myTutor) {
                tutorId = myTutor.tutor_id;
              }
            }
          } catch (error) {
            console.error("Failed to fetch tutor ID:", error);
          }
        }

        // Fetch mentoring sessions
        if (mentorId) {
          try {
            const response = await fetch(
              `http://localhost:8000/api/mentoring/sessions/${mentorId}/`
            );
            const data = await response.json();
            if (data.status === "success" && data.sessions) {
              data.sessions.forEach((session) => {
                const sessionDate = new Date(session.scheduled_at);
                fetchedEvents.push({
                  date: sessionDate.toISOString().split("T")[0],
                  type: "scheduled-mentoring",
                  title: session.topic,
                });
              });
            }
          } catch (error) {
            console.error("Failed to fetch mentoring sessions:", error);
          }
        }

        // Fetch tutoring bookings
        if (tutorId) {
          try {
            const response = await fetch(
              `http://localhost:8000/api/tutoring/bookings/tutor/${tutorId}/`
            );
            const data = await response.json();
            if (data.status === "success" && data.bookings) {
              data.bookings.forEach((booking) => {
                const bookingDate = new Date(booking.start_date);

                // Handle recurring bookings
                if (booking.is_recurring && booking.availability_slot) {
                  const endDate = booking.end_date
                    ? new Date(booking.end_date)
                    : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                  const currentDate = new Date(bookingDate);
                  const dayOfWeek = booking.availability_slot.day_of_week;

                  while (currentDate <= endDate) {
                    if (currentDate.getDay() === dayOfWeek) {
                      fetchedEvents.push({
                        date: currentDate.toISOString().split("T")[0],
                        type: "scheduled-tutoring",
                        title:
                          booking.topic ||
                          booking.subject_name ||
                          "Tutoring Session",
                      });
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                  }
                } else {
                  fetchedEvents.push({
                    date: bookingDate.toISOString().split("T")[0],
                    type: "scheduled-tutoring",
                    title:
                      booking.topic ||
                      booking.subject_name ||
                      "Tutoring Session",
                  });
                }
              });
            }
          } catch (error) {
            console.error("Failed to fetch tutoring bookings:", error);
          }
        }

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [
    isOpen,
    mentorId,
    user.university_student_id,
    user.student_id,
    user.tutor_id,
  ]);

  // Event type colors (pastel colors matching main calendar)
  const eventColors = {
    "scheduled-mentoring": "bg-purple-400",
    "scheduled-tutoring": "bg-pink-400",
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
    onClose(); // Close the modal first
    navigate(
      `/university-student/calendar?date=${date.toISOString().split("T")[0]}`
    );
  };

  // Handle "View Full Calendar" click
  const handleViewFullCalendar = () => {
    onClose(); // Close the modal first
    navigate("/university-student/calendar");
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
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-neutral-black">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400"></div>
                )}
              </div>
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
                <p className="text-xs text-neutral-grey mb-2">Sessions:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span className="text-neutral-grey">Mentoring</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    <span className="text-neutral-grey">Tutoring</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleViewFullCalendar}
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
