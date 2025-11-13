import { useState, useEffect, useCallback } from "react";
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
  Settings,
  BookOpen,
  GraduationCap,
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
import AvailabilityManager from "../../../components/MentorAvailability/AvailabilityManager";
import TutoringAvailabilityManager from "../../../components/TutoringAvailability/TutoringAvailabilityManager";
import { mentoringAPI } from "../../../utils/mentoringAPI";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableMentoringDates, setAvailableMentoringDates] = useState([]);
  const [availableTutoringDates, setAvailableTutoringDates] = useState([]);
  const [scheduledMentoringDates, setScheduledMentoringDates] = useState([]);
  const [scheduledTutoringDates, setScheduledTutoringDates] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("calendar");
  const [tutorId, setTutorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mentoringSessions, setMentoringSessions] = useState([]);
  const [tutoringBookings, setTutoringBookings] = useState([]);
  const [mentorAvailability, setMentorAvailability] = useState([]);
  const [tutorAvailability, setTutorAvailability] = useState([]);

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const mentorId = user.mentor_id || null;
  const studentId = user.student_id || null;

  // Debug: Log user data
  console.log("CalendarPage - User from localStorage:", user);
  console.log("CalendarPage - User keys:", Object.keys(user));

  // Fetch tutor_id for the logged-in university student
  useEffect(() => {
    const fetchTutorId = async () => {
      try {
        // Check if user object is empty
        if (!user || Object.keys(user).length === 0) {
          console.error("❌ No user data in localStorage");
          setTutorId(null);
          return;
        }

        console.log("Fetching tutor ID for user:", {
          user_id: user.user_id,
          university_student_id: user.university_student_id,
          student_id: user.student_id,
        });

        // First check if tutor_id is already in user object
        if (user.tutor_id) {
          console.log("✓ Found tutor_id in user object:", user.tutor_id);
          setTutorId(user.tutor_id);
          return;
        }

        // Otherwise, fetch from API using university_student_id
        if (user.university_student_id || user.student_id) {
          console.log("Fetching tutors from API...");
          const response = await fetch(
            `http://localhost:8000/api/tutoring/tutors/`
          );
          const data = await response.json();
          console.log("API Response:", data);

          if (data.success && data.tutors) {
            // Find tutor matching this university student
            const myTutor = data.tutors.find(
              (t) =>
                t.university_student_id ===
                (user.university_student_id || user.student_id)
            );
            if (myTutor) {
              console.log("✓ Found matching tutor:", myTutor.tutor_id);
              setTutorId(myTutor.tutor_id);
            } else {
              console.warn("⚠️ No tutor found for this university student");
              console.log(
                "Available tutors:",
                data.tutors.map((t) => ({
                  tutor_id: t.tutor_id,
                  university_student_id: t.university_student_id,
                }))
              );
              setTutorId(null);
            }
          } else {
            console.error("❌ API returned no tutors");
            setTutorId(null);
          }
        } else {
          console.error(
            "❌ No university_student_id or student_id in user object"
          );
          setTutorId(null);
        }
      } catch (error) {
        console.error("❌ Failed to fetch tutor ID:", error);
        setTutorId(null);
      }
    };
    fetchTutorId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all calendar data
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);

        // Fetch mentoring sessions if user is a mentor
        if (mentorId) {
          try {
            const mentoringResponse = await fetch(
              `http://localhost:8000/api/mentoring/sessions/${mentorId}/`
            );
            const mentoringData = await mentoringResponse.json();
            if (mentoringData.status === "success") {
              setMentoringSessions(mentoringData.sessions || []);
              console.log("Mentoring sessions loaded:", mentoringData.sessions);
            }
          } catch (error) {
            console.error("Failed to fetch mentoring sessions:", error);
          }

          // Fetch mentor availability
          try {
            const mentorAvailResponse = await fetch(
              `http://localhost:8000/api/mentoring/availability/${mentorId}/`
            );
            const mentorAvailData = await mentorAvailResponse.json();
            if (mentorAvailData.status === "success") {
              setMentorAvailability(mentorAvailData.availability || []);
              console.log(
                "Mentor availability loaded:",
                mentorAvailData.availability
              );
            }
          } catch (error) {
            console.error("Failed to fetch mentor availability:", error);
          }
        }

        // Fetch tutoring bookings if user is a tutor
        if (tutorId) {
          try {
            const tutoringResponse = await fetch(
              `http://localhost:8000/api/tutoring/bookings/tutor/${tutorId}/`
            );
            const tutoringData = await tutoringResponse.json();
            if (tutoringData.status === "success") {
              setTutoringBookings(tutoringData.bookings || []);
              console.log("Tutoring bookings loaded:", tutoringData.bookings);
            }
          } catch (error) {
            console.error("Failed to fetch tutoring bookings:", error);
          }

          // Fetch tutor availability
          try {
            const tutorAvailResponse = await fetch(
              `http://localhost:8000/api/tutoring/availability/${tutorId}/`
            );
            const tutorAvailData = await tutorAvailResponse.json();
            if (tutorAvailData.status === "success") {
              setTutorAvailability(tutorAvailData.availability || []);
              console.log(
                "Tutor availability loaded:",
                tutorAvailData.availability
              );
            }
          } catch (error) {
            console.error("Failed to fetch tutor availability:", error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId || tutorId) {
      fetchCalendarData();
    } else {
      setLoading(false);
    }
  }, [mentorId, tutorId]);

  // Process events and dates from fetched data
  useEffect(() => {
    const processedEvents = [];
    const availableMentoringDatesSet = new Set();
    const availableTutoringDatesSet = new Set();
    const scheduledMentoringDatesSet = new Set();
    const scheduledTutoringDatesSet = new Set();

    // Process mentoring sessions (scheduled)
    mentoringSessions.forEach((session) => {
      const sessionDate = new Date(session.scheduled_at);
      const dateStr = sessionDate.toISOString().split("T")[0];

      processedEvents.push({
        id: `mentoring-${session.id}`,
        title: session.topic,
        date: dateStr,
        time: sessionDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: `${session.duration_minutes || 60} min`,
        student: session.student || "Unknown Student",
        type: "scheduled-mentoring",
        status: session.status,
      });

      scheduledMentoringDatesSet.add(dateStr);
    });

    // Process tutoring bookings (scheduled)
    tutoringBookings.forEach((booking) => {
      const bookingDate = new Date(booking.start_date);

      // For recurring bookings, we'll add multiple events
      if (booking.is_recurring && booking.availability_slot) {
        const endDate = booking.end_date
          ? new Date(booking.end_date)
          : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 3 months from now
        const currentDate = new Date(bookingDate);
        const dayOfWeek = booking.availability_slot.day_of_week;

        while (currentDate <= endDate) {
          if (currentDate.getDay() === (dayOfWeek === 0 ? 0 : dayOfWeek)) {
            const dateStr = currentDate.toISOString().split("T")[0];

            processedEvents.push({
              id: `tutoring-${booking.booking_id}-${dateStr}`,
              title:
                booking.topic || booking.subject_name || "Tutoring Session",
              date: dateStr,
              time: booking.availability_slot.start_time,
              duration: `${calculateDuration(
                booking.availability_slot.start_time,
                booking.availability_slot.end_time
              )} min`,
              student: booking.student_name || "Unknown Student",
              type: "scheduled-tutoring",
              status: booking.status,
            });

            scheduledTutoringDatesSet.add(dateStr);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        // Single booking
        const dateStr = bookingDate.toISOString().split("T")[0];
        processedEvents.push({
          id: `tutoring-${booking.booking_id}`,
          title: booking.topic || booking.subject_name || "Tutoring Session",
          date: dateStr,
          time: booking.availability_slot?.start_time || "00:00",
          duration: booking.availability_slot
            ? `${calculateDuration(
                booking.availability_slot.start_time,
                booking.availability_slot.end_time
              )} min`
            : "N/A",
          student: booking.student_name || "Unknown Student",
          type: "scheduled-tutoring",
          status: booking.status,
        });
        scheduledTutoringDatesSet.add(dateStr);
      }
    });

    // Process mentor availability to show available mentoring dates
    mentorAvailability.forEach((slot) => {
      if (slot.is_active) {
        // Generate dates for the next 30 days for this day of week
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);

          if (date.getDay() === slot.day_of_week) {
            const dateStr = date.toISOString().split("T")[0];
            // Only add if not already scheduled
            if (!scheduledMentoringDatesSet.has(dateStr)) {
              availableMentoringDatesSet.add(dateStr);
            }
          }
        }
      }
    });

    // Process tutor availability to show available tutoring dates
    tutorAvailability.forEach((slot) => {
      if (slot.is_active) {
        // Generate dates for the next 30 days for this day of week
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);

          // Convert day_of_week (0=Sunday in backend) to JavaScript day (0=Sunday)
          if (date.getDay() === slot.day_of_week) {
            const dateStr = date.toISOString().split("T")[0];
            // Only add if not already scheduled
            if (!scheduledTutoringDatesSet.has(dateStr)) {
              availableTutoringDatesSet.add(dateStr);
            }
          }
        }
      }
    });

    setEvents(processedEvents);
    setAvailableMentoringDates(
      Array.from(availableMentoringDatesSet).map((d) => new Date(d))
    );
    setAvailableTutoringDates(
      Array.from(availableTutoringDatesSet).map((d) => new Date(d))
    );
    setScheduledMentoringDates(
      Array.from(scheduledMentoringDatesSet).map((d) => new Date(d))
    );
    setScheduledTutoringDates(
      Array.from(scheduledTutoringDatesSet).map((d) => new Date(d))
    );
  }, [
    mentoringSessions,
    tutoringBookings,
    mentorAvailability,
    tutorAvailability,
  ]);

  // Helper function to calculate duration in minutes
  const calculateDuration = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    return endHour * 60 + endMin - (startHour * 60 + startMin);
  };

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

  // Calculate statistics from real data
  const stats = {
    totalAvailableSlots:
      mentorAvailability.filter((s) => s.is_active).length +
      tutorAvailability.filter((s) => s.is_active).length,
    bookedSlots:
      mentoringSessions.filter((s) => s.status === "scheduled").length +
      tutoringBookings.filter((b) =>
        ["confirmed", "active", "scheduled"].includes(b.status)
      ).length,
    upcomingSlots: events.filter((e) => {
      const eventDate = new Date(e.date);
      return (
        eventDate >= new Date() &&
        ["scheduled", "confirmed", "active"].includes(e.status)
      );
    }).length,
    completedSessions:
      mentoringSessions.filter((s) => s.status === "completed").length +
      tutoringBookings.filter((b) => b.status === "completed").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between"></div>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-light-grey">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "calendar"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-grey hover:text-neutral-black hover:border-neutral-light-grey"
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setActiveTab("availability")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "availability"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-grey hover:text-neutral-black hover:border-neutral-light-grey"
            }`}
          >
            Manage Availability
          </button>
        </nav>
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
      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              {/* <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5 text-primary-600" />
                      <span>Schedule Calendar</span>
                    </CardTitle>
                    <CardDescription>
                      View your availability and scheduled sessions
                    </CardDescription>
                  </div>
                  {loading && (
                    <div className="flex items-center text-sm text-neutral-grey">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400 mr-2"></div>
                      Loading...
                    </div>
                  )}
                </div>
              </CardHeader> */}
              <CardContent>
                {loading ? (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
                    <p className="text-neutral-grey">
                      Loading calendar data...
                    </p>
                  </div>
                ) : (
                  <>
                    <Calendar
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      availableMentoringDates={availableMentoringDates}
                      availableTutoringDates={availableTutoringDates}
                      scheduledMentoringDates={scheduledMentoringDates}
                      scheduledTutoringDates={scheduledTutoringDates}
                      onSetAvailability={handleSetAvailability}
                      events={events}
                    />
                    {/* Calendar Legend with Pastel Colors */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-neutral-silver/20 to-neutral-silver/40 rounded-lg border border-neutral-light-grey">
                      <div className="flex items-center justify-between text-sm flex-wrap gap-4">
                        <div className="flex items-center gap-6 flex-wrap">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-blue-200 border-2 border-blue-400 rounded shadow-sm mr-2"></div>
                            <span className="text-neutral-black font-semibold">
                              Available Mentoring Slots
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-green-200 border-2 border-green-400 rounded shadow-sm mr-2"></div>
                            <span className="text-neutral-black font-semibold">
                              Available Tutoring Slots
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-purple-200 border-2 border-purple-400 rounded shadow-sm mr-2"></div>
                            <span className="text-neutral-black font-semibold">
                              Scheduled Mentoring Sessions
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-pink-200 border-2 border-pink-400 rounded shadow-sm mr-2"></div>
                            <span className="text-neutral-black font-semibold">
                              Scheduled Tutoring Sessions
                            </span>
                          </div>
                        </div>
                        {events.length > 0 && (
                          <div className="text-neutral-black font-semibold bg-white px-3 py-1 rounded-full border border-neutral-light-grey">
                            {events.length} session
                            {events.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
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
                  <span>Your Availability Slots</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
                    <p className="text-neutral-grey mt-2">
                      Loading availability...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mentor Availability */}
                    {mentorAvailability.filter((s) => s.is_active).length >
                      0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-neutral-grey flex items-center">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          Mentoring Slots
                        </h4>
                        {mentorAvailability
                          .filter((s) => s.is_active)
                          .slice(0, 3)
                          .map((slot, index) => (
                            <motion.div
                              key={`mentor-${slot.availability_id}`}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-neutral-black text-sm">
                                    {
                                      [
                                        "Sunday",
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                      ][slot.day_of_week]
                                    }
                                  </p>
                                  <p className="text-xs text-neutral-grey">
                                    {slot.start_time} - {slot.end_time}
                                  </p>
                                </div>
                                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Mentoring
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    )}

                    {/* Tutor Availability */}
                    {tutorAvailability.filter((s) => s.is_active).length >
                      0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-neutral-grey flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Tutoring Slots
                        </h4>
                        {tutorAvailability
                          .filter((s) => s.is_active)
                          .slice(0, 3)
                          .map((slot, index) => (
                            <motion.div
                              key={`tutor-${slot.availability_id}`}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-neutral-black text-sm">
                                    {
                                      [
                                        "Sunday",
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                      ][slot.day_of_week]
                                    }
                                  </p>
                                  <p className="text-xs text-neutral-grey">
                                    {slot.start_time} - {slot.end_time}
                                  </p>
                                  {slot.subject_name && (
                                    <p className="text-xs text-green-700 font-medium">
                                      {slot.subject_name}
                                    </p>
                                  )}
                                </div>
                                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Tutoring
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    )}

                    {mentorAvailability.filter((s) => s.is_active).length ===
                      0 &&
                      tutorAvailability.filter((s) => s.is_active).length ===
                        0 && (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 text-neutral-light-grey mx-auto mb-4" />
                          <p className="text-neutral-grey">
                            No availability slots set
                          </p>
                          <p className="text-sm text-neutral-grey mt-1">
                            Go to Availability tab to set your schedule
                          </p>
                        </div>
                      )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Today's Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-primary-600" />
                  <span>Today's Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
                    <p className="text-neutral-grey mt-2">
                      Loading sessions...
                    </p>
                  </div>
                ) : (
                  <>
                    {events
                      .filter((event) => {
                        const eventDate = new Date(event.date);
                        const today = new Date();
                        return (
                          eventDate.toDateString() === today.toDateString()
                        );
                      })
                      .map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 border rounded-lg ${
                            event.type === "mentoring"
                              ? "border-blue-200 bg-blue-50"
                              : "border-green-200 bg-green-50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {event.type === "mentoring" ? (
                                  <GraduationCap className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <BookOpen className="w-4 h-4 text-green-600" />
                                )}
                                <h4 className="font-medium text-neutral-black">
                                  {event.title}
                                </h4>
                              </div>
                              <p className="text-sm text-neutral-grey">
                                {event.student}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                                event.status === "confirmed" ||
                                event.status === "scheduled" ||
                                event.status === "active"
                                  ? "bg-success/20 text-success"
                                  : event.status === "pending"
                                  ? "bg-warning/20 text-yellow-600"
                                  : event.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
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
                            <div
                              className={`text-xs font-medium ${
                                event.type === "mentoring"
                                  ? "text-blue-700"
                                  : "text-green-700"
                              }`}
                            >
                              {event.type === "mentoring"
                                ? "Mentoring"
                                : "Tutoring"}
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
                        <p className="text-neutral-grey">No sessions today</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Availability Management Tab */}
      {activeTab === "availability" && (
        <div className="space-y-6">
          {/* Mentoring Availability Section */}
          <div>
            {/* <h2 className="text-xl font-bold text-neutral-black mb-4">
              Mentoring Availability
            </h2> */}
            {/* <p className="text-neutral-grey mb-4">
              Manage your one-time mentoring session availability. Students can
              book individual sessions with you.
            </p> */}
            <AvailabilityManager mentorId={mentorId} />
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-light-grey my-8"></div>

          {/* Tutoring Availability Section */}
          <div>
            {/* <h2 className="text-xl font-bold text-neutral-black mb-4">
              Tutoring Availability
            </h2>
            <p className="text-neutral-grey mb-4">
              Manage your recurring weekly tutoring slots. Students can book
              regular tutoring sessions that repeat every week.
            </p> */}
            {tutorId ? (
              <TutoringAvailabilityManager tutorId={tutorId} />
            ) : (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mb-4"></div>
                <p className="text-neutral-grey">
                  Loading tutor information...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
