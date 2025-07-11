import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  Filter,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Calendar from "../../../components/ui/Calendar";

const mockAvailableDates = [
  new Date(2024, 1, 15),
  new Date(2024, 1, 16),
  new Date(2024, 1, 17),
  new Date(2024, 1, 20),
  new Date(2024, 1, 21),
  new Date(2024, 1, 22),
];

const mockBookedDates = [
  new Date(2024, 1, 18),
  new Date(2024, 1, 19),
  new Date(2024, 1, 23),
];

const mockEvents = [
  {
    id: 1,
    title: "Math Tutoring with Sarah",
    date: "2024-02-15",
    time: "14:00",
    duration: "1 hour",
    student: "Sarah Chen",
    type: "tutoring",
    status: "confirmed",
  },
  {
    id: 2,
    title: "University Guidance Session",
    date: "2024-02-16",
    time: "10:00",
    duration: "2 hours",
    student: "Michael Brown",
    type: "mentoring",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Physics Lab Prep",
    date: "2024-02-17",
    time: "16:00",
    duration: "1.5 hours",
    student: "Lisa Johnson",
    type: "tutoring",
    status: "pending",
  },
];

const upcomingAvailability = [
  {
    date: "2024-02-20",
    timeSlots: ["09:00", "10:00", "14:00", "15:00", "16:00"],
    booked: 2,
    available: 3,
  },
  {
    date: "2024-02-21",
    timeSlots: ["11:00", "13:00", "14:00", "17:00", "18:00"],
    booked: 1,
    available: 4,
  },
  {
    date: "2024-02-22",
    timeSlots: ["09:00", "10:00", "11:00", "15:00"],
    booked: 0,
    available: 4,
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState(mockAvailableDates);
  const [bookedDates, setBookedDates] = useState(mockBookedDates);
  const [events, setEvents] = useState(mockEvents);
  const [activeTab, setActiveTab] = useState("calendar");

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSetAvailability = (date, timeSlots) => {
    console.log("Setting availability for:", date, "Time slots:", timeSlots);
    // Add logic to save availability
    setAvailableDates((prev) => {
      const exists = prev.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
      if (!exists) {
        return [...prev, date];
      }
      return prev;
    });
  };

  const stats = {
    totalAvailableSlots: 45,
    bookedSlots: 18,
    upcomingSlots: 12,
    completedSessions: 156,
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
          <Button variant="outline" size="lg">
            <Filter className="w-4 h-4 mr-2" />
            Filter Events
          </Button>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Quick Availability
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Available Slots
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.totalAvailableSlots}
                </p>
                <p className="text-sm text-success mt-1">
                  {stats.upcomingSlots} upcoming
                </p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Booked Sessions
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.bookedSlots}
                </p>
                <p className="text-sm text-info mt-1">
                  {Math.round(
                    (stats.bookedSlots / stats.totalAvailableSlots) * 100
                  )}
                  % utilization
                </p>
              </div>
              <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  {stats.completedSessions}
                </p>
                <p className="text-sm text-neutral-grey mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary-600" />
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
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  4.9
                </p>
                <p className="text-sm text-success mt-1">+0.2 this month</p>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                <span>Schedule Calendar</span>
              </CardTitle>
              <CardDescription>
                Set your availability and view scheduled sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                availableDates={availableDates}
                bookedDates={bookedDates}
                onSetAvailability={handleSetAvailability}
                events={events}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <span>Upcoming Availability</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAvailability.map((availability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-neutral-silver/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-black">
                      {new Date(availability.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-neutral-grey">
                      {availability.timeSlots.length} slots
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-success">
                        {availability.available} available
                      </span>
                      <span className="text-neutral-light-grey">•</span>
                      <span className="text-info">
                        {availability.booked} booked
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary-600" />
                <span>Today's Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events
                .filter((event) => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  return eventDate.toDateString() === today.toDateString();
                })
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-neutral-light-grey rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-neutral-black">
                          {event.title}
                        </h4>
                        <p className="text-sm text-neutral-grey">
                          {event.student}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.status === "confirmed"
                            ? "bg-success/20 text-success"
                            : "bg-warning/20 text-yellow-600"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-neutral-grey">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{event.duration}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              {events.filter((event) => {
                const eventDate = new Date(event.date);
                const today = new Date();
                return eventDate.toDateString() === today.toDateString();
              }).length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
                  <p className="text-neutral-grey">No events today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
