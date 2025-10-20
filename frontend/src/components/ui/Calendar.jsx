import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Settings,
  X,
  Save,
  MapPin,
  MessageSquare,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

const mockEvents = [
  {
    id: 1,
    title: "Math Tutoring - Sarah Chen",
    date: "2025-07-15",
    time: "10:00 AM",
    endTime: "11:00 AM",
    type: "tutoring",
    duration: "1 hour",
    student: "Sarah Chen",
    location: "Online",
    notes: "Focus on calculus derivatives and integration",
  },
  {
    id: 2,
    title: "University Guidance - Mike Brown",
    date: "2025-07-18",
    time: "2:00 PM",
    endTime: "4:00 PM",
    type: "mentoring",
    duration: "2 hours",
    student: "Mike Brown",
    location: "Campus Library",
    notes: "Discuss application strategy for engineering programs",
  },
  {
    id: 3,
    title: "Personal Time",
    date: "2025-07-20",
    time: "9:00 AM",
    endTime: "12:00 PM",
    type: "personal",
    duration: "3 hours",
    notes: "Personal development and planning",
  },
  {
    id: 4,
    title: "Physics Tutoring - Emma Wilson",
    date: "2025-07-16",
    time: "3:00 PM",
    endTime: "4:30 PM",
    type: "tutoring",
    duration: "1.5 hours",
    student: "Emma Wilson",
    location: "Online",
    notes: "Mechanics and thermodynamics review",
  },
  {
    id: 5,
    title: "Career Guidance - Alex Johnson",
    date: "2025-07-17",
    time: "1:00 PM",
    endTime: "2:00 PM",
    type: "mentoring",
    duration: "1 hour",
    student: "Alex Johnson",
    location: "Office",
    notes: "Career path discussion and networking strategies",
  },
];

const defaultEventColors = {
  "scheduled-tutoring": {
    bg: "bg-pink-300",
    text: "text-pink-900",
    border: "border-pink-400",
    name: "Scheduled Tutoring",
  },
  "scheduled-mentoring": {
    bg: "bg-purple-300",
    text: "text-purple-900",
    border: "border-purple-400",
    name: "Scheduled Mentoring",
  },
  tutoring: {
    bg: "bg-pink-300",
    text: "text-pink-900",
    border: "border-pink-400",
    name: "Tutoring",
  },
  mentoring: {
    bg: "bg-purple-300",
    text: "text-purple-900",
    border: "border-purple-400",
    name: "Mentoring",
  },
  personal: {
    bg: "bg-success/20",
    text: "text-success",
    border: "border-success/30",
    name: "Personal",
  },
  blocked: {
    bg: "bg-error/20",
    text: "text-error",
    border: "border-error/30",
    name: "Blocked",
  },
  available: {
    bg: "bg-secondary/20",
    text: "text-yellow-600",
    border: "border-secondary/30",
    name: "Available",
  },
};

