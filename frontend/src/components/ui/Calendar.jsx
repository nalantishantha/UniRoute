import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock, User, X } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";

const Calendar = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
  bookedDates = [],
  onSetAvailability,
  events = [],
  className = "",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [tempSelectedDate, setTempSelectedDate] = useState(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Previous month's last days
  const prevMonth = new Date(year, month - 1, 0);
  const prevDaysCount = startingDayOfWeek;
  const prevDays = Array.from(
    { length: prevDaysCount },
    (_, i) => prevMonth.getDate() - prevDaysCount + i + 1
  );

  // Current month days
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Next month's first days
  const totalCells = 42; // 6 weeks * 7 days
  const nextDaysCount = totalCells - prevDaysCount - daysInMonth;
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);

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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isAvailable = (day) => {
    return availableDates.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
    );
  };

  const isBooked = (day) => {
    return bookedDates.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
    );
  };

  const getEventsForDay = (day) => {
    const dayDate = new Date(year, month, day);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    if (onDateSelect) {
      onDateSelect(clickedDate);
    }
  };

  const handleSetAvailability = (day) => {
    const clickedDate = new Date(year, month, day);
    setTempSelectedDate(clickedDate);
    setShowAvailabilityModal(true);
  };

  const handleSaveAvailability = () => {
    if (onSetAvailability && tempSelectedDate) {
      onSetAvailability(tempSelectedDate, selectedTimeSlots);
    }
    setShowAvailabilityModal(false);
    setSelectedTimeSlots([]);
    setTempSelectedDate(null);
  };

  const toggleTimeSlot = (time) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const getDayClassName = (day, isCurrentMonth = true) => {
    let classes =
      "relative h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer";

    if (!isCurrentMonth) {
      classes += " text-neutral-light-grey";
    } else if (isToday(day)) {
      classes += " bg-primary-500 text-white font-bold";
    } else if (isSelected(day)) {
      classes += " bg-primary-100 text-primary-700 ring-2 ring-primary-400";
    } else if (isBooked(day)) {
      classes += " bg-error/20 text-error border border-error/30";
    } else if (isAvailable(day)) {
      classes += " bg-success/20 text-success border border-success/30";
    } else {
      classes += " text-neutral-black hover:bg-neutral-silver/70";
    }

    return classes;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-neutral-silver p-6",
        className
      )}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-black">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-neutral-grey py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Previous Month Days */}
        {prevDays.map((day) => (
          <div key={`prev-${day}`} className={getDayClassName(day, false)}>
            {day}
          </div>
        ))}

        {/* Current Month Days */}
        {currentDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div key={day} className="relative">
              <div
                className={getDayClassName(day)}
                onClick={() => handleDateClick(day)}
              >
                {day}
                {dayEvents.length > 0 && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-info rounded-full"></div>
                )}
              </div>
              {onSetAvailability && (
                <button
                  onClick={() => handleSetAvailability(day)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Plus className="w-2 h-2" />
                </button>
              )}
            </div>
          );
        })}

        {/* Next Month Days */}
        {nextDays.map((day) => (
          <div key={`next-${day}`} className={getDayClassName(day, false)}>
            {day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
          <span className="text-neutral-grey">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success/20 border border-success/30 rounded-full"></div>
          <span className="text-neutral-grey">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error/20 border border-error/30 rounded-full"></div>
          <span className="text-neutral-grey">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-info rounded-full"></div>
          <span className="text-neutral-grey">Events</span>
        </div>
      </div>

      {/* Availability Modal */}
      <AnimatePresence>
        {showAvailabilityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAvailabilityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-black">
                  Set Availability
                </h3>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-neutral-grey mb-4">
                {tempSelectedDate &&
                  `${
                    monthNames[tempSelectedDate.getMonth()]
                  } ${tempSelectedDate.getDate()}, ${tempSelectedDate.getFullYear()}`}
              </p>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-neutral-black">
                  Available Time Slots:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => toggleTimeSlot(time)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-lg border transition-all duration-200",
                        selectedTimeSlots.includes(time)
                          ? "bg-primary-100 border-primary-300 text-primary-700"
                          : "bg-neutral-silver/50 border-neutral-light-grey text-neutral-grey hover:bg-neutral-silver"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAvailability}
                  disabled={selectedTimeSlots.length === 0}
                  className="flex-1"
                >
                  Save Availability
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