export default function Calendar({
  compact = false,
  onDateSelect = null,
  events: externalEvents = null,
  availableMentoringDates = [],
  availableTutoringDates = [],
  scheduledMentoringDates = [],
  scheduledTutoringDates = [],
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(externalEvents || mockEvents);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showColorSettings, setShowColorSettings] = useState(false);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [eventColors, setEventColors] = useState(defaultEventColors);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "9:00 AM",
    endTime: "10:00 AM",
    type: "available",
    duration: "1 hour",
    student: "",
    location: "",
    notes: "",
  });

  // Update events when external events prop changes
  useEffect(() => {
    if (externalEvents && externalEvents.length >= 0) {
      console.log("Calendar - Received events:", externalEvents);
      setEvents(externalEvents);
    }
  }, [externalEvents]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Add days from next month to complete the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      days.push({
        date: new Date(year, month + 1, nextMonthDay),
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }

    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter((event) => event.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (dateObj) => {
    if (!dateObj) return;
    const { date } = dateObj;
    setSelectedDate(date);
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setShowDayDetails(true);
    } else {
      // Show popup even if no events, allowing user to see empty day and add events
      setSelectedDayEvents([]);
      setShowDayDetails(true);
    }
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleAddEvent = () => {
    const dateToUse = selectedDate || new Date();
    setNewEvent({
      ...newEvent,
      date: formatDate(dateToUse),
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Edit existing event
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? { ...newEvent, id: selectedEvent.id }
            : event
        )
      );
    } else {
      // Add new event
      const event = {
        ...newEvent,
        id: Date.now(),
      };
      setEvents((prev) => [...prev, event]);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      date: "",
      time: "9:00 AM",
      endTime: "10:00 AM",
      type: "available",
      duration: "1 hour",
      student: "",
      location: "",
      notes: "",
    });
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const updateEventColor = (type, colorProperty, value) => {
    setEventColors((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [colorProperty]: value,
      },
    }));
  };

  if (compact) {
    // Compact calendar for navbar
    return (
      <Card className="w-72">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
            <div className="flex space-x-1">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-neutral-silver rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-neutral-silver rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-7 gap-1 text-xs">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div
                key={day}
                className="text-center text-neutral-grey font-medium p-1"
              >
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((dateObj, index) => {
              if (!dateObj) return <div key={index} />;

              const { date, isCurrentMonth } = dateObj;
              const dayEvents = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();
              const hasEvents = dayEvents.length > 0;

              return (
                <motion.button
                  key={`${date.getMonth()}-${date.getDate()}`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDateClick(dateObj)}
                  className={`
                    relative p-1 text-xs rounded transition-colors
                    ${isToday ? "bg-primary-500 text-white font-bold" : ""}
                    ${isSelected ? "bg-primary-200 text-primary-800" : ""}
                    ${
                      !isCurrentMonth
                        ? "text-neutral-light-grey bg-neutral-silver/30"
                        : ""
                    }
                    ${
                      !isToday && !isSelected && isCurrentMonth
                        ? "hover:bg-neutral-silver"
                        : ""
                    }
                    ${hasEvents && isCurrentMonth ? "bg-neutral-silver/50" : ""}
                  `}
                >
                  {date.getDate()}
                  {dayEvents.length > 0 && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${eventColors[
                            event.type
                          ]?.bg
                            .replace("/20", "")
                            .replace("/30", "")}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-grey" />
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          {selectedDate && (
            <div className="mt-3 pt-3 border-t border-neutral-silver">
              <p className="text-xs font-medium text-neutral-black mb-2">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className={`text-xs p-2 rounded mb-1 ${
                    eventColors[event.type]?.bg
                  } ${eventColors[event.type]?.text} border ${
                    eventColors[event.type]?.border
                  }`}
                >
                  <div className="font-medium">
                    {event.time} - {event.endTime}
                  </div>
                  <div className="truncate">{event.title}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full calendar view
  return (
    <>
      <div className="space-y-6">
        {/* Calendar Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* <Button size="sm" onClick={handleAddEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button> */}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-neutral-grey py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {getDaysInMonth(currentDate).map((dateObj, index) => {
                if (!dateObj) return <div key={index} className="h-32" />;

                const { date, isCurrentMonth } = dateObj;
                const dayEvents = getEventsForDate(date);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();
                const hasEvents = dayEvents.length > 0;

                // Check if this date is in any of the 4 date categories
                const dateStr = formatDate(date);
                const isAvailableMentoring = availableMentoringDates.some(
                  (d) => formatDate(d) === dateStr
                );
                const isAvailableTutoring = availableTutoringDates.some(
                  (d) => formatDate(d) === dateStr
                );
                const isScheduledMentoring = scheduledMentoringDates.some(
                  (d) => formatDate(d) === dateStr
                );
                const isScheduledTutoring = scheduledTutoringDates.some(
                  (d) => formatDate(d) === dateStr
                );

                // Determine background color based on priority
                // Priority: Scheduled > Available, Specific > None
                let bgClass = "";
                let borderClass = "";
                if (isScheduledMentoring && isScheduledTutoring) {
                  bgClass = "bg-gradient-to-br from-purple-100 to-pink-100";
                  borderClass = "border-purple-400";
                } else if (isScheduledMentoring) {
                  bgClass = "bg-purple-100";
                  borderClass = "border-purple-400";
                } else if (isScheduledTutoring) {
                  bgClass = "bg-pink-100";
                  borderClass = "border-pink-400";
                } else if (isAvailableMentoring && isAvailableTutoring) {
                  bgClass = "bg-gradient-to-br from-blue-50 to-green-50";
                  borderClass = "border-blue-300";
                } else if (isAvailableMentoring) {
                  bgClass = "bg-blue-100";
                  borderClass = "border-blue-400";
                } else if (isAvailableTutoring) {
                  bgClass = "bg-green-100";
                  borderClass = "border-green-400";
                }

                return (
                  <motion.div
                    key={`${date.getMonth()}-${date.getDate()}-${index}`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleDateClick(dateObj)}
                    className={`
                      h-32 p-2 border-2 rounded-lg cursor-pointer transition-all
                      ${
                        isToday
                          ? "border-primary-500 bg-primary-50 shadow-md"
                          : ""
                      }
                      ${
                        isSelected
                          ? "border-primary-400 bg-primary-100 shadow-sm"
                          : ""
                      }
                      ${
                        bgClass && isCurrentMonth && !isToday && !isSelected
                          ? `${bgClass} ${borderClass} shadow-sm`
                          : ""
                      }
                      ${
                        !isCurrentMonth
                          ? "bg-neutral-silver/20 border-neutral-light-grey/50 text-neutral-light-grey opacity-60"
                          : !bgClass
                          ? "border-neutral-300 bg-white hover:border-primary-300 hover:shadow-md hover:bg-primary-50/30"
                          : "hover:border-primary-300 hover:shadow-md"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`
                        font-semibold
                        ${isToday ? "text-primary-600" : ""}
                        ${
                          !isCurrentMonth
                            ? "text-neutral-light-grey"
                            : "text-neutral-black"
                        }
                      `}
                      >
                        {date.getDate()}
                      </div>
                      <div className="flex space-x-1">
                        {isScheduledMentoring && isCurrentMonth && (
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full shadow-sm"
                            title="Scheduled mentoring session"
                          ></div>
                        )}
                        {isScheduledTutoring && isCurrentMonth && (
                          <div
                            className="w-2 h-2 bg-pink-500 rounded-full shadow-sm"
                            title="Scheduled tutoring session"
                          ></div>
                        )}
                        {isAvailableMentoring &&
                          !isScheduledMentoring &&
                          isCurrentMonth && (
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"
                              title="Available for mentoring"
                            ></div>
                          )}
                        {isAvailableTutoring &&
                          !isScheduledTutoring &&
                          isCurrentMonth && (
                            <div
                              className="w-2 h-2 bg-green-500 rounded-full shadow-sm"
                              title="Available for tutoring"
                            ></div>
                          )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event, i) => {
                        // Format time display (handle both 24hr and 12hr formats)
                        const timeDisplay = event.time
                          ? event.time.includes("AM") ||
                            event.time.includes("PM")
                            ? event.time.replace(/:00/g, "")
                            : event.time
                          : "";
                        const endTimeDisplay = event.endTime
                          ? event.endTime.includes("AM") ||
                            event.endTime.includes("PM")
                            ? event.endTime.replace(/:00/g, "")
                            : ""
                          : "";

                        return (
                          <div
                            key={event.id}
                            className={`
                              text-xs px-1 py-1 rounded cursor-pointer truncate
                              ${eventColors[event.type]?.bg || "bg-gray-100"} ${
                              eventColors[event.type]?.text || "text-gray-700"
                            } 
                              border ${
                                eventColors[event.type]?.border ||
                                "border-gray-200"
                              }
                              hover:opacity-80 transition-opacity
                              ${!isCurrentMonth ? "opacity-50" : ""}
                            `}
                            title={`${event.title} - ${
                              event.student || "No student"
                            }`}
                          >
                            <div className="font-medium truncate">
                              {timeDisplay} {event.title?.substring(0, 15)}
                              {event.title?.length > 15 ? "..." : ""}
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div
                          className={`text-xs px-1 font-medium ${
                            !isCurrentMonth
                              ? "text-neutral-light-grey"
                              : "text-neutral-grey"
                          }`}
                        >
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Details Modal */}
      <AnimatePresence>
        {showDayDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDayDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                  <p className="text-sm text-neutral-grey mt-1">
                    {selectedDayEvents.length} event
                    {selectedDayEvents.length !== 1 ? "s" : ""} scheduled
                  </p>
                </div>
                <button
                  onClick={() => setShowDayDetails(false)}
                  className="text-neutral-grey hover:text-neutral-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedDayEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 rounded-lg border-2
                      ${eventColors[event.type]?.bg} ${
                      eventColors[event.type]?.border
                    }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4
                          className={`font-semibold text-lg ${
                            eventColors[event.type]?.text
                          }`}
                        >
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-grey">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {event.time} - {event.endTime} ({event.duration})
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <button
                          onClick={() => {
                            handleEditEvent(event);
                            setShowDayDetails(false);
                          }}
                          className="p-2 text-neutral-grey hover:text-primary-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button> */}
                        {/* <button
                          onClick={() => {
                            handleDeleteEvent(event.id);
                            setSelectedDayEvents((prev) =>
                              prev.filter((e) => e.id !== event.id)
                            );
                            if (selectedDayEvents.length === 1) {
                              setShowDayDetails(false);
                            }
                          }}
                          className="p-2 text-neutral-grey hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button> */}
                      </div>
                    </div>

                    {event.student && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-neutral-black">
                          Student:{" "}
                        </span>
                        <span className="text-sm text-neutral-grey">
                          {event.student}
                        </span>
                      </div>
                    )}

                    {event.notes && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-neutral-black">
                          Notes:{" "}
                        </span>
                        <span className="text-sm text-neutral-grey">
                          {event.notes}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-silver">
                      <span
                        className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${eventColors[event.type]?.bg} ${
                          eventColors[event.type]?.text
                        }
                      `}
                      >
                        {eventColors[event.type]?.name}
                      </span>

                      {event.type !== "personal" && (
                        <div className="flex items-center space-x-2">
                          {/* <button className="text-sm text-primary-600 hover:text-primary-800 flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>Message</span>
                          </button> */}
                          {event.type === "tutoring" && (
                            <button className="text-sm text-primary-600 hover:text-primary-800 flex items-center space-x-1">
                              <Video className="w-4 h-4" />
                              <span>Join Session</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-silver mt-6">
                {/* <Button
                  variant="outline"
                  onClick={() => {
                    setShowDayDetails(false);
                    handleAddEvent();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button> */}
                <Button onClick={() => setShowDayDetails(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  }}
                  className="text-neutral-grey hover:text-neutral-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    placeholder="Event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Start Time
                    </label>
                    <select
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      End Time
                    </label>
                    <select
                      value={newEvent.endTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Duration
                  </label>
                  <select
                    value={newEvent.duration}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  >
                    <option value="30 min">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  >
                    {Object.entries(eventColors).map(([type, colors]) => (
                      <option key={type} value={type}>
                        {colors.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={newEvent.student}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, student: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    placeholder="Student name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    placeholder="Location (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newEvent.notes}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    placeholder="Additional notes (optional)"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEvent}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Event
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color Settings Modal */}
      <AnimatePresence>
        {showColorSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowColorSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  Customize Event Colors
                </h3>
                <button
                  onClick={() => setShowColorSettings(false)}
                  className="text-neutral-grey hover:text-neutral-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(eventColors).map(([type, colors]) => (
                  <div
                    key={type}
                    className="border border-neutral-silver rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{colors.name}</h4>
                      <div
                        className={`px-3 py-1 rounded text-sm ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        Preview
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Background
                        </label>
                        <select
                          value={colors.bg}
                          onChange={(e) =>
                            updateEventColor(type, "bg", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400"
                        >
                          <option value="bg-primary-100">Primary Light</option>
                          <option value="bg-info/20">Info Light</option>
                          <option value="bg-success/20">Success Light</option>
                          <option value="bg-warning/20">Warning Light</option>
                          <option value="bg-error/20">Error Light</option>
                          <option value="bg-secondary/20">
                            Secondary Light
                          </option>
                          <option value="bg-neutral-silver">Neutral</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Text Color
                        </label>
                        <select
                          value={colors.text}
                          onChange={(e) =>
                            updateEventColor(type, "text", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400"
                        >
                          <option value="text-primary-600">Primary</option>
                          <option value="text-info">Info</option>
                          <option value="text-success">Success</option>
                          <option value="text-yellow-600">Warning</option>
                          <option value="text-error">Error</option>
                          <option value="text-neutral-black">Black</option>
                          <option value="text-neutral-dark-grey">
                            Dark Grey
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Border
                        </label>
                        <select
                          value={colors.border}
                          onChange={(e) =>
                            updateEventColor(type, "border", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-neutral-light-grey rounded focus:ring-2 focus:ring-primary-400"
                        >
                          <option value="border-primary-200">Primary</option>
                          <option value="border-info/30">Info</option>
                          <option value="border-success/30">Success</option>
                          <option value="border-warning/30">Warning</option>
                          <option value="border-error/30">Error</option>
                          <option value="border-secondary/30">Secondary</option>
                          <option value="border-neutral-light-grey">
                            Neutral
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-silver mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setEventColors(defaultEventColors)}
                >
                  Reset to Default
                </Button>
                <Button onClick={() => setShowColorSettings(false)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
